import { isAuthorized } from "~/auth.server";
import { Form, redirect, useFetcher } from "react-router";
import Header from "~/shared/header";
import { fetchCodeforcesData } from "~/cf.server";
import { useEffect, useState } from "react";
import type { CFAPIResponse } from "~/types/cf-api";
import type { UploadTeamData } from "~/types/contest-upload";

export function loader({request} : {request : Request}){
    if(isAuthorized(request)){
        return {
            isAdmin: true
        }
    }
    else{
        return redirect("/private/admin")
    }
}

export async function action({request} : {request : Request}){
    const formData = await request.formData();
    const intent = formData.get("_action")
    console.log(formData)
    if(intent == "load"){
        const apiKey = formData.get("codeforcesApiKey")
        const apiSecret = formData.get("codeforcesApiSecret")
        const contestId = formData.get("codeforcesContestId")
        if (typeof apiKey !== "string") {
            throw new Response("Invalid apiKey", { status: 400 })
        }
        if (typeof apiSecret !== "string") {
            throw new Response("Invalid apiSecret", { status: 400 })
        }
        if (typeof contestId !== "string") {
            throw new Response("Invalid contestId", { status: 400 })
        }
        // Load the data from codeforces
        const data = await fetchCodeforcesData(apiKey.trim(), apiSecret.trim(), contestId.trim())
        return data
    }
}

function InputComponent({name, placeholder} : {name : string, placeholder : string}){
    return <input name={name} placeholder={placeholder} className="w-64 h-12 border rounded px-2 py-1 m-2" />
}

export default function UploadContest() {
    function computeTeamList(fetchData : CFAPIResponse) : UploadTeamData[]{
        if(!fetchData) return []
        return fetchData.results.result.rows.map((res) => {
            return {
                rank : res.rank,
                teamId: null,
                teamName: `LU-${res.party.participantId}`,
                participantId : res.party.participantId,
                solvedProblems : res.points,
                penalty : res.penalty 
            }
        })
    }
    // we work with local id's
    function computeSubmissionList(fetchData : CFAPIResponse){
        if(!fetchData) return []
        return fetchData.submissions.result.map((sub) => {
            return {
                teamId : sub.author.participantId,
                problemIndex : sub.problem.index,
                verdict : sub.verdict == "OK"
            }
        })
    }
    const fetcher = useFetcher()
    console.log(fetcher.data)
    const [teamList, setTeamList] = useState<UploadTeamData[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const problemList = []
    const submissionList = computeSubmissionList(fetcher.data)

    function onTeamNameChange(event : React.ChangeEvent<HTMLInputElement>){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                return {...team, teamName: event.target.value}
            }
            else{
                return team
            }
        }))
    }

    useEffect(() => {
        const teamList = computeTeamList(fetcher.data)
        setTeamList(teamList)
    }, [fetcher.data])

    return <div>
        <Header />
        <div className="m-8">
            <div className="text-2xl font-bold">
                Sacensību ielāde
            </div>
            <Form className="flex flex-col">
                <InputComponent name="contestName" placeholder="Sacensību nosaukums" /> 
                <div>
                    Ieteicams nosaukt "LU Atlase [gads]"
                </div>
                <div>
                    Uzdevumu PDF
                </div>
                {/* <input
                    type="file"
                    name="taskPDF"
                    required
                    className="border w-48 h-10 m-2 flex flex-col items-center justify-center"
                /> */}
                <InputComponent name="year" placeholder="Gads" /> 
            </Form>
            <fetcher.Form method="post" className="flex flex-col">
                <div> Ielāde no "Codeforces" </div>
                <InputComponent name="codeforcesApiKey" placeholder="Codeforces API atslēga" /> 
                <InputComponent name="codeforcesApiSecret" placeholder="Codeforces API noslēpums" /> 
                <InputComponent name="codeforcesContestId" placeholder="Codeforces sacensību ID" /> 
                <div>
                    ⚠️ Uzmanību! Sistēma šīs atslēgas neuzglabā un izmanto tās tikai datu izguvei no Codeforces sistēmas.
                </div>
                <button type="submit" name="_action" value="load" className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded font-bold m-2">
                    Ielādēt no Codeforces!
                </button>
            </fetcher.Form>
            <div>
                Komandas
            </div>
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border px-3 py-2 text-left"> Vieta </th>
                        <th className="border px-3 py-2 text-left"> Komandas nosaukums </th>
                        <th className="border px-3 py-2 text-left"> Dalībnieks 1 </th>
                        <th className="border px-3 py-2 text-left"> Dalībnieks 2 </th>
                        <th className="border px-3 py-2 text-left"> Dalībnieks 3 </th>
                        <th className="border px-3 py-2 text-left"> Punkti </th>
                        <th className="border px-3 py-2 text-left"> Soda minūtes </th>
                        <th className="border px-3 py-2 text-left"> Officiāla? </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-3 py-2 text-left"> 1 </td>
                        <td className="border px-3 py-2 text-left"> Skrupulozās zemenītes </td>
                        <td className="border px-3 py-2 text-left"> Valters Kalniņš </td>
                        <td className="border px-3 py-2 text-left"> Valters Kalniņš </td>
                        <td className="border px-3 py-2 text-left"> Valters Kalniņš </td>
                        <td className="border px-3 py-2 text-left"> 10 </td>
                        <td className="border px-3 py-2 text-left"> 1025 </td>
                        <td className="border px-3 py-2 text-left"> Jā! </td>
                    </tr>
                    {
                        teamList.map((team) => {
                            return <tr key={team.participantId}>
                                <td className="border px-3 py-2 text-left"> {team.rank} </td>
                                <td className="border px-3 py-2 text-left">
                                    <input 
                                        value={team.teamName}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onChange={onTeamNameChange}
                                    />
                                </td>
                                <td className="border px-3 py-2 text-left"> Test 1 </td>
                                <td className="border px-3 py-2 text-left"> Test 2 </td>
                                <td className="border px-3 py-2 text-left"> Test 3 </td>
                                <td className="border px-3 py-2 text-left"> {team.solvedProblems} </td>
                                <td className="border px-3 py-2 text-left"> {team.penalty} </td>
                                <td className="border px-3 py-2 text-left"> Nē! </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}