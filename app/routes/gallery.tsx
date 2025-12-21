import { fetchAlbums } from "~/db.server";
import Header from "~/shared/header";
import type { Route } from "./+types/gallery";

export async function loader() {
  let albums = await fetchAlbums()
  return {
    albums: albums
  }
}

export default function Gallery({loaderData} : Route.ComponentProps) {
  return <div>
    <Header />
    <div className="m-8 font-bold text-2xl">
        Galerija
    </div>
    <div className="m-8 flex flex-col">
      {
        loaderData.albums.map(album => {
          return <div>{album.title} </div>
        })
      }
    </div>
  </div>;
}
