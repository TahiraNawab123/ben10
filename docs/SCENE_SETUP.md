# Scene setup checklist

Detailed version of "Getting started" in the main README, written as a
literal checklist you can follow inside the Unity Editor.

## 1. Boot scene
- [ ] Create scene `Assets/Scenes/Boot.unity`
- [ ] Create empty GameObject `~Managers`
- [ ] Add component `GameManager`
- [ ] Add component `AlienUnlockManager`, assign its `database` field to
      `Assets/ScriptableObjects/Aliens/AlienDatabase.asset`
- [ ] Add a one-line script (or just a build settings scene order) that loads
      the `Menu` scene after `Start()` — simplest option: put Boot and Menu
      content in the same scene for now, and split later once you're
      comfortable with multi-scene loading.

## 2. Menu scene (or Menu section of Boot scene)
- [ ] Canvas `MenuCanvas` → panel `MainMenuPanel` with a Play button →
      add `MainMenuUI`, assign `gameManager`, wire the Play button's
      `OnClick` to `MainMenuUI.OnPlayPressed`.
- [ ] Panel `CharacterSelectPanel` (inactive by default) →
      add `CharacterSelectUI`, assign `unlockManager`, `gameManager`,
      `slotContainer` (an empty RectTransform with a Grid/Horizontal Layout
      Group), `slotPrefab` (see below), `unlockNextButton`,
      `unlockNextCostText`, `playButton`.
- [ ] Build `AlienSlotUI` prefab: Image (portrait) + child Image (lock icon,
      call it `lockOverlay`) + child Image (`selectedHighlight`, a colored
      border) + TMP text (`nameText`) + a Button on the root. Add the
      `AlienSlotUI` component and assign all the above fields, then drag the
      prefab into `CharacterSelectUI.slotPrefab`.
- [ ] Show/hide `MainMenuPanel` vs `CharacterSelectPanel` based on
      `GameManager.CurrentState` (simplest: a tiny script subscribing to
      `OnStateChanged` and toggling `.SetActive()` on each panel — you can
      ask your AI assistant to write this exact glue script once the panels
      exist, since it depends on your specific panel names).

## 3. Gameplay scene
- [ ] Create scene `Assets/Scenes/Gameplay.unity`
- [ ] Player GameObject: `CharacterController` + `PlayerController` +
      `SwipeInput` + `AbilityRuntime`. Tag it `Player` for convenience.
- [ ] Empty GameObject `ChunkSpawner`, add `ChunkSpawner` component, assign
      `player` (the Player transform) and `chunkPrefabs` (see step 4).
- [ ] Main Camera: add `CameraFollow`, assign `target` = Player transform.
- [ ] Empty GameObject `RunBootstrapper`, add component, assign `player`.
- [ ] HUD Canvas with coin/distance TMP texts + `HUDManager` component,
      fields assigned.
- [ ] Game over panel (inactive by default) with `GameOverUI` component
      wired the same way as above.

## 4. Track chunk prefabs
- [ ] Model or block out a ~20m-long ground piece (3 lanes wide — use
      `laneWidth` from `PlayerController`, default 2.5m spacing, so lanes sit
      at x = -2.5, 0, +2.5).
- [ ] Place a few obstacle objects (each with a Collider set to `Is Trigger`
      and an `Obstacle` component) and coin objects (Collider `Is Trigger` +
      `Collectible` component) as children.
- [ ] Drag the whole ground+obstacles+coins hierarchy into
      `Assets/Prefabs/` to make it a prefab.
- [ ] Repeat for 3-5 variations of differing difficulty, assign them all to
      `ChunkSpawner.chunkPrefabs`.

## 5. Build settings
- [ ] File > Build Settings > switch platform to Android
- [ ] Add your scenes in the right order (Boot/Menu first, Gameplay second)
- [ ] Player Settings > set package name, minimum API level, orientation
      (Portrait is standard for this genre)
