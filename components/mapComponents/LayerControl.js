import { useEffect } from "react";
import L, { Control, control } from "leaflet";

import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

import styles from './LayerControl.module.scss'

const { createElement } = domUtils

Control.LayerControl = Control.extend({
  initialize: function(options, layerGroups) {
    L.setOptions(this, options)
    this.layerGroups = layerGroups

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

    this.layerGroups.forEach((layerGroup, index) => {
      const expandedClass = layerGroup.primary ? "" : styles["only-expanded"]
      const layersList = createElement("ul", `${styles.layers} ${expandedClass}`, listsContainer, true)
      layerGroup.layers.forEach(this.createFeaturesToggle(layersList))

      if (layerGroup.primary) {
        const additionalLayersToggleContainer = createElement("li", `${styles.item} ${styles["additional-layers-toggle"]}`, layersList)
        createElement("button", {
          class: styles["layer-toggle"],
          onClick: function() {
            container.classList.add(styles.expanded)
          }
        }, additionalLayersToggleContainer, true)
      }

      createElement("h1", {
        class: `${styles["layers-list-label"]} ${expandedClass}`,
        text: layerGroup.title
      }, listsContainer, true)

      if (index !== this.layerGroups.length - 1) {
        createElement("hr", {
          class: styles["only-expanded"],
          style: "margin-left: 20px; border-color: transparent; border-top: 1px solid #aaa;"
        }, listsContainer, true)
      }
    })
    
    // createElement("h1", {
    //   class: `${styles["only-expanded"]} ${styles["layers-list-label"]}`,
    //   text: "Additional Layers"
    // }, listsContainer)

    // const additionalLayersList = createElement("ul", `${styles["additional-layers"]} ${styles.layers}`, listsContainer)
    // this.layers.forEach(this.createFeaturesToggle(additionalLayersList))

    // createElement("hr", {
    //   class: styles["only-expanded"],
    //   style: "margin-left: 20px; border-color: transparent; border-top: 1px solid #aaa;"
    // }, listsContainer)
    
    // createElement("h1", {
    //   class: styles["layers-list-label"],
    //   text: "Groups"
    // }, listsContainer)
    
    // const layersList = createElement("ul", styles.layers, listsContainer)
    // this.layers.forEach(this.createFeaturesToggle(layersList))

    // const additionalLayersToggleContainer = createElement("li", `${styles.item} ${styles["additional-layers-toggle"]}`, layersList)
    // const additionalLayersLabel = createElement("div", { text: "More", class: styles["layer-label"] }, additionalLayersToggleContainer)
      
    // const expandContainer = () => {
    //   container.classList.add(styles.expanded)
    //   additionalLayersLabel.innerText = "Less"
    // }
    // const collapseContainer = () => {
    //   container.classList.remove(styles.expanded)
    //   additionalLayersLabel.innerText = "More"
    // }
    
    const containerActions = createElement("div", styles["container-actions"], listsContainer)

    createElement("button", {
      class: styles["collapse-container"],
      onClick: () => {
        // collapseContainer()
        container.classList.remove(styles.expanded)
      }
    }, containerActions)

    createElement("button", {
      class: styles["inner-toggle"],
      onClick: () => {
        container.classList.toggle(styles.open)
        // collapseContainer()
        container.classList.remove(styles.expanded)
      }
    }, containerActions)

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

const LayerControl = ({ layerGroups }) => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const layerControl = control.layerControl({ position: "bottomright" }, layerGroups)
      map.addControl(layerControl)
      return () => map.removeControl(layerControl)
    }
  }, [ map, layerGroups ])

  return null
}

export default LayerControl