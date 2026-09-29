/**
 * Auto-save Manager for Compositions
 */

import { getSetting } from "../settings.mjs";

export class AutoSaveManager {
  constructor() {
    this._timers = new Map();
  }

  setup(actorId, saveCallback) {
    const interval = getSetting("autoSaveInterval") * 1000;
    if (interval <= 0) return;
    
    this.clear(actorId);
    
    const timer = setInterval(async () => {
      await saveCallback(actorId);
    }, interval);
    
    this._timers.set(actorId, timer);
  }

  clear(actorId) {
    const timer = this._timers.get(actorId);
    if (timer) { clearInterval(timer); this._timers.delete(actorId); }
  }

  clearAll() {
    for (const timer of this._timers.values()) {
      clearInterval(timer);
    }
    this._timers.clear();
  }

  restartAll(actorIds, saveCallback) {
    this.clearAll();
    for (const actorId of actorIds) {
      this.setup(actorId, saveCallback);
    }
  }
}