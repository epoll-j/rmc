import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { Mesh, Vector3 } from "three"
import useFPS from "@/hooks/useFPS"

let speed = 0
const frontDirection = new Vector3()
const sideDirection = new Vector3()
const runMultiplier = 1.15
const blocksPerSec = 5

export const Player = () => {
  const ref = useRef<Mesh>(null)
  const fpsRef = useFPS()
  const [, get] = useKeyboardControls()

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
        ref.current.position.set(ref.current.position.x + finalDirection.x, 0, ref.current.position.z + finalDirection.z)
      }
    }
  })
  return (
    <>
      <mesh ref={ref}></mesh>
    </>
  )
}