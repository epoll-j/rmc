import { useTexture } from "@react-three/drei";
import bedrock from '@/assets/textures/block/bedrock.png'
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { NearestFilter, RepeatWrapping } from "three";
// import Worker from './worker?worker'

export const Bedrock = () => {
  // const [size, setSize] = useState(100)

  const bedrockTexture = useTexture(bedrock)
  bedrockTexture.magFilter = NearestFilter
  bedrockTexture.wrapS = RepeatWrapping
  bedrockTexture.wrapT = RepeatWrapping
  // bedrockTexture.repeat.set(size, size)

  // const { camera } = useThree()
  // useFrame(() => {
  //   const maxSize = size / 3
  //   if (Math.abs(camera.position.x) >= maxSize || Math.abs(camera.position.z) >= maxSize) {
  //     setSize(size * 1.2)
  //   }
  // })

  // useEffect(() => {
  //   const generate = new Worker()
  //   generate.postMessage({
  //     bedrockSize: size
  //   })
  // }, [])

  // const [ref] = usePlane<Mesh>(() => {
  //   return {
  //     rotation: [-Math.PI / 2, 0, 0],
  //     position: [0, -0.5, 0]
  //   }
  // })

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={bedrockTexture} map-repeat={[1000, 1000]} />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  )
}
