import Header from "~/shared/header";
import type { Route } from "./+types/article-edit";
import { fetchNewsArticle } from "~/db.server";
import { Link, redirect, useLoaderData, type ActionFunctionArgs } from "react-router";
import { useEditor, useEditorState, EditorContent, Editor } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style"
import StarterKit from "@tiptap/starter-kit";
import TestTip from "~/components/news-editor";
import { useFetcher } from "react-router";
import { updateNewsArticle } from "~/db.server";
import NewsEditor from "~/components/news-editor";
import { isAuthorized } from "~/auth.server";
import type { UploadArticle } from "~/types/content";

export async function loader({request, params} : Route.LoaderArgs){ 
  const isAdmin = isAuthorized(request)
  if(!isAdmin){
    return redirect("/")
  }
  let article = await fetchNewsArticle(params.id)
  return {
      article: article
  }
}


export async function action({
  request,
}: Route.ActionArgs) {
  const isAdmin = isAuthorized(request)
  if(!isAdmin){
    throw new Response("Unauthorized", {status: 401})
  }

  const json = await request.json()
  const articleId = json.articleId
  const article = json.article
  const articleTitle = article.title
  const articleJson = article.jsonBody
  await updateNewsArticle(articleId, articleTitle, articleJson)
}


export default function ArticleEdit({loaderData} : Route.ComponentProps){
    const fetcher = useFetcher()

    if(!loaderData.article) {
        return <div>
            <Header />
            <h1> SAITE NEEKSISTĒ! </h1>
        </div>
    }
    else{
      function onSave(t : UploadArticle){
        fetcher.submit(JSON.stringify({
          articleId: loaderData.article?.id,
          article : t
        }), {
          method: "post",
          encType: "application/json"
        })
      }
      return <div>
            <Header />
            <Link to={`/news/${loaderData.article.id}`} className="font-bold text-blue-500 text-2xl m-8">
              Apskatīt!
            </Link>
            <NewsEditor articleJson={loaderData.article.text} articleTitle={loaderData.article.title} isEditable={true} onSave={onSave} saveTitle="Saglabāt"/>
          </div>
    }
}