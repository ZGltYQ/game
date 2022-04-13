import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, Torus } from '@react-three/drei'
import Character from './components/Character';
import GrassTexture from './components/GrassTexture';
import { Physics, Debug, useBox } from '@react-three/cannon'
import Wheelchair from './components/Wheelchair'

function App() {
  
  function Cube(props) {
    const [ref] = useBox(() => ({ type: "Static", args: [1,1,1], mass: 1, position: [2, 0, 0], ...props }))
    return (
      <mesh ref={ref}>
        <boxGeometry />
      </mesh>
    )
  }

  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, -1], fov: 50, far: 1000 }}>
        <ambientLight intensity={0.3} />
        <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[5, 25, 20]} />
        <Suspense fallback={null}>
        <Physics>
          {/* <Debug> */}
          <Wheelchair scale={[0.1, 0.1, 0.1]} position={[1,1,1]}/>
          {/* <GrassTexture userData={{type: 'Static'}} receivesShadow rotation={[0, 0, -(Math.PI / 2)]} position={[2,5, 2]} /> */}
          <GrassTexture receiveShadow rotation={[-Math.PI / 2, 0, 0]} />
          <Cube userData={{ type: "Static" }}/>
          <Character />
          <Environment preset="sunset" background />
          {/* </Debug> */}
          </Physics>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
