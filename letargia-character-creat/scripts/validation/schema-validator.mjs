/**
 * Schema Validator for LETARGIA CHARACTER CREAT
 * Validates packs, bases, pieces, and compositions against schemas
 */

import { getSchema, getLatestSchemaVersion } from "../../schemas/index.mjs";
import { BASE_SCHEMA_V1 } from "../../schemas/base-schema.mjs";
import { PIECE_SCHEMA_V1 } from "../../schemas/piece-schema.mjs";
import { COMPOSITION_SCHEMA_V1 } from "../../schemas/composition-schema.mjs";
import { SimpleValidator } from "./simple-validator.mjs";

/**
 * Main Schema Validator Class
 */
export class SchemaValidator {
  constructor() {
    this._validators = new Map();
    this._initValidators();
  }

  _initValidators() {
    // Pack validator
    this._validators.set("pack:1", new SimpleValidator(getSchema("pack", 1)));
    
    // Base validator
    this._validators.set("base:1", new SimpleValidator(BASE_SCHEMA_V1));
    
    // Piece validator
    this._validators.set("piece:1", new SimpleValidator(PIECE_SCHEMA_V1));
    
    // Composition validator
    this._validators.set("composition:1", new SimpleValidator(COMPOSITION_SCHEMA_V1));
  }

  /**
   * Get validator for a schema type and version
   * @param {string} type - Schema type
   * @param {number} version - Schema version
   * @returns {SimpleValidator}
   */
  _getValidator(type, version) {
    const key = `${type}:${version}`;
    let validator = this._validators.get(key);
    
    if (!validator) {
      const schema = getSchema(type, version);
      if (schema) {
        validator = new SimpleValidator(schema);
        this._validators.set(key, validator);
      }
    }
    
    return validator;
  }

  /**
   * Validate a pack
   * @param {Object} pack - Pack data
   * @returns {Object} Validation result
   */
  validatePack(pack) {
    const version = pack?.schemaVersion || getLatestSchemaVersion("pack");
    const validator = this._getValidator("pack", version);
    
    if (!validator) {
      return { valid: false, errors: [{ message: `No validator for pack schema v${version}` }] };
    }
    
    return validator.validate(pack);
  }

  /**
   * Validate a base
   * @param {Object} base - Base data
   * @returns {Object} Validation result
   */
  validateBase(base) {
    const version = base?.schemaVersion || getLatestSchemaVersion("base");
    const validator = this._getValidator("base", version);
    
    if (!validator) {
      return { valid: false, errors: [{ message: `No validator for base schema v${version}` }] };
    }
    
    return validator.validate(base);
  }

  /**
   * Validate a piece
   * @param {Object} piece - Piece data
   * @returns {Object} Validation result
   */
  validatePiece(piece) {
    const version = piece?.schemaVersion || getLatestSchemaVersion("piece");
    const validator = this._getValidator("piece", version);
    
    if (!validator) {
      return { valid: false, errors: [{ message: `No validator for piece schema v${version}` }] };
    }
    
    return validator.validate(piece);
  }

  /**
   * Validate a composition
   * @param {Object} composition - Composition data
   * @returns {Object} Validation result
   */
  validateComposition(composition) {
    const version = composition?.version || getLatestSchemaVersion("composition");
    const validator = this._getValidator("composition", version);
    
    if (!validator) {
      return { valid: false, errors: [{ message: `No validator for composition schema v${version}` }] };
    }
    
    return validator.validate(composition);
  }

  /**
   * Validate any data against a schema type
   * @param {string} type - Schema type
   * @param {Object} data - Data to validate
   * @param {number} version - Schema version (optional, uses latest)
   * @returns {Object} Validation result
   */
  validate(type, data, version = null) {
    const schemaVersion = version || getLatestSchemaVersion(type);
    const validator = this._getValidator(type, schemaVersion);
    
    if (!validator) {
      return { valid: false, errors: [{ message: `No validator for ${type} schema v${schemaVersion}` }] };
    }
    
    return validator.validate(data);
  }
}