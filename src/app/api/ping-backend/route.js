// app/api/ping-backend/route.js

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const pingRes = await fetch(backendUrl);
    const data = await pingRes.text(); // or .json() if your backend responds with JSON

    return Response.json({
      message: 'Backend pinged successfully!',
      response: data
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: 'Ping failed', error: err.message }),
      { status: 500 }
    );
  }
}
