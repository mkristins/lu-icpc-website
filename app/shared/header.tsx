import { Link } from "react-router";

export default function Header(){
    return <div>
        <div className="flex flex-row justify-center text-3xl font-bold m-10">
            Latvijas Universitātes ICPC programmēšanas sacensības
        </div>
        <div className="flex flex-row justify-between m-4 ml-12 mr-12">
            <Link to="/">
                Par sacensībām
            </Link>
            <Link to="/news">
                Ziņas
            </Link>
            <div>
                Piesakies!
            </div>
            <div>
                Panākumi
            </div>
            <Link to="/archive">
                Arhīvs
            </Link>
            <Link to="/gallery">
                Galerija
            </Link>
        </div>
    </div>
}