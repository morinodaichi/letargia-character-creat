/**
 * Character Editor - Preview and Actions
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

export function renderPreview(editor, html) {
  const canvas = html.querySelector(".letargia-preview-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Grid
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < width; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  
  // Draw pieces in drawOrder
  const pieces = [...editor.composition.pieces].sort((a, b) => {
    const pieceA = editor.catalog.getPiece(`${a.packId}:${a.pieceId}`);
    const pieceB = editor.catalog.getPiece(`${b.packId}:${b.pieceId}`);
    return (pieceA?.drawOrder || 0) - (pieceB?.drawOrder || 0);
  });
  
  for (const compPiece of pieces) {
    if (!compPiece.enabled) continue;
    const piece = editor.catalog.getPiece(`${compPiece.packId}:${compPiece.pieceId}`);
    if (!piece) continue;
    
    for (const layer of piece.layers) {
      const compLayer = compPiece.layers.find(l => l.layerId === layer.id);
      if (!compLayer?.enabled) continue;
      
      const img = new Image();
      img.src = layer.image;
      img.onload = () => {
        ctx.globalAlpha = compLayer.opacity * (layer.opacity || 1);
        ctx.globalCompositeOperation = compLayer.blendMode || layer.blendMode || "source-over";
        
        const x = (layer.position?.x || 0) + (compPiece.transform?.x || 0);
        const y = (layer.position?.y || 0) + (compPiece.transform?.y || 0);
        const scale = (piece.scale || 1) * (compPiece.transform?.scale || 1);
        
        ctx.save();
        ctx.translate(width/2 + x, height/2 + y);
        ctx.rotate(compPiece.transform?.rotation || 0);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width/2, -img.height/2);
        ctx.restore();
      };
    }
  }
  
  // Center crosshair
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(width/2 - 20, height/2); ctx.lineTo(width/2 + 20, height/2);
  ctx.moveTo(width/2, height/2 - 20); ctx.lineTo(width/2, height/2 + 20);
  ctx.stroke(); ctx.setLineDash([]);
}

export async function onSave(editor) {
  const success = await editor.compositionManager.saveComposition(editor.actor, editor.composition);
  if (success) {
    ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Saved"));
    await editor.render();
  }
}

export async function onCancel(editor) {
  if (editor.compositionManager.isDirty(editor.actor.id)) {
    const confirm = window.confirm(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Dialogs.DiscardChanges"));
    if (!confirm) return;
  }
  editor.composition = await editor.compositionManager.loadComposition(editor.actor);
  await editor.render();
}

export function onExport(editor) {
  const json = editor.compositionManager.exportComposition(editor.composition);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${editor.actor.name}-character-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Exported"));
}

export async function onImport(editor) {
  const input = document.createElement("input");
  input.type = "file"; input.accept = ".json";
  input.onchange = async (event) => {
    const file = event.target.files[0]; if (!file) return;
    const text = await file.text();
    try {
      const imported = editor.compositionManager.importComposition(text);
      editor.composition = imported;
      editor.compositionManager.updateComposition(editor.actor.id, () => imported);
      await editor.render();
      ui.notifications.info(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.Imported"));
    } catch (error) {
      ui.notifications.error(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Notifications.ImportFailed"));
    }
  };
  input.click();
}

export async function onReset(editor, html) {
  const confirm = window.confirm(game.i18n.localize("LETARGIA.CHARACTER_CREAT.Dialogs.ResetConfirm"));
  if (!confirm) return;
  editor.composition = await editor.compositionManager.createComposition(editor.actor);
  await editor.render();
}

export function setupCloseWarning(editor) {
  editor._closeWarning = () => {
    if (editor.compositionManager.isDirty(editor.actor.id)) {
      return game.i18n.localize("LETARGIA.CHARACTER_CREAT.Dialogs.UnsavedChanges");
    }
  };
  window.addEventListener("beforeunload", editor._closeWarning);
}

export async function closeEditor(editor) {
  window.removeEventListener("beforeunload", editor._closeWarning);
  return editor.close();
}