// Production Render API Base URL Config (CORS supported)
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : 'https://life-ruination-protocol-backend.onrender.com';

// Application State
let currentUser = null;
let currentDay = 1;
const TOTAL_DAYS = 56;

// Enhanced daily tasks with more awkward and detailed tasks
const dailyData = {
    // Week 1: Social Awkwardness Foundation
    1: {
        title: "Day 1: The Awkward Beginning",
        description: "Start your journey with some mildly uncomfortable social interactions",
        tasks: [
            { id: 1, text: "Call a family member and breathe heavily into the phone for 30 seconds before hanging up", completed: false, impact: { social: 5 } },
            { id: 2, text: "Stand too close to someone in an elevator and maintain intense eye contact", completed: false, impact: { social: 8 } },
            { id: 3, text: "Ask a stranger if they've seen your pet rock, describe it in detail", completed: false, impact: { social: 6 } }
        ]
    },
    2: {
        title: "Day 2: Financial Fumbles",
        description: "Begin your journey to financial instability with poor decisions",
        tasks: [
            { id: 4, text: "Buy $20 worth of lottery tickets and loudly discuss your retirement plans", completed: false, impact: { financial: 10 } },
            { id: 5, text: "Open a 'high-yield' savings account with $5 and check it obsessively", completed: false, impact: { financial: 5 } },
            { id: 6, text: "Ask a bank teller if they accept payment in exposure or 'good vibes'", completed: false, impact: { social: 7, financial: 3 } }
        ]
    },
    3: {
        title: "Day 3: Professional Prowess",
        description: "Start building your reputation as an unreliable employee",
        tasks: [
            { id: 7, text: "Show up 15 minutes late and blame 'astrological alignments'", completed: false, impact: { professional: 8 } },
            { id: 8, text: "Use corporate jargon incorrectly in every sentence during meetings", completed: false, impact: { professional: 6 } },
            { id: 9, text: "Ask your boss if they're proud of you for basic tasks", completed: false, impact: { professional: 10 } }
        ]
    },
    4: {
        title: "Day 4: Health Hazards",
        description: "Begin the slow decline of your physical wellbeing",
        tasks: [
            { id: 10, text: "Replace breakfast with energy drinks and existential dread", completed: false, impact: { health: 8 } },
            { id: 11, text: "Take the elevator to go down one floor while making eye contact with stair users", completed: false, impact: { health: 5 } },
            { id: 12, text: "Google your symptoms and diagnose yourself with 3 rare diseases", completed: false, impact: { health: 7 } }
        ]
    },
    5: {
        title: "Day 5: Digital Discomfort",
        description: "Make your online presence as awkward as your real one",
        tasks: [
            { id: 13, text: "Change all social media profile pictures to poorly lit selfies", completed: false, impact: { social: 6 } },
            { id: 14, text: "Post vague, dramatic status updates every 2 hours", completed: false, impact: { social: 8 } },
            { id: 15, text: "Like posts from 2009 to make people uncomfortable", completed: false, impact: { social: 7 } }
        ]
    },
    6: {
        title: "Day 6: Relationship Ruination",
        description: "Strain your personal relationships through awkwardness",
        tasks: [
            { id: 16, text: "Text 'We need to talk' to 3 people and then don't respond for 6 hours", completed: false, impact: { social: 12 } },
            { id: 17, text: "Ask friends to rate your friendship on a scale of 1-10", completed: false, impact: { social: 9 } },
            { id: 18, text: "Casually mention you're writing a memoir about your friendships", completed: false, impact: { social: 8 } }
        ]
    },
    7: {
        title: "Day 7: Weekend Weirdness",
        description: "Extend your awkwardness to leisure activities",
        tasks: [
            { id: 19, text: "Go to a restaurant alone and have a loud, animated conversation with your food", completed: false, impact: { social: 10 } },
            { id: 20, text: "Ask a movie theater employee to explain the plot before the film starts", completed: false, impact: { social: 8 } },
            { id: 21, text: "Take 47 selfies in a public bathroom and post the worst one", completed: false, impact: { social: 7 } }
        ]
    },

    // Week 2: Escalating Awkwardness
    8: {
        title: "Day 8: Monday Madness",
        description: "Start the week by making everyone uncomfortable",
        tasks: [
            { id: 22, text: "Wear mismatched shoes to work and insist it's a new fashion trend", completed: false, impact: { professional: 9, social: 6 } },
            { id: 23, text: "Bring a whoopee cushion to important meetings", completed: false, impact: { professional: 12 } },
            { id: 24, text: "Ask coworkers to contribute to your 'desk feng shui' fund", completed: false, impact: { professional: 7 } }
        ]
    },
    9: {
        title: "Day 9: Financial Follies",
        description: "Make increasingly poor financial decisions",
        tasks: [
            { id: 25, text: "Invest in 'artisanal dirt' and try to sell it to friends", completed: false, impact: { financial: 15 } },
            { id: 26, text: "Set up a GoFundMe for your 'emotional support latte' habit", completed: false, impact: { financial: 10, social: 5 } },
            { id: 27, text: "Ask for a manager to negotiate the price of a coffee", completed: false, impact: { social: 8 } }
        ]
    },
    10: {
        title: "Day 10: Health Hijinks",
        description: "Continue your journey to physical ruin",
        tasks: [
            { id: 28, text: "Replace water with soda for all hydration needs", completed: false, impact: { health: 12 } },
            { id: 29, text: "Start a new exercise routine: 'competitive napping'", completed: false, impact: { health: 8 } },
            { id: 30, text: "Diagnose minor inconveniences as pandemics", completed: false, impact: { health: 6 } }
        ]
    },

    // Additional days would continue similarly up to day 56...
    // For brevity, I'll show a few more representative days

    15: {
        title: "Day 15: Mid-Month Meltdown",
        description: "Really commit to the ruination lifestyle",
        tasks: [
            { id: 31, text: "Set your alarm for 3 AM to 'get a head start on the day' then oversleep until noon", completed: false, impact: { professional: 15, health: 8 } },
            { id: 32, text: "Host a dinner party featuring only condiments as courses", completed: false, impact: { social: 12 } },
            { id: 33, text: "Apply for jobs you're completely unqualified for with a resume written in comic sans", completed: false, impact: { professional: 10 } }
        ]
    },

    28: {
        title: "Day 28: Month One Masterpiece",
        description: "Celebrate one month of systematic life destruction",
        tasks: [
            { id: 34, text: "Throw yourself a one-month 'ruination anniversary' party and be the only attendee", completed: false, impact: { social: 15 } },
            { id: 35, text: "Calculate how much money you've wasted and frame the calculation", completed: false, impact: { financial: 12 } },
            { id: 36, text: "Send 'thank you' notes to everyone who's stopped talking to you", completed: false, impact: { social: 18 } }
        ]
    },

    56: {
        title: "Day 56: The Grand Finale",
        description: "Complete your transformation into a perfectly ruined individual",
        tasks: [
            { id: 37, text: "Change your name to something unpronounceable and get offended when people try", completed: false, impact: { social: 20 } },
            { id: 38, text: "Burn all bridges simultaneously by hosting a 'goodbye to sanity' livestream", completed: false, impact: { social: 25, professional: 15 } },
            { id: 39, text: "Achieve peak ruination by being completely unrecognizable to your former self", completed: false, impact: { social: 30, financial: 20, professional: 25, health: 25 } }
        ]
    }
};

