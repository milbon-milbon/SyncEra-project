import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EmployeeNameProps {
  slackUserId: string;
}

export default function EmployeeName({ slackUserId }: EmployeeNameProps) {
  const [employeeName, setEmployeeName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployeeName() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/client/selected_employee/${slackUserId}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }
        const data = await response.json();
        setEmployeeName(data[0].name);
      } catch (err) {
        console.error('Error fetching employee name:', err);
      }
    }

    if (slackUserId) {
      fetchEmployeeName();
    }
  }, [slackUserId]);

  return (
    <Link
      href={`/employee-list/summary/${slackUserId}`}
      className='hover:text-[#003366] text-[17px] text-gray-600 mr-2 '
    >
      <span>{employeeName ? `${employeeName}` : ''}</span>
    </Link>
  );
}
