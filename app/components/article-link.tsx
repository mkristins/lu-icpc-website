import { Link } from "react-router";

export default function ArticleLink({title, date} : {title : string, date : string}){
    return <Link 
        className="flex flex-row justify-between m-8"
        to="./1"
        >
        <div className="font-bold text-xl"> {title} </div>
        <div className="text-xl"> {date} </div>
    </Link>
}