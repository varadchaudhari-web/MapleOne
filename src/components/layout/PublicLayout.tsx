import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import AuthModal from "@/components/features/AuthModal";

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <PublicFooter />}
      <AuthModal />
    </div>
  );
}
