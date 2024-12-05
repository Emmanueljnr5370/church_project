import { Navigate } from "react-router-dom";
import Starter from "../views/Starter";
import UserList from "../views/UserList";
import Login from '../views/auth/Login';
import ChurchList from "../views/ChurchList";
import ChurchDetail from "../views/ChurchDetail";
import NotificationList from "../views/NotificationList";
import TransactionList from "../views/TransactionList";
import FullLayout from "../layouts/FullLayout.js";
import MainLayout from "../layouts/MainLayout.js";
import RolesPage from "../views/Roles.js";


const ThemeRoutes = [
  {
    path: "/admin",
    element: <FullLayout />,
    children: [
      { path: "/admin/starter", exact: true, element: <Starter /> },
      { path: "/admin/user_list", exact: true, element: <UserList /> },
      { path: "/admin/church_list", exact: true, element: <ChurchList /> },
      { path: "/admin/church_list/:id", exact: true, element: <ChurchDetail /> },
      { path: "/admin/notification_list", exact: true, element: <NotificationList /> },
      { path: "/admin/transaction_list", exact: true, element: <TransactionList /> },
      { path: "/admin/roles", exact: true, element: <RolesPage /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", exact: true, element: <Login /> },
    ],
  },
];

export default ThemeRoutes;
