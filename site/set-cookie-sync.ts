"use server";
import { cookies } from "next/headers";

export async function setCookieSync(name: string, value: string, days: number = 365) {
  (await cookies()).set({
    name,
    value,
    secure: true,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * days // Cookie values ​​are valid for one year
  });
}
