import { NextResponse } from "next/dist/server/web/spec-extension/response"; 

export default function middleware(req) {
    const {cookies} = req;
    const cookieList = [...cookies];
    const jwt = cookieList.find(cookie => cookie[0] === 'jwt')

    const url = req.url;

    if((url.includes("/account") 
        || url.includes("/payment")
        || url.includes("/subscriptions")) && !jwt) {
        return NextResponse.redirect("http://localhost:3000/auth/login");
    }

    if((url.includes("/auth/login") 
        || url.includes("/auth/register")) && jwt) {
        return NextResponse.redirect("http://localhost:3000");
    }

    return NextResponse.next();
}
