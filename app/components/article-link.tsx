export default function ArticleLink({title, date} : {title : string, date : string}){
    return <div className="flex flex-row justify-between m-4">
        <div className="font-bold text-xl"> {title} </div>
        <div className="text-xl"> {date} </div>
    </div>
}