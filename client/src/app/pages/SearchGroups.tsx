import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Search, Users, Calendar, BookOpen, Filter, MapPin } from "lucide-react";
import { useStudyGroups } from "../context/StudyGroupContext";

export function SearchGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, joinGroup, leaveGroup, isJoined } = useStudyGroups();

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Search Study Groups</h1>
          <p className="text-muted-foreground">
            Find the perfect study group that matches your learning goals.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                placeholder="Search by group name, subject, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found {filteredGroups.length} study group{filteredGroups.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="mb-4">
                <h3 className="mb-1">{group.name}</h3>
                <p className="text-sm mb-2" style={{ color: "#16a34a" }}>
                  {group.subject}
                </p>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {group.members} / {group.maxMembers} members
                  </span>
                  <div className="ml-auto">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(group.members / group.maxMembers) * 100}%`,
                          backgroundColor: "#16a34a",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{group.meetingDay}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{group.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{group.building}, {group.floor}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                style={{ backgroundColor: "#16a34a" }}
                disabled={group.members >= group.maxMembers}
                onClick={() => {
                  if (isJoined(group.id)) {
                    leaveGroup(group.id);
                  } else {
                    joinGroup(group.id);
                  }
                }}
              >
                {isJoined(group.id) ? "Leave Group" : (group.members >= group.maxMembers ? "Group Full" : "Join Group")}
              </Button>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No study groups found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or create a new study group.
            </p>
            <Button style={{ backgroundColor: "#ca8a04" }}>Create New Group</Button>
          </Card>
        )}
      </div>
    </div>
  );
}