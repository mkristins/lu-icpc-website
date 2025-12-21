import { isAuthorized } from "~/auth.server";
import { Form, redirect } from "react-router";
import Header from "~/shared/header";

export function loader({request} : {request : Request}){
    if(isAuthorized(request)){
        return {
            isAdmin: true
        }
    }
    else{
        return redirect("/private/admin")
    }
}

export default function UploadContest() {
    return <div>
        <Header />
        <div className="m-8">
            <div className="text-2xl font-bold">
                Sacensību ielāde
            </div>
            
            <Form className="flex flex-col">
                <input name="contestName" placeholder="Sacensību nosaukums" className="border"/>
                <div>
                    Ieteicams nosaukt "LU Atlase [gads]"
                </div>
                <div>
                    Uzdevumu PDF
                </div>
                <input name="year" placeholder="Gads" className="border"/> 
                <input name="codeforcesApiKey" placeholder="Codeforces API atslēga" className="border"/> 
                <input name="codeforcesUrl" placeholder="Codeforces contest URL" className="border"/>
                <input type="button" className="border bg-green-500 w-12" />
                <div>
                    Importēt
                </div>
                <div>
                    Komandas
                </div>
                <div className="flex flex-row">
                    <div className="m-2">
                        Vieta
                    </div>
                    <div className="m-2">
                        Komandas nosaukums
                    </div>
                    <div className="m-2">
                        Dalībnieks 1
                    </div>
                    <div className="m-2">
                        Dalībnieks 2
                    </div>
                    <div className="m-2">
                        Dalībnieks 3
                    </div>
                    <div className="m-2">
                        Officiāls
                    </div>
                    <div className="m-2">
                        Izvēlēties no arhīva
                    </div>
                </div>
            </Form>
        </div>
    </div>
}