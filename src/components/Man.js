/* eslint-disable react-hooks/rules-of-hooks */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'


export default function Model({ ...props }) {
  const group = useRef();
  const direction = useRef();
  const vector = new THREE.Vector3();
  const { setDirection, faceRotation, playingAnimation } = props;
  const { nodes, materials, animations } = useGLTF('/man2.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    direction.current.rotation.x = -2;
  }, [])

  useEffect(() => {
    setDirection(direction.current.getWorldDirection(vector))
  }, [ faceRotation ])

  useEffect(() => {
    Object.keys(actions).forEach(action => actions[action].stop())
    actions[playingAnimation].play()
  }, [ playingAnimation ])

  return (
    <group ref={group} {...props} dispose={null}>
      <group>
        <group>
          <group ref={direction} />
          <primitive object={nodes.mixamorig1Hips} />
          <skinnedMesh geometry={nodes.Ch36.geometry} castShadow material={materials.Ch36_Body} skeleton={nodes.Ch36.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/man2.glb')