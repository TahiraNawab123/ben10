using System;
using UnityEngine;

namespace Ben10Runner.Core
{
    /// <summary>
    /// Central game state machine. Persists across scenes and coordinates
    /// the run lifecycle (menu -> running -> paused -> game over).
    /// Other systems (score, spawner, player) subscribe to the events here
    /// instead of polling a state variable directly.
    /// </summary>
    public enum GameState { MainMenu, CharacterSelect, Running, Paused, GameOver }

    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public GameState CurrentState { get; private set; } = GameState.MainMenu;

        [Header("Run stats (reset every run)")]
        public int currentRunCoins;
        public float currentRunDistance;

        [Header("Persistent economy")]
        public int totalCoins; // wallet balance, loaded from SaveSystem

        public event Action<GameState> OnStateChanged;
        public event Action<int> OnCoinsChanged;       // fires with totalCoins
        public event Action<float> OnDistanceChanged;  // fires with currentRunDistance

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            SaveSystem.Load();
            totalCoins = SaveSystem.Data.totalCoins;
        }

        public void SetState(GameState newState)
        {
            if (CurrentState == newState) return;
            CurrentState = newState;
            Time.timeScale = (newState == GameState.Paused) ? 0f : 1f;
            OnStateChanged?.Invoke(newState);
        }

        public void StartRun()
        {
            currentRunCoins = 0;
            currentRunDistance = 0f;
            SetState(GameState.Running);
        }

        public void AddDistance(float delta)
        {
            if (CurrentState != GameState.Running) return;
            currentRunDistance += delta;
            OnDistanceChanged?.Invoke(currentRunDistance);
        }

        public void AddCoins(int amount)
        {
            currentRunCoins += amount;
            totalCoins += amount;
            OnCoinsChanged?.Invoke(totalCoins);
        }

        /// <summary>
        /// Ends the run, persists the results, and notifies listeners.
        /// Call this from collision/death logic in PlayerController.
        /// </summary>
        public void EndRun()
        {
            if (CurrentState == GameState.GameOver) return;

            SetState(GameState.GameOver);

            var data = SaveSystem.Data;
            data.totalCoins = totalCoins;
            data.bestDistance = Mathf.Max(data.bestDistance, currentRunDistance);
            data.totalRuns += 1;
            SaveSystem.Save();
        }

        public void ReturnToMenu()
        {
            SetState(GameState.MainMenu);
        }
    }
}
