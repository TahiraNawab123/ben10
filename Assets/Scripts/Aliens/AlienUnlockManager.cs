using System;
using System.Collections.Generic;
using System.Linq;
using Ben10Runner.Core;
using UnityEngine;

namespace Ben10Runner.Aliens
{
    /// <summary>
    /// Owns the unlock progression rules:
    ///  - The starter alien (unlockOrder 0) is always unlocked.
    ///  - Aliens unlock strictly in order - you can't skip ahead even with
    ///    enough coins, matching the "unlock one by one" design.
    ///  - Unlocking spends coins from the persistent wallet (SaveSystem/GameManager),
    ///    not from the current run's coin count, so partial progress across
    ///    multiple runs is never lost.
    /// Put one of these on a persistent GameObject (same one as GameManager works fine).
    /// </summary>
    public class AlienUnlockManager : MonoBehaviour
    {
        public static AlienUnlockManager Instance { get; private set; }

        [SerializeField] private AlienDatabase database;

        public event Action<AlienData> OnAlienUnlocked;
        public event Action<AlienData> OnAlienSelected;

        private AlienData _selected;
        public AlienData Selected => _selected;

        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        private void Start()
        {
            EnsureStarterUnlocked();
            RestoreSelection();
        }

        private void EnsureStarterUnlocked()
        {
            var starter = database.Starter;
            if (starter != null) SaveSystem.Unlock(starter.alienId);
        }

        private void RestoreSelection()
        {
            string savedId = SaveSystem.Data.selectedAlienId;
            AlienData toSelect = !string.IsNullOrEmpty(savedId) ? database.GetById(savedId) : null;
            toSelect ??= database.Starter;
            SelectAlien(toSelect);
        }

        public bool IsUnlocked(AlienData alien) => alien != null && SaveSystem.IsUnlocked(alien.alienId);

        public List<AlienData> GetAllInOrder() => database.InUnlockOrder.ToList();

        /// <summary>The next alien in line waiting to be unlocked, or null if the roster is complete.</summary>
        public AlienData GetNextLockedAlien()
        {
            return database.InUnlockOrder.FirstOrDefault(a => !IsUnlocked(a));
        }

        /// <summary>
        /// Attempts to unlock the next alien in sequence using the player's coin wallet.
        /// Returns true on success. Call this from the character-select screen's
        /// "Unlock" button, wired to the next locked alien in the list.
        /// </summary>
        public bool TryUnlockNext(GameManager gameManager)
        {
            var next = GetNextLockedAlien();
            if (next == null) return false; // already fully unlocked

            if (gameManager.totalCoins < next.unlockCoinCost) return false;

            gameManager.totalCoins -= next.unlockCoinCost;
            SaveSystem.Data.totalCoins = gameManager.totalCoins;
            SaveSystem.Unlock(next.alienId);

            OnAlienUnlocked?.Invoke(next);
            return true;
        }

        public void SelectAlien(AlienData alien)
        {
            if (alien == null || !IsUnlocked(alien)) return;
            _selected = alien;
            SaveSystem.Data.selectedAlienId = alien.alienId;
            SaveSystem.Save();
            OnAlienSelected?.Invoke(alien);
        }
    }
}
