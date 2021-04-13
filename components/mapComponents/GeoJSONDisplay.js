import { useEffect, useRef, useState } from "react";
import L, { Control, Marker } from "leaflet";

import GeoJSONLayer from "./GeoJSONLayer"
import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

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

const select = newSelection => selected = newSelection || {}

const resetStyles = () => {
  selected.resetStyle && selected.resetStyle()
  selected.classList  && selected.classList.remove(mapStyles.selected)
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
  const selectedRef = useRef

  useEffect(() => {
    const newLayers = layers.map(l => GeoJSONLayer.create(l.data, { onEachFeature }))
    setMapLayers(newLayers)
  }, [ layers ])

  useEffect(() => {
    // const resetStyles = () => mapLayers.forEach(l => l.resetStyle())
    const resetStyles = () => {
      const cur = selectedRef.current || {}
      cur.resetStyle && cur.resetStyle()
      cur.classList  && cur.classList.remove(mapStyles.selected)
    }
    mapLayers.forEach(layer => {
      layer/*.on("click", e => {
        console.log(e)
        resetStyles()
        const type = e.layer.feature && e.layer.feature.geometry.type

        if (type === "Point") {
          const elem = e.layer.getElement()
          elem.classList.add(mapStyles.selected)
          selectedRef.current = elem
        } else {
          e.layer.setStyle({
            color: "white",
            weight: 2
          })
          selectedRef.current = layer
        }
      })*/.addTo(map)
    })
    return () => mapLayers.forEach(layer => map.removeLayer(layer))
  }, [ map, mapLayers ])

  return null
}

export default GeoJSONDisplay