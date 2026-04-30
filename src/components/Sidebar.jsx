const TYPE_MAP = {
  sect: { label: '门派', bg: '#c41e3a' },
  landmark: { label: '名胜', bg: '#8b6914' },
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
        className="w-[300px] h-full overflow-y-auto shadow-2xl border-l"
        style={{
          backgroundColor: '#f4eade',
          borderColor: '#c4b998',
          color: '#2c1810',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 z-10 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: '#8b7355' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0d5c0'
            e.currentTarget.style.color = '#4a3728'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8b7355'
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
            <h2 className="text-3xl font-brush mb-1 tracking-widest" style={{ color: '#2c1810' }}>{location.name}</h2>
            <span
              className="inline-block px-3 py-0.5 text-xs font-xiaowei rounded-full mb-4"
              style={{ backgroundColor: typeInfo.bg, color: '#fef3c7' }}
            >{typeInfo.label}</span>
            <div className="border-t mb-4" style={{ borderColor: '#c4b998' }} />
            <p className="text-sm leading-relaxed mb-4 font-xiaowei" style={{ color: '#4a3728' }}>{location.description}</p>
            {location.novels?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>出处</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {location.novels.map((n) => (
                    <span key={n} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#f0e6d3', borderColor: '#c4b998', color: '#6b4d2f' }}>{n}</span>
                  ))}
                </div>
              </>
            )}
            {location.characters?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>代表人物</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {location.characters.map((ch) => (
                    <span key={ch} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#faf6ef', borderColor: '#d4c4a8', color: '#4a3728' }}>{ch}</span>
                  ))}
                </div>
              </>
            )}
            {location.skills?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>代表武功</h3>
                <div className="flex flex-wrap gap-1.5">
                  {location.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 text-xs rounded border font-xiaowei" style={{ backgroundColor: '#faf6ef', borderColor: '#d4c4a8', color: '#4a3728' }}>{sk}</span>
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
                style={{ borderColor: '#c4b998' }}
              />
              <div>
                <h2 className="text-2xl font-brush tracking-widest" style={{ color: '#2c1810' }}>{character.name}</h2>
                <span className="text-xs font-xiaowei" style={{ color: '#8b6914' }}>{character.nickname}</span>
              </div>
            </div>

            <div className="border-t mb-4" style={{ borderColor: '#c4b998' }} />

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4 font-xiaowei" style={{ color: '#4a3728' }}>{character.description}</p>

            {/* Faction */}
            <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>阵营</h3>
            <span
              className="inline-block px-3 py-1 text-xs rounded border font-xiaowei mb-5"
              style={{ backgroundColor: '#faf6ef', borderColor: '#d4c4a8', color: '#4a3728' }}
            >{character.faction}</span>

            {/* Skills */}
            {character.skills?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>武功绝学</h3>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {character.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 text-xs rounded border font-xiaowei"
                      style={{ backgroundColor: '#faf6ef', borderColor: '#d4c4a8', color: '#4a3728' }}>{sk}</span>
                  ))}
                </div>
              </>
            )}

            {/* Novels */}
            {character.novels?.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-2 tracking-wide font-xiaowei" style={{ color: '#8b6914' }}>登场作品</h3>
                <div className="flex flex-wrap gap-1.5">
                  {character.novels.map((n) => (
                    <span key={n} className="px-2.5 py-1 text-xs rounded border font-xiaowei"
                      style={{ backgroundColor: '#f0e6d3', borderColor: '#c4b998', color: '#6b4d2f' }}>{n}</span>
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
