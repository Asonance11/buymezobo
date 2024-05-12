import DashBoardEarningPage from "@/components/AdminComponents/DashBoardEarningPage";
import { getCurrentUser } from "@/lib/authentication";
import { CircularProgress } from "@mui/material";
import React, { Suspense } from "react";

export default async function Dashboard() {
  const profile = await getCurrentUser();
  if (!profile) {
    return null;
  }
  return (
    <main className="w-full h-full transition-all duration-300">
      <section className="h-full md:w-5/6 lg:w-3/5 mx-auto p-5 flex flex-col gap-4">
        <DashBoardEarningPage profile={profile} />
      </section>
    </main>
  );
}
