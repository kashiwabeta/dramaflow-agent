"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "script":
      return (
        <svg {...common}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h5" />
          <path d="M10 12h6" />
          <path d="M10 16h5" />
        </svg>
      );
    case "asset":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M6 7v13h12V7" />
          <path d="m9 7 1-3h4l1 3" />
          <path d="M9 12h6" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="m6 7 1 14h10l1-14" />
          <path d="m9 7 1-4h4l1 4" />
        </svg>
      );
    case "sync":
      return (
        <svg {...common}>
          <path d="M20 7h-5a5 5 0 0 0-8.2-2" />
          <path d="m17 4 3 3-3 3" />
          <path d="M4 17h5a5 5 0 0 0 8.2 2" />
          <path d="m7 20-3-3 3-3" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 10-13h-7z" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 16v4h14v-4" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="m8 15 3-3 2 2 3-4 3 5" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
  }
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`paper-card rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "dark" | "red";
}) {
  const tones = {
    neutral: "bg-[#efe7d8] text-[#6c746f] ring-[#d8cdbc]",
    blue: "bg-[#dfe8ea] text-[#25545c] ring-[#bdd0d4]",
    green: "bg-[#e2eadf] text-[#496f5f] ring-[#c7d8cd]",
    amber: "bg-[#f6e4d3] text-[#b3664d] ring-[#edc4ae]",
    red: "bg-[#f6ded7] text-[#a45348] ring-[#ebbdb3]",
    dark: "bg-[#184b52] text-[#fff7ea] ring-[#184b52]",
  };

  return (
    <span className={`echo-label rounded-md px-2 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
        variant === "primary"
          ? "echo-primary-btn text-white"
          : "echo-secondary-btn"
      }`}
    >
      {children} <span className="ml-2">→</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { label: "首页", icon: "home", href: "/" },
    { label: "一键直出", icon: "bolt", href: "/one-click/new" },
    { label: "资产库", icon: "asset", href: "/assets" },
    { label: "回收站", icon: "trash", href: "/" },
    { label: "同步", icon: "sync", href: "/" },
  ];

  return (
    <main className="echo-page min-h-screen text-[#173f47]">
      <div className="flex min-h-screen">
        <nav className="hidden w-[88px] shrink-0 border-r border-[#28545b]/25 bg-[#d4e1e7]/70 px-3 py-5 lg:flex lg:flex-col lg:items-center">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#f28c6a] bg-[#fff7ea] text-sm font-bold tracking-[0.18em] text-[#184b52] shadow-sm"
          >
            DF
          </Link>
          <div className="mt-8 flex flex-1 flex-col items-center gap-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative flex w-full flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] font-semibold transition ${
                    active
                      ? "bg-[#fff7ea] text-[#184b52] shadow-sm"
                      : "text-[#5f7880] hover:bg-[#fff7ea]/60 hover:text-[#184b52]"
                  }`}
                >
                  {active ? (
                    <span className="absolute left-0 top-3 h-8 w-0.5 rounded-full bg-[#f28c6a]" />
                  ) : null}
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}

export function StepBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { zh: "剧本大纲", en: "SCRIPT OUTLINE" },
    { zh: "角色与场景", en: "CHARACTER / SCENE" },
    { zh: "分集视频", en: "EPISODE PLAN" },
  ];
  return (
    <div className="paper-card rounded-lg border bg-white px-4 py-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => {
        const active = index + 1 <= current;
        return (
          <div
            key={step.en}
            className={`relative flex items-center gap-3 rounded-md px-2 py-2 ${
              active ? "text-[#184b52]" : "text-[#80949a]"
            }`}
          >
            <span
              className={`font-mono text-xl font-semibold tracking-[0.12em] ${
                active ? "text-[#f28c6a]" : "text-[#afbabd]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="section-kicker block text-[10px]">{step.en}</span>
              <span className="meta-text block normal-case tracking-normal">{step.zh}</span>
            </span>
            {index < steps.length - 1 ? (
              <span className="absolute right-3 top-1/2 hidden h-px w-10 bg-[#184b52]/35 md:block" />
            ) : null}
          </div>
        );
      })}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  currentStep,
  action,
}: {
  title: string;
  description: string;
  currentStep?: 1 | 2 | 3;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="section-kicker">DRAMAFLOW AGENT</p>
            <h1 className="cn-title mt-3">
              {title}
            </h1>
            <p className="body-copy mt-2 max-w-3xl">
              {description}
            </p>
          </div>
          {action}
        </div>
      </Panel>
      {currentStep ? <StepBar current={currentStep} /> : null}
    </div>
  );
}

export function AssetPlaceholder({
  label,
  variant = "blue",
}: {
  label: string;
  variant?: "blue" | "green" | "amber" | "slate";
}) {
  const colors = {
    blue: "from-[#173f47] via-[#6e94a4] to-[#e6b79f]",
    green: "from-[#173f47] via-[#6f8f7d] to-[#e8d8b9]",
    amber: "from-[#184b52] via-[#b98264] to-[#f3d0b6]",
    slate: "from-[#173f47] via-[#78919a] to-[#cdd9dc]",
  };
  return (
    <div className={`flex aspect-[4/3] items-center justify-center rounded-md border border-[#fff7ea] bg-gradient-to-br ${colors[variant]} p-4 text-center text-sm font-semibold text-[#fff7ea] shadow-sm`}>
      {label}
    </div>
  );
}

export function DraftStatus({
  saveStatus,
  onReset,
}: {
  saveStatus: "idle" | "saving" | "saved";
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Badge tone={saveStatus === "saving" ? "blue" : "green"}>
        {saveStatus === "saving" ? "正在保存..." : "本地草稿已保存"}
      </Badge>
      <button type="button" onClick={onReset} className="tool-btn">
        重置项目
      </button>
    </div>
  );
}
