using System.Collections.Generic;
using Ben10Runner.Aliens;
using Ben10Runner.Player;
using UnityEngine;

namespace Ben10Runner.PowerUps
{
    /// <summary>
    /// Reads the current alien's AbilityType off PlayerController and applies
    /// the passive, always-on effects each frame (speed/jump are already
    /// handled directly in PlayerController via its multipliers - this script
    /// covers the two effects that need extra world interaction: CoinMagnet
    /// and GroundSmash).
    /// Put this on the same GameObject as PlayerController.
    /// </summary>
    [RequireComponent(typeof(PlayerController))]
    public class AbilityRuntime : MonoBehaviour
    {
        [SerializeField] private LayerMask coinLayer;
        [SerializeField] private LayerMask smashableObstacleLayer;

        private PlayerController _player;

        private void Awake() => _player = GetComponent<PlayerController>();

        private void Update()
        {
            var alien = _player.CurrentAlien;
            if (alien == null) return;

            switch (alien.ability)
            {
                case AbilityType.CoinMagnet:
                    PullNearbyCoins(alien.abilityPower);
                    break;
                case AbilityType.GroundSmash:
                    SmashObstaclesAhead(alien.abilityPower);
                    break;
                // SpeedBoost, HigherJump, ExtraShield are read directly by
                // PlayerController (multipliers) / HandleObstacleHit (shield).
            }
        }

        private static readonly Collider[] MagnetBuffer = new Collider[32];

        private void PullNearbyCoins(float radius)
        {
            int count = Physics.OverlapSphereNonAlloc(transform.position, radius, MagnetBuffer, coinLayer);
            for (int i = 0; i < count; i++)
            {
                var col = MagnetBuffer[i];
                col.transform.position = Vector3.MoveTowards(
                    col.transform.position, transform.position, 20f * Time.deltaTime);
            }
        }

        private static readonly Collider[] SmashBuffer = new Collider[8];

        private void SmashObstaclesAhead(float radius)
        {
            int count = Physics.OverlapSphereNonAlloc(
                transform.position + Vector3.forward * 1.5f, radius, SmashBuffer, smashableObstacleLayer);
            for (int i = 0; i < count; i++)
            {
                Destroy(SmashBuffer[i].gameObject);
            }
        }
    }
}
