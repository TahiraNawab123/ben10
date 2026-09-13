using UnityEngine;

namespace Ben10Runner.World
{
    /// <summary>
    /// Third-person chase camera. Follows the player's forward (z) and
    /// vertical (y) motion smoothly but ignores their lane (x) position so
    /// the camera doesn't jitter left/right on every lane change - matches
    /// the classic runner camera feel where the world seems to slide under
    /// a mostly-fixed viewpoint.
    /// </summary>
    public class CameraFollow : MonoBehaviour
    {
        [SerializeField] private Transform target;
        [SerializeField] private Vector3 offset = new Vector3(0f, 4.5f, -7f);
        [SerializeField] private float followSharpness = 8f;
        [SerializeField] private bool followLaneX = false;

        private void LateUpdate()
        {
            if (target == null) return;

            Vector3 targetPos = new Vector3(
                followLaneX ? target.position.x : 0f,
                target.position.y,
                target.position.z
            ) + offset;

            transform.position = Vector3.Lerp(transform.position, targetPos, 1f - Mathf.Exp(-followSharpness * Time.deltaTime));
            transform.LookAt(target.position + Vector3.up * 1.5f);
        }
    }
}
