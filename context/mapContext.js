import { createContext, useContext } from "react"

export const MapContext = createContext({})

export const MapProvider = MapContext.Provider

export const useMapContext = () => {
  const context = useContext(MapContext)
  if (context == null) {
    throw new Error("No context, useMapContext can only be used in a child of <MapContainer>")
  }
  return context
}