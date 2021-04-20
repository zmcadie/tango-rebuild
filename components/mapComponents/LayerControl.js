import { useEffect } from "react";
import L, { Control as LeafletControl } from "leaflet";

import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

import styles from './LayerControl.module.scss'

const { createElement } = domUtils

const Control = LeafletControl.extend({
  initialize: function(options, layers) {
    L.setOptions(this, options)
    this.layers = layers
  },

  createContainer: function() {
    const container = createElement("div", `${styles.container} leaflet-bar`, null, {
      onClick: e => e.stopPropagation(),
      onDblClick: e => e.stopPropagation(),
      style: `max-height: ${this.map.getSize().y - 36}px;`
    })
    const layersSection = createElement("details", styles.section, container)
    createElement("summary", "", layersSection, { text: "Layers" })
    const layersList = createElement("ul", "", layersSection)

    this.layers.forEach(({
      label,
      renderOnLoad,
      layer
    }) => {
      const li = createElement("li", "", layersList)
      const labelEl = createElement("label", "", li)
      createElement("input", "", labelEl, {
        type: "checkbox",
        name: `show-${label}`,
        onClick: e => e.target.checked ? layer.addTo(this.map) : this.map.removeLayer(layer),
        ...renderOnLoad && { checked: true }
      })
      labelEl.append(label)
    })

    return container
  },

  onAdd: function(map) {
    this.map = map
    this.container = this.createContainer()
    return this.container
  }
})

const LayerControl = ({ layers=[] }) => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const control = new Control({ position: "topright" }, layers)
      map.addControl(control)
      return () => map.removeControl(control)
    }
  }, [ map, layers ])

  return null
}

export default LayerControl