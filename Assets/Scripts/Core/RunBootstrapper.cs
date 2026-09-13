using Ben10Runner.Aliens;
using Ben10Runner.Player;
using UnityEngine;

namespace Ben10Runner.Core
{
    /// <summary>
    /// Lives in the gameplay scene. When the game enters GameState.Running,
    /// it pulls the player's currently-selected alien from AlienUnlockManager
    /// and applies it to PlayerController before the run's first frame moves.
    /// This is the glue between the persistent managers (GameManager,
    /// AlienUnlockManager, which live in a "Boot" scene via DontDestroyOnLoad)
    /// and the per-scene PlayerController instance.
    /// </summary>
    public class RunBootstrapper : MonoBehaviour
    {
        [SerializeField] private PlayerController player;

        private void OnEnable()
        {
            if (GameManager.Instance != null) GameManager.Instance.OnStateChanged += HandleStateChanged;
        }

        private void OnDisable()
        {
            if (GameManager.Instance != null) GameManager.Instance.OnStateChanged -= HandleStateChanged;
        }

        private void HandleStateChanged(GameState state)
        {
            if (state != GameState.Running) return;

            AlienData selected = AlienUnlockManager.Instance != null
                ? AlienUnlockManager.Instance.Selected
                : null;

            player.SetAlien(selected);
        }
    }
}
