import { useEffect } from "react";
import L, { Control } from "leaflet";

import { useMapContext } from "context/mapContext"
import { domUtils } from "utils"

import styles from './FeatureInfoDisplay.module.scss'

const InfoControl = Control.extend({
  initialize: function(options) {
    L.setOptions(this, options)
    this._closeContainer = this._closeContainer.bind(this)
  },

  createInfoContainer: function() {
    const container = domUtils.createElement("div", {
      class: `${styles.container} leaflet-bar`,
      id: "info-container",
      // onDblClick: e => e.stopPropagation(),
      // onClick: e => e.stopPropagation(),
    })

    return container
  },

  onAdd: function() {
    this.infoContainer = this.createInfoContainer()
    L.DomEvent.disableScrollPropagation(this.infoContainer);
    L.DomEvent.disableClickPropagation(this.infoContainer);

    return this.infoContainer
  },

  display: function(feature) {
    const { name, description, gx_media_links } = feature.properties
    let formattedDescription = (description || "")
      .replace(/<img.*\/>/g, "")
      .replace(/<br>/g, "\r")
      .trim()

    this.infoContainer.innerHTML = ""
    
    domUtils.createElement("h1", { text: name }, this.infoContainer)
    domUtils.createElement("button", { onClick: this._closeContainer }, this.infoContainer)

    if (gx_media_links) {
      domUtils.createElement("img", { src: gx_media_links }, this.infoContainer)
    }
    if (formattedDescription) {
      domUtils.createElement("p", { text: formattedDescription }, this.infoContainer)
    }

    this.infoContainer.classList.add(styles.open)
  },
  
  _closeContainer: function() {
    this.infoContainer.classList.remove(styles.open)
  },
})

const FeatureInfoDisplay = () => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const infoControl = new InfoControl({ position: "topright" })
      map._infoControl = infoControl
      map.addControl(infoControl)
      return () => map.removeControl(infoControl)
    }
  }, [ map ])

  return null
}

export default FeatureInfoDisplay