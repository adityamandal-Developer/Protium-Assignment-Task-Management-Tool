import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import PieActiveArc from "./chartMain";

const Chart = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center w-full">
        <PieActiveArc />
      </CardContent>
    </Card>
  );
};

export default Chart;
