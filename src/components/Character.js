import { useFrame, useThree } from '@react-three/fiber'
import Man from './Man';
import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import { useBox } from '@react-three/cannon'
const STEP = 150;
const SITTING_STEP = 250;

CameraControls.install({ THREE })

function calculateForward({collide, axis, goTo, direction, step}) {
  if (collide) {
    if (goTo[axis] + (direction[axis] / step) < collide[axis][0] 
    && goTo[axis] + (direction[axis] / step) > collide[axis][1]) return goTo[axis]
    return goTo[axis] + (direction[axis] / step)
  }
  return goTo[axis] + (direction[axis] / step)
}

function calculateBackward({collide, axis, goTo, direction, step}) {
  if (collide) {
    if (goTo[axis] - (direction[axis] / step) < collide[axis][0] 
    && goTo[axis] - (direction[axis] / step) > collide[axis][1]) return goTo[axis]
    return goTo[axis] - (direction[axis] / step)
  }
  return goTo[axis] - (direction[axis] / step)
}

export default function Character(props){
    const [action, setAction] = useState([]);
    const [actions, setActions] = useState({})
    const [goTo, setGoTo] = useState({x:0, y:0, z:0});
    const [faceRotation, setFaceRotation] = useState(0);
    const [characterSitting, setCharacterSitting] = useState(false);
    const [characterStanding, setCharacterStanding] = useState(true);
    const [ playingAnimation, setPlayingAnimation ] = useState('Idle');
    const [direction, setDirection] = useState({});
    const [mouse, setMouse] = useState(new THREE.Vector2());
    const [collide, setCollide] = useState();
    const boxSize = [0.07,0.17,0.09];
    const [ref, api] = useBox(() => ({ 
      type: "Kinematic", 
      mass: 1, 
      args: boxSize, 
      position: [0, 0.09, 0], 
      onCollideBegin: (e) => {
        let scale = e.body.getWorldScale(new THREE.Vector3());
        let position = e.body.getWorldPosition(new THREE.Vector3());

        if(e.body.userData.type === 'Static') setCollide({
           x: [position.x + scale.x / 2, position.x - scale.x / 2], 
           y: [position.y + scale.y / 2, position.y - scale.y / 2],
           z: [position.z + scale.z / 2, position.z - scale.z / 2]
          })
      }, 
      onCollideEnd: (e) => setCollide(false) 
    }))
   
    useEffect(() => {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Control') setCharacterSitting(false);
          setAction([e.key, true])
        })
        document.addEventListener('keyup', (e) => {
          if (e.key === 'Control') setCharacterStanding(false);
          setAction([e.key, false])
        })
        document.addEventListener('mousemove', (e) => {
          setFaceRotation(-((e.clientX / window.innerWidth) * 2 - 1) * 3)
          setMouse({
            x : (e.clientX / window.innerWidth) * 2 - 1,
            y : -(e.clientY / window.innerHeight) * 2 + 1
          })
        });
      }, [])
    
    
      useEffect(() => {
        if (action?.length) setActions({...actions, [action[0]]: action[1]})
      }, [ action ])

      function Controls({pos = new THREE.Vector3(), look = new THREE.Vector3() }) {
        const camera = useThree((state) => state.camera)
        const gl = useThree((state) => state.gl)
        const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])
        return useFrame((state, delta) => {
          if (characterStanding) {
            if(actions?.Control) {
              if (characterSitting) setPlayingAnimation('CrouchIdle')
              else {
                setPlayingAnimation('CrouchDown')
                setTimeout(() => {
                  setCharacterSitting(true)
                }, 820)
              }
            }
            
            if (actions?.w) {
              if (actions?.Control) {
                setGoTo({
                  ...goTo,
                  z : calculateForward({ collide, axis: 'z', goTo, direction, step: SITTING_STEP }),
                  x : calculateForward({ collide, axis: 'x', goTo, direction, step: SITTING_STEP })
                })
                setPlayingAnimation('CrouchWalk')
              } else {
                setGoTo({
                  ...goTo,
                  z : calculateForward({ collide, axis: 'z', goTo, direction, step: STEP }),
                  x : calculateForward({ collide, axis: 'x', goTo, direction, step: STEP })
                })
                setPlayingAnimation('Run') 
              }
            }
    
          if (actions?.s) {
            if (actions?.Control) {
              setGoTo({
                ...goTo,
                z : calculateBackward(({ collide, axis: 'z', goTo, direction, step: SITTING_STEP })),
                x : calculateBackward(({ collide, axis: 'x', goTo, direction, step: SITTING_STEP }))
              })
              setPlayingAnimation('CrouchBack')
            } else {
              setGoTo({
                ...goTo,
                z : calculateBackward(({ collide, axis: 'z', goTo, direction, step: STEP })),
                x : calculateBackward(({ collide, axis: 'x', goTo, direction, step: STEP }))
              })
              setPlayingAnimation('RunBack') 
            }
          }
          } else {
              setPlayingAnimation('CrouchUp')
              setTimeout(() => {
                setCharacterStanding(true)
              }, 820)
          }

          // if (mouse?.x < -0.9) setFaceRotation(faceRotation + 0.080)
          // if (mouse?.x > 0.9) setFaceRotation(faceRotation - 0.080)
          // if (mouse?.x < -0.8 && mouse?.x > -0.9 ) setFaceRotation(faceRotation + 0.060)
          // if (mouse?.x > 0.8 && mouse?.x < 0.9) setFaceRotation(faceRotation - 0.060)
          // if (mouse?.x < -0.7 && mouse?.x > -0.8) setFaceRotation(faceRotation + 0.040)
          // if (mouse?.x > 0.7 && mouse?.x < 0.8) setFaceRotation(faceRotation - 0.040)
          // if (mouse?.x < -0.6 && mouse?.x > -0.7) setFaceRotation(faceRotation + 0.030)
          // if (mouse?.x > 0.6 && mouse?.x < 0.7) setFaceRotation(faceRotation - 0.030)
          // if (mouse?.x < -0.5 && mouse?.x > -0.6) setFaceRotation(faceRotation + 0.020)
          // if (mouse?.x > 0.5 && mouse?.x < 0.6) setFaceRotation(faceRotation - 0.020)
          // if (mouse?.x < -0.4 && mouse?.x > -0.5) setFaceRotation(faceRotation + 0.010)
          // if (mouse?.x > 0.4 && mouse?.x < 0.5) setFaceRotation(faceRotation - 0.010)

          if (!Object.values(actions).includes(true)) setPlayingAnimation('Idle')

          api.position.set(goTo.x, 0.09, goTo.z);
          api.rotation.set(0, faceRotation, 0);

          pos.set(goTo?.x, 0.2, goTo?.z)
          look.set((goTo?.x + direction?.x) || 0,  mouse.y, (goTo?.z + direction?.z || 0))
      
          state.camera.position.lerp(pos, 0.5)
          state.camera.updateProjectionMatrix()
      
          controls.setLookAt(state.camera.position.x, state.camera.position.y, state.camera.position.z, look.x, look.y, look.z, false)
          return controls.update(delta)
        })
      }

    return (
        <mesh scale={[0.1, 0.1, 0.1]}  rotation={[0, faceRotation, 0]} position={[goTo?.x || 0, 0, goTo?.z || 0]}>
            <Man ref={ref} rotation={[Math.PI / 2, 0, 0]} scale={0.01} setDirection={setDirection} faceRotation={faceRotation} playingAnimation={playingAnimation} />
            <Controls />
        </mesh>
    )
}