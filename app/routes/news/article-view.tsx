import Header from "~/shared/header"
import type { Route } from "./+types/article-view"
import { fetchNewsArticle } from "~/db.server"
import NewsEditor from "~/components/news-editor"
import { isAuthorized } from "~/auth.server"
import AdminAuth from "../admin/admin"
import AdminWrap from "~/components/admin-wrap"
import { Link } from "react-router"

export async function loader({request, params} : Route.LoaderArgs){ 
  let article = await fetchNewsArticle(params.id)
  const isAdmin = isAuthorized(request)
  return {
      article: article,
      isAdmin: isAdmin
  }
}

export default function ArticleView({loaderData} : Route.ComponentProps){
  if(!loaderData.article) {
      return <div>
          <Header />
          <h1> SAITE NEEKSISTĒ! </h1>
      </div>
  }
  else{
    return <div>
          <Header />
          <AdminWrap isAdmin={loaderData.isAdmin}>
            <Link to="./edit" className="font-bold text-blue-500 text-2xl m-8">
              Rediģēt!
            </Link>
          </AdminWrap>
          <NewsEditor articleId={loaderData.article.id} articleJson={loaderData.article.text} isEditable={false}/>
        </div>
  }
}