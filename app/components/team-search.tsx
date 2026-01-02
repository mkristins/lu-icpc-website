import { useEffect, useMemo, useState } from "react";
import type { TeamSelect } from "~/types/contest-upload";

export default function TeamSearchCell({
    value,
    allTeams,
    onFocus,
    onPick,
    onType,
}: {
    value: string;
    allTeams: TeamSelect[];
    onFocus: () => void;
    onPick: (t: TeamSelect) => void;
    onType: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState(value);
    useEffect(() => {
        setQ(value)
    }, [value]);

    const results = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return allTeams.slice(0, 10);

        return allTeams
        .filter(t => t.name.toLowerCase().includes(qq))
        .slice(0, 10);
    }, [q, allTeams]);

    function pickTeam(t : TeamSelect){
        onPick(t)
    }

    return (
        <div className="relative">
        <div className="flex items-center border rounded px-2 py-1 gap-2">
            <button
                type="button"
                className="opacity-70 hover:opacity-100"
                onClick={() => setOpen(o => !o)}
                aria-label="Search team"
                title="Search team"
            >
            🔍
            </button>

            <input
                className="w-full outline-none"
                value={q}
                onFocus={() => {
                    onFocus(),
                    setOpen(true)
                }}
                onBlur={() => {
                    setTimeout(() => {setOpen(false)}, 100)
                }}
                onChange={(e) => {
                    const v = e.target.value;
                    onType(v);   // update row teamName (your existing behavior)
                    setQ(v);     // drive filter input
                }}
                placeholder="Komandas nosaukums..."
            />
        </div>

        {open && (
            <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow">
                <div className="max-h-56 overflow-auto">
                    {results.length === 0 ? (
                        <div className="px-3 py-2 text-sm opacity-70">Nav atrasts</div>
                    ) : (
                        results.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-200"
                                onClick={() => {
                                    pickTeam(t)
                                }}
                            >
                                {t.name}
                            </button>
                        ))
                    )}
                </div>

                <div className="p-2 flex justify-end">
                    <button
                        type="button"
                        className="text-sm opacity-70 hover:opacity-100"
                        onClick={() => setOpen(false)}
                    >
                        Aizvērt
                    </button>
                </div>
            </div>
        )}
        </div>
    );
}