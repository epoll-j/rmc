import { useState } from 'react'
import { PointerLockControls, Sky } from "@react-three/drei";
import './App.css'
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { Terrain } from './component/terrain/index'
import { Player } from './component/player/index'
import { Ground } from './Ground'

function App() {

  return (
    <>
      <Canvas>
        <Sky />
        <ambientLight intensity={0.5} />
        <PointerLockControls />
        <Physics>
          <Player></Player>
          <Terrain></Terrain>
          <Ground></Ground>
        </Physics>
      </Canvas>
    </>
  )
}

export default App
