import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import FictionClient from "./fiction-client"

export default async function FictionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    redirect('/login')
  }
  
  return <FictionClient id={id} />
} 