export async function GET() {
  return new Response(JSON.stringify({ message: "Pong from Vercel!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