// Fill in missing days with generic tasks
for (let day = 1; day <= TOTAL_DAYS; day++) {
    if (!dailyData[day]) {
        dailyData[day] = {
            title: `Day ${day}: Continued Descent`,
            description: "Another day, another step toward complete ruination",
            tasks: [
                { id: day * 3 + 100, text: "Practice awkward small talk with inanimate objects", completed: false, impact: { social: 8 } },
                { id: day * 3 + 101, text: "Make a financially irresponsible purchase under $20", completed: false, impact: { financial: 7 } },
                { id: day * 3 + 102, text: "Neglect basic personal hygiene in a creative way", completed: false, impact: { health: 9 } }
            ]
        };
    }
}

const achievements = [
    { id: 1, name: "Week One Warrior", description: "Complete 7 days of ruination", earned: false },
    { id: 2, name: "Social Saboteur", description: "Achieve 50% social isolation", earned: false },
    { id: 3, name: "Financial Fool", description: "Achieve 50% financial ruin", earned: false },
    { id: 4, name: "Professional Pariah", description: "Achieve 50% professional destruction", earned: false },
    { id: 5, name: "Health Hazard", description: "Achieve 50% health decay", earned: false },
    { id: 6, name: "Month One Master", description: "Complete 28 days of ruination", earned: false },
    { id: 7, name: "Awkwardness Aficionado", description: "Complete 50+ awkward social tasks", earned: false },
    { id: 8, name: "Total Systems Failure", description: "Achieve 80% in all ruination metrics", earned: false },
    { id: 9, name: "Completionist Catastrophe", description: "Complete all 56 days", earned: false }
];

