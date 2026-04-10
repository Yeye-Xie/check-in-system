"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, CheckCircle, Loader2, Calendar } from "lucide-react";

interface CheckInRecord {
  id: string;
  user_id: string;
  check_in_at: string;
  created_at: string;
}

export default function CheckInPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // 检查登录状态
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedPhone = localStorage.getItem("user_phone");

    if (!storedUserId) {
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
    setUserPhone(storedPhone);
  }, [router]);

  // 更新实时时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取今日是否已签到
  useEffect(() => {
    if (!userId) return;

    const checkTodayStatus = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("check_ins")
        .select("id")
        .eq("user_id", userId)
        .gte("check_in_at", `${today}T00:00:00`)
        .lt("check_in_at", `${today}T23:59:59`)
        .limit(1);

      setHasCheckedInToday(!!(data && data.length > 0));
    };

    checkTodayStatus();
  }, [userId]);

  // 获取签到记录
  useEffect(() => {
    if (!userId) return;

    const fetchRecords = async () => {
      const { data } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", userId)
        .order("check_in_at", { ascending: false })
        .limit(20);

      if (data) {
        setRecords(data);
      }
    };

    fetchRecords();
  }, [userId]);

  // 签到
  const handleCheckIn = async () => {
    if (!userId) return;

    setCheckingIn(true);
    setSuccessMessage("");

    const { error } = await supabase
      .from("check_ins")
      .insert({ user_id: userId });

    if (error) {
      console.error("签到失败:", error);
      setCheckingIn(false);
      return;
    }

    setCheckingIn(false);
    setHasCheckedInToday(true);
    setSuccessMessage("签到成功！");
    setTimeout(() => setSuccessMessage(""), 2000);

    // 刷新记录
    const { data } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("check_in_at", { ascending: false })
      .limit(20);

    if (data) {
      setRecords(data);
    }
  };

  // 退出登录
  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_phone");
    router.push("/login");
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 格式化签到记录时间
  const formatCheckInTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* 顶部用户信息栏 */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {userPhone?.slice(0, 3) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {userPhone ? `${userPhone.slice(0, 3)}****${userPhone.slice(-4)}` : "用户"}
              </p>
              <p className="text-xs text-text-secondary">已登录</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-text-secondary hover:text-error"
          >
            <LogOut className="h-4 w-4 mr-1" />
            退出
          </Button>
        </div>

        {/* 日期和时间 */}
        <div className="text-center space-y-1">
          <p className="text-sm text-text-secondary">{formatDate(currentTime)}</p>
          <p className="text-4xl font-semibold text-text-primary tabular-nums">
            {formatTime(currentTime)}
          </p>
        </div>

        {/* 签到按钮 */}
        <Card className="border-2 border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Button
                variant={hasCheckedInToday ? "checked" : "unchecked"}
                size="xl"
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="relative overflow-hidden"
              >
                {checkingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    签到中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {hasCheckedInToday ? "已签到" : "立即签到"}
                  </>
                )}
              </Button>

              {successMessage && (
                <p className="text-success text-sm font-medium animate-in">
                  {successMessage}
                </p>
              )}

              <p className="text-sm text-text-secondary">
                {hasCheckedInToday ? "今日已签到，可继续签到" : "点击按钮完成签到"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 签到记录 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              签到记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>暂无签到记录</p>
                <p className="text-sm">点击上方按钮完成首次签到</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {records.map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border animate-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          第 {records.length - index} 次签到
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatCheckInTime(record.check_in_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
