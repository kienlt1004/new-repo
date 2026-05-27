import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const googleSheetsWebhookUrl =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbxU3IuZCMuZWiNwvFk54x6CJAaPtYd64vywJg6MmQ66KJTRcHcvEQXyD_AEPIqQypXU/exec";
  const spreadsheetId = "1_z1UeThvojX3tUXiHsHWFoR5lmJX4iFnM6OAHPxtO9w";
  const sheetName = "Sheet1";

  if (!googleSheetsWebhookUrl) {
    return NextResponse.json(
      { success: false, error: "Missing GOOGLE_SHEETS_WEBHOOK_URL configuration" },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();

    const payload = {
      submittedAt: new Date().toISOString(),
      spreadsheetId,
      sheetName,
      isAvailable: data.isAvailable,
      date: data.date,
      time: data.time,
      restaurantName: data.restaurantName,
      restaurantAddress: data.restaurantAddress,
      food: Array.isArray(data.food) ? data.food.join(", ") : "",
      photoBook: data.photoBook,
      photoBookAddress: data.photoBookAddress,
      excitement: data.excitement,
    };

    const response = await fetch(googleSheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Google Sheets webhook failed: ${errorText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
