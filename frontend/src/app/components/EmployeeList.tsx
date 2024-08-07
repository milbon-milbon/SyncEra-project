"use client";
/*
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
  */

"use client";

import { useRouter } from "next/navigation";
import { useEmployees } from "../hooks/useEmployees";

// 従業員情報の型定義
type Employee = {
  id: string;
  name: string;
  email: string; // 追加
  department: string;
  role: string;
  project: string;
  slack_user_id: string;
};

export default function EmployeeList() {
  const router = useRouter();
  const { employees, loading, error } = useEmployees();

  const handleViewDetails = (slackUserId: string) => {
    try {
      router.push(`/employee-list/summary/${encodeURIComponent(slackUserId)}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee: Employee) => (
        <div key={employee.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-gray-600">{employee.email}</p>
          <p className="text-gray-600">{employee.department}</p>
          <p className="text-gray-600">{employee.role}</p>
          <p className="text-gray-600">{employee.project}</p>
          <button
            onClick={() => handleViewDetails(employee.slack_user_id)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300"
          >
            詳細を見る
          </button>
        </div>
      ))}
    </div>
  );
}
