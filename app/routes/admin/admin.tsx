import { useState } from "react";
import Header from "~/shared/header";
import type { Route } from "./+types/admin";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { checkAdminAuth, createToken, isAuthorized } from "~/auth.server";

export function loader({request} : {request : Request}){
    const isAdmin = isAuthorized(request)
    if(isAdmin){
        return redirect("/")
    }
}

export async function action({request} : ActionFunctionArgs){
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const isAdmin = await checkAdminAuth(username, password)
    const token = createToken(username)
    if(isAdmin){
        return redirect("/", {
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`,
            },
        });
    }
}

export default function AdminAuth(){
    return <form method="post" className="flex flex-col">
        <input className="border w-64 m-2 p-1" name="username" placeholder="Lietotājvārds" type="username" required />
        <input className="border w-64 m-2 p-1" name="password" placeholder="Parole" type="password" required />
        <button className="border w-64 m-2 p-1"type="submit"> Login </button>
    </form>
}