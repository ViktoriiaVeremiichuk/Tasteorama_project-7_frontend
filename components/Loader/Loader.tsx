"use client";

import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    import("ldrs").then(({ hatch }) => {
      hatch.register();
    });
  }, []);

  return <l-hatch size="80" color="#9b6a43"></l-hatch>;
}
