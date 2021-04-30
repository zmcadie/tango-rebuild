import { useEffect } from "react";
import L, { Control, Marker } from "leaflet";

import { useMapContext } from "context/mapContext"
import { debounce, domUtils, Geocoder } from "utils"

import styles from './SearchBar.module.scss'

const geo = new Geocoder({ category: ["Street Address", "Intersection"] })

const SearchControl = Control.extend({
  initialize: function(options) {
    L.setOptions(this, options)

    this.marker = new Marker(options.center, { interactive: false, color: "lightblue" })

    this.autoSearch = this.autoSearch.bind(this)
    this.submitSearch = this.submitSearch.bind(this)
  },

  submitSearch: async function(event) {
    event.preventDefault()

    const items = [...this.suggestionsContainer.children]
    const selected = items.find(child => child.classList.contains(styles.selected))
    
    let text, key
    if (selected) {
      text = selected.innerText
      key = selected.dataset.key
    } else {
      text = this.input.value
      geo.near(this.map.getCenter())
    }

    const res = await geo.find(text, key)

    if (res) {
      this._closeContainer()
      const { x: lng, y: lat } = res.location
      
      this.map.setView([lat,lng], 16)
      this.marker.setLatLng([lat,lng]).addTo(this.map)
    }
  },

  autoSearch: debounce(async function(event) {
    this.query = event.target.value

    const { query: text, map } = this
    const center = map.getCenter()

    const res = await geo
      .text(text)
      .near(center)
      .suggest()
    
    const fragment = document.createDocumentFragment()
    res.forEach((suggestion, i) => {
      const className = `${styles["suggestion-item"]} ${i ? "" : styles.selected}`
      const el = domUtils.createElement("li", {
        class: className,
        text: suggestion.text,
        "data-key": suggestion.magicKey
      })
      fragment.appendChild(el)
    })

    this.suggestionsContainer.innerHTML = ""
    this.suggestionsContainer.appendChild(fragment)

    const form = this.suggestionsContainer.parentElement
    if (res.length) {
      form.classList.add(styles["has-suggestions"])
    } else {
      form.classList.remove(styles["has-suggestions"])
    }
  }, 250),

  createSearchContainer: function() {
    const container = domUtils.createElement("div", {
      class: `${styles.container} leaflet-bar`,
      onDblClick: e => e.stopPropagation(),
      onClick: e => e.stopPropagation(),
    })
    
    domUtils.createElement("a", {
      class: styles.toggle,
      title: "Search",
      role: "button",
      href: "#",
      "aria-label": "Search for location",
      onClick: e => {
        e.preventDefault()
        container.classList.toggle(styles.open)
        input.focus()
      }
    })

    const form = domUtils.createElement("form", {
      class: styles.form,
      onSubmit: this.submitSearch
    })
    this.form = form

    const input = domUtils.createElement("input", {
      class: styles.input,
      onInput: this.autoSearch,
      onKeyDown: e => {
        if (!form.classList.contains(styles["has-suggestions"])) return

        if (e.key === "Escape") return this._closeContainer()
        
        if (["Down", "Up", "ArrowDown", "ArrowUp"].includes(e.key)) {
          e.preventDefault()
          
          const items = [...this.suggestionsContainer.children]
          const selected = items.find(child => child.classList.contains(styles.selected))

          if (items.length === 1) return

          const next = ["Down", "ArrowDown"].includes(e.key)
            ? selected.nextSibling || items[0]
            : selected.previousSibling || items[items.length - 1]

          e.target.value = next.innerText
          selected.classList.remove(styles.selected)
          next.classList.add(styles.selected)
          
        }
      }
    }, form)
    this.input = input

    const suggestionsContainer = domUtils.createElement("ul", styles.suggestions, form)
    this.suggestionsContainer = suggestionsContainer

    domUtils.createElement("a", styles.close, container, {
      title: "Reset",
      role: "button",
      href: "#",
      "aria-label": "Reset search",
      text: "⨉",
      onClick: e => {
        e.preventDefault()
        this._reset()
        input.focus()
      }
    })

    return container
  },

  onAdd: function(map) {
    this.map = map

    this.searchContainer = this.createSearchContainer()
    this.map.on("click", this._closeContainer, this)

    return this.searchContainer
  },
  
  onRemove: function() {
    this.map.off("click", this._closeContainer, this)
  },

  _reset: function() {
    this.input.value = ""
    this.form.classList.remove(styles["has-suggestions"])
    this.suggestionsContainer.innerHTML = ""
  },

  _closeContainer: function() {
    this.searchContainer.classList.remove(styles.open)
    this._reset()
  },
})

const SearchBar = () => {
  const { map } = useMapContext()
  
  useEffect(() => {
    if (map) {
      const searchControl = new SearchControl({ position: "topleft" })
      map.addControl(searchControl)
      return () => map.removeControl(searchControl)
    }
  }, [ map ])

  return null
}

export default SearchBar