import { useEffect, useState } from "react"
import L, { GeoJSON, Marker, LatLng, LatLngBounds, MarkerClusterGroup, DivIcon } from "leaflet"

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

// const iconHTML = num => `
//   <svg height="41" width="41" viewbox="0 0 41 41">
//     <path d="M20.5,0C12.964,0,6.833,6.131,6.833,13.666c0,2.262,0.565,4.505,1.64,6.494L19.752,40.559c0.15,0.272,0.436,0.444,0.747,0.44s0.597-0.168,0.747-0.44l11.282-20.404c1.071-1.982,1.636-4.226,1.636-6.488C34.166,6.131,28.035,0,20.5,0z"></path>
//     ${ num ? (
//       `<text>${num}</text>`
//     ) : (
//       '<circle cx="50%" cy="33%" r="6" fill="white"></circle>'
//     )}
//   </svg>
// `

// const Icon = DivIcon.extend({
//   options: {
//     html: iconHTML(),
//     className: styles.marker,
//     iconAnchor: [21, 41],
//     popupAnchor: [0, -30]
//   },
//   createIcon: function(oldIcon) {
//     // console.log("createIcon:", this.getChildCount())
//     // console.log(this)
//     this.options.html = iconHTML(7)
//     const icon = DivIcon.prototype.createIcon.call(this, oldIcon)
//     icon.style.fill = this.options.color
//     return icon
//   }
// })

const pointToLayer = (point, latlng, style={}) => {
  const { color: colorProp, "icon-color": iconColor } = point.properties
  const color = colorProp || iconColor || style.color
  const icon = new L.customIcon({ color })
  return new Marker(latlng, { icon })
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
  const style = data.style || options.style
  return new Geo(data, {
    ...style && {
      pointToLayer: (p,ll) => pointToLayer(p,ll,style),
      style: (f) => propsToStyle(f,style)
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
GeoJSONLayer.style = propsToStyle

export default GeoJSONLayer