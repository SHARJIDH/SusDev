export async function generateRecipe(prompt: string): Promise<string> {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to generate recipe');
    }
  
    const data = await response.json();
    return data.recipe;
  }