import { AppShell, Badge, ButtonLink, Icon, Panel } from "@/components/workspace";

const entryCards = [
  {
    title: "一键直出",
    desc: "上传剧本或输入主题，按三步完成大纲、资产和分集视频生成。",
    icon: "bolt",
    href: "/one-click/new",
    action: "开始一键直出",
    primary: true,
  },
  {
    title: "资产库",
    desc: "管理可复用的角色、场景、道具和风格模板。",
    icon: "asset",
    href: "/assets",
    action: "打开资产库",
    primary: false,
  },
  {
    title: "最近项目",
    desc: "查看最近生成的短剧项目和分集视频状态。",
    icon: "script",
    href: "/one-click/project-demo/episodes",
    action: "查看最近项目",
    primary: false,
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10">
        <div className="mb-8">
          <Badge tone="dark">DramaFlow Agent</Badge>
          <h1 className="cn-title mt-4">
            AI 短剧 Agent 工作台
          </h1>
          <p className="body-copy mt-2 max-w-2xl">
            当前 MVP 聚焦一键直出主流程：剧本拆解、临时资产确认、分集视频生成。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {entryCards.map((card) => (
            <Panel
              key={card.title}
              className="flex min-h-64 flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon name={card.icon} />
                </div>
                <h2 className="cn-title mt-5 text-lg">
                  {card.title}
                </h2>
                <p className="body-copy mt-2">{card.desc}</p>
              </div>
              <ButtonLink href={card.href} variant={card.primary ? "primary" : "secondary"}>
                {card.action}
              </ButtonLink>
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
