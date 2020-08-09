import React from 'react'
import * as d3 from 'd3'
import { D3Node, Mode } from './types'
import { useWindowSize, tickUntilDone, createD3Data } from './utils'
import Node from './Node'
import Edge from './Edge'
import ZoomContainer from './Zoom'
import { useGraphState } from './vscode'
import seedrandom from 'seedrandom'

interface Props {}

const Graph: React.FC<Props> = () => {
  const state = useGraphState()
  const [svgRef, setSvgRef] = React.useState<SVGSVGElement | null>(null)
  const zoomRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null)
  const { width, height } = useWindowSize()

  const simulation = React.useMemo(() => {
    const simulation = d3
      .forceSimulation<D3Node>()
      .force(
        'center',
        d3.forceCenter<D3Node>((width || 0) / 2, (height || 0) / 2)
      )
      .force(
        'link',
        d3
          .forceLink<D3Node, d3.SimulationLinkDatum<D3Node>>()
          .id((d) => d.id)
          .distance(50)
      )
      .force('charge', d3.forceManyBody<D3Node>().strength(-500))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaDecay(0.05)
      .alphaMin(0.01)
      .stop()

    return simulation
  }, [])

  React.useEffect(() => {
    simulation.force(
      'center',
      d3.forceCenter((width || 0) / 2, (height || 0) / 2)
    )
  }, [width, height])

  const [nodes, edges] = React.useMemo(() => {
    let [nodes, edges] = createD3Data(state)

    seedrandom('md-graph', { global: true })
    simulation.nodes(nodes)
    simulation
      .force<d3.ForceLink<D3Node, d3.SimulationLinkDatum<D3Node>>>('link')
      ?.links(edges)
    simulation.alpha(1).restart()
    simulation.stop()
    tickUntilDone(simulation)

    const currNode: D3Node = state.graph[state.currentNode!]
    const selection = d3.select(svgRef!)
    zoomRef.current?.translateTo(
      selection as any,
      currNode.x as any,
      currNode.y as any
    )

    return [nodes, edges]
  }, [state])

  if (!nodes || !nodes.length) {
    console.log('rendering no nodes', Date.now())
  } else {
    console.log('rendering SOME nodes', Date.now())
  }

  const currNode: D3Node = state.graph[state.currentNode!]
  const setMode = (mode: Mode) =>
    vscode.postMessage({ type: 'mode', payload: mode })

  return (
    <div>
      <svg ref={(s) => setSvgRef(s)} width={width} height={height}>
        <ZoomContainer
          ref={zoomRef}
          svg={svgRef}
          scaleMin={0.2}
          scaleMax={3}
          render={({ k }) => {
            return (
              <>
                <g className="links">
                  {edges.map((edge) => (
                    <Edge
                      key={`${(edge.source as any).id}-${
                        (edge.target as any).id
                      }`}
                      edge={edge as any}
                      zoomLevel={k}
                      centerX={currNode?.x}
                      centerY={currNode?.y}
                      config={state.config}
                    />
                  ))}
                </g>
                <g className="nodes">
                  {nodes.map((node) => (
                    <Node
                      key={`node-${node.id}`}
                      node={node}
                      active={node.id === state.currentNode}
                      zoomLevel={k}
                      centerX={currNode?.x}
                      centerY={currNode?.y}
                      config={state.config}
                    />
                  ))}
                </g>
              </>
            )
          }}
        />
      </svg>
      <div className="bottomRightContainer">
        <div id="mode-select">
          <button
            id="mode-all"
            className={state.mode === 'ALL' ? 'active' : undefined}
            onClick={() => setMode('ALL')}
          >
            ALL
          </button>
          <button
            id="mode-focus"
            className={state.mode === 'FOCUS' ? 'active' : undefined}
            onClick={() => setMode('FOCUS')}
          >
            FOCUS
          </button>
        </div>
      </div>
    </div>
  )
}

export default Graph
