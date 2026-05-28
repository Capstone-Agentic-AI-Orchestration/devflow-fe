"use client";

import { Badge } from "@/shared/components/ui";
import { IconAlertTriangle, IconCheckCircle, IconCpu } from "@/shared/components/icons";
import type { DevFlowAgentProviderStatus } from "@/shared/api/devflow-api";

interface OrchestrationProviderStatusPanelProps {
  status: DevFlowAgentProviderStatus | null;
  loading?: boolean;
  error?: string;
  compact?: boolean;
}

export function OrchestrationProviderStatusPanel({
  status,
  loading = false,
  error = "",
  compact = false,
}: OrchestrationProviderStatusPanelProps) {
  const available = Boolean(status?.available);
  const tone = loading ? "gray" : error ? "red" : available ? "green" : "amber";
  const label = loading ? "Checking" : error ? "Unavailable" : available ? "Available" : "Blocked";
  const activeProvider = status?.providers.find((provider) => provider.active);

  return (
    <div
      style={{
        padding: compact ? 12 : 14,
        borderRadius: 10,
        border: `1px solid ${available ? "rgba(16,185,129,.24)" : "rgba(245,158,11,.26)"}`,
        background: available ? "rgba(16,185,129,.07)" : "rgba(245,158,11,.07)",
        display: "grid",
        gap: compact ? 10 : 12,
      }}
    >
      <div className="row" style={{ justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="row gap-2" style={{ alignItems: "flex-start", minWidth: 0 }}>
          <span style={{ color: available ? "#6EE7B7" : "#FBBF24", marginTop: 1 }}>
            {available ? <IconCheckCircle size={15} /> : <IconAlertTriangle size={15} />}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Agent provider</div>
            <div style={{ color: "var(--text-3)", fontSize: 12, marginTop: 3, overflowWrap: "anywhere" }}>
              {loading
                ? "Checking backend provider capability..."
                : error
                  ? error
                  : status?.reason || `${providerLabel(status?.activeMode)} is ready for orchestration.`}
            </div>
          </div>
        </div>
        <Badge tone={tone} style={undefined}>{label}</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        <ProviderMiniFact label="Requested" value={providerLabel(status?.requestedMode)} />
        <ProviderMiniFact label="Active" value={providerLabel(status?.activeMode)} />
        <ProviderMiniFact label="Fallback" value={status?.fallbackMode ? providerLabel(status.fallbackMode) : "None"} />
        <ProviderMiniFact label="Adapter" value={activeProvider?.implemented ? "Implemented" : activeProvider ? "Pending" : "Unknown"} />
      </div>

      {status?.missingRequirements?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {status.missingRequirements.map((requirement) => (
            <Badge key={requirement} tone="amber" style={undefined}>{requirement}</Badge>
          ))}
        </div>
      ) : null}

      {!compact && status?.providers?.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          {status.providers.map((provider) => (
            <div
              key={provider.mode}
              className="row"
              style={{
                justifyContent: "space-between",
                gap: 10,
                padding: "9px 0",
                borderTop: "1px solid rgba(148,163,184,.14)",
                alignItems: "flex-start",
              }}
            >
              <div className="row gap-2" style={{ minWidth: 0 }}>
                <IconCpu size={13} style={{ color: provider.active ? "#93C5FD" : "var(--text-3)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{provider.displayName}</div>
                  <div style={{ color: "var(--text-3)", fontSize: 11.5, marginTop: 2, overflowWrap: "anywhere" }}>
                    {provider.reason || (provider.available ? "Ready" : "Not available")}
                  </div>
                </div>
              </div>
              <Badge tone={provider.available ? "green" : "gray"} style={undefined}>{provider.active ? "Active" : provider.available ? "Ready" : "Off"}</Badge>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProviderMiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: "var(--text-3)", fontSize: 11 }}>{label}</div>
      <div className="mono" style={{ color: "white", fontSize: 12, fontWeight: 800, marginTop: 3, overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

function providerLabel(mode?: string | null) {
  if (!mode) return "Unknown";
  if (mode === "llm") return "LLM";
  if (mode === "mock") return "Mock";
  return mode;
}
