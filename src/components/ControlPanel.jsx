const FILTERS = [
  { value: '全部', label: '查看全部' },
  { value: 'sect', label: '查看门派' },
  { value: 'landmark', label: '查看名胜' },
]

const panelStyle = {
  backgroundColor: 'rgba(244, 234, 222, 0.90)',
  borderColor: '#c4b998',
  color: '#2c1810',
}

function CharacterRoster({ filteredCharacters, selectedCharacterId, onCharacterChange }) {
  if (filteredCharacters.length === 0) {
    return (
      <p className="text-xs text-center py-4" style={{ color: '#8b7355' }}>
        未找到相关人物
      </p>
    )
  }

  return filteredCharacters.map((ch) => {
    const isSelected = selectedCharacterId === ch.id
    return (
      <button
        key={ch.id}
        onClick={() => onCharacterChange(isSelected ? '' : ch.id)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 border flex-shrink-0"
        style={{
          backgroundColor: isSelected ? 'rgba(194, 53, 49, 0.10)' : 'rgba(250, 246, 239, 0.5)',
          borderColor: isSelected ? '#c23531' : '#d4c4a8',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f0ebdf'
            e.currentTarget.style.borderColor = '#c4b998'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'rgba(250, 246, 239, 0.5)'
            e.currentTarget.style.borderColor = '#d4c4a8'
          }
        }}
      >
        <img
          src={ch.avatar_url}
          alt={ch.name}
          className="w-9 h-9 rounded-full flex-shrink-0 border"
          style={{ borderColor: '#c4b998' }}
        />
        <div className="min-w-0">
          <div
            className="text-sm font-xiaowei truncate"
            style={{ color: isSelected ? '#c23531' : '#2c1810' }}
          >
            {ch.name}
          </div>
          <div className="text-xs truncate" style={{ color: '#8b7355' }}>
            {ch.faction}
          </div>
        </div>
        {isSelected && (
          <span className="ml-auto text-xs flex-shrink-0" style={{ color: '#c23531' }}>
            追踪中
          </span>
        )}
      </button>
    )
  })
}

export default function ControlPanel({
  activeFilter,
  onFilterChange,
  selectedCharacterId,
  onCharacterChange,
  selectedNovels,
  onNovelToggle,
  novelList,
  filteredCharacters,
  mobileMenuOpen,
  onMobileMenuToggle,
  onMobileMenuClose,
}) {
  return (
    <>
      {/* ═══════════════════ Desktop panel ═══════════════════ */}
      <div
        className="hidden md:flex absolute top-6 left-6 z-[1000] rounded-xl shadow-2xl px-5 py-4 w-[240px] backdrop-blur-md border flex-col"
        style={{
          ...panelStyle,
          maxHeight: 'calc(100vh - 48px)',
        }}
      >
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-brush mb-0.5 tracking-widest">
            金庸武林地图
          </h1>
          <p className="text-xs mb-3 font-xiaowei" style={{ color: '#8b7355' }}>
            探索金庸武侠世界的每一寸江湖
          </p>

          {/* Novel filter tags */}
          <div className="flex flex-wrap gap-1 mb-3 max-h-[72px] overflow-y-auto">
            {novelList.map((novel) => {
              const isActive = selectedNovels.includes(novel)
              return (
                <button
                  key={novel}
                  onClick={() => onNovelToggle(novel)}
                  className="px-2 py-0.5 rounded text-[10px] font-xiaowei border transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#2c1810' : 'rgba(250, 246, 239, 0.7)',
                    borderColor: isActive ? '#2c1810' : '#c4b998',
                    color: isActive ? '#f4eade' : '#4a3728',
                  }}
                >
                  {novel.length > 4 ? novel.slice(0, 4) + '…' : novel}
                </button>
              )
            })}
          </div>

          <div className="flex gap-1.5 mb-3">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className="px-3 py-1 rounded-full text-xs font-xiaowei transition-all duration-200 border"
                style={
                  activeFilter === f.value
                    ? { backgroundColor: '#2c1810', color: '#f4eade', borderColor: '#2c1810' }
                    : { backgroundColor: 'rgba(250, 246, 239, 0.7)', color: '#4a3728', borderColor: '#c4b998' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="border-t mb-3" style={{ borderColor: '#c4b998' }} />
          <h2 className="text-xs font-xiaowei font-semibold mb-2 tracking-wide" style={{ color: '#8b6914' }}>
            人物名册
          </h2>
        </div>

        <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
          <CharacterRoster
            filteredCharacters={filteredCharacters}
            selectedCharacterId={selectedCharacterId}
            onCharacterChange={onCharacterChange}
          />
        </div>
      </div>

      {/* ═══════════════════ Mobile top bar + drawer ═══════════════════ */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-[1000]">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b shadow-md"
          style={panelStyle}
        >
          <h1 className="text-lg font-brush tracking-widest">金庸武林地图</h1>
          <button
            onClick={onMobileMenuToggle}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors duration-200"
            style={{ color: '#4a3728' }}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Collapsible drawer */}
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: mobileMenuOpen ? 'calc(100vh - 52px)' : '0px',
            opacity: mobileMenuOpen ? 1 : 0,
          }}
        >
          <div
            className="border-b shadow-md px-4 py-3 max-h-[calc(100vh-52px)] overflow-y-auto"
            style={panelStyle}
          >
            <p className="text-xs mb-3 font-xiaowei" style={{ color: '#8b7355' }}>
              探索金庸武侠世界的每一寸江湖
            </p>

            {/* Novel dropdown */}
            <div className="mb-3">
              <label className="text-[11px] font-xiaowei mb-1 block" style={{ color: '#8b6914' }}>
                按小说筛选
              </label>
              <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                {novelList.map((novel) => {
                  const isActive = selectedNovels.includes(novel)
                  return (
                    <button
                      key={novel}
                      onClick={() => onNovelToggle(novel)}
                      className="px-2 py-0.5 rounded text-[10px] font-xiaowei border transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? '#2c1810' : 'rgba(250, 246, 239, 0.7)',
                        borderColor: isActive ? '#2c1810' : '#c4b998',
                        color: isActive ? '#f4eade' : '#4a3728',
                      }}
                    >
                      {novel.length > 4 ? novel.slice(0, 4) + '…' : novel}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Type filter */}
            <div className="flex gap-1.5 mb-3">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFilterChange(f.value)}
                  className="px-3 py-1 rounded-full text-xs font-xiaowei transition-all duration-200 border"
                  style={
                    activeFilter === f.value
                      ? { backgroundColor: '#2c1810', color: '#f4eade', borderColor: '#2c1810' }
                      : { backgroundColor: 'rgba(250, 246, 239, 0.7)', color: '#4a3728', borderColor: '#c4b998' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="border-t mb-3" style={{ borderColor: '#c4b998' }} />

            <h2 className="text-xs font-xiaowei font-semibold mb-2 tracking-wide" style={{ color: '#8b6914' }}>
              人物名册
            </h2>

            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
              <CharacterRoster
                filteredCharacters={filteredCharacters}
                selectedCharacterId={selectedCharacterId}
                onCharacterChange={onCharacterChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
