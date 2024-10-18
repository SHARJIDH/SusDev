
export async function searchYouTubeVideos(query: string): Promise<any[]> {
    const response = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube videos');
    }
    return response.json();
  }