'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { Vector3 } from 'three'

const RingModel = () => {
  const gltf = useGLTF('/models/unaze99.glb') as any
  return <primitive object={gltf.scene} scale={1} position={[0, 0, 0]} />
}

export default function RingViewer() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <OrbitControls />
            <Suspense fallback={null}>
                <RingModel />
            </Suspense>
            <Environment preset="studio" />
        </Canvas>
    )
}
