import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-polylinedecorator'

const INK_MARKER = new L.Icon({
  iconUrl: '/markers/ink-marker.svg',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -14],
})

const VERMILION = '#c23531'

// ── Label icon for each trajectory node ──
function buildStageLabel(stage, index, total) {
  const isLast = index === total - 1
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${isLast ? '#c23531' : '#2c1810'};
      color:#f4eade;
      font-family:'ZCOOL XiaoWei',serif;
      font-size:12px;
      padding:3px 12px;
      border-radius:14px;
      white-space:nowrap;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      border:1px solid ${isLast ? '#f4eade' : '#c4b998'};
      letter-spacing:1px;
    ">${index + 1}. ${stage}</div>`,
    iconSize: null,
    iconAnchor: [60, isLast ? 38 : 22],
  })
}

function TrajectoryLayer({ points }) {
  const map = useMap()
  const layerGroupRef = useRef(null)

  useEffect(() => {
    if (!points || points.length < 2) return

    // Clean up previous trajectory
    if (layerGroupRef.current) {
      layerGroupRef.current.remove()
      layerGroupRef.current = null
    }

    const group = L.featureGroup()
    const coords = points.map((p) => [p.lat, p.lng])

    // ── 1. Native Polyline (reliable) ──
    const polyline = L.polyline(coords, {
      color: VERMILION,
      weight: 4,
      opacity: 0.88,
      dashArray: null,
    })
    group.addLayer(polyline)

    // ── 2. Arrow decorators ──
    const arrowDecorator = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '12%',
          repeat: '22%',
          symbol: L.Symbol.arrowHead({
            pixelSize: 14,
            polygon: false,
            pathOptions: { color: VERMILION, weight: 3, fillOpacity: 1 },
          }),
        },
      ],
    })
    group.addLayer(arrowDecorator)

    // ── 3. Stage label + tooltip at each node ──
    points.forEach((p, i) => {
      const icon = buildStageLabel(p.stage, i, points.length)
      const labelMarker = L.marker([p.lat, p.lng], { icon, interactive: true })
      const tipLines = [
        `<b style="font-size:13px">${p.stage}</b>`,
        p.description ? `<span style="color:#4a3728;font-size:12px">${p.description}</span>` : '',
        p.locationName ? `<span style="color:#8b6914;font-size:11px">📍 ${p.locationName}</span>` : '',
      ].filter(Boolean).join('<br/>')
      labelMarker.bindTooltip(`<div style="font-family:'ZCOOL XiaoWei',serif;max-width:200px">${tipLines}</div>`, {
        direction: 'top',
        offset: [0, -8],
      })
      group.addLayer(labelMarker)
    })

    group.addTo(map)
    layerGroupRef.current = group

    // ── 4. Fit map to show the full trajectory ──
    const bounds = L.latLngBounds(coords)
    map.fitBounds(bounds, { padding: [70, 70], maxZoom: 7, animate: true })

    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.remove()
        layerGroupRef.current = null
      }
    }
  }, [points, map])

  return null
}

export default function MapView({ locations, activeFilter, onMarkerClick, trajectory, selectedCharacter }) {
  const filtered = activeFilter === '全部'
    ? locations
    : locations.filter((loc) => loc.type === activeFilter)

  return (
    <MapContainer
      center={[33.5, 108]}
      zoom={5}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filtered.map((loc) => (
        <Marker
          key={loc.id}
          position={loc.coordinates}
          icon={INK_MARKER}
          eventHandlers={{ click: () => onMarkerClick(loc) }}
        />
      ))}
      {trajectory && selectedCharacter && (
        <TrajectoryLayer points={trajectory} />
      )}
    </MapContainer>
  )
}
