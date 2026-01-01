import { fetchContest } from "~/db.server"
import type { Route } from "./+types/scoreboard"
import Header from "~/shared/header"
import { useState } from "react"
import { Link } from "react-router"

export async function loader({params} : Route.LoaderArgs){
    const contestId = params.id
    const contest = await fetchContest(contestId)
    return contest
}

function CellData({verdict, attempts, freezeAttempts, firstSolveTime} : {verdict: string, attempts: number, freezeAttempts : number, firstSolveTime : number | undefined}) {
    if(verdict == "ok"){
        return <td className="border py-2 w-18 h-14 bg-green-500"> 
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-6">
                            {firstSolveTime}
                        </div>
                        <div className="text-xs"> {attempts} reizes</div>
                    </div>
                </td>
    }
    else if(attempts > 0 && freezeAttempts == 0){
        return <td className="border py-2 w-18 h-14 bg-red-500"> 
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-6">
                        </div>
                        <div className="text-xs"> {attempts} reizes </div>
                    </div>
                </td>
    }
    else if(attempts > 0){
        return <td className="border py-2 w-18 h-14 bg-blue-500"> 
                    <div className="flex flex-col justify-center items-center">
                        <div className="h-6">
                        </div>
                        <div className="text-[0.625rem]"> {attempts - freezeAttempts} + {freezeAttempts} reizes </div>
                    </div>
                </td>
    }
    else{
        return <td className="border py-2 w-18 h-14"> </td>
    }
}

export default function Scoreboard({loaderData} : Route.ComponentProps) {
    if(!loaderData){
        return <div>
            <Header />
            <div> LAPA NEEKSISTĒ </div>
        </div>
    }
    const contestTasks = loaderData.tasks
    const contestParticipations = loaderData.participations
    const contestSubmissions = loaderData.submissions
    function getNumber(limit : number){
        return Math.floor(Math.random() * limit)
    }

    function computeFirstSolveTime(teamId : number, taskId : number){
        return contestSubmissions.reduce((currentSolveTime, submission) => {
            if((!frozen || submission.submissionTime < 240) && submission.submissionTime <= elapsedTime && submission.teamId == teamId && submission.taskId == taskId && submission.isVerdictOk){
                if(currentSolveTime == -1 || submission.submissionTime <= currentSolveTime){
                    return submission.submissionTime
                }
            }
            return currentSolveTime
        }, -1)
    }

    function computeTaskStatus(teamId : number, taskId : number){
        const firstSolveTime = computeFirstSolveTime(teamId, taskId)
        if(firstSolveTime != -1){
            return {
                totalAttempts: contestSubmissions.filter(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == taskId)).length,
                firstSolveTime: firstSolveTime,
                postFreezeAttempts: 0,
                verdict: "ok"
            }
        }
        else{
            return {
                totalAttempts: contestSubmissions.filter(sub => (sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == taskId)).length,
                postFreezeAttempts: frozen ? contestSubmissions.filter(sub => (240 <= sub.submissionTime && sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == taskId)).length : 0,
                verdict: "none"
            }
        }
    }

    function teamSubmissionList(teamId : number){

        return contestTasks.map((task) => {
            return {
                id: task.id,
                ...computeTaskStatus(teamId, task.id),
            }
        })
    }

    function teamSolvedProblems(teamId : number){
        return contestTasks.filter((task) => contestSubmissions.some(sub => ((!frozen || sub.submissionTime < 240) && sub.submissionTime <= elapsedTime && sub.teamId == teamId && sub.taskId == task.id && sub.isVerdictOk))).length
    }
    function teamTotalPenalty(teamId : number){
        return contestTasks.reduce((currentPenalty, task) => {
            const firstSolveTime = computeFirstSolveTime(teamId, task.id)
            if(firstSolveTime == -1){
                return currentPenalty
            }
            const extraPenalty = contestSubmissions.reduce((currentExtraPenalty, submission) => {
                if(submission.submissionTime <= firstSolveTime && submission.teamId == teamId && submission.taskId == task.id && !submission.isVerdictOk){
                    return currentExtraPenalty + 20
                }
                else{
                    return currentExtraPenalty
                }
            }, 0)

            return currentPenalty + firstSolveTime + extraPenalty
        }, 0)
    }

    const [elapsedTime, setElapsedTime] = useState(300)
    const [frozen, setFrozen] = useState(false)

    const teamsInfo = contestParticipations.map((participation) => {
        return {
            id: participation.teamId,
            name: participation.team.name,
            solvedProblems: teamSolvedProblems(participation.teamId),
            penalty: teamTotalPenalty(participation.teamId)
        }
    }).sort((a, b) => {
        if(a.solvedProblems == b.solvedProblems){
            return a.penalty - b.penalty
        }
        else{
            return b.solvedProblems - a.solvedProblems
        }
    })

    return <div>
        <div className="m-8">
            <Link to="/" className="text-2xl font-bold text-blue-500">
                Atpakaļ
            </Link>
            <div className="text-lg">
                Statuss pēc {elapsedTime} minūtēm
            </div>
            <div>
                <label htmlFor="frozen" className="h-8 items-start"> Iesaldēt? </label>
                <input className="m-2 h-8 w-8 items-center" 
                    name="frozen" 
                    checked={frozen}
                    onChange={(e) => setFrozen(e.target.checked)} 
                    type="checkbox"
                />
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={elapsedTime}
                    onChange={(e) => setElapsedTime(parseInt(e.target.value))}
                    className="w-full accent-blue-600 mb-4"
                /> 
            </div>
            <table className="min-w-full border">
                <thead className="bg-gray-200">
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
                        teamsInfo.map((team) => {
                            return <tr key={team.id}>
                                <td className="border px-4 py-2 h-14 text-left font-semibold">
                                    <Link className="text-blue-900" to={`/halloffame/team/${team.id}`}>
                                        {team.name}
                                    </Link>
                                </td>
                                {
                                    teamSubmissionList(team.id).map((info) => {
    
                                        return <CellData key={info.id} verdict={info.verdict} attempts={info.totalAttempts} freezeAttempts={info.postFreezeAttempts} firstSolveTime={info.firstSolveTime}/>
                                    })
                                }
                                <td className="border px-4 py-2 text-left font-semibold"> {team.solvedProblems} </td>
                                <td className="border px-4 py-2 text-left font-semibold"> {team.penalty} </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}