"use client";

import { useState, useEffect } from "react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  project: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/client/all_employee/`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch employees: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
};
