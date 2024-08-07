// hooks/useEmployeeSlack.ts
/*
import { useState, useEffect } from "react";

export type EmployeeInfo = {
  department: string;
  id: string;
  project: string;
  name: string;
  email: string;
  role: string;
  slack_user_id: string;
};

export type DailyReport = {
  text: string;
  ts: string;
  id: number;
  user_id: string;
};

export type EmployeeSlackData = [EmployeeInfo, DailyReport];

export function useEmployeeSlack(employeeName: string) {
  const [employeeData, setEmployeeData] = useState<EmployeeSlackData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEmployeeSlackData() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/client/selected_employee/${encodeURIComponent(slack_user_id)}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee Slack data");
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    if (employeeName) {
      fetchEmployeeSlackData();
    }
  }, [employeeName]);

  return { employeeData, loading, error };
}
  */

// hooks/useEmployeeSlack.ts
import { useState, useEffect } from "react";

export type EmployeeInfo = {
  department: string;
  id: string;
  project: string;
  name: string;
  email: string;
  role: string;
  slack_user_id: string;
};

export type DailyReport = {
  text: string;
  ts: string;
  id: number;
  user_id: string;
};

// EmployeeData 型を定義します
export type EmployeeData = {
  employeeInfo: EmployeeInfo;
  dailyReport: DailyReport[];
};

export function useEmployeeSlack(slackUserId: string) {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEmployeeSlackData() {
      if (!slackUserId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/client/selected_employee/${slackUserId}/`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch employee Slack data: ${response.status}`
          );
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1) {
          const employeeInfo = data[0];
          const dailyReport = data.slice(1); // Assuming dailyReport could be multiple entries

          setEmployeeData({ employeeInfo, dailyReport });
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeSlackData();
  }, [slackUserId]);

  return { employeeData, loading, error };
}
