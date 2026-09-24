const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('./models/User');
const Resource = require('./models/Resource');
const BorrowRequest = require('./models/BorrowRequest');
const Notification = require('./models/Notification');
const Complaint = require('./models/Complaint');
const SystemSetting = require('./models/SystemSetting');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'campus_share_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_share';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB & Seed Data
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedInitialData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

async function seedInitialData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial data...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const studentPassword = await bcrypt.hash('student123', 10);

      const admin = await User.create({
        name: 'Admin Staff',
        email: 'admin@campus.edu',
        studentId: 'ADM-001',
        department: 'Information Technology',
        password: adminPassword,
        role: 'Admin',
        membershipStatus: 'System Admin'
      });

      const student1 = await User.create({
        name: 'Srirach S',
        email: 'student@campus.edu',
        studentId: '22IT104',
        department: 'Information Technology',
        password: studentPassword,
        role: 'Student',
        membershipStatus: 'Active Member'
      });

      const student2 = await User.create({
        name: 'Katherine Gill',
        email: 'katherine@campus.edu',
        studentId: '22CS089',
        department: 'Computer Science',
        password: studentPassword,
        role: 'Student',
        membershipStatus: 'Active Member'
      });

      const student3 = await User.create({
        name: 'Rohit Sharma',
        email: 'rohit@campus.edu',
        studentId: '21EC045',
        department: 'Electronics',
        password: studentPassword,
        role: 'Student',
        membershipStatus: 'Active Member'
      });

      const res1 = await Resource.create({
        name: 'Canon EOS Rebel T7 DSLR Camera',
        category: 'Photography',
        description: 'Professional 24.1 MP DSLR camera with 18-55mm lens kit, neck strap, and dual batteries.',
        ownerId: admin._id,
        ownerName: admin.name,
        ownerDepartment: admin.department,
        availability: 'Available',
        condition: 'Good',
        borrowingInfo: 'Standard 7-day borrowing period. Handle optical lens with care.',
        location: 'Media Lab B-12',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
      });

      const res2 = await Resource.create({
        name: 'TI-84 Plus CE Graphing Calculator',
        category: 'Academic',
        description: 'Color screen graphing calculator ideal for Calculus, Statistics, and Engineering coursework.',
        ownerId: student1._id,
        ownerName: student1.name,
        ownerDepartment: student1.department,
        availability: 'Available',
        condition: 'New',
        borrowingInfo: 'Max 5 days borrowing. Please charge via micro-USB before returning.',
        location: 'Library Quiet Zone / Desk 4',
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80'
      });

      const res3 = await Resource.create({
        name: 'Digital Oscilloscope 100MHz Dual Channel',
        category: 'Electronics',
        description: 'Portable digital storage oscilloscope for signal analysis and electronics troubleshooting.',
        ownerId: student3._id,
        ownerName: student3.name,
        ownerDepartment: student3.department,
        availability: 'Available',
        condition: 'Good',
        borrowingInfo: 'Requires faculty sign-off for off-campus transport.',
        location: 'ECE Hardware Lab 3',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      });

      const res4 = await Resource.create({
        name: 'HD Digital Compound Microscope',
        category: 'Lab Equipment',
        description: '40X-1000X magnification microscope with USB digital camera attachment for specimen analysis.',
        ownerId: admin._id,
        ownerName: admin.name,
        ownerDepartment: admin.department,
        availability: 'Available',
        condition: 'Good',
        borrowingInfo: 'Handle glass slides with precautions.',
        location: 'BioTech Science Building Room 102',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
      });

      const res5 = await Resource.create({
        name: 'Sony WH-1000XM4 Noise-Canceling Headphones',
        category: 'Electronics',
        description: 'Over-ear wireless noise canceling headphones for focus and study sessions.',
        ownerId: student2._id,
        ownerName: student2.name,
        ownerDepartment: student2.department,
        availability: 'Available',
        condition: 'New',
        borrowingInfo: 'Sanitized after every return.',
        location: 'Student Union Lounge',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      });

      // Sample request
      const req1 = await BorrowRequest.create({
        resourceId: res1._id,
        resourceName: res1.name,
        borrowerId: student1._id,
        borrowerName: student1.name,
        borrowerEmail: student1.email,
        ownerId: admin._id,
        borrowDate: new Date(),
        expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        purpose: 'Campus Photography Assignment for Media Club',
        notes: 'Will need extra memory card if available.',
        agreementAccepted: true,
        status: 'Approved'
      });

      // Sample notification
      await Notification.create({
        userId: student1._id,
        title: 'Request Approved!',
        message: `Your request to borrow "${res1.name}" was approved by ${admin.name}.`,
        type: 'approval'
      });

      // Sample complaint
      await Complaint.create({
        title: 'Damaged DSLR Camera lens cap',
        category: 'Resource Damaged',
        description: 'The front protective cap has a slight scratch on the plastic rim. Reporting for transparency.',
        reporterId: student1._id,
        reporterName: student1.name,
        resourceId: res1._id,
        resourceName: res1.name,
        status: 'Under Review',
        actionNotes: 'Inspected by admin staff. Component functional.'
      });

      // Default setting
      await SystemSetting.create({
        finePerDay: 5,
        defaultBorrowDurationDays: 7,
        broadcastMessage: 'CampusShare system operational. Remember to return all borrowed items on time!'
      });

      console.log('Database seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding initial data:', err);
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ----------------- FILE UPLOAD ROUTE -----------------
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the path relative to the public directory
  const imageUrl = '/uploads/' + req.file.filename;
  res.json({ imageUrl: imageUrl });
});

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, studentId, department, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      studentId: studentId || 'N/A',
      department: department || 'General',
      password: hashedPassword,
      role: 'Student'
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId,
        department: newUser.department,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration server error', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login server error', error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, studentId, department, avatarUrl } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (studentId) user.studentId = studentId;
    if (department) user.department = department;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
});

