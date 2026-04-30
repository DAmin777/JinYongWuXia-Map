import { useState, useMemo } from 'react'
import MapView from './components/MapView'
import ControlPanel from './components/ControlPanel'
import Sidebar from './components/Sidebar'
import locations from './data/wuxia_data.json'
import characters from './data/wuxia_characters.json'

const locMap = {}
locations.forEach((loc) => {
  locMap[loc.id] = { coordinates: loc.coordinates, name: loc.name }
})

/** Resolve a character's trajectory to coordinate points, auto-generating from core_location_id + related_locations if needed */
function resolveTrajectory(char) {
  if (!char) return null

  // If character has pre-defined detailed trajectory
  if (char.trajectory) {
    return char.trajectory
      .filter((t) => locMap[t.location_id])
      .map((t) => {
        const [lat, lng] = locMap[t.location_id].coordinates
        return { lat, lng, stage: t.stage, description: t.description, locationName: locMap[t.location_id].name }
      })
  }

  // Auto-generate from core_location_id + related_locations
  const ids = [char.core_location_id, ...(char.related_locations || [])]
  const valid = ids.filter((id) => locMap[id])
  if (valid.length < 2) return null

  return valid.map((id, i) => {
    const [lat, lng] = locMap[id].coordinates
    return { lat, lng, stage: i === 0 ? '主要据点' : `行踪${i}`, description: `前往${locMap[id].name}`, locationName: locMap[id].name }
  })
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState('全部')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState('')

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedCharacterId) || null,
    [selectedCharacterId],
  )

  const trajectory = useMemo(
    () => resolveTrajectory(selectedCharacter),
    [selectedCharacter],
  )

  // When clicking a character card, clear any open location panel
  function handleCharacterChange(id) {
    setSelectedCharacterId(id)
    setSelectedLocation(null)
  }

  // When clicking a map marker, clear character selection
  function handleMarkerClick(loc) {
    setSelectedLocation(loc)
    setSelectedCharacterId('')
  }

  return (
    <div className="relative w-full h-full">
      <MapView
        locations={locations}
        activeFilter={activeFilter}
        onMarkerClick={handleMarkerClick}
        trajectory={trajectory}
        selectedCharacter={selectedCharacter}
      />
      <ControlPanel
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        selectedCharacterId={selectedCharacterId}
        onCharacterChange={handleCharacterChange}
        characters={characters}
      />
      <Sidebar
        location={selectedLocation}
        character={selectedCharacter}
        onClose={() => { setSelectedLocation(null); setSelectedCharacterId('') }}
      />
    </div>
  )
}
