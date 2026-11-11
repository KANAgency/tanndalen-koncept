import uiHtml from "../ui.html";
import {
  bindConceptPageTextStyles,
  bindFoundationColorSwatches,
  bindFoundationContrastPairs,
  runFullSync,
  syncColorPaintStyles,
  updateFoundationSpecimens,
  type BindResult,
} from "./sync-engine";

figma.showUI(uiHtml, { width: 340, height: 420, themeColors: true });

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === "updateSpecimens") {
    try {
      const results = await updateFoundationSpecimens();
      postDone(results, "Specimens");
    } catch (e) {
      postError(e);
    }
    return;
  }

  if (msg.type === "syncColors") {
    try {
      const results = [
        ...(await syncColorPaintStyles()),
        ...(await bindFoundationColorSwatches()),
        ...(await bindFoundationContrastPairs()),
      ];
      postDone(results, "Färgstilar");
    } catch (e) {
      postError(e);
    }
    return;
  }

  if (msg.type === "bindConcept") {
    try {
      const results = await bindConceptPageTextStyles();
      postDone(results, "Concept-text");
    } catch (e) {
      postError(e);
    }
    return;
  }

  if (msg.type === "sync") {
    try {
      const { summary, results } = await runFullSync();
      postDone(results, "Synk");
    } catch (e) {
      postError(e);
    }
  }
};

function postDone(results: BindResult[], label: string) {
  const failed = results.filter((r) => !r.ok);
  const summary =
    failed.length === 0
      ? `${label}: ${results.length} ok.`
      : `${label}: ${results.length - failed.length} ok, ${failed.length} misslyckades.`;
  figma.ui.postMessage({ type: "done", results, summary });
  figma.notify(summary, failed.length ? { error: true } : undefined);
}

function postError(e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  figma.ui.postMessage({ type: "error", message });
  figma.notify(message, { error: true });
}
