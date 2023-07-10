import { useRef, useEffect, useMemo } from 'react'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
import { BoxGeometry, Camera, CapsuleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Octree } from 'three/examples/jsm/math/Octree'
import useKeyboard from './useKeyboard'
import { useCameraHelper } from '@/hooks/useCameraHelper'
import { CollideControl } from './control/CollideControl'

const GRAVITY = 30
const STEPS_PER_FRAME = 5

const collideControls = new CollideControl()

export default function Player() {
  // const [helperCamera, controls1] = useCameraHelper()
  const playerOnFloor = useRef(false)
  const ref = useRef<Mesh>(null)
  const playerVelocity = useMemo(() => new Vector3(), [])
  const playerDirection = useMemo(() => new Vector3(), [])
  const capsule = useMemo(() => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5), [])
  // let clicked = 0

  // const onPointerDown = () => {
  //   throwBall(camera, capsule, playerDirection, playerVelocity, clicked++)
  // }
  // useEffect(() => {
  //   document.addEventListener('pointerdown', onPointerDown)
  //   return () => {
  //     document.removeEventListener('pointerdown', onPointerDown)
  //   }
  // })

  // useEffect(() => {
  //   colliders[ballCount] = { capsule: capsule, velocity: playerVelocity }
  // }, [colliders, ballCount, capsule, playerVelocity])

  const keyboard = useKeyboard()

  function getForwardVector(camera: Camera, playerDirection: Vector3) {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    return playerDirection
  }

  function getSideVector(camera: Camera, playerDirection: Vector3) {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    playerDirection.cross(camera.up)
    return playerDirection
  }

  function controls(camera: Camera, delta: number, playerVelocity: Vector3, playerOnFloor: boolean, playerDirection: Vector3) {
    const speedDelta = delta * (playerOnFloor ? 25 : 8)
    keyboard['KeyA'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(-speedDelta))
    keyboard['KeyD'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(speedDelta))
    keyboard['KeyW'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(speedDelta))
    keyboard['KeyS'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta))
    if (playerOnFloor) {
      if (keyboard['Space']) {
        playerVelocity.y = 15
      }
    }
  }

  function updatePlayer(camera: Camera, delta: number, octree: Octree, capsule: Capsule, playerVelocity: Vector3, playerOnFloor: boolean) {
    let damping = Math.exp(-4 * delta) - 1
    if (!playerOnFloor) {
      playerVelocity.y -= GRAVITY * delta
      damping *= 0.1 // small air resistance
    }
    playerVelocity.addScaledVector(playerVelocity, damping)
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta)
    const result = octree.capsuleIntersect(capsule)
    // if (result) {
    //   if (result.normal.x != 0) {
    //     deltaPosition.setX(0)
    //   }
    //   if (result.normal.z != 0) {
    //     deltaPosition.setZ(0)
    //   }
    // }
    capsule.translate(deltaPosition)

    playerOnFloor = playerCollisions(capsule, result, playerVelocity)
    camera.position.copy(capsule.end)
 
    return playerOnFloor
  }

  function playerCollisions(capsule: Capsule, result: any, playerVelocity: Vector3) {
    // const result = octree.capsuleIntersect(capsule)
    let playerOnFloor = false
    if (result) {
      // console.log(result.normal, result.depth)
      playerOnFloor = result.normal.y > 0
      if (!playerOnFloor) {
        playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity))
      }
      // if (result.normal.x == 0 && result.normal.z == 0) {
      capsule.translate(result.normal.multiplyScalar(result.depth))
      // capsule.translate
      
      // } else {
      //   if (result.normal.x != 0) {
      //     playerDirection.setX(0)
      //   }
      //   if (result.normal.z != 0) {
      //     playerDirection.setZ(0)
      //   }
      // }
    }
    return playerOnFloor
  }

  function teleportPlayerIfOob(camera: Camera, capsule: Capsule, playerVelocity: Vector3) {
    if (camera.position.y <= -100) {
      playerVelocity.set(0, 0, 0)
      capsule.start.set(0, 100, 0)
      capsule.end.set(0, 101, 0)
      camera.position.copy(capsule.end)
      camera.rotation.set(0, 0, 0)
    }
  }

  useFrame(({ camera, scene }, delta) => {
    controls(camera, delta, playerVelocity, playerOnFloor.current, playerDirection)
    const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME
    const octree = collideControls.buildOctree(camera.position)
    // const octree = new Octree().fromGraphNode(scene)
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      playerOnFloor.current = updatePlayer(camera, deltaSteps, octree, capsule, playerVelocity, playerOnFloor.current)
    }
    teleportPlayerIfOob(camera, capsule, playerVelocity)
  })


  return (
    <>
      <mesh position={[0, 100, 0]} ref={ref}>
        <capsuleGeometry args={[0.35, 0.7, 4, 8]}></capsuleGeometry>
      </mesh>
    </>
  )
}
