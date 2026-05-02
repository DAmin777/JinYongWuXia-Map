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
  const [selectedNovels, setSelectedNovels] = useState([])

  const novelList = useMemo(() => {
    const set = new Set()
    characters.forEach((ch) => ch.novels.forEach((n) => set.add(n)))
    locations.forEach((loc) => loc.novels.forEach((n) => set.add(n)))
    return [...set].sort()
  }, [])

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedCharacterId) || null,
    [selectedCharacterId],
  )

  const trajectory = useMemo(
    () => resolveTrajectory(selectedCharacter),
    [selectedCharacter],
  )

  const filteredCharacters = useMemo(() => {
    if (selectedNovels.length === 0) return characters
    return characters.filter((ch) => ch.novels.some((n) => selectedNovels.includes(n)))
  }, [selectedNovels])

  const filteredLocations = useMemo(() => {
    let result = locations
    if (selectedNovels.length > 0) {
      result = result.filter((loc) => loc.novels.some((n) => selectedNovels.includes(n)))
    }
    return result
  }, [selectedNovels])

  function handleNovelToggle(novel) {
    setSelectedNovels((prev) =>
      prev.includes(novel) ? prev.filter((n) => n !== novel) : [...prev, novel]
    )
  }

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
        locations={filteredLocations}
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
        selectedNovels={selectedNovels}
        onNovelToggle={handleNovelToggle}
        novelList={novelList}
        filteredCharacters={filteredCharacters}
      />
      <Sidebar
        location={selectedLocation}
        character={selectedCharacter}
        onClose={() => { setSelectedLocation(null); setSelectedCharacterId('') }}
      />
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] text-[10px] text-center px-3 py-0.5 rounded hidden sm:block"
        style={{
          color: '#8b7355',
          backgroundColor: 'rgba(244,234,222,0.85)',
          maxWidth: '600px',
        }}
      >
        本项目为个人基于对金庸武侠世界的喜爱而开发的非商业练手项目，仅供学习与技术交流使用。项目中涉及的人物、地名、武功等所有相关 IP 版权均归金庸先生及原版权方所有。
      </div>
    </div>
  )
}
