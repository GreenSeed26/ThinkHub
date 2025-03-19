import { Canvas } from "fabric";
import React from "react";
interface LayeringProps {
  canvas: Canvas | null;
}

export default function Layering({ canvas }: LayeringProps) {
  const getObjectById = (id: string) => {
    return canvas?.getObjects().find((obj) => obj.get("id") === id);
  };
  return <div>Layering</div>;
}
