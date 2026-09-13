using Ben10Runner.Core;
using TMPro;
using UnityEngine;

namespace Ben10Runner.UI
{
    /// <summary>
    /// Shown when GameManager enters GameState.GameOver. Displays this run's
    /// coins/distance plus the persisted best distance, and offers Retry
    /// (back to character select, keeping unlocks) or Menu.
    /// </summary>
    public class GameOverUI : MonoBehaviour
    {
        [SerializeField] private GameManager gameManager;
        [SerializeField] private TMP_Text runCoinsText;
        [SerializeField] private TMP_Text runDistanceText;
        [SerializeField] private TMP_Text bestDistanceText;

        private void OnEnable()
        {
            gameManager.OnStateChanged += HandleStateChanged;
        }

        private void OnDisable()
        {
            gameManager.OnStateChanged -= HandleStateChanged;
        }

        private void HandleStateChanged(GameState state)
        {
            if (state != GameState.GameOver) return;

            runCoinsText.text = $"Coins collected: {gameManager.currentRunCoins}";
            runDistanceText.text = $"Distance: {gameManager.currentRunDistance:0}m";
            bestDistanceText.text = $"Best: {SaveSystem.Data.bestDistance:0}m";
        }

        public void OnRetryPressed()
        {
            gameManager.SetState(GameState.CharacterSelect);
        }

        public void OnMenuPressed()
        {
            gameManager.ReturnToMenu();
        }
    }
}
