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

  selectFeature: function(layer, item, moveTo = true) {
    if (this.selected) this.selected.classList.remove(styles.selected)
    item.classList.add(styles.selected)
    this.selected = item

    this.highlightFeature(layer)
    
    const type = layer.feature.geometry.type
    if (moveTo) {
      type === "Point"
        ? this.map.setView(layer.getLatLng(), 16)
        : this.map.fitBounds(layer.getBounds())
    }
  },

  createContainer: function() {
    const container = createElement("div", {
      class: `${styles.container} leaflet-bar`,
      style: `max-height: ${this.map.getSize().y - 36}px;`
    })

    const featuresList = createElement("ul", styles["feature-list"], container)
    
    this.layers.forEach(({ label, renderOnLoad, layer }) => {
      const layerFeaturesContainer = createElement("li", renderOnLoad ? styles["layer-visible"] : "", featuresList)
      
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
        text: "expand",
        class: styles["features-toggle"],
        onClick: e => {
          const isOpen = layerFeaturesContainer.classList.toggle(styles.open)
          e.target.innerText = isOpen ? "collapse" : "expand"
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
          onClick: () => this.selectFeature(featureLayer, featureItem)
        }, featureItem)
        if (gx_media_links) createElement("img", { src: gx_media_links }, featureItem)
        const formattedDescription = description && description.replace(/<img.*\/>|<br>/g, "")
        createElement("div", {
          class: styles.description,
          ...formattedDescription && { text: formattedDescription }
        }, featureItem)
        
        featureLayer.on("click", () => this.selectFeature(featureLayer, featureItem, false))
      })
      
      // const li = createElement("li", null, layersList)
      // const labelEl = createElement("label", {text: label}, li)
      // const checkbox = createElement("input", {
      //   type: "checkbox",
      //   name: `show-${label}`,
      //   onClick: e => e.target.checked ? layer.addTo(this.map) : this.map.removeLayer(layer),
      //   ...renderOnLoad && { checked: true }
      // }, labelEl, true)
    })

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