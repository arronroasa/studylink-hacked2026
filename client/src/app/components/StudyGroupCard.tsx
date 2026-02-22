// client/src/app/components/StudyGroupCard.tsx
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Calendar, BookOpen, MapPin } from "lucide-react";
import { InfoRow } from "./InfoRow";
import { useStudyGroups } from "../context/StudyGroupContext";

interface StudyGroupCardProps {
    group: {
        id: string;
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
    };
}

export function StudyGroupCard({ group }: StudyGroupCardProps) {
    const { joinGroup, leaveGroup, isJoined } = useStudyGroups();

    // UofA colors
    const green = "#003C30"; // dark green background
    const gold = "#FFB81C"; // gold accent

    return (
        <Card
            className="p-6 hover:shadow-2xl transition-shadow"
            style={{
                backgroundColor: green,
                color: "#ffffff",
                border: `2px solid ${gold}`,
                borderRadius: "12px",
            }}
        >
            {/* Header */}
            <div className="mb-4">
                <h3 className="mb-1 text-xl font-bold" style={{ color: gold }}>
                    {group.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: "#ffffff" }}>
                    {group.subject}
                </p>
                {group.description && (
                    <p className="text-sm text-gray-200">{group.description}</p>
                )}
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 pb-4 border-b border-green-800">
                <InfoRow
                    icon={<Users className="h-4 w-4" style={{ color: gold }} />}
                    text={`${group.members} / ${group.maxMembers} members`}
                    rightContent={
                        <div className="w-20 h-2 bg-green-900 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${(group.members / group.maxMembers) * 100}%`,
                                    backgroundColor: gold,
                                }}
                            />
                        </div>
                    }
                />
                <InfoRow
                    icon={<Calendar className="h-4 w-4" style={{ color: gold }} />}
                    text={group.meetingDay}
                />
                <InfoRow
                    icon={<BookOpen className="h-4 w-4" style={{ color: gold }} />}
                    text={group.meetingTime}
                />
                <InfoRow
                    icon={<MapPin className="h-4 w-4" style={{ color: gold }} />}
                    text={`${group.building}, ${group.floor}`}
                />
            </div>

            {/* Action Button */}
            {isJoined(group.id) ? (
                <Button
                    className="w-full font-bold"
                    style={{ backgroundColor: gold, color: green }}
                    onClick={() => leaveGroup(group.id)}
                >
                    Leave Group
                </Button>
            ) : (
                <Button
                    className="w-full font-bold"
                    style={{
                        backgroundColor: group.members >= group.maxMembers ? "#555" : gold,
                        color: group.members >= group.maxMembers ? "#aaa" : green,
                    }}
                    disabled={group.members >= group.maxMembers}
                    onClick={() => joinGroup(group.id)}
                >
                    {group.members >= group.maxMembers ? "Group Full" : "Join Group"}
                </Button>
            )}
        </Card>
    );
}