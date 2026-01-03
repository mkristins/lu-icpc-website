const medals = [
  { id: 0, label: "None", color: "#9ca3af", icon: "—" },
  { id: 1, label: "Gold", color: "#facc15", icon: "🥇" },
  { id: 2, label: "Silver", color: "#d1d5db", icon: "🥈" },
  { id: 3, label: "Bronze", color: "#cd7f32", icon: "🥉" },
]

export default function MedalSelect({index, onFocus, onChange} : {index : number, onFocus : () => void, onChange : (arg : number) => void}){
    return (
        <div style={{ display: "flex", gap: 8 }}>
            {medals.map((medal) => {
                const isActive = medal.id === index;

                return (
                <button
                    key={medal.id}
                    type="button"
                    onFocus={onFocus}
                    onClick={() => onChange(medal.id)}
                    aria-pressed={isActive}
                    title={medal.label}
                    style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: isActive
                        ? `2px solid ${medal.color}`
                        : "2px solid #e5e7eb",
                    background: isActive ? "#111827" : "#ffffff",
                    color: medal.color,
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    }}
                >
                    {medal.icon}
                </button>
                );
            })}
        </div>
    );
}