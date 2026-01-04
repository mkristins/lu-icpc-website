import { Link } from "react-router";

export default function ArticleLink({title, date, articleId} : {title : string, date : Date, articleId : number}){
    return <Link 
            className="flex flex-row justify-between m-4 mx-20"
            to={`./${articleId}`}
        >
        <div className="font-bold text-xl text-blue-500"> {title} </div>
        <div className="text-xl"> {date.toISOString().split('T')[0]} </div>
    </Link>
}