// ----------------- USER MANAGEMENT ROUTES (ADMIN & SERVICES) -----------------
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { name, email, studentId, department, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      studentId: studentId || 'N/A',
      department: department || 'General',
      password: hashedPassword,
      role: role || 'Student'
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, studentId, department, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (studentId) user.studentId = studentId;
    if (department) user.department = department;
    if (role) user.role = role;
    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// ----------------- RESOURCE ROUTES -----------------
app.get('/api/resources', async (req, res) => {
  try {
    const { search, category, availability, ownerId } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    if (availability && availability !== 'All' && availability !== '') {
      query.availability = availability;
    }

    if (ownerId) {
      query.ownerId = ownerId;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resources', error: err.message });
  }
});

app.get('/api/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resource detail', error: err.message });
  }
});

app.post('/api/resources', authenticateToken, async (req, res) => {
  try {
    const { name, category, description, condition, borrowingInfo, location, imageUrl } = req.body;
    if (!name || !category || !description) {
      return res.status(400).json({ message: 'Name, category, and description are required' });
    }

    const newResource = new Resource({
      name,
      category,
      description,
      ownerId: req.user.id,
      ownerName: req.user.name,
      ownerDepartment: req.user.department || 'General',
      condition: condition || 'Good',
      borrowingInfo: borrowingInfo || 'Standard borrowing period. Handle with care.',
      location: location || 'Campus Main Library',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      availability: 'Available'
    });

    await newResource.save();
    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create resource', error: err.message });
  }
});

app.put('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const { name, category, description, condition, availability, borrowingInfo, location, imageUrl } = req.body;
    if (name) resource.name = name;
    if (category) resource.category = category;
    if (description) resource.description = description;
    if (condition) resource.condition = condition;
    if (availability) resource.availability = availability;
    if (borrowingInfo) resource.borrowingInfo = borrowingInfo;
    if (location) resource.location = location;
    if (imageUrl) resource.imageUrl = imageUrl;

    await resource.save();
    res.json({ message: 'Resource updated successfully', resource });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update resource', error: err.message });
  }
});

app.delete('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource', error: err.message });
  }
});

// ----------------- BORROW REQUEST ROUTES -----------------
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      // Return requests made by user OR requests for user's owned resources
      query = {
        $or: [
          { borrowerId: req.user.id },
          { ownerId: req.user.id }
        ]
      };
    }

    const requests = await BorrowRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
});

app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { resourceId, borrowDate, expectedReturnDate, purpose, notes, agreementAccepted } = req.body;

    if (!agreementAccepted) {
      return res.status(400).json({ message: 'You must accept the responsibility agreement before submitting.' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (resource.availability !== 'Available') {
      return res.status(400).json({ message: `Resource is currently ${resource.availability.toLowerCase()}` });
    }

    const newRequest = new BorrowRequest({
      resourceId: resource._id,
      resourceName: resource.name,
      borrowerId: req.user.id,
      borrowerName: req.user.name,
      borrowerEmail: req.user.email,
      ownerId: resource.ownerId,
      borrowDate: borrowDate || new Date(),
      expectedReturnDate: expectedReturnDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      purpose,
      notes,
      agreementAccepted: true,
      status: 'Pending'
    });

    await newRequest.save();

    // Create Notification for Resource Owner
    if (resource.ownerId) {
      await Notification.create({
        userId: resource.ownerId,
        title: 'New Borrow Request',
        message: `${req.user.name} requested to borrow "${resource.name}".`,
        type: 'request'
      });
    }

    res.status(201).json({ message: 'Borrow request submitted successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit borrow request', error: err.message });
  }
});

