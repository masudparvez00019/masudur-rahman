"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionHeading from "@/components/ui/section-heading";
import { BarChart, LineChart, PieChart } from "./analytics/charts";
import { TopResourcesTable } from "./analytics/top-resources-table";
import { StatsCards } from "./analytics/stats-cards";
import { EventType } from "@/lib/types/analytics";

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: null,
    events: null,
    users: null,
    resources: null,
    revenue: null,
  });

  // Fetch analytics data based on active tab and time range
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data;

        switch (activeTab) {
          case "overview":
            const response = await fetch(
              `/api/analytics/overview?days=${timeRange}`
            );
            data = await response.json();
            setAnalyticsData((prev) => ({ ...prev, overview: data }));
            break;

          case "events":
            const eventsResponse = await fetch(
              `/api/analytics/events?days=${timeRange}`
            );
            data = await eventsResponse.json();
            setAnalyticsData((prev) => ({ ...prev, events: data }));
            break;

          case "users":
            const usersResponse = await fetch(
              `/api/analytics/users?days=${timeRange}`
            );
            data = await usersResponse.json();
            setAnalyticsData((prev) => ({ ...prev, users: data }));
            break;

          case "resources":
            const resourcesResponse = await fetch(
              `/api/analytics/resources?days=${timeRange}`
            );
            data = await resourcesResponse.json();
            setAnalyticsData((prev) => ({ ...prev, resources: data }));
            break;

          case "revenue":
            const revenueResponse = await fetch(
              `/api/analytics/revenue?days=${timeRange}`
            );
            data = await revenueResponse.json();
            setAnalyticsData((prev) => ({ ...prev, revenue: data }));
            break;
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeading
          title="Analytics Dashboard"
          subtitle="Track and analyze user activity across your portfolio"
          align="left"
        />

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading analytics data...</p>
            </div>
          ) : analyticsData.overview ? (
            <>
              <StatsCards
                stats={[
                  {
                    title: "Total Page Views",
                    value:
                      analyticsData.overview.eventCounts.find(
                        (e: any) => e.eventType === EventType.PAGE_VIEW
                      )?.count || 0,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "Active Users",
                    value: analyticsData.overview.userStats.activeUsers,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "New Users",
                    value: analyticsData.overview.userStats.newUsers,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "Total Revenue",
                    value: `$${analyticsData.overview.revenueStats.totalRevenue.toFixed(
                      2
                    )}`,
                    description: `Last ${timeRange} days`,
                  },
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of events by type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={analyticsData.overview.eventCounts.map(
                        (item: any) => ({
                          name: item.eventType,
                          value: item.count,
                        })
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Daily Active Users</CardTitle>
                    <CardDescription>User activity over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart
                      data={analyticsData.overview.userStats.dailyActiveUsers}
                      xKey="date"
                      yKey="count"
                      name="Users"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Revenue</CardTitle>
                    <CardDescription>Revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <BarChart
                      data={analyticsData.overview.revenueStats.dailyRevenue}
                      xKey="date"
                      yKey="amount"
                      name="Revenue"
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>No analytics data available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading events data...</p>
            </div>
          ) : analyticsData.events ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Event Distribution</CardTitle>
                  <CardDescription>Breakdown of events by type</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <BarChart
                    data={analyticsData.events.eventCounts}
                    xKey="eventType"
                    yKey="count"
                    name="Events"
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Views</CardTitle>
                    <CardDescription>Page views over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <LineChart
                      data={analyticsData.events.dailyCounts}
                      xKey="date"
                      yKey="count"
                      name="Views"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Types</CardTitle>
                    <CardDescription>
                      Distribution of event types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <PieChart
                      data={analyticsData.events.eventCounts.map(
                        (item: any) => ({
                          name: item.eventType,
                          value: item.count,
                        })
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>No events data available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading user data...</p>
            </div>
          ) : analyticsData.users ? (
            <>
              <StatsCards
                stats={[
                  {
                    title: "Active Users",
                    value: analyticsData.users.activeUsers,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "New Users",
                    value: analyticsData.users.newUsers,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "Retention Rate",
                    value: `${(
                      ((analyticsData.users.activeUsers -
                        analyticsData.users.newUsers) /
                        analyticsData.users.activeUsers) *
                      100
                    ).toFixed(1)}%`,
                    description: "Returning users",
                  },
                ]}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Daily Active Users</CardTitle>
                  <CardDescription>User activity over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart
                    data={analyticsData.users.dailyActiveUsers}
                    xKey="date"
                    yKey="count"
                    name="Users"
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>No user data available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading resources data...</p>
            </div>
          ) : analyticsData.resources ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Top Resources</CardTitle>
                      <CardDescription>Most viewed resources</CardDescription>
                    </div>
                    <Select
                      defaultValue="course"
                      onValueChange={(value) => {
                        fetch(
                          `/api/analytics/resources?type=${value}&days=${timeRange}`
                        )
                          .then((res) => res.json())
                          .then((data) =>
                            setAnalyticsData((prev) => ({
                              ...prev,
                              resources: data,
                            }))
                          );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Resource type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Courses</SelectItem>
                        <SelectItem value="blog">Blogs</SelectItem>
                        <SelectItem value="project">Projects</SelectItem>
                        <SelectItem value="tutorial">Tutorials</SelectItem>
                        <SelectItem value="lesson">Lessons</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <TopResourcesTable
                      resources={analyticsData.resources.topResources}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>No resources data available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading revenue data...</p>
            </div>
          ) : analyticsData.revenue ? (
            <>
              <StatsCards
                stats={[
                  {
                    title: "Total Revenue",
                    value: `$${analyticsData.revenue.totalRevenue.toFixed(2)}`,
                    description: `Last ${timeRange} days`,
                  },
                  {
                    title: "Average Daily Revenue",
                    value: `$${(
                      analyticsData.revenue.totalRevenue /
                      analyticsData.revenue.dailyRevenue.length
                    ).toFixed(2)}`,
                    description: `Last ${timeRange} days`,
                  },
                ]}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                  <CardDescription>Revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={analyticsData.revenue.dailyRevenue}
                    xKey="date"
                    yKey="amount"
                    name="Revenue"
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>No revenue data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
