using Ben10Runner.Core;
using TMPro;
using UnityEngine;

namespace Ben10Runner.UI
{
    /// <summary>
    /// Simple HUD bound to GameManager events. Assign the TMP text fields
    /// in the Inspector and drop this on a Canvas active only during Running.
    /// </summary>
    public class HUDManager : MonoBehaviour
    {
        [SerializeField] private TMP_Text coinsText;
        [SerializeField] private TMP_Text distanceText;

        private void OnEnable()
        {
            var gm = GameManager.Instance;
            if (gm == null) return;
            gm.OnCoinsChanged += UpdateCoins;
            gm.OnDistanceChanged += UpdateDistance;
            UpdateCoins(gm.totalCoins);
            UpdateDistance(gm.currentRunDistance);
        }

        private void OnDisable()
        {
            var gm = GameManager.Instance;
            if (gm == null) return;
            gm.OnCoinsChanged -= UpdateCoins;
            gm.OnDistanceChanged -= UpdateDistance;
        }

        private void UpdateCoins(int total)
        {
            if (coinsText != null) coinsText.text = total.ToString();
        }

        private void UpdateDistance(float meters)
        {
            if (distanceText != null) distanceText.text = $"{meters:0}m";
        }

        public void OnPauseButtonPressed()
        {
            GameManager.Instance.SetState(GameState.Paused);
        }
    }
}
