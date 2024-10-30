"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserNav } from "./user-nav";
import { CalendarDateRangePicker } from "./date-range-picker";
import Chart from "../charts/chart";
import TaskTable from "../taskTable/mainTable";
import CreateTaskDialog from "./createTasksDialog";
import TaskComments from "../comments/taskComments";
import Stats from "./stats";
export default function DashboardPage() {
  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker className="hidden sm:flex" />
              <CreateTaskDialog />
              <UserNav />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Stats />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                {/* Chart component */}
                <Chart />
                {/* Comments component */}
                <TaskComments />
              </div>
              <div className="grid gap-4 grid-cols-1">
                <div className="relative w-full">
                  <TaskTable key="task table" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
