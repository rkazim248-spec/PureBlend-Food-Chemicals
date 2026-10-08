import { readFileSync } from "fs";
import path from "path";

/**
 * Renders a Stitch-exported static HTML page exactly as provided.
 * The Tailwind utility classes in those files are provided via the
 * shared design tokens in globals.css.
 */
export function StitchPage({ designPath }: { designPath: string }) {
  const filePath = path.join(process.cwd(), "PureBlend Food Chemicals UI", designPath, "code.html");
  const html = readFileSync(filePath, "utf-8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
