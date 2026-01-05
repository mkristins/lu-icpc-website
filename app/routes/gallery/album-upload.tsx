import { Form, redirect, useFetcher, type ActionFunctionArgs } from "react-router"
import { isAuthorized } from "~/auth.server"
import type { Route } from "./+types/album-upload"
import Header from "~/shared/header"
import ImageUploader from "~/components/image-upload"
import { useState } from "react"
import { uploadAlbum } from "~/db.server"

export async function loader({request} : Route.LoaderArgs) {
	if(!isAuthorized(request)){
		return redirect("/")
	}
}

export async function action({request} : ActionFunctionArgs){
	if(!isAuthorized(request)){
        return redirect("/")
    }
	const formData = await request.formData();
	const title = formData.get("title")
	const files = formData.getAll("img");

	if (typeof title !== "string") {
		throw new Response("Invalid title", { status: 400 })
	}
	for(const f of files){
		if(!(f instanceof File)){
			throw new Response("Not a file", {status: 400})
		}
	}	

	const imgList = files as File[];

	const albumId = await uploadAlbum(title, imgList)

 	return redirect(`/gallery/${albumId}`)
}


export default function AlbumUpload(){

    const [title, setTitle] = useState("")
    const [files, setFiles] = useState<File[]>([])

	const fetcher = useFetcher()

    function onSubmit(){
      	const formData = new FormData()
		formData.append("title", title)
		for(const f of files){
			formData.append("img", f)
		}
		fetcher.submit(formData, {
			method: "post",
			encType: "multipart/form-data"
		})
    }

  return <div>
    <Header />
    <div className="mx-8 text-2xl font-bold">
      	Ielādēt albumu!
    </div>
    <div className="mx-8 text-xl font-bold">
      	Nosaukums
    </div>
    <input 
      	className="mx-8 h-10 w-64 px-3 py-2 border rounded"
      	placeholder="Nosaukums"
      	value={title}
      	onChange={(e) => setTitle(e.target.value)}
    />
    <ImageUploader 
      onChange={setFiles}
    />
    <button onClick={onSubmit} className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded-xl font-bold mx-8 mt-4">
        Publicēt!
    </button>
  </div>
}