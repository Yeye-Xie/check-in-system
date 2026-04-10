"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // 从数据库查询用户
    const { data, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (queryError || !data) {
      setError("该手机号未注册");
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    // 验证密码
    if (data.password !== password) {
      setError("密码错误");
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    // 登录成功，保存状态
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("user_phone", data.phone);
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/check-in");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">欢迎回来</CardTitle>
          <CardDescription className="text-center">
            输入手机号和密码登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="13812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="pl-10"
                  maxLength={11}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm animate-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm animate-in">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>登录成功！正在跳转...</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  登录成功
                </>
              ) : (
                "登录"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-text-secondary">还没有账号？</span>
            <Link
              href="/register"
              className="text-primary hover:underline font-medium ml-1"
            >
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
