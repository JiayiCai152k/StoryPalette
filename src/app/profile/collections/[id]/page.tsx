import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import CollectionClient from "./collection-client"

export default async function CollectionPage({ 
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
  
  return <CollectionClient id={id} />
} 