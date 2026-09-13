using System;
using UnityEngine;

namespace Ben10Runner.Player
{
    public enum SwipeDirection { Left, Right, Up, Down }

    /// <summary>
    /// Detects mobile swipes (and mouse-drag equivalents for testing in the
    /// editor) and fires a single event. PlayerController subscribes to this
    /// rather than reading touches itself, so input can be remapped or
    /// replaced (e.g. with Unity's new Input System) without touching
    /// movement code.
    /// </summary>
    public class SwipeInput : MonoBehaviour
    {
        public static event Action<SwipeDirection> OnSwipe;

        [SerializeField] private float minSwipeDistancePixels = 60f;

        private Vector2 _touchStartPos;
        private bool _tracking;

        private void Update()
        {
#if UNITY_EDITOR || UNITY_STANDALONE
            HandleMouse();
#else
            HandleTouch();
#endif
        }

        private void HandleTouch()
        {
            if (Input.touchCount == 0) return;
            Touch t = Input.GetTouch(0);

            switch (t.phase)
            {
                case TouchPhase.Began:
                    _touchStartPos = t.position;
                    _tracking = true;
                    break;
                case TouchPhase.Ended:
                case TouchPhase.Canceled:
                    if (_tracking) EvaluateSwipe(t.position);
                    _tracking = false;
                    break;
            }
        }

        private void HandleMouse()
        {
            if (Input.GetMouseButtonDown(0))
            {
                _touchStartPos = Input.mousePosition;
                _tracking = true;
            }
            else if (Input.GetMouseButtonUp(0) && _tracking)
            {
                EvaluateSwipe(Input.mousePosition);
                _tracking = false;
            }
        }

        private void EvaluateSwipe(Vector2 endPos)
        {
            Vector2 delta = endPos - _touchStartPos;
            if (delta.magnitude < minSwipeDistancePixels) return; // treat as a tap, ignore

            if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y))
            {
                OnSwipe?.Invoke(delta.x > 0 ? SwipeDirection.Right : SwipeDirection.Left);
            }
            else
            {
                OnSwipe?.Invoke(delta.y > 0 ? SwipeDirection.Up : SwipeDirection.Down);
            }
        }
    }
}
