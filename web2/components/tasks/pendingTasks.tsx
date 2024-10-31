import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { MdOutlinePendingActions } from "react-icons/md";

interface PendingTasksProps {
  count: number;
  total: number;
}
const PendingTasks: React.FC<PendingTasksProps> = ({ count, total }) => {
  const pendingPercentage = Math.round((count / total) * 100);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
        <MdOutlinePendingActions />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {" "}
          {pendingPercentage}% Pending
        </p>
      </CardContent>
    </Card>
  );
};

export default PendingTasks;
