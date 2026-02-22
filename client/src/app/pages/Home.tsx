// client/src/app/pages/Home.tsx
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

export function Home() {
  const { groups, isJoined } = useStudyGroups();

  // Filter groups the user has joined
  const myGroups = groups.filter(group => isJoined(group.id));
  const recentGroups = myGroups.slice(0, 3); // limit to 3 most recent

  const stats = [
    { label: "Active Groups", value: "24", icon: Users, color: "#16a34a" },
    { label: "Upcoming Sessions", value: "8", icon: Calendar, color: "#ca8a04" },
    { label: "Total Members", value: "156", icon: BookOpen, color: "#16a34a" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Welcome to StudyLink</h1>
          <p className="text-muted-foreground">
            Connect with students and join study groups to enhance your learning experience.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}15` }}>
                    <Icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Study Groups */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2>Recent Study Groups</h2>
            <Link to="/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#FFFAE0] p-4 rounded-lg">
            {recentGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 text-center" style={{ backgroundColor: "#fef3c7" }}>
          <h2 className="mb-2">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-6">
            Create a new study group or search for existing ones to join.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/create">
              <Button style={{ backgroundColor: "#ca8a04" }}>Create Study Group</Button>
            </Link>
            <Link to="/search">
              <Button variant="outline">Search Groups</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}