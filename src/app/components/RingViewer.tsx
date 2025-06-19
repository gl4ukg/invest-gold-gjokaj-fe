'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { Vector3 } from 'three'

const RingModel = () => {
  const gltf = useGLTF('/models/ring.glb') as any
  return <primitive object={gltf.scene} scale={1} position={[0, 0, 0]} />
}

export default function RingViewer() {
  return (
    <Canvas camera={{ position: [0, 0, 3] as Vector3 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 2]} />
      <Suspense fallback={null}>
        <RingModel />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
