import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditProfileForm } from "@/components/profile/EditProfileForm"
import { headers } from "next/headers"
import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { eq } from "drizzle-orm"

export default async function EditProfilePage() {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch full user data using direct query
  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then(rows => rows[0])

  if (!userData) {
    redirect('/profile')
  }

  return (
    <main className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={userData} />
        </CardContent>
      </Card>
    </main>
  )
} 