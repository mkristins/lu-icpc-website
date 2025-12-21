import { Link } from "react-router";

export default function Header(){
    return <div>
        <div className="flex flex-row justify-center text-3xl font-bold m-10">
            Latvijas Universitātes ICPC programmēšanas sacensības
        </div>
        <div className="flex flex-row justify-center m-4 ml-12 mr-12">
            <Link to="/" className="m-4">
                Par sacensībām
            </Link>
            <Link to="/news" className="m-4">
                Ziņas
            </Link>
            <Link to="/halloffame" className="m-4">
                Panākumi
            </Link>
            <Link to="/archive" className="m-4">
                Arhīvs
            </Link>
            <Link to="/gallery" className="m-4">
                Galerija
            </Link>
        </div>
    </div>
}