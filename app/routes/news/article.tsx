import Header from "~/shared/header";
import type { Route } from "./+types/article";
import { creator, fetchNewsArticle } from "~/db.server";
import { useLoaderData, type ActionFunctionArgs } from "react-router";

export async function loader({params} : Route.LoaderArgs){
    let article = await fetchNewsArticle(params.id)
    return {
        article: article
    }
}

export async function action({
  request,
}: ActionFunctionArgs) {
  await creator()
}


export default function Article({loaderData} : Route.ComponentProps){
    if(!loaderData.article) {
        return <div>
            <Header />
            <h1> SAITE NEEKSISTĒ! </h1>
        </div>
    }
    return <div>
        <Header />
            <h1> {loaderData.article.title} </h1>
            <p> {loaderData.article.text} </p>
        </div>
}