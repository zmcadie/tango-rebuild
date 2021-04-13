import { useEffect, useState } from "react"
import { GeoJSON, Marker, LatLng, LatLngBounds } from "leaflet"

import { useMapContext } from "context/mapContext"

import styles from './MapContainer.module.scss'

const propsToStyle = (feature, style={}) => {
  const props = feature.properties
  
  const color = props.color || props.stroke || style.color || style.stroke
  const fillColor = props.fill || props.color || style.fill || style.color
  const weight = props["stroke-width"] || props.weight || style["stroke-width"] || style.weight
  const fillOpacity = props["fill-opacity"] || props.fillOpacity || style["fill-opacity"] || style.fillOpacity
  const opacity = props["stroke-opacity"] || props.strokeOpacity || style["stroke-opacity"] || style.strokeOpacity

  return {
    ...color && { color },
    ...weight && { weight },
    ...fillOpacity && { fillOpacity },
    opacity,
    fillColor
  }
}

const pointToLayer = (point, latlng, style={}) => {
  const { color: colorProp, "icon-color": iconColor } = point.properties
  const color = colorProp || iconColor || style.color
  return new Marker(latlng, { color })
}

const handleBlur = (type, element, reset={}) => () => {
  if (type === "Point") {
    element.children[0].style = ""
    return
  }

  Object.keys(reset).forEach(key => {
    console.log(key, reset[key])
    element.setAttribute(key, reset[key])
  })
}

function handleClick(e) {
  const type = e.target.feature.geometry.type
  let element = e.target.getElement()

  const resetStyles = {
    stroke: element.getAttribute("stroke"),
    "stroke-width": element.getAttribute("stroke-width")
  }
  
  // const blur = handleBlur(type, element, resetStyles)
  
  if (type === "Point") {
    element.children[0].style = "background: #fff8; box-shadow: 0 2px 4px 1px #0008;"
  } else {
    console.log(element)
    element.setAttribute("stroke", "white")
    element.setAttribute("stroke-width", "2")
  }
  // console.log(element)
  // element.addEventListener("blur", blur, { once: true })
}

const onEachFeature = function(feature, layer) {
  if (this.interactive === false && feature.geometry.type === "Point") {
    layer.options.interactive = false
  }
  if (layer.bringToFront) {
    layer.on("mouseover", e => e.target.bringToFront())
  }
  // if (layer.options.interactive) {
  //   layer.on("click", handleClick)
  // }
}

// &.selected {
//   background: #fff8;
//   box-shadow: 0 2px 4px 1px #0008;
// }

const Geo = GeoJSON.extend({
  options: {
    style: propsToStyle,
    pointToLayer,
    onEachFeature
  }
})

const createLayer = (data, options) => {
  return new Geo(data, {
    ...data.style && {
      pointToLayer: (p,ll) => pointToLayer(p,ll,data.style),
      style: (f) => propsToStyle(f,data.style)
    },
    markersInheritOptions: true,
    ...options
  })
}

const GeoJSONLayer = ({ data, options={} }) => {
  const { map } = useMapContext()
  const [layer, setLayer] = useState()

  useEffect(() => {
    if (map && data) {
      const newLayer = createLayer(data, options).bindPopup(layer => {
        const { feature: { properties, geometry }} = layer
        const { name, description } = properties

        if (!name && !description) {
          const latlng = geometry.type === "Point"
            ? new LatLng(...geometry.coordinates)
            : new LatLngBounds(geometry.coordinates)
          return latlng.toString()
        }

        return (name ? "Name: " + name : "") + (name && description ? "\n" : "") + (description ? "Description: " + description : "")
      })/*.on("click", e => {
        // newLayer.resetStyle()
        console.log(map)
        
        const type = e.layer.feature.geometry.type
        const element = e.layer.getElement()

        const style = type === "Point" ? {
          className: styles.selected
        } : {
          color: "white",
          weight: 2
        }

        // element.children[0].style = "background: #fff8; box-shadow: 0 2px 4px 1px #0008;"
        e.layer.setStyle(style)
      })*/.addTo(map)

      setLayer(newLayer)
    }
  }, [ map, data ])

  // Stop duplicate layer rendering on hot reload
  useEffect(() => {
    return () => map && layer && map.removeLayer(layer)
  }, [map, layer])

  return null
}

GeoJSONLayer.create = createLayer

export default GeoJSONLayer