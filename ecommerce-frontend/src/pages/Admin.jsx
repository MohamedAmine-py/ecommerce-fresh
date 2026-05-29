import React from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import { useApp } from "../context/AppContext";

export default function Admin() {
  const { user, token, toast } = useApp();

  // Redirect to home if user is not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <AdminDashboard token={token} onToast={toast} />
    </div>
  );
}
