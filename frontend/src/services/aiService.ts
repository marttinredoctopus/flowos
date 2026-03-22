import apiClient from '@/lib/apiClient';

export interface AIRequest {
  prompt: string;
  type?: 'campaign' | 'content' | 'analysis' | 'general';
  context?: Record<string, string>;
}

export interface AIResponse {
  result: string;
  tokens_used?: number;
}

export async function generateAIResponse(input: AIRequest): Promise<AIResponse> {
  const res = await apiClient.post('/intelligence/generate', {
    prompt: input.prompt,
    type: input.type || 'general',
    context: input.context,
  });

  const text = res.data?.result || res.data?.text || res.data?.content || res.data?.data?.result || '';

  return {
    result: text,
    tokens_used: res.data?.tokens_used,
  };
}

export async function generateCampaignPlan(clientName: string, industry: string): Promise<AIResponse> {
  return generateAIResponse({
    prompt: `Create a detailed marketing campaign plan for "${clientName}" in the ${industry || 'digital marketing'} industry. Include: 1 campaign concept, 4 specific action tasks, timeline, and expected outcomes.`,
    type: 'campaign',
  });
}

export async function generateContentIdeas(topic: string, count = 5): Promise<AIResponse> {
  return generateAIResponse({
    prompt: `Generate ${count} creative content ideas for the topic: "${topic}". For each idea, provide a title and brief description.`,
    type: 'content',
  });
}
