/**
 * Export Manager for LETARGIA CHARACTER CREAT
 * Handles exporting compositions to various formats
 */

export class ExportManager {
  /**
   * Export composition as JSON string
   * @param {Object} composition - Composition object
   * @returns {string} JSON string
   */
  exportJSON(composition) {
    return JSON.stringify(composition, null, 2);
  }

  /**
   * Import composition from JSON string
   * @param {string} jsonString - JSON string
   * @returns {Object} Parsed composition
   */
  importJSON(jsonString) {
    try {
      const composition = JSON.parse(jsonString);
      // Basic validation
      if (!composition.version || !composition.base || !Array.isArray(composition.pieces)) {
        throw new Error("Invalid composition format");
      }
      return composition;
    } catch (error) {
      console.error("[LETARGIA] Import failed:", error);
      throw new Error(`Failed to import: ${error.message}`);
    }
  }

  /**
   * Export composition as downloadable file
   * @param {Object} composition - Composition object
   * @param {string} filename - Filename
   */
  downloadJSON(composition, filename) {
    const json = this.exportJSON(composition);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Export composition as PNG (requires canvas rendering)
   * @param {HTMLCanvasElement} canvas - Rendered canvas
   * @param {string} filename - Filename
   */
  downloadPNG(canvas, filename) {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  /**
   * Export composition as WebP
   * @param {HTMLCanvasElement} canvas - Rendered canvas
   * @param {string} filename - Filename
   * @param {number} quality - Quality 0-1
   */
  downloadWebP(canvas, filename, quality = 0.9) {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/webp", quality);
  }

  /**
   * Generate a shareable URL with composition data (for future use)
   * @param {Object} composition - Composition object
   * @returns {string} Data URL
   */
  generateDataURL(composition) {
    const json = this.exportJSON(composition);
    const compressed = btoa(json); // Simple base64 encoding
    return `data:application/json;base64,${compressed}`;
  }

  /**
   * Parse composition from data URL
   * @param {string} dataURL - Data URL
   * @returns {Object} Composition object
   */
  parseDataURL(dataURL) {
    try {
      const base64 = dataURL.split(",")[1];
      const json = atob(base64);
      return this.importJSON(json);
    } catch (error) {
      throw new Error(`Failed to parse data URL: ${error.message}`);
    }
  }
}