/**
 * Composition Migration Utilities
 */

export const FLAG_SCHEMA_VERSION = 1;

export function migrateComposition(data) {
  let migrated = { ...data };
  const fromVersion = data.version || 0;
  
  if (fromVersion < FLAG_SCHEMA_VERSION) {
    console.log(`[LETARGIA] Migrating composition from v${fromVersion} to v${FLAG_SCHEMA_VERSION}`);
    if (fromVersion === 0) {
      migrated.version = 1;
      migrated.base = migrated.base || {
        bodyId: "default-body",
        poseId: "default-pose",
        perspectiveId: "default-perspective",
        packId: "demo",
        packVersion: "1"
      };
      migrated.pieces = migrated.pieces || [];
      migrated.colors = migrated.colors || {};
      migrated.transforms = migrated.transforms || {
        globalScale: 1, globalRotation: 0, globalOffsetX: 0, globalOffsetY: 0
      };
      migrated.exportOptions = migrated.exportOptions || {
        format: "png", scale: 1, background: "transparent", includeMetadata: true
      };
      migrated.metadata = migrated.metadata || {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: "Unknown", name: "", description: ""
      };
    }
  }
  return migrated;
}