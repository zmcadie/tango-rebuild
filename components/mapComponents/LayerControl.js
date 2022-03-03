import { useEffect } from "react";
import L, { Control, control } from "leaflet";

import GeoJSONLayer from "./GeoJSONLayer"
import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

import styles from './LayerControl.module.scss'
import mapStyles from './MapContainer.module.scss'

const { createElement } = domUtils

Control.LayerControl = Control.extend({
  initialize: function(options, layers, additionalLayers) {
    L.setOptions(this, options)
    this.layers = layers
    this.additionalLayers = additionalLayers

    this.createFeaturesToggle = this.createFeaturesToggle.bind(this)
  },

  createFeaturesToggle: function(container) {
    return ({ icon, label, renderOnLoad, layer }) => {
      const layerFeaturesContainer = createElement("li", `${styles.item} ${renderOnLoad ? styles["layer-visible"] : ""}`, container)
      
      createElement("button", {
        class: styles["layer-toggle"],
        style: `background-image: url(${icon});`,
        onClick: () => {
          const isVisible = layerFeaturesContainer.classList.contains(styles["layer-visible"])
          isVisible ? layer.remove() : layer.add()
          layerFeaturesContainer.classList.toggle(styles["layer-visible"])
        }
      }, layerFeaturesContainer)
      
      createElement("div", { text: label, class: styles["layer-label"] }, layerFeaturesContainer)
    }
  },

  createContainer: function() {
    const container = createElement("div", {
      class: `${styles.container} ${styles.open} leaflet-bar`,
      style: `max-height: ${this.map.getSize().y - 36}px;`
    })

    createElement("button", {
      class: styles.toggle,
      onClick: () => container.classList.toggle(styles.open)
    }, container)

    const listsContainer = createElement("div", styles["lists-container"], container)

    createElement("h1", {
      class: `${styles["only-expanded"]} ${styles["layers-list-label"]}`,
      text: "Additional Layers"
    }, listsContainer)

    const additionalLayersList = createElement("ul", `${styles["additional-layers"]} ${styles.layers}`, listsContainer)
    this.layers.forEach(this.createFeaturesToggle(additionalLayersList))

    createElement("hr", {
      class: styles["only-expanded"],
      style: "margin-left: 20px; border-color: transparent; border-top: 1px solid #aaa;"
    }, listsContainer)
    
    createElement("h1", {
      class: `${styles["only-expanded"]} ${styles["layers-list-label"]}`,
      text: "Primary Layers"
    }, listsContainer)
    
    const layersList = createElement("ul", styles.layers, listsContainer)
    this.layers.forEach(this.createFeaturesToggle(layersList))

    const additionalLayersToggleContainer = createElement("li", `${styles.item} ${styles["additional-layers-toggle-container"]}`, layersList)
    const additionalLayersLabel = createElement("div", { text: "More", class: styles["layer-label"] }, additionalLayersToggleContainer)
      
    const expandContainer = () => {
      container.classList.add(styles.expanded)
      additionalLayersLabel.innerText = "Less"
    }
    const collapseContainer = () => {
      container.classList.remove(styles.expanded)
      additionalLayersLabel.innerText = "More"
    }
    
    createElement("button", {
      class: `${styles["layer-toggle"]} ${styles["additional-layers-toggle"]}`,
      onClick: function() {
        const isExpanded = container.classList.contains(styles.expanded)
        isExpanded ? collapseContainer() : expandContainer()
      }
    }, additionalLayersToggleContainer, true)

    createElement("button", {
      class: styles["inner-toggle"],
      onClick: () => {
        container.classList.toggle(styles.open)
        collapseContainer()
      }
    }, listsContainer)

    return container
  },

  onAdd: function(map) {
    this.map = map
    this.container = this.createContainer()
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);
    return this.container
  }
})

control.layerControl = function(opts, layers, additionalLayers) {
  return new Control.LayerControl(opts, layers, additionalLayers)
}

const LayerControl = ({ layers=[], additionalLayers=[] }) => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const layerControl = control.layerControl({ position: "bottomright" }, layers, additionalLayers)
      map.addControl(layerControl)
      return () => map.removeControl(layerControl)
    }
  }, [ map, layers, additionalLayers ])

  return null
}

export default LayerControl