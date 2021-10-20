import { useEffect, useRef, useState } from "react"
import L, { MarkerClusterGroup, LayerGroup } from "leaflet"
import 'leaflet.markercluster'

import GeoJSONLayer from "./GeoJSONLayer"
import LayerControl from "./LayerControl"
import { useMapContext } from "context/mapContext"

import mapStyles from './MapContainer.module.scss'
import styles from './GeoJSONDisplay.module.scss'

const onEachFeature = (feature, layer) => {
  layer.on("click", e => {
    console.log("FEATURE:", feature)
    console.log("LAYER:", layer)
  })
}

const createLayer = ({ data, options={} }) => {
  const isCollection = Array.isArray(data)
  const layer = isCollection
    ? new LayerGroup(data.map(item => createLayer(item)))
    : GeoJSONLayer.create(data, {...options})
  if (options.cluster) {
    const clusterLayer = L.markerClusterGroup({
      showCoverageOnHover: false,
      options: { color: "red" },
      iconCreateFunction: function(cluster) {
        // console.log("cluster:", cluster)
        return new L.customIcon({ count: cluster.getChildCount() });
      }
    })
    clusterLayer.addLayer(layer)
    return clusterLayer
  }
  return layer
}

const GeoJSONDisplay = ({ layers = [] }) => {
  const { map } = useMapContext()
  const [ mapLayers, setMapLayers ] = useState([])

  useEffect(() => {
    const newLayers = layers.map(l => {
      const layer = createLayer(l)
      const add = () => layer.addTo(map)
      const remove = () => map.removeLayer(layer)
      return {...l, layer: { add, remove }}
    })
    setMapLayers(newLayers)
  }, [ layers ])

  useEffect(() => {
    mapLayers.forEach(mapLayer => {
      if (mapLayer.renderOnLoad) mapLayer.layer.add(map)
    })
    return () => mapLayers.forEach(mapLayer => mapLayer.layer.remove())
  }, [ map, mapLayers ])

  return <LayerControl layers={ mapLayers } />
}

export default GeoJSONDisplay