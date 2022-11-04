import { useEffect, useState } from "react"
import L, { LayerGroup } from "leaflet"
import 'leaflet.markercluster'

import GeoJSONLayer from "./mapComponents/GeoJSONLayer"
import LayerControl from "./mapComponents/LayerControl"
import { useMapContext } from "context/mapContext"

import styles from './MapLayers.module.scss'

const createLayer = ({ data, options={} }) => {
  const isCollection = Array.isArray(data)
  const layer = isCollection
    ? new LayerGroup(data.map(item => createLayer(item)))
    : GeoJSONLayer.create(data, {...options})
  if (options.cluster) {
    const clusterLayer = L.markerClusterGroup({
      showCoverageOnHover: false,
      options: { color: "red" },
      iconCreateFunction: function(cluster) {
        return new L.customIcon({ count: cluster.getChildCount() });
      }
    })
    clusterLayer.addLayer(layer)
    return clusterLayer
  }
  return layer
}

const MapLayers = ({ data }) => {
  const { map } = useMapContext()
  const [mapLayers, setMapLayers ] = useState([])

  useEffect(() => {
    if (data) {
      const {
        communityCentresJson,
        civicCentresJson,
        schoolsJson,
        librariesJson,
        residentsAssociations,
        facebookGroups,
        torontoWards,
        cansNetwork,
        corraNetwork,
        fontraNetwork,
        gbnaNetwork,
        sescaNetwork,
        westSideCCNetwork
      } = data

      const defaultLayerActions = layer => ({
        add: () => layer.addTo(map),
        remove: () => map.removeLayer(layer)
      })

      const groupsLayers = []
      const regionalNetworksLayers = []
      const neighbourhoodInfoLayers = []

      const neighbourhoodGroupsLayer = createLayer({
        data: residentsAssociations
      })
      groupsLayers.push({
        label: "Neighbourhood Groups",
        icon: "/img/group-icons/neighbourhood-groups.png",
        renderOnLoad: true,
        layer: defaultLayerActions(neighbourhoodGroupsLayer)
      })
      
      groupsLayers.push({
        label: "Park Groups",
        icon: "/img/group-icons/park-groups.png",
        layer: { add: () => {}, remove: () => {}}
      })
      
      const facebookGroupsLayer = createLayer({ data: facebookGroups })
      groupsLayers.push({
        label: "Facebook Groups",
        icon: "/img/group-icons/facebook-groups.png",
        layer: defaultLayerActions(facebookGroupsLayer)
      })

      const cansNetworkLayer = createLayer({ data: cansNetwork })
      regionalNetworksLayers.push({
        label: "CANS",
        highlight: "#f8971b",
        layer: defaultLayerActions(cansNetworkLayer)
      })

      const corraNetworkLayer = createLayer({ data: corraNetwork })
      regionalNetworksLayers.push({
        label: "CORRA",
        highlight: "#f4eb37",
        layer: defaultLayerActions(corraNetworkLayer)
      })

      const fontraNetworkLayer = createLayer({ data: fontraNetwork })
      regionalNetworksLayers.push({
        label: "FONTRA",
        highlight: "#db4436",
        layer: defaultLayerActions(fontraNetworkLayer)
      })

      const gbnaNetworkLayer = createLayer({ data: gbnaNetwork })
      regionalNetworksLayers.push({
        label: "GBNA",
        highlight: "#7c3592",
        layer: defaultLayerActions(gbnaNetworkLayer)
      })

      const sescaNetworkLayer = createLayer({ data: sescaNetwork })
      regionalNetworksLayers.push({
        label: "SESCA",
        highlight: "#735348",
        layer: defaultLayerActions(sescaNetworkLayer)
      })

      const westSideCCNetworkLayer = createLayer({ data: westSideCCNetwork })
      regionalNetworksLayers.push({
        label: "West Side CC",
        highlight: "#009d57",
        layer: defaultLayerActions(westSideCCNetworkLayer)
      })


      const meetingPlacesLayer = createLayer({
        data: [
          {
            data: communityCentresJson,
            options: {
              displayProperties: [
                { property: "address", label: "Address" },
                { property: "phone number", label: "Phone #" },
              ]
            }
          },
          {
            data: civicCentresJson,
            options: {
              style: { color: "salmon" },
              displayProperties: [
                { property: "address", label: "Address" },
              ]
            }
          },
          {
            data: schoolsJson,
            options: {
              style: { color: "purple" },
              displayProperties: [
                { property: "board name", label: "School Board" },
                { property: "address", label: "Address" },
                { property: "postal code", label: "Postal Code" },
                { property: "municipality", label: "Municipality" },
              ]
            }
          },
          {
            data: librariesJson,
            options: {
              style: { color: "blue" },
              displayProperties: [
                { property: "address", label: "Address" },
                { property: "link", label: "Website" },
              ]
            }
          }
        ],
        options: {
          cluster: true
        }
      })

      neighbourhoodInfoLayers.push({
        label: "Meeting places",
        icon: "data:image/png;base64,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",
        layer: defaultLayerActions(meetingPlacesLayer)
      })

      const cityWardsLayer = createLayer({
        data: torontoWards,
        options: {
          style: {
            color: "red",
            fillOpacity: 0
          },
          highlightClass: styles.highlight,
          onMouseOver: event => {
            const { _map: map, feature, getElement } = event.target
            map._infoControl.display(feature)
            let element = event.target.getElement()
            map._resetHighlight && map._resetHighlight()
            element.classList.add(styles.highlight)
            map._resetHighlight = () => element.classList.remove(styles.highlight)
          }
        }
      })
      neighbourhoodInfoLayers.push({
        label: "City Wards",
        icon: "https://png.pngtree.com/png-vector/20190302/ourlarge/pngtree-vector-neighborhood-icon-png-image_735885.jpg",
        layer: defaultLayerActions(cityWardsLayer)
      })

      const mapLayers = [
        {
          title: "Groups",
          layers: groupsLayers,
          primary: true
        },
        {
          title: "Regional Networks",
          layers: regionalNetworksLayers
        },
        {
          title: "Neighbourhood Info",
          layers: neighbourhoodInfoLayers
        }
      ]

      setMapLayers(mapLayers)
    }
  }, [ data ])

  useEffect(() => {
    const primaryLayerGroup = mapLayers.find(group => group.primary)
    primaryLayerGroup?.layers.forEach(mapLayer => {
      if (mapLayer.renderOnLoad) mapLayer.layer.add(map)
    })
    return () => mapLayers.forEach(mapLayer => mapLayer.layer.remove())
  }, [ map, mapLayers ])

  return <LayerControl layerGroups={ mapLayers } />
}

export default MapLayers