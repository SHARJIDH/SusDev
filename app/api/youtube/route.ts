import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await youtube.search.list({
      part: ['id', 'snippet'],
      q: query,
      type: ['video'],
      maxResults: 5,
    });

    return NextResponse.json(response.data.items || []);
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Error fetching YouTube videos' }, { status: 500 });
  }
}