import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function middleware(req) {
  const res = NextResponse.next();

  const userId = req.cookies.get("userId");
  if (!userId) {
    console.log("setting userId - ", userId);
    const newUserId = uuidv4();

    res.cookies.set("userId", newUserId, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export const config = {
  matcher: [
    // Match all page and API routes, but exclude static assets
    "/((?!_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|[^/]+\\.(?:css|js|gif|jpg|jpeg|png|webp|avif|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|mp3|wav|m4a|aac|opus)).*)",

    // Explicitly allow all API routes
    "/api/:path*",
  ],
};
