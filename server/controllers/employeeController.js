// Employee controller - CRUD operations for employees
const Employee = require('../models/Employee');

// @desc    Add a new employee
// @route   POST /api/employees
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, experience, performanceScore, bio, resumeUrl } = req.body;

    if (!name || !email || !department || !skills || skills.length === 0 || experience === undefined || performanceScore === undefined) {
      return res.status(400).json({ message: 'Please provide name, email, department, skills, experience, and performance score' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills: skills.map(s => s.trim()),
      experience: Number(experience),
      performanceScore: Number(performanceScore),
      bio: bio || '',
      resumeUrl: resumeUrl || '',
      manager: req.user._id
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Add employee error:', error);
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An employee with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error adding employee' });
  }
};

// @desc    Get all employees for the logged-in manager
// @route   GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const { search, status, department, sortBy, order, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { manager: req.user._id };

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skills: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Sort
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      employees,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, manager: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, manager: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const allowedUpdates = ['name', 'email', 'department', 'skills', 'experience', 'bio', 'resumeUrl', 'status', 'reviewed', 'performanceScore', 'aiRecommendation'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (error) {
    console.error('Update employee error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating employee' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, manager: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/employees/stats/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const managerId = req.user._id;

    const total = await Employee.countDocuments({ manager: managerId });
    const reviewed = await Employee.countDocuments({ manager: managerId, reviewed: true });
    const pending = await Employee.countDocuments({ manager: managerId, status: 'pending' });
    const interviewed = await Employee.countDocuments({ manager: managerId, status: 'interviewed' });

    // Average match score
    const avgResult = await Employee.aggregate([
      { $match: { manager: managerId } },
      { $group: { _id: null, avgScore: { $avg: '$performanceScore' } } }
    ]);
    const avgPerformanceScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    // Skill distribution
    const skillDistribution = await Employee.aggregate([
      { $match: { manager: managerId } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Score distribution for chart
    const scoreDistribution = await Employee.aggregate([
      { $match: { manager: managerId } },
      {
        $bucket: {
          groupBy: '$performanceScore',
          boundaries: [0, 20, 40, 60, 80, 101],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Recent employees
    const recentEmployees = await Employee.find({ manager: managerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Top employees by match score
    const topEmployees = await Employee.find({ manager: managerId, performanceScore: { $gt: 0 } })
      .sort({ performanceScore: -1 })
      .limit(5);

    res.json({
      total,
      reviewed,
      pending,
      interviewed,
      avgPerformanceScore,
      skillDistribution: skillDistribution.map(s => ({ name: s._id, count: s.count })),
      scoreDistribution: scoreDistribution.map(s => ({
        range: `${s._id}-${s._id + 19}%`,
        count: s.count
      })),
      recentEmployees,
      topEmployees
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
