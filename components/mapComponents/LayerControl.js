import { useEffect } from "react";
import L, { Control, control } from "leaflet";

import GeoJSONLayer from "./GeoJSONLayer"
import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

import styles from './LayerControl.module.scss'
import mapStyles from './MapContainer.module.scss'

const { createElement } = domUtils

Control.LayerControl = Control.extend({
  initialize: function(options, layers) {
    L.setOptions(this, options)
    this.layers = layers

    // this.highlightFeature = this.highlightFeature.bind(this)
    this.createFeaturesToggle = this.createFeaturesToggle.bind(this)
  },

  // resetStyle: function(layer) {
  //   const type = layer.feature.geometry.type
  //   type === "Point"
  //     ? (
  //       layer.getElement() && layer.getElement().classList.remove(mapStyles.selected),
  //       layer.setZIndexOffset(0)
  //     ) : layer.setStyle(GeoJSONLayer.style(layer.feature, layer.options))
  // },

  // highlightFeature: function(layer) {
  //   if (this.highlighted) this.resetStyle(this.highlighted)
  //   this.highlighted = layer

  //   const type = layer.feature.geometry.type
    
  //   if (type === "Point") {
  //     layer.setZIndexOffset(1)
  //     layer.getElement().classList.add(mapStyles.selected)
  //     return
  //   }
    
  //   layer.bringToFront()
  //   layer.setStyle({ color: "white", weight: 3 })
  // },

  // moveToLayer: function(layer) {
  //   const type = layer.feature.geometry.type
  //   type === "Point"
  //     ? this.map.setView(layer.getLatLng(), 16)
  //     : this.map.fitBounds(layer.getBounds())
  // },

  // scrollToItem: function(item) {
  //   const parentContainer  = item.closest(`.${styles.item}`)
  //   const layersContainer  = item.closest(`.${styles.layers}`)
  //   const controlContainer = item.closest(`.${styles.container}`)

  //   controlContainer.classList.add(styles.open)
  //   parentContainer.classList.add(styles.open)
  //   layersContainer.scrollTo(0, item.offsetTop - 10)
  // },

  // selectFeature: function(layer, item, source = "") {
  //   if (this.selected) this.selected.classList.remove(styles.selected)
  //   item.classList.add(styles.selected)
  //   this.selected = item

  //   this.highlightFeature(layer)
    
  //   if (source !== "map")  this.moveToLayer(layer)
  //   if (source !== "list") this.scrollToItem(item)
  // },

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
    
    const layersList = createElement("ul", styles.layers, container)
    this.layers.forEach(this.createFeaturesToggle(layersList))
    
    const closeListItem = createElement("li", "", layersList)

    createElement("button", {
      class: styles["inner-toggle"],
      onClick: () => container.classList.toggle(styles.open)
    }, closeListItem)

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

control.layerControl = function(opts, layers) {
  return new Control.LayerControl(opts, layers)
}

const LayerControl = ({ layers=[] }) => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const layerControl = control.layerControl({ position: "bottomright" }, layers)
      map.addControl(layerControl)
      return () => map.removeControl(layerControl)
    }
  }, [ map, layers ])

  return null
}

export default LayerControl