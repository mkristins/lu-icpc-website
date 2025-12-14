export default function Scoreboard() {
    const taskIdentifiers = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]
    const row = ["ok", "ok", "wa", "wa", "ok", "ok", "wa", "wa","ok", "ok", "wa", "wa","meh"]
    const row2 = ["ok", "wa", "wa", "yes", "re", "ok", "wa", "wa","ok", "ok", "wa", "wa","meh"]
    return <div>
        <div className="m-8 font-bold text-2xl">
            Rezultātu tabula
            <table className="min-w-full border border-gray-300">
                <thead className="bg-black">
                    <tr>
                        {taskIdentifiers.map((task) => (
                            <th
                                key={task}
                                className="border px-4 py-2 text-left font-semibold text-red-500"
                            >
                                {task}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-500">
                    <tr>
                        {
                            row.map((r) => (
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {r} </td>
                            ))
                        }
                    </tr>
                    <tr>
                        {
                            row2.map((r) => (
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {r} </td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}