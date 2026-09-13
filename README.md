<div align="center">

# 🛸 Ben10 Runner

**An endless-runner mobile game with a sequential alien-transformation unlock system**

![Unity](https://img.shields.io/badge/Unity-2022.3%20LTS-000000?style=for-the-badge&logo=unity&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![Android](https://img.shields.io/badge/Android-API%2024+-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![URP](https://img.shields.io/badge/Render-URP-8A2BE2?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge)

</div>

---

Subway Surfers-style lane running, jumping, and sliding — built around **10 unlockable characters**. Players start with one runnable form and unlock the rest, one at a time, by earning coins during runs.

> **IP notice** — This project is inspired by the "10 transforming aliens" concept but does not use Cartoon Network's copyrighted names, art, or the Omnitrix design. Full details in [Legal & IP](#️-legal--ip).

---

## Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Status](#-project-status)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Unlock System](#-unlock-system)
- [Adding Your Own Art](#-adding-your-own-art)
- [Roadmap](#-roadmap)
- [Publishing to Google Play](#-publishing-to-google-play)
- [Legal & IP](#️-legal--ip)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Engine | Unity 2022.3 LTS |
| Language | C# |
| Render Pipeline | URP (Universal Render Pipeline) |
| Movement | `CharacterController` (kinematic) |
| UI | uGUI + TextMeshPro |
| Persistence | Local JSON (`Application.persistentDataPath`) via custom `SaveSystem` |
| Data Authoring | ScriptableObjects (`AlienData`, `AlienDatabase`) |
| Input | Touch swipe (Unity legacy Input, mouse fallback in-editor) |
| Version Control | Git + Git LFS (recommended once art/audio land) |
| Target Platform | Android (API 24+), portable to iOS |
| Planned | Google Play Games Services · AdMob · Firebase Analytics/Crashlytics |

<details>
<summary><b>Why these choices?</b></summary>

- **Unity 2022 LTS** — most mature, best-documented path from editor to a signed Android App Bundle.
- **CharacterController over Rigidbody** — predictable, jitter-free lane movement; the standard choice for runner games.
- **ScriptableObjects for character data** — add or tune all 10 characters from the Inspector, no code changes.
- **Local JSON save** — zero dependencies to start; swappable for cloud save later without touching calling code.
- **Legacy Input for swipes** — simplest reliable option now; swap for the new Input System later if rebindable controls are needed.

</details>

---

## Project Status

This repo previously had no game code. This scaffold adds all core gameplay systems as production-ready C# scripts, a ScriptableObject-driven character system, and a starter-roster generator tool.

**Not included yet** (built inside the Unity Editor, not hand-writable as text files):

| Missing piece | Why |
|---|---|
| `.unity` scenes (Boot, Menu, Gameplay) | Binary, editor-authored |
| Prefabs (player, obstacles, coins, chunks, UI) | Binary, editor-authored |
| Art, animations, audio | Not code |

→ See [`docs/SCENE_SETUP.md`](docs/SCENE_SETUP.md) for a step-by-step checklist to build these.

---

**Design principle:** systems communicate via events, not polling — swap `SaveSystem` for a cloud backend or add a new `AbilityType` without rewriting the rest.

---

## Folder Structure

```
Assets/
├── Scripts/
│   ├── Core/       GameManager · SaveSystem · RunBootstrapper
│   ├── Player/     PlayerController · SwipeInput
│   ├── Aliens/     AlienData · AlienDatabase · AlienUnlockManager
│   ├── World/      Obstacle · Collectible · ChunkSpawner · CameraFollow
│   ├── UI/         MainMenuUI · CharacterSelectUI · AlienSlotUI · HUDManager · GameOverUI
│   ├── PowerUps/   AbilityRuntime
│   └── Editor/     AlienRosterGenerator (menu tool)
├── ScriptableObjects/Aliens/   Generated AlienData + AlienDatabase assets
├── Prefabs/        Player, obstacle, coin, chunk, UI prefabs (add your own)
├── Scenes/         Boot / Menu / Gameplay (add your own)
├── Art/            Characters/ · Environment/ · UI/ (add your own)
└── Audio/          (add your own)
docs/               Extra design & setup notes
```

---

## Getting Started

<details open>
<summary><b>Step-by-step setup</b></summary>

1. Install **Unity Hub** → **Unity 2022.3 LTS** with the **Android Build Support** module.
2. Create a new **3D (URP)** project and copy this repo's `Assets/` folder in (or open this repo as the project directly).
3. Run **`Ben10Runner ▸ Generate Starter Alien Roster`** from the Unity menu bar — auto-creates `AlienDatabase.asset` + 10 `AlienData` assets with placeholder stats.
4. Build three scenes:
   | Scene | Contents |
   |---|---|
   | **Boot** | `GameManager` + `AlienUnlockManager` (assign the generated database), `DontDestroyOnLoad` |
   | **Menu** | `MainMenuUI` → `CharacterSelectUI` with an `AlienSlotUI` grid |
   | **Gameplay** | Player (`CharacterController` + `PlayerController` + `AbilityRuntime` + `SwipeInput`), `ChunkSpawner`, `CameraFollow`, `RunBootstrapper`, HUD Canvas |
5. Build 3–5 obstacle prefabs + a coin prefab, arrange into 2–3 track "chunk" prefabs (~20m each), assign to `ChunkSpawner.chunkPrefabs`.
6. Press **Play**. Click-drag with the mouse to simulate swipes in-editor; real touch input takes over on-device.

Full checklist with field-by-field wiring: [`docs/SCENE_SETUP.md`](docs/SCENE_SETUP.md)

</details>

---

## Unlock System

- `AlienDatabase` holds all 10 `AlienData` assets, ordered by `unlockOrder` (0 = starter, always unlocked).
- `AlienUnlockManager.TryUnlockNext()` only ever unlocks the **next** locked alien in sequence, spending coins from the persistent wallet — no skipping ahead.
- Coins persist across runs, so progress toward the next unlock is never lost.
- Unlocked aliens stay unlocked forever and are freely selectable pre-run.
- Each alien can carry a passive `AbilityType` — Speed Boost, Higher Jump, Coin Magnet, Extra Shield, Ground Smash — applied via `PlayerController` multipliers + `AbilityRuntime`.

---

## Adding Your Own Art

Every character is an `AlienData` asset with a `portrait` (select-screen sprite) and `runnerPrefab` (model/animation swapped onto the player at runtime). Drop art into `Assets/Art/Characters/`, prefab it, drag it into the asset's `runnerPrefab` field — **no code changes required**. Same pattern for `Environment/` and `UI/` art.

---

## Roadmap

- [ ] Build Boot / Menu / Gameplay scenes + core prefabs
- [ ] Replace placeholder art with real character/environment art
- [ ] Animations (run / jump / slide / death) per alien
- [ ] Sound effects + music
- [ ] Daily rewards / missions
- [ ] Leaderboards (Google Play Games Services)
- [ ] Rewarded-ad revive / bonus coins (AdMob)
- [ ] Analytics & crash reporting (Firebase)
- [ ] Object pooling + Addressables performance pass

---

## Publishing to Google Play

| Step | Notes |
|---|---|
| Play Console account | One-time $25 registration |
| Package name | Set `com.yourcompany.yourgame` in Player Settings **before** first release — can't change later |
| Build format | `.aab` (App Bundle), not raw APK |
| Signing | Use Play App Signing |
| Target/compile SDK | Meet Google's current minimum at submission time |
| Store listing | Icon, feature graphic, screenshots, description, privacy policy URL |
| Compliance forms | Content rating questionnaire + Data safety form |
| Testing | Internal testing track on real devices before production |

---

## Legal & IP

> Ben 10, its aliens, and their names/likenesses are trademarks/copyrights of Cartoon Network / Warner Bros. Discovery.

- Don't use official Ben 10 names, art, sounds, or the Omnitrix design in a **published** build.
- The generated roster already uses original names and generic power-archetypes — rename further as you like.
- Personal/portfolio use only → more latitude, but still don't distribute or monetize with official IP.
- Not legal advice — see [Google Play's IP policy](https://support.google.com/googleplay/android-developer/answer/9888379) or consult someone qualified before submitting.

---

<div align="center">

Built with 🎮 in Unity

</div>
