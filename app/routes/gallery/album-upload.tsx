import { Form, redirect, type ActionFunctionArgs } from "react-router"
import { isAuthorized } from "~/auth.server"
import type { Route } from "./+types/album-upload"
import Header from "~/shared/header"
import { uploadToStorage } from "~/files.server"
import ImageUploader from "~/components/image-upload"

export async function loader({request} : Route.LoaderArgs) {
  if(!isAuthorized(request)){
    return redirect("/")
  }
}

export async function action({request} : ActionFunctionArgs){
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await uploadToStorage(buffer, file.type);
}


export default function AlbumUpload(){
  return <div>
    <Header />
    <div className="mx-8 text-2xl font-bold">
      Ielādēt albumu!
    </div>
    <ImageUploader />
    <button className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded-xl font-bold mx-8 mt-4">
        Publicēt!
    </button>
  </div>
}