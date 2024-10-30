import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import PieActiveArc from "./chartMain";

const Chart = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-2 w-full m-0">
        <PieActiveArc />
      </CardContent>
    </Card>
  );
};

export default Chart;
