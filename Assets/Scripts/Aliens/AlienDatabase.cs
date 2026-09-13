using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Ben10Runner.Aliens
{
    /// <summary>
    /// Single source of truth for the full 10-alien roster, in unlock order.
    /// Create exactly one instance of this asset (Assets > Create > Ben10Runner > Alien Database)
    /// and drag your 10 AlienData assets into the list, sorted by unlockOrder.
    /// </summary>
    [CreateAssetMenu(fileName = "AlienDatabase", menuName = "Ben10Runner/Alien Database", order = 1)]
    public class AlienDatabase : ScriptableObject
    {
        public List<AlienData> aliens = new List<AlienData>();

        public IEnumerable<AlienData> InUnlockOrder => aliens.OrderBy(a => a.unlockOrder);

        public AlienData GetById(string id) => aliens.FirstOrDefault(a => a.alienId == id);

        public AlienData Starter => InUnlockOrder.FirstOrDefault();

        /// <summary>The next alien after the given one in unlock order, or null if it's the last.</summary>
        public AlienData GetNext(AlienData current)
        {
            var ordered = InUnlockOrder.ToList();
            int idx = ordered.FindIndex(a => a.alienId == current.alienId);
            if (idx < 0 || idx + 1 >= ordered.Count) return null;
            return ordered[idx + 1];
        }
    }
}
