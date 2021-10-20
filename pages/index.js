import { useEffect, useState, useMemo, useRef } from 'react'
import dynamic from "next/dynamic"

const communityCentresJson = require("public/data/community_centres.geojson.json")
const civicCentresJson = require("public/data/civic_centres.geojson.json")
const schoolsJson = require("public/data/toronto_schools.geojson.json")
const librariesJson = require("public/data/toronto_libraries.geojson.json")
const residentantsAssociations = require("public/data/groups.geojson.json")
const torontoBounds = require("public/data/toronto-boundary.geojson.json")
const torontoWards = require("public/data/toronto-wards.json")

const MapContainer = dynamic(() => import("components/mapComponents/MapContainer"), { ssr: false })
const TileLayer = dynamic(() => import("components/mapComponents/TileLayer"), { ssr: false })
// const SearchBar = dynamic(() => import("components/mapComponents/SearchBar"), { ssr: false })
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

const layers = [
  {
    label: "Neighbourhood Groups",
    data: residentantsAssociations,
    icon: "https://o365reports.com/wp-content/uploads/2016/08/office365-groups-icon.png",
    renderOnLoad: true
  },
  {
    label: "Meeting places",
    icon: "data:image/png;base64,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",
    data: [
      { data: communityCentresJson },
      { data: civicCentresJson, options: { style: { color: "salmon" }} },
      { data: schoolsJson, options: { style: { color: "purple" }} },
      { data: librariesJson, options: { style: { color: "blue" }} },
    ],
    options: {
      cluster: true
    }
  },
  {
    label: "City Wards",
    data: torontoWards,
    icon: "https://png.pngtree.com/png-vector/20190302/ourlarge/pngtree-vector-neighborhood-icon-png-image_735885.jpg",
    // options: { style: { color: "salmon" }}
  }
]

const Home = () => (
  <MapContainer {...mapOptions}>
    {/* <SearchBar /> */}
    <TileLayer {...tileOptions} />
    <MapBounds bounds={ torontoBounds } />
    <GeoJSONDisplay {...{ layers }} />
  </MapContainer>
)

export default Home
