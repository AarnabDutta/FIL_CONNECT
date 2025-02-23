"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, database } from "@/lib/Firebase"
import { ref, serverTimestamp, set } from "firebase/database"
import signup from "@/public/signup.jpg"
import logo  from "@/public/logo.png"
const formSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user

      await set(ref(database, `users/${user.uid}`), {
        id: user.uid,
        fullName: values.fullName,
        email: values.email,
        role: "SUPER_ADMIN",
        createdAt: serverTimestamp(),
      })

      console.log("User signed up and stored in database:", user.uid)
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Signup error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-foreground" />
        <div className="relative z-20 flex items-center gap-2">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
            <Image src={logo} alt="Logo" width={140} height={40} className="rounded-lg" />
          </motion.div>
          {/* <motion.h1
            className="text-2xl font-bold"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            FILxCONNECT
          </motion.h1> */}
        </div>
        <motion.div
          className="relative z-20 mt-20 ml-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
            <Image src={signup} alt="signup" width={500} height={500} className="rounded-lg" />
          </motion.div>

        </motion.div>
      </div>
      <div className="lg:p-8">
        <motion.div
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your admin account</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={fadeIn} transition={{ duration: 0.3, delay: 0.1 }}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={fadeIn} transition={{ duration: 0.3, delay: 0.2 }}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@filxconnect.com"
                          type="email"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={fadeIn} transition={{ duration: 0.3, delay: 0.3 }}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={fadeIn} transition={{ duration: 0.3, delay: 0.4 }}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <Button
                className="w-full transition-all duration-200 hover:scale-[1.02]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    Creating account...
                  </motion.div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

