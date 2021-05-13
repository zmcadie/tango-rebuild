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

    this.highlightFeature = this.highlightFeature.bind(this)
    this.createFeaturesContainer = this.createFeaturesContainer.bind(this)
  },

  resetStyle: function(layer) {
    const type = layer.feature.geometry.type
    type === "Point"
      ? (
        layer.getElement() && layer.getElement().classList.remove(mapStyles.selected),
        layer.setZIndexOffset(0)
      ) : layer.setStyle(GeoJSONLayer.style(layer.feature, layer.options))
  },

  highlightFeature: function(layer) {
    if (this.highlighted) this.resetStyle(this.highlighted)
    this.highlighted = layer

    const type = layer.feature.geometry.type
    
    if (type === "Point") {
      layer.setZIndexOffset(1)
      layer.getElement().classList.add(mapStyles.selected)
      return
    }
    
    layer.bringToFront()
    layer.setStyle({ color: "white", weight: 3 })
  },

  moveToLayer: function(layer) {
    const type = layer.feature.geometry.type
    type === "Point"
      ? this.map.setView(layer.getLatLng(), 16)
      : this.map.fitBounds(layer.getBounds())
  },

  scrollToItem: function(item) {
    const parentContainer  = item.closest(`.${styles.item}`)
    const layersContainer  = item.closest(`.${styles.layers}`)
    const controlContainer = item.closest(`.${styles.container}`)

    controlContainer.classList.add(styles.open)
    parentContainer.classList.add(styles.open)
    layersContainer.scrollTo(0, item.offsetTop - 10)
  },

  selectFeature: function(layer, item, source = "") {
    if (this.selected) this.selected.classList.remove(styles.selected)
    item.classList.add(styles.selected)
    this.selected = item

    this.highlightFeature(layer)
    
    if (source !== "map")  this.moveToLayer(layer)
    if (source !== "list") this.scrollToItem(item)
  },

  createFeaturesContainer: function(container) {
    return ({ label, renderOnLoad, layer }) => {
      const layerFeaturesContainer = createElement("li", `${styles.item} ${renderOnLoad ? styles["layer-visible"] : ""}`, container)
      const layerFeaturesHeader = createElement("div", styles["layer-header"], layerFeaturesContainer)
      const labelEl = createElement("label", { text: label }, layerFeaturesHeader)
      
      createElement("input", {
        type: "checkbox",
        name: `show-${label}`,
        onClick: e => {
          e.target.checked ? layer.addTo(this.map) : this.map.removeLayer(layer)
          layerFeaturesContainer.classList.toggle(styles["layer-visible"])
        },
        ...renderOnLoad && { checked: true }
      }, labelEl, true)
      
      createElement("button", {
        class: styles["features-toggle"],
        onClick: () => {
          layerFeaturesContainer.classList.toggle(styles.open)
        }
      }, layerFeaturesHeader)
      
      createElement("hr", null, layerFeaturesContainer)
      
      const layerFeaturesList = createElement("ul", null, layerFeaturesContainer)
      
      Object.keys(layer._layers).forEach(key => {
        const featureLayer = layer._layers[key]
        const { name, description, address, "phone number": number, gx_media_links } = featureLayer.feature.properties
        
        const featureItem = createElement("li", styles.feature, layerFeaturesList)
        
        createElement("div", {
          text: name,
          class: styles["feature-header"],
          onMouseOver: () => this.highlightFeature(featureLayer),
          onClick: () => this.selectFeature(featureLayer, featureItem, "list")
        }, featureItem)
        
        if (gx_media_links) createElement("img", { src: gx_media_links }, featureItem)
        const formattedDescription = description && description.replace(/<img.*\/>|<br>/g, "")
        
        formattedDescription && createElement("div", {
          class: styles.description,
          text: formattedDescription
        }, featureItem)
        
        address && createElement("div", {
          class: styles.description,
          text: `Address: ${address}`
        }, featureItem)
        
        formattedDescription && createElement("div", {
          class: styles.description,
          text: `Phone: ${number}`
        }, featureItem)
        
        featureLayer.on("click", () => this.selectFeature(featureLayer, featureItem, "map"))
      })
    }
  },

  createContainer: function() {
    const container = createElement("div", {
      class: `${styles.container} leaflet-bar`,
      style: `max-height: ${this.map.getSize().y - 36}px;`
    })

    createElement("button", {
      class: styles.toggle,
      onClick: () => container.classList.toggle(styles.open)
    }, container)

    const layersList = createElement("ul", styles.layers, container)
    this.layers.forEach(this.createFeaturesContainer(layersList))

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
      const layerControl = control.layerControl({ position: "topright" }, layers)
      map.addControl(layerControl)
      return () => map.removeControl(layerControl)
    }
  }, [ map, layers ])

  return null
}

export default LayerControl