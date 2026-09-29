/**
 * History Manager for LETARGIA CHARACTER CREAT
 * Implements undo/redo functionality for composition editing
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";

/**
 * History Manager class
 */
export class HistoryManager {
  constructor(composition, maxHistorySize = 50) {
    this.composition = composition;
    this.maxHistorySize = maxHistorySize;
    this.past = [];
    this.future = [];
    this._isRestoring = false;
    this._lastSnapshot = null;
  }

  /**
   * Initialize history from composition
   */
  initialize() {
    this.past = this.composition.history?.past || [];
    this.future = this.composition.history?.future || [];
    this.maxHistorySize = this.composition.history?.maxHistorySize || 50;
    this._pruneHistory();
  }

  /**
   * Save current composition state to history
   * @param {string} action - Description of the action
   */
  save(action = "edit") {
    if (this._isRestoring) return;
    
    const snapshot = this._createSnapshot(action);
    
    // Skip if no meaningful change
    if (this._lastSnapshot && this._snapshotsEqual(snapshot, this._lastSnapshot)) {
      return;
    }
    
    this.past.push(snapshot);
    this._lastSnapshot = snapshot;
    this.future = []; // Clear future on new action
    this._pruneHistory();
    this._syncToComposition();
  }

  /**
   * Undo last action
   * @returns {Object|null} Restored composition state or null if nothing to undo
   */
  undo() {
    if (this.past.length === 0) return null;
    
    this._isRestoring = true;
    const snapshot = this.past.pop();
    this.future.unshift(this._createSnapshot("redo"));
    
    this._applySnapshot(snapshot);
    this._isRestoring = false;
    this._syncToComposition();
    
    return { composition: this.composition, action: snapshot.action };
  }

  /**
   * Redo last undone action
   * @returns {Object|null} Restored composition state or null if nothing to redo
   */
  redo() {
    if (this.future.length === 0) return null;
    
    this._isRestoring = true;
    const snapshot = this.future.shift();
    this.past.push(this._createSnapshot("undo"));
    
    this._applySnapshot(snapshot);
    this._isRestoring = false;
    this._syncToComposition();
    
    return { composition: this.composition, action: snapshot.action };
  }

  /**
   * Check if undo is available
   */
  canUndo() { return this.past.length > 0; }

  /**
   * Check if redo is available
   */
  canRedo() { return this.future.length > 0; }

  /**
   * Clear history
   */
  clear() {
    this.past = [];
    this.future = [];
    this._lastSnapshot = null;
    this._syncToComposition();
  }

  /**
   * Get history info for UI
   */
  getHistoryInfo() {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
      lastAction: this.past[this.past.length - 1]?.action || null,
      nextAction: this.future[0]?.action || null
    };
  }

  /**
   * Create a snapshot of current composition
   */
  _createSnapshot(action) {
    return {
      action,
      timestamp: Date.now(),
      pieces: JSON.parse(JSON.stringify(this.composition.pieces)),
      colors: JSON.parse(JSON.stringify(this.composition.colors)),
      transforms: JSON.parse(JSON.stringify(this.composition.transforms)),
      base: JSON.parse(JSON.stringify(this.composition.base)),
      exportOptions: JSON.parse(JSON.stringify(this.composition.exportOptions))
    };
  }

  /**
   * Apply a snapshot to the composition
   */
  _applySnapshot(snapshot) {
    this.composition.pieces = JSON.parse(JSON.stringify(snapshot.pieces));
    this.composition.colors = JSON.parse(JSON.stringify(snapshot.colors));
    this.composition.transforms = JSON.parse(JSON.stringify(snapshot.transforms));
    this.composition.base = JSON.parse(JSON.stringify(snapshot.base));
    this.composition.exportOptions = JSON.parse(JSON.stringify(snapshot.exportOptions));
    this.composition.metadata.updatedAt = new Date().toISOString();
  }

  /**
   * Compare two snapshots for equality
   */
  _snapshotsEqual(a, b) {
    return JSON.stringify(a.pieces) === JSON.stringify(b.pieces) &&
           JSON.stringify(a.colors) === JSON.stringify(b.colors) &&
           JSON.stringify(a.transforms) === JSON.stringify(b.transforms);
  }

  /**
   * Prune history to max size
   */
  _pruneHistory() {
    while (this.past.length > this.maxHistorySize) {
      this.past.shift();
    }
    while (this.future.length > this.maxHistorySize) {
      this.future.shift();
    }
  }

  /**
   * Sync history to composition object
   */
  _syncToComposition() {
    if (!this.composition.history) {
      this.composition.history = { past: [], future: [], maxHistorySize: this.maxHistorySize };
    }
    this.composition.history.past = this.past;
    this.composition.history.future = this.future;
    this.composition.history.maxHistorySize = this.maxHistorySize;
  }
}