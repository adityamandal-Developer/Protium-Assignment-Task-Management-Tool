"use client";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useSession } from "next-auth/react";
import { fetchTasksStats, selectTasksStats } from "@/store/slices/tasksSlice";
import { useTheme } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PieActiveArc() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const stats = useAppSelector(selectTasksStats);
  const theme = useTheme();
  const { resolvedTheme } = useNextTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Add responsive width handling
  const [chartWidth, setChartWidth] = useState(500);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Mobile breakpoint
      setChartWidth(width < 768 ? 250 : 500); // Adjust chart size for mobile
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchTasksStats(session.accessToken)).catch((err) =>
        console.error("Error fetching tasks:", err)
      );
    }
  }, [dispatch, session?.accessToken]);

  if (!stats) return <div>Loading stats...</div>;

  const chartData = [
    { label: "Total Tasks", value: stats.totalTasks || 0 },
    { label: "Completed", value: stats.completedTasks || 0 },
    { label: "Pending", value: stats.pendingTasks || 0 },
    { label: "High Priority", value: stats.highPriorityTasks || 0 },
  ];

  const chartHeight = 500;

  return (
    <div className="flex items-center justify-center w-full">
      <PieChart
        series={[
          {
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 45,
            data: chartData,
            // Adjust label position based on screen size
            arcLabelRadius: isMobile ? 55 : 80,
            innerRadius: isMobile ? 20 : 60,
            paddingAngle: 5,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: isDarkMode ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: isMobile ? "0.7rem" : "0.9rem",
          },
        }}
        width={chartWidth}
        height={chartHeight}
        margin={{
          top: 150,
          bottom: isMobile ? 80 : 20, // More bottom margin on mobile for legend
          left: isMobile ? 20 : 40,
          right: isMobile ? 20 : 80, // More right margin on desktop for side legend
        }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "middle" },
            padding: isMobile ? 10 : 20,
            itemGap: 20,
            markGap: 40,
            labelStyle: {
              fill: isDarkMode ? "#fff" : "#000",
              fontSize: isMobile ? 12 : 14,
            },
          },
        }}
      />
    </div>
  );
}
