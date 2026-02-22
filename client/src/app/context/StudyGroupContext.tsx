import { createContext, useContext, useState, ReactNode } from "react";
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
  addGroup: (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => void;
  joinGroup: (groupId: number) => void;
  leaveGroup: (groupId: number) => void;
  deleteGroup: (groupId: number) => void;
  isJoined: (groupId: number) => boolean;
}

const StudyGroupContext = createContext<StudyGroupContextType | undefined>(undefined);

const initialGroups: StudyGroup[] = [
  {
    id: 1,
    name: "Advanced Calculus Study Group",
    subject: "MATH146",
    description: "Focus on derivatives, integrals, and applications of calculus in real-world scenarios.",
    members: 12,
    maxMembers: 15,
    meetingDay: "Tuesday",
    meetingTime: "3:00 PM",
    building: "CCIS",
    floor: "4th Floor",
    nextMeeting: "Tomorrow, 3:00 PM",
  },
  {
    id: 2,
    name: "Web Development Bootcamp",
    subject: "CMPUT201",
    description: "Learn React, Node.js, and modern web development practices together.",
    members: 8,
    maxMembers: 10,
    meetingDay: "Monday & Thursday",
    meetingTime: "6:00 PM",
    building: "Cameron Library",
    floor: "2nd Floor",
    nextMeeting: "Today, 6:00 PM",
  },
  {
    id: 3,
    name: "Organic Chemistry Review",
    subject: "CHEM101",
    description: "Review organic chemistry concepts, reactions, and problem-solving strategies.",
    members: 15,
    maxMembers: 20,
    meetingDay: "Wednesday",
    meetingTime: "2:00 PM",
    building: "Chem Building",
    floor: "3rd Floor",
    nextMeeting: "Wed, 2:00 PM",
  },
  {
    id: 4,
    name: "Data Structures & Algorithms",
    subject: "CMPUT175",
    description: "Master DSA concepts for interviews and competitive programming.",
    members: 10,
    maxMembers: 12,
    meetingDay: "Friday",
    meetingTime: "4:00 PM",
    building: "Athabasca Hall",
    floor: "1st Floor",
    nextMeeting: "Fri, 4:00 PM",
  },
  {
    id: 5,
    name: "Physics Lab Prep",
    subject: "PHYS144",
    description: "Prepare for physics lab experiments and understand theoretical concepts.",
    members: 7,
    maxMembers: 15,
    meetingDay: "Thursday",
    meetingTime: "5:00 PM",
    building: "CCIS",
    floor: "2nd Floor",
    nextMeeting: "Thu, 5:00 PM",
  },
  {
    id: 6,
    name: "Spanish Language Exchange",
    subject: "AUSPA101",
    description: "Practice speaking Spanish and learn about Hispanic culture.",
    members: 14,
    maxMembers: 20,
    meetingDay: "Saturday",
    meetingTime: "10:00 AM",
    building: "Humanities Centre",
    floor: "5th Floor",
    nextMeeting: "Sat, 10:00 AM",
  },
];

export function StudyGroupProvider({ children }: { children: ReactNode }) {
  const {userId} = useUser();
  const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<number>>(new Set());

  const addGroup = async (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => {
    const response = await fetch('http://localhost:8000/items/create/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourToken}` // Uncomment if your API requires a token
        },
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optional: AWAIT newly created group data sent back from server
      // const createdGroup = await response.json()

    const newGroup: StudyGroup = {
      ...group,
      id: Math.max(...groups.map((g) => g.id), 0) + 1,
      members: 1,
      isOwner: true,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setJoinedGroupIds((prev) => new Set([...prev, newGroup.id]));
  };

  const joinGroup = async (groupId: number) => {
    const response = await fetch(`http://localhost:8000/items/join/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'group_id': groupId,
        'user_id': userId,
      })
      // If your backend needs to know WHO is joining, add it to the body:
      // body: JSON.stringify({ userId: currentUserId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to join group');
    }

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId && group.members < group.maxMembers
          ? { ...group, members: group.members + 1 }
          : group
      )
    );
    setJoinedGroupIds((prev) => new Set([...prev, groupId]));
  };

  const leaveGroup = async (groupId: number) => {
    const response = await fetch(`http://localhost:8000/items/leave/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'group_id': groupId,
        'user_id': userId,
      })
      // If your backend needs to know WHO is joining, add it to the body:
      // body: JSON.stringify({ userId: currentUserId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to join group');
    }

    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId && group.members > 0
          ? { ...group, members: group.members - 1 }
          : group
      )
    );
    setJoinedGroupIds((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  const deleteGroup = async (groupId: number) => {
    const response = await fetch(`http://localhost:8000/items/delete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'group_id': groupId,
        'user_id': userId,
      })
      // If your backend needs to know WHO is joining, add it to the body:
      // body: JSON.stringify({ userId: currentUserId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to join group');
    }

    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setJoinedGroupIds((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  const isJoined = (groupId: number) => joinedGroupIds.has(groupId);

  return (
    <StudyGroupContext.Provider
      value={{ groups, joinedGroupIds, addGroup, joinGroup, leaveGroup, deleteGroup, isJoined }}
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
