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
    if (userId === undefined || userId === null) {
      setGroups([]);
      setJoinedGroupIds(new Set());
      return;
    }

    try {
      // 1. Fetch ALL groups (The Search results)
      const params = new URLSearchParams({
        user_id: userId.toString(),
        is_search: "true"
      });

      const response = await fetch(`${API_BASE}/items/groups/?${params.toString()}`, {
        method: "GET"
      });

      if (!response.ok) return;
      const data = await response.json();

      // 2. Extract joined status
      // If your backend SQL already includes "has_joined", we build the Set here
      const newJoinedIds = new Set<number>();

      const translatedGroups: StudyGroup[] = data.map((g: any) => {
        // If the backend says the user is in this group, add it to our Set
        if (g.has_joined === 1 || g.has_joined === true) {
          newJoinedIds.add(g.group_id);
        }

        return {
          id: g.group_id,
          name: g.name || "Untitled Group",
          subject: g.course_code,
          description: g.description || "No description provided.",
          members: g.current_members || 1,
          maxMembers: g.max_members || 10,
          meetingDay: g.meeting_day,
          meetingTime: g.meeting_time,
          building: g.building,
          floor: g.room,
          nextMeeting: g.next_meeting,
          isOwner: g.organizer_id === userId
        };
      });

      // 3. Update both states. 
      // This will trigger isJoined() to return true for the correct cards.
      setGroups(translatedGroups);
      setJoinedGroupIds(newJoinedIds);

    } catch (error) {
      console.error("Error syncing with backend:", error);
    }
  };

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