import React from 'react'
import * as d3 from 'd3'
import * as THREE from 'three'
import { Canvas, useFrame } from 'react-three-fiber'
import { D3Node, State } from './types'
import { useWindowSize, tickUntilDone } from './utils'
import Node from './Node'
import Edge from './Edge'
import ZoomContainer from './Zoom'
import { useGraphState } from './vscode'

const backgroundColor = getComputedStyle(
  document.documentElement
).getPropertyValue('--vscode-editor-foreground')
const bg = new THREE.Color(backgroundColor)

interface Props {}

const Graph: React.FC<Props> = () => {
  const state = useGraphState()
  const [mode, setMode] = React.useState<'ALL' | 'FOCUS'>('ALL')
  const [svgRef, setSvgRef] = React.useState<SVGSVGElement | null>(null)
  const zoomRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null)
  const { width, height } = useWindowSize()

  const simulation = React.useMemo(() => {
    const simulation = d3
      .forceSimulation<D3Node>()
      .force(
        'center',
        d3.forceCenter<D3Node>(0, 0)
        // d3.forceCenter<D3Node>((width || 0) / 2, (height || 0) / 2)
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
      d3.forceCenter(0, 0)
      // d3.forceCenter((width || 0) / 2, (height || 0) / 2)
    )
  }, [width, height])

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

  if (!nodes || !nodes.length) {
    console.log('rendering no nodes', Date.now())
  } else {
    console.log('rendering SOME nodes', Date.now())
  }
  const w = width || 0
  const h = height || 0
  const texture = React.useMemo(
    () =>
      new THREE.TextureLoader().load(
        'https://blog.fastforwardlabs.com/images/2018/02/circle_aa-1518730700478.png'
      ),
    []
  )
  const frustumSize = 100
  const aspect = w / h

  return (
    <div>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        colorManagement
        orthographic
        camera={{
          left: (frustumSize * aspect) / -2,
          right: (frustumSize * aspect) / 2,
          top: frustumSize / 2,
          bottom: frustumSize / -2,
          far: 100,
          near: 0.1,
        }}
      >
        {/* <orthographicCamera
          args={[
            -(width || 0) / 2,
            (width || 0) / 2,
            (height || 0) / 2,
            -(height || 0) / 2,
            1,
            1000,
          ]}
        /> */}
        {/* <mesh visible position={[-30.5, 0, -60]}>
          <circleBufferGeometry attach="geometry" args={[100, 16]} />
          <meshBasicMaterial attach="material" color="green" />
        </mesh> */}
        <mesh visible position={[0, 0, -5]}>
          <circleBufferGeometry attach="geometry" args={[30, 16]} />
          <meshBasicMaterial attach="material" color="green" />
        </mesh>
        <group>
          {nodes.map((node) => {
            return (
              <Node
                key={`node-${node.id}`}
                node={node}
                active={node.id === state.currentNode}
                zoomLevel={1}
              />
            )
            // console.log('node', node.x, node.y)
            // return (
            // <mesh key={node.id} visible position={[node.x!, node.y!, -10]}>
            //   <circleBufferGeometry attach="geometry" args={[10, 16]} />
            //   <meshBasicMaterial attach="material" color="indianred" />
            // </mesh>
            // )
          })}
        </group>
      </Canvas>
    </div>
  )

  // return (
  //   <div>
  //     <svg ref={(s) => setSvgRef(s)} width={width} height={height}>
  //       <ZoomContainer
  //         ref={zoomRef}
  //         svg={svgRef}
  //         scaleMin={0.2}
  //         scaleMax={3}
  //         render={({ k }) => {
  //           return (
  //             <>
  //               <g className="links">
  //                 {edges.map((edge) => (
  //                   <Edge
  //                     key={`${(edge.source as any).id}-${
  //                       (edge.target as any).id
  //                     }`}
  //                     edge={edge as any}
  //                     zoomLevel={k}
  //                   />
  //                 ))}
  //               </g>
  //               <g className="nodes">
  //                 {nodes.map((node) => (
  //                   <Node
  //                     key={`node-${node.id}`}
  //                     node={node}
  //                     active={node.id === state.currentNode}
  //                     zoomLevel={k}
  //                   />
  //                 ))}
  //               </g>
  //             </>
  //           )
  //         }}
  //       />
  //     </svg>
  //     <div className="bottomRightContainer">
  //       <span>
  //         <span id="files">0</span> files
  //       </span>
  //       <span>
  //         <span id="connections">0</span> links
  //       </span>
  //       <span>
  //         <span id="zoom">1.00</span>x
  //       </span>
  //       <div id="mode-select">
  //         <button
  //           id="mode-all"
  //           className={mode === 'ALL' ? 'active' : undefined}
  //           onClick={() => setMode('ALL')}
  //         >
  //           ALL
  //         </button>
  //         <button
  //           id="mode-focus"
  //           className={mode === 'FOCUS' ? 'active' : undefined}
  //           onClick={() => setMode('FOCUS')}
  //         >
  //           FOCUS
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default Graph
