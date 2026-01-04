import { fetchTeamProfile } from "~/db.server"
import type { Route } from "./+types/team"
import Header from "~/shared/header"
import { Link } from "react-router"
import { MedalTypes } from "~/types/medals"

export async function loader({params} : Route.LoaderArgs){
    const teamId = params.id
    const team = await fetchTeamProfile(parseInt(teamId))
    return team
}

export default function TeamProfile({loaderData} : Route.ComponentProps){
    if(!loaderData){
        return <div>
            <Header />
            <div>
                LAPA NEEKSISTĒ
            </div>
        </div>
    }
    return <div>
        <Header />
        <div className="mx-8 font-bold text-2xl flex justify-center">
            {loaderData.name}
        </div>
        <div className="mx-8 text-xl flex justify-center">
            Komandas dalībnieki
        </div>
        <div className="flex flex-col justify-center items-center text-center">
            <div className="w-80 flex flex-col text-blue-500">
                {loaderData.members.map((member) => {
                    return <Link to={`/halloffame/contestant/${member.contestantId}`} key={member.contestant.id}>
                        {member.contestant.name} 
                    </Link>
                })}
            </div>
            <div className="mx-8 text-xl font-bold flex justify-center">
                Sacensības
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th className="border font-bold px-3 py-2">Datums</th>
                            <th className="border font-bold px-3 py-2">Sacensības</th>
                            <th className="border font-bold px-3 py-2">Vieta</th>
                            <th className="border font-bold px-3 py-2">Medaļa</th>
                            <th className="border font-bold px-3 py-2">Punkti</th>
                            <th className="border font-bold px-3 py-2">Soda minūtes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loaderData.participations.map((participation) => {
                            return <tr key={participation.id}>
                                    <td className="border font-bold px-3 py-2">{participation.contest.date.toISOString().split('T')[0]}</td>
                                    <td className="border px-3 py-2">{participation.contest.name}</td>
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