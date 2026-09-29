/**
 * LETARGIA CHARACTER CREAT - Pack Manager Validation (Part 3b)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

export class PackManagerValidationExtra {
  constructor(manager) {
    this._manager = manager;
  }

  _validateBases(bases, errors) {
    for (const [id, base] of Object.entries(bases)) {
      if (!base.canvas || !base.anchors) errors.push({ path: `bases.${id}`, message: 'Base must have canvas and anchors' });
    }
  }

  _validatePoses(poses, errors) {
    for (const [id, pose] of Object.entries(poses)) {
      if (!pose.name) errors.push({ path: `poses.${id}.name`, message: 'Pose name required' });
    }
  }

  _validatePerspectives(perspectives, errors) {
    for (const [id, perspective] of Object.entries(perspectives)) {
      if (!perspective.name) errors.push({ path: `perspectives.${id}.name`, message: 'Perspective name required' });
    }
  }

  _validateCategories(categories, errors) {
    for (const [id, cat] of Object.entries(categories)) {
      if (!cat.name) errors.push({ path: `categories.${id}.name`, message: 'Category name required' });
    }
  }

  _validateThemes(themes, errors) {
    for (const [id, theme] of Object.entries(themes)) {
      if (!theme.name) errors.push({ path: `themes.${id}.name`, message: 'Theme name required' });
    }
  }

  _validatePalettes(palettes, errors) {
    for (const [id, palette] of Object.entries(palettes)) {
      if (!Array.isArray(palette.colors)) errors.push({ path: `palettes.${id}.colors`, message: 'Palette must have colors array' });
    }
  }

  _validateTranslations(translations, errors) {
    for (const [lang, dict] of Object.entries(translations)) {
      if (typeof dict !== 'object') errors.push({ path: `translations.${lang}`, message: 'Translations must be objects' });
    }
  }

  _validatePaths(manifest, packPath) {
    const checkPath = (path, field) => {
      if (path && path.startsWith('http')) return;
      if (path && path.startsWith('/')) throw this._createError('INVALID_PATH', `Absolute paths not allowed in ${field}: ${path}`);
      if (path && path.includes('..')) throw this._createError('INVALID_PATH', `Path traversal not allowed in ${field}: ${path}`);
    };
    if (manifest.pieces) {
      for (const piece of manifest.pieces) {
        checkPath(piece.thumbnail, `pieces.${piece.id}.thumbnail`);
        if (piece.layers) {
          for (const layer of piece.layers) checkPath(layer.image, `pieces.${piece.id}.layers.${layer.id}.image`);
        }
      }
    }
  }

  _checkDuplicateIds(manifest, packId) {
    const seen = new Set();
    if (manifest.pieces) {
      for (const piece of manifest.pieces) {
        const fullId = `${packId}:${piece.id}`;
        if (seen.has(fullId)) throw this._createError('DUPLICATE_PIECE_ID', `Duplicate piece ID: ${fullId}`);
        seen.add(fullId);
      }
    }
  }

  _createError(code, message) {
    const err = new Error(message);
    err.code = code;
    err.module = 'letargia-character-creat';
    return err;
  }

  _getAPIVersion() {
    return 1;
  }
}