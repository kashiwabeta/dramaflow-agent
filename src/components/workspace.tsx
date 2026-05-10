import Link from "next/link";

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
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
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
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    dark: "bg-slate-950 text-white ring-slate-950",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
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
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "首页", icon: "home", href: "/" },
    { label: "一键直出", icon: "bolt", href: "/one-click/new" },
    { label: "资产库", icon: "asset", href: "/assets" },
    { label: "回收站", icon: "trash", href: "/" },
    { label: "同步", icon: "sync", href: "/" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <nav className="hidden w-[88px] shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:flex lg:flex-col lg:items-center">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
          >
            DF
          </Link>
          <div className="mt-8 flex flex-1 flex-col items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex w-full flex-col items-center gap-1 rounded-lg px-2 py-3 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}

export function StepBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["剧本大纲", "角色与场景", "分集视频"];
  return (
    <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-3">
      {steps.map((step, index) => {
        const active = index + 1 <= current;
        return (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-md px-3 py-2 ${
              active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-500"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                active ? "bg-white text-slate-950" : "bg-white text-slate-400 ring-1 ring-slate-200"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-sm font-semibold">{step}</span>
          </div>
        );
      })}
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
            <Badge tone="dark">DramaFlow Agent</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
              {title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
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
    blue: "from-slate-900 via-slate-600 to-sky-500",
    green: "from-slate-900 via-emerald-800 to-emerald-400",
    amber: "from-slate-900 via-amber-800 to-amber-400",
    slate: "from-slate-950 via-slate-700 to-slate-400",
  };
  return (
    <div className={`flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br ${colors[variant]} text-sm font-semibold text-white`}>
      {label}
    </div>
  );
}
