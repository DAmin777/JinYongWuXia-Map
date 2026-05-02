# 古卷轴深色主题 UI 优化 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将金庸武侠地图从浅色宣纸风格改为古卷轴深色主题，新增搜索和小说筛选功能，增强动效。

**Architecture:** 渐进改造方案——在现有组件上逐步替换样式，不重构组件结构。新增 SearchBar 和 NovelFilter 作为独立组件嵌入 ControlPanel。App.jsx 新增搜索和小说筛选状态管理。

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3.4, Leaflet 1.9, react-leaflet 4.2

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `tailwind.config.js` | Modify | 新增深色系颜色变量 |
| `src/index.css` | Modify | 深色面板样式、轨迹流光动画、标记悬浮动效 |
| `src/components/ControlPanel.jsx` | Modify | 深色主题 + 搜索框 + 小说筛选器 |
| `src/components/Sidebar.jsx` | Modify | 深色主题 |
| `src/components/MapView.jsx` | Modify | 轨迹金色虚线 + 流光动画、标记悬浮动效 |
| `src/App.jsx` | Modify | 搜索和小说筛选状态管理、联动过滤逻辑 |

---

### Task 1: Tailwind 主题配置

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: 更新 tailwind.config.js 添加深色系颜色**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brush: ['"Ma Shan Zheng"', 'cursive'],
        xiaowei: ['"ZCOOL XiaoWei"', 'serif'],
      },
      colors: {
        scroll: {
          bg: '#1a1410',
          card: '#2a2118',
          gold: '#c9a84c',
          vermilion: '#c23531',
          text: '#d4c5a9',
          muted: '#8a7d6b',
          border: 'rgba(201,168,76,0.2)',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: 提交**

```bash
git add tailwind.config.js
git commit -m "feat: 添加深色主题 Tailwind 颜色配置"
```

---

### Task 2: 全局 CSS 深色面板样式与动画

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 更新 index.css，添加深色面板样式、轨迹流光动画、标记悬浮动效**

完整替换 `src/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'ZCOOL XiaoWei', serif;
}

/* ── Ink-wash tile filter ── */
.leaflet-tile {
  filter: sepia(0.45) saturate(0.35) brightness(1.08) hue-rotate(350deg) contrast(0.9);
}

/* ── Rice paper background on the map container ── */
.leaflet-container {
  background-color: #f4eade;
}

/* ── Subtle paper texture overlay on map ── */
.leaflet-container::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  background-image: url('/textures/rice-paper.svg');
  background-size: cover;
  opacity: 0.18;
  mix-blend-mode: multiply;
}

/* ── Dark panel paper texture ── */
.scroll-panel {
  background-color: #1a1410;
  background-image: url('/textures/rice-paper.svg');
  background-size: cover;
  background-blend-mode: overlay;
  position: relative;
}

.scroll-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(26, 20, 16, 0.92);
  pointer-events: none;
  border-radius: inherit;
}

.scroll-panel > * {
  position: relative;
  z-index: 1;
}

/* ── Trajectory flow animation ── */
@keyframes trajectory-flow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -30;
  }
}

.trajectory-line-animated {
  animation: trajectory-flow 1.5s linear infinite;
}

/* ── Map marker hover effect ── */
.ink-marker-hover {
  transition: transform 0.2s ease, filter 0.2s ease;
}

.ink-marker-hover:hover {
  transform: scale(1.3) !important;
  filter: drop-shadow(0 0 6px rgba(201, 168, 76, 0.6));
}

/* ── Panel fade-in on load ── */
@keyframes panel-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-fade-in {
  animation: panel-fade-in 0.5s ease-out;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/index.css
git commit -m "feat: 添加深色面板样式、轨迹流光动画、标记悬浮动效"
```

---

### Task 3: ControlPanel 深色主题 + 搜索框 + 小说筛选器

**Files:**
- Modify: `src/components/ControlPanel.jsx`

- [ ] **Step 1: 重写 ControlPanel.jsx**

完整替换 `src/components/ControlPanel.jsx`：

```jsx
import { useState } from 'react'

const FILTERS = [
  { value: '全部', label: '查看全部' },
  { value: 'sect', label: '查看门派' },
  { value: 'landmark', label: '查看名胜' },
]

export default function ControlPanel({
  activeFilter,
  onFilterChange,
  selectedCharacterId,
  onCharacterChange,
  characters,
  searchQuery,
  onSearchChange,
  selectedNovels,
  onNovelToggle,
  novelList,
  filteredCharacters,
}) {
  return (
    <div
      className="absolute top-6 left-6 z-[1000] rounded-xl shadow-2xl px-5 py-4 w-[260px] border flex flex-col scroll-panel panel-fade-in"
      style={{
        borderColor: 'rgba(201,168,76,0.25)',
        maxHeight: 'calc(100vh - 48px)',
      }}
    >
      {/* Fixed header area */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-brush mb-0.5 tracking-widest text-scroll-gold">
          金庸武林地图
        </h1>
        <p className="text-xs mb-3 font-xiaowei text-scroll-muted">
          探索金庸武侠世界的每一寸江湖
        </p>

        {/* Search box */}
        <div className="relative mb-3">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-scroll-muted"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索人物、地点、武功..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-xiaowei border transition-all duration-200 outline-none"
            style={{
              backgroundColor: '#2a2118',
              borderColor: 'rgba(201,168,76,0.2)',
              color: '#d4c5a9',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#c9a84c'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />
        </div>

        {/* Novel filter tags */}
        {novelList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 max-h-[72px] overflow-y-auto">
            {novelList.map((novel) => {
              const isActive = selectedNovels.includes(novel)
              return (
                <button
                  key={novel}
                  onClick={() => onNovelToggle(novel)}
                  className="px-2 py-0.5 rounded text-[10px] font-xiaowei border transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#c9a84c' : '#2a2118',
                    borderColor: isActive ? '#c9a84c' : 'rgba(201,168,76,0.2)',
                    color: isActive ? '#1a1410' : '#8a7d6b',
                  }}
                >
                  {novel.length > 4 ? novel.slice(0, 4) + '…' : novel}
                </button>
              )
            })}
          </div>
        )}

        {/* Type filter buttons */}
        <div className="flex gap-1.5 mb-3">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className="px-3 py-1 rounded-full text-xs font-xiaowei transition-all duration-200 border"
              style={
                activeFilter === f.value
                  ? { backgroundColor: '#c9a84c', color: '#1a1410', borderColor: '#c9a84c' }
                  : { backgroundColor: 'transparent', color: '#8a7d6b', borderColor: 'rgba(201,168,76,0.3)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="border-t mb-3" style={{ borderColor: 'rgba(201,168,76,0.2)' }} />

        <h2 className="text-xs font-xiaowei font-semibold mb-2 tracking-wide text-scroll-gold">
          人物名册
        </h2>
      </div>

      {/* Scrollable roster */}
      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
        {filteredCharacters.length === 0 && (
          <p className="text-xs text-scroll-muted font-xiaowei text-center py-4">
            未找到相关武林秘闻
          </p>
        )}
        {filteredCharacters.map((ch) => {
          const isSelected = selectedCharacterId === ch.id
          return (
            <button
              key={ch.id}
              onClick={() => onCharacterChange(isSelected ? '' : ch.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 border flex-shrink-0"
              style={{
                backgroundColor: isSelected ? 'rgba(194,53,49,0.15)' : 'rgba(42,33,24,0.5)',
                borderColor: isSelected ? '#c23531' : 'rgba(201,168,76,0.15)',
                borderLeftWidth: isSelected ? '3px' : '1px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.backgroundColor = 'rgba(42,33,24,0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'
                  e.currentTarget.style.backgroundColor = 'rgba(42,33,24,0.5)'
                }
              }}
            >
              <img
                src={ch.avatar_url}
                alt={ch.name}
                className="w-9 h-9 rounded-full flex-shrink-0 border"
                style={{ borderColor: 'rgba(201,168,76,0.3)' }}
              />
              <div className="min-w-0">
                <div
                  className="text-sm font-xiaowei truncate"
                  style={{ color: isSelected ? '#c23531' : '#d4c5a9' }}
                >
                  {ch.name}
                </div>
                <div className="text-xs truncate text-scroll-muted">
                  {ch.faction}
                </div>
              </div>
              {isSelected && (
                <span className="ml-auto text-xs flex-shrink-0 text-scroll-gold">
                  追踪中
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/ControlPanel.jsx
git commit -m "feat: ControlPanel 深色主题 + 搜索框 + 小说筛选器"
```

---

### Task 4: Sidebar 深色主题

**Files:**
- Modify: `src/components/Sidebar.jsx`

- [ ] **Step 1: 重写 Sidebar.jsx 深色主题**

完整替换 `src/components/Sidebar.jsx`：

```jsx
const TYPE_MAP = {
  sect: { label: '门派', bg: '#c23531', border: '#c23531', color: '#fef3c7' },
  landmark: { label: '名胜', bg: '#c9a84c', border: '#c9a84c', color: '#1a1410' },
}

export default function Sidebar({ location, character, onClose }) {
  const isOpen = location || character
  const typeInfo = location ? TYPE_MAP[location.type] : null

  return (
    <div
      className={
        `absolute top-0 right-0 h-full z-[1000] transition-transform duration-350 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
      }
    >
      <div
        className="w-[300px] h-full overflow-y-auto shadow-2xl border-l scroll-panel"
        style={{
          borderColor: 'rgba(201,168,76,0.25)',
          color: '#d4c5a9',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 z-10 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: '#c9a84c' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2a2118'
            e.currentTarget.style.color = '#d4c5a9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#c9a84c'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Location detail ── */}
        {location && (
          <div className="px-6 py-8">
            <h2 className="text-3xl font-brush mb-1 tracking-widest text-scroll-gold">{location.name}</h2>
            <span
              className="inline-block px-3 py-0.5 text-xs font-xiaowei rounded-full mb-4 border"
              style={{ backgroundColor: typeInfo.bg, borderColor: typeInfo.border, color: typeInfo.color }}
            >{typeInfo.label}</span>
            <div className="border-t mb-4" style={{ borderColor: 'rgba(201,168,76,0.2)' }} />
            <p className="text-sm leading-relaxed mb-4 font-xiaowei text-scroll-text">{location.description}</p>
            {location.novels?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">出处</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {location.novels.map((n) => (
                    <span key={n} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}>{n}</span>
                  ))}
                </div>
              </>
            )}
            {location.characters?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">代表人物</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {location.characters.map((ch) => (
                    <span key={ch} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}>{ch}</span>
                  ))}
                </div>
              </>
            )}
            {location.skills?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">代表武功</h3>
                <div className="flex flex-wrap gap-1.5">
                  {location.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}>{sk}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Character detail ── */}
        {character && !location && (
          <div className="px-6 py-8">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={character.avatar_url}
                alt={character.name}
                className="w-16 h-16 rounded-full border-2 flex-shrink-0"
                style={{ borderColor: '#c9a84c' }}
              />
              <div>
                <h2 className="text-2xl font-brush tracking-widest text-scroll-gold">{character.name}</h2>
                <span className="text-xs font-xiaowei text-scroll-muted">{character.nickname}</span>
              </div>
            </div>

            <div className="border-t mb-4" style={{ borderColor: 'rgba(201,168,76,0.2)' }} />

            <p className="text-sm leading-relaxed mb-4 font-xiaowei text-scroll-text">{character.description}</p>

            <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">阵营</h3>
            <span
              className="inline-block px-3 py-1 text-xs rounded border font-xiaowei mb-5"
              style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}
            >{character.faction}</span>

            {character.skills?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">武功绝学</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {character.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 text-xs rounded border font-xiaowei"
                      style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}>{sk}</span>
                  ))}
                </div>
              </>
            )}

            {character.novels?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei text-scroll-gold">登场作品</h3>
                <div className="flex flex-wrap gap-1.5">
                  {character.novels.map((n) => (
                    <span key={n} className="px-2.5 py-1 text-xs rounded border font-xiaowei"
                      style={{ backgroundColor: '#2a2118', borderColor: 'rgba(201,168,76,0.3)', color: '#d4c5a9' }}>{n}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Sidebar.jsx
git commit -m "feat: Sidebar 深色古卷轴主题"
```

---

### Task 5: MapView 轨迹金色虚线 + 流光动画 + 标记悬浮

**Files:**
- Modify: `src/components/MapView.jsx`

- [ ] **Step 1: 重写 MapView.jsx 轨迹和标记**

完整替换 `src/components/MapView.jsx`：

```jsx
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
  className: 'ink-marker-hover',
})

const GOLD = '#c9a84c'

function buildStageLabel(stage, index, total) {
  const isLast = index === total - 1
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${isLast ? '#c23531' : '#2a2118'};
      color:#c9a84c;
      font-family:'ZCOOL XiaoWei',serif;
      font-size:12px;
      padding:3px 12px;
      border-radius:14px;
      white-space:nowrap;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      border:1px solid ${isLast ? '#c9a84c' : 'rgba(201,168,76,0.4)'};
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

    if (layerGroupRef.current) {
      layerGroupRef.current.remove()
      layerGroupRef.current = null
    }

    const group = L.featureGroup()
    const coords = points.map((p) => [p.lat, p.lng])

    // ── 1. Gold dashed polyline ──
    const polyline = L.polyline(coords, {
      color: GOLD,
      weight: 3,
      opacity: 0.85,
      dashArray: '12 8',
      className: 'trajectory-line-animated',
    })
    group.addLayer(polyline)

    // ── 2. Arrow decorators ──
    const arrowDecorator = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '12%',
          repeat: '22%',
          symbol: L.Symbol.arrowHead({
            pixelSize: 12,
            polygon: false,
            pathOptions: { color: GOLD, weight: 2, fillOpacity: 0.8 },
          }),
        },
      ],
    })
    group.addLayer(arrowDecorator)

    // ── 3. Stage labels + tooltips ──
    points.forEach((p, i) => {
      const icon = buildStageLabel(p.stage, i, points.length)
      const labelMarker = L.marker([p.lat, p.lng], { icon, interactive: true })
      const tipLines = [
        `<b style="font-size:13px;color:#c9a84c">${p.stage}</b>`,
        p.description ? `<span style="color:#d4c5a9;font-size:12px">${p.description}</span>` : '',
        p.locationName ? `<span style="color:#c9a84c;font-size:11px">📍 ${p.locationName}</span>` : '',
      ].filter(Boolean).join('<br/>')
      labelMarker.bindTooltip(`<div style="font-family:'ZCOOL XiaoWei',serif;max-width:200px;background:#1a1410;border:1px solid rgba(201,168,76,0.3);color:#d4c5a9;padding:8px;border-radius:6px">${tipLines}</div>`, {
        direction: 'top',
        offset: [0, -8],
      })
      group.addLayer(labelMarker)
    })

    group.addTo(map)
    layerGroupRef.current = group

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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/MapView.jsx
git commit -m "feat: 轨迹金色虚线 + 流光动画 + 标记悬浮动效"
```

---

### Task 6: App.jsx 搜索和小说筛选状态管理

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: 重写 App.jsx，添加搜索和小说筛选逻辑**

完整替换 `src/App.jsx`：

```jsx
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

