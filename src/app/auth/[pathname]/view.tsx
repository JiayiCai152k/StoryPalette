"use client"

import { AuthCard } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { cn } from "@/lib/utils"

export function AuthView({ pathname }: { pathname: string }) {
    const router = useRouter()

    useEffect(() => {
        router.refresh()
    }, [router])

    return (
        <main className="container mx-auto flex grow items-center justify-center py-8">
            <div className="w-full max-w-md">
                <AuthCard 
                    pathname={pathname}
                    className={cn(
                        "[&_input]:pr-10",
                        "[&_button[type='button']]:right-3",
                        "[&_button[type='button']]:left-auto",
                        "[&_button[type='button']]:absolute",
                        "[&_button[type='button']]:top-1/2",
                        "[&_button[type='button']]:-translate-y-1/2",
                        "[&_.relative]:relative",
                        "[&_div]:relative",
                    )}
                />

                <p
                    className={cn(
                        ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
                        "text-muted-foreground text-xs text-center mt-4"
                    )}
                >
                    Powered by{" "}
                    <Link
                        className="text-warning underline"
                        href="https://better-auth.com"
                        target="_blank"
                    >
                        better-auth.
                    </Link>
                </p>
            </div>
        </main>
    )
}
