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

export default function RegisterPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // 验证手机号
    if (phone.length !== 11) {
      setError("请输入11位手机号");
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    if (password.length < 6) {
      setError("密码至少6位");
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    if (password !== confirmPassword) {
      setError("两次密码不一致");
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    // 直接插入用户表
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({ phone, password })
      .select()
      .single();

    if (insertError) {
      if (insertError.message.includes("duplicate") || insertError.message.includes("唯一")) {
        setError("该手机号已注册");
      } else {
        setError("注册失败，请重试");
      }
      setLoading(false);
      const form = document.getElementById("auth-form");
      form?.classList.add("shake");
      setTimeout(() => form?.classList.remove("shake"), 300);
      return;
    }

    // 注册成功，保存登录状态到 localStorage
    localStorage.setItem("user_id", newUser.id);
    localStorage.setItem("user_phone", newUser.phone);
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/check-in");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">注册账号</CardTitle>
          <CardDescription className="text-center">
            输入手机号和密码注册
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={handleRegister} className="space-y-4">
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
                  placeholder="至少6位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>注册成功！</span>
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
                  注册中...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  注册成功
                </>
              ) : (
                "注册"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-text-secondary">已有账号？</span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium ml-1"
            >
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
