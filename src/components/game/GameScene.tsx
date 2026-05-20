'use client'

import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Sky,
  Cloud,
  useTexture,
  Text,
  Sparkles,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
// @ts-ignore
import * as THREE from 'three'
import type { Obstacle, Collectible, GameState, LANE_POSITIONS } from '@/src/types/game'

const WORLD_COLORS = {
  mountains: {
    sky: ['#87CEEB', '#4a90a4', '#2c5f6e'],
    ground: ['#3d5c3d', '#2f4f2f', '#1a331a'],
    fog: '#4a5568',
    ambient: '#ffe4c4',
    sun: '#ffecd2',
  },
  ice: {
    sky: ['#a8d8ea', '#87ceeb', '#b0e0e6'],
    ground: ['#e8f4f8', '#d0e8f0', '#c0dce8'],
    fog: '#c8dce8',
    ambient: '#e0f0ff',
    sun: '#f0f8ff',
  },
  desert: {
    sky: ['#ffb347', '#ffcc33', '#ffe4b5'],
    ground: ['#d4a96a', '#c9a066', '#b8895a'],
    fog: '#d4a96a',
    ambient: '#ffe4b5',
    sun: '#ffdd99',
  },
}

interface GameSceneProps {
  gameState: GameState
  obstacles: Obstacle[]
  collectibles: Collectible[]
  onCollision?: (lane: 0 | 1 | 2) => void
  onCollectible?: (id: string) => void
}

function Terrain({ worldType }: { worldType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = WORLD_COLORS[worldType as keyof typeof WORLD_COLORS] || WORLD_COLORS.mountains

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 200, 50, 200)
    const positions = geo.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 1]

      let height = 0
      if (worldType === 'mountains') {
        height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + Math.random() * 0.1
      } else if (worldType === 'ice') {
        height = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 0.3 + Math.random() * 0.05
      } else if (worldType === 'desert') {
        height = Math.sin(x * 0.08) * 1 + Math.random() * 0.08
      }

      positions[i + 2] = height
    }

    geo.computeVertexNormals()
    return geo
  }, [worldType])

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color={colors.ground[0]}
        roughness={worldType === 'ice' ? 0.2 : 0.9}
        metalness={worldType === 'ice' ? 0.1 : 0}
        flatShading
      />
    </mesh>
  )
}

function Obstacle({ obstacle, worldType }: { obstacle: Obstacle; worldType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = WORLD_COLORS[worldType as keyof typeof WORLD_COLORS]

  return (
    <mesh
      ref={meshRef}
      position={[-5 + obstacle.lane * 5, 1, -(50 - obstacle.position.z)]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[obstacle.width, 2, obstacle.depth]} />
      <meshStandardMaterial
        color={colors.fog}
        roughness={0.8}
        metalness={0.2}
        emissive="#ff3b5c"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function Collectible({ collectible, worldType }: { collectible: Collectible; worldType: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05
      meshRef.current.position.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[-5 + collectible.lane * 5, 1.5, -(50 - collectible.position.z)]}
      castShadow
      receiveShadow
    >
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffff00"
        emissiveIntensity={0.6}
        metalness={1}
        roughness={0.1}
      />
    </mesh>
  )
}

function CameraController({ gameState }: { gameState: GameState }) {
  const { camera } = useThree()

  useFrame(() => {
    const targetX = -5 + gameState.lane * 5
    const targetY = 3
    const targetZ = 15

    camera.position.x += (targetX - camera.position.x) * 0.1
    camera.position.y += (targetY - camera.position.y) * 0.1
    camera.position.z += (targetZ - camera.position.z) * 0.1

    const lookAtX = -5 + gameState.lane * 5
    const lookAtY = 0
    const lookAtZ = -10

    camera.lookAt(lookAtX, lookAtY, lookAtZ)
  })

  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  )
}

export function GameScene({
  gameState,
  obstacles,
  collectibles,
}: GameSceneProps) {
  const colors = WORLD_COLORS[gameState.worldType as keyof typeof WORLD_COLORS]

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={60} near={0.1} far={1000} />
      <CameraController gameState={gameState} />

      <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} mieCoefficient={0.005} />

      <Lights />

      <Suspense fallback={null}>
        <Terrain worldType={gameState.worldType} />

        {obstacles.map(obstacle => (
          <Obstacle key={obstacle.id} obstacle={obstacle} worldType={gameState.worldType} />
        ))}

        {collectibles.map(collectible => (
          <Collectible
            key={collectible.id}
            collectible={collectible}
            worldType={gameState.worldType}
          />
        ))}
      </Suspense>

      <EffectComposer>
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>

      <fog attach="fog" args={[colors.fog, 5, 60]} />
    </Canvas>
  )
}
