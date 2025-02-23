"use client";

import dynamic from "next/dynamic";
import { Activity, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";

const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), { ssr: false });

export default function DashboardPage() {
  return (
    <Layout>
      <div className="relative">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-green-600 dark:text-green-400">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456</div>
                <p className="text-xs text-green-600 dark:text-green-400">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reported Users</CardTitle>
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-amber-600 dark:text-amber-400">+7.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-green-600 dark:text-green-400">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="h-full transform transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="h-full transform transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Total Posts", value: "2,345" },
                    { label: "Active Users Today", value: "1,234" },
                    { label: "Pending Reports", value: "15" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="text-sm font-bold">{stat.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
        </div>
      </div>
    </Layout>
  );
}