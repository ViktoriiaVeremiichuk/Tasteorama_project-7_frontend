"use client";

import { hatch } from "ldrs";

hatch.register();

export default function Loader() {
  return (
    <l-hatch
      size="80"
      stroke="8"
      speed="3.5"
      color="#9b6a43"
    ></l-hatch>
  );
}