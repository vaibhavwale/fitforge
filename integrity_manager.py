import os

# 1. Fix app.js
app_js_path = r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\js\app.js'

# Read the file (binary mode to avoid encoding issues initially)
with open(app_js_path, 'rb') as f:
    content = f.read()

# Find the truncation point
marker = b"console.log('FitForge app.js loaded successfully with enhanced logging!');"
idx = content.find(marker)

if idx != -1:
    # Keep content up to the marker + marker length
    clean_content = content[:idx + len(marker)]
    
    # The code to append
    additional_code = r'''

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
    
    if (window.weeklyChart) window.weeklyChart.destroy();
    
    window.weeklyChart = new Chart(ctx, {
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
    
    if (window.calorieChart) window.calorieChart.destroy();
    
    window.calorieChart = new Chart(ctx, {
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
    
    if (window.distributionChart) window.distributionChart.destroy();
    
    window.distributionChart = new Chart(ctx, {
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
'''
    # Write back the clean content + new code
    with open(app_js_path, 'wb') as f:
        f.write(clean_content)
        f.write(additional_code.encode('utf-8'))
    print("✅ app.js fixed!")
else:
    print("❌ Marker not found in app.js")

# 2. Fix style.css
css_path = r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\css\style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Fix the broken .form-control:focus and add .form-control
broken_css = r'''.form-control:focus {
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}'''

correct_css = r'''.form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background: #F9FAFB;
    color: var(--text-primary);
}

.form-control:focus {
    background: #FFFFFF;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    outline: none;
}'''

if broken_css in css_content:
    css_content = css_content.replace(broken_css, correct_css)
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("✅ style.css fixed!")
else:
    # Fallback: try to replace just the focus part if exact match fails
    print("⚠️ Exact CSS match not found, attempting fallback...")
    # (Simplified fallback logic could go here, but let's rely on exact match first as I copied it from view_file)
    
