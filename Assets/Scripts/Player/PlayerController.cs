using Ben10Runner.Aliens;
using Ben10Runner.Core;
using UnityEngine;

namespace Ben10Runner.Player
{
    /// <summary>
    /// Subway-Surfers-style endless runner controller:
    ///  - constantly moves forward, speed ramps up with distance
    ///  - 3 lanes, swipe left/right to change lane
    ///  - swipe up to jump, swipe down to slide
    ///  - reads the selected AlienData to apply speed/jump multipliers and
    ///    lets PowerUps read the current ability off CurrentAlien
    /// Attach to the player root GameObject, which should have a
    /// CharacterController component (or swap the movement calls below for
    /// Rigidbody.MovePosition if you prefer physics-based movement).
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Lanes")]
        [SerializeField] private float laneWidth = 2.5f;
        [SerializeField] private float laneChangeSpeed = 12f; // higher = snappier lane switch
        private int _currentLane = 0; // -1 left, 0 middle, 1 right

        [Header("Forward movement")]
        [SerializeField] private float baseForwardSpeed = 8f;
        [SerializeField] private float speedRampPerSecond = 0.15f; // difficulty curve
        [SerializeField] private float maxForwardSpeed = 24f;
        private float _elapsedRunTime;

        [Header("Jump")]
        [SerializeField] private float jumpHeight = 2.2f;
        [SerializeField] private float gravity = -30f;
        private float _verticalVelocity;
        private bool _isGrounded;

        [Header("Slide")]
        [SerializeField] private float slideDuration = 0.7f;
        [SerializeField] private float slideColliderHeight = 0.6f;
        private float _slideTimer;
        private bool _isSliding;

        private float _standingColliderHeight;
        private Vector3 _standingColliderCenter;

        private CharacterController _cc;
        public AlienData CurrentAlien { get; private set; }

        // Runtime multipliers derived from CurrentAlien - PowerUps.* can read these.
        public float SpeedMultiplier { get; private set; } = 1f;
        public float JumpMultiplier { get; private set; } = 1f;
        public int ShieldCharges { get; set; } = 0;

        private void Awake()
        {
            _cc = GetComponent<CharacterController>();
            _standingColliderHeight = _cc.height;
            _standingColliderCenter = _cc.center;
        }

        private void OnEnable() => SwipeInput.OnSwipe += HandleSwipe;
        private void OnDisable() => SwipeInput.OnSwipe -= HandleSwipe;

        /// <summary>Call this right before starting a run (e.g. from CharacterSelectUI or GameManager.StartRun).</summary>
        public void SetAlien(AlienData alien)
        {
            CurrentAlien = alien;
            SpeedMultiplier = alien != null ? alien.moveSpeedMultiplier : 1f;
            JumpMultiplier = alien != null ? alien.jumpHeightMultiplier : 1f;
            ShieldCharges = (alien != null && alien.ability == AbilityType.ExtraShield)
                ? Mathf.RoundToInt(alien.abilityPower)
                : 0;

            SwapVisual(alien);
        }

        private GameObject _visualInstance;
        private void SwapVisual(AlienData alien)
        {
            if (_visualInstance != null) Destroy(_visualInstance);
            if (alien == null || alien.runnerPrefab == null) return;
            _visualInstance = Instantiate(alien.runnerPrefab, transform);
            _visualInstance.transform.localPosition = Vector3.zero;
        }

        private void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Running) return;

            _elapsedRunTime += Time.deltaTime;
            float forwardSpeed = Mathf.Min(baseForwardSpeed + _elapsedRunTime * speedRampPerSecond, maxForwardSpeed);
            forwardSpeed *= SpeedMultiplier;

            HandleSlideTimer();
            ApplyGravityAndJump();

            float targetX = _currentLane * laneWidth;
            float newX = Mathf.MoveTowards(transform.position.x, targetX, laneChangeSpeed * Time.deltaTime);
            Vector3 horizontalDelta = new Vector3(newX - transform.position.x, 0f, forwardSpeed * Time.deltaTime);

            Vector3 verticalDelta = new Vector3(0f, _verticalVelocity * Time.deltaTime, 0f);

            _cc.Move(horizontalDelta + verticalDelta);

            GameManager.Instance.AddDistance(forwardSpeed * Time.deltaTime);
        }

        private void ApplyGravityAndJump()
        {
            _isGrounded = _cc.isGrounded;
            if (_isGrounded && _verticalVelocity < 0f)
            {
                _verticalVelocity = -2f; // small stick-to-ground value
            }
            _verticalVelocity += gravity * Time.deltaTime;
        }

        private void HandleSwipe(SwipeDirection dir)
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Running) return;

            switch (dir)
            {
                case SwipeDirection.Left:
                    _currentLane = Mathf.Max(_currentLane - 1, -1);
                    break;
                case SwipeDirection.Right:
                    _currentLane = Mathf.Min(_currentLane + 1, 1);
                    break;
                case SwipeDirection.Up:
                    TryJump();
                    break;
                case SwipeDirection.Down:
                    TrySlide();
                    break;
            }
        }

        private void TryJump()
        {
            if (!_isGrounded || _isSliding) return;
            float effectiveHeight = jumpHeight * JumpMultiplier;
            _verticalVelocity = Mathf.Sqrt(effectiveHeight * -2f * gravity);
        }

        private void TrySlide()
        {
            if (_isSliding || !_isGrounded) return;
            _isSliding = true;
            _slideTimer = slideDuration;
            _cc.height = slideColliderHeight;
            _cc.center = new Vector3(_standingColliderCenter.x, slideColliderHeight / 2f, _standingColliderCenter.z);
        }

        private void HandleSlideTimer()
        {
            if (!_isSliding) return;
            _slideTimer -= Time.deltaTime;
            if (_slideTimer <= 0f)
            {
                _isSliding = false;
                _cc.height = _standingColliderHeight;
                _cc.center = _standingColliderCenter;
            }
        }

        /// <summary>Called by Obstacle.cs on trigger/collision.</summary>
        public void HandleObstacleHit()
        {
            if (ShieldCharges > 0)
            {
                ShieldCharges--;
                return; // absorbed, run continues
            }
            GameManager.Instance.EndRun();
        }
    }
}
