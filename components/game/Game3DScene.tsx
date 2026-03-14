"use client"

import { Suspense, useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Sky, 
  Cloud,
  useTexture,
  Text,
  Float,
  Billboard,
  Sparkles,
  Stars
} from "@react-three/drei"
import { EffectComposer, Bloom, Fog } from "@react-three/postprocessing"
import * as THREE from "three"

// Types
interface EnvironmentProps {
  worldType: "mountains" | "ice" | "desert"
}

// Color schemes for each environment
const worldColors = {
  mountains: {
    sky: ["#87CEEB", "#4a90a4", "#2c5f6e"],
    ground: ["#3d5c3d", "#2f4f2f", "#1a331a"],
    fog: "#4a5568",
    ambient: "#ffe4c4",
    sun: "#ffecd2"
  },
  ice: {
    sky: ["#a8d8ea", "#87ceeb", "#b0e0e6"],
    ground: ["#e8f4f8", "#d0e8f0", "#c0dce8"],
    fog: "#c8dce8",
    ambient: "#e0f0ff",
    sun: "#f0f8ff"
  },
  desert: {
    sky: ["#ffb347", "#ffcc33", "#ffe4b5"],
    ground: ["#d4a96a", "#c9a066", "#b8895a"],
    fog: "#d4a96a",
    ambient: "#ffe4b5",
    sun: "#ffdd99"
  }
}

// 3D Ground/Terrain Component
function Terrain({ worldType }: { worldType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = worldColors[worldType as keyof typeof worldColors] || worldColors.mountains
  
  // Create terrain geometry with height variation
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 50, 50)
    const positions = geo.attributes.position.array as Float32Array
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      
      // Add terrain height variation
      let height = 0
      if (worldType === "mountains") {
        height = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 + 
                 Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5 +
                 Math.random() * 0.2
      } else if (worldType === "ice") {
        height = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 0.5 + 
                 Math.random() * 0.1
      } else if (worldType === "desert") {
        height = Math.sin(x * 0.08 + y * 0.05) * 1.5 +
                 Math.sin(x * 0.2) * 0.3 +
                 Math.random() * 0.15
      }
      
      positions[i + 2] = height
    }
    
    geo.computeVertexNormals()
    return geo
  }, [worldType])
  
  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial 
        color={colors.ground[0]}
        roughness={worldType === "ice" ? 0.2 : 0.9}
        metalness={worldType === "ice" ? 0.1 : 0}
        flatShading
      />
    </mesh>
  )
}

