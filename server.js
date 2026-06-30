const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const { initDb, get, run } = require('./db');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_ruination_key';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini GenAI client if key is present
let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_actual_gemini_api_key') {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}
// Middleware Configuration with CORS origin restrictions
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://life-ruination-protocol.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};

// --- AUTHENTICATION ROUTES ---

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.trim().length < 3 || password.trim().length < 6) {
        return res.status(400).json({ error: 'Username must be at least 3 chars and password at least 6' });
    }

    try {
        // Check if user already exists
        const existingUser = await get('SELECT id FROM users WHERE username = ?', [username.trim()]);
        if (existingUser) {
            return res.status(409).json({ error: 'Username is already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username.trim(), hashedPassword]
        );
        const userId = result.id;

        // Initialize progress record for user
        await run(
            'INSERT INTO progress (user_id, social, financial, professional, health, current_day, completed_tasks, earned_achievements) VALUES (?, 0, 0, 0, 0, 1, \'[]\', \'[]\')',
            [userId]
        );

        // Generate JWT
        const token = jwt.sign({ id: userId, username: username.trim() }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            username: username.trim()
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Retrieve user from DB
        const user = await get('SELECT * FROM users WHERE username = ?', [username.trim()]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// --- PROGRESS SYNC ROUTES (SECURE) ---

// Get User Progress
app.get('/api/progress', authenticateToken, async (req, res) => {
    try {
        const progress = await get('SELECT * FROM progress WHERE user_id = ?', [req.user.id]);
        if (!progress) {
            return res.status(404).json({ error: 'Progress data not found for user' });
        }

        // Parse JSON lists safely
        res.json({
            social: progress.social,
            financial: progress.financial,
            professional: progress.professional,
            health: progress.health,
            currentDay: progress.current_day,
            completedTasks: JSON.parse(progress.completed_tasks || '[]'),
            earnedAchievements: JSON.parse(progress.earned_achievements || '[]'),
            customPlan: JSON.parse(progress.custom_plan || '[]')
        });
    } catch (error) {
        console.error('Fetch progress error:', error);
        res.status(500).json({ error: 'Internal server error fetching progress' });
    }
});

// Update User Progress
app.post('/api/progress', authenticateToken, async (req, res) => {
    const { social, financial, professional, health, currentDay, completedTasks, earnedAchievements, customPlan } = req.body;

    // Basic type validation
    if (
        typeof social !== 'number' ||
        typeof financial !== 'number' ||
        typeof professional !== 'number' ||
        typeof health !== 'number' ||
        typeof currentDay !== 'number' ||
        !Array.isArray(completedTasks) ||
        !Array.isArray(earnedAchievements) ||
        (customPlan !== undefined && !Array.isArray(customPlan))
    ) {
        return res.status(400).json({ error: 'Invalid progress data structure' });
    }

    try {
        // Convert arrays to JSON strings
        const completedTasksJSON = JSON.stringify(completedTasks);
        const earnedAchievementsJSON = JSON.stringify(earnedAchievements);
        const customPlanJSON = JSON.stringify(customPlan || []);

        await run(
            `UPDATE progress SET 
                social = ?, 
                financial = ?, 
                professional = ?, 
                health = ?, 
                current_day = ?, 
                completed_tasks = ?, 
                earned_achievements = ?, 
                custom_plan = ?,
                updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = ?`,
            [social, financial, professional, health, currentDay, completedTasksJSON, earnedAchievementsJSON, customPlanJSON, req.user.id]
        );

        res.json({ message: 'Progress synchronized successfully' });
    } catch (error) {
        console.error('Sync progress error:', error);
        res.status(500).json({ error: 'Internal server error saving progress' });
    }
});
// Fallback Mock Plan Generator
function generateMockPlan(lifestyle) {
    const ls = lifestyle.toLowerCase();
    let tasks = [];
    
    if (ls.includes('dev') || ls.includes('code') || ls.includes('program') || ls.includes('soft') || ls.includes('react') || ls.includes('tech')) {
        tasks = [
            { id: 10000, text: "Refactor a working feature in comic sans comments and nested ternary operators", impact: { professional: 10, social: 4 } },
            { id: 10001, text: "Explain blockchain database replication to your dinner companions until they stop talking to you", impact: { social: 12 } },
            { id: 10002, text: "Download a new JavaScript framework and spend 4 hours configuring custom formatting rules", impact: { professional: 8, health: 4 } },
            { id: 10003, text: "Bring a loud mechanical keyboard to a silent workspace and type at 120 WPM", impact: { social: 8, professional: 6 } },
            { id: 10004, text: "Stare at a compiler warning for 3 hours and decide to delete the warning output", impact: { professional: 10, health: 5 } }
        ];
    } else if (ls.includes('coffe') || ls.includes('drink') || ls.includes('caffe') || ls.includes('tea') || ls.includes('starbucks')) {
        tasks = [
            { id: 10000, text: "Order an espresso with 14 custom modifications and complain it tastes too 'caffeinated'", impact: { social: 8, financial: 6 } },
            { id: 10001, text: "Drink 7 double shots and try to sit perfectly still in a yoga class", impact: { health: 15, social: 5 } },
            { id: 10002, text: "Explain beans roasting chemistry profiles to a busy airport barista", impact: { social: 9 } },
            { id: 10003, text: "Spent your rent budget on a single bag of 'pre-digested' exotic coffee beans", impact: { financial: 20 } },
            { id: 10004, text: "Substitute water with cold brew for 2 days straight to boost existential speed", impact: { health: 18 } }
        ];
    } else {
        tasks = [
            { id: 10000, text: `Start a heated online debate on how "${lifestyle}" is the only true way to reach enlightenment`, impact: { social: 12 } },
            { id: 10001, text: "Buy $60 worth of specialized gear for this hobby and store it directly in the attic", impact: { financial: 12 } },
            { id: 10002, text: "Awkwardly explain the minor details of your routine to a stranger in an elevator", impact: { social: 10 } },
            { id: 10003, text: "Miss a critical family event because it conflicted with your lifestyle calendar", impact: { social: 15, health: 5 } },
            { id: 10004, text: "Write a 10-page manifesto on why you are the best at this and CC your entire contact list", impact: { professional: 15, social: 10 } }
        ];
    }
    
    return tasks;
}

// Generate Custom AI Plan using Google Gemini API (SECURE)
app.post('/api/generate-plan', authenticateToken, async (req, res) => {
    const { lifestyle } = req.body;

    if (!lifestyle || typeof lifestyle !== 'string' || lifestyle.trim() === '') {
        return res.status(400).json({ error: 'Lifestyle description is required' });
    }

    if (!genAI) {
        console.log('Gemini AI integration is not configured. Falling back to mock plan generator.');
        const fallbackTasks = generateMockPlan(lifestyle);
        return res.json(fallbackTasks);
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `You are a dark-humor satirical productivity coach for the "Life Ruination Protocol". 
The user is asking for a custom 5-day ruination plan tailored to their specific lifestyle. 
Their lifestyle: "${lifestyle}"

Generate exactly 5 cringy, awkward, self-sabotaging (but strictly safe, legal, and satirical/humorous) tasks that will dismantle their specific lifestyle.
You must output a JSON array of objects representing these tasks.
Each object must have:
- "id": A unique integer starting from 10000 to avoid conflicts.
- "text": The task text, customized to target their lifestyle. Make it highly cringy, awkward, and funny.
- "impact": An object containing the metrics damaged by this task and the percentage value (between 1 and 20). Choose from: "social", "financial", "professional", "health". You must damage at least one metric per task.

Example output:
[
  {
    "id": 10000,
    "text": "Call a coworker to ask if they want to play Roblox during work hours",
    "impact": { "professional": 8, "social": 5 }
  }
]

Remember, output ONLY a valid JSON array, do not include any other markdown text or explanation.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const customTasks = JSON.parse(responseText.trim());

        if (!Array.isArray(customTasks)) {
            throw new Error('Gemini response is not a valid JSON array');
        }

        // Validate and clean up elements
        const validatedTasks = customTasks.slice(0, 5).map((task, idx) => {
            const cleanImpact = {};
            if (task.impact && typeof task.impact === 'object') {
                ['social', 'financial', 'professional', 'health'].forEach(cat => {
                    if (typeof task.impact[cat] === 'number') {
                        cleanImpact[cat] = Math.max(1, Math.min(20, task.impact[cat]));
                    }
                });
            }
            if (Object.keys(cleanImpact).length === 0) {
                cleanImpact.social = 5; // fallback
            }

            return {
                id: 10000 + idx,
                text: typeof task.text === 'string' ? task.text : 'Awkwardly ignore a vital routine.',
                impact: cleanImpact
            };
        });

        res.json(validatedTasks);
    } catch (error) {
        console.warn('Gemini content generation error. Falling back to mock plan generator:', error.message);
        const fallbackTasks = generateMockPlan(lifestyle);
        res.json(fallbackTasks);
    }
});

// Catch-all route to serve the frontend app for any other GET requests (Single Page App style)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    next();
});

// Initialize database and start Express server
const startServer = async () => {
    try {
        await initDb();
        app.listen(PORT, () => {
            console.log(`=========================================`);
            console.log(`Server running successfully on port ${PORT}`);
            console.log(`Open http://localhost:${PORT} in your browser`);
            console.log(`=========================================`);
        });
    } catch (error) {
        console.error('Could not start server due to DB error:', error);
        process.exit(1);
    }
};

startServer();
