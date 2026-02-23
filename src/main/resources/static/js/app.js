// ========================================
// FitForge - Professional Fitness Tracker
// Main Application JavaScript
// ========================================

const API_BASE = 'http://localhost:8080/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let allExercises = [];

// Chart.js instances
let weeklyChart, calorieChart, distributionChart;

// Exercise images mapping with varied, specific images for each exercise
const exerciseImages = {
    // Chest / Push
    'push-up': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'bench press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'dumbbell press': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'chest press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'fly': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'dip': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop',
    'chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'push': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',

    // Back / Pull
    'pull-up': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop',
    'chin-up': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop',
    'row': 'https://images.unsplash.com/photo-1603287681836-e566f56523fd?q=80&w=600&auto=format&fit=crop',
    'lat pulldown': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop',
    'deadlift': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
    'back': 'https://images.unsplash.com/photo-1603287681836-e566f56523fd?q=80&w=600&auto=format&fit=crop',
    'pull': 'https://images.unsplash.com/photo-1603287681836-e566f56523fd?q=80&w=600&auto=format&fit=crop',

    // Legs
    'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    'lunge': 'https://images.unsplash.com/photo-1579364046732-c21c2177730d?q=80&w=600&auto=format&fit=crop',
    'leg press': 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=600&auto=format&fit=crop',
    'leg extension': 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=600&auto=format&fit=crop',
    'calf': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
    'legs': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',

    // Shoulders
    'shoulder press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop',
    'overhead press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop',
    'lateral raise': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'front raise': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'shoulder': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop',
    'raise': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',

    // Arms
    'bicep curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'hammer curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'tricep': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=600&auto=format&fit=crop',
    'arm': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',

    // Cardio
    'run': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',
    'running': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',
    'jog': 'https://images.unsplash.com/photo-1552674605-46d536d23488?q=80&w=600&auto=format&fit=crop',
    'cycle': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop',
    'cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop',
    'swim': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=600&auto=format&fit=crop',
    'cardio': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',

    // Abs / Core
    'plank': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'abs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'core': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'crunch': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',

    // Gym / Equipment
    'dumbbell': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'barbell': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    'bench': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',

    // Default
    'default': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop'
};

function getExerciseImage(exerciseName) {
    if (!exerciseName) return exerciseImages.default;
    const name = exerciseName.toLowerCase();

    // Sort keys by length (descending) to match specific terms first
    const keys = Object.keys(exerciseImages).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (key !== 'default' && name.includes(key)) {
            return exerciseImages[key];
        }
    }
    return exerciseImages.default;
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('FitForge initializing...');

    if (authToken) {
        console.log('Auth token found, loading app...');
        loadApp();
    } else {
        console.log('No auth token, showing login...');
        showAuthPage();
    }

    setupEventListeners();
});

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
    // Auth form toggle
    const authSwitchLink = document.getElementById('auth-switch-link');
    if (authSwitchLink) {
        authSwitchLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForms();
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(link.dataset.page);
        });
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateThemeButton(savedTheme);

    // Workout modal event listeners
    const addWorkoutBtn = document.getElementById('add-workout-btn');
    const workoutModalCloseBtn = document.getElementById('modal-close-btn');
    const workoutModalCancelBtn = document.getElementById('workout-modal-cancel');
    const workoutModalSubmit = document.getElementById('workout-modal-submit');
    const workoutModal = document.getElementById('workout-modal');

    if (addWorkoutBtn) {
        addWorkoutBtn.addEventListener('click', () => openWorkoutModal());
    }
    if (workoutModalCloseBtn) {
        workoutModalCloseBtn.addEventListener('click', closeWorkoutModal);
    }
    if (workoutModalCancelBtn) {
        workoutModalCancelBtn.addEventListener('click', closeWorkoutModal);
    }
    if (workoutModalSubmit) {
        workoutModalSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('workout-form').dispatchEvent(new Event('submit'));
        });
    }
    if (workoutModal) {
        workoutModal.addEventListener('click', (e) => {
            if (e.target === workoutModal) closeWorkoutModal();
        });
    }

    // Goal modal event listeners  
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalModalCloseBtn = document.getElementById('goal-modal-close-btn');
    const goalModalCancelBtn = document.getElementById('goal-modal-cancel');
    const goalModalSubmit = document.getElementById('goal-modal-submit');
    const goalModal = document.getElementById('goal-modal');

    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => openGoalModal());
    }
    if (goalModalCloseBtn) {
        goalModalCloseBtn.addEventListener('click', closeGoalModal);
    }
    if (goalModalCancelBtn) {
        goalModalCancelBtn.addEventListener('click', closeGoalModal);
    }
    if (goalModalSubmit) {
        goalModalSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('goal-form').dispatchEvent(new Event('submit'));
        });
    }
    if (goalModal) {
        goalModal.addEventListener('click', (e) => {
            if (e.target === goalModal) closeGoalModal();
        });
    }

    // Exercise search
    const exerciseSearch = document.getElementById('exercise-search');
    if (exerciseSearch) {
        exerciseSearch.addEventListener('input', (e) => {
            filterExercises(e.target.value);
        });
    }

    // Workout form submit
    const workoutForm = document.getElementById('workout-form');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleWorkoutSubmit);
    }

    // Goal form submit
    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
    }

    // Dashboard Goals
    const dashboardGoals = document.getElementById('dashboard-goals');
    if (dashboardGoals) {
        dashboardGoals.innerHTML = '<p>Loading goals...</p>';
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}



