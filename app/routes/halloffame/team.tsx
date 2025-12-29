import { fetchTeamProfile } from "~/db.server"
import type { Route } from "./+types/team"
import Header from "~/shared/header"

export async function loader({params} : Route.LoaderArgs){
    const teamId = params.id
    const contest = await fetchTeamProfile(parseInt(teamId))
    return contest
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
        <div>
            Komandas profils
        </div>
        <div>
            {loaderData.name}
        </div>
    </div>
}