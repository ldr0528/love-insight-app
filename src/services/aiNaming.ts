import request from '@/utils/request';

// Call the backend API to generate names
export async function generateName(params: any) {
  try {
    const result = await request<any>('/api/naming/generate', {
      method: 'POST',
      data: params,
    });
    
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