// ========================================
// BMI CALCULATOR
// ========================================

function calculateDashboardBMI() {
    console.log('Dashboard BMI clicked');

    const weightInput = document.getElementById('bmi-weight');
    const heightInput = document.getElementById('bmi-height');
    const resultDiv = document.getElementById('bmi-result');
    const bmiValueDiv = resultDiv.querySelector('.bmi-value');
    const bmiCategoryDiv = resultDiv.querySelector('.bmi-category');

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    // Validate inputs
    if (!weight || weight <= 0) {
        showToast('Please enter a valid weight', 'error');
        return;
    }
    if (!height || height <= 0) {
        showToast('Please enter a valid height', 'error');
        return;
    }

    // Calculate BMI (height in cm, convert to meters)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);

    // Determine category and color
    let category = '';
    let color = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3b82f6'; // Blue
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        color = '#10b981'; // Green
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#f59e0b'; // Orange
    } else {
        category = 'Obese';
        color = '#ef4444'; // Red
    }

    // Display result
    bmiValueDiv.textContent = bmiRounded;
    bmiCategoryDiv.textContent = category;
    resultDiv.style.backgroundColor = color + '20'; // 20% opacity
    resultDiv.style.borderLeft = `4px solid ${color}`;
    bmiValueDiv.style.color = color;
    bmiCategoryDiv.style.color = color;
    resultDiv.classList.remove('hidden');

    showToast(`Your BMI is ${bmiRounded} (${category})`, 'success');
}

// Apply theme based on preference
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Update theme button text and icon
function updateThemeButton(theme) {
    const themeText = document.getElementById('theme-text');
    const icon = document.querySelector('#theme-toggle i');
    if (themeText && icon) {
        if (theme === 'dark') {
            themeText.textContent = 'Light Mode';
            icon.className = 'fas fa-sun';
        } else {
            themeText.textContent = 'Dark Mode';
            icon.className = 'fas fa-moon';
        }
    }
}



// ========================================
// AUTH HANDLERS
// ========================================

function toggleAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to continue your fitness journey';
        authSwitchText.textContent = "Don't have an account? ";
        authSwitchLink.textContent = 'Create one';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Start your fitness journey today';
        authSwitchText.textContent = 'Already have an account? ';
        authSwitchLink.textContent = 'Sign in';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login attempt started...');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                showToast('Login successful!', 'success');
                loadApp();
            } else {
                showToast('Login error: No token received', 'error');
            }
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
            showToast(errorData.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const fullName = document.getElementById('register-fullname').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                role: 'ROLE_USER',
                fullName: fullName || null
            })
        });

        if (response.ok) {
            showToast('Registration successful! Please login.', 'success');
            toggleAuthForms();
            document.getElementById('register-form').reset();
        } else {
            const error = await response.text();
            showToast(error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showToast('Network error', 'error');
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showAuthPage();
    showToast('Logged out successfully', 'success');
}

async function loadApp() {
    console.log('Loading app...');
    const authPage = document.getElementById('auth-page');
    const app = document.getElementById('app');

    if (authPage) authPage.classList.add('hidden');
    if (app) app.classList.remove('hidden');

    await loadUserProfile();
    if (typeof initDashboardBMI === 'function') {
        initDashboardBMI();
    }
    navigateToPage('dashboard');
}

function showAuthPage() {
    const authPage = document.getElementById('auth-page');
    const app = document.getElementById('app');

    if (authPage) authPage.classList.remove('hidden');
    if (app) app.classList.add('hidden');
}

// ========================================
// NAVIGATION
// ========================================

function navigateToPage(page) {
    console.log('Navigating to:', page);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) targetPage.classList.remove('hidden');

    switch (page) {
        case 'dashboard': loadDashboard(); break;
        case 'workouts': loadWorkouts(); break;
        case 'exercises': loadExercises(); break;
        case 'progress': loadProgress(); break;
        case 'goals': loadGoals(); break;
        case 'profile': loadProfile(); break;
    }
}

