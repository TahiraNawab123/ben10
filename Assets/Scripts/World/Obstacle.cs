using Ben10Runner.Player;
using UnityEngine;

namespace Ben10Runner.World
{
    /// <summary>
    /// Attach to any obstacle prefab (train, barrier, rail, etc.) with a
    /// trigger collider. On contact with the player it ends the run
    /// (unless the player has shield charges - see PlayerController.HandleObstacleHit).
    /// </summary>
    [RequireComponent(typeof(Collider))]
    public class Obstacle : MonoBehaviour
    {
        [Tooltip("If true, sliding under this obstacle avoids the hit (e.g. a low bar). " +
                 "Give slide-under prefabs a trigger collider positioned only above slide height.")]
        [SerializeField] private bool isSlideable = false;

        private void Reset()
        {
            GetComponent<Collider>().isTrigger = true;
        }

        private void OnTriggerEnter(Collider other)
        {
            var player = other.GetComponentInParent<PlayerController>();
            if (player == null) return;
            player.HandleObstacleHit();
        }
    }
}
