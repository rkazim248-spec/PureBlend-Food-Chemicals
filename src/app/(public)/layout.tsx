// Public route group layout.
// Stitch-exported pages render their own header/footer; add PublicLayout
// explicitly in pages that still use the React component shell.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
