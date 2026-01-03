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
    return <button className="ml-2 mr-2 p-2 font-bold bg-green-500 border rounded-xl">
      {children}
    </button>
  }
  else{
    return <button className="ml-2 mr-2 p-2 font-bold border rounded-xl" onClick={onClick}>
      {children}
    </button>
  }
}

export default function HallOfFame({loaderData} : Route.ComponentProps) {
  const [isTeamMode, setIsTeamMode] = useState(true)
  return <div>
    <Header />
    <div className="mx-8 font-bold text-2xl">
      Panākumi
    </div>
    <AdminWrap isAdmin={loaderData.isAdmin}>
      <Link to="./upload" className="m-8 font-bold text-2xl text-blue-500">
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
      {isTeamMode &&
          <div className="flex justify-center">
            <table>
              <thead className="border font-bold">
                <tr>
                  <th className="px-3 py-2 border">Komanda</th>
                  <th className="px-3 py-2 border">Dalības</th>
                  <th className="px-3 py-2 border">Zelts</th>
                  <th className="px-3 py-2 border">Sudrabs</th>
                  <th className="px-3 py-2 border">Bronza</th>
                  <th className="px-3 py-2 border">Medaļas kopā</th>
                </tr>
              </thead>
              <tbody>
                {
                  loaderData.teams.map((team) => {
                    return <tr key={team.id}>
                      <td className="px-3 py-2 border"><Link className="text-md text-blue-500" to={`./team/${team.id}`}>{team.name}</Link> </td>
                      <td className="px-3 py-2 border">{team.participations}</td>
                      <td className="px-3 py-2 border bg-amber-400">{team.gold}</td>
                      <td className="px-3 py-2 border bg-slate-500">{team.silver}</td>
                      <td className="px-3 py-2 border bg-red-900">{team.bronze}</td>
                      <td className="px-3 py-2 border">{team.participations}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
      }
      {
        !isTeamMode && <div className="flex justify-center">
        <table>
          <thead className="border font-bold">
            <tr>
              <th className="px-3 py-2 border">Dalībnieks</th>
              <th className="px-3 py-2 border">Dalības</th>
              <th className="px-3 py-2 border">Zelts</th>
              <th className="px-3 py-2 border">Sudrabs</th>
              <th className="px-3 py-2 border">Bronza</th>
              <th className="px-3 py-2 border">Medaļas kopā</th>
            </tr>
          </thead>
          <tbody>
            {
              loaderData.contestants.map((contestant) => {
                return <tr key={contestant.id}>
                  <td className="px-3 py-2 border"><Link className="text-md text-blue-500" to={`./contestant/${contestant.id}`}>{contestant.name}</Link> </td>
                  <td className="px-3 py-2 border">{contestant.participations}</td>
                  <td className="px-3 py-2 border bg-amber-400">{contestant.gold}</td>
                  <td className="px-3 py-2 border bg-slate-500">{contestant.silver}</td>
                  <td className="px-3 py-2 border bg-red-900">{contestant.bronze}</td>
                  <td className="px-3 py-2 border">{contestant.participations}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
      }
      {/* {!isTeamMode && loaderData.contestants.map((contestant) => {
          return <div key={contestant.id} className="flex flex-row h-16">
            <div> {contestant.id} </div>
            <Link to={`./contestant/${contestant.id}`} className="font-bold text-blue-500"> {contestant.name} </Link>
            <div> {contestant.participations} dalības, {contestant.gold} zelti, {contestant.silver} sudrabi, {contestant.bronze} bronzas</div>
          </div>
        })
      } */}
    </div>
  </div>
}
