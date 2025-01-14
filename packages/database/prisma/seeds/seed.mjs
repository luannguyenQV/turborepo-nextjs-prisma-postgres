import { PrismaClient } from "@prisma/client"
// import posts from "./posts.json"
// import slugify from "slugify"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "admin@codeforstartup.com",
    },
    create: {
      name: "Luan Nguyen",
      email: "admin@codeforstartup.com",
      password: "12345678",
    },
    update: {},
  })

  // for (const post of posts) {
  //   await prisma.post.create({
  //     data: {
  //       title: post.title || '',
  //       content: post.description,
  //       slug: slugify(post.title || '-') + new Date().getTime(),
  //       postStatus: "PUBLISHED",
  //       author: {
  //         connect: {
  //           id: user.id,
  //         },
  //       },
  //       tags: {
  //         create: {
  //           name: "next.js",
  //         },
  //       },
  //     },
  //   })
  // }
}

main().then(() => {
  console.log("Seed has been created")
})
