"use client";

import EmployeeList from "../components/EmployeeList";

export default function EmployeesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <EmployeeList />
    </div>
  );
}
