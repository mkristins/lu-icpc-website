import ArticleLink from "~/components/article-link";
import Header from "~/shared/header";
export default function News() {
    return <div>
        <Header />
        <div> Jaunumi </div>
        <ArticleLink title="LU programmētāji iegūst sudrabu ICPC pusfinālā" date="12/12/2025"/>
        <ArticleLink title="LU programmētāji iegūst bronzu ICPC pusfinālā" date="12/12/2023"/>
        <ArticleLink title="LU programmētāji iegūst sudrabu ICPC pusfinālā" date="12/12/2025"/>
        <ArticleLink title="LU programmētāji iegūst bronzu ICPC pusfinālā" date="12/12/2023"/>
        <ArticleLink title="LU programmētāji iegūst sudrabu ICPC pusfinālā" date="12/12/2025"/>
        <ArticleLink title="LU programmētāji iegūst bronzu ICPC pusfinālā" date="12/12/2023"/>
    </div>;
}