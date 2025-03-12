import React from "react"
import { Metadata } from "next/types"

import { getUser } from "database"

import { auth } from "@/configs/auth"
import PageTitle from "@/molecules/page-title"

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()
  const user = await getUser({ where: { id: session?.user?.id } })

  return {
    title: `Posts - ${user?.data?.username}`,
    description: `Posts of ${user?.data?.username}`,
  }
}

export default async function Page({ searchParams }) {
  const session = await auth()

  return (
    <div>
      <PageTitle title="Posts" />

      <div className="mt-12">
        <div>TOTO</div>
      </div>
    </div>
  )
}
