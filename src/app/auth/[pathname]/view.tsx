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
                <AuthCard pathname={pathname} />

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
