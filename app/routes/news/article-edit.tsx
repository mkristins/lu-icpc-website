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
  const formData = await request.formData()
  const articleId = formData.get("articleId")
  const articleJson = formData.get("contentJson")
  if (typeof articleId !== "string") {
    throw new Response("Invalid articleId", { status: 400 })
  }

  if (typeof articleJson !== "string") {
    throw new Response("Invalid contentJson", { status: 400 })
  }
  
  await updateNewsArticle(articleId, articleJson)
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
      return <div>
            <Header />
            <Link to={`/news/${loaderData.article.id}`} className="font-bold text-blue-500 text-2xl m-8">
              Apskatīt!
            </Link>
            <NewsEditor articleId={loaderData.article.id} articleJson={loaderData.article.text} isEditable={true}/>
          </div>
    }
}