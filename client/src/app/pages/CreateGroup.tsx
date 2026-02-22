// client/src/app/pages/CreateGroup.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, BookOpen, Clock, MapPin } from "lucide-react";
import { useStudyGroups } from "../context/StudyGroupContext";
import { StudyGroupCard } from "../components/StudyGroupCard";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  outline: "none",
  color: "#111827",
  backgroundColor: "#ffffff",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

const labelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#374151",
  marginBottom: "6px",
};

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/items/create/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourToken}` // Uncomment if your API requires a token
        },
        body: JSON.stringify({
          owner_id: 5,
          name: formData.groupName,
          course_code: formData.subject,
          description: formData.description,
          max_members: parseInt(formData.maxMembers),
          meeting_day: formData.meetingDay,
          meeting_time: formData.meetingTime,
          building: formData.building,
          room: formData.floor,
          next_meeting: `${formData.meetingDay}, ${formData.meetingTime}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optional: AWAIT newly created group data sent back from server
      // const createdGroup = await response.json()

      addGroup({
        name: formData.groupName,
        subject: formData.subject,
        description: formData.description,
        maxMembers: parseInt(formData.maxMembers),
        members: 1,
        meetingDay: formData.meetingDay,
        meetingTime: formData.meetingTime,
        building: formData.building,
        floor: formData.floor,
        nextMeeting: `${formData.meetingDay}, ${formData.meetingTime}`,
      });
      navigate("/");
    } catch (error) {
      console.error(`Failed to create group: ${error}`);
    }
  };

  const hasPreview = formData.groupName.trim().length > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
            Create a Study Group
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Fill out the form below to create a new study group and start connecting with students.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            marginBottom: "24px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Group Name */}
            <div>
              <label style={labelStyle}>
                <BookOpen style={{ width: "15px", height: "15px", color: "#16a34a" }} />
                Group Name
              </label>
              <input
                style={inputStyle}
                id="groupName"
                name="groupName"
                placeholder="e.g., Advanced Calculus Study Group"
                value={formData.groupName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label style={labelStyle}>Subject</label>
              <input
                style={inputStyle}
                id="subject"
                name="subject"
                placeholder="e.g., MATH144, CHEM101, CMPUT201"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                id="description"
                name="description"
                placeholder="Describe what your study group is about, topics covered, and expectations..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Max Members */}
            <div>
              <label style={labelStyle}>
                <Users style={{ width: "15px", height: "15px", color: "#ca8a04" }} />
                Maximum Members
              </label>
              <input
                style={inputStyle}
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

            {/* Meeting Schedule */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>
                  <Calendar style={{ width: "15px", height: "15px", color: "#16a34a" }} />
                  Meeting Day
                </label>
                <select
                  style={{ ...inputStyle, appearance: "auto" }}
                  name="meetingDay"
                  value={formData.meetingDay}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a day</option>
                  {DAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  <Clock style={{ width: "15px", height: "15px", color: "#ca8a04" }} />
                  Meeting Time
                </label>
                <input
                  style={inputStyle}
                  name="meetingTime"
                  type="time"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>
                  <MapPin style={{ width: "15px", height: "15px", color: "#16a34a" }} />
                  Building
                </label>
                <input
                  style={inputStyle}
                  name="building"
                  placeholder="e.g., Science Building"
                  value={formData.building}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  <MapPin style={{ width: "15px", height: "15px", color: "#ca8a04" }} />
                  Floor
                </label>
                <input
                  style={inputStyle}
                  name="floor"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.floor}
                  onChange={handleChange}
                  min={1}
                  max={20}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Create Study Group
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: "8px",
                  border: "1.5px solid #d1d5db",
                  backgroundColor: "transparent",
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        {hasPreview && (
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>
              Preview
            </h3>
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

        {/* Tips Card */}
        <div
          style={{
            backgroundColor: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#92400e", marginBottom: "12px" }}>
            Tips for a Successful Study Group
          </h3>
          <ul style={{ listStyle: "disc", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Choose a clear and descriptive name for your group.",
              "Set realistic meeting schedules that work for most students.",
              "Clearly define the topics and scope of your study group.",
              "Consider the ideal group size for effective collaboration.",
            ].map((tip) => (
              <li key={tip} style={{ fontSize: "13px", color: "#a16207" }}>{tip}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
