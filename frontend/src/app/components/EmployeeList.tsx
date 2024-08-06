"use client";

import { useEmployees } from "../hooks/useEmployees";

export default function EmployeeList() {
  const { employees, loading, error } = useEmployees();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <div key={employee.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-gray-600">{employee.email}</p>
          <p className="text-gray-600">{employee.department}</p>
          <p className="text-gray-600">{employee.role}</p>
          <p className="text-gray-600">{employee.project}</p>
        </div>
      ))}
    </div>
  );
}
