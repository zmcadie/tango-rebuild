import { useEffect, useState } from "react"
import L, { GeoJSON, SVG, Polygon } from "leaflet"

import { useMapContext } from "context/mapContext"

const worldBounds = [
  [90, 180],
  [90, -180],
  [-90, -180],
  [-90, 180]
]

const originalToGeoJSON = Polygon.prototype.toGeoJSON

// Add ability to invert polygon to represent bounds, based on Leaflet.snogylop
L.extend(Polygon.prototype, {
  _setLatLngs: function(latlngs) {
    this._originalLatLngs = L.LineUtil.isFlat(latlngs) ? [latlngs] : latlngs
    const newLatLngs = this.options.invert ? [worldBounds, ...latlngs] : latlngs
    L.Polyline.prototype._setLatLngs.call(this, newLatLngs)
  },
  getBounds: function() {
    const latlngs = this._originalLatLngs || this.getLatLngs()
    return new L.LatLngBounds(latlngs)
  },
  getLatLngs: function() {
    return this._originalLatLngs
  },
  toGeoJSON: function(precision) {
    if (!this.options.invert) return originalToGeoJSON.call(this, precision)
    
    const holes = !L.LineUtil.isFlat(this._originalLatLngs)
    const multi = holes && !L.LineUtil.isFlat(this._originalLatLngs[0])

    const coords = [GeoJSON.latLngsToCoords(this._originalLatLngs, multi ? 2 : holes ? 1 : 0, true, precision)]
    return GeoJSON.getFeature(this, {
      type: (multi ? "Multi" : "") + "Polygon",
      coordinates: holes ? coords[0] : coords
    })
  }
})

const BoundsLayer = GeoJSON.extend({
  options: {
    style: {
      color: "#2f4f4f",
      fillOpacity: 0.3,
      stroke: false
    },
    renderer: new SVG({ padding: 1 }),
    invert: true,
    interactive: false
  }
})

export default function MapBounds({ bounds, visual=true }) {
  const { map } = useMapContext()
  const [layer, setLayer] = useState()

  useEffect(() => {
    if (visual && map && bounds) {
      const newLayer = new BoundsLayer(bounds).addTo(map)
      // map.setMaxBounds(newLayer.getBounds())

      setLayer(newLayer)
    }
  }, [ map, bounds, visual ])

  // Stop duplicate layer rendering on hot reload
  useEffect(() => {
    return () => map && layer && map.removeLayer(layer)
  }, [map, layer])

  return null
}