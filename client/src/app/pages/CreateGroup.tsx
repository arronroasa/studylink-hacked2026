// client/src/app/pages/CreateGroup.tsx
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, BookOpen, Clock, MapPin } from "lucide-react";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

export function CreateGroup() {
  const navigate = useNavigate();
  const { addGroup } = useStudyGroups();
  const [formData, setFormData] = useState({
    groupName: "",
    subject: "",
    description: "",
    maxMembers: "",
    meetingDay: "",
    meetingTime: "",
    building: "",
    floor: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup({
      name: formData.groupName,
      subject: formData.subject,
      description: formData.description,
      maxMembers: parseInt(formData.maxMembers),
      members: 0,
      meetingDay: formData.meetingDay,
      meetingTime: formData.meetingTime,
      building: formData.building,
      floor: formData.floor,
      nextMeeting: `${formData.meetingDay}, ${formData.meetingTime}`,
    });
    navigate("/");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Create a Study Group</h1>
          <p className="text-muted-foreground">
            Fill out the form below to create a new study group and start connecting with students.
          </p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="groupName" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: "#16a34a" }} />
                Group Name
              </Label>
              <Input
                id="groupName"
                name="groupName"
                placeholder="e.g., Advanced Calculus Study Group"
                value={formData.groupName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Mathematics, Chemistry, Computer Science"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your study group..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers" className="flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: "#ca8a04" }} />
                Maximum Members
              </Label>
              <Input
                id="maxMembers"
                name="maxMembers"
                type="number"
                placeholder="e.g., 10"
                value={formData.maxMembers}
                onChange={handleChange}
                min={2}
                max={50}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingDay" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: "#16a34a" }} />
                  Meeting Day
                </Label>
                <Input
                  id="meetingDay"
                  name="meetingDay"
                  placeholder="e.g., Monday"
                  value={formData.meetingDay}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: "#ca8a04" }} />
                  Meeting Time
                </Label>
                <Input
                  id="meetingTime"
                  name="meetingTime"
                  type="time"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: "#16a34a" }} />
                  Building
                </Label>
                <Input
                  id="building"
                  name="building"
                  placeholder="e.g., Science Building"
                  value={formData.building}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: "#ca8a04" }} />
                  Floor
                </Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.floor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" style={{ backgroundColor: "#16a34a" }}>
                Create Study Group
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Preview */}
        {formData.groupName && (
          <div className="mt-6">
            <h3 className="mb-2">Preview</h3>
            <StudyGroupCard
              group={{
                id: "preview",
                name: formData.groupName,
                subject: formData.subject,
                description: formData.description,
                members: 0,
                maxMembers: parseInt(formData.maxMembers) || 10,
                meetingDay: formData.meetingDay,
                meetingTime: formData.meetingTime,
                building: formData.building,
                floor: formData.floor,
              }}
            />
          </div>
        )}

        {/* Tips */}
        <Card className="mt-6 p-6" style={{ backgroundColor: "#fef3c7" }}>
          <h3 className="mb-2">Tips for Creating a Successful Study Group</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Choose a clear and descriptive name</li>
            <li>• Set realistic meeting schedules</li>
            <li>• Clearly define topics and scope</li>
            <li>• Consider the ideal group size</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}