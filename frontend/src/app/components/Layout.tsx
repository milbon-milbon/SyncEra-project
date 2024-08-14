// components/Layout.tsx
import Sidebar from "./sidebar";

type LayoutProps = {
  children: React.ReactNode;
  header: React.ReactNode;
};

export default function Layout({ children, header }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {header}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
