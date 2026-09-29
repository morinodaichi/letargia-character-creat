/**
 * Simple JSON Schema Validator (Lightweight Implementation)
 */

export class SimpleValidator {
  constructor(schema) {
    this.schema = schema;
    this.errors = [];
  }

  validate(data) {
    this.errors = [];
    this._validate(data, this.schema, "");
    return {
      valid: this.errors.length === 0,
      errors: this.errors
    };
  }

  _validate(data, schema, path) {
    if (!schema) return;

    // Type check
    if (schema.type) {
      const expectedType = schema.type;
      const actualType = Array.isArray(data) ? "array" : typeof data;
      
      if (expectedType !== actualType && !(expectedType === "integer" && actualType === "number" && Number.isInteger(data))) {
        this.errors.push({
          path,
          message: `Expected type ${expectedType}, got ${actualType}`,
          data
        });
        return;
      }
    }

    // Const check
    if (schema.const !== undefined && data !== schema.const) {
      this.errors.push({
        path,
        message: `Expected const value ${schema.const}, got ${data}`,
        data
      });
    }

    // Enum check
    if (schema.enum && !schema.enum.includes(data)) {
      this.errors.push({
        path,
        message: `Value ${data} not in allowed enum: ${schema.enum.join(", ")}`,
        data
      });
    }

    // String format checks
    if (schema.type === "string") {
      if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
        this.errors.push({
          path,
          message: `String does not match pattern ${schema.pattern}`,
          data
        });
      }
      if (schema.format === "uri" && data && !this._isValidUri(data)) {
        this.errors.push({
          path,
          message: `Invalid URI format`,
          data
        });
      }
      if (schema.format === "date-time" && data && !this._isValidDateTime(data)) {
        this.errors.push({
          path,
          message: `Invalid date-time format`,
          data
        });
      }
    }

    // Number range checks
    if (schema.type === "number" || schema.type === "integer") {
      if (schema.minimum !== undefined && data < schema.minimum) {
        this.errors.push({
          path,
          message: `Value ${data} is less than minimum ${schema.minimum}`,
          data
        });
      }
      if (schema.maximum !== undefined && data > schema.maximum) {
        this.errors.push({
          path,
          message: `Value ${data} is greater than maximum ${schema.maximum}`,
          data
        });
      }
    }

    // Required properties
    if (schema.required && typeof data === "object" && data !== null) {
      for (const req of schema.required) {
        if (!(req in data)) {
          this.errors.push({
            path: path ? `${path}.${req}` : req,
            message: `Required property '${req}' is missing`,
            data
          });
        }
      }
    }

    // Properties validation
    if (schema.properties && typeof data === "object" && data !== null) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          this._validate(data[key], propSchema, path ? `${path}.${key}` : key);
        } else if (propSchema.default !== undefined) {
          data[key] = propSchema.default;
        }
      }
    }

    // Array items validation
    if (schema.items && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        this._validate(data[i], schema.items, `${path}[${i}]`);
      }
    }

    // Additional properties check
    if (schema.additionalProperties === false && typeof data === "object" && data !== null) {
      const allowedKeys = new Set([
        ...Object.keys(schema.properties || {}),
        ...Object.keys(schema.required || [])
      ]);
      for (const key of Object.keys(data)) {
        if (!allowedKeys.has(key)) {
          this.errors.push({
            path: path ? `${path}.${key}` : key,
            message: `Additional property '${key}' is not allowed`,
            data: data[key]
          });
        }
      }
    }

    // $defs resolution (simplified)
    if (schema.$ref) {
      const refPath = schema.$ref.replace("#/$defs/", "");
      const defSchema = this.schema.$defs?.[refPath];
      if (defSchema) {
        this._validate(data, defSchema, path);
      }
    }
  }

  _isValidUri(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  _isValidDateTime(str) {
    const date = new Date(str);
    return date instanceof Date && !isNaN(date) && str.includes("T");
  }
}