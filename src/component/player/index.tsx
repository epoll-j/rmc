import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { Mesh, Vector3 } from "three"
import useFPS from "@/hooks/useFPS"
import { useBlocks } from "@/hooks/store/useBlocks"
import { CollideControl, CollideSide } from "./control/collideControl"

let speed = 0
const frontDirection = new Vector3()
const sideDirection = new Vector3()
const runMultiplier = 1.15
const blocksPerSec = 5
const control = new CollideControl()

export const Player = () => {
  const ref = useRef<Mesh>(null)
  const fpsRef = useFPS()
  const [, get] = useKeyboardControls()
  // const { blockMap } = useBlocks()

  useFrame((state) => {
    const { forward, backward, left, right, shift } = get()
    if (ref.current) {
      speed = (blocksPerSec + blocksPerSec * Number(shift) * runMultiplier) / fpsRef.current
      if (speed != Infinity) {
        state.camera.position.copy(ref.current.position)
        frontDirection.set(0, 0, Number(backward) - Number(forward))
        sideDirection.set(Number(left) - Number(right), 0, 0)

        const finalDirection = new Vector3()
        finalDirection.addVectors(frontDirection, sideDirection)
        finalDirection.multiplyScalar(speed)
        finalDirection.applyEuler(state.camera.rotation)

        ref.current.position.set(ref.current.position.x + finalDirection.x, ref.current.position.y - (control.check(CollideSide.down, state.camera.position) ? 0 : speed), ref.current.position.z + finalDirection.z)
      }
    }
  })
  return (
    <>
      <mesh position={[8, 60, 8]} ref={ref}></mesh>
    </>
  )
}