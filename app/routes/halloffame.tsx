import { useState } from "react";
import Header from "~/shared/header";
import { fetchAllTeams } from "~/db.server";
import type { Route } from "./+types/halloffame";

export async function loader(){
  let teams = await fetchAllTeams()
  return {
    teams: teams
  }
}

export default function HallOfFame({loaderData} : Route.ComponentProps) {
  const [isTeamMode, setIsTeamMode] = useState(true)
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
      Panākumi
    </div>
    <div className="flex justify-center m-8">
      <div className="m-4">
        Komandas
      </div>
      <div className="m-4">
        Dalībnieki
      </div>
      <div className="m-4">
        Staptautiskās sacensības
      </div>
    </div>
    <div>
      {
        loaderData.teams.map((team) => {
          return <div>
            <div> {team.id} {team.name} {team.goldMedals} {team.silverMedals} {team.bronzeMedals} </div>
          </div>
        })
      }
    </div>
  </div>
}
