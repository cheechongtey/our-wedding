import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function POST(req: NextRequest) {
  const dbId = process.env.NOTION_RSVP_DB_ID;

  if (!process.env.NOTION_TOKEN || !dbId) {
    return NextResponse.json(
      { error: "Notion integration is not configured." },
      { status: 500 }
    );
  }

  let body: {
    name: string;
    email: string;
    phone: string;
    guests: string;
    attending: "Yes" | "No";
    vegetarian: "Yes" | "No";
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, guests, attending, vegetarian } = body;

  if (!name || !email || !phone || !guests || !attending || !vegetarian) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const dupeRes = await fetch(
      `https://api.notion.com/v1/databases/${dbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { property: "Email Address", email: { equals: email } },
          page_size: 1,
        }),
      }
    );

    if (!dupeRes.ok) {
      const err = await dupeRes.json();
      console.error("[RSVP] Notion duplicate check error:", err);
      return NextResponse.json(
        { error: "Failed to verify your submission. Please try again." },
        { status: 500 }
      );
    }

    const dupeData = await dupeRes.json() as { results: unknown[] };
    if (dupeData.results.length > 0) {
      return NextResponse.json(
        { error: "This email has already been used to RSVP." },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("[RSVP] Notion duplicate check error:", err);
    return NextResponse.json(
      { error: "Failed to verify your submission. Please try again." },
      { status: 500 }
    );
  }

  try {
    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: {
          title: [{ text: { content: name } }],
        },
        "Email Address": {
          email,
        },
        "Phone Number": {
          phone_number: phone,
        },
        "Number of Guests": {
          number: Number(guests),
        },
        RSVP: {
          checkbox: attending === "Yes",
        },
        Attendance: {
          status: { name: attending === "Yes" ? "Attend" : "Not attend" },
        },
        Vegetarian: {
          checkbox: vegetarian === "Yes",
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RSVP] Notion error:", err);
    return NextResponse.json(
      { error: "Failed to save your RSVP. Please try again." },
      { status: 500 }
    );
  }
}
