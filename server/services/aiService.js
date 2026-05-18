// AI Service - OpenRouter API integration for employee performance analysis
const axios = require('axios');

class AIService {
  constructor() {
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'openai/gpt-4.1-nano';
  }

  /**
   * Get headers for OpenRouter API requests
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'PerformAI'
    };
  }

  /**
   * Analyze and rank employees for performance, promotions, and training needs
   * @param {Array} employees - Array of employee objects
   * @param {Object} evalCriteria - Evaluation criteria object
   * @returns {Object} AI analysis results
   */
  async analyzeAndRank(employees, evalCriteria) {
    const employeeSummaries = employees.map((e, i) => (
      `${i + 1}. ${e.name} - Department: ${e.department} | Skills: ${e.skills.join(', ')} | Experience: ${e.experience} years | Performance Score: ${e.performanceScore}/100 | Bio: ${e.bio || 'N/A'}`
    )).join('\n');

    const prompt = `You are an expert HR manager and talent analyst. Analyze these employees for performance, training needs, and promotion eligibility based on the following criteria.

**Evaluation Criteria:**
- Title: ${evalCriteria.title || 'General Performance Review'}
- Required Skills: ${evalCriteria.requiredSkills?.join(', ') || 'All relevant skills'}
- Preferred Skills: ${evalCriteria.preferredSkills?.join(', ') || 'None specified'}
- Minimum Experience: ${evalCriteria.minimumExperience || 0} years
- Description: ${evalCriteria.description || 'Evaluate overall employee performance'}

**Employees:**
${employeeSummaries}

Please provide your response in the following JSON format (respond with ONLY valid JSON, no markdown):
{
  "rankings": [
    {
      "rank": 1,
      "employeeIndex": 0,
      "name": "Employee Name",
      "suitabilityScore": 85,
      "promotionRecommendation": "Yes, ready for promotion because...",
      "trainingSuggestions": ["suggestion1", "suggestion2"],
      "feedback": "Detailed feedback on strengths and areas of improvement."
    }
  ],
  "summary": "Overall assessment summary of the team...",
  "topPick": "Name of the top performer and why"
}`;

    try {
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert HR manager specializing in employee performance analytics. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: this.getHeaders(),
        timeout: 30000
      });

      const content = response.data.choices[0].message.content;
      
      // Parse JSON response - handle possible markdown code blocks
      let parsed;
      try {
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        // If JSON parse fails, return raw text as summary
        parsed = {
          rankings: [],
          summary: content,
          topPick: 'Unable to parse AI response'
        };
      }

      return parsed;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'AI analysis failed. Please check your OpenRouter API key.'
      );
    }
  }
}

module.exports = new AIService();
