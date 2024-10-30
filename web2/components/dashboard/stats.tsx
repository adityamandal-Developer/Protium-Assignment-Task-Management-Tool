"use client";
import React, { useEffect } from "react";
import PriorityTasks from "../tasks/priorityTasks";
import PendingTasks from "../tasks/pendingTasks";
import CompletedTasks from "../tasks/completedTasks";
import TotalTasks from "../tasks/totalTasks";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useSession } from "next-auth/react";
import { fetchTasksStats, selectTasksStats } from "@/store/slices/tasksSlice";

const Stats = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const stats = useAppSelector(selectTasksStats);

  useEffect(() => {
    if (session?.accessToken) {
      dispatch(fetchTasksStats(session.accessToken)).catch((err) =>
        console.error("Error fetching tasks:", err)
      );
    }
  }, [dispatch, session?.accessToken]);
  if (!stats) return <div>Loading stats...</div>;

  return (
    <>
      {/* Priority tasks */}
      <PriorityTasks
        count={stats.highPriorityTasks || 0}
        total={stats.totalTasks || 0}
      />

      {/* Pending Tasks */}
      <PendingTasks
        count={stats.pendingTasks || 0}
        total={stats.totalTasks || 0}
      />

      {/* Completed Tasks */}
      <CompletedTasks
        count={stats.completedTasks || 0}
        total={stats.totalTasks || 0}
      />

      {/* Total Tasks*/}
      <TotalTasks count={stats.totalTasks} />
    </>
  );
};

export default Stats;
