import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { StudyGroupProvider } from "./context/StudyGroupContext";

export function Root() {
  return (
    <StudyGroupProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <Outlet />
      </div>
    </StudyGroupProvider>
  );
}