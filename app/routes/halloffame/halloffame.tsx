import { useState } from "react";
import Header from "~/shared/header";
import { fetchAllContestants, fetchAllTeams } from "~/db.server";
import type { Route } from "./+types/halloffame";
import AdminWrap from "~/components/admin-wrap";
import { isAuthorized } from "~/auth.server";
import { Link } from "react-router";

export async function loader({request} : Route.LoaderArgs){
  const teams = await fetchAllTeams()
  const contestants = await fetchAllContestants()
  const isAdmin = isAuthorized(request)
  return {
    teams: teams,
    contestants: contestants,
    isAdmin: isAdmin,
  }
}

function ToggleButton({highlight, onClick, children} : {highlight : boolean, onClick : () => void, children : React.ReactNode}) {
  if(highlight){
    return <button className="ml-2 mr-2 p-2 font-bold bg-green-500 border rounded">
      {children}
    </button>
  }
  else{
    return <button className="ml-2 mr-2 p-2 font-bold border rounded" onClick={onClick}>
      {children}
    </button>
  }
}

// function TeamsStandings({te){

// }

export default function HallOfFame({loaderData} : Route.ComponentProps) {
  const [isTeamMode, setIsTeamMode] = useState(true)
  return <div>
    <Header />
    <div className="mx-8 font-bold text-2xl">
      Panākumi
    </div>
    <AdminWrap isAdmin={loaderData.isAdmin}>
      <Link to="/" className="m-8 font-bold text-2xl text-blue-500">
        Pievienot starptautisku panākumu
      </Link>
    </AdminWrap>
    <div className="flex justify-center">
      <ToggleButton highlight={isTeamMode} onClick={() => setIsTeamMode(true)}>
        Komandas
      </ToggleButton>
      <ToggleButton highlight={!isTeamMode} onClick={() => setIsTeamMode(false)}>
        Dalībnieki
      </ToggleButton>
    </div>
    <div className="m-8">
      {isTeamMode && loaderData.teams.map((team) => {
          return <div key={team.id}>
            <div> {team.id}. {team.name} {team.officialParticipations} dalības, {team.gold} zelti, {team.silver} sudrabi, {team.bronze} bronzas</div>
          </div>
        })
      }
      {!isTeamMode && loaderData.contestants.map((contestant) => {
          return <div key={contestant.id}>
            <div> {contestant.id}. {contestant.name} {contestant.officialParticipations} dalības, {contestant.gold} zelti, {contestant.silver} sudrabi, {contestant.bronze} bronzas</div>
          </div>
        })
      }
    </div>
  </div>
}
