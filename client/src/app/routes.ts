import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { CreateGroup } from "./pages/CreateGroup";
import { SearchGroups } from "./pages/SearchGroups";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateGroup },
      { path: "search", Component: SearchGroups },
    ],
  },
]);
