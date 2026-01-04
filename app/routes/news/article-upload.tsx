import { Link, redirect, useFetcher } from "react-router";
import NewsEditor from "~/components/news-editor";
import Header from "~/shared/header";
import type { Route } from "./+types/article-upload";
import { isAuthorized } from "~/auth.server";
import type { UploadArticle } from "~/types/content";
import { createNewsArticle } from "~/db.server";
import { uploadAlbumImage } from "~/files.server";

export function loader({request} : Route.LoaderArgs){
    if(!isAuthorized(request)){
        return redirect('/')
    }
}

const BASE_DOC = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Te ir saturs..."
        }
      ]
    }
  ]
}

export async function action({request} : {request : Request}){
    if(!isAuthorized(request)){
        return redirect("/")
    }
    const contentType = request.headers.get("content-type") || "";
    if(contentType.includes("multipart/form-data")){
      const form = await request.formData();
      const image = form.get("img");
      if(!(image instanceof File)){
        return "/"
      }
      const imgUrl = await uploadAlbumImage(image)
      return {
        imgUrl : `${process.env.STORAGE_URL!}/${imgUrl}`
      }
    }
    else{
      const json = await request.json();
      const article = json.article
      const articleId = await createNewsArticle(article.title, article.jsonBody)
      return redirect(`/news/${articleId}`)
    }
}

export default function ArticleUpload(){
    const fetcher = useFetcher()
    function onSave(t : UploadArticle){
        fetcher.submit(JSON.stringify({
            article: t
        }), {
            method: "post",
            encType: "application/json",
        })
    }
    return <div>
            <Header />
            <NewsEditor articleJson={JSON.stringify(BASE_DOC)} newArticle={true} articleTitle="Paraugs" isEditable={true} onSave={onSave} saveTitle="Publicēt!"/>
          </div>
}