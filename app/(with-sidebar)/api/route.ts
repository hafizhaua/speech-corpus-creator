import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const text = searchParams.get("text");

  try {
    const response = await fetch(`http://localhost:5000?text=${text}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const audioBlob = await response.blob();

    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/wav", // Replace with the appropriate content type
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
