// client/src/app/components/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Plus, Search, Home } from "lucide-react";

const GREEN = "#003C30";
const GOLD = "#FFB81C";
const GOLD_BG = "rgba(255, 184, 28, 0.12)";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/create", icon: Plus, label: "Create Study Group" },
  { to: "/search", icon: Search, label: "Search Study Groups" },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [hovered, setHovered] = useState(false);

  const bgColor = isActive ? GOLD : hovered ? GOLD_BG : "transparent";
  const textColor = isActive ? GREEN : hovered ? GOLD : "rgba(255,255,255,0.75)";
  const iconColor = isActive ? GREEN : hovered ? GOLD : "rgba(255,255,255,0.6)";

  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "11px 16px",
          borderRadius: "10px",
          backgroundColor: bgColor,
          color: textColor,
          fontWeight: isActive ? "700" : "500",
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          marginBottom: "4px",
        }}
      >
        <Icon
          style={{
            width: "18px",
            height: "18px",
            flexShrink: 0,
            color: iconColor,
          }}
        />
        <span>{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <div
      style={{
        width: "230px",
        minWidth: "230px",
        height: "100vh",
        backgroundColor: GREEN,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: GOLD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L12.5 7H17.5L13.5 10.5L15 15.5L10 12.5L5 15.5L6.5 10.5L2.5 7H7.5L10 2Z"
                fill="#003C30"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-0.3px",
            }}
          >
            StudyLink
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "20px 24px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        StudyLink © 2026
      </div>
    </div>
  );
}
