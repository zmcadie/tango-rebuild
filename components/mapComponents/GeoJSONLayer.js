import { useEffect, useState } from "react"
import L, { GeoJSON, Marker } from "leaflet"

import { useMapContext } from "context/mapContext"

import styles from './GeoJSONLayer.module.scss'
import { domUtils } from "utils"

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
  const icon = new L.customIcon({ color })
  return new Marker(latlng, { icon })
}

function handleClick(displayProperties, highlightClass) {
  return function (event) {
    L.DomEvent.stopPropagation(event)

    const { _map: map, feature } = event.target

    map._infoControl.display(feature, displayProperties)

    const { type } = event.target.feature.geometry
    
    let element = event.target.getElement()
    let className = styles["selected-polygon"]

    if (type === "Point") {
      element = element.children[0]
      className = styles["selected-point"]
    }

    if (highlightClass) className = highlightClass

    map._resetHighlight && map._resetHighlight()
    
    element.classList.add(className)

    map._resetHighlight = () => element.classList.remove(className)
  }
}

const onEachFeature = function(feature, layer) {
  if (this.interactive === false && feature.geometry.type === "Point") {
    layer.options.interactive = false
  }
  if (layer.bringToFront) {
    layer.on("mouseover", e => e.target.bringToFront())
  }
  if (layer.options.interactive) {
    layer.on("click", handleClick(this.displayProperties, this.highlightClass))
  }
  if (this.onMouseOver) {
    layer.on("mouseover", this.onMouseOver)
  }
  if (this.onMouseOut) {
    layer.on("mouseout", this.onMouseOut)
  }
}

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
      const newLayer = createLayer(data, options)
      newLayer.addTo(map)
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