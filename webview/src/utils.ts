import { useState, useEffect } from 'react'

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
