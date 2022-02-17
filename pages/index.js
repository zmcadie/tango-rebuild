import { useEffect, useState, useMemo, useRef } from 'react'
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("components/mapComponents/MapContainer"), { ssr: false })
const TileLayer = dynamic(() => import("components/mapComponents/TileLayer"), { ssr: false })
const SearchBar = dynamic(() => import("components/mapComponents/SearchBar"), { ssr: false })
const MapBounds = dynamic(() => import("components/mapComponents/MapBounds"), { ssr: false })
const FeatureInfoDisplay = dynamic(() => import("components/mapComponents/FeatureInfoDisplay"), { ssr: false })

const MapLayers = dynamic(() => import("components/MapLayers"), { ssr: false })

const communityCentresJson = require("public/data/community_centres.geojson.json")
const civicCentresJson = require("public/data/civic_centres.geojson.json")
const schoolsJson = require("public/data/toronto_schools.geojson.json")
const librariesJson = require("public/data/toronto_libraries.geojson.json")
const residentsAssociations = require("public/data/groups.geojson.json")
const torontoWards = require("public/data/toronto-wards.json")

const layerData = {
  communityCentresJson,
  civicCentresJson,
  schoolsJson,
  librariesJson,
  residentsAssociations,
  torontoWards
}

const torontoBounds = require("public/data/toronto-boundary.geojson.json")
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
    <MapLayers data={ layerData } />
    <FeatureInfoDisplay />
  </MapContainer>
)

export default Home
