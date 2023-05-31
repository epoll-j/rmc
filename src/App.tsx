import { PointerLockControls, Sky } from "@react-three/drei";
import './App.css'
import { Physics } from '@react-three/cannon'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Terrain } from './component/terrain/index'
import { Player } from './component/player/index'
import { Bedrock } from './component/terrain/bedrock'

function App() {
  return (
    <Canvas>
      <Sky />
      <ambientLight intensity={0.5} />
      <PointerLockControls />
      <Physics>
        <Player></Player>
        <Terrain></Terrain>
        <Bedrock></Bedrock>
      </Physics>
    </Canvas>
  )
}

export default App
