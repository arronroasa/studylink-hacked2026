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

  const refreshGroups = async () => {
    if (userId === undefined || userId === null) return;

    try {
      // 1. Create the query string
      const params = new URLSearchParams({
        user_id: userId.toString(),
        is_search: "true",
        course_code: "SEARCH_ALL" // Must be 6+ chars if your schema still requires it
      });

      // 2. Send a CLEAN GET request (No headers, no body)
      const response = await fetch(`http://localhost:8000/items/groups/?${params.toString()}`, {
        method: "GET"
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Validation Error Details:", errData.detail);
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      // ... your mapping logic (translatedGroups) ...
      const translatedGroups: StudyGroup[] = data.map((g: any) => ({
        id: g.eid,
        name: g.name || "Untitled Group",
        subject: g.course_code,
        // ... rest of mapping
      }));

      setGroups(translatedGroups);

    } catch (error) {
      console.error("Error syncing with backend:", error);
    }
  };

  useEffect(() => {
    refreshGroups();
  }, [userId]);

  const addGroup = async (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => {
    try {
      const response = await fetch('http://localhost:8000/items/create/', {
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
      const response = await fetch(`http://localhost:8000/items/join/`, {
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
      const response = await fetch(`http://localhost:8000/items/leave/`, {
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
      const response = await fetch(`http://localhost:8000/items/delete/`, {
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