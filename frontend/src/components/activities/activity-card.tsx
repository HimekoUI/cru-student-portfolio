"use client";

import React from "react";
import { Activity, ACTIVITY_CATEGORIES, BADGE_VARIANTS } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  isEnrolled?: boolean;
  onSelect?: (activity: Activity) => void;
  onEnroll?: (activity: Activity) => void;
}

export function ActivityCard({ activity, isEnrolled, onSelect, onEnroll }: ActivityCardProps) {
  const statusInfo = BADGE_VARIANTS[activity.status];
  const categoryInfo = ACTIVITY_CATEGORIES[activity.category];
  const isFull = activity.currentParticipants >= activity.maxParticipants;

  return (
    <Card hover className="flex flex-col justify-between overflow-hidden">
      <div>
        <div className="h-2 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />
        <CardHeader>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Badge variant="secondary">{categoryInfo.label}</Badge>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
          <CardTitle className="line-clamp-2 text-base">{activity.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>

          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <span>{formatDateShort(activity.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <span className="truncate">{activity.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {activity.skills.map((sk) => (
              <Badge key={sk.id} variant="outline" className="text-[11px] bg-primary-50/50 border-primary-200 text-primary-700">
                {sk.name}
              </Badge>
            ))}
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> ผู้สมัคร
              </span>
              <span className="font-medium text-foreground">
                {activity.currentParticipants} / {activity.maxParticipants} คน
              </span>
            </div>
            <Progress
              value={activity.currentParticipants}
              max={activity.maxParticipants}
              size="sm"
              variant={isFull ? "warning" : "primary"}
            />
          </div>
        </CardContent>
      </div>

      <CardFooter className="gap-2 border-t border-border pt-3 bg-muted/20">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSelect?.(activity)}>
          ดูรายละเอียด
        </Button>
        {isEnrolled ? (
          <Button variant="secondary" size="sm" className="flex-1" disabled>
            <CheckCircle2 className="h-4 w-4 text-success" />
            สมัครแล้ว
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            disabled={activity.status !== "open" || isFull}
            onClick={() => onEnroll?.(activity)}
          >
            {isFull ? "เต็มแล้ว" : activity.status === "open" ? "สมัครเข้าร่วม" : "ปิดรับสมัคร"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
