import { useEffect, useRef, useState } from "react";
import L, { Control, Marker } from "leaflet";

import GeoJSONLayer from "./GeoJSONLayer"
import LayerControl from "./LayerControl"
import { useMapContext } from "context/mapContext"

import mapStyles from './MapContainer.module.scss'
import styles from './GeoJSONDisplay.module.scss'

class Selection {
  constructor(initialSelection) {
    this.current = initialSelection
  }

  resetStyles() {
    const cur = this.current
    cur && cur.resetStyle && cur.resetStyle()
    cur && cur.classList  && cur.classList.remove(mapStyles.selected)
    return this
  }

  select(newSelection) {
    this.resetStyles().current = newSelection || null
  }
}

const onEachFeature = (feature, layer) => {
  layer.on("click", e => {
    console.log("FEATURE:", feature)
    console.log("LAYER:", layer)
  })
}

const GeoJSONDisplay = ({ layers = [] }) => {
  const { map } = useMapContext()
  const [ mapLayers, setMapLayers ] = useState([])

  useEffect(() => {
    const newLayers = layers.map(l => {
      const layer = GeoJSONLayer.create(l.data, {...l.options})
      return {...l, layer}
    })
    setMapLayers(newLayers)
  }, [ layers ])

  useEffect(() => {
    mapLayers.forEach(mapLayer => {
      if (mapLayer.renderOnLoad) mapLayer.layer.addTo(map)
    })
    return () => mapLayers.forEach(layer => map.removeLayer(layer))
  }, [ map, mapLayers ])

  return <LayerControl layers={ mapLayers } />
}

export default GeoJSONDisplay