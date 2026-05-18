// Employee model - Stores employee profile data
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'At least one skill is required'
    }
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    default: ''
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  performanceScore: {
    type: Number,
    required: [true, 'Performance score is required'],
    min: [0, 'Score cannot be below 0'],
    max: [100, 'Score cannot exceed 100']
  },
  aiRecommendation: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'interviewed'],
    default: 'pending'
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  // Reference to the manager who added this employee
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
employeeSchema.index({ manager: 1, performanceScore: -1 });
employeeSchema.index({ skills: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
