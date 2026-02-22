// client/src/app/components/StudyGroupCard.tsx
import { Users, Calendar, MapPin, Trash2 } from "lucide-react";
import { useStudyGroups } from "../context/StudyGroupContext";

interface StudyGroupCardProps {
  group: {
    id: number;
    name: string;
    subject: string;
    description?: string;
    members: number;
    maxMembers: number;
    meetingDay: string;
    meetingTime: string;
    building: string;
    floor: string;
    nextMeeting?: string;
    isOwner?: boolean;
  };
}

export function StudyGroupCard({ group }: StudyGroupCardProps) {
  const { joinGroup, leaveGroup, isJoined, deleteGroup } = useStudyGroups();
  const joined = isJoined(group.id);
  const full = group.members >= group.maxMembers;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")}
    >
      {/* Header row: name + trash icon if owner */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: "700",
            color: "#111827",
            lineHeight: "1.3",
            flex: 1,
            marginRight: "8px",
          }}
        >
          {group.name}
        </h3>
        {group.isOwner && (
          <button
            onClick={() => deleteGroup(group.id)}
            title="Delete group"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#9ca3af";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Trash2 style={{ width: "16px", height: "16px" }} />
          </button>
        )}
      </div>

      {/* Subject tag + "Your group" badge */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: "600",
            color: "#16a34a",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "999px",
            padding: "2px 10px",
          }}
        >
          {group.subject}
        </span>
        {group.isOwner && (
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: "600",
              color: "#92400e",
              backgroundColor: "#fefce8",
              border: "1px solid #fde68a",
              borderRadius: "999px",
              padding: "2px 8px",
            }}
          >
            Your group
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Info rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "13px" }}>
          <Users style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          <span>{group.members} members</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "13px" }}>
          <Calendar style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          <span>{group.meetingDay ? `${group.meetingDay}, ${group.meetingTime}` : group.nextMeeting}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "13px" }}>
          <MapPin style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          <span>{group.building}{group.floor ? `, ${group.floor}` : ""}</span>
        </div>
      </div>

      {/* Action button */}
      {group.isOwner ? (
        <button
          onClick={() => deleteGroup(group.id)}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: "8px",
            border: "1.5px solid #fca5a5",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.borderColor = "#f87171";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
            e.currentTarget.style.borderColor = "#fca5a5";
          }}
        >
          Delete Group
        </button>
      ) : joined ? (
        <button
          onClick={() => leaveGroup(group.id)}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: "8px",
            border: "1.5px solid #d1d5db",
            backgroundColor: "transparent",
            color: "#374151",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Leave Group
        </button>
      ) : (
        <button
          onClick={() => !full && joinGroup(group.id)}
          disabled={full}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: "8px",
            border: "none",
            backgroundColor: full ? "#e5e7eb" : "#16a34a",
            color: full ? "#9ca3af" : "#ffffff",
            fontWeight: "600",
            fontSize: "14px",
            cursor: full ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!full) e.currentTarget.style.backgroundColor = "#15803d"; }}
          onMouseLeave={e => { if (!full) e.currentTarget.style.backgroundColor = "#16a34a"; }}
        >
          {full ? "Group Full" : "Join Group"}
        </button>
      )}
    </div>
  );
}