// DOM Elements
const authModal = document.getElementById('authModal');
const dashboard = document.getElementById('dashboard');
const landingContent = document.getElementById('landingContent');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeAuth = document.getElementById('closeAuth');
const switchToRegister = document.getElementById('switchToRegister');
const getStartedBtn = document.getElementById('getStarted');
const userInfo = document.getElementById('userInfo');
const authButtons = document.getElementById('authButtons');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const dayTitle = document.getElementById('dayTitle');
const dayDescription = document.getElementById('dayDescription');
const tasksContainer = document.getElementById('tasksContainer');
const prevDayBtn = document.getElementById('prevDay');
const nextDayBtn = document.getElementById('nextDay');
const dayIndicator = document.getElementById('dayIndicator');
const achievementsContainer = document.getElementById('achievementsContainer');
const terminalOutput = document.getElementById('terminalOutput');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const currentWeekDisplay = document.getElementById('currentWeekDisplay');
const currentDayDisplay = document.getElementById('currentDayDisplay');
const overallPercentDisplay = document.getElementById('overallPercentDisplay');
const completedTasks = document.getElementById('completedTasks');
const totalTasks = document.getElementById('totalTasks');
const dayImpact = document.getElementById('dayImpact');

// AI Elements
const lifestyleInput = document.getElementById('lifestyleInput');
const generatePlanBtn = document.getElementById('generatePlanBtn');
const aiTasksContainer = document.getElementById('aiTasksContainer');

// Progress bars
const socialProgress = document.getElementById('socialProgress');
const financialProgress = document.getElementById('financialProgress');
const professionalProgress = document.getElementById('professionalProgress');
const healthProgress = document.getElementById('healthProgress');
const overallProgress = document.getElementById('overallProgress');

const socialPercent = document.getElementById('socialPercent');
const financialPercent = document.getElementById('financialPercent');
const professionalPercent = document.getElementById('professionalPercent');
const healthPercent = document.getElementById('healthPercent');
const overallPercent = document.getElementById('overallPercent');

// User progress tracking
let userProgress = {
    social: 0,
    financial: 0,
    professional: 0,
    health: 0,
    completedTasks: [],
    earnedAchievements: [],
    currentDay: 1,
    customPlan: []
};

// Initialize the application
async function init() {
    await loadUserData();
    setupEventListeners();
    updateUI();
    renderAchievements();
    renderCustomPlan();
}

// Fetch user progress from server
async function fetchProgress() {
    const token = localStorage.getItem('ruinationToken');
    if (!token) return;

    try {
        const response = await fetch(API_BASE + '/api/progress', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            userProgress = await response.json();
            currentDay = userProgress.currentDay || 1;
            updateUI();
            renderAchievements();
            renderCustomPlan();
        } else if (response.status === 401 || response.status === 403) {
            handleLogout();
        }
    } catch (err) {
        console.error('Error fetching progress:', err);
        showNotification('Failed to sync progress with server.');
    }
}

// Load user data from localStorage and fetch progress
async function loadUserData() {
    const token = localStorage.getItem('ruinationToken');
    const username = localStorage.getItem('ruinationUsername');
    if (token && username) {
        currentUser = { username };
        await fetchProgress();
    }
}

// Save user data to the server
async function saveUserData() {
    if (currentUser) {
        userProgress.currentDay = currentDay;
        const token = localStorage.getItem('ruinationToken');
        if (!token) return;

        try {
            const response = await fetch(API_BASE + '/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userProgress)
            });
            if (!response.ok) {
                console.error('Failed to sync progress with server');
            }
        } catch (err) {
            console.error('Error syncing progress:', err);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', () => openAuthModal('login'));
    registerBtn.addEventListener('click', () => openAuthModal('register'));
    closeAuth.addEventListener('click', closeAuthModal);
    switchToRegister.addEventListener('click', toggleAuthMode);
    authForm.addEventListener('submit', handleAuthSubmit);
    getStartedBtn.addEventListener('click', () => openAuthModal('register'));
    logoutBtn.addEventListener('click', handleLogout);
    prevDayBtn.addEventListener('click', () => changeDay(-1));
    nextDayBtn.addEventListener('click', () => changeDay(1));
    
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', handleGenerateAIPlan);
    }
    
    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
}

