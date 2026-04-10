"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查 localStorage 中的登录状态
    const userId = localStorage.getItem("user_id");

    if (userId) {
      router.push("/check-in");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-text-secondary">加载中...</div>
    </div>
  );
}
