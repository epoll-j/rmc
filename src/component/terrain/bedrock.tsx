import { usePlane } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { Mesh, NearestFilter, RepeatWrapping } from "three";
import bedrock from '@/assets/textures/block/bedrock.png'
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

export const Bedrock = () => {
  const [size, setSize] = useState(50)

  const bedrockTexture = useTexture(bedrock)
  bedrockTexture.magFilter = NearestFilter
  bedrockTexture.wrapS = RepeatWrapping
  bedrockTexture.wrapT = RepeatWrapping
  bedrockTexture.repeat.set(size, size)

  const { camera } = useThree()
  useFrame(() => {
    const maxSize = size / 3
    if (Math.abs(camera.position.x) >= maxSize || Math.abs(camera.position.z) >= maxSize) {
      setSize(size * 1.2)
    }
  })

  const [ref] = usePlane<Mesh>(() => {
    return {
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, -0.5, 0]
    }
  })

  return (
    <mesh
      ref={ref}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={bedrockTexture} />
    </mesh>
  )
}
