import { Form, redirect, type ActionFunctionArgs } from "react-router"
import { isAuthorized } from "~/auth.server"
import type { Route } from "./+types/album-upload"
import Header from "~/shared/header"
import { uploadToStorage } from "~/files.server"

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
    <div className="m-8 text-2xl font-bold">
      Ielādēt albumu!
    </div>
    <Form method="post" encType="multipart/form-data" className="m-8">
      <input type="file" name="file" required className="border"/>
      <button type="submit">Upload</button>
    </Form>
  </div>
}