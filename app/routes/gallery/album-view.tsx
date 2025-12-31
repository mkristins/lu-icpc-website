import Header from "~/shared/header";
import type { Route } from "./+types/album-view";
import { fetchAlbum } from "~/db.server";
import { Link } from "react-router";

export async function loader({params} : Route.LoaderArgs){
    const album = await fetchAlbum(parseInt(params.id))
    return {
        album: album,
        STORAGE_URL: process.env.STORAGE_URL!
    }
}

export default function AlbumView({loaderData} : Route.ComponentProps){
    if(!loaderData || !loaderData.album){
        return <div>
            <Header />
            <div className="mx-8 font-bold">
                LAPA NEEKSISTĒ
            </div>
        </div>
    }
    return <div>
        <Header />
        <Link className="font-bold text-xl text-blue-500 mx-8" to="/gallery">Atpakaļ</Link>
        <div className="mx-8 my-4 text-xl font-semibold">
            {loaderData.album.title}
        </div>

        <div className="mx-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {loaderData.album.photos.map((photo) => {
            const imageUrl = `${loaderData.STORAGE_URL}/${photo.photoLink}`;

            return (
                    <a
                        key={photo.id}
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                    >
                        <img
                            src={imageUrl}
                            alt={loaderData.album?.title}
                            loading="lazy"
                            className="
                            aspect-square
                            w-full
                            object-cover
                            rounded-lg
                            border
                            hover:opacity-90
                            transition
                            "
                        />
                    </a>
                );
            })}
        </div>
    </div>
}