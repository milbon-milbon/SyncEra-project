import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://backend:8000/client/all_employee/");
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/employees:", error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
