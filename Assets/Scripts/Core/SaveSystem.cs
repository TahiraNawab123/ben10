using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace Ben10Runner.Core
{
    /// <summary>
    /// All the data that needs to survive between app launches.
    /// Kept as a plain serializable class so it can be dumped straight to JSON.
    /// </summary>
    [Serializable]
    public class SaveData
    {
        public int totalCoins;
        public float bestDistance;
        public int totalRuns;

        // Alien unlock ids that are unlocked. Index 0 (the starter alien)
        // is always unlocked and doesn't need to be stored, but we store it
        // anyway to keep the list authoritative and simple to reason about.
        public List<string> unlockedAlienIds = new List<string>();

        // Which alien the player currently has selected for the next run.
        public string selectedAlienId;
    }

    /// <summary>
    /// Static wrapper around SaveData persistence.
    /// Uses Application.persistentDataPath + JsonUtility, which works
    /// identically in the editor and on an Android/iOS device.
    /// Swap this out for PlayerPrefs or a cloud save later without touching
    /// any calling code, since everything goes through Load()/Save()/Data.
    /// </summary>
    public static class SaveSystem
    {
        private const string FileName = "save.json";
        private static string FilePath => Path.Combine(Application.persistentDataPath, FileName);

        public static SaveData Data { get; private set; } = new SaveData();

        public static void Load()
        {
            try
            {
                if (File.Exists(FilePath))
                {
                    string json = File.ReadAllText(FilePath);
                    Data = JsonUtility.FromJson<SaveData>(json) ?? new SaveData();
                }
                else
                {
                    Data = new SaveData();
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning($"[SaveSystem] Failed to load save, starting fresh. {e.Message}");
                Data = new SaveData();
            }
        }

        public static void Save()
        {
            try
            {
                string json = JsonUtility.ToJson(Data, true);
                File.WriteAllText(FilePath, json);
            }
            catch (Exception e)
            {
                Debug.LogError($"[SaveSystem] Failed to save. {e.Message}");
            }
        }

        public static bool IsUnlocked(string alienId)
        {
            return Data.unlockedAlienIds.Contains(alienId);
        }

        public static void Unlock(string alienId)
        {
            if (!Data.unlockedAlienIds.Contains(alienId))
            {
                Data.unlockedAlienIds.Add(alienId);
                Save();
            }
        }

        /// <summary>Wipes all progress. Wire this to a debug/reset-progress button.</summary>
        public static void ResetAll()
        {
            Data = new SaveData();
            Save();
        }
    }
}
