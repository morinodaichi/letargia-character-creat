/**
 * Actor Selector for LETARGIA CHARACTER CREAT
 * Dialog to select an actor when multiple are available
 */

import { MODULE_ID } from "../letargia-character-creat.mjs";
import { getApi } from "../letargia-character-creat.mjs";

export class ActorSelector extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "letargia-actor-selector",
    window: { title: "LETARGIA.CHARACTER_CREAT.Dialogs.SelectActor", icon: "fas fa-users", resizable: false },
    position: { width: 400, height: 500 },
    tag: "div",
    classes: ["letargia-character-creat", "actor-selector"]
  };

  constructor(actors, options = {}) {
    super(options);
    this.actors = actors;
  }

  static get template() {
    return `modules/${MODULE_ID}/templates/actor-selector.hbs`;
  }

  async _prepareContext() {
    return {
      actors: this.actors.map(a => ({
        id: a.id,
        name: a.name,
        img: a.img,
        type: a.type
      })),
      localize: (key) => game.i18n.localize(key)
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    
    html.querySelectorAll(".letargia-actor-option").forEach(option => {
      option.addEventListener("click", async (ev) => {
        const actorId = ev.currentTarget.dataset.actorId;
        const actor = game.actors.get(actorId);
        if (actor) {
          const api = getApi();
          if (api) await api.openEditor(actor);
          await this.close();
        }
      });
    });
    
    html.querySelector(".letargia-btn-cancel")?.addEventListener("click", () => this.close());
  }
}