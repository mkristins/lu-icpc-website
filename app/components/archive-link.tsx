import { Link } from "react-router"

export default function ArchiveLink({year, taskLink, resultLink} : {year : number, taskLink : string, resultLink : string}){
    return <div className="m-3 flex flex-row justify-center">
        <div className="ml-8 mr-8 font-bold text-xl">
            {year}
        </div>
        <Link className="ml-8 mr-8" to={taskLink} target="_blank">
            Uzdevumi
        </Link>
        <Link className="ml-8 mr-8" to={resultLink}>
            Rezultāti
        </Link>
    </div>
}