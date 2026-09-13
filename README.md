# Ben10 

An endless-runner mobile game (Subway Surfers-style lane running, jumping, and sliding) built around a **sequential character-unlock system**: you start with one runnable form, and unlock the next of 10 total characters as you earn coins by playing. Built in Unity for Android (and portable to iOS later).

> **IP note:** This project is themed around a Ben 10-style "10 unlockable
> alien transformations" concept, but the codebase and assets in this repo do
> **not** use Cartoon Network's copyrighted character names/art. The 10 roster
> slots are generic power-archetypes (Speed, Flight, Magnet, Giant, Shield,
> etc.) so the project is safe to publish commercially once you add your own
> or licensed artwork. See [Legal & IP](#legal--ip) before you publish.

---

## Table of contents
- [Tech stack](#tech-stack)
- [Project status](#project-status)
- [Architecture overview](#architecture-overview)
- [Folder structure](#folder-structure)
- [Getting started](#getting-started)
- [How the unlock system works](#how-the-unlock-system-works)
- [Adding your own art](#adding-your-own-art)
- [Roadmap](#roadmap)
- [Publishing to Google Play](#publishing-to-google-play)
- [Legal & IP](#legal--ip)

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Engine | **Unity 2022 LTS** (2022.3.x) | Long-term-support version, mature 3D/2D pipeline, best-documented path from editor to a signed Android App Bundle. |
| Language | **C#** | Matches your existing OOP/DSA background directly. |
| Render pipeline | **URP (Universal Render Pipeline)** | Lightweight, mobile-optimized, good default for a stylized runner. |
| Physics/movement | `CharacterController` (kinematic) | Predictable, jitter-free lane movement — the standard choice for runner games over full rigidbody physics. |
| UI | **Unity UI (uGUI) + TextMeshPro** | Native to Unity, no extra packages, fine for menus/HUD at this scale. |
| Persistence | Local JSON file (`Application.persistentDataPath`) via a custom `SaveSystem` | Simple, dependency-free, easy to later swap for cloud save. |
| Data authoring | **ScriptableObjects** (`AlienData`, `AlienDatabase`) | Lets you add/tune the 10 characters from the Inspector without touching code. |
| Input | Unity legacy `Input` (touch + mouse-swipe fallback for editor testing) | Simplest reliable option for swipe gestures; can be swapped for the new Input System later if you want rebindable controls. |
| Version control | Git + [Git LFS](https://git-lfs.com/) recommended once real art/audio assets are added | Unity binary assets (textures, models, `.unity` scenes) get large fast. |
| Target platform | Android (API 24+ recommended), portable to iOS | Unity's Android Build Support module handles the `.aab` export Google Play requires. |
| Optional later additions | Google Play Games Services (leaderboards/achievements), AdMob (rewarded ads for coins/revives), Firebase Analytics/Crashlytics | Common monetization/analytics stack for this genre — not wired in yet, added as a later milestone so the core game ships clean first. |

---

## Project status

This repository previously contained no game code (just a placeholder
README). This commit adds a **from-scratch Unity project scaffold**: all core
gameplay systems as C# scripts, ScriptableObject-driven alien data, and a
generator tool for the starter roster. What's **not** included yet, because it
has to be built inside the Unity Editor (scenes/prefabs are binary and don't
translate well to hand-written files):

- The actual `.unity` scenes (Boot, Menu, Gameplay)
- Prefabs (player, obstacles, coins, track chunks, UI screens)
- Art, animations, and audio

The [Getting started](#getting-started) section walks through wiring these up
inside the Editor using the scripts already here.

---

## Architecture overview

```
GameManager (persistent)          <- run state machine, coins, distance
AlienUnlockManager (persistent)   <- sequential unlock logic, current selection
        |
        v
AlienDatabase (ScriptableObject)  <- ordered list of AlienData
        |
        v
AlienData (ScriptableObject) x10  <- per-character stats/art/ability

Gameplay scene:
  RunBootstrapper  -- applies AlienUnlockManager.Selected to --> PlayerController
  PlayerController -- lane switch / jump / slide / forward speed
  SwipeInput        -- fires swipe events, decoupled from movement
  AbilityRuntime    -- applies magnet/smash abilities each frame
  ChunkSpawner      -- spawns/recycles pre-built track chunk prefabs
  Obstacle / Collectible -- trigger colliders reporting back to PlayerController/GameManager
  CameraFollow      -- chase camera

UI:
  MainMenuUI -> CharacterSelectUI (AlienSlotUI per character) -> HUDManager (during run) -> GameOverUI
```

Design principle used throughout: **systems talk through events, not direct
polling**, so you can swap/extend pieces (e.g. replace SaveSystem with a cloud
backend, or add a new AbilityType) without rewriting everything around it.

---

## Folder structure

```
Assets/
  Scripts/
    Core/       GameManager, SaveSystem, RunBootstrapper
    Player/     PlayerController, SwipeInput
    Aliens/     AlienData, AlienDatabase, AlienUnlockManager
    World/      Obstacle, Collectible, ChunkSpawner, CameraFollow
    UI/         MainMenuUI, CharacterSelectUI, AlienSlotUI, HUDManager, GameOverUI
    PowerUps/   AbilityRuntime
    Editor/     AlienRosterGenerator (menu tool, editor-only)
  ScriptableObjects/Aliens/   AlienData + AlienDatabase assets live here (generated)
  Prefabs/      (empty - add player, obstacle, coin, chunk, UI prefabs here)
  Scenes/       (empty - add Boot/Menu/Gameplay scenes here)
  Art/          Characters/ Environment/ UI/  (empty - drop your art here)
  Audio/        (empty)
docs/           extra design notes
```

---

## Getting started

1. **Install Unity Hub** and Unity **2022.3 LTS** (any recent patch version)
   with the **Android Build Support** module (includes SDK & NDK) checked
   during install.
2. Create a new **3D (URP)** project in Unity Hub, then copy the contents of
   this repo's `Assets/` folder into your new project's `Assets/` folder
   (or open this repo's folder directly as the Unity project if you `git init`
   it as one from the start).
3. In Unity, run **Ben10Runner > Generate Starter Alien Roster** from the menu
   bar. This creates `AlienDatabase.asset` and 10 `AlienData` assets under
   `Assets/ScriptableObjects/Aliens/` with placeholder stats already filled in.
4. Build three scenes:
   - **Boot** — an empty GameObject with `GameManager` and
     `AlienUnlockManager` components (assign the generated `AlienDatabase`),
     set to `DontDestroyOnLoad` (already handled in `Awake()`), then loads
     into Menu.
   - **Menu** — Canvas with `MainMenuUI`, and a second Canvas/panel with
     `CharacterSelectUI` + a grid of `AlienSlotUI` prefab instances (bind
     `slotPrefab` to a small prefab with an Image, lock overlay, and TMP text).
   - **Gameplay** — the player GameObject (`CharacterController` +
     `PlayerController` + `AbilityRuntime` + `SwipeInput`), a `ChunkSpawner`
     with a few hand-built track chunk prefabs (ground + obstacles + coins as
     children, each with `Obstacle`/`Collectible` components and trigger
     colliders), a `CameraFollow` on the Main Camera, `RunBootstrapper` wired
     to the player, and a HUD Canvas with `HUDManager`.
5. Build 3-5 obstacle prefabs and a coin prefab, arrange a handful into 2-3
   track "chunk" prefabs (~20m each, matching `ChunkSpawner.chunkLength`), and
   assign them to `ChunkSpawner.chunkPrefabs`.
6. Press Play. Use the mouse (click-drag) in the Editor to simulate swipes;
   `SwipeInput` auto-switches to real touch input on-device.

If any of steps 3-6 feel unfamiliar, that's expected at this stage — those are
exactly the kind of "wire this component to that field in the Inspector"
steps that are easiest to do interactively with AI help open next to the
Unity Editor, since it's very visual/GUI-driven work.

---

## How the unlock system works

- `AlienDatabase` holds all 10 `AlienData` assets, ordered by `unlockOrder`
  (0 = starter, always unlocked).
- `AlienUnlockManager.TryUnlockNext()` looks at the **next locked alien in
  order** and spends coins from the persistent wallet (`GameManager.totalCoins`,
  backed by `SaveSystem`) — you can't unlock alien #5 before #4, matching your
  "unlock one by one" requirement.
- Coins persist across runs (they're added to the wallet as you collect them
  mid-run via `Collectible` → `GameManager.AddCoins`), so progress toward the
  next unlock is never lost even if a run ends early.
- Once unlocked, an alien stays unlocked forever (`SaveSystem.Data.unlockedAlienIds`)
  and can be freely selected from `CharacterSelectUI` for any future run.
- Each alien can carry a passive gameplay effect (`AbilityType`): speed boost,
  higher jump, coin magnet, extra shield, or obstacle-smashing — applied via
  `PlayerController`'s multipliers and `AbilityRuntime`. Add new ability types
  as you design more characters.

---

## Adding your own art

Every character is just a `AlienData` asset with a `portrait` (2D sprite, for
the select screen) and `runnerPrefab` (the 3D model or animated sprite that
gets instantiated onto the player at runtime via `PlayerController.SwapVisual`).
Drop new art into `Assets/Art/Characters/`, make a prefab out of it, and drag
it into the corresponding `AlienData` asset's `runnerPrefab` field — no code
changes needed. Same pattern for obstacles/coins/environment art under
`Assets/Art/Environment/` and `Assets/Art/UI/`.

---

## Roadmap

- [ ] Build out Boot/Menu/Gameplay scenes and core prefabs in the Editor
- [ ] Replace placeholder art with real character/environment art
- [ ] Add animations (run/jump/slide/death) via Animator Controllers per alien
- [ ] Add sound effects and background music
- [ ] Daily rewards / missions to accelerate coin earning
- [ ] Leaderboards via Google Play Games Services
- [ ] Rewarded-ad revive / bonus coins via AdMob
- [ ] Analytics & crash reporting via Firebase
- [ ] Performance pass (object pooling for obstacles/coins, addressables for
      art if the build size grows)

---

## Publishing to Google Play

High-level checklist for when the game is ready to ship:

1. **Google Play Console account** — one-time $25 registration fee.
2. **Package name** — set a unique `com.yourcompany.yourgame` identifier in
   Unity's Player Settings before your first internal release (can't be
   changed after publishing).
3. **Build as Android App Bundle (.aab)**, not raw APK — required by Play
   Console for new apps.
4. **Signing** — use Play App Signing (Google manages your signing key) unless
   you have a reason to manage your own keystore.
5. **Target/compile SDK** — keep these at or above Google's current minimum
   required API level (check Play Console's requirements page at submission
   time, since it's raised periodically).
6. **Store listing assets** — app icon, feature graphic, phone screenshots,
   short/full description, privacy policy URL (required even for simple
   games if you collect any data, including via ad SDKs or analytics).
7. **Content rating questionnaire** and **Data safety form** — both required
   in Play Console before publishing.
8. **Internal testing track first** — test on a real device or two before
   promoting to production.

---

## Legal & IP

This project's mechanics are inspired by the "Ben 10" concept of transforming
between multiple creatures, but Ben 10, its aliens, and their names/likenesses
are trademarks/copyrights of Cartoon Network / Warner Bros. Discovery. To keep
this safe to publish commercially:

- Don't use official Ben 10 character names, artwork, sounds, or the Omnitrix
  design in a published build.
- The included roster (`AlienRosterGenerator`) already uses original names
  and generic power-archetypes for this reason — feel free to rename them
  further to your own original characters.
- If this is purely a personal/portfolio/non-published project, you have more
  latitude, but it still shouldn't be distributed or monetized.
- This isn't legal advice — if you're unsure, a quick read of Google Play's
  [Intellectual Property policy](https://support.google.com/googleplay/android-developer/answer/9888379)
  or a consult with someone qualified is worth it before you submit.
