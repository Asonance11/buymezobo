import { generateMetadata } from "@/app/[username]/layout";
import { getCurrentUser } from "@/lib/authentication";
import React from "react";

export default async function Explore() {
  const profile = await getCurrentUser();
  return (
    <div className="md:min-h-screen md:w-full flex justify-center items-center">
      explore
    </div>
  );
}
