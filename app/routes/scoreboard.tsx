import { fetchContest } from "~/db.server"
import type { Route } from "./+types/scoreboard"
import Header from "~/shared/header"
import { useState } from "react"
import { Link } from "react-router"

export async function loader({params} : Route.LoaderArgs){
    const contestId = params.id
    let contest = await fetchContest(contestId)
    return contest
}

function CellData({verdict, attempts} : {verdict: string, attempts: number}) {
    if(verdict == "ok"){
        return <td className="border py-2 w-18 h-14 bg-green-500"> 
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-6">
                            OK
                        </div>
                        <div className="text-xs"> {attempts} attempts</div>
                    </div>
                </td>
    }
    else if(verdict == "no"){
        return <td className="border py-2 w-18 h-14 bg-red-500"> 
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-6">
                        </div>
                        <div className="text-xs"> {attempts} attempts </div>
                    </div>
                </td>
    }
    else{
        return <td className="border px-4 py-2 w-18 h-14"> </td>
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
                attempts: contestSubmissions.filter(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == task.id)).length,
                verdict: contestSubmissions.some(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == task.id && sub.isVerdictOk)) ? "ok" : (
                    contestSubmissions.some(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == task.id)) ? "no" : "none"
                )
            }
            // return {
            //     id: task.id,
            //     attempts: getNumber(7) + 1,
            //     verdict: getNumber(2) == 0 ? "ok" : "no"
            // }
        })
    }

    function teamSolvedProblems(teamId : number){
        return contestTasks.filter((task) => contestSubmissions.some(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == task.id && sub.isVerdictOk))).length
    }
    const [elapsedTime, setElapsedTime] = useState(300)

    return <div>
        <div className="m-8">
            <Link to="/" className="text-2xl font-bold text-blue-500">
                Atpakaļ
            </Link>
            <div className="text-lg">
                Statuss pēc {elapsedTime} minūtēm
            </div>
            <div>
                <label htmlFor="frozen"> Iesaldēt? </label>
                <input className="m-2" name="frozen" type="checkbox"/>
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={elapsedTime}
                    onChange={(e) => setElapsedTime(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                /> 
            </div>
            <table className="min-w-full border">
                <thead className="bg-black">
                    <tr>
                        <th className="border px-4 py-2 text-left font-semibold"> Komanda </th>
                        {contestTasks.map((task) => (
                            <th
                                key={task.id}
                                className="border w-18 px-4 py-2 text-left font-semibold"
                            >
                                {task.identifier}
                            </th>
                        ))}
                        <th className="border px-4 py-2 text-left font-semibold"> Punkti </th>
                        <th className="border px-4 py-2 text-left font-semibold"> Soda minūtes </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-500">
                    {
                        contestTeams.map((team) => {
                            return <tr key={team.id}>
                                <td className="border px-4 py-2 h-14 text-left font-semibold"> {team.name} </td>
                                {
                                    teamSubmissionList(team.id).map((info) => {
    
                                        return <CellData key={info.id} verdict={info.verdict} attempts={info.attempts}/>
                                    })
                                }
                                <td className="border px-4 py-2 text-left font-semibold"> {teamSolvedProblems(team.id)} </td>
                                <td className="border px-4 py-2 text-left font-semibold"> {penalties[0]} </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}