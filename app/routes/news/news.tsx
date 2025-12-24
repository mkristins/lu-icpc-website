import ArticleLink from "~/components/article-link";
import Header from "~/shared/header";
import { fetchAllNewsArticles } from "~/db.server";
import type { Route } from "./+types/news";
import { isAuthorized } from "~/auth.server";
import AdminWrap from "~/components/admin-wrap";

export async function loader({request, params} : Route.LoaderArgs) {
    let all_articles = await fetchAllNewsArticles();
    const isAdmin = isAuthorized(request)
    return {
        isAdmin : isAdmin,
        articles : all_articles
    }
}

export default function News({loaderData} : Route.ComponentProps) {
    if(!loaderData.articles){
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
        <AdminWrap isAdmin={loaderData.isAdmin}>
            <div className="text-blue-500 font-bold text-2xl m-8">
                Pievienot!
            </div>
        </AdminWrap>
        {
            loaderData.articles.map((article) => {
                return <ArticleLink key={article.id} title={article.title} date="12/12/2025" articleId={article.id}/>
            })
        }
    </div>;
}