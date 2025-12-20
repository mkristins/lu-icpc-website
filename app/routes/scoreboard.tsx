import { fetchContest } from "~/db.server"
import type { Route } from "./+types/scoreboard"
import Header from "~/shared/header"

export async function loader({params} : Route.LoaderArgs){
    const contestId = params.id
    let contest = await fetchContest(contestId)
    console.log("Fetched", contest)
    return contest
}

function CellData({verdict, attempts} : {verdict: string, attempts: number}) {
    if(verdict == "ok"){
        return <td className="border w-24 h-12 bg-green-500"> 
                    <div className="flex flex-col">
                        <div className="h-6">
                            OK
                        </div>
                        <div className="text-xs"> {attempts} attempts</div>
                    </div>
                </td>
    }
    else if(verdict == "no"){
        return <td className="border px-4 py-2 w-18 h-12 bg-red-500"> 
                    <div className="flex flex-col">
                        <div className="h-6">
                        </div>
                        <div className="text-xs"> {attempts} attempts </div>
                    </div>
                </td>
    }
    else{
        return <td className="border px-4 py-2 w-18 h-12"> </td>
    }
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
    const contestSubmissions = loaderData.submissions
    function getNumber(limit : number){
        return Math.floor(Math.random() * limit)
    }
    function teamSubmissionList(teamId : number){

        return contestTasks.map((task) => {
            return {
                id: task.id,
                attempts: getNumber(7) + 1,
                verdict: getNumber(2) == 0 ? "ok" : "no"
            }
        })
    }

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
                                className="border w-18 px-4 py-2 text-left font-semibold text-red-500"
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
                                    teamSubmissionList(team.id).map((info) => {
    
                                        return <CellData key={info.id} verdict={info.verdict} attempts={info.attempts}/>
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