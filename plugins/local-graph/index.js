import { Graph as QuartzGraph } from "@quartz-community/graph"

const HOME_SLUG = "e2m-读书会资料库---index"

// Quartz graph 0.1.0 reads an encoded browser pathname, but its index uses
// decoded note paths. Decode only the browser pathname, never the index keys.
export function Graph(options) {
  const component = QuartzGraph(options)
  function replaceExactly(source, original, replacement, count, description) {
    if (source.split(original).length - 1 !== count) {
      throw new Error(`Quartz Graph changed: review ${description}`)
    }
    return source.replaceAll(original, replacement)
  }

  let script = component.afterDOMLoaded
  script = replaceExactly(
    script,
    "let u=window.location.pathname;",
    "let u=window.location.pathname;try{u=decodeURIComponent(u)}catch{};",
    1,
    "browser pathname decoding",
  )
  // Pixi renders at the device pixel ratio and the homepage graph contains the
  // whole vault. On phones this can exhaust the browser's GPU/memory budget and
  // trigger reload loops (especially inside WeChat). Do not load D3/Pixi or
  // start any graph simulation below the mobile breakpoint.
  script = replaceExactly(
    script,
    "(function(){function u()",
    '(function(){if(matchMedia("(max-width: 800px)").matches){return}function u()',
    1,
    "mobile graph guard",
  )
  // Keep graph labels hidden at every zoom level. The upstream hover handler
  // still reveals the hovered node's title and its connected edges.
  script = replaceExactly(script, "j.alpha=F", "j.alpha=0", 1, "zoom labels")
  // Use a slightly larger dot in the compact local preview. Keep the global
  // graph's restrained radius so its hundreds of nodes remain legible.
  script = replaceExactly(
    script,
    "return 2+Math.sqrt(l)",
    "return Vu>=0?2.4+Math.sqrt(l)*.9:1.4+Math.sqrt(l)*.62",
    2,
    "node radius",
  )
  script = replaceExactly(
    script,
    "v.gfx.stroke({alpha:v.alpha,width:1,color:v.color})",
    "v.gfx.stroke({alpha:v.alpha*.38,width:.7,color:v.color})",
    1,
    "link appearance",
  )
  component.afterDOMLoaded = script
  component.css += "\n.graph > .graph-outer { height: 340px; }\n"

  // On the homepage, the same graph component is placed below the three
  // entrances. Render the full vault there; other pages keep their local view.
  const graph = (props) => {
    const view = component(props)
    if (props.fileData.slug === HOME_SLUG) {
      const outer = view.props.children.find((child) => child.props?.class === "graph-outer")
      const preview = outer?.props.children.find((child) => child.props?.class === "graph-container")
      const modal = view.props.children.find((child) => child.props?.class === "global-graph-outer")
      const fullGraph = modal?.props.children
      if (!preview || fullGraph?.props?.class !== "global-graph-container") {
        throw new Error("Quartz Graph changed: review homepage graph placement")
      }
      preview.props["data-cfg"] = fullGraph.props["data-cfg"]
    }
    return view
  }
  Object.assign(graph, component)
  graph.e2mGraph = true
  return graph
}
