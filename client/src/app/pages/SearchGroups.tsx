// client/src/app/pages/SearchGroups.tsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { StudyGroupCard } from "../components/StudyGroupCard";

const API_BASE = "http://localhost:8000";
const HARDCODED_USER_ID = 5;

function mapApiGroup(g: any) {
  return {
    id: g.id ?? g.owner_id,
    name: g.name ?? `${g.course_code} Study Group`,
    subject: g.course_code ?? "",
    description: g.description ?? "",
    members: g.members ?? 0,
    maxMembers: g.max_members ?? 20,
    meetingDay: g.meeting_day ?? "",
    meetingTime: g.meeting_time ?? "",
    building: g.location ?? g.building ?? "",
    floor: g.room ?? g.floor ?? "",
    nextMeeting: g.datetime ?? g.next_meeting ?? "",
    isOwner: g.owner_id === HARDCODED_USER_ID,
  };
}

export function SearchGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayGroups, setDisplayGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError(false);
      try {
        const res = await fetch(`${API_BASE}/items/my_groups/`, {
          method: "POST",  // ← was GET
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: HARDCODED_USER_ID,
            is_search: true,
            course_code: searchQuery.trim() || null,
          }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setDisplayGroups(Array.isArray(data) ? data.map(mapApiGroup) : []);
      } catch (err) {
        console.error("API error:", err);
        setApiError(true);
        setDisplayGroups([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Search Study Groups</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Find the perfect study group that matches your learning goals.</p>
        </div>

        {/* Search Bar */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by course code (e.g. CMPUT201, MATH146)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: "40px", paddingRight: "16px", paddingTop: "9px", paddingBottom: "9px", fontSize: "14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", outline: "none", color: "#111827", backgroundColor: "#f9fafb", boxSizing: "border-box" as const }}
            />
          </div>
        </div>

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            {loading ? "Searching..." : `Found ${displayGroups.length} study group${displayGroups.length !== 1 ? "s" : ""}`}
          </p>
          {apiError && (
            <span style={{ fontSize: "12px", color: "#991b1b", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "999px", padding: "2px 10px" }}>
              Could not reach server
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", height: "200px", opacity: 0.4 }} />
            ))}
          </div>
        )}

        {/* Groups */}
        {!loading && displayGroups.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {displayGroups.map((group) => <StudyGroupCard key={group.id} group={group} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && displayGroups.length === 0 && !apiError && (
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "64px 24px", textAlign: "center" }}>
            <Search style={{ width: "40px", height: "40px", color: "#d1d5db", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>No study groups found</p>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>Try a different course code or create a new group.</p>
            <Link to="/create">
              <button style={{ padding: "10px 24px", borderRadius: "8px", border: "none", backgroundColor: "#ca8a04", color: "#ffffff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Create New Group
              </button>
            </Link>
          </div>
        )}

        {/* Server error */}
        {!loading && apiError && (
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#991b1b", marginBottom: "8px" }}>Could not connect to server</p>
            <p style={{ fontSize: "14px", color: "#dc2626", marginBottom: "6px" }}>Endpoint: POST {API_BASE}/items/my_groups/</p>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>The backend endpoint needs to be implemented before this will work.</p>
          </div>
        )}

      </div>
    </div>
  );
}