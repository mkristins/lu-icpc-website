import ArchiveLink from "~/components/archive-link";
import Header from "~/shared/header";
import type { Route } from "./+types/archive";
import { fetchAllContests } from "~/db.server";
import { isAuthorized } from "~/auth.server";
import AdminWrap from "~/components/admin-wrap";
import { Link } from "react-router";

export async function loader({request, params} : Route.LoaderArgs){
  let contests = await fetchAllContests()
  const STORAGE_URL = process.env.STORAGE_URL!
  return {
    contests: contests,
    isAdmin: isAuthorized(request),
    STORAGE_URL : STORAGE_URL
  }
}

export default function Archive({loaderData} : Route.ComponentProps) {
  const STORAGE_URL = loaderData.STORAGE_URL
  const link = `${STORAGE_URL}/competition-archive/2010/euc2025-official.pdf`
  return <div>
    <Header />
    <div className="mx-8 font-bold text-2xl">
      Arhīvs
    </div>
    <AdminWrap isAdmin={loaderData.isAdmin}>
      <Link 
        className="mx-8 font-bold text-2xl text-blue-500"
        to="/private/upload"
      >
        Pievienot sacensības
      </Link>
    </AdminWrap>
    <div className="flex flex-col">
      {
      loaderData.contests.map(contest => {
        return <ArchiveLink year={contest.year} key={contest.id} resultLink={`./scoreboard/${contest.id}`} taskLink={link}/>
      })
    }
    </div>
  </div>;
}
