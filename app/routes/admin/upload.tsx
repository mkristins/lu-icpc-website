import { isAuthorized } from "~/auth.server";
import { Form, redirect, useFetcher } from "react-router";
import Header from "~/shared/header";
import { fetchCodeforcesData } from "~/cf.server";

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

export async function action({request} : {request : Request}){
    const formData = await request.formData();
    const intent = formData.get("_action")
    console.log(formData)
    if(intent == "load"){
        const apiKey = formData.get("codeforcesApiKey")
        const apiSecret = formData.get("codeforcesApiSecret")
        const contestId = formData.get("codeforcesContestId")
        if (typeof apiKey !== "string") {
            throw new Response("Invalid apiKey", { status: 400 })
        }
        if (typeof apiSecret !== "string") {
            throw new Response("Invalid apiSecret", { status: 400 })
        }
        if (typeof contestId !== "string") {
            throw new Response("Invalid contestId", { status: 400 })
        }
        // Load the data from codeforces
        const data = await fetchCodeforcesData(apiKey.trim(), apiSecret.trim(), contestId.trim())
        console.log("CF loading triggered")
    }
}

function InputComponent({name, placeholder} : {name : string, placeholder : string}){
    return <input name={name} placeholder={placeholder} className="w-64 h-12 border rounded px-2 py-1 m-2" />
}

export default function UploadContest() {
    const fetcher = useFetcher()
    return <div>
        <Header />
        <div className="m-8">
            <div className="text-2xl font-bold">
                Sacensību ielāde
            </div>
            <Form className="flex flex-col">
                <InputComponent name="contestName" placeholder="Sacensību nosaukums" /> 
                <div>
                    Ieteicams nosaukt "LU Atlase [gads]"
                </div>
                <div>
                    Uzdevumu PDF
                </div>
                {/* <input
                    type="file"
                    name="taskPDF"
                    required
                    className="border w-48 h-10 m-2 flex flex-col items-center justify-center"
                /> */}
                <InputComponent name="year" placeholder="Gads" /> 
            </Form>
            <fetcher.Form method="post" className="flex flex-col">
                <div> Ielāde no "Codeforces" </div>
                <InputComponent name="codeforcesApiKey" placeholder="Codeforces API atslēga" /> 
                <InputComponent name="codeforcesApiSecret" placeholder="Codeforces API noslēpums" /> 
                <InputComponent name="codeforcesContestId" placeholder="Codeforces sacensību ID" /> 
                <div>
                    ⚠️ Uzmanību! Sistēma šīs atslēgas neuzglabā un izmanto tās tikai datu izguvei no Codeforces sistēmas.
                </div>
                <button type="submit" name="_action" value="load" className="border bg-green-500 hover:bg-green-600 w-48 h-10 rounded font-bold m-2">
                    Ielādēt no Codeforces!
                </button>
            </fetcher.Form>
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
        </div>
    </div>
}