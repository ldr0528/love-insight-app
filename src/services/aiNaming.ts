
// Call the backend API to generate names
export async function generateName(params: any) {
  try {
    const response = await fetch('/api/naming/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to generate names');
    }
  } catch (error) {
    console.error('Error calling naming API:', error);
    throw error;
  }
}
