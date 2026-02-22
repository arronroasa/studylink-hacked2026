// client/src/app/pages/SearchGroups.tsx
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

export function SearchGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, isJoined } = useStudyGroups();

  const filteredGroups = groups
    .filter(group => !isJoined(group.id))
    .filter(
      (group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFFAE0] p-4 rounded-lg">
          {filteredGroups.map((group) => (
            <StudyGroupCard key={group.id} group={group} />
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