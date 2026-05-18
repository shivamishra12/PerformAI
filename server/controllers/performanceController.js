// Performance controller - handles AI-powered employee recommendations
const Employee = require('../models/Employee');
const aiService = require('../services/aiService');

// @desc    AI-powered recommendation for employees
// @route   POST /api/ai/recommend
const aiRecommend = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minimumExperience, title, description } = req.body;

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(400).json({ 
        message: 'OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your .env file.' 
      });
    }

    // Build evaluation criteria from request body
    const evalCriteria = {
      title: title || 'General Performance Review',
      requiredSkills: requiredSkills ? requiredSkills.map(s => s.trim()) : [],
      preferredSkills: preferredSkills ? preferredSkills.map(s => s.trim()) : [],
      minimumExperience: Number(minimumExperience) || 0,
      description: description || ''
    };

    // Get all employees for this manager
    const employees = await Employee.find({ manager: req.user._id });

    if (employees.length === 0) {
      return res.status(400).json({ message: 'No employees found. Add employees first.' });
    }

    // Get AI analysis
    const aiAnalysis = await aiService.analyzeAndRank(employees, evalCriteria);

    // Update employees with AI recommendations and scores
    if (aiAnalysis.rankings && aiAnalysis.rankings.length > 0) {
      for (const ranking of aiAnalysis.rankings) {
        const employeeIndex = ranking.employeeIndex;
        if (employeeIndex >= 0 && employeeIndex < employees.length) {
          await Employee.findByIdAndUpdate(employees[employeeIndex]._id, {
            performanceScore: ranking.suitabilityScore || employees[employeeIndex].performanceScore,
            aiRecommendation: ranking.promotionRecommendation || ''
          });
        }
      }
    }

    res.json({
      totalEmployees: employees.length,
      evaluationCriteria: evalCriteria,
      aiAnalysis
    });
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ message: error.message || 'AI recommendation failed' });
  }
};

module.exports = { aiRecommend };
