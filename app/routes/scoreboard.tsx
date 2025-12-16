export default function Scoreboard() {
    const taskIdentifiers = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]
    const row = ["ok", "ok", "wa", "wa", "ok", "ok", "wa", "wa","ok", "ok", "wa", "wa","meh"]
    const row2 = ["ok", "wa", "wa", "yes", "re", "ok", "wa", "wa","ok", "ok", "wa", "wa","meh"]
    const teamnames = ["Team 1", "Team 2"]
    const points = [9, 7]
    const penalties = [1111, 888]
    return <div>
        <div className="m-8 font-bold text-2xl">
            Rezultātu tabula
            <table className="min-w-full border border-gray-300">
                <thead className="bg-black">
                    <tr>
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Komanda </th>
                        {taskIdentifiers.map((task) => (
                            <th
                                key={task}
                                className="border px-4 py-2 text-left font-semibold text-red-500"
                            >
                                {task}
                            </th>
                        ))}
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Punkti </th>
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Soda minūtes </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-500">
                    <tr>
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {teamnames[0]} </td>
                        {
                            row.map((r) => (
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {r} </td>
                            ))
                        }
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {points[0]} </td>
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {penalties[0]} </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {teamnames[1]} </td>
                        {
                            row2.map((r) => (
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {r} </td>
                            ))
                        }
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {points[1]} </td>
                        <td className="border px-4 py-2 text-left font-semibold text-red-500"> {penalties[1]} </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}