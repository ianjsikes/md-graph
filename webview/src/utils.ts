import { useState, useEffect } from 'react'
import { State, D3Node } from './types'
import * as d3 from 'd3'

interface WindowSize {
  width?: number
  height?: number
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    // Call resize handler immediately to get the initial size
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Calls simulation.tick() until the simulation is done
 */
export const tickUntilDone = <
  Node extends d3.SimulationNodeDatum,
  Link extends d3.SimulationLinkDatum<Node>
>(
  simulation: d3.Simulation<Node, Link>
) => {
  simulation.stop()
  for (
    let i = 0,
      n = Math.ceil(
        // https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
        Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
      );
    i < n;
    ++i
  ) {
    simulation.tick()
  }
}

export const clampedZoom = (val: number, zoom: number) =>
  zoom >= 1 ? val / zoom : val

export const createD3Data = ({
  graph,
  mode,
  config,
}: State): [D3Node[], d3.SimulationLinkDatum<D3Node>[]] => {
  const MAX_LEVEL = config?.focusNeighborDepth ?? 1

  let nodes = Object.values(graph) as D3Node[]

  let edges = d3.merge<d3.SimulationLinkDatum<D3Node>>(
    nodes.map((source) => {
      return source.links.map((target) => ({
        source: source.id,
        target,
      }))
    })
  )

  if (mode === 'FOCUS') {
    nodes = nodes.filter((node) => (node.level ?? 100) <= MAX_LEVEL)
    edges = edges.filter((edge) => {
      return (
        (graph[edge.source as any].level ?? 100) <= MAX_LEVEL &&
        (graph[edge.target as any].level ?? 100) <= MAX_LEVEL
      )
    })
  }

  return [nodes, edges]
}
