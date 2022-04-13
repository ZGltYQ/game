import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon'

export default function Grass(props) {
    const colorMap = useLoader(TextureLoader, 'stones.png');
    const [ref, state] = usePlane(() => ({ mass: 0, ...props }))

    return (
        <mesh receiveShadow ref={ref}>
          <planeGeometry attach="geometry" args={[100, 100]} />
          <meshStandardMaterial attach="material" map={colorMap}/>
        </mesh>
    )
  }
  