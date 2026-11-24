"use client";

import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";
import { SkillRadarData } from "@/types";

interface SkillRadarChartProps {
  data: SkillRadarData[];
  onSelectSkill?: (skillName: string) => void;
  height?: number;
}

export function SkillRadarChart({ data, onSelectSkill, height = 300 }: SkillRadarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#d1d5db" />
          <PolarAngleAxis
            dataKey="skill"
            tick={({ payload, x, y, textAnchor }) => (
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                fill="#1f2937"
                fontSize={12}
                fontWeight={500}
                className="cursor-pointer hover:fill-accent-600"
                onClick={() => onSelectSkill?.(payload.value)}
              >
                {payload.value}
              </text>
            )}
          />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10, fill: "#6b7280" }} />
          <Radar
            name="ระดับทักษะ"
            dataKey="level"
            stroke="#ca8a04"
            strokeWidth={2.5}
            fill="#eab308"
            fillOpacity={0.32}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#d1d5db",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            formatter={(value: any) => [`${value} / 5`, "ระดับทักษะ"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
