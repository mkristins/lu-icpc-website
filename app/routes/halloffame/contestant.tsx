import Header from "~/shared/header"
import type { Route } from "./+types/contestant"
import { fetchContestantProfile } from "~/db.server"
import { Link } from "react-router"
import { MedalTypes } from "~/types/medals"

export async function loader({params} : Route.LoaderArgs){
    const teamId = params.id
    const constestant = await fetchContestantProfile(parseInt(teamId))
    return constestant
}

export default function ContestantProfile({loaderData} : Route.ComponentProps){
    if(!loaderData){
        return <div>
            <Header />
            <div>
                LAPA NEEKSISTĒ
            </div>
        </div>
    }

    const participationList = loaderData.teams.flatMap(
        (team) => {
            return team.team.participations.map((participation) => {
                return {
                    teamName: team.team.name,
                    ...participation,
                }
            })
        }
    )

    return <div>
        <Header />
        <div className="mx-8 font-bold text-2xl flex justify-center">
            {loaderData.name}
        </div>
        <div className="flex flex-col justify-center items-center text-center">
            <div className="mx-8 text-xl font-bold flex justify-center">
                Sacensības
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th className="border font-bold px-3 py-2">Datums</th>
                            <th className="border font-bold px-3 py-2">Sacensības</th>
                            <th className="border font-bold px-3 py-2">Komanda</th>
                            <th className="border font-bold px-3 py-2">Vieta</th>
                            <th className="border font-bold px-3 py-2">Medaļa</th>
                            <th className="border font-bold px-3 py-2">Punkti</th>
                            <th className="border font-bold px-3 py-2">Soda minūtes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participationList.map((participation) => {
                            return <tr key={participation.id}>
                                <td className="border font-bold px-3 py-2">{participation.contest.year}</td>
                                <td className="border px-3 py-2">{participation.contest.name}</td>
                                <td className="border px-3 py-2">
                                    <Link className="text-blue-500" to={`/halloffame/team/${participation.teamId}`}>
                                        {participation.teamName}
                                    </Link>
                                    
                                </td>
                                <td className="border px-3 py-2">{participation.rank}</td>
                                <td className="border px-3 py-2">{participation.medalIndex > 0 && `${MedalTypes[participation.medalIndex].icon}${MedalTypes[participation.medalIndex].label}`}</td>
                                <td className="border px-3 py-2">{participation.solvedTasks}</td>
                                <td className="border px-3 py-2">{participation.penalty}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}