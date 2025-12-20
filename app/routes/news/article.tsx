import Header from "~/shared/header";
import type { Route } from "./+types/article";
import { fetchNewsArticle } from "~/db.server";
import { useLoaderData, type ActionFunctionArgs } from "react-router";
import { useEditor, useEditorState, EditorContent, Editor } from "@tiptap/react";
import { TextStyleKit } from "@tiptap/extension-text-style"
import StarterKit from "@tiptap/starter-kit";
import TestTip from "~/components/news-editor";
import { useFetcher } from "react-router";
import { updateNewsArticle } from "~/db.server";
import NewsEditor from "~/components/news-editor";

export async function loader({params} : Route.LoaderArgs){ 
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


export default function Article({loaderData} : Route.ComponentProps){
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
            <NewsEditor articleId={loaderData.article.id} articleJson={loaderData.article.text}/>
          </div>
    }
}