/**
 * LETARGIA CHARACTER CREAT - Pack Manager Validation (Part 3a)
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

export class PackManagerValidation {
  constructor(manager) {
    this._manager = manager;
  }

  _validateManifest(manifest) {
    const errors = [];
    const required = ['id', 'schemaVersion', 'apiVersion', 'name', 'pieces'];
    for (const field of required) {
      if (!manifest[field]) errors.push({ path: field, message: `Required field missing: ${field}` });
    }
    if (manifest.schemaVersion !== 1) {
      errors.push({ path: 'schemaVersion', message: `Unsupported schema version: ${manifest.schemaVersion}, expected 1` });
    }
    if (!Array.isArray(manifest.pieces)) {
      errors.push({ path: 'pieces', message: 'Pieces must be an array' });
    } else {
      for (let i = 0; i < manifest.pieces.length; i++) {
        errors.push(...this._validatePiece(manifest.pieces[i], i));
      }
    }
    if (manifest.bases) this._validateBases(manifest.bases, errors);
    if (manifest.poses) this._validatePoses(manifest.poses, errors);
    if (manifest.perspectives) this._validatePerspectives(manifest.perspectives, errors);
    if (manifest.categories) this._validateCategories(manifest.categories, errors);
    if (manifest.themes) this._validateThemes(manifest.themes, errors);
    if (manifest.palettes) this._validatePalettes(manifest.palettes, errors);
    if (manifest.translations) this._validateTranslations(manifest.translations, errors);
    return { valid: errors.length === 0, errors };
  }

  _validatePiece(piece, index) {
    const errors = [];
    const prefix = `pieces[${index}]`;
    if (!piece.id) errors.push({ path: `${prefix}.id`, message: 'Piece ID is required' });
    if (!piece.category) errors.push({ path: `${prefix}.category`, message: 'Category is required' });
    if (!Array.isArray(piece.themes) || piece.themes.length === 0) errors.push({ path: `${prefix}.themes`, message: 'At least one theme required' });
    if (!piece.compatibility) errors.push({ path: `${prefix}.compatibility`, message: 'Compatibility is required' });
    if (!Array.isArray(piece.layers) || piece.layers.length === 0) errors.push({ path: `${prefix}.layers`, message: 'At least one layer required' });
    if (!piece.thumbnail) errors.push({ path: `${prefix}.thumbnail`, message: 'Thumbnail is required' });
    if (typeof piece.drawOrder !== 'number') errors.push({ path: `${prefix}.drawOrder`, message: 'Draw order must be a number' });
    if (!piece.anchor) errors.push({ path: `${prefix}.anchor`, message: 'Anchor is required' });
    if (!piece.offset) errors.push({ path: `${prefix}.offset`, message: 'Offset is required' });
    if (typeof piece.scale !== 'number') errors.push({ path: `${prefix}.scale`, message: 'Scale must be a number' });
    if (typeof piece.rotation !== 'number') errors.push({ path: `${prefix}.rotation`, message: 'Rotation must be a number' });
    if (Array.isArray(piece.layers)) {
      for (let j = 0; j < piece.layers.length; j++) {
        const layer = piece.layers[j];
        if (!layer.id) errors.push({ path: `${prefix}.layers[${j}].id`, message: 'Layer ID required' });
        if (!layer.image) errors.push({ path: `${prefix}.layers[${j}].image`, message: 'Layer image required' });
        if (!layer.position) errors.push({ path: `${prefix}.layers[${j}].position`, message: 'Layer position required' });
      }
    }
    if (Array.isArray(piece.colorMasks)) {
      for (let j = 0; j < piece.colorMasks.length; j++) {
        const mask = piece.colorMasks[j];
        if (!mask.id) errors.push({ path: `${prefix}.colorMasks[${j}].id`, message: 'Color mask ID required' });
        if (!mask.name) errors.push({ path: `${prefix}.colorMasks[${j}].name`, message: 'Color mask name required' });
        if (!mask.layerId) errors.push({ path: `${prefix}.colorMasks[${j}].layerId`, message: 'Color mask layerId required' });
        if (!mask.color) errors.push({ path: `${prefix}.colorMasks[${j}].color`, message: 'Color mask color required' });
      }
    }
    return errors;
  }
}