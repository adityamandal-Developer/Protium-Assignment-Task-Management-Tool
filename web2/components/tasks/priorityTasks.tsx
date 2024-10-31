import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { MdOutlinePriorityHigh } from "react-icons/md";

interface PriorityTasksProps {
  count: number;
  total: number;
}

const PriorityTasks: React.FC<PriorityTasksProps> = ({ count, total }) => {
  const priorityPercentage = Math.round((count / total) * 100);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Priority Tasks</CardTitle>
        <MdOutlinePriorityHigh />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {" "}
          {priorityPercentage}% tasks on priority
        </p>
      </CardContent>
    </Card>
  );
};

export default PriorityTasks;
