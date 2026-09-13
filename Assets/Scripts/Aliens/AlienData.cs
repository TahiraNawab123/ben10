using UnityEngine;

namespace Ben10Runner.Aliens
{
    /// <summary>
    /// The special ability an alien grants while running.
    /// Extend this enum as you design more powers - PowerUps/ scripts
    /// read this value to decide what passive/active effect to apply.
    /// </summary>
    public enum AbilityType
    {
        None,
        SpeedBoost,     // faster base run speed
        CoinMagnet,     // pulls in coins from a wider radius
        ExtraShield,    // survives one extra hit per run
        HigherJump,     // increased jump height / double-jump
        GroundSmash,    // can destroy certain low obstacles instead of dying
    }

    /// <summary>
    /// Data-only definition for one playable character. Create one asset per
    /// alien via Assets > Create > Ben10Runner > Alien Data. Keeping this as
    /// a ScriptableObject means designers (or you, later) can add/tune aliens
    /// without touching code, and art can be dropped in per-asset.
    /// </summary>
    [CreateAssetMenu(fileName = "NewAlien", menuName = "Ben10Runner/Alien Data", order = 0)]
    public class AlienData : ScriptableObject
    {
        [Header("Identity")]
        public string alienId;           // stable unique key, e.g. "alien_speed" - used in save data, never rename after shipping
        public string displayName;       // shown in UI, e.g. "Velocity"
        [TextArea] public string description;
        public Sprite portrait;          // character-select thumbnail
        public GameObject runnerPrefab;  // the in-game model/sprite + animator swapped onto the player

        [Header("Unlock order & cost")]
        [Tooltip("0 = starter alien, always unlocked. 1..9 unlock in ascending order.")]
        public int unlockOrder;
        [Tooltip("Coins required (cumulative wallet, not per-run) to unlock this alien.")]
        public int unlockCoinCost;

        [Header("Gameplay stats")]
        public float moveSpeedMultiplier = 1f;
        public float jumpHeightMultiplier = 1f;
        public AbilityType ability = AbilityType.None;
        [Tooltip("Strength of the ability, meaning depends on AbilityType (e.g. magnet radius, shield count).")]
        public float abilityPower = 1f;
    }
}
