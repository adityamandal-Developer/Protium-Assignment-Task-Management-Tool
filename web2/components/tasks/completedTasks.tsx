import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { MdDone } from "react-icons/md";

interface CompletedTasksProps {
  count: number;
  total: number;
}
const CompletedTasks: React.FC<CompletedTasksProps> = ({ count, total }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
        <MdDone />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {(count / total) * 100}% completed
        </p>
      </CardContent>
    </Card>
  );
};

export default CompletedTasks;
