import { Link } from "react-router";

export default function ArticleLink({title, date, articleId} : {title : string, date : string, articleId : number}){
    return <Link 
            className="flex flex-row justify-between m-4 mx-20"
            to={`./${articleId}`}
        >
        <div className="font-bold text-xl"> {title} </div>
        <div className="text-xl"> {date} </div>
    </Link>
}