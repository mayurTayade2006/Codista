const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// --- SEED DATA ---
// Removed Rust and Ruby from this list
const SEED_COURSES = [
  {
    title: 'Complete Python Bootcamp',
    description: 'Learn Python from scratch to advanced concepts. Includes Django and Flask.',
    videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    category: 'Python',
    instructorName: 'Sarah Smith'
  },
  {
    title: 'The Complete JavaScript Course 2024',
    description: 'Master modern JavaScript (ES6+) from the beginning to advanced topics like closures and promises.',
    videoUrl: 'https://www.youtube.com/watch?v=uDwSnnhl1Ng',
    category: 'JavaScript',
    instructorName: 'John Doe'
  },
  {
    title: 'Java Programming Masterclass',
    description: 'Learn Java In-Depth: Data Structures, Algorithms, and OOP principles.',
    videoUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
    category: 'Java',
    instructorName: 'James Gosling Fan'
  },
  {
    title: 'Beginning C++ Programming',
    description: 'Modern C++ features, STL, and game development fundamentals.',
    videoUrl: 'https://www.youtube.com/watch?v=18c3MTX0PK0',
    category: 'C++',
    instructorName: 'Bjarne S.'
  },
  {
    title: 'Go: The Complete Developer\'s Guide',
    description: 'Master the fundamentals and advanced features of the Go (Golang) programming language.',
    videoUrl: 'https://www.youtube.com/watch?v=YS4e4q9oBaU',
    category: 'Go',
    instructorName: 'Alice Wonder'
  },
  {
    title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
    description: 'From beginner to iOS App Developer with just one course.',
    videoUrl: 'https://www.youtube.com/watch?v=comQ1-x2a1Q',
    category: 'Swift',
    instructorName: 'Angela Yu Fan'
  },
  {
    title: 'PHP for Beginners - Become a PHP Master',
    description: 'Learn everything you need to become a professional PHP developer.',
    videoUrl: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
    category: 'PHP',
    instructorName: 'Elephant Dev'
  },
  {
    title: 'C# Basics for Beginners: Learn C# Fundamentals by Coding',
    description: 'Master C# fundamentals for Unity game development and .NET applications.',
    videoUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8',
    category: 'C#',
    instructorName: 'Microsoft MVP'
  },
  {
    title: 'Understanding TypeScript',
    description: 'Don\'t limit the Usage of TypeScript to Angular! Learn the basics, its features, workflows and how to use it.',
    videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    category: 'TypeScript',
    instructorName: 'John Doe'
  },
  {
    title: 'The Complete SQL Bootcamp',
    description: 'Learn to read and write complex queries to a database using PostgreSQL.',
    videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    category: 'SQL',
    instructorName: 'Data Wizard'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seed/Sync...');

    // 1. Cleanup: Remove Rust and Ruby courses if they exist
    await Course.deleteMany({
        title: { 
            $in: [
                'Rust Programming for Beginners', 
                'The Complete Ruby on Rails Developer Course'
            ] 
        }
    });
    
    // 2. Ensure default instructor exists
    let instructor = await User.findOne({ email: 'instructor@codista.com' });
    if (!instructor) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        instructor = await User.create({
            name: 'Chief Instructor',
            email: 'instructor@codista.com',
            password: hashedPassword,
            role: 'instructor'
        });
        console.log('👤 Default Instructor created');
    }

    // 3. Update or Insert existing courses (Sync URLs and Content)
    for (const courseData of SEED_COURSES) {
        await Course.findOneAndUpdate(
            { title: courseData.title }, // Find by title
            { 
                ...courseData,
                instructorId: instructor._id 
            },
            { upsert: true, new: true } // Create if not exists, update if exists
        );
    }
    
    console.log(`✅ Database Synced: ${SEED_COURSES.length} active courses.`);
    
  } catch (error) {
    console.error('Seed Error:', error);
  }
};

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codista_lms';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    await seedDatabase();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('Ensure your MongoDB service is running on mongodb://127.0.0.1:27017');
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/questions', require('./routes/questions'));

app.get('/', (req, res) => {
  res.send('Codista LMS API is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});