import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slackUserId = url.pathname.split("/").at(-2); // Extract slack_user_id from URL

  if (!slackUserId) {
    return NextResponse.json(
      { error: "slack_user_id is required" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${apiUrl}/client/selected_employee/${slackUserId}/`
    );
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
