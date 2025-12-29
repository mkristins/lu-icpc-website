import Header from "~/shared/header";
import type { Route } from "./+types/fame-upload";
import { isAuthorized } from "~/auth.server";
import { Link, redirect } from "react-router";
import { useState } from "react";

export function loader({request} : Route.LoaderArgs){
    if(!isAuthorized(request)){
        return redirect("/")
    }
}

export default function FameUpload(){
    const [teamInfo, setTeamInfo] = useState([
        {
            contextId: 1,
            name : "Skrupulozās zemenītes",
            member1: "MK",
            member2: "KŠ",
            member3: "VK",
            rank: 7,
            points: 8,
            penalty: 518,
            medalIndex: 2
        },
    ])

    function addTeam(){
        setTeamInfo([...teamInfo, {
            contextId: teamInfo.length + 1,
            name : "Neskrupulozās zemenītes",
            member1: "MK",
            member2: "KŠ",
            member3: "VK",
            rank: 1,
            points: 1,
            penalty: 555,
            medalIndex: 3
        }])
    }

    const [editingId, setEditingId] = useState<number | null>(null)

    function onTeamNameChange(event : React.ChangeEvent<HTMLInputElement>){
        setTeamInfo(teamInfo.map((team) => {
            if(team.contextId == editingId){
                return {...team, name: event.target.value}
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

    const [contestName, setContestName] = useState("CERC")

    return <div>
        <Header />
        <div>
            <Link to="/halloffame" className="font-bold text-blue-500 mx-8 text-2xl mb-4">Atpakaļ! </Link>
            <div className="font-bold text-black text-2xl mx-8">
                Pievienot starptautiskos panākumus!
            </div>
            <div className="mx-8">
                Sacensības
            </div>
            <input
                className="border mx-8 h-10 w-64 m-2"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
            />
            <table className="mx-8">
                <thead className="border font-bold">
                    <th className="px-3 py-2 border">Komanda</th>
                    <th className="px-3 py-2 border">Dalībnieks 1</th>
                    <th className="px-3 py-2 border">Dalībnieks 2</th>
                    <th className="px-3 py-2 border">Dalībnieks 3</th>
                    <th className="px-3 py-2 border">Vieta</th>
                    <th className="px-3 py-2 border">Uzdevumu skaits</th>
                    <th className="px-3 py-2 border">Soda minūtes</th>
                    <th className="px-3 py-2 border">Medaļa</th>
                </thead>
                <tbody>
                    {
                        teamInfo.map((team) => {
                            return <tr>
                                <td className="px-3 py-2 border">
                                    <input 
                                        value={team.name}
                                        onFocus={() => setEditingId(team.contextId)}
                                        onChange={(e : React.ChangeEvent<HTMLInputElement>) => onTeamNameChange(e)}
                                    />
                                </td>
                                <td className="px-3 py-2 border">{team.member1}</td>
                                <td className="px-3 py-2 border">{team.member2}</td>
                                <td className="px-3 py-2 border">{team.member3}</td>
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
                                <td className="px-3 py-2 border">{team.medalIndex}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <div className="flex flex-col justify-start w-48">
                <button onClick={addTeam} className="bg-black hover:bg-slate-900 text-white px-3 py-2 rounded-xl mx-8 mt-2">
                    Pievienot
                </button>
                <button className="bg-black text-white px-3 py-2 rounded-xl mx-8 mt-2">
                    Publicēt
                </button>   
            </div>
        </div>
    </div>
}