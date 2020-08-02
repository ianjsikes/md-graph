import React from 'react'
import * as d3 from 'd3'
import { Node, Edge } from './types'
import { useGraphState } from './vscode'
import { useWindowSize, tickUntilDone } from './utils'

type D3Node = Node & d3.SimulationNodeDatum
const Graph: React.FC<{}> = () => {
  const state = useGraphState()
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
          .distance(70)
      )
      .force('charge', d3.forceManyBody<D3Node>().strength(-300))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaDecay(0.05)
      .alphaMin(0.01)
      .stop()

    return simulation
  }, [])

  const [nodes, edges] = React.useMemo(() => {
    let nodes = Object.values(state.graph) as D3Node[]
    let edges = d3.merge<d3.SimulationLinkDatum<D3Node>>(
      nodes.map((source) => {
        return source.links.map((target) => ({
          source: source.id,
          target,
        }))
      })
    )

    simulation.nodes(nodes)
    simulation
      .force<d3.ForceLink<D3Node, d3.SimulationLinkDatum<D3Node>>>('link')
      ?.links(edges)
    simulation.alpha(1).restart()
    simulation.stop()
    tickUntilDone(simulation)

    return [nodes, edges]
  }, [state])

  return (
    <svg width={width} height={height}>
      <g>
        <g className="links">
          {edges.map((edge) => (
            <line
              key={`${edge.source}-${edge.target}`}
              strokeWidth={1}
              x1={(edge.source as any).x}
              y1={(edge.source as any).y}
              x2={(edge.target as any).x}
              y2={(edge.target as any).y}
            />
          ))}
        </g>
        <g className="nodes">
          {nodes.map((node) => (
            <circle
              key={`node-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={4}
              opacity={1}
            />
          ))}
        </g>
        <g className="text">
          {nodes.map((node) => (
            <text
              key={`text-${node.id}`}
              x={node.x}
              y={(node.y || 0) - 15}
              opacity={1}
              fontSize="14px"
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {node.label.replace(/_*/g, '')}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}

export default Graph
