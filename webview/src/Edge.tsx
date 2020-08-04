import React from 'react'
import { animated, useSpring } from 'react-spring'
import { D3Node } from './types'
import { clampedZoom } from './utils'

interface Props {
  edge: { source: D3Node; target: D3Node }
  zoomLevel: number
}

const Edge: React.FC<Props> = (props) => {
  const edgeWidth = clampedZoom(1, props.zoomLevel)
  const { x1, y1, x2, y2 } = useSpring({
    x1: props.edge.source.x,
    y1: props.edge.source.y,
    x2: props.edge.target.x,
    y2: props.edge.target.y,
  })

  return (
    <animated.line strokeWidth={edgeWidth} x1={x1} y1={y1} x2={x2} y2={y2} />
  )
}

export default Edge
