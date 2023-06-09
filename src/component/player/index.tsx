import { useRef } from "react"
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls"
import { useFrame, useThree } from "@react-three/fiber"
import { useHelper, useKeyboardControls } from "@react-three/drei"
import { Mesh, Vector3 } from "three"
import useEffectState from "@/hooks/useEffectState"


const SPEED = 10
const frontDirection = new Vector3()
const sideDirection = new Vector3()
const frontVector = new Vector3()


export const Player = () => {
  const ref = useRef<Mesh>(null)
  const { controls } = useThree()
  // const [, get] = useKeyboardControls()
  // const controls = useEffectState(() => new PointerLockControls(camera, gl.domElement), [camera, gl.domElement])

  useFrame((state) => {
    console.log(state, controls)
    // const { forward, backward, left, right, jump } = get()
    // if (ref.current) {
    //   state.camera.position.copy(ref.current.position)
    //   frontDirection.set(0, 0, Number(backward) - Number(forward))
    //   sideDirection.set(Number(left) - Number(right), 0, 0)

    //   const finalDirection = new Vector3()
    //   finalDirection.addVectors(frontDirection, sideDirection)
    //   finalDirection.multiplyScalar(SPEED)
    //   finalDirection.applyEuler(state.camera.rotation)

    //   ref.current.position.set(finalDirection.x, 0, finalDirection.z)
    // }
  })
  return (
    <>
      <mesh ref={ref}></mesh>
    </>
  )
}
