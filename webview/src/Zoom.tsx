import React, { ReactElement } from 'react'
import * as d3 from 'd3'

interface Props {
  svg: SVGSVGElement | null
  // scaleExtent?: [number, number]
  scaleMin?: number
  scaleMax?: number
  // translateExtent?: [[number, number], [number, number]]
  // extent?: [[number, number], [number, number]]
  render: (props: { x: number; y: number; k: number }) => ReactElement
}

// The idea for this component came from this blog post
// https://adamcarter.dev/creating-visualizations-with-d3-and-react/
const ZoomContainer = React.forwardRef<
  d3.ZoomBehavior<SVGSVGElement, unknown>,
  Props
>(({ svg, scaleMin, scaleMax, render }, ref) => {
  const [{ x, y, k }, setTransform] = React.useState({ x: 0, y: 0, k: 1 })
  const zoomRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>()

  React.useEffect(() => {
    if (!svg) return
    console.log('setting up zoom', svg, scaleMin, scaleMax)

    const selection = d3.select(svg)
    zoomRef.current = d3.zoom()
    const zoom = zoomRef.current

    // if (scaleExtent) zoom.scaleExtent(scaleExtent)
    // if (translateExtent) zoom.translateExtent(translateExtent)
    // if (extent) zoom.extent(extent)
    if (scaleMin !== undefined && scaleMax !== undefined) {
      zoom.scaleExtent([scaleMin, scaleMax])
    }

    zoom.on('zoom', () => {
      setTransform(d3.event.transform)
    })
    selection.call(zoom as any)

    return () => {
      selection.on('.zoom', null)
    }
  }, [svg, scaleMin, scaleMax])

  React.useImperativeHandle(ref, () => zoomRef.current!)

  return (
    <g transform={`translate(${x}, ${y}) scale(${k})`}>{render({ x, y, k })}</g>
  )
})

export default ZoomContainer