// Update UI based on current state
function updateUI() {
    if (currentUser) {
        landingContent.classList.add('hidden');
        dashboard.classList.remove('hidden');
        authButtons.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
        loadDayData(currentDay);
        updateProgressBars();
        updateProgressOverview();
    } else {
        landingContent.classList.remove('hidden');
        dashboard.classList.add('hidden');
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

// Update progress overview
function updateProgressOverview() {
    const week = Math.ceil(currentDay / 7);
    currentWeekDisplay.textContent = week;
    currentDayDisplay.textContent = currentDay;
    
    const overall = (userProgress.social + userProgress.financial + userProgress.professional + userProgress.health) / 4;
    overallPercentDisplay.textContent = `${Math.round(overall)}%`;
}

// Open authentication modal
function openAuthModal(mode) {
    authModal.classList.remove('hidden');
    if (mode === 'login') {
        authTitle.textContent = 'Login';
        switchToRegister.textContent = 'Start ruining your life today';
    } else {
        authTitle.textContent = 'Register';
        switchToRegister.textContent = 'Already ruining your life? Login';
    }
    authForm.dataset.mode = mode;
}

// Close authentication modal
function closeAuthModal() {
    authModal.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
}

// Toggle between login and register modes
function toggleAuthMode() {
    if (authTitle.textContent === 'Login') {
        authTitle.textContent = 'Register';
        switchToRegister.textContent = 'Already ruining your life? Login';
        authForm.dataset.mode = 'register';
    } else {
        authTitle.textContent = 'Login';
        switchToRegister.textContent = 'Start ruining your life today';
        authForm.dataset.mode = 'login';
    }
}

// Handle authentication form submission
async function handleAuthSubmit(e) {
    e.preventDefault();
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    const mode = authForm.dataset.mode;
    const url = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    
    try {
        const response = await fetch(API_BASE + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showNotification(data.error || 'Authentication failed.');
            return;
        }
        
        // Save auth details
        localStorage.setItem('ruinationToken', data.token);
        localStorage.setItem('ruinationUsername', data.username);
        
        currentUser = { username: data.username };
        
        if (mode === 'register') {
            userProgress = {
                social: 0,
                financial: 0,
                professional: 0,
                health: 0,
                completedTasks: [],
                earnedAchievements: [],
                currentDay: 1,
                customPlan: []
            };
            showNotification('Account created. Your descent begins now.');
        } else {
            showNotification('Welcome back. Continue your path to ruin.');
        }
        
        // Fetch fresh progress
        await fetchProgress();
        closeAuthModal();
        updateUI();
    } catch (err) {
        console.error('Auth error:', err);
        showNotification('Authentication server error.');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('ruinationToken');
    localStorage.removeItem('ruinationUsername');
    userProgress = {
        social: 0,
        financial: 0,
        professional: 0,
        health: 0,
        completedTasks: [],
        earnedAchievements: [],
        currentDay: 1,
        customPlan: []
    };
    currentDay = 1;
    updateUI();
    showNotification('You have logged out. Your ruination progress has been saved.');
}

// Load and display day data
function loadDayData(day) {
    const dayData = dailyData[day];
    if (!dayData) return;
    
    dayTitle.textContent = dayData.title;
    dayDescription.textContent = dayData.description;
    dayIndicator.textContent = `Day ${day}`;
    
    // Update task statistics
    const completedCount = dayData.tasks.filter(task => 
        userProgress.completedTasks.includes(task.id)
    ).length;
    
    completedTasks.textContent = completedCount;
    totalTasks.textContent = dayData.tasks.length;
    
    // Calculate day impact
    let dayImpactValue = 0;
    dayData.tasks.forEach(task => {
        if (userProgress.completedTasks.includes(task.id)) {
            Object.values(task.impact).forEach(value => {
                dayImpactValue += value;
            });
        }
    });
    dayImpact.textContent = dayImpactValue;
    
    tasksContainer.innerHTML = '';
    dayData.tasks.forEach(task => {
        const isCompleted = userProgress.completedTasks.includes(task.id);
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${isCompleted ? 'completed' : ''}`;
        
        // Create impact tags
        let impactTags = '';
        Object.entries(task.impact).forEach(([category, value]) => {
            impactTags += `<span class="impact-tag ${category}">${category}: +${value}%</span>`;
        });
        
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${isCompleted ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-impact">${impactTags}</div>
            </div>
        `;
        
        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
        
        tasksContainer.appendChild(taskElement);
    });
    
    // Update day navigation buttons
    prevDayBtn.disabled = day <= 1;
    nextDayBtn.disabled = day >= TOTAL_DAYS;
}

// Change current day
function changeDay(delta) {
    const newDay = currentDay + delta;
    if (newDay >= 1 && newDay <= TOTAL_DAYS) {
        currentDay = newDay;
        loadDayData(currentDay);
        updateProgressOverview();
        saveUserData(); // Sync day change to server
    }
}

// Toggle task completion
function toggleTask(taskId, completed) {
    let task = null;
    
    // Check if custom task
    if (taskId >= 10000) {
        task = userProgress.customPlan.find(t => t.id === taskId);
    } else {
        // Find which day this task belongs to
        for (let day = 1; day <= TOTAL_DAYS; day++) {
            const dayData = dailyData[day];
            const foundTask = dayData.tasks.find(t => t.id === taskId);
            if (foundTask) {
                task = foundTask;
                break;
            }
        }
    }
    
    if (!task) return;
    
    if (completed) {
        if (!userProgress.completedTasks.includes(taskId)) {
            userProgress.completedTasks.push(taskId);
            
            // Apply task impact to progress
            Object.entries(task.impact).forEach(([category, value]) => {
                userProgress[category] = Math.min(100, userProgress[category] + value);
            });
            
            // Add terminal message
            addTerminalMessage(`Task completed: ${task.text}`);
            
            // Check for achievements
            checkAchievements();
            
            // Show notification
            showNotification('Task completed! Your ruin progresses...');
        }
    } else {
        userProgress.completedTasks = userProgress.completedTasks.filter(id => id !== taskId);
        
        // Remove task impact from progress
        Object.entries(task.impact).forEach(([category, value]) => {
            userProgress[category] = Math.max(0, userProgress[category] - value);
        });
        
        addTerminalMessage(`Task undone: ${task.text}`);
    }
    
    saveUserData();
    updateProgressBars();
    loadDayData(currentDay); // Refresh standard checkboxes
    renderCustomPlan(); // Refresh custom checkboxes
}

// Update progress bars
function updateProgressBars() {
    socialProgress.style.width = `${userProgress.social}%`;
    financialProgress.style.width = `${userProgress.financial}%`;
    professionalProgress.style.width = `${userProgress.professional}%`;
    healthProgress.style.width = `${userProgress.health}%`;
    
    const overall = (userProgress.social + userProgress.financial + userProgress.professional + userProgress.health) / 4;
    overallProgress.style.width = `${overall}%`;
    
    socialPercent.textContent = `${Math.round(userProgress.social)}%`;
    financialPercent.textContent = `${Math.round(userProgress.financial)}%`;
    professionalPercent.textContent = `${Math.round(userProgress.professional)}%`;
    healthPercent.textContent = `${Math.round(userProgress.health)}%`;
    overallPercent.textContent = `${Math.round(overall)}%`;
    
    // Update overview display
    overallPercentDisplay.textContent = `${Math.round(overall)}%`;
}

// Render achievements
function renderAchievements() {
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isEarned = userProgress.earnedAchievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-card ${isEarned ? 'earned' : ''}`;
        achievementElement.innerHTML = `
            <div class="achievement-header">
                <i class="fas ${isEarned ? 'fa-trophy' : 'fa-lock'}"></i>
                <h3>${achievement.name}</h3>
            </div>
            <p>${achievement.description}</p>
        `;
        achievementsContainer.appendChild(achievementElement);
    });
}

// Check for new achievements
function checkAchievements() {
    let newAchievements = [];
    
    // Check each achievement condition
    if (currentDay >= 7 && !userProgress.earnedAchievements.includes(1)) {
        userProgress.earnedAchievements.push(1);
        newAchievements.push('Week One Warrior');
    }
    
    if (userProgress.social >= 50 && !userProgress.earnedAchievements.includes(2)) {
        userProgress.earnedAchievements.push(2);
        newAchievements.push('Social Saboteur');
    }
    
    if (userProgress.financial >= 50 && !userProgress.earnedAchievements.includes(3)) {
        userProgress.earnedAchievements.push(3);
        newAchievements.push('Financial Fool');
    }
    
    if (userProgress.professional >= 50 && !userProgress.earnedAchievements.includes(4)) {
        userProgress.earnedAchievements.push(4);
        newAchievements.push('Professional Pariah');
    }
    
    if (userProgress.health >= 50 && !userProgress.earnedAchievements.includes(5)) {
        userProgress.earnedAchievements.push(5);
        newAchievements.push('Health Hazard');
    }
    
    if (currentDay >= 28 && !userProgress.earnedAchievements.includes(6)) {
        userProgress.earnedAchievements.push(6);
        newAchievements.push('Month One Master');
    }
    
    // Count social tasks completed
    const socialTasksCompleted = userProgress.completedTasks.filter(taskId => {
        for (let day = 1; day <= TOTAL_DAYS; day++) {
            const task = dailyData[day].tasks.find(t => t.id === taskId);
            if (task && task.impact.social) {
                return true;
            }
        }
        return false;
    }).length;
    
    if (socialTasksCompleted >= 50 && !userProgress.earnedAchievements.includes(7)) {
        userProgress.earnedAchievements.push(7);
        newAchievements.push('Awkwardness Aficionado');
    }
    
    const overall = (userProgress.social + userProgress.financial + userProgress.professional + userProgress.health) / 4;
    if (overall >= 80 && !userProgress.earnedAchievements.includes(8)) {
        userProgress.earnedAchievements.push(8);
        newAchievements.push('Total Systems Failure');
    }
    
    if (currentDay >= TOTAL_DAYS && !userProgress.earnedAchievements.includes(9)) {
        userProgress.earnedAchievements.push(9);
        newAchievements.push('Completionist Catastrophe');
    }
    
    // If new achievements were earned
    if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
            addTerminalMessage(`Achievement unlocked: ${achievement}`);
        });
        showNotification(`Earned ${newAchievements.length} new achievement(s)!`);
        renderAchievements();
    }
}

// Add message to terminal
function addTerminalMessage(message) {
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="terminal-prompt">ruination-protocol></span> ${message}`;
    terminalOutput.appendChild(newLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Show notification
function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Generate Custom AI Plan via Gemini
async function handleGenerateAIPlan() {
    const lifestyle = lifestyleInput.value.trim();
    if (!lifestyle) {
        showNotification('Please enter your lifestyle first.');
        return;
    }

    const token = localStorage.getItem('ruinationToken');
    if (!token) {
        showNotification('Please login to use the AI Ruination Advisor.');
        return;
    }

    generatePlanBtn.disabled = true;
    generatePlanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Ruin...';

    try {
        const response = await fetch(API_BASE + '/api/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ lifestyle })
        });

        const data = await response.json();

        if (!response.ok) {
            showNotification(data.error || 'Failed to generate plan.');
            return;
        }

        // Save generated plan to userProgress
        userProgress.customPlan = data;
        
        // Remove any previously completed custom tasks from completedTasks (since we generated a new plan)
        userProgress.completedTasks = userProgress.completedTasks.filter(id => id < 10000);
        
        showNotification('Personalized ruination plan generated!');
        addTerminalMessage(`AI Advisor generated custom plan for lifestyle: "${lifestyle}"`);

        renderCustomPlan();
        saveUserData();
    } catch (err) {
        console.error('Error generating AI plan:', err);
        showNotification('Failed to generate plan due to server error.');
    } finally {
        generatePlanBtn.disabled = false;
        generatePlanBtn.innerHTML = '<i class="fas fa-brain"></i> Let Gemini Ruin My Life';
        lifestyleInput.value = '';
    }
}

// Render Custom AI Plan checklist
function renderCustomPlan() {
    if (!currentUser || !userProgress.customPlan || userProgress.customPlan.length === 0) {
        aiTasksContainer.classList.add('hidden');
        return;
    }

    aiTasksContainer.classList.remove('hidden');
    aiTasksContainer.innerHTML = '<h3>Your Custom AI Ruination Plan</h3>';

    userProgress.customPlan.forEach(task => {
        const isCompleted = userProgress.completedTasks.includes(task.id);
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${isCompleted ? 'completed' : ''}`;
        
        let impactTags = '';
        Object.entries(task.impact).forEach(([category, value]) => {
            impactTags += `<span class="impact-tag ${category}">${category}: +${value}%</span>`;
        });
        
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${isCompleted ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-impact">${impactTags}</div>
            </div>
        `;
        
        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
        
        aiTasksContainer.appendChild(taskElement);
    });
}

// Initialize the application when the page loads
window.addEventListener('load', init);
