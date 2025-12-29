import Header from "~/shared/header"
import type { Route } from "./+types/contestant"
import { fetchContestantProfile } from "~/db.server"

export async function loader({params} : Route.LoaderArgs){
    const teamId = params.id
    const contest = await fetchContestantProfile(parseInt(teamId))
    return contest
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