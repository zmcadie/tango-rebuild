import { LatLng } from "leaflet"
import { getParamsString } from "./urlUtils"

const baseURL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
const reqParams = ["text", "location", "category", "searchExtent", "maxSuggestions", "countryCode", "magicKey", "SingleLine"]

const NO_LOCATION_FOR_BOUNDS = "Cannot create distance bounds without setting search location. Either set location or provide <LatLngBounds> argument"

const NO_QUERY = (query, context) => (!query || (typeof query === "object" && !query.text)) && !context.text()

export default class Geocoder {
  constructor(options={}) {
    this.params = { ...options, f: "json" }

    this.suggest = this.suggest.bind(this)
    this.find = this.find.bind(this)
    this._createParamSetters(reqParams)
  }

  near(latLng) {
    return this.location(latLng)
  }

  // distance|bounds: <number>|<LatLngBounds> — can be distance from params.location (in meters) or LatLngBounds
  within(bounds) {
    let newBounds = bounds
    
    if (typeof newBounds === "number") {
      if (!this.location()) throw new Error(NO_LOCATION_FOR_BOUNDS)
      newBounds = new LatLng(this.location()).toBounds(newBounds * 2)
    }
    
    return this.searchExtent(newBounds)
  }

  async suggest(query) {
    if (NO_QUERY(query, this)) return []

    if (query) {
      if (typeof query === "string") {
        this.text(query)
      } else {
        this.params = { ...this.params, ...query }
      }
    }

    const res = await this._search("suggest")
    return res.suggestions
  }

  async find(text, key) {
    if (!text && !this.text()) return null

    if (text) this.text(text)
    this.magicKey(key ? key : "")
    this.SingleLine(this.text())

    const res = await this._search("findAddressCandidates")
    return res.candidates[0]
  }

  /////////////////////////////
  ////   PRIVATE METHODS   ////
  /////////////////////////////

  async _search(endpoint) {
    const paramsString = getParamsString(this.params)
    const searchURL = `${baseURL}/${endpoint}${paramsString}`
    const results = await fetch(searchURL)
    return results.json()
  }

  // returns `this` context to facilitate method chaining
  // if called with no newValue returns current value of param
  _paramSetter(param, newValue=null) {
    if (newValue === null) return this.params[param]
    this.params[param] = newValue
    return this
  }

  _createParamSetters(params) {
    params.forEach(param => {
      this[param] = this._paramSetter.bind(this, param)
    })
  }
}