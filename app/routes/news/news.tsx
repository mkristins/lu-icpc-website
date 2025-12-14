import ArticleLink from "~/components/article-link";
import Header from "~/shared/header";
import { fetchAllNewsArticles } from "~/db.server";
import type { Route } from "./+types/news";

export async function loader({params} : Route.LoaderArgs) {
    let all_articles = await fetchAllNewsArticles();
    return all_articles
}

export default function News({loaderData} : Route.ComponentProps) {
    if(!loaderData){
        return <div>
            <Header />
            <div>
                LAPA NEEKSISTĒ
            </div>
        </div>
    }
    return <div>
        <Header />
        <div className="m-8 font-bold text-2xl"> Ziņas </div>
        {
            loaderData.map((article) => {
                return <ArticleLink title={article.title} date="12/12/2025"/>
            })
        }
    </div>;
}