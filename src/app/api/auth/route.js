import { getAuth } from '@clerk/nextjs/server';

export default async function GET(req, res) {
  const { userId, sessionId, getToken } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const token = await getToken({ template: "default" }); // Clerk JWT
  res.status(200).json({ token });
}
