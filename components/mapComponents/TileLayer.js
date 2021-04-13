import { useEffect } from "react"
import { TileLayer as LeafletTileLayer } from "leaflet"

import { useMapContext } from "context/mapContext"

const defaultSrc = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const defaultAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const TileLayer = ({
  src=defaultSrc,
  attribution=defaultAttribution,
  ...options
}) => {
  const { map } = useMapContext()

  useEffect(() => {
    if (map) {
      new LeafletTileLayer(src, {
        attribution,
        ...options
      }).addTo(map)
    }
  }, [ map ])

  return null
}

export default TileLayer