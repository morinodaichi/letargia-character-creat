# LETARGIA CHARACTER CREAT - Pack Guide (Part 2)

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique within pack |
| `category` | string | ✅ | Category ID |
| `themes` | string[] | ✅ | At least one theme |
| `compatibility` | object | ✅ | Body/pose/perspective |
| `layers` | array | ✅ | At least one layer |
| `thumbnail` | string | ✅ | Thumbnail path |
| `drawOrder` | integer | | Render order (default: 0) |
| `anchor` | object | ✅ | Normalized (0-1) |
| `offset` | object | | Position offset |
| `scale` | number | | Scale factor (default: 1) |
| `rotation` | number | | Rotation in radians (default: 0) |
| `slots` | string[] | | Equipment slots |
| `colorMasks` | array | | Recolorable areas |
| `metadata` | object | | Extended metadata |

### Compatibility

```json
{
  "compatibility": {
    "bodies": ["default-body", "muscular-body"],
    "poses": ["default-pose", "action-pose"],
    "perspectives": ["default-perspective"]
  }
}
```

Use `"*"` for universal compatibility.

## Categories

Define custom categories in manifest:

```json
"categories": {
  "my-category": {
    "name": { "pt-BR": "Minha Categoria", "en": "My Category" },
    "description": { "pt-BR": "Descrição", "en": "Description" }
  }
}
```

Then reference in pieces: `"category": "my-category"`

## Themes

```json
"themes": {
  "my-theme": {
    "name": { "pt-BR": "Meu Tema", "en": "My Theme" },
    "description": { "pt-BR": "Descrição", "en": "Description" }
  }
}
```

Reference in pieces: `"themes": ["my-theme"]`

## Bases, Poses, Perspectives

```json
"bases": {
  "my-body": {
    "id": "my-body",
    "name": { "pt-BR": "Meu Corpo", "en": "My Body" },
    "canvas": { "width": 1024, "height": 1024 },
    "anchors": {
      "head": { "x": 0.5, "y": 0.15 },
      "torso": { "x": 0.5, "y": 0.4 },
      "leftArm": { "x": 0.2, "y": 0.55 },
      "rightArm": { "x": 0.8, "y": 0.55 },
      "leftLeg": { "x": 0.35, "y": 0.85 },
      "rightLeg": { "x": 0.65, "y": 0.85 }
    }
  }
}
```

## Color Palettes

```json
"palettes": {
  "my-palette": {
    "name": { "pt-BR": "Minha Paleta", "en": "My Palette" },
    "colors": ["#FF0000", "#00FF00", "#0000FF"]
  }
}
```

## Translations

```json
"translations": {
  "pt-BR": { "my.key": "Valor PT" },
  "en": { "my.key": "EN Value" }
}
```

Referenced in piece metadata: `"metadata": { "name": { "pt-BR": "...", "en": "..." } }`

## Path Conventions

- **Relative paths only**: `assets/image.png`
- **No absolute paths**: ❌ `/assets/image.png`
- **No traversal**: ❌ `../image.png`
- **External URLs**: Allowed for images (`https://...`)

## Distribution

### As Foundry Module
1. Create module folder: `my-pack-module/`
2. `module.json` with `"system": "letargia-character-creat"`
3. Pack files in `packs/my-pack/`
4. Zip as `my-pack-module.zip`

### As Standalone Pack (for import)
1. Zip pack folder: `my-pack.zip`
2. Distribute zip file
3. Users import via Asset Panel (GM)

## Validation Checklist

Before releasing:

- [ ] Manifest validates against schema
- [ ] All piece IDs unique within pack
- [ ] All image paths exist and are valid
- [ ] Thumbnails exist and match pieces
- [ ] Color masks reference valid layer IDs
- [ ] Compatibility references valid bodies/poses/perspectives
- [ ] Categories/themes defined if referenced
- [ ] Translations cover all user-facing strings
- [ ] Pack loads without errors in Foundry
- [ ] Pieces render correctly in editor
- [ ] Color masks work correctly
- [ ] Layer ordering works as expected

## Versioning

- Use **Semantic Versioning** (MAJOR.MINOR.PATCH)
- Increment MAJOR for breaking changes
- Increment MINOR for new pieces/features
- Increment PATCH for fixes
- Update `apiVersion` if requiring new API features

## Licensing

- Use SPDX license identifiers (MIT, CC-BY-4.0, etc.)
- Include license file in pack
- Respect asset licenses (no copyrighted characters)
- Document attribution requirements

## Example Packs

See `packs/letargia-demo-pack/` in the module for a working example.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pack not loading | Check manifest syntax, schema version |
| Pieces not appearing | Check category/theme IDs, compatibility |
| Images not loading | Verify paths, file existence, CORS |
| Color masks not working | Check layerId matches, maskType |
| Wrong layer order | Check drawOrder, zOffset |
| Pack not showing in list | Check enabled flag, pack registration |