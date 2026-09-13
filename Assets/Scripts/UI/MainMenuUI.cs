using Ben10Runner.Core;
using UnityEngine;

namespace Ben10Runner.UI
{
    /// <summary>
    /// Root menu screen. Kept intentionally thin - most of the interesting
    /// logic lives in CharacterSelectUI. Wire this screen's "Play" button to
    /// OnPlayPressed to move into character select.
    /// </summary>
    public class MainMenuUI : MonoBehaviour
    {
        [SerializeField] private GameManager gameManager;

        public void OnPlayPressed()
        {
            gameManager.SetState(GameState.CharacterSelect);
        }

        public void OnQuitPressed()
        {
            Application.Quit();
        }
    }
}
