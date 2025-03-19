"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Canvas, FabricImage } from "fabric";
import { ImageIcon } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
interface ImageButtonProps {
  canvas: Canvas | null;
  className?: string;
}
export default function ImageButton({ canvas, className }: ImageButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const url = e.target?.result;
      const imgElement = document.createElement("img");
      imgElement.src = url as string;
      imgElement.onload = () => {
        const imgWidth = imgElement.width;
        const imgHeight = imgElement.height;
        imgElement.width = imgWidth;
        imgElement.height = imgHeight;

        if (!canvas) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(
          canvasWidth / imgWidth,
          canvasHeight / imgHeight,
        );
        canvas.renderAll();

        if (!canvas) return;
        const image = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: scale / 2,
          scaleY: scale / 2,
        });
        canvas.add(image);
        canvas.centerObject(image);
      };
    };
  };
  return (
    <div className={cn(className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
        accept="image/*"
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon />
      </Button>
    </div>
  );
}
