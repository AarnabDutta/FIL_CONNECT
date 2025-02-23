"use client"

import type React from "react"

import { motion } from "framer-motion"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 w-64 border-r bg-background"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-16 items-center border-b px-6">
          <motion.h1
            className="text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            FILxCONNECT
          </motion.h1>
        </div>
        <motion.div
          className="p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MainNav />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="pl-64">
        <motion.header
          className="sticky top-0 z-50 border-b bg-background"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </motion.header>
        <motion.main
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

