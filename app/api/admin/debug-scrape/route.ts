import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = "https://www.airbnb.co.in/rooms/1348558040063059763";
    const apiKey = process.env.SCRAPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing SCRAPER_API_KEY" });
    }

    const targetUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
    const res = await fetch(targetUrl);
    const html = await res.text();

    let niobeScript = "";
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      const scriptText = match[1].trim();
      if (scriptText.includes("niobeClientData")) {
        niobeScript = scriptText;
        break;
      }
    }

    const projectRootPath = path.join(process.cwd(), "debug-script.json");
    
    let formatted = niobeScript;
    const jsonMatch = niobeScript.match(/({[\s\S]*})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        formatted = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // ignore
      }
    }

    fs.writeFileSync(projectRootPath, formatted, "utf8");

    return NextResponse.json({ success: true, saved: true, path: projectRootPath, length: formatted.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
