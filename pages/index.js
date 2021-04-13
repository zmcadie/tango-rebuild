import { useEffect, useState, useMemo, useRef } from 'react'
import dynamic from "next/dynamic"

const communityCentresJson = require("public/data/community_centres.geojson.json")
const civicCentresJson = require("public/data/civic_centres.geojson.json")
// const residentantsAssociations = require("public/data/Toronto_Residents_Associations_and_Neighbourhood_Groups.geojson.json")
const residentantsAssociations = require("public/data/groups.geojson.json")
const torontoBounds = require("public/data/toronto-boundary.geojson.json")

const MapContainer = dynamic(() => import("components/mapComponents/MapContainer"), { ssr: false })
const TileLayer = dynamic(() => import("components/mapComponents/TileLayer"), { ssr: false })
const SearchBar = dynamic(() => import("components/mapComponents/SearchBar"), { ssr: false })
const MapBounds = dynamic(() => import("components/mapComponents/MapBounds"), { ssr: false })
const GeoJSONDisplay = dynamic(() => import("components/mapComponents/GeoJSONDisplay"), { ssr: false })

const torontoCenter = { lat: 43.72, lng: -79.3849 };
const mapOptions = {
  center: torontoCenter,
  zoom: 11,
  style: {
    flex: "1 1",
    width: "100vw"
  }
}

const tileOptions = {
  src: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  minZoom: 10,
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_API
}

const Home = () => (
  <MapContainer {...mapOptions}>
    <SearchBar />
    <TileLayer {...tileOptions} />
    <MapBounds bounds={ torontoBounds } />
    {/* <GeoJSONLayer data={ communityCentresJson } /> */}
    {/* <GeoJSONLayer data={ residentantsAssociations } /> */}
    {/* <GeoJSONLayer data={ civicCentresJson } /> */}
    <GeoJSONDisplay layers={[
      // { data: communityCentresJson },
      { data: residentantsAssociations },
      { data: civicCentresJson }
    ]} />
  </MapContainer>
)

export default Home
