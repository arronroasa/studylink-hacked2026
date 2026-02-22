// client/src/app/Root.tsx
import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { StudyGroupProvider } from "./context/StudyGroupContext";

export function Root() {
  return (
    <StudyGroupProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#f9fafb",
        }}
      >
        <Sidebar />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </StudyGroupProvider>
  );
}