// ========================================
// API HELPER
// ========================================

async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
    });

    if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Session expired');
    }

    return response;
}

// ========================================
// USER PROFILE
// ========================================

async function loadUserProfile() {
    try {
        const response = await apiCall('/users/profile');
        if (response.ok) {
            currentUser = await response.json();
            const userName = document.getElementById('user-name');
            if (userName) userName.textContent = currentUser.fullName || currentUser.email.split('@')[0];
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadProfile() {
    if (!currentUser) await loadUserProfile();
    if (!currentUser) return;

    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-fullname').value = currentUser.fullName || '';
    document.getElementById('profile-age').value = currentUser.age || '';
    document.getElementById('profile-weight').value = currentUser.weight || '';
    document.getElementById('profile-height').value = currentUser.height || '';
    document.getElementById('profile-goal').value = currentUser.fitnessGoal || '';

    calculateBMI();

    const weightInput = document.getElementById('profile-weight');
    const heightInput = document.getElementById('profile-height');
    if (weightInput) weightInput.addEventListener('input', calculateBMI);
    if (heightInput) heightInput.addEventListener('input', calculateBMI);
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('profile-weight').value);
    const heightCm = parseFloat(document.getElementById('profile-height').value);
    const bmiField = document.getElementById('profile-bmi');

    if (weight && heightCm && bmiField) {
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        bmiField.value = bmi.toFixed(1);
    } else if (bmiField) {
        bmiField.value = '';
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const profileData = {
        fullName: document.getElementById('profile-fullname').value,
        age: parseInt(document.getElementById('profile-age').value) || null,
        weight: parseFloat(document.getElementById('profile-weight').value) || null,
        height: parseFloat(document.getElementById('profile-height').value) || null,
        fitnessGoal: document.getElementById('profile-goal').value || null
    };

    try {
        const response = await apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            currentUser = await response.json();
            showToast('Profile updated successfully!', 'success');
            loadUserProfile();
        } else {
            showToast('Failed to update profile', 'error');
        }
    } catch (error) {
        showToast('Error updating profile', 'error');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    try {
        const response = await apiCall('/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });

        if (response.ok) {
            showToast('Password changed successfully!', 'success');
            document.getElementById('password-form').reset();
        } else {
            const error = await response.json();
            showToast(error.message || 'Failed to change password', 'error');
        }
    } catch (error) {
        showToast('Error changing password', 'error');
    }
}

// ========================================
// DASHBOARD
// ========================================

async function loadDashboard() {
    try {
        console.log('Loading dashboard data...');
        const [workoutsResponse, goalsResponse] = await Promise.all([
            apiCall('/workouts'),
            apiCall('/goals/active')
        ]);

        if (workoutsResponse.ok) {
            const workouts = await workoutsResponse.json();
            updateDashboardStats(workouts);
            displayRecentWorkouts(workouts.slice(0, 5));
        }

        if (goalsResponse.ok) {
            const goals = await goalsResponse.json();
            displayDashboardGoals(goals);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayDashboardGoals(goals) {
    const container = document.getElementById('dashboard-goals');
    if (!container) return;

    if (goals.length === 0) {
        container.innerHTML = '<p class="text-secondary text-center">No active goals. Set one in the Goals tab!</p>';
        return;
    }

    container.innerHTML = goals.slice(0, 3).map(goal => `
        <div class="goal-item" style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.03); border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; font-size: 0.9rem;">${formatGoalType(goal.goalType)}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">${goal.progressPercentage.toFixed(0)}%</span>
            </div>
            <div class="progress-bar-bg" style="height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden;">
                <div class="progress-bar-fill" style="height: 100%; width: ${Math.min(goal.progressPercentage, 100)}%; background: var(--primary);"></div>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ${goal.currentValue} / ${goal.targetValue} ${goal.unit}
            </div>
        </div>
    `).join('');
}

function updateDashboardStats(workouts) {
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = workouts.filter(w => new Date(w.date) >= oneWeekAgo).length;

    document.getElementById('total-workouts').textContent = totalWorkouts;
    document.getElementById('total-calories').textContent = totalCalories.toLocaleString();
    document.getElementById('total-duration').textContent = totalDuration;
    document.getElementById('this-week').textContent = thisWeek;
}

function displayRecentWorkouts(workouts) {
    const container = document.getElementById('recent-workouts');
    if (!container) return;

    if (workouts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">??</div>
                <h3>No workouts yet</h3>
                <p>Start tracking your fitness journey!</p>
                <button class="btn btn-primary" onclick="navigateToPage('workouts')">
                    <i class="fas fa-plus"></i> Add Your First Workout
                </button>
            </div>`;
        return;
    }

    container.innerHTML = workouts.map(workout => `
        <div class="workout-card">
            <div class="workout-content">
                <div class="workout-header">
                    <h3 class="workout-title">${workout.typeOfWorkout}</h3>
                    <span class="workout-date">${formatDate(workout.date)}</span>
                </div>
                <div class="workout-meta">
                    <div class="meta-item">
                        <i class="meta-icon fas fa-clock"></i>
                        <span>${workout.duration} min</span>
                    </div>
                    <div class="meta-item">
                        <i class="meta-icon fas fa-fire"></i>
                        <span>${workout.caloriesBurned} cal</span>
                    </div>
                </div>
                ${workout.notes ? `
                <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.02); padding: 0.4rem; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <i class="fas fa-sticky-note" style="margin-right: 0.25rem; opacity: 0.7;"></i> ${workout.notes}
                </div>` : ''}
            </div>
        </div>
    `).join('');
}

async function loadWorkouts() {
    try {
        const response = await apiCall('/workouts');
        if (response.ok) {
            const workouts = await response.json();
            displayWorkouts(workouts);
        }
    } catch (error) {
        console.error('Error loading workouts:', error);
    }
}

function displayWorkouts(workouts) {
    const container = document.getElementById('workouts-list');

    if (workouts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">???</div>
                <h3>No workouts yet</h3>
                <p>Click "Add Workout" to start tracking your fitness journey!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = workouts.map(workout => `
        <div class="workout-card">
            <div class="workout-content">
                <div class="workout-header">
                    <h3 class="workout-title">${workout.typeOfWorkout}</h3>
                    <span class="workout-date">${formatDate(workout.date)}</span>
                </div>
                <div class="workout-meta">
                    <div class="meta-item">
                        <i class="meta-icon fas fa-clock"></i>
                        <span>${workout.duration} min</span>
                    </div>
                    <div class="meta-item">
                        <i class="meta-icon fas fa-fire"></i>
                        <span>${workout.caloriesBurned} cal</span>
                    </div>
                </div>
                ${workout.notes ? `
                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary); background: rgba(0,0,0,0.02); padding: 0.5rem; border-radius: 4px;">
                    <i class="fas fa-sticky-note" style="margin-right: 0.25rem; opacity: 0.7;"></i> ${workout.notes}
                </div>` : ''}
                <div class="flex gap-2" style="margin-top: 1rem;">
                    <button class="btn btn-sm btn-secondary" onclick="editWorkout(${workout.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteWorkout(${workout.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openWorkoutModal(workout = null) {
    const modal = document.getElementById('workout-modal');
    const form = document.getElementById('workout-form');
    const title = document.getElementById('modal-title');

    if (workout) {
        title.textContent = 'Edit Workout';
        document.getElementById('workout-id').value = workout.id;
        document.getElementById('workout-type').value = workout.typeOfWorkout;
        document.getElementById('workout-duration').value = workout.duration;
        document.getElementById('workout-calories').value = workout.caloriesBurned;
        document.getElementById('workout-date').value = workout.date;
    } else {
        title.textContent = 'Add Workout';
        form.reset();
        document.getElementById('workout-date').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function closeWorkoutModal() {
    const modal = document.getElementById('workout-modal');
    modal.classList.remove('active');
    document.getElementById('workout-form').reset();
}

// Open workout modal
function openWorkoutModal(workout = null) {
    const modal = document.getElementById('workout-modal');
    const form = document.getElementById('workout-form');

    if (workout) {
        // Edit mode - populate form
        document.getElementById('workout-name').value = workout.typeOfWorkout || '';
        document.getElementById('workout-type').value = workout.typeOfWorkout || '';
        document.getElementById('workout-duration').value = workout.duration || '';
        document.getElementById('workout-calories').value = workout.caloriesBurned || '';
        document.getElementById('workout-date').value = workout.date || '';
        document.getElementById('workout-notes').value = workout.notes || '';
        form.dataset.workoutId = workout.id;
    } else {
        // Add mode - clear form
        form.reset();
        document.getElementById('workout-date').valueAsDate = new Date();
        delete form.dataset.workoutId;
    }

    modal.classList.add('active');
}

// Close workout modal
function closeWorkoutModal() {
    const modal = document.getElementById('workout-modal');
    const form = document.getElementById('workout-form');
    modal.classList.remove('active');
    form.reset();
    delete form.dataset.workoutId;
}

async function handleWorkoutSubmit(e) {
    e.preventDefault();

    const workoutId = document.getElementById('workout-id').value;
    const workoutData = {
        typeOfWorkout: document.getElementById('workout-type').value,
        duration: parseInt(document.getElementById('workout-duration').value),
        caloriesBurned: parseInt(document.getElementById('workout-calories').value),
        date: document.getElementById('workout-date').value,
        notes: document.getElementById('workout-notes').value || ''
    };

    try {
        const method = workoutId ? 'PUT' : 'POST';
        const endpoint = workoutId ? `/workouts/${workoutId}` : '/workouts';

        const response = await apiCall(endpoint, {
            method,
            body: JSON.stringify(workoutData)
        });

        if (response.ok) {
            showToast(`Workout ${workoutId ? 'updated' : 'added'} successfully!`, 'success');
            closeWorkoutModal();
            loadWorkouts();
            loadDashboard();
        } else {
            showToast('Failed to save workout', 'error');
        }
    } catch (error) {
        showToast('Error saving workout', 'error');
        console.error('Workout save error:', error);
    }
}

async function editWorkout(id) {
    try {
        const response = await apiCall(`/workouts/${id}`);
        if (response.ok) {
            const workout = await response.json();
            openWorkoutModal(workout);
        }
    } catch (error) {
        showToast('Error loading workout', 'error');
        console.error('Edit workout error:', error);
    }
}

async function deleteWorkout(id) {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
        const response = await apiCall(`/workouts/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Workout deleted successfully!', 'success');
            loadWorkouts();
            loadDashboard();
        } else {
            showToast('Failed to delete workout', 'error');
        }
    } catch (error) {
        showToast('Error deleting workout', 'error');
        console.error('Delete workout error:', error);
    }
}

async function loadGoals() {
    try {
        const response = await apiCall('/goals');
        if (response.ok) {
            const goals = await response.json();
            displayGoals(goals);
        }
    } catch (error) {
        console.error('Error loading goals:', error);
        showToast('Error loading goals', 'error');
    }
}

function displayGoals(goals) {
    const container = document.getElementById('goals-list');
    if (!container) return;

    if (goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">??</div>
                <h3>No goals yet</h3>
                <p>Set your first fitness goal to start tracking your progress!</p>
            </div>
            `;
        return;
    }

    container.innerHTML = goals.map(goal => `
            <div class="workout-card">
                <div class="workout-content">
                    <div class="workout-header">
                        <h3 class="workout-title">${formatGoalType(goal.goalType)}</h3>
                        <span class="badge ${goal.status === 'completed' ? 'badge-success' : 'badge-primary'}">
                            ${goal.status}
                        </span>
                    </div>
                    <div style="margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--text-secondary);">Progress</span>
                            <span style="font-size: 0.875rem; font-weight: 600;">${goal.progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); border-radius: 999px; height: 8px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${Math.min(goal.progressPercentage, 100)}%; transition: width 0.3s ease;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                            <span>${goal.currentValue} / ${goal.targetValue} ${goal.unit}</span>
                            ${goal.targetDate ? `<span>Due: ${formatDate(goal.targetDate)}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-secondary" onclick="editGoal(${goal.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGoal(${goal.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
        </div>
            `).join('');
}

function formatGoalType(type) {
    const types = {
        'weight_loss': 'Weight Loss',
        'muscle_gain': 'Muscle Gain',
        'endurance': 'Build Endurance',
        'general_fitness': 'General Fitness'
    };
    return types[type] || type;
}

function openGoalModal(goal = null) {
    const modal = document.getElementById('goal-modal');
    const form = document.getElementById('goal-form');
    const title = document.getElementById('goal-modal-title');

    if (goal) {
        title.textContent = 'Edit Goal';
        document.getElementById('goal-id').value = goal.id;
        document.getElementById('goal-type').value = goal.goalType;
        document.getElementById('goal-target').value = goal.targetValue;
        document.getElementById('goal-current').value = goal.currentValue;
        document.getElementById('goal-unit').value = goal.unit;
        document.getElementById('goal-target-date').value = goal.targetDate || '';
    } else {
        title.textContent = 'Add Goal';
        form.reset();
    }

    modal.classList.add('active');
}

function closeGoalModal() {
    const modal = document.getElementById('goal-modal');
    modal.classList.remove('active');
    document.getElementById('goal-form').reset();
}

async function handleGoalSubmit(e) {
    e.preventDefault();

    const goalId = document.getElementById('goal-id').value;
    const goalData = {
        goalType: document.getElementById('goal-type').value,
        targetValue: parseFloat(document.getElementById('goal-target').value),
        currentValue: parseFloat(document.getElementById('goal-current').value),
        unit: document.getElementById('goal-unit').value,
        targetDate: document.getElementById('goal-target-date').value || null
    };

    try {
        const method = goalId ? 'PUT' : 'POST';
        const endpoint = goalId ? `/goals/${goalId}` : '/goals';

        const response = await apiCall(endpoint, {
            method,
            body: JSON.stringify(goalData)
        });

        if (response.ok) {
            showToast(`Goal ${goalId ? 'updated' : 'created'} successfully!`, 'success');
            closeGoalModal();
            loadGoals();
        } else {
            showToast('Failed to save goal', 'error');
        }
    } catch (error) {
        showToast('Error saving goal', 'error');
        console.error('Goal save error:', error);
    }
}

async function editGoal(id) {
    try {
        const response = await apiCall(`/goals/${id}`);
        if (response.ok) {
            const goal = await response.json();
            openGoalModal(goal);
        }
    } catch (error) {
        showToast('Error loading goal', 'error');
        console.error('Edit goal error:', error);
    }
}

async function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
        const response = await apiCall(`/goals/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Goal deleted successfully', 'success');
            loadGoals();
        }
    } catch (error) {
        showToast('Error deleting goal', 'error');
        console.error('Delete goal error:', error);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========================================
// DASHBOARD WIDGETS
// ========================================

function initDashboardBMI() {
    const btn = document.getElementById('btn-calc-bmi');
    if (!btn) return;

    // Clone to remove existing listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('dash-weight').value);
        const height = parseFloat(document.getElementById('dash-height').value);
        const resultDiv = document.getElementById('bmi-result');
        const valueDiv = document.getElementById('bmi-value');
        const categoryDiv = document.getElementById('bmi-category');
        const adviceDiv = document.getElementById('bmi-advice');

        if (!weight || !height) {
            showToast('Please enter both weight and height', 'error');
            return;
        }

        const bmi = weight / ((height / 100) * (height / 100));
        const bmiValue = bmi.toFixed(1);
        let category = '';
        let color = '';
        let advice = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3B82F6'; // Blue
            advice = 'Focus on nutrient-dense foods and strength training.';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            color = '#10B981'; // Green
            advice = 'Great work! Maintain your healthy lifestyle.';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#F59E0B'; // Orange
            advice = 'Aim for a balanced diet and regular cardio.';
        } else {
            category = 'Obese';
            color = '#EF4444'; // Red
            advice = 'Prioritize whole foods and consistent movement.';
        }

        valueDiv.textContent = bmiValue;
        categoryDiv.textContent = category;
        categoryDiv.style.color = color;
        adviceDiv.textContent = advice;

        resultDiv.classList.remove('hidden');
        resultDiv.style.animation = 'fadeIn 0.5s ease';
    });
}

// ========================================
// EXERCISES
// ========================================

// Load exercises from API
async function loadExercises() {
    console.log('Loading exercises...');
    try {
        const response = await apiCall('/exercises');
        if (response.ok) {
            allExercises = await response.json();
            console.log(`Loaded ${allExercises.length} exercises`);
            displayExercises(allExercises);
        } else {
            console.error('Failed to load exercises:', response.status);
            showToast('Failed to load exercises', 'error');
        }
    } catch (error) {
        console.error('Error loading exercises:', error);
        showToast('Error loading exercises', 'error');
    }
}

// Display exercises with click handlers
function displayExercises(exercises) {
    const container = document.getElementById('exercises-list');
    if (!container) return;

    if (exercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">??</div>
                <h3>No exercises found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }

    container.innerHTML = exercises.map(exercise => {
        // Use gifUrl from API response, fallback to static image
        const imageUrl = exercise.gifUrl || getExerciseImage(exercise.name);

        return `
            <div class="exercise-card" data-exercise-id="${exercise.id}" style="cursor: pointer;">
                <img src="${imageUrl}" 
                     alt="${exercise.name}" 
                     class="exercise-image" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;"
                     onerror="this.onerror=null;this.src='${getExerciseImage(exercise.name)}'">
                <div class="exercise-content">
                    <h3 class="exercise-title">${exercise.name}</h3>
                    <div class="exercise-badges">
                        <span class="badge badge-primary">${exercise.bodyPart || exercise.category || 'General'}</span>
                        <span class="badge badge-secondary">${exercise.equipment || 'Body weight'}</span>
                    </div>
                    <p style="margin-top: 0.75rem; color: var(--text-secondary); font-size: 0.875rem;">
                        <strong>Target:</strong> ${exercise.target || 'N/A'}
                    </p>
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers to exercise cards
    const exerciseCards = container.querySelectorAll('.exercise-card');
    exerciseCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showExerciseDetails(exercises[index]);
        });
    });
}

// Filter exercises by search term
function filterExercises(searchTerm) {
    if (window.searchTimeout) clearTimeout(window.searchTimeout);

    if (!searchTerm) {
        displayExercises(allExercises);
        return;
    }

    window.searchTimeout = setTimeout(async () => {
        try {
            const response = await apiCall(`/exercises/search?name=${encodeURIComponent(searchTerm)}`);
            if (response.ok) {
                const results = await response.json();
                displayExercises(results);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 500);
}

// Show exercise details modal
function showExerciseDetails(exercise) {
    const modal = document.getElementById('exercise-modal');
    const modalTitle = document.getElementById('exercise-modal-title');
    const modalImage = document.getElementById('exercise-modal-image');
    const modalBodyPart = document.getElementById('exercise-modal-bodypart');
    const modalTarget = document.getElementById('exercise-modal-target');
    const modalEquipment = document.getElementById('exercise-modal-equipment');

    if (!modal) return;

    modalTitle.textContent = exercise.name || 'Exercise Details';

    const imageUrl = exercise.gifUrl || getExerciseImage(exercise.name);
    modalImage.onerror = function () {
        this.onerror = null;
        this.src = getExerciseImage(exercise.name);
    };
    modalImage.src = imageUrl;
    modalImage.alt = exercise.name;

    modalBodyPart.textContent = exercise.bodyPart || 'N/A';
    modalTarget.textContent = exercise.target || 'N/A';
    modalEquipment.textContent = exercise.equipment || 'Body weight';

    const instructionsSection = document.getElementById('exercise-instructions-section');
    const instructionsList = document.getElementById('exercise-modal-instructions');
    if (exercise.instructions && exercise.instructions.length > 0) {
        instructionsList.innerHTML = exercise.instructions.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('');
        if (instructionsSection) instructionsSection.style.display = 'block';
    } else {
        if (instructionsSection) instructionsSection.style.display = 'none';
    }

    modal.classList.add('active');
}


// Close exercise details modal
function closeExerciseModal() {
    const modal = document.getElementById('exercise-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Add exercise modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const exerciseModalCloseBtn = document.getElementById('exercise-modal-close-btn');
    const exerciseModalCloseFooterBtn = document.getElementById('exercise-modal-close-footer-btn');
    const exerciseModal = document.getElementById('exercise-modal');

    if (exerciseModalCloseBtn) {
        exerciseModalCloseBtn.addEventListener('click', closeExerciseModal);
    }
    if (exerciseModalCloseFooterBtn) {
        exerciseModalCloseFooterBtn.addEventListener('click', closeExerciseModal);
    }
    if (exerciseModal) {
        exerciseModal.addEventListener('click', (e) => {
            if (e.target === exerciseModal) {
                closeExerciseModal();
            }
        });
    }
});

console.log('Exercise functions loaded successfully!');

console.log('FitForge app.js loaded successfully with enhanced logging!');



// ========================================
// PROGRESS PAGE
// ========================================

async function loadProgress() {
    try {
        const response = await apiCall('/workouts');
        if (response.ok) {
            const workouts = await response.json();
            displayProgressStats(workouts);
            renderProgressCharts(workouts);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        showToast('Error loading progress data', 'error');
    }
}

function displayProgressStats(workouts) {
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 0;
    let longestStreak = 0;

    if (sortedWorkouts.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let tempStreak = 0;
        let lastDate = null;

        for (const workout of sortedWorkouts) {
            const wDate = new Date(workout.date);
            wDate.setHours(0, 0, 0, 0);

            if (!lastDate) {
                lastDate = wDate;
                tempStreak = 1;
                const diff = Math.floor((today - wDate) / (1000 * 60 * 60 * 24));
                if (diff <= 1) currentStreak = 1;
            } else {
                const diff = Math.floor((lastDate - wDate) / (1000 * 60 * 60 * 24));
                if (diff === 1) {
                    tempStreak++;
                    if (currentStreak > 0) currentStreak = tempStreak;
                } else if (diff > 1) {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                    if (currentStreak > 0) currentStreak = 0;
                }
                lastDate = wDate;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
    }

    const currentEl = document.getElementById('current-streak');
    const longestEl = document.getElementById('longest-streak');
    if (currentEl) currentEl.textContent = currentStreak;
    if (longestEl) longestEl.textContent = longestStreak;
}

function renderProgressCharts(workouts) {
    if (typeof Chart === 'undefined') return;

    renderWeeklyChart(workouts);
    renderCalorieChart(workouts);
    renderDistributionChart(workouts);
    displayPersonalRecords(workouts);
}

function renderWeeklyChart(workouts) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    const last7Days = [];
    const counts = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

        const count = workouts.filter(w => {
            const wDate = new Date(w.date);
            wDate.setHours(0, 0, 0, 0);
            return wDate.getTime() === date.getTime();
        }).length;
        counts.push(count);
    }

    if (weeklyChart instanceof Chart) {
        weeklyChart.destroy();
    }

    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Workouts',
                data: counts,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function renderCalorieChart(workouts) {
    const ctx = document.getElementById('calorieChart');
    if (!ctx) return;

    const last30Days = [];
    const calories = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last30Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        const sum = workouts.filter(w => {
            const wDate = new Date(w.date);
            wDate.setHours(0, 0, 0, 0);
            return wDate.getTime() === date.getTime();
        }).reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
        calories.push(sum);
    }

    if (calorieChart instanceof Chart) {
        calorieChart.destroy();
    }

    calorieChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last30Days,
            datasets: [{
                label: 'Calories',
                data: calories,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { ticks: { maxTicksLimit: 10 } }, y: { beginAtZero: true } }
        }
    });
}

function renderDistributionChart(workouts) {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const types = {};
    workouts.forEach(w => {
        const type = w.typeOfWorkout || 'Other';
        types[type] = (types[type] || 0) + 1;
    });

    if (distributionChart instanceof Chart) {
        distributionChart.destroy();
    }

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(types),
            datasets: [{
                data: Object.values(types),
                backgroundColor: [
                    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function displayPersonalRecords(workouts) {
    const container = document.getElementById('personal-records');
    if (!container) return;

    if (workouts.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No workouts yet</p>';
        return;
    }

    const maxCal = Math.max(...workouts.map(w => w.caloriesBurned || 0));
    const maxDur = Math.max(...workouts.map(w => w.duration || 0));

    container.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-secondary);">Most Calories</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${maxCal} cal</div>
            </div>
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-secondary);">Longest Workout</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary);">${maxDur} min</div>
            </div>
        </div>
    `;
}