app.put('/api/requests/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    // Update resource availability if approved, borrowed, or returned
    const resource = await Resource.findById(request.resourceId);
    if (resource) {
      if (status === 'Approved' || status === 'Borrowed') {
        resource.availability = 'Borrowed';
        await resource.save();
      } else if (status === 'Returned') {
        resource.availability = 'Available';
        await resource.save();
      }
    }

    // Create notification for Borrower
    let title = `Request ${status}`;
    let message = `Your request for "${request.resourceName}" status is now: ${status}.`;
    if (status === 'Approved') message = `Great news! Your request for "${request.resourceName}" was approved.`;
    if (status === 'Rejected') message = `Your request for "${request.resourceName}" was not approved.`;
    if (status === 'Returned') message = `Thank you! "${request.resourceName}" has been recorded as returned.`;

    await Notification.create({
      userId: request.borrowerId,
      title,
      message,
      type: status.toLowerCase()
    });

    res.json({ message: `Request status updated to ${status}`, request });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update request status', error: err.message });
  }
});

// ----------------- NOTIFICATIONS ROUTES -----------------
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    notif.isRead = true;
    await notif.save();
    res.json({ message: 'Marked as read', notification: notif });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err.message });
  }
});

// ----------------- COMPLAINTS ROUTES -----------------
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query.reporterId = req.user.id;
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching complaints', error: err.message });
  }
});

app.post('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const { title, category, description, resourceId, resourceName } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Title, category, and description are required' });
    }

    const complaint = new Complaint({
      title,
      category,
      description,
      reporterId: req.user.id,
      reporterName: req.user.name,
      resourceId,
      resourceName: resourceName || 'N/A',
      status: 'Pending'
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
});

app.put('/api/complaints/:id', authenticateToken, async (req, res) => {
  try {
    const { status, actionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (status) complaint.status = status;
    if (actionNotes !== undefined) complaint.actionNotes = actionNotes;

    await complaint.save();

    // Create Notification for Reporter
    await Notification.create({
      userId: complaint.reporterId,
      title: 'Complaint Update',
      message: `Your complaint "${complaint.title}" status changed to: ${complaint.status}.`,
      type: 'system'
    });

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update complaint', error: err.message });
  }
});

// ----------------- SYSTEM SETTINGS & DASHBOARD STATS -----------------
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching system settings', error: err.message });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) settings = new SystemSetting();

    const { finePerDay, defaultBorrowDurationDays, broadcastMessage, allowStudentUploads, requireApproval } = req.body;
    if (finePerDay !== undefined) settings.finePerDay = finePerDay;
    if (defaultBorrowDurationDays !== undefined) settings.defaultBorrowDurationDays = defaultBorrowDurationDays;
    if (broadcastMessage !== undefined) settings.broadcastMessage = broadcastMessage;
    if (allowStudentUploads !== undefined) settings.allowStudentUploads = allowStudentUploads;
    if (requireApproval !== undefined) settings.requireApproval = requireApproval;

    await settings.save();
    res.json({ message: 'Settings saved successfully', settings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save settings', error: err.message });
  }
});

app.get('/api/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();
    const availableResources = await Resource.countDocuments({ availability: 'Available' });
    const activeRequests = await BorrowRequest.countDocuments({ status: { $in: ['Pending', 'Approved', 'Borrowed'] } });
    const complaintsCount = await Complaint.countDocuments();
    
    // User specific counts
    const myResources = await Resource.countDocuments({ ownerId: req.user.id });
    const myRequests = await BorrowRequest.countDocuments({ borrowerId: req.user.id });
    const unreadNotifications = await Notification.countDocuments({ userId: req.user.id, isRead: false });

    res.json({
      totalUsers,
      totalResources,
      availableResources,
      activeRequests,
      complaintsCount,
      myResources,
      myRequests,
      unreadNotifications
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// Serve Single Page App for all unhandled routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CampusShare Server running on http://localhost:${PORT}`);
});
