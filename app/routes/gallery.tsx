import { fetchAlbums } from "~/db.server";
import Header from "~/shared/header";
import type { Route } from "./+types/gallery";
import { isAuthorized } from "~/auth.server";
import AdminWrap from "~/components/admin-wrap";

export async function loader({request} : Route.LoaderArgs) {
  let albums = await fetchAlbums()
  let isAdmin = isAuthorized(request)
  return {
    isAdmin: isAdmin,
    albums: albums
  }
}

export default function Gallery({loaderData} : Route.ComponentProps) {
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
        Galerija
    </div>
    <AdminWrap isAdmin={loaderData.isAdmin}>
      <div className="m-8 font-bold text-2xl text-blue-500">
        Pievienot fotoalbumu!
      </div>
    </AdminWrap>
    <div className="m-8 flex flex-col">
      {
        loaderData.albums.map(album => {
          return <div>{album.title} </div>
        })
      }
    </div>
  </div>;
}
