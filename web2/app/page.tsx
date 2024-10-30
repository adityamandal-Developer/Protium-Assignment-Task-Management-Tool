"use client";

import dynamic from "next/dynamic";

const DashboardPage = dynamic(
  () => import("@/components/dashboard/dashboard"),
  { ssr: false }
);
const StoreProvider = dynamic(() => import("./StoreProvider"), { ssr: false });

export default function Home() {
  return <DashboardPage />;
}
