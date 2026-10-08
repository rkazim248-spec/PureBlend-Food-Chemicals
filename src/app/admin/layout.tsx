// Admin route group layout now renders Stitch pages directly.
// Each Stitch admin page embeds its own sidebar, topbar, and guard UI.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
