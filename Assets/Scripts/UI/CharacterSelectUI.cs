using System.Collections.Generic;
using Ben10Runner.Aliens;
using Ben10Runner.Core;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Ben10Runner.UI
{
    /// <summary>
    /// Builds one AlienSlotUI per roster entry, showing locked/unlocked state,
    /// letting the player select any unlocked alien, and exposing an "Unlock
    /// next" button that spends coins on the next-in-line alien.
    /// This is the screen the player sees between runs (or the first screen
    /// on a fresh install, where only the starter alien is selectable).
    /// </summary>
    public class CharacterSelectUI : MonoBehaviour
    {
        [SerializeField] private AlienUnlockManager unlockManager;
        [SerializeField] private GameManager gameManager;
        [SerializeField] private Transform slotContainer;
        [SerializeField] private AlienSlotUI slotPrefab;
        [SerializeField] private Button unlockNextButton;
        [SerializeField] private TMP_Text unlockNextCostText;
        [SerializeField] private Button playButton;

        private readonly List<AlienSlotUI> _slots = new List<AlienSlotUI>();

        private void OnEnable()
        {
            BuildSlots();
            RefreshUnlockButton();
            unlockManager.OnAlienUnlocked += _ => Refresh();
            unlockManager.OnAlienSelected += _ => Refresh();
            gameManager.OnCoinsChanged += _ => RefreshUnlockButton();
        }

        private void OnDisable()
        {
            unlockManager.OnAlienUnlocked -= _ => Refresh();
            unlockManager.OnAlienSelected -= _ => Refresh();
            gameManager.OnCoinsChanged -= _ => RefreshUnlockButton();
        }

        private void BuildSlots()
        {
            foreach (Transform child in slotContainer) Destroy(child.gameObject);
            _slots.Clear();

            foreach (var alien in unlockManager.GetAllInOrder())
            {
                var slot = Instantiate(slotPrefab, slotContainer);
                slot.Bind(alien, unlockManager);
                _slots.Add(slot);
            }
            Refresh();
        }

        private void Refresh()
        {
            foreach (var slot in _slots) slot.Refresh();
            RefreshUnlockButton();
        }

        private void RefreshUnlockButton()
        {
            var next = unlockManager.GetNextLockedAlien();
            if (next == null)
            {
                unlockNextButton.gameObject.SetActive(false); // full roster unlocked
                return;
            }

            unlockNextButton.gameObject.SetActive(true);
            unlockNextCostText.text = $"Unlock {next.displayName} - {next.unlockCoinCost}";
            unlockNextButton.interactable = gameManager.totalCoins >= next.unlockCoinCost;
        }

        /// <summary>Wire to the "Unlock next" button's OnClick.</summary>
        public void OnUnlockNextPressed()
        {
            unlockManager.TryUnlockNext(gameManager);
        }

        /// <summary>Wire to the "Play" button's OnClick.</summary>
        public void OnPlayPressed()
        {
            gameManager.StartRun();
        }
    }
}
