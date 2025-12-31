import { fetchAlbums } from "~/db.server";
import Header from "~/shared/header";
import type { Route } from "./+types/album-list";
import { isAuthorized } from "~/auth.server";
import AdminWrap from "~/components/admin-wrap";
import { Link } from "react-router";

export async function loader({request} : Route.LoaderArgs) {
  let albums = await fetchAlbums()
  let isAdmin = isAuthorized(request)
  return {
    isAdmin: isAdmin,
    albums: albums
  }
}

export default function AlbumList({loaderData} : Route.ComponentProps) {
  return <div>
    <Header />
    <div className="mx-8 font-bold text-2xl">
        Galerija
    </div>
    <AdminWrap isAdmin={loaderData.isAdmin}>
      <Link to="./upload" className="mx-8 font-bold text-2xl text-blue-500">
        Pievienot fotoalbumu!
      </Link>
    </AdminWrap>
    <div className="mx-8 flex flex-col">
      {
        loaderData.albums.map(album => {
          return <Link className="my-2 font-bold text-xl" key={album.id} to={`./${album.id}`}>{album.title} </Link>
        })
      }
    </div>
  </div>;
}
