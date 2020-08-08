import React from 'react'
import * as THREE from 'three'
import { SpringValue, Interpolation } from '@react-spring/core'
import { a } from '@react-spring/three'

interface Props {
  x: Interpolation<number, number> | SpringValue<number> | number
  y: Interpolation<number, number> | SpringValue<number> | number
  color: string
  text: string
}

const Label: React.FC<Props> = (props) => {
  const canvas = React.useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    return canvas
  }, [])

  const texture = React.useMemo(() => {
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = props.color
    ctx.font = '64px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillText(props.text, 128, 64)

    return new THREE.CanvasTexture(canvas)
  }, [props.text, props.color])

  return (
    <a.mesh visible position-x={props.x} position-y={props.y} position-z={-8}>
      <planeBufferGeometry args={[256, 128]} />
      <meshBasicMaterial attach="material" transparent={false} map={texture} />
    </a.mesh>
  )
}

export default Label
