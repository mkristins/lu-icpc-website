import { fetchContest } from "~/db.server"
import type { Route } from "./+types/scoreboard"
import Header from "~/shared/header"

export async function loader({params} : Route.LoaderArgs){
    const contestId = params.id
    let contest = await fetchContest(contestId)
    return contest
}


export default function Scoreboard({loaderData} : Route.ComponentProps) {
    if(!loaderData){
        return <div>
            <Header />
            <div> LAPA NEEKSISTĒ </div>
        </div>
    }
    const points = [9, 7]
    const penalties = [1111, 888]
    const contestYear = loaderData.year
    const contestTasks = loaderData.tasks
    const contestTeams = loaderData.teams

    return <div>
        <div className="m-8 font-bold text-2xl">
            Rezultātu tabula {contestYear}
            <table className="min-w-full border border-gray-300">
                <thead className="bg-black">
                    <tr>
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Komanda </th>
                        {contestTasks.map((task) => (
                            <th
                                key={task.id}
                                className="border px-4 py-2 text-left font-semibold text-red-500"
                            >
                                {task.identifier}
                            </th>
                        ))}
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Punkti </th>
                        <th className="border px-4 py-2 text-left font-semibold text-red-500"> Soda minūtes </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-500">
                    {
                        contestTeams.map((team) => {
                            return <tr key={team.id}>
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {team.name} </td>
                                {
                                    contestTasks.map((task) => {
                                        return <td key={task.id} 
                                                className="border px-4 py-2 text-left font-semibold text-red-500">
                                            AC
                                        </td>
                                    })
                                }
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {points[0]} </td>
                                <td className="border px-4 py-2 text-left font-semibold text-red-500"> {penalties[0]} </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}