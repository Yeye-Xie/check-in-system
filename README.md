# 签到系统

基于 Monorepo + pnpm + Turborepo + Next.js + Supabase 的签到系统。

## 技术栈

- **架构**: Monorepo (pnpm workspaces + Turborepo)
- **前端**: Next.js 15 (App Router), React 19, TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **后端**: Supabase (Auth + PostgreSQL)
- **部署**: GitHub + Vercel

## 项目结构

```
check-in-system/
├── apps/
│   └── web/                 # Next.js 主应用
│       ├── src/
│       │   ├── app/        # App Router 页面
│       │   │   ├── (auth)/ # 登录/注册
│       │   │   ├── (dashboard)/ # 签到页面
│       │   │   └── page.tsx
│       │   ├── components/ # 组件
│       │   │   └── ui/     # shadcn 组件
│       │   └── lib/        # 工具函数
│       │       └── supabase/
│       └── ...
├── supabase/
│   └── schema.sql          # 数据库 Schema
├── package.json            # 根目录
├── pnpm-workspace.yaml
└── turbo.json
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建项目
2. 获取 Project URL 和 anon key
3. 在 `apps/web/.env.local` 中配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 创建数据库表

在 Supabase Dashboard → SQL Editor 中执行 `supabase/schema.sql`。

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 功能

- [x] 用户注册
- [x] 用户登录
- [x] 登录状态保持
- [x] 签到（不限次数）
- [x] 签到状态显示（黄/蓝按钮）
- [x] 签到记录列表
- [x] 实时时间显示
- [x] 退出登录

## 部署到 Vercel

1. Push 代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## 设计风格

米白系配色，简约温暖风格：

- 背景: `#FAF5EF`
- 卡片: `#FFF8F0`
- 主色: `#C4A77D`
- 未签到按钮: `#F5C842` (黄色)
- 已签到按钮: `#4A90D9` (蓝色)
