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

  display: function(feature, displayProperties=[{ label: "Description", property: "description" }]) {
    const { name, gx_media_links } = feature.properties
    // let formattedDescription = (description || "")
    //   .replace(/<img.*\/>/g, "")
    //   .replace(/<br>/g, "\r")
    //   .trim()

    const urlRegExp = /(https?:\/\/([a-zA-Z0-9]*\.)?|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)?(\/[a-zA-Z0-9-]+)*(\/)?/g

    const formatDisplayValue = value => value
      .replace(/<img.*\/>/g, "")
      .replace(/^\s*(<br>)*|(<br>)*\s*$/g, "")
      .replace(urlRegExp, "<a href='$&'>$&</a>")
      .trim()

    const displayPropValues = displayProperties.map(item => ({
      ...item,
      value: feature.properties[item.property]
    }))

    this.infoContainer.innerHTML = ""
    
    domUtils.createElement("h1", { text: name }, this.infoContainer)
    domUtils.createElement("button", { onClick: this._closeContainer }, this.infoContainer)

    if (gx_media_links) {
      domUtils.createElement("img", { src: gx_media_links }, this.infoContainer)
    }
    displayPropValues.forEach(item => {
      if (item.value) {
        domUtils.createElement("h2", { text: item.label }, this.infoContainer)
        domUtils.createElement("p", { content: formatDisplayValue(item.value) }, this.infoContainer)
      }
    })

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

      const handleMapClick = () => {
        infoControl._closeContainer()
      }

      map.on("click", handleMapClick)
      return () => {
        map.removeControl(infoControl)
        map.off("click", handleMapClick)
      }
    }
  }, [ map ])

  return null
}

export default FeatureInfoDisplay