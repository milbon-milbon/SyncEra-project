import React from "react";
import { useEmployees } from "../hooks/useEmployees";

export default function EmployeeList() {
  const { employees, loading, error } = useEmployees();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {employees.map((employee) => (
        <li key={employee.id}>
          {employee.name} - {employee.role}
        </li>
      ))}
    </ul>
  );
}
