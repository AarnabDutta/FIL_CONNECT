"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Activity, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), { ssr: false });

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [activePosts, setActivePosts] = useState<number>(0);
  const [reportedUsers, setReportedUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [totalResponse, activeUsersResponse, activePostsResponse, reportedUsersResponse, totalPostsResponse] = 
      await Promise.all([
        fetch('http://localhost:2002/api/users/total'),
        fetch('http://localhost:2002/api/users/total/active'),
        fetch('http://localhost:2002/api/posts/total/active'),
        fetch('http://localhost:2002/api/reports/total/users'),
        fetch('http://localhost:2002/api/posts') // Add this new endpoint
      ]);

      if (!totalResponse.ok || !activeUsersResponse.ok || !activePostsResponse.ok || 
          !reportedUsersResponse.ok || !totalPostsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [totalData, activeUsersData, activePostsData, reportedUsersData, totalPostsData] = 
      await Promise.all([
        totalResponse.json(),
        activeUsersResponse.json(),
        activePostsResponse.json(),
        reportedUsersResponse.json(),
        totalPostsResponse.json()
      ]);

      setTotalUsers(totalData);
      setActiveUsers(activeUsersData);
      setActivePosts(activePostsData);
      setReportedUsers(reportedUsersData);
      setTotalPosts(totalPostsData.length); // Set total posts count
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use the auto-refresh hook (refreshes every 30 seconds)
  useAutoRefresh(fetchData);

  return (
    <Layout>
      <div className="relative">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <span className="block h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <span className="mt-1 block h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      +20.1% from last month
                    </span>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <span className="block h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <span className="mt-1 block h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {`${((activeUsers / totalUsers) * 100).toFixed(1)}% of total users`}
                    </span>
                  </>
                )}
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
                {isLoading ? (
                  <>
                    <span className="block h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <span className="mt-1 block h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{activePosts}</div>
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Active posts
                    </span>
                  </>
                )}
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
                {isLoading ? (
                  <>
                    <span className="block h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <span className="mt-1 block h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{reportedUsers}</div>
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      {`${((reportedUsers / totalUsers) * 100).toFixed(1)}% of total users`}
                    </span>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Commented out Active Now card
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
            */}

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
                    { label: "Total Posts", value: isLoading ? "..." : totalPosts.toString() },
                    { label: "Active Users", value: isLoading ? "..." : activeUsers.toString() },
                    // { label: "Pending Reports", value: isLoading ? "..." : reportedUsers.toString() },
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