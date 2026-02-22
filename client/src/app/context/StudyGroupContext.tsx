// client/src/app/context/StudyGroupContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "./UserIDContext";

export interface StudyGroup {
  id: number;
  name: string;
  subject: string;
  description: string;
  members: number;
  maxMembers: number;
  meetingDay: string;
  meetingTime: string;
  building: string;
  floor: string;
  nextMeeting?: string;
  isOwner?: boolean;
}

interface StudyGroupContextType {
  groups: StudyGroup[];
  joinedGroupIds: Set<number>;
  addGroup: (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => Promise<void>;
  joinGroup: (groupId: number) => Promise<void>;
  leaveGroup: (groupId: number) => Promise<void>;
  deleteGroup: (groupId: number) => Promise<void>;
  isJoined: (groupId: number) => boolean;
  refreshGroups: () => Promise<void>;
}

const StudyGroupContext = createContext<StudyGroupContextType | undefined>(undefined);

export function StudyGroupProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<number>>(new Set());
  const API_BASE = (import.meta as any).env.API_BASE || "http://localhost:8000";

  const refreshGroups = async () => {
    // If we don't have a userId yet, don't attempt to fetch
    if (userId === undefined || userId === null) {
      setGroups([]);
      return;
    };

    try {
      const params = new URLSearchParams({
        user_id: userId.toString(),
        is_search: "true"
      });

      const response = await fetch(`${API_BASE}/items/groups/?${params.toString()}`, {
        method: "GET"
      });

      if (!response.ok) {
        // If backend returns 500 (NotImplemented), we catch it here to prevent UI crash
        const errData = await response.json().catch(() => ({ detail: "Server Error" }));
        console.warn("Backend fetch failed (likely NotImplementedError):", errData.detail);
        return;
      }

      const data = await response.json();

      // Mapping backend SQLite naming conventions to our Frontend interface
      const translatedGroups: StudyGroup[] = data.map((g: any) => ({
        id: g.eid,
        name: g.name || "Untitled Group",
        subject: g.course_code,
        description: g.description || "No description provided.",
        members: g.current_members || 1, // Fallback if count isn't in SQL yet
        maxMembers: g.max_members || 10,
        meetingDay: g.meeting_day,
        meetingTime: g.meeting_time,
        building: g.building,
        floor: g.room,
        nextMeeting: g.next_meeting,
        isOwner: g.organizer_id === userId // Check if current user owns the group
      }));

      setGroups(translatedGroups);

    } catch (error) {
      console.error("Error syncing with backend:", error);
    }
  };

  // Re-fetch groups automatically whenever the userId changes
  useEffect(() => {
    refreshGroups();
  }, [userId]);

  const addGroup = async (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => {
    try {
      const response = await fetch(`${API_BASE}/items/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: userId,
          name: group.name,
          course_code: group.subject,
          description: group.description,
          max_members: group.maxMembers,
          meeting_day: group.meetingDay,
          meeting_time: group.meetingTime,
          building: group.building,
          room: group.floor,
          next_meeting: `${group.meetingDay}, ${group.meetingTime}`,
        }),
      });

      if (!response.ok) throw new Error("Creation failed");
      await refreshGroups();
    } catch (e) {
      console.error(e);
    }
  };

  const joinGroup = async (groupId: number) => {
    try {
      const response = await fetch(`${API_BASE}/items/join/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, user_id: userId })
      });

      if (!response.ok) throw new Error('Failed to join');

      // Update local joined state
      setJoinedGroupIds(prev => new Set(prev).add(groupId));
      await refreshGroups();
    } catch (e) {
      console.error(e);
    }
  };

  const leaveGroup = async (groupId: number) => {
    try {
      const response = await fetch(`${API_BASE}/items/leave/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, user_id: userId })
      });

      if (!response.ok) throw new Error('Failed to leave');

      setJoinedGroupIds(prev => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      await refreshGroups();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteGroup = async (groupId: number) => {
    try {
      const response = await fetch(`${API_BASE}/items/delete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: groupId, user_id: userId })
      });

      if (!response.ok) throw new Error('Failed to delete');
      await refreshGroups();
    } catch (e) {
      console.error(e);
    }
  };

  const isJoined = (groupId: number) => joinedGroupIds.has(groupId);

  return (
    <StudyGroupContext.Provider
      value={{
        groups,
        joinedGroupIds,
        addGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        isJoined,
        refreshGroups
      }}
    >
      {children}
    </StudyGroupContext.Provider>
  );
}

export function useStudyGroups() {
  const context = useContext(StudyGroupContext);
  if (context === undefined) {
    throw new Error("useStudyGroups must be used within a StudyGroupProvider");
  }
  return context;
}