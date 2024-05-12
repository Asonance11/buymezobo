import { CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <div className="md:min-h-screen md:w-full flex justify-center items-center">
      <CircularProgress
        color="error"
        className="md:min-w-[200px] md:min-h-[200px] w-1/2 h-1/2 mx-auto block"
      />
    </div>
  );
}

export default Loading;
