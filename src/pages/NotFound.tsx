import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="w-24 h-24 gradient-maple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-primary">
          <span className="text-white font-bold text-4xl">M1</span>
        </div>
        <h1 className="text-8xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</h1>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back to MapleOne.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2 px-6 py-3">
            <Home size={18} />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border hover:border-primary transition-colors font-semibold text-sm">
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
