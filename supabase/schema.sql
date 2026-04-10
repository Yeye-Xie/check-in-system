-- 删除已有的表和策略（如果存在）
DROP TABLE IF EXISTS public.check_ins CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 用户表（手机号 + 密码）
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  phone       TEXT        UNIQUE NOT NULL,
  password    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 签到记录表
CREATE TABLE IF NOT EXISTS public.check_ins (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_check_in_at ON public.check_ins(check_in_at);

-- 开启 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- 用户表策略：公开注册和登录
CREATE POLICY "Allow public insert on users"
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on users"
  ON public.users FOR SELECT USING (true);

-- 签到表策略
CREATE POLICY "Allow public select on check_ins"
  ON public.check_ins FOR SELECT USING (true);

CREATE POLICY "Allow public insert on check_ins"
  ON public.check_ins FOR INSERT WITH CHECK (true);
