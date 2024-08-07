// src/app/api/employee/[slack_user_id]/route.ts
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     // Extract slack_user_id from URL
//     const url = new URL(request.url);
//     const slackUserId = url.pathname.split("/").pop();

//     if (!slackUserId) {
//       return NextResponse.json(
//         { error: "slack_user_id is required" },
//         { status: 400 }
//       );
//     }

//     // Replace with the actual backend URL
//     const backendUrl = `http://localhost:8000/client/selected_employee/${slackUserId}/`;

//     const response = await fetch(backendUrl);

//     if (!response.ok) {
//       throw new Error(`Backend responded with status: ${response.status}`);
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error in /api/employee/[slack_user_id]/route.ts:", error);
//     return NextResponse.json(
//       {
//         error: "An error occurred while fetching data",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/employees/[slack_user_id]/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slackUserId = url.pathname.split("/").at(-2); // Extract slack_user_id from URL

  console.log("Extracted slackUserId:", slackUserId); // Debugging line

  if (!slackUserId) {
    return NextResponse.json(
      { error: "slack_user_id is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://localhost:8000/client/selected_employee/${slackUserId}/`
    );
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/employee/[slack_user_id]/route.ts:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
