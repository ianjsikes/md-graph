import React from 'react'
import { animated, useSpring } from 'react-spring'
import { D3Node, GraphConfig } from './types'
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
  centerX?: number
  centerY?: number
  config?: GraphConfig
}

const Node: React.FC<Props> = (props) => {
  const fadeDepth = props.config?.fadeDepth ?? 0
  const isFaded = fadeDepth === 0 ? false : fadeDepth < props.node.level

  const onClick = () => {
    vscode.postMessage({ type: 'click', payload: props.node })
  }

  const nodeSize = clampedZoom(4, props.zoomLevel)
  const fontSize = Math.max(Math.round(clampedZoom(14, props.zoomLevel)), 1)
  const labelOffset = clampedZoom(15, props.zoomLevel)

  const [animProps, setAnim] = useSpring(() => ({
    x: props.centerX,
    y: props.centerY,
  }))
  React.useEffect(() => {
    setAnim({ x: props.node.x, y: props.node.y })
  }, [props.node.x, props.node.y])

  return (
    <>
      <animated.text
        fill={props.active ? activeColor : inactiveColor}
        x={animProps.x}
        y={animProps.y.interpolate((y) => y! - labelOffset)}
        opacity={isFaded ? 0.4 : 1}
        fontSize={`${fontSize}px`}
        textAnchor="middle"
        alignmentBaseline="central"
        onClick={onClick}
      >
        {props.node.label.replace(/_*/g, '')}
      </animated.text>
      <animated.circle
        cx={animProps.x}
        cy={animProps.y}
        r={nodeSize}
        opacity={isFaded ? 0.4 : 1}
        onClick={onClick}
        fill={props.active ? activeColor : inactiveColor}
      />
    </>
  )
}

export default Node
