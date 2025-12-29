import { isAuthorized } from "~/auth.server";
import { Form, redirect, useFetcher } from "react-router";
import Header from "~/shared/header";
import { useEffect, useState } from "react";
import type { CFAPIResponse } from "~/types/cf-api";
import type { UploadSubmissionData, UploadTeamData } from "~/types/contest-upload";
import { fetchCodeforcesData } from "~/cf.server";
import { uploadLocalContest } from "~/db.server";
import PdfUploader from "~/components/pdf-upload";

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
    const json = await request.json()
    if(json.intent == "load"){
        const apiKey = json.apiKey
        const apiSecret = json.apiSecret
        const contestId = json.contestId
        const data = await fetchCodeforcesData(apiKey.trim(), apiSecret.trim(), contestId.trim())
        return data
    }
    else if(json.intent == "save"){
        await uploadLocalContest(
            json.contestName,
            json.teams,
            json.submissions,
            json.problems,
            json.year,
            new Date(),
            new Date()
        );
    }
}

function InputComponent({name, placeholder} : {name : string, placeholder : string}){
    return <input name={name} placeholder={placeholder} className="w-64 h-12 border rounded px-2 py-1 m-2" />
}

function NewInputComponent({value, placeholder, setValue} : {value : string, placeholder : string, setValue : (arg: string) => void}){
    return <input 
        value={value} 
        placeholder={placeholder}
        className="w-64 h-12 border rounded px-2 py-1 m-2" 
        onChange={(e) => setValue(e.target.value)}
    />
}

export default function UploadContest() {
    function computeTeamList(fetchData : CFAPIResponse) : UploadTeamData[]{
        if(!fetchData) return []
        return fetchData.results.result.rows.map((res) => {
            return {
                rank : res.rank,
                member1: {
                    name: "Dalībnieks 1",
                },
                member2: {
                    name: "Dalībnieks 2"
                },
                member3: {
                    name: "Dalībnieks 3"
                },
                teamName: `LU-${res.party.participantId}`,
                participantId : res.party.participantId,
                solvedProblems : res.points,
                penalty : res.penalty 
            }
        })
    }
    // we work with local id's
    function computeSubmissionList(fetchData : CFAPIResponse) : UploadSubmissionData[]{
        if(!fetchData) return []
        return fetchData.submissions.result.map((sub) => {
            return {
                participantId : sub.author.participantId,
                submissionTime: Math.floor(sub.relativeTimeSeconds / 60),
                problemIndex : sub.problem.index,
                isVerdictOk : sub.verdict == "OK"
            }
        })
    }

    function computeProblemList(fetchData : CFAPIResponse) : string[]{
        if(!fetchData) return []
        return fetchData.results.result.problems.map(prob => prob.index)
    }

    const fetcher = useFetcher()
    const [teamList, setTeamList] = useState<UploadTeamData[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const problemList = computeProblemList(fetcher.data)
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

    function onTeamMemberChange(memberId : number, event : React.ChangeEvent<HTMLInputElement>){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                if(memberId == 1)
                    return {...team, member1: {name: event.target.value}}
                else if(memberId == 2)
                    return {...team, member2: {name: event.target.value}}
                else
                    return {...team, member3: {name: event.target.value}}
            }
            else{
                return team
            }
        }))
    }

    function submitUpdates(){
        fetcher.submit(
            JSON.stringify({
                intent: "save",
                contestName: "Atlase: TODO",
                teams: teamList,
                problems: problemList,
                submissions: submissionList,
                year: 2026,

            }),
            {
                method: "post",
                encType: "application/json"
            }
        )
    }

    function requestCodeforcesData(){
        fetcher.submit(
            JSON.stringify({
                intent: "load",
                apiKey: apiKey,
                apiSecret: apiSecret,
                contestId: contestNumber
            }),
            {
                method: "post",
                encType: "application/json"
            }
        )
    }

    useEffect(() => {
        setTeamList(computeTeamList(fetcher.data))
    }, [fetcher.data])

    const [apiKey, setApiKey] = useState("")
    const [apiSecret, setApiSecret] = useState("")
    const [contestNumber, setContestNumber] = useState("")

    return <div>
        <Header />
        <div className="m-8">
            <div className="text-2xl font-bold">
                Sacensību ielāde
            </div>
            <Form className="flex flex-col">
                <InputComponent name="contestName" placeholder="Sacensību nosaukums" /> 
                <PdfUploader />
                {/* <input
                    type="file"
                    name="taskPDF"
                    required
                    className="border w-48 h-10 m-2 flex flex-col items-center justify-center"
                /> */}
                <InputComponent name="year" placeholder="Gads" /> 
            </Form>
            <div className="flex flex-col">
                <div> Ielāde no "Codeforces" </div>
                <NewInputComponent value={apiKey} placeholder="Codeforces API atslēga" setValue={setApiKey}/>
                <NewInputComponent value={apiSecret} placeholder="Codeforces API noslēpums" setValue={setApiSecret}/>
                <NewInputComponent value={contestNumber} placeholder="Codeforces sacensību ID" setValue={setContestNumber}/>
                <button onClick={requestCodeforcesData} className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded-xl font-bold m-2">
                    Ielādēt no Codeforces!
                </button>
            </div>
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
                                <td className="border px-3 py-2 text-left"> 
                                    <input 
                                        value={team.member1.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamMemberChange(1, e)}
                                    />
                                </td>
                                <td className="border px-3 py-2 text-left">
                                    <input 
                                        value={team.member2.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamMemberChange(2, e)}
                                    />
                                </td>
                                <td className="border px-3 py-2 text-left">
                                    <input 
                                        value={team.member3.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamMemberChange(3, e)}
                                    />
                                </td>
                                <td className="border px-3 py-2 text-left"> {team.solvedProblems} </td>
                                <td className="border px-3 py-2 text-left"> {team.penalty} </td>
                                <td className="border px-3 py-2 text-left"> Nē! </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <button onClick={submitUpdates} className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded-xl font-bold m-2">
                Publicēt!
            </button>
        </div>
    </div>
}