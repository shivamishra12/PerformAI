// Employee routes
const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Dashboard stats (must be before :id route)
router.get('/stats/dashboard', getDashboardStats);

// Search endpoint
router.get('/search', getEmployees);

// CRUD
router.route('/')
  .get(getEmployees)
  .post(addEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
