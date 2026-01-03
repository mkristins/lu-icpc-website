import ArticleLink from "~/components/article-link";
import Header from "~/shared/header";
import { fetchAllNewsArticles } from "~/db.server";
import type { Route } from "./+types/news";
import { isAuthorized } from "~/auth.server";
import AdminWrap from "~/components/admin-wrap";
import { Link } from "react-router";

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
        <div className="mx-8 font-bold text-2xl"> Ziņas </div>
        <AdminWrap isAdmin={loaderData.isAdmin}>
            <Link to="./upload" className="text-blue-500 font-bold text-2xl mx-8">
                Jauna ziņa!
            </Link>
        </AdminWrap>
        {
            loaderData.articles.map((article) => {
                return <ArticleLink key={article.id} title={article.title} date={article.date} articleId={article.id}/>
            })
        }
    </div>;
}