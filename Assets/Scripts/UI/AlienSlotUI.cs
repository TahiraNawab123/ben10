using Ben10Runner.Aliens;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Ben10Runner.UI
{
    /// <summary>
    /// One tile in the character select grid. Shows the portrait, a lock
    /// overlay when not yet unlocked, the alien's name, and highlights when
    /// it's the currently selected alien. Clicking selects it (only if unlocked).
    /// </summary>
    public class AlienSlotUI : MonoBehaviour
    {
        [SerializeField] private Image portraitImage;
        [SerializeField] private GameObject lockOverlay;
        [SerializeField] private GameObject selectedHighlight;
        [SerializeField] private TMP_Text nameText;
        [SerializeField] private Button button;

        private AlienData _alien;
        private AlienUnlockManager _unlockManager;

        public void Bind(AlienData alien, AlienUnlockManager unlockManager)
        {
            _alien = alien;
            _unlockManager = unlockManager;
            portraitImage.sprite = alien.portrait;
            nameText.text = alien.displayName;
            button.onClick.AddListener(OnClicked);
            Refresh();
        }

        public void Refresh()
        {
            bool unlocked = _unlockManager.IsUnlocked(_alien);
            lockOverlay.SetActive(!unlocked);
            button.interactable = unlocked;

            bool isSelected = _unlockManager.Selected != null && _unlockManager.Selected.alienId == _alien.alienId;
            selectedHighlight.SetActive(isSelected);
        }

        private void OnClicked()
        {
            _unlockManager.SelectAlien(_alien);
        }
    }
}
