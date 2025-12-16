import ArchiveLink from "~/components/archive-link";
import Header from "~/shared/header";
import type { Route } from "./+types/archive";
import { fetchAllContests } from "~/db.server";

export async function loader({params} : Route.LoaderArgs){
  let contests = await fetchAllContests()
  const STORAGE_URL = process.env.STORAGE_URL!
  return {
    contests: contests,
    STORAGE_URL : STORAGE_URL
  }
}

export default function Archive({loaderData} : Route.ComponentProps) {
  const STORAGE_URL = loaderData.STORAGE_URL
  const link = `${STORAGE_URL}/competition-archive/2010/euc2025-official.pdf`
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
      Arhīvs
    </div>
    <ArchiveLink year="2025" resultLink="./scoreboard/1" taskLink={link} testLink="/" />
    <ArchiveLink year="2024" resultLink="./scoreboard/2" taskLink={link} testLink="/" />
    <ArchiveLink year="2023" resultLink="./scoreboard/3" taskLink={link} testLink="/" />
  </div>;
}
