using Ben10Runner.Core;
using Ben10Runner.Player;
using UnityEngine;

namespace Ben10Runner.World
{
    public enum CollectibleType { Coin, Gem }

    /// <summary>
    /// Attach to a coin/gem prefab with a trigger collider. On pickup,
    /// awards coins via GameManager and deactivates itself (pooled by the spawner).
    /// </summary>
    [RequireComponent(typeof(Collider))]
    public class Collectible : MonoBehaviour
    {
        [SerializeField] private CollectibleType type = CollectibleType.Coin;
        [SerializeField] private int value = 1;
        [SerializeField] private GameObject pickupVfx;

        private void Reset()
        {
            GetComponent<Collider>().isTrigger = true;
        }

        private void OnTriggerEnter(Collider other)
        {
            var player = other.GetComponentInParent<PlayerController>();
            if (player == null) return;

            GameManager.Instance.AddCoins(value);

            if (pickupVfx != null)
                Instantiate(pickupVfx, transform.position, Quaternion.identity);

            gameObject.SetActive(false);
        }
    }
}
