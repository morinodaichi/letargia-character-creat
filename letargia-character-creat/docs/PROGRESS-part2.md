# LETARGIA CHARACTER CREAT - Progress Tracking (Part 2)

## Stage 2: Enhanced Editor (Planned)

### TODO
- [ ] Base/Pose/Perspective selector in editor
- [ ] Layer list with drag-to-reorder
- [ ] Transform controls per piece (x, y, scale, rotation)
- [ ] Layer visibility toggles in composition panel
- [ ] Piece opacity/blend mode controls
- [ ] Advanced search with tag filters
- [ ] Compendium pack browser/manager
- [ ] Token image generation (canvas → PNG/WebP)
- [ ] Token integration (set as actor token)
- [ ] Batch export for token sets
- [ ] Keyboard shortcuts
- [ ] Undo/redo history
- [ ] Copy/paste pieces between actors

## Stage 3: Production Ready (Planned)

### TODO
- [ ] V1/V2 token sheet integration
- [ ] Community pack sharing format
- [ ] Advanced color masking (gradients, patterns, HSV)
- [ ] Animation preview for pose variations
- [ ] Performance optimization (virtualized lists, canvas caching)
- [ ] Accessibility improvements (ARIA, keyboard nav)
- [ ] Comprehensive test suite (unit + integration)
- [ ] CI/CD for automated testing
- [ ] Documentation website
- [ ] Example art packs (modern, medieval, futuristic)

## Testing Status

| Component | Unit Tests | Integration Tests | E2E Tests |
|-----------|------------|-------------------|-----------|
| Schema Validation | Manual | - | - |
| Composition Migration | Manual | - | - |
| Catalog Filtering | Manual | - | - |
| Editor Open/Close | Manual | - | - |
| Save/Load Round-trip | Manual | - | - |
| Permission Checks | Manual | - | - |
| Import/Export | Manual | - | - |
| i18n Parity | Manual | - | - |

## Pending Real-World Foundry Testing

The following require a running Foundry VTT v13 instance:

- [ ] Module loads without errors
- [ ] Settings appear in Configure Settings
- [ ] "CHARACTER CREAT" button appears on Actor sheets
- [ ] Button respects UPDATE permission
- [ ] Editor opens and renders correctly
- [ ] Pieces load from demo catalog
- [ ] Category tabs filter correctly
- [ ] Theme filter works
- [ ] Search works
- [ ] Click piece adds to composition
- [ ] Color pickers update preview
- [ ] Save persists to Actor flags
- [ ] Reload editor shows saved composition
- [ ] Export downloads valid JSON
- [ ] Import loads valid JSON
- [ ] Auto-save triggers correctly
- [ ] Concurrent modification dialog appears
- [ ] Context menu option works
- [ ] Module menu actor selector works
- [ ] Translations display correctly (EN/PT-BR)
- [ ] CSS loads without conflicts
- [ ] Responsive layout works at different widths
- [ ] No console errors/warnings