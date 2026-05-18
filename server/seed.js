// Seed script - Populates database with sample employee data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const dns = require('dns');

// Force Google DNS for Atlas SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const User = require('./models/User');
const Employee = require('./models/Employee');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin/HR manager
    const manager = await User.create({
      name: 'Admin',
      email: 'admin@performai.com',
      password: 'Admin@123',
      company: 'PerformAI Inc.',
      role: 'admin'
    });
    console.log('👤 Created admin account successfully');

    // Create sample employees
    const employees = await Employee.insertMany([
      {
        name: 'Aman Verma',
        email: 'aman.verma@gmail.com',
        department: 'Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        experience: 3,
        performanceScore: 85,
        bio: 'Full-stack developer with strong MERN stack experience. Led frontend development for 2 major projects.',
        status: 'reviewed',
        reviewed: true,
        aiRecommendation: 'Strong performer ready for promotion to Senior Developer.',
        manager: manager._id
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        department: 'Data Science',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        experience: 5,
        performanceScore: 92,
        bio: 'ML Engineer with published research papers. Built recommendation systems serving 1M+ users.',
        status: 'reviewed',
        reviewed: true,
        aiRecommendation: 'Top performer. Recommended for Team Lead promotion immediately.',
        manager: manager._id
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan.gupta@gmail.com',
        department: 'Backend',
        skills: ['Java', 'Spring Boot', 'AWS', 'Microservices'],
        experience: 6,
        performanceScore: 68,
        bio: 'Senior Java developer specializing in cloud-native microservices. AWS certified.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Ananya Krishnan',
        email: 'ananya.k@gmail.com',
        department: 'Design',
        skills: ['React', 'Next.js', 'Tailwind CSS', 'Figma', 'UI/UX'],
        experience: 3,
        performanceScore: 78,
        bio: 'Frontend specialist with a design background. Built 10+ production apps.',
        status: 'reviewed',
        reviewed: true,
        aiRecommendation: 'Excellent frontend skills. Suggested training in backend technologies.',
        manager: manager._id
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        department: 'Development',
        skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL'],
        experience: 3,
        performanceScore: 45,
        bio: 'Junior full-stack developer working on performance optimization projects.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        department: 'Mobile',
        skills: ['Flutter', 'Dart', 'Firebase', 'React Native'],
        experience: 4,
        performanceScore: 72,
        bio: 'Mobile app developer with cross-platform expertise. Published 5 apps on App Store.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@gmail.com',
        department: 'Development',
        skills: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
        experience: 2,
        performanceScore: 55,
        bio: 'Junior developer eager to learn. Completed multiple bootcamp projects.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Kavya Nair',
        email: 'kavya.nair@gmail.com',
        department: 'DevOps',
        skills: ['Python', 'Docker', 'Kubernetes', 'CI/CD', 'AWS'],
        experience: 5,
        performanceScore: 88,
        bio: 'DevOps engineer automating deployment pipelines and managing cloud infrastructure.',
        status: 'reviewed',
        reviewed: true,
        aiRecommendation: 'Outstanding performer. Promote to DevOps Lead.',
        manager: manager._id
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@gmail.com',
        department: 'Backend',
        skills: ['Angular', 'TypeScript', '.NET', 'Azure', 'SQL Server'],
        experience: 7,
        performanceScore: 50,
        bio: 'Enterprise developer with extensive .NET experience across Fortune 500 projects.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Diya Joshi',
        email: 'diya.joshi@gmail.com',
        department: 'Development',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
        experience: 4,
        performanceScore: 82,
        bio: 'Cloud-focused full-stack developer. Built serverless applications on AWS.',
        status: 'reviewed',
        reviewed: true,
        aiRecommendation: 'High performer with cloud expertise. Consider for senior role.',
        manager: manager._id
      },
      {
        name: 'Siddharth Iyer',
        email: 'sid.iyer@gmail.com',
        department: 'Backend',
        skills: ['Go', 'Rust', 'Docker', 'Kubernetes', 'gRPC'],
        experience: 6,
        performanceScore: 40,
        bio: 'Systems programmer specializing in high-performance backend services.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      },
      {
        name: 'Meera Kapoor',
        email: 'meera.kapoor@gmail.com',
        department: 'QA',
        skills: ['React', 'Node.js', 'Jest', 'Cypress', 'MongoDB'],
        experience: 3,
        performanceScore: 76,
        bio: 'Test-driven developer who values code quality. Expert in both frontend and backend testing.',
        status: 'pending',
        aiRecommendation: '',
        manager: manager._id
      }
    ]);
    console.log(`📋 Created ${employees.length} sample employees`);

    console.log('\n🎉 Seed complete!');
    console.log('   Email: admin@performai.com');
    console.log('   Password: Admin@123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
