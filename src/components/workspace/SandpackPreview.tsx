"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview as SandpackPreviewPane,
} from "@codesandbox/sandpack-react";
import type { BlueprintState } from "@/types/blueprint";

const GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2?family=";

function getFontUrl(font: string | undefined): string | null {
  if (!font) return null;
  const encoded = font.replace(/\s+/g, "+");
  return `${GOOGLE_FONTS_BASE}${encoded}:wght@300;400;500;600;700;800;900&display=swap`;
}

export default function SandpackPreview({
  blueprint,
}: {
  blueprint: BlueprintState;
}) {
  const rawCode =
    blueprint.code ||
    'export default function App() { return <div>No code generated</div>; }';

  // Ensure React is imported — Claude's generated code uses React.useState etc.
  const code = rawCode.match(/^import\s+React/m)
    ? rawCode
    : `import React from "react";\n${rawCode}`;

  const fontUrl = getFontUrl(blueprint.font);

  // Override App.tsx and add global styles for font/reset
  const files = useMemo(
    () => ({
      "/App.tsx": code,
      "/styles.css": {
        code: `body, html { margin: 0; padding: 0;${blueprint.font ? ` font-family: '${blueprint.font}', system-ui, sans-serif;` : ""} }`,
        hidden: true,
      },
    }),
    [code, blueprint.font]
  );

  // Build external resources list
  const externalResources = useMemo(() => {
    const resources: string[] = ["https://cdn.tailwindcss.com"];
    if (fontUrl) resources.push(fontUrl);
    return resources;
  }, [fontUrl]);

  return (
    <div
      className="sandpack-fill"
      style={{ height: "100%", width: "100%", overflow: "hidden" }}
    >
      <style>{`
        .sandpack-fill .sp-wrapper {
          height: 100% !important;
        }
        .sandpack-fill .sp-layout {
          height: 100% !important;
          border: none !important;
          border-radius: 0 !important;
        }
        .sandpack-fill .sp-stack {
          height: 100% !important;
        }
        .sandpack-fill .sp-preview-container {
          height: 100% !important;
        }
        .sandpack-fill .sp-preview-iframe {
          height: 100% !important;
        }
        .sandpack-fill .sp-preview-actions {
          display: none !important;
        }
      `}</style>
      <SandpackProvider
        template="react-ts"
        files={files}
        options={{
          externalResources,
        }}
        theme="dark"
      >
        <SandpackLayout>
          <SandpackPreviewPane
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