// Mountains Trees
function Trees() {
  const trees = useMemo(() => {
    const treeData = []
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      const radius = 15 + Math.random() * 25
      treeData.push({
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          0,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 10
        ] as [number, number, number],
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2
      })
    }
    return treeData
  }, [])
  
  return (
    <group>
      {trees.map((tree, i) => (
        <Float key={i} speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
          <group position={tree.position} scale={tree.scale} rotation={[0, tree.rotation, 0]}>
            {/* Tree trunk */}
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
              <meshStandardMaterial color="#4a3728" roughness={0.9} />
            </mesh>
            {/* Tree foliage - layered cones */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <coneGeometry args={[1.5, 3, 8]} />
              <meshStandardMaterial color="#1a472a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 3.5, 0]} castShadow>
              <coneGeometry args={[1.2, 2.5, 8]} />
              <meshStandardMaterial color="#2d5a3d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 4.5, 0]} castShadow>
              <coneGeometry args={[0.8, 2, 8]} />
              <meshStandardMaterial color="#3d6b4d" roughness={0.8} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

// Mountains Rocks
function Rocks() {
  const rocks = useMemo(() => {
    const rockData = []
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const radius = 10 + Math.random() * 30
      rockData.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: [
          0.5 + Math.random() * 1,
          0.3 + Math.random() * 0.8,
          0.5 + Math.random() * 1
        ] as [number, number, number],
        rotation: Math.random() * Math.PI
      })
    }
    return rockData
  }, [])
  
  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh 
          key={i} 
          position={rock.position} 
          scale={rock.scale}
          rotation={[0, rock.rotation, 0]}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Ice Formations
function IceFormations() {
  const iceFormations = useMemo(() => {
    const formations = []
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2
      const radius = 12 + Math.random() * 25
      formations.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ] as [number, number, number],
        height: 1 + Math.random() * 4,
        width: 0.3 + Math.random() * 0.8
      })
    }
    return formations
  }, [])
  
  return (
    <group>
      {iceFormations.map((ice, i) => (
        <mesh 
          key={i} 
          position={[
            ice.position[0], 
            ice.height / 2, 
            ice.position[2]
          ]} 
          castShadow
        >
          <coneGeometry args={[ice.width, ice.height, 6]} />
          <meshStandardMaterial 
            color="#c8e8f8" 
            roughness={0.1} 
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {/* Ice crystals on ground */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh 
          key={`crystal-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            0.1,
            (Math.random() - 0.5) * 60
          ]}
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
        >
          <octahedronGeometry args={[0.2 + Math.random() * 0.3, 0]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            roughness={0.05} 
            metalness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

// Desert Cacti
function Cacti() {
  const cacti = useMemo(() => {
    const cactiData = []
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      const radius = 15 + Math.random() * 20
      cactiData.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ] as [number, number, number],
        height: 1.5 + Math.random() * 2.5,
        hasArms: Math.random() > 0.3
      })
    }
    return cactiData
  }, [])
  
  return (
    <group>
      {cacti.map((cactus, i) => (
        <group key={i} position={cactus.position}>
          {/* Main trunk */}
          <mesh position={[0, cactus.height / 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, cactus.height, 8]} />
            <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
          </mesh>
          {/* Arms if present */}
          {cactus.hasArms && (
            <>
              <mesh position={[0.6, cactus.height * 0.6, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.8, 6]} />
                <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
              </mesh>
              <mesh position={[0.6, cactus.height * 0.6 + 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.6, 6]} />
                <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  )
}

// Desert Sand Dunes (decorative)
function SandDunes() {
  const dunes = useMemo(() => {
    const duneData = []
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      const radius = 20 + Math.random() * 20
      duneData.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 2 + Math.random() * 3
      })
    }
    return duneData
  }, [])
  
  return (
    <group>
      {dunes.map((dune, i) => (
        <mesh 
          key={i} 
          position={[
            dune.position[0], 
            -0.3, 
            dune.position[2]
          ]}
          scale={[dune.scale, 0.8, dune.scale * 0.6]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <sphereGeometry args={[3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d4a96a" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

// Mountains background
function Mountains() {
  const mountainData = useMemo(() => {
    const mountains = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const distance = 35 + Math.random() * 15
      mountains.push({
        position: [
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ] as [number, number, number],
        height: 8 + Math.random() * 12,
        width: 6 + Math.random() * 8
      })
    }
    return mountains
  }, [])
  
  return (
    <group>
      {mountainData.map((mountain, i) => (
        <mesh 
          key={i}
          position={[
            mountain.position[0],
            mountain.height / 2 - 1,
            mountain.position[2]
          ]}
          castShadow
        >
          <coneGeometry args={[mountain.width, mountain.height, 6]} />
          <meshStandardMaterial color="#3d4d3d" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Ice background mountains
function IceMountains() {
  const mountainData = useMemo(() => {
    const mountains = []
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const distance = 35 + Math.random() * 15
      mountains.push({
        position: [
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ] as [number, number, number],
        height: 10 + Math.random() * 15,
        width: 5 + Math.random() * 8
      })
    }
    return mountains
  }, [])
  
  return (
    <group>
      {mountainData.map((mountain, i) => (
        <mesh 
          key={i}
          position={[
            mountain.position[0],
            mountain.height / 2 - 1,
            mountain.position[2]
          ]}
          castShadow
        >
          <coneGeometry args={[mountain.width, mountain.height, 5]} />
          <meshStandardMaterial color="#a8c8d8" roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Desert background mountains
function DesertMountains() {
  const mountainData = useMemo(() => {
    const mountains = []
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const distance = 40 + Math.random() * 10
      mountains.push({
        position: [
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ] as [number, number, number],
        height: 6 + Math.random() * 8,
        width: 8 + Math.random() * 6
      })
    }
    return mountains
  }, [])
  
  return (
    <group>
      {mountainData.map((mountain, i) => (
        <mesh 
          key={i}
          position={[
            mountain.position[0],
            mountain.height / 2 - 1,
            mountain.position[2]
          ]}
          castShadow
        >
          <coneGeometry args={[mountain.width, mountain.height, 4]} />
          <meshStandardMaterial color="#8b6042" roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Atmospheric Particles
function AtmosphericParticles({ worldType }: { worldType: string }) {
  const particleCount = worldType === "ice" ? 200 : worldType === "desert" ? 50 : 30
  
  if (worldType === "ice") {
    return (
      <Sparkles 
        count={particleCount}
        scale={50}
        size={2}
        speed={0.3}
        color="#ffffff"
        opacity={0.6}
      />
    )
  }
  
  if (worldType === "desert") {
    return (
      <Sparkles 
        count={particleCount}
        scale={40}
        size={1.5}
        speed={0.2}
        color="#d4a96a"
        opacity={0.3}
      />
    )
  }
  
  // Dust for mountains
  return (
    <Sparkles 
      count={particleCount}
        scale={30}
        size={1}
        speed={0.1}
        color="#8b7355"
        opacity={0.2}
    />
  )
}

// Main Environment Component
function Environment3D({ worldType }: EnvironmentProps) {
  const colors = worldColors[worldType as keyof typeof worldColors] || worldColors.mountains
  
  return (
    <group>
      {/* Ground */}
      <Terrain worldType={worldType} />
      
      {/* Environment-specific elements */}
      {worldType === "mountains" && (
        <>
          <Trees />
          <Rocks />
          <Mountains />
        </>
      )}
      
      {worldType === "ice" && (
        <>
          <IceFormations />
          <IceMountains />
        </>
      )}
      
      {worldType === "desert" && (
        <>
          <Cacti />
          <SandDunes />
          <DesertMountains />
        </>
      )}
      
      {/* Atmospheric particles */}
      <AtmosphericParticles worldType={worldType} />
    </group>
  )
}

// Player 3D Component
interface PlayerProps {
  position: [number, number, number]
  direction: "left" | "right"
  isMoving: boolean
  creatureColor: string
  creatureImage?: string
}

function Player3D({ position, direction, isMoving, creatureColor }: PlayerProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(0)
  
  useFrame((state) => {
    if (meshRef.current && isMoving) {
      // Bobbing animation when moving
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1
    }
  })
  
  return (
    <group position={position}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
      
      {/* Player glow */}
      <pointLight 
        color={creatureColor} 
        intensity={2} 
        distance={5}
        position={[0, 1, 0]}
      />
      
      {/* Player representation - simple geometric character */}
      <group 
        ref={meshRef}
        scale={[direction === "left" ? -1 : 1, 1, 1]}
      >
        {/* Body */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color={creatureColor} 
            roughness={0.4}
            metalness={0.3}
            emissive={creatureColor}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.2, 1, 0.4]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.2, 1, 0.4]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[0.2, 1, 0.5]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.2, 1, 0.5]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      
      {/* Attack effect ring */}
      {isMoving && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color={creatureColor} opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  )
}

// Enemy 3D Component
interface Enemy3DProps {
  position: [number, number, number]
  health: number
  maxHealth: number
  isHit: boolean
}

function Enemy3DComponent({ position, health, maxHealth, isHit }: Enemy3DProps) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })
  
  const healthPercent = health / maxHealth
  
  return (
    <group position={position}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
      
      {/* Enemy glow */}
      <pointLight 
        color={isHit ? "#ff0000" : "#ff3b5c"} 
        intensity={isHit ? 4 : 1.5} 
        distance={4}
      />
      
      <group ref={meshRef}>
        {/* Main body */}
        <mesh castShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color={isHit ? "#ff0000" : "#ff3b5c"} 
            roughness={0.5}
            metalness={0.3}
            emissive={isHit ? "#ff0000" : "#ff3b5c"}
            emissiveIntensity={isHit ? 0.5 : 0.2}
          />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.15, 0.2, 0.35]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.15, 0.2, 0.35]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[0.15, 0.2, 0.42]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.15, 0.2, 0.42]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  )
}

// Attack Effect Component
interface AttackEffectProps {
  position: [number, number, number]
  color: string
}

function AttackEffect3D({ position, color }: AttackEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.2
      meshRef.current.rotation.x += 0.1
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Center glow */}
      <pointLight color={color} intensity={5} distance={8} />
      
      {/* Sparkles */}
      <Sparkles 
        count={20}
        scale={3}
        size={3}
        speed={2}
        color={color}
      />
    </group>
  )
}

// Camera Controller
interface CameraControllerProps {
  enabled: boolean
}

function CameraController({ enabled }: CameraControllerProps) {
  const { camera } = useThree()
  
  useEffect(() => {
    if (enabled) {
      // Set initial camera position for third-person view
      camera.position.set(0, 5, 12)
      camera.lookAt(0, 1, 0)
    }
  }, [camera, enabled])
  
  return (
    <OrbitControls 
      enabled={enabled}
      enablePan={false}
      enableZoom={true}
      minDistance={5}
      maxDistance={30}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 1, 0]}
    />
  )
}

// Main 3D Scene Component
interface Game3DSceneProps {
  worldType: "mountains" | "ice" | "desert"
  playerPosition: [number, number, number]
  playerDirection: "left" | "right"
  isPlayerMoving: boolean
  playerColor: string
  enemies: Array<{
    id: string
    position: [number, number, number]
    health: number
    maxHealth: number
    isHit: boolean
  }>
  attackEffect: {
    position: [number, number, number]
    color: string
  } | null
  cameraEnabled: boolean
}

function Game3DScene({
  worldType,
  playerPosition,
  playerDirection,
  isPlayerMoving,
  playerColor,
  enemies,
  attackEffect,
  cameraEnabled
}: Game3DSceneProps) {
  const colors = worldColors[worldType as keyof typeof worldColors] || worldColors.mountains
  
  return (
    <Canvas shadows className="w-full h-full">
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={60} />
      <CameraController enabled={cameraEnabled} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} color={colors.ambient} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        color={colors.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight 
        skyColor={colors.sky[0]} 
        groundColor={colors.ground[0]} 
        intensity={0.3} 
      />
      
      {/* Fog */}
      <fog attach="fog" args={[colors.fog, 20, 60]} />
      
      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={worldType === "ice" ? 2 : 0.5}
      />
      
      {/* Environment */}
      <Environment3D worldType={worldType} />
      
      {/* Player */}
      <Player3D 
        position={playerPosition}
        direction={playerDirection}
        isMoving={isPlayerMoving}
        creatureColor={playerColor}
      />
      
      {/* Enemies */}
      {enemies.map((enemy) => (
        <Enemy3DComponent
          key={enemy.id}
          position={enemy.position}
          health={enemy.health}
          maxHealth={enemy.maxHealth}
          isHit={enemy.isHit}
        />
      ))}
      
      {/* Attack Effect */}
      {attackEffect && (
        <AttackEffect3D 
          position={attackEffect.position}
          color={attackEffect.color}
        />
      )}
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          intensity={0.5}
        />
      </EffectComposer>
    </Canvas>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-primary font-mono text-sm">Loading 3D Environment...</p>
      </div>
    </div>
  )
}

// Main wrapper component with Suspense
interface Game3DSceneWrapperProps extends Game3DSceneProps {}

export default function Game3DSceneWrapper(props: Game3DSceneWrapperProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Game3DScene {...props} />
    </Suspense>
  )
}

