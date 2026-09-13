#if UNITY_EDITOR
using System.IO;
using Ben10Runner.Aliens;
using UnityEditor;
using UnityEngine;

namespace Ben10Runner.EditorTools
{
    /// <summary>
    /// One-click generator for the starting 10-alien roster so you don't have
    /// to hand-create 11 assets in the Project window. Run it from the Unity
    /// menu: Ben10Runner > Generate Starter Alien Roster.
    /// It's safe to run again later - existing assets at the same path are
    /// left untouched, only missing ones are created.
    /// After running, open each AlienData asset and assign portrait/runnerPrefab
    /// once you have art, and rename displayName to whatever you land on
    /// (Ben 10 lore names for a personal build, or original names for Play Store).
    /// </summary>
    public static class AlienRosterGenerator
    {
        private const string Folder = "Assets/ScriptableObjects/Aliens";

        private struct Def
        {
            public string id, name, desc;
            public int order, cost;
            public float speedMul, jumpMul;
            public AbilityType ability;
            public float abilityPower;

            public Def(string id, string name, string desc, int order, int cost,
                float speedMul, float jumpMul, AbilityType ability, float abilityPower)
            {
                this.id = id; this.name = name; this.desc = desc;
                this.order = order; this.cost = cost;
                this.speedMul = speedMul; this.jumpMul = jumpMul;
                this.ability = ability; this.abilityPower = abilityPower;
            }
        }

        private static readonly Def[] Roster =
        {
            new Def("alien_00_starter", "Runner (Base Form)", "The starting form. No special ability, always available.",
                0, 0, 1.0f, 1.0f, AbilityType.None, 0f),
            new Def("alien_01_speed", "Velocity", "A lean, fast form built for outrunning danger.",
                1, 500, 1.15f, 1.0f, AbilityType.SpeedBoost, 0f),
            new Def("alien_02_flight", "Skyward", "Grants extra height and hang-time on jumps.",
                2, 1000, 1.0f, 1.35f, AbilityType.HigherJump, 0f),
            new Def("alien_03_magnet", "Ironpull", "Pulls in nearby coins automatically.",
                3, 1750, 1.0f, 1.0f, AbilityType.CoinMagnet, 4f),
            new Def("alien_04_giant", "Colossus", "Tough enough to smash through low obstacles.",
                4, 2750, 0.95f, 0.9f, AbilityType.GroundSmash, 2f),
            new Def("alien_05_shield", "Ironhide", "Survives one extra hit per run.",
                5, 4000, 1.0f, 1.0f, AbilityType.ExtraShield, 1f),
            new Def("alien_06_fire", "Pyroblaze", "Balanced form with a moderate speed edge.",
                6, 5500, 1.1f, 1.05f, AbilityType.SpeedBoost, 0f),
            new Def("alien_07_electric", "Voltstrike", "Wide-radius coin magnet for greedy runs.",
                7, 7500, 1.0f, 1.0f, AbilityType.CoinMagnet, 6f),
            new Def("alien_08_aqua", "Tidalwave", "High jump specialist for gap-heavy sections.",
                8, 10000, 1.0f, 1.5f, AbilityType.HigherJump, 0f),
            new Def("alien_09_ultimate", "Apex Form", "The final unlock - two shield charges and a speed boost.",
                9, 15000, 1.2f, 1.1f, AbilityType.ExtraShield, 2f),
        };

        [MenuItem("Ben10Runner/Generate Starter Alien Roster")]
        public static void Generate()
        {
            if (!AssetDatabase.IsValidFolder(Folder))
            {
                Directory.CreateDirectory(Folder);
                AssetDatabase.Refresh();
            }

            var db = AssetDatabase.LoadAssetAtPath<AlienDatabase>($"{Folder}/AlienDatabase.asset");
            if (db == null)
            {
                db = ScriptableObject.CreateInstance<AlienDatabase>();
                AssetDatabase.CreateAsset(db, $"{Folder}/AlienDatabase.asset");
            }

            foreach (var def in Roster)
            {
                string path = $"{Folder}/{def.id}.asset";
                var data = AssetDatabase.LoadAssetAtPath<AlienData>(path);
                if (data == null)
                {
                    data = ScriptableObject.CreateInstance<AlienData>();
                    AssetDatabase.CreateAsset(data, path);
                }

                data.alienId = def.id;
                data.displayName = def.name;
                data.description = def.desc;
                data.unlockOrder = def.order;
                data.unlockCoinCost = def.cost;
                data.moveSpeedMultiplier = def.speedMul;
                data.jumpHeightMultiplier = def.jumpMul;
                data.ability = def.ability;
                data.abilityPower = def.abilityPower;
                EditorUtility.SetDirty(data);

                if (!db.aliens.Contains(data))
                    db.aliens.Add(data);
            }

            EditorUtility.SetDirty(db);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            Debug.Log($"[AlienRosterGenerator] Generated/updated {Roster.Length} aliens at {Folder}. " +
                      "Open each asset to assign a portrait sprite and runner prefab once you have art.");
        }
    }
}
#endif
