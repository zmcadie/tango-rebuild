import { useEffect, useMemo, useRef, useState } from "react"
import { Map, Marker, DivIcon } from "leaflet"
import Head from "next/head"

import 'leaflet/dist/leaflet.css'
import styles from './MapContainer.module.scss'

import { MapProvider } from "context/mapContext"

const Icon = DivIcon.extend({
  options: {
    html: '<svg height="41" width="41" viewbox="0 0 41 41"><path d="M20.5,0C12.964,0,6.833,6.131,6.833,13.666c0,2.262,0.565,4.505,1.64,6.494L19.752,40.559c0.15,0.272,0.436,0.444,0.747,0.44s0.597-0.168,0.747-0.44l11.282-20.404c1.071-1.982,1.636-4.226,1.636-6.488C34.166,6.131,28.035,0,20.5,0z"></path><circle cx="50%" cy="33%" r="6" fill="white"></circle></svg>',
    className: styles.marker,
    iconAnchor: [21, 41],
    popupAnchor: [0, -30]
  },
  createIcon: function(oldIcon) {
    const icon = DivIcon.prototype.createIcon.call(this, oldIcon)
    icon.style.fill = this.options.color
    return icon
  }
})

Marker.prototype.options.riseOnHover = true

Marker.addInitHook(function() {
  this.setIcon(new Icon({ color: this.options.color }))
})

export default function MapContainer({
  children,
  className="",
  style={},
  ...options
}) {
  const [ map, setMap ] = useState()
  const mapRef = useRef()

  useEffect(() => {
    if (mapRef.current != null && map == null) {
      const mymap = new Map(mapRef.current, options)
      setMap(mymap)
    }
  }, [ mapRef, map, options ])

  const context = useMemo(() => map ? { map } : null, [ map ])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no" />
      </Head>
      <div {...{ style, className }} ref={ mapRef }>
        <MapProvider value={ context }>{ children }</MapProvider>
      </div>
    </>
  )
}