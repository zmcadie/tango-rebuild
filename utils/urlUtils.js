export const getParamType = param => {
  if (Array.isArray(param)) return "array"
  if (typeof param === "object") {
    if ("lat" in param) return "LatLng"
    if ("toBBoxString" in param) return "LatLngBounds"
    return "object"
  }
  return typeof param
}

export const toParamValue = value => {
  const type = getParamType(value)
  let param = value
  
  switch (type) {
    case "LatLng":
      const { lat, lng } = value
      param = [lng, lat].toString()
      break
    case "LatLngBounds":
      param = param.toBBoxString()
      break
    case "object":
      param = JSON.stringify(value)
    case "array":
    default:
      param = value.toString()
      break
  }

  return encodeURIComponent(param)
}

export const getParamsString = params => {
  const paramsString = Object.keys(params)
    .map(key => {
      return `${encodeURIComponent(key)}=${toParamValue(params[key])}`
    }).join("&")
  return "?" + paramsString
}