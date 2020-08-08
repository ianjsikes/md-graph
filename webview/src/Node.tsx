import React from 'react'
import { animated, useSpring } from 'react-spring'
import { D3Node } from './types'
import { clampedZoom } from './utils'

const inactiveColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--vscode-editor-foreground')
const activeColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--vscode-textLink-foreground'
)

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

  const { x, y } = useSpring({ x: props.node.x, y: props.node.y })

  return (
    <>
      <animated.text
        fill={props.active ? activeColor : inactiveColor}
        x={x}
        y={y.interpolate((y) => y! - labelOffset)}
        opacity={1}
        fontSize={`${fontSize}px`}
        textAnchor="middle"
        alignmentBaseline="central"
        onClick={onClick}
      >
        {props.node.label.replace(/_*/g, '')}
      </animated.text>
      <animated.circle
        cx={x}
        cy={y}
        r={nodeSize}
        opacity={1}
        onClick={onClick}
        fill={props.active ? activeColor : inactiveColor}
      />
    </>
  )
}

export default Node
