import Header from "~/shared/header";
import type { Route } from "./+types/fame-upload";
import { isAuthorized } from "~/auth.server";
import { Link, redirect, useFetcher } from "react-router";
import { useState } from "react";
import { fetchContestants, fetchTeamsWithMembers, uploadContestSuccess } from "~/db.server";
import TeamSearchCell from "~/components/team-search";
import type { MemberInfo, TeamInfo, TeamSelect } from "~/types/contest-upload";
import ContestantSearchCell from "~/components/contestant-search";
import { CellHighlighting, RowHighlighting } from "~/components/table-colors";
import MedalSelect from "~/components/medal-select";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";

export async function loader({request} : Route.LoaderArgs){
    if(!isAuthorized(request)){
        return redirect("/")
    }
    const teams = await fetchTeamsWithMembers()
    const contestants = await fetchContestants()
    return {
        teams: teams,
        contestants: contestants
    }
}

export async function action({request} : {request : Request}) {
    const json = await request.json()

    const teams = json.teamInfo
    const date = new Date(json.date)
    const constestName = json.contestName

    await uploadContestSuccess(teams, date, constestName)
    return redirect("/halloffame")
}

export default function FameUpload({loaderData} : Route.ComponentProps){

    const fetcher = useFetcher()
    const [teamInfo, setTeamInfo] = useState<TeamInfo[]>([
        {
            contextId: 1,
            name : "Paraugkomanda",
            member1: {name: ""},
            member2: {name: ""},
            member3: {name: ""},
            rank: 0,
            points: 0,
            penalty: 0,
            medalIndex: 0
        }
    ])

    function addTeam(){
        setTeamInfo([...teamInfo, {
            contextId: teamInfo.length + 1,
            name : "Paraugkomanda",
            member1: {name: ""},
            member2: {name: ""},
            member3: {name: ""},
            rank: 0,
            points: 0,
            penalty: 0,
            medalIndex: 0
        }])
    }

    function publishResults(){
        fetcher.submit(JSON.stringify({
            teamInfo: teamInfo,
            date: date,
            contestName: contestName
        }),
        {
            method: "post",
            encType: "application/json"
        })
    }

    const [editingId, setEditingId] = useState<number | null>(null)

    function onTeamChange(t : TeamSelect){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                const newMember1 = t.members.length > 0 ? {
                    id : t.members[0].contestant.id,
                    name : t.members[0].contestant.name ? t.members[0].contestant.name : ""
                } : {name: ""}

                const newMember2 = t.members.length > 1 ? {
                    id : t.members[1].contestant.id,
                    name : t.members[1].contestant.name ? t.members[1].contestant.name : ""
                } : {name: ""}

                const newMember3 = t.members.length > 2 ? {
                    id : t.members[2].contestant.id,
                    name : t.members[2].contestant.name ? t.members[2].contestant.name : ""
                } : {name: ""}
                return {...team, teamId: t.id, name: t.name, member1: newMember1, member2: newMember2, member3: newMember3}
            }
            else{
                return {...team}
            }
        }))
    }

    function onTeamType(t : string){
       setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                return {...team, teamId: undefined, name: t}
            }
            else{
                return team
            }
        }))
    }

    function onTeamMemberChange(t : MemberInfo, index : number){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
               if(index == 1){
                    return {...team, teamId: undefined, member1: {
                        id: t.id,
                        name: t.name
                    }}
                }
                else if(index == 2){
                    return {...team, teamId: undefined, member2: {
                        id: t.id,
                        name: t.name
                    }}
                }
                else if(index == 3){
                    return {...team, teamId: undefined, member3: {
                        id: t.id,
                        name: t.name
                    }}
                }
                else{
                    return team
                }
            }
            else{
                return {...team}
            }
        }))
    }

    function onTeamMemberType(t : string, index : number) {
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                if(index == 1){
                    return {...team, teamId: undefined, member1: {
                        name: t
                    }}
                }
                else if(index == 2){
                    return {...team, teamId: undefined, member2: {
                        name: t
                    }}
                }
                else if(index == 3){
                    return {...team, teamId: undefined, member3: {
                        name: t
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

    function onTeamRankChange(event : React.ChangeEvent<HTMLInputElement>){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                return {...team, rank: parseInt(event.target.value)}
            }
            else{
                return team
            }
        }))
    }

    function onTeamPointChange(event : React.ChangeEvent<HTMLInputElement>){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                return {...team, points: parseInt(event.target.value)}
            }
            else{
                return team
            }
        }))
    }
    
    function onTeamPenaltyChange(event : React.ChangeEvent<HTMLInputElement>){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                return {...team, penalty: parseInt(event.target.value)}
            }
            else{
                return team
            }
        }))
    }

    function onTeamMedalChange(index : number, contextId : number){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == contextId){
                return {...team, medalIndex: index}
            }
            else{
                return team
            }
        }))
    }

    function removeTeam(contextId : number){
        setTeamInfo(teamInfo.filter((team) => team.contextId != contextId))
    }
    const [contestName, setContestName] = useState("CERC")
    const [date, setDate] = useState(new Date())
    return <div>
        <Header />
        <div>
            <Link to="/halloffame" className="font-bold text-blue-500 mx-8 text-2xl mb-4">Atpakaļ! </Link>
            <div className="font-bold text-black text-2xl mx-8">
                Pievienot starptautiskos panākumus!
            </div>
            <div className="mx-8 font-bold text-xl">
                Sacensības
            </div>
            <input
                className="border mx-8 h-10 w-64 m-2 px-3 py-2"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
            />
            <div className="font-bold text-xl mx-8"> Izvēlieties datumu! </div>
            <DayPicker
                className="h-[350px] mx-8"
                mode="single"
                selected={date}
                onSelect={setDate}
                required={true}
            />
            {/* <input
                className="border mx-8 h-10 w-64 m-2 px-3 py-2"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : 0)}
            /> */}
            <table className="mx-8">
                <thead className="border font-bold">
                    <tr>
                        <th className="px-3 py-2 border">Komanda</th>
                        <th className="px-3 py-2 border">Dalībnieks 1</th>
                        <th className="px-3 py-2 border">Dalībnieks 2</th>
                        <th className="px-3 py-2 border">Dalībnieks 3</th>
                        <th className="px-3 py-2 border">Vieta</th>
                        <th className="px-3 py-2 border">Uzdevumu skaits</th>
                        <th className="px-3 py-2 border">Soda minūtes</th>
                        <th className="px-3 py-2 border">Medaļa</th>
                        <th className="px-3 py-2 border"> </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        teamInfo.map((team) => {
                            return <RowHighlighting highlight={!!team.teamId} key={team.contextId}>
                                <td className="px-3 py-2 border">
                                    <TeamSearchCell 
                                        allTeams={loaderData.teams}
                                        value={team.name}
                                        onFocus={() => setEditingId(team.contextId)}
                                        onPick={onTeamChange}
                                        onType={onTeamType}
                                    />
                                </td>
                                <CellHighlighting highlight={!team.teamId && !!team.member1.id}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member1.name}
                                        onFocus={() => setEditingId(team.contextId)}
                                        onPick={(t : MemberInfo) => onTeamMemberChange(t, 1)}
                                        onType={(t : string) => onTeamMemberType(t, 1)}
                                    />
                                </CellHighlighting>
                                <CellHighlighting highlight={!team.teamId && !!team.member2.id}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member2.name}
                                        onFocus={() => setEditingId(team.contextId)}
                                        onPick={(t : MemberInfo) => onTeamMemberChange(t, 2)}
                                        onType={(t : string) => onTeamMemberType(t, 2)}
                                    />
                                </CellHighlighting>
                                <CellHighlighting highlight={!team.teamId && !!team.member3.id}>
                                    <ContestantSearchCell 
                                        allContestants={loaderData.contestants}
                                        value={team.member3.name}
                                        onFocus={() => setEditingId(team.contextId)}
                                        onPick={(t : MemberInfo) => onTeamMemberChange(t, 3)}
                                        onType={(t : string) => onTeamMemberType(t, 3)}
                                    />
                                </CellHighlighting>
                                <td className="px-3 py-2 border">
                                    <input 
                                        className="w-24"
                                        value={team.rank}
                                        inputMode="numeric"
                                        onFocus={() => setEditingId(team.contextId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamRankChange(e)}
                                    />
                                </td>
                                <td className="px-3 py-2 border">
                                    <input 
                                        value={team.points}
                                        inputMode="numeric"
                                        onFocus={() => setEditingId(team.contextId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamPointChange(e)}
                                    />
                                </td>
                                <td className="px-3 py-2 border">
                                    <input 
                                        value={team.penalty}
                                        inputMode="numeric"
                                        onFocus={() => setEditingId(team.contextId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamPenaltyChange(e)}
                                    />
                                </td>
                                <td className="px-3 py-2 border">
                                    <MedalSelect index={team.medalIndex} onFocus={() => setEditingId(team.contextId)} onChange={(index : number) => onTeamMedalChange(index, team.contextId)}/>
                                </td>
                                <td className="px-3 py-2 border text-xs text-slate-900">
                                    <button
                                        onClick={() => removeTeam(team.contextId)}
                                    >
                                        Noņemt
                                    </button>
                                </td>
                            </RowHighlighting>
                        })
                    }
                </tbody>
            </table>
            <div className="flex flex-row justify-end">
                <button onClick={addTeam} className="bg-black hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs mx-8 mt-2">
                    Pievienot
                </button>
            </div>
            <div className="flex flex-col justify-start w-48">
                <button onClick={publishResults} className="bg-black text-white px-3 py-2 rounded-xl mx-8 my-4">
                    Publicēt
                </button>   
            </div>
        </div>
    </div>
}