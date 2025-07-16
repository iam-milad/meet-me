import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CallPage from "./pages/CallPage";
import HomePage from "./pages/HomePage";
import JoinMeetingPage from "./pages/JoinMeetingPage";
import HostMeetingPage from "./pages/HostMeetingPage";
import CallRouteGuard from "./components/CallRouteGuard";

const router = createBrowserRouter([
  {
    path: "/call",
    element: (
      <CallRouteGuard>
        <CallPage />
      </CallRouteGuard>
    ),
  },
  { path: "/join-meeting", element: <JoinMeetingPage /> },
  { path: "/host-meeting", element: <HostMeetingPage /> },
  {
    path: "/",
    children: [{ index: true, element: <HomePage /> }],
  },
]);

function App() {
  return (
    <>
      {/* <div className="relative flex justify-end w-full top-12 right-6 md:right-12">
      <ModeToggle />
      </div> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
