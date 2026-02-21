import { Link, useLocation } from "react-router";
import { Plus, Search, Home } from "lucide-react";
/*import logo from "figma:asset/f1e6f5e1e29e585fcbdea5dc7358f8e73d85ccb7.png";*/

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      icon: Home,
      label: "Home",
    },
    {
      to: "/create",
      icon: Plus,
      label: "Create Study Group",
      primary: true,
    },
    {
      to: "/search",
      icon: Search,
      label: "Search Study Groups",
    },
  ];

  return (
    <div className="w-64 h-screen flex flex-col" style={{ backgroundColor: "var(--sidebar)" }}>
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <Link to="/" className="flex items-center justify-center">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            StudyLink
          </h1>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${item.primary
                ? "hover:brightness-110"
                : isActive
                  ? "hover:brightness-95"
                  : "hover:brightness-95"
                }`}
              style={{
                backgroundColor: item.primary
                  ? "var(--sidebar-primary)"
                  : isActive
                    ? "var(--sidebar-accent)"
                    : "transparent",
                color: item.primary || isActive
                  ? "var(--sidebar-foreground)"
                  : "var(--sidebar-foreground)",
              }}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <p className="text-sm text-center opacity-70" style={{ color: "var(--sidebar-foreground)" }}>
          StudyLink © 2026
        </p>
      </div>
    </div>
  );
}
