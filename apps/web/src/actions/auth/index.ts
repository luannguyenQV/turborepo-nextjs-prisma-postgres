"use server"

import bcryptjs from "bcryptjs"
import { Prisma } from "database"
import { createUser } from "database/src/users/queries"
import VerifyEmail from "emails/verify-email"

import { signIn, signOut } from "@/configs/auth"
import { sendEmail } from "@/emails"
import { redirect } from "@/utils/navigation"

import { SignUpDataOutput, signUpSchema } from "./type"

export const signInWithCredentials = async (email: string, password: string) => {
  await signIn("credentials", {
    email,
    password,
  })
}

export const signInWithGithub = async () => {
  console.log("signInWithGithub...")
  await signIn("github")
}

export const onSignOut = async () => {
  await signOut({
    redirectTo: "/",
  })
}

// SIGN UP
export const signUp = async (
  data: Pick<Prisma.UserCreateInput, "email" | "password">
): Promise<SignUpDataOutput> => {
  try {
    // hash password
    const { email, password } = data
    const hashedPassword = await bcryptjs.hash(password, 10)

    await createUser({
      email,
      password: hashedPassword,
      username: email.split("@")[0],
    })

    // create verification code
    const token = crypto.randomUUID()
    await prisma.verificationToken.create({
      data: {
        token, // 6 digits code
        identifier: email,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      },
    })

    // send email
    await sendEmail({
      email,
      subject: "Welcome to Next Forum",
      react: VerifyEmail({
        token,
        email,
      }),
    })
  } catch (error) {
    if (error?.error?.code === "P2002") {
      return {
        formErrors: null,
        fieldErrors: {
          email: ["Email already exists"], // TODO: localize error message
        },
      }
    }

    return {
      formErrors: [error?.message],
      fieldErrors: {},
    }
  }

  // TODO: white this redirect not work
  redirect("/login")
}
