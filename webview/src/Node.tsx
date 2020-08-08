import React, { Suspense } from 'react'
import * as THREE from 'three'
import font from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
// import { animated, useSpring } from 'react-spring'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'
import { D3Node } from './types'
import { clampedZoom } from './utils'
import Label from './Label'

const inactiveColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--vscode-editor-foreground')
const activeColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--vscode-textLink-foreground'
)

const FONT = new THREE.Font(font)

interface Props {
  node: D3Node
  active: boolean
  zoomLevel: number
}

const Node: React.FC<Props> = (props) => {
  const onClick = () => {
    vscode.postMessage({ type: 'click', payload: props.node })
  }

  const nodeSize = clampedZoom(4, props.zoomLevel)
  const fontSize = Math.max(Math.round(clampedZoom(14, props.zoomLevel)), 1)
  const labelOffset = clampedZoom(15, props.zoomLevel)

  const { x, y } = useSpring({ x: props.node.x!, y: props.node.y! })
  const yOffset = y.to(
    [-10000, 10000],
    [-10000 + labelOffset, 10000 + labelOffset]
  )

  return (
    <>
      <a.mesh visible position-x={x} position-y={y} position-z={-10}>
        <circleBufferGeometry attach="geometry" args={[10, 16]} />
        <meshBasicMaterial
          attach="material"
          color={props.active ? activeColor : inactiveColor}
        />
      </a.mesh>
      <Label
        x={x}
        y={yOffset}
        color={props.active ? activeColor : inactiveColor}
        text={props.node.label.replace(/_*/g, '')}
      />
    </>
  )
  // return (
  //   <>
  //     <a.mesh visible position-x={x} position-y={y} position-z={-10}>
  //       <circleBufferGeometry attach="geometry" args={[10, 16]} />
  //       <meshBasicMaterial
  //         attach="material"
  //         color={props.active ? activeColor : inactiveColor}
  //       />
  //     </a.mesh>
  //     <a.mesh visible position-x={x} position-y={yOffset} position-z={-8}>
  //       <textBufferGeometry
  //         args={[
  //           props.node.label.replace(/_*/g, ''),
  //           {
  //             font: FONT,
  //             height: 1,
  //             size: 10,
  //           },
  //         ]}
  //         attach="geometry"
  //       />
  //       <meshBasicMaterial
  //         attach="material"
  //         color={props.active ? activeColor : inactiveColor}
  //       />
  //     </a.mesh>
  //   </>
  // )
}

export default Node
