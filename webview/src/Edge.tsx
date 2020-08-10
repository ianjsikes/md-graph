import React from 'react'
import { animated, useSpring } from 'react-spring'
import { D3Node, GraphConfig } from './types'
import { clampedZoom } from './utils'

interface Props {
  edge: { source: D3Node; target: D3Node }
  zoomLevel: number
  centerX?: number
  centerY?: number
  config?: GraphConfig
}

const Edge: React.FC<Props> = (props) => {
  const fadeDepth = props.config?.fadeDepth ?? 0
  const isFaded =
    fadeDepth === 0
      ? false
      : fadeDepth < props.edge.source.level ||
        fadeDepth < props.edge.target.level

  const edgeWidth = clampedZoom(1, props.zoomLevel)

  const [animProps, setAnim] = useSpring(() => ({
    x1: props.centerX || 0,
    y1: props.centerY || 0,
    x2: props.centerX || 0,
    y2: props.centerY || 0,
  }))
  React.useEffect(() => {
    setAnim({
      x1: props.edge.source.x,
      y1: props.edge.source.y,
      x2: props.edge.target.x,
      y2: props.edge.target.y,
    })
  }, [
    props.edge.source.x,
    props.edge.source.y,
    props.edge.target.x,
    props.edge.target.y,
  ])

  return (
    <animated.line
      strokeWidth={edgeWidth}
      x1={animProps.x1}
      y1={animProps.y1}
      x2={animProps.x2}
      y2={animProps.y2}
      strokeOpacity={isFaded ? 0.4 : 1}
    />
  )
}
Edge.displayName = 'Edge'

export default Edge
