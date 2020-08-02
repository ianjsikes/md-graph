import React from 'react'
import * as d3 from 'd3'

interface Props {
  svg: SVGSVGElement | null
}

// The idea for this component came from this blog post
// https://adamcarter.dev/creating-visualizations-with-d3-and-react/
const ZoomContainer: React.FC<Props> = ({ svg, children }) => {
  const [{ x, y, k }, setTransform] = React.useState({ x: 0, y: 0, k: 1 })

  React.useEffect(() => {
    if (!svg) return

    const selection = d3.select(svg)
    const zoom = d3.zoom().on('zoom', () => {
      setTransform(d3.event.transform)
    })
    selection.call(zoom as any)

    return () => {
      selection.on('zoom', null)
    }
  }, [svg])

  return <g transform={`translate(${x}, ${y}) scale(${k})`}>{children}</g>
}

export default ZoomContainer
