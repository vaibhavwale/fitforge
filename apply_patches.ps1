# PowerShell script to add all missing functionality to app.js

$appJsPath = "c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\js\app.js"
$content = Get-Content $appJsPath -Raw

# 1. Add event listeners to setupEventListeners function
$setupListenersPattern = '(?s)(    \/\/ Navigation\s+document\.querySelectorAll\(''\.nav-link''\)\.forEach\(link => \{\s+link\.addEventListener\(''click'', \(e\) => \{\s+e\.preventDefault\(\);\s+navigateToPage\(link\.dataset\.page\);\s+\}\);\s+\}\);)\s+\}'

$setupListenersReplacement = @'
$1

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
}
'@

$content = $content -replace $setupListenersPattern, $setupListenersReplacement

# 2. Add updateThemeButton function after applyTheme
$applyThemePattern = '(?s)(\/\/ Apply theme based on preference\s+function applyTheme\(theme\) \{\s+document\.documentElement\.setAttribute\(''data-theme'', theme\);\s+\})'

$applyThemeReplacement = @'
$1

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
'@

$content = $content -replace $applyThemePattern, $applyThemeReplacement

# 3. Add progress case to navigation switch
$switchPattern = '(?s)(case ''exercises'': loadExercises\(\); break;)\s+(case ''goals'':)'
$switchReplacement = @'
$1
        case 'progress': loadProgress(); break;
        $2
'@

$content = $content -replace $switchPattern, $switchReplacement

# 4. Replace placeholder loadProgress with full implementation
$loadProgressPattern = '(?s)function loadProgress\(\) \{[^}]+\}'

$loadProgressReplacement = @'
async function loadProgress() {
    try {
        const response = await apiCall('/workouts');
        if (response.ok) {
            const workouts = await response.json();
            
            // Calculate streaks
            const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
            let currentStreak = 0;
            let longestStreak = 0;
            
            if (sortedWorkouts.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const lastWorkout = new Date(sortedWorkouts[0].date);
                lastWorkout.setHours(0, 0, 0, 0);
                const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
                
                if (daysDiff <= 1) {
                    currentStreak = 1;
                    for (let i = 1; i < sortedWorkouts.length; i++) {
                        const curr = new Date(sortedWorkouts[i-1].date);
                        const prev = new Date(sortedWorkouts[i].date);
                        curr.setHours(0, 0, 0, 0);
                        prev.setHours(0, 0, 0, 0);
                        if (Math.floor((curr - prev) / (1000 * 60 * 60 * 24)) === 1) {
                            currentStreak++;
                        } else {
                            break;
                        }
                    }
                }
                longestStreak = currentStreak;
            }
            
            document.getElementById('current-streak').textContent = currentStreak;
            document.getElementById('longest-streak').textContent = longestStreak;
            
            // Render charts if Chart.js is available
            if (typeof Chart !== 'undefined') {
                renderWeeklyChart(workouts);
                renderCalorieChart(workouts);
                renderDistributionChart(workouts);
            }
            
            displayPersonalRecords(workouts);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
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
        counts.push(workouts.filter(w => {
            const wDate = new Date(w.date);
            wDate.setHours(0, 0, 0, 0);
            return wDate.getTime() === date.getTime();
        }).length);
    }
    
    if (window.weeklyChart) window.weeklyChart.destroy();
    window.weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Workouts',
                data: counts,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 8
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
        calories.push(workouts.filter(w => {
            const wDate = new Date(w.date);
            wDate.setHours(0, 0, 0, 0);
            return wDate.getTime() === date.getTime();
        }).reduce((sum, w) => sum + (w.caloriesBurned || 0), 0));
    }
    
    if (window.calorieChart) window.calorieChart.destroy();
    window.calorieChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last30Days,
            datasets: [{
                label: 'Calories',
                data: calories,
                borderColor: 'rgba(16, 185, 129, 1)',
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
    
    if (window.distributionChart) window.distributionChart.destroy();
    window.distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(types),
            datasets: [{
                data: Object.values(types),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(99, 102, 241, 0.8)'
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
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No workouts yet</p>';
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
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-secondary);">Total Workouts</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">${workouts.length}</div>
            </div>
        </div>
    `;
}
'@

$content = $content -replace $loadProgressPattern, $loadProgressReplacement

# Save the file
$content | Set-Content $appJsPath -NoNewline

Write-Host "✅ All fixes applied successfully!" -ForegroundColor Green
Write-Host "Added:" -ForegroundColor Cyan
Write-Host "  - Dark mode toggle event listener" -ForegroundColor White
Write-Host "  - Logout button event listener" -ForegroundColor White
Write-Host "  - updateThemeButton() function" -ForegroundColor White
Write-Host "  - Complete loadProgress() with charts" -ForegroundColor White
Write-Host "  - Progress case in navigation" -ForegroundColor White
