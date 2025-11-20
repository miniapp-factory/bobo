"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COLORS = ["red", "green", "blue", "yellow"] as const;
type Color = typeof COLORS[number];

interface Circle {
  id: number;
  color: Color;
}

export function ColorMatchTap() {
  const [target, setTarget] = useState<Color>(COLORS[0]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    setTarget(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, [level]);

  useEffect(() => {
    const spawn = () => {
      const newCircle: Circle = {
        id: idRef.current++,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      setCircles((prev) => [...prev, newCircle]);
    };
    spawn();
    const speed = Math.max(500, 1500 - level * 100);
    intervalRef.current = setInterval(spawn, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [level]);

  const handleClick = (id: number) => {
    const circle = circles.find((c) => c.id === id);
    if (!circle) return;
    if (circle.color === target) {
      setScore((s) => s + 1);
    } else {
      setScore((s) => Math.max(0, s - 1));
    }
    setCircles((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel((l) => l + 1);
    }
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-2xl font-bold">Color Match Tap</div>
      <div className="flex gap-4">
        <span className="text-xl">
          Target: <span className={cn(`text-${target}-500`)}>{target}</span>
        </span>
        <span className="text-xl">Score: {score}</span>
        <span className="text-xl">Level: {level}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {circles.map((c) => (
          <Button
            key={c.id}
            variant="outline"
            className={cn(`bg-${c.color}-500`, "w-12 h-12")}
            onClick={() => handleClick(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
