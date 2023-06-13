/* eslint-disable @typescript-eslint/ban-ts-comment */
import useEffectState from "@/hooks/useEffectState";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect } from "react";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

let frontMove, sideMove
const SPEED = 1

export const MoveControls = forwardRef((props, ref) => {
  const { camera, gl, invalidate } = useThree();
  const [, get] = useKeyboardControls()
  const controls = useEffectState<PointerLockControls>(
    () => new PointerLockControls(camera, gl.domElement),
    [camera, gl.domElement],
    ref
  );

  useEffect(() => {
    if (controls) {
      controls.lock()
      // @ts-ignore
      controls.addEventListener("change", invalidate);
      // @ts-ignore
      return () => controls.removeEventListener("change", invalidate);
    }
  }, [controls, invalidate]);

  useFrame(() => {
    if (controls) {
      const { forward, backward, left, right, jump } = get()
      frontMove = Number(forward) - Number(backward)
      sideMove = Number(right) - Number(left)

      if (frontMove) {
        controls.moveForward(frontMove * SPEED)
      }
      if (sideMove) {
        controls.moveRight(sideMove * SPEED)
      }
    }
  })

  return controls ? <primitive dispose={undefined} object={controls} {...props} ref={ref} /> : null
})