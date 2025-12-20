import { isAuthorized, verifyToken } from "~/auth.server";
import { parse } from "cookie";
import { redirect } from "react-router";

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
        Šeit tu vari ielādēt contestu
    </div>
}