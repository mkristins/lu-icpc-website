import { isAuthorized } from "~/auth.server";
import { Form, redirect, useFetcher } from "react-router";
import Header from "~/shared/header";
import { useEffect, useState } from "react";
import type { CFAPIResponse } from "~/types/cf-api";
import type { ContestantSelect, TeamSelect, UploadSubmissionData, UploadTeamData } from "~/types/contest-upload";
import { fetchCodeforcesData } from "~/cf.server";
import { fetchContestants, fetchTeamsWithMembers, uploadLocalContest } from "~/db.server";
import PdfUploader from "~/components/pdf-upload";
import TeamSearchCell from "~/components/team-search";
import type { Route } from "./+types/upload";
import ContestantSearchCell from "~/components/contestant-search";
import { CellHighlighting, RowHighlighting } from "~/components/table-colors";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";

export async function loader({request} : {request : Request}){
    if(isAuthorized(request)){
        const teams = await fetchTeamsWithMembers()
        const contestants = await fetchContestants()
        return {
            isAdmin: true,
            teams: teams,
            contestants: contestants
        }
    }
    else{
        return redirect("/private/admin")
    }
}

export async function action({request} : {request : Request}){
    const contentType = request.headers.get("content-type") || "";
    if(contentType.includes("multipart/form-data")){
        const form = await request.formData();
        const intent = form.get("intent");

        if (intent === "save") {
            const contestName = String(form.get("contestName") || "");
            const year = Number(form.get("year") || 0);
            const teams = JSON.parse(String(form.get("teams") || "[]"));
            const problems = JSON.parse(String(form.get("problems") || "[]"));
            const submissions = JSON.parse(String(form.get("submissions") || "[]"));
            const date = new Date(String(form.get("date")))
            const pdf = form.get("pdf"); // File | null
            if (!(pdf instanceof File) || pdf.size === 0) {
                return {}
            }
            await uploadLocalContest(
                contestName,
                teams,
                submissions,
                problems,
                pdf,
                date
            );
            return redirect("/archive")
        }
    }
    else{
        const json = await request.json()
        if(json.intent == "load"){
            const apiKey = json.apiKey
            const apiSecret = json.apiSecret
            const contestId = json.contestId
            const data = await fetchCodeforcesData(apiKey.trim(), apiSecret.trim(), contestId.trim())
            return data
        }
    }
}

function InputComponent({name, placeholder, value, setValue} : {name : string, placeholder : string, value : string, setValue: (arg: string) => void}){
    return <input name={name} value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} className="w-64 h-12 border rounded px-2 py-1 m-2" />
}

function NewInputComponent({value, placeholder, setValue} : {value : string, placeholder : string, setValue : (arg: string) => void}){
    return <input 
        value={value} 
        placeholder={placeholder}
        className="w-64 h-12 border rounded px-2 py-1 m-2" 
        onChange={(e) => setValue(e.target.value)}
    />
}

export default function UploadContest({loaderData} : Route.ComponentProps) {
    function computeTeamList(fetchData : CFAPIResponse) : UploadTeamData[]{
        if(!fetchData) return []
        return fetchData.results.result.rows.map((res) => {
            return {
                rank : res.rank,
                member1: {
                    name: "",
                },
                member2: {
                    name: ""
                },
                member3: {
                    name: ""
                },
                teamName: `LU-${res.party.participantId}`,
                participantId : res.party.participantId,
                solvedProblems : res.points,
                penalty : res.penalty,
                official: true 
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

    function submitUpdates(){
        const formData = new FormData();
        formData.append("intent", "save")
        formData.append("contestName", title)
        formData.append("teams", JSON.stringify(teamList))
        formData.append("submissions", JSON.stringify(submissionList))
        formData.append("problems", JSON.stringify(problemList))
        formData.append("date", date.toISOString())
        if(pdfFile)
            formData.append("pdf", pdfFile)
        fetcher.submit(
            formData,
            {
                method: "post",
                encType: "multipart/form-data"
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

    function selectTeam(t : TeamSelect){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                const newMember1 = t.members.length > 0 ? {
                    contestantId : t.members[0].contestant.id,
                    name : t.members[0].contestant.name ? t.members[0].contestant.name : ""
                } : {name: ""}

                const newMember2 = t.members.length > 1 ? {
                    contestantId : t.members[1].contestant.id,
                    name : t.members[1].contestant.name ? t.members[1].contestant.name : ""
                } : {name: ""}

                const newMember3 = t.members.length > 2 ? {
                    contestantId : t.members[2].contestant.id,
                    name : t.members[2].contestant.name ? t.members[2].contestant.name : ""
                } : {name: ""}
                return {...team, teamId: t.id, teamName: t.name, member1: newMember1, member2: newMember2, member3: newMember3}
            }
            else{
                return team
            }
        }))
    }

    function selectContestant(t : ContestantSelect, index : number){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                if(index == 1){
                    return {...team, teamId: undefined, member1: {
                        contestantId: t.id,
                        name: t.name
                    }}
                }
                else if(index == 2){
                    return {...team, teamId: undefined, member2: {
                        contestantId: t.id,
                        name: t.name
                    }}
                }
                else if(index == 3){
                    return {...team, teamId: undefined, member3: {
                        contestantId: t.id,
                        name: t.name
                    }}
                }
                else{
                    return team
                }
            }
            else{
                return team
            }
        }))
    }


    function onType(name : string){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                return {...team, teamId: undefined, teamName: name}
            }
            else{
                return team
            }
        }))
    }

    function setTeamOfficialStatus(participantId : number, official : boolean){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                return {...team, official: official}
            }
            else{
                return team
            }
        }))
    }

    function onTypeContestant(name : string, index : number){
        setTeamList(teamList.map((team) => {
            if(team.participantId == editingId){
                if(index == 1){
                    return {...team, teamId: undefined, member1: {
                        name: name
                    }}
                }
                else if(index == 2){
                    return {...team, teamId: undefined, member2: {
                        name: name
                    }}
                }
                else if(index == 3){
                    return {...team, teamId: undefined, member3: {
                        name: name
                    }}
                }
                else{
                    return team
                }
            }
            else{
                return team
            }
        }))
    }

    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [date, setDate] = useState(new Date())
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
                <InputComponent name="contestName" placeholder="Sacensību nosaukums" value={title} setValue={setTitle} /> 
                <PdfUploader onChange={setPdfFile}/>
                <div className="font-bold text-xl"> Izvēlieties datumu! </div>
                <DayPicker
                    className="h-[350px]"
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    required={true}
               />
            </Form>
            <div className="flex flex-col">
                <div className="flex font-bold"> Dati ielāde no "Codeforces" </div>
                <NewInputComponent value={apiKey} placeholder="Codeforces API atslēga" setValue={setApiKey}/>
                <NewInputComponent value={apiSecret} placeholder="Codeforces API noslēpums" setValue={setApiSecret}/>
                <NewInputComponent value={contestNumber} placeholder="Codeforces sacensību ID" setValue={setContestNumber}/>
                <button onClick={requestCodeforcesData} className="border bg-slate-900 hover:bg-slate-800 w-48 h-10 rounded-xl text-white text-sm m-2">
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
                            return <RowHighlighting highlight={!!team.teamId} key={team.participantId}>
                                <td className="border px-3 py-2 text-left"> {team.rank} </td>
                                <td className="border px-3 py-2 text-left">
                                    <TeamSearchCell
                                        allTeams={loaderData.teams}
                                        value={team.teamName}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onPick={selectTeam}
                                        onType={onType}
                                    />
                                </td>
                                <CellHighlighting highlight={!!team.member1.contestantId && !team.teamId}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member1.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onPick={(t : ContestantSelect) => selectContestant(t, 1)}
                                        onType={(t : string) => onTypeContestant(t, 1)}
                                    />
                                </CellHighlighting>
                                <CellHighlighting highlight={!!team.member2.contestantId && !team.teamId}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member2.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onPick={(t : ContestantSelect) => selectContestant(t, 2)}
                                        onType={(t : string) => onTypeContestant(t, 2)}
                                    />
                                </CellHighlighting>
                                <CellHighlighting highlight={!!team.member3.contestantId && !team.teamId}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member3.name}
                                        onFocus={() => setEditingId(team.participantId)}
                                        onPick={(t : ContestantSelect) => selectContestant(t, 3)}
                                        onType={(t : string) => onTypeContestant(t, 3)}
                                    />
                                </CellHighlighting>
                                <td className="border px-3 py-2 text-left"> {team.solvedProblems} </td>
                                <td className="border px-3 py-2 text-left"> {team.penalty} </td>
                                <td className="border px-3 py-2 text-left">
                                    <input
                                        className="w-6 h-6"
                                        checked={team.official}
                                        onChange={(e) => setTeamOfficialStatus(team.participantId, e.target.checked)} 
                                        type="checkbox"
                                    />
                                </td>
                            </RowHighlighting>
                        })
                    }
                </tbody>
            </table>
            <button onClick={submitUpdates} className="border bg-slate-900 hover:bg-slate-800 w-48 h-10 rounded-xl text-white text-sm m-2 mb-24">
                Publicēt!
            </button>
        </div>
    </div>
}