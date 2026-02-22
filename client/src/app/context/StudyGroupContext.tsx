import { createContext, useContext, useState, ReactNode } from "react";

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
    subject: "Mathematics",
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
    subject: "Computer Science",
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
    subject: "Chemistry",
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
    subject: "Computer Science",
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
    subject: "Physics",
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
    subject: "Languages",
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
  const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<number>>(new Set());

  const addGroup = (group: Omit<StudyGroup, "id" | "members" | "isOwner">) => {
    const newGroup: StudyGroup = {
      ...group,
      id: Math.max(...groups.map((g) => g.id), 0) + 1,
      members: 1,
      isOwner: true,
    };
    setGroups((prev) => [newGroup, ...prev]);
    setJoinedGroupIds((prev) => new Set([...prev, newGroup.id]));
  };

  const joinGroup = (groupId: number) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId && group.members < group.maxMembers
          ? { ...group, members: group.members + 1 }
          : group
      )
    );
    setJoinedGroupIds((prev) => new Set([...prev, groupId]));
  };

  const leaveGroup = (groupId: number) => {
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

  const deleteGroup = (groupId: number) => {
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
