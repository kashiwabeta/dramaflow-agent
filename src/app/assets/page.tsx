import {
  AppShell,
  AssetPlaceholder,
  Badge,
  PageHeader,
  Panel,
} from "@/components/workspace";
import mockProject from "@/data/mock-project.json";
import type { AiGenerationResult } from "@/types/project";

const data = mockProject as AiGenerationResult;

export default function AssetLibraryPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-5 px-5 py-5">
        <PageHeader
          title="资产库"
          description="独立管理可复用的角色资产、场景资产、道具资产和风格模板，不属于一键直出流程。"
        />

        <AssetSection title="角色资产" count={data.assetLibrary?.characters.length ?? 0}>
          {(data.assetLibrary?.characters ?? []).map((asset) => (
            <LibraryCard key={asset.id} title={asset.name} prompt={asset.prompt} />
          ))}
        </AssetSection>

        <AssetSection title="场景资产" count={data.assetLibrary?.scenes.length ?? 0}>
          {(data.assetLibrary?.scenes ?? []).map((asset) => (
            <LibraryCard key={asset.id} title={asset.name} prompt={asset.prompt} variant="slate" />
          ))}
        </AssetSection>

        <AssetSection title="道具资产" count={data.props?.length ?? 0}>
          {(data.props ?? []).map((asset) => (
            <LibraryCard
              key={asset.id}
              title={asset.name}
              prompt={asset.visualPrompt}
              variant="amber"
            />
          ))}
        </AssetSection>

        <AssetSection title="风格模板" count={data.styles?.length ?? 0}>
          {(data.styles ?? []).map((asset) => (
            <LibraryCard
              key={asset.id}
              title={asset.name}
              prompt={asset.visualPrompt}
              variant="green"
            />
          ))}
        </AssetSection>
      </div>
    </AppShell>
  );
}

function AssetSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="cn-title text-lg">{title}</h2>
        <Badge tone="neutral">{count} 个资产</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function LibraryCard({
  title,
  prompt,
  variant = "blue",
}: {
  title: string;
  prompt: string;
  variant?: "blue" | "green" | "amber" | "slate";
}) {
  return (
    <Panel className="p-4 transition hover:border-sky-200 hover:shadow-md">
      <AssetPlaceholder label={title} variant={variant} />
      <h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3>
      <p className="prompt-text prompt-box mt-2 rounded-lg p-3">
        {prompt}
      </p>
    </Panel>
  );
}
