// client/src/app/pages/SearchGroups.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

export function SearchGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, isJoined } = useStudyGroups();

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
            Search Study Groups
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Find the perfect study group that matches your learning goals.
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search by group name, subject, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "40px",
                paddingRight: "16px",
                paddingTop: "9px",
                paddingBottom: "9px",
                fontSize: "14px",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                outline: "none",
                color: "#111827",
                backgroundColor: "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Results Count */}
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
          Found {filteredGroups.length} study group{filteredGroups.length !== 1 ? "s" : ""}
        </p>

        {/* Study Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {filteredGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "64px 24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Search style={{ width: "40px", height: "40px", color: "#d1d5db", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
              No study groups found
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
              Try adjusting your search or create a new group.
            </p>
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
                Create New Group
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
