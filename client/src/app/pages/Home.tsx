// client/src/app/pages/Home.tsx
import { useState, useEffect } from "react";
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

export function Home() {
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [allGroupCount, setAllGroupCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError(false);
      try {
        // Joined groups: is_search = false
        const joinedRes = await fetch(`${API_BASE}/items/my_groups/`, {
          method: "POST",  // ← was GET
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: HARDCODED_USER_ID, is_search: false, course_code: null }),
        });
        if (!joinedRes.ok) throw new Error(`Joined groups failed: ${joinedRes.status}`);
        const joinedData = await joinedRes.json();
        setMyGroups(Array.isArray(joinedData) ? joinedData.map(mapApiGroup) : []);

        // All groups count: is_search = true
        const allRes = await fetch(`${API_BASE}/items/my_groups/`, {
          method: "POST",  // ← was GET
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: HARDCODED_USER_ID, is_search: true, course_code: null }),
        });
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllGroupCount(Array.isArray(allData) ? allData.length : null);
        }
      } catch (err) {
        console.error("API error:", err);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { label: "Groups Joined", value: loading ? "..." : myGroups.length.toString(), color: "#16a34a" },
    { label: "Total Groups", value: loading ? "..." : (allGroupCount ?? "—").toString(), color: "#ca8a04" },
    { label: "Total Members", value: "500K+", color: "#16a34a" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Welcome to StudyLink</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Connect with students and join study groups to enhance your learning experience.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
              <button style={{ padding: "7px 16px", borderRadius: "8px", border: "1.5px solid #d1d5db", backgroundColor: "transparent", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>
                Find Groups
              </button>
            </Link>
          </div>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {[1, 2, 3].map((i) => <div key={i} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", height: "180px", opacity: 0.4 }} />)}
            </div>
          )}

          {!loading && apiError && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "32px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", fontWeight: "600", color: "#991b1b", marginBottom: "6px" }}>Could not connect to server</p>
              <p style={{ fontSize: "13px", color: "#dc2626", marginBottom: "4px" }}>Endpoint: POST {API_BASE}/items/my_groups/</p>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>The backend endpoint needs to be implemented.</p>
            </div>
          )}

          {!loading && !apiError && myGroups.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {myGroups.map((group) => <StudyGroupCard key={group.id} group={group} />)}
            </div>
          )}

          {!loading && !apiError && myGroups.length === 0 && (
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "48px 24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>You haven't joined any study groups yet</p>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>Explore available groups and start connecting with other students.</p>
              <Link to="/search">
                <button style={{ padding: "10px 24px", borderRadius: "8px", border: "none", backgroundColor: "#ca8a04", color: "#ffffff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                  Find Groups
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: "#fefce8", border: "1px solid #fde68a", borderRadius: "12px", padding: "36px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#92400e", marginBottom: "8px" }}>Ready to Start Learning?</h2>
          <p style={{ fontSize: "14px", color: "#a16207", marginBottom: "24px" }}>Create a new study group or search for existing ones to join.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/create">
              <button style={{ padding: "10px 24px", borderRadius: "8px", border: "none", backgroundColor: "#ca8a04", color: "#ffffff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Create Study Group
              </button>
            </Link>
            <Link to="/search">
              <button style={{ padding: "10px 24px", borderRadius: "8px", border: "1.5px solid #d97706", backgroundColor: "transparent", color: "#92400e", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Search Groups
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}