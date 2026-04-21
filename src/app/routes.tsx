import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { PatientDashboard } from "./pages/PatientDashboard";
import { DoctorProfile } from "./pages/DoctorProfile";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import Wireframe from "./pages/Wireframe";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/wireframe",
    Component: Wireframe,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/patient/dashboard",
    Component: PatientDashboard,
  },
  {
    path: "/doctor/:id",
    Component: DoctorProfile,
  },
  {
    path: "/doctor/dashboard",
    Component: DoctorDashboard,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
