export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_PING_URL;

    const pingRes = await fetch(backendUrl);
    const data = await pingRes.text(); // or .json() depending on your backend

    return Response.json({
      message: 'Backend pinged successfully!',
      response: data,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: 'Ping failed', error: err.message }),
      { status: 500 }
    );
  }
}

// Handle HEAD requests as well
export async function HEAD() {
  return new Response(null, { status: 200 });
}
