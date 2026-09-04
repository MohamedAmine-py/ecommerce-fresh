import React from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import useApp from "../context/useApp";

export default function Admin() {
  const { user, token, toast } = useApp();

  // Redirect to home if user is not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-page">
      <AdminDashboard token={token} user={user} onToast={toast} />
    </div>
  );
}