function resolveTrajectory(char) {
  if (!char) return null

  if (char.trajectory) {
    return char.trajectory
      .filter((t) => locMap[t.location_id])
      .map((t) => {
        const [lat, lng] = locMap[t.location_id].coordinates
        return { lat, lng, stage: t.stage, description: t.description, locationName: locMap[t.location_id].name }
      })
  }

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
  const [searchQuery, setSearchQuery] = useState('')
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
    let result = characters

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((ch) =>
        ch.name.toLowerCase().includes(q) ||
        ch.skills?.some((s) => s.toLowerCase().includes(q)) ||
        ch.faction?.toLowerCase().includes(q) ||
        ch.nickname?.toLowerCase().includes(q)
      )
    }

    if (selectedNovels.length > 0) {
      result = result.filter((ch) =>
        ch.novels.some((n) => selectedNovels.includes(n))
      )
    }

    return result
  }, [characters, searchQuery, selectedNovels])

  const filteredLocations = useMemo(() => {
    let result = locations

    if (selectedNovels.length > 0) {
      result = result.filter((loc) =>
        loc.novels.some((n) => selectedNovels.includes(n))
      )
    }

    if (activeFilter !== '全部') {
      result = result.filter((loc) => loc.type === activeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.skills?.some((s) => s.toLowerCase().includes(q)) ||
        loc.characters?.some((c) => c.toLowerCase().includes(q))
      )
    }

    return result
  }, [locations, activeFilter, searchQuery, selectedNovels])

  function handleNovelToggle(novel) {
    setSelectedNovels((prev) =>
      prev.includes(novel)
        ? prev.filter((n) => n !== novel)
        : [...prev, novel]
    )
  }

  function handleCharacterChange(id) {
    setSelectedCharacterId(id)
    setSelectedLocation(null)
  }

  function handleMarkerClick(loc) {
    setSelectedLocation(loc)
    setSelectedCharacterId('')
  }

  return (
    <div className="relative w-full h-full">
      <MapView
        locations={filteredLocations}
        activeFilter="全部"
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/App.jsx
git commit -m "feat: 搜索和小说筛选状态管理 + 联动过滤"
```

---

### Task 7: 启动验证

- [ ] **Step 1: 启动开发服务器验证**

```bash
npm run dev
```

打开浏览器检查：
1. 左侧面板是否为深色古卷轴风格
2. 搜索框是否可输入并过滤人物
3. 小说筛选标签是否可点击过滤
4. 右侧详情侧边栏是否为深色主题
5. 地图是否保持浅色宣纸风格
6. 点击人物后轨迹线是否为金色虚线
7. 悬浮标记是否有放大发光效果
8. 页面加载时面板是否有淡入动画

- [ ] **Step 2: 修复发现的问题**

根据验证结果修复任何样式或功能问题，然后提交。

```bash
git add -A
git commit -m "fix: 修复验证中发现的问题"
```
