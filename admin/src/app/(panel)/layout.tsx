import { PanelChrome } from "@/components/layout/PanelChrome";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelChrome>{children}</PanelChrome>;
}
