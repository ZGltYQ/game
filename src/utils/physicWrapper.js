/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useMemo } from 'react'
import { useConvexPolyhedron } from '@react-three/cannon'
import { Geometry } from 'three-stdlib'

export default function usePhysic(nodes, props) {
    const result = {};

    const bufferGeometries = Object.values(nodes).filter(node => node?.geometry);

    const mergedVertices = bufferGeometries.map(bufferGeometry => {
      const geo = new Geometry().fromBufferGeometry(bufferGeometry.geometry);
      geo.mergeVertices();
      return {name: bufferGeometry.name, value: [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]}
    })

    for (let bufferGeo of mergedVertices) {
      const memo = useMemo(() => bufferGeo.value, [nodes])
      const Convex = useConvexPolyhedron(() => ({ mass: 1, args: memo, ...props }))
      result[bufferGeo.name] = {
        ref : Convex[0],
        props : Convex[1]
      }
    }
    
    return result
  }