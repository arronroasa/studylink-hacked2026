// client/src/app/pages/Home.tsx
import { Link } from "react-router";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

export function Home() {
  const { groups, isJoined } = useStudyGroups();

  const myGroups = groups.filter((group) => isJoined(group.id));
  const recentGroups = myGroups.slice(0, 3);

  const stats = [
    { label: "Groups Joined", value: myGroups.length.toString(), color: "#16a34a" },
    { label: "Total Groups", value: groups.length.toString(), color: "#ca8a04" },
    { label: "Total Members", value: groups.reduce((sum, g) => sum + g.members, 0).toString(), color: "#16a34a" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
            Welcome to StudyLink
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Connect with students and join study groups to enhance your learning experience.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "28px 24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>{stat.label}</p>
              <p style={{ fontSize: "52px", fontWeight: "800", color: stat.color, lineHeight: "1" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* My Study Groups */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>My Study Groups</h2>
            <Link to="/search">
              <button
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: "1.5px solid #d1d5db",
                  backgroundColor: "transparent",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                Find Groups
              </button>
            </Link>
          </div>

          {recentGroups.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {recentGroups.map((group) => (
                <StudyGroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "48px 24px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                You haven't joined any study groups yet
              </p>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
                Explore available groups and start connecting with other students.
              </p>
              <Link to="/search">
                <button
                  style={{
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#ca8a04",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Find Groups
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Banner */}
        <div
          style={{
            backgroundColor: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            padding: "36px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#92400e", marginBottom: "8px" }}>
            Ready to Start Learning?
          </h2>
          <p style={{ fontSize: "14px", color: "#a16207", marginBottom: "24px" }}>
            Create a new study group or search for existing ones to join.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/create">
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ca8a04",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Create Study Group
              </button>
            </Link>
            <Link to="/search">
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1.5px solid #d97706",
                  backgroundColor: "transparent",
                  color: "#92400e",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Search Groups
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
