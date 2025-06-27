import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import { ModeToggle } from "./components/mode-toggle";
// import RootLayout from "./pages/RootLayout";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  return (
    <>
      <div className="relative flex justify-end w-full top-12 right-6 md:right-12">
      <ModeToggle />
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
