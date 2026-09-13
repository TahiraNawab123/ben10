using System.Collections.Generic;
using UnityEngine;

namespace Ben10Runner.World
{
    /// <summary>
    /// Spawns pre-built track "chunk" prefabs end-to-end in front of the player
    /// and recycles them once they fall behind the camera. Each chunk prefab
    /// is a short (e.g. 20m) piece of ground with its own obstacles/coins
    /// already placed as children - this is the same approach Subway Surfers
    /// -style runners use, since hand-designed chunks read better to players
    /// than fully random per-obstacle spawning.
    ///
    /// Build 8-15 chunk prefabs of varying difficulty/layout and assign them
    /// in the Inspector. Mark a few as "easy" for the opening seconds of a run.
    /// </summary>
    public class ChunkSpawner : MonoBehaviour
    {
        [SerializeField] private Transform player;
        [SerializeField] private List<GameObject> chunkPrefabs;
        [SerializeField] private float chunkLength = 20f;
        [SerializeField] private int chunksAheadToKeep = 4;
        [SerializeField] private float despawnBehindDistance = 15f;

        private readonly Queue<GameObject> _activeChunks = new Queue<GameObject>();
        private float _nextSpawnZ;

        private void Start()
        {
            _nextSpawnZ = 0f;
            for (int i = 0; i < chunksAheadToKeep; i++)
            {
                SpawnNextChunk();
            }
        }

        private void Update()
        {
            if (player == null) return;

            // Keep spawning ahead as the player advances.
            while (_nextSpawnZ < player.position.z + chunkLength * chunksAheadToKeep)
            {
                SpawnNextChunk();
            }

            // Recycle chunks that have fully scrolled behind the player.
            while (_activeChunks.Count > 0 &&
                   _activeChunks.Peek().transform.position.z < player.position.z - despawnBehindDistance)
            {
                Destroy(_activeChunks.Dequeue());
            }
        }

        private void SpawnNextChunk()
        {
            if (chunkPrefabs == null || chunkPrefabs.Count == 0) return;

            var prefab = chunkPrefabs[Random.Range(0, chunkPrefabs.Count)];
            var chunk = Instantiate(prefab, new Vector3(0f, 0f, _nextSpawnZ), Quaternion.identity, transform);
            _activeChunks.Enqueue(chunk);
            _nextSpawnZ += chunkLength;
        }
    }
}
