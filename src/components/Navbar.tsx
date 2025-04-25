import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

const Navbar = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    navigate("/");
  };

  // Don't show navbar on auth page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-dark border-b border-border p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="text-2xl font-bold font-poppins text-primaryAccent"
          >
            MovieVerse
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className={`nav-link ${
              location.pathname === "/dashboard" ? "text-primaryAccent" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/watchlist"
            className={`nav-link ${
              location.pathname === "/watchlist" ? "text-primaryAccent" : ""
            }`}
          >
            Watchlist
          </Link>
          <Link
            to="/liked"
            className={`nav-link ${
              location.pathname === "/liked" ? "text-primaryAccent" : ""
            }`}
          >
            Liked
          </Link>
          <Link
            to="/directors"
            className={`nav-link ${
              location.pathname === "/directors" ? "text-primaryAccent" : ""
            }`}
          >
            Top Directors
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-foreground hover:text-destructive"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
