import re

# Read the JS file
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\js\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the showExerciseDetails function and add instructions display
instructions_code = '''
    // Display instructions if available
    const instructionsSection = document.getElementById('exercise-instructions-section');
    const instructionsList = document.getElementById('exercise-modal-instructions');
    if (exercise.instructions && exercise.instructions.length > 0) {
        instructionsList.innerHTML = exercise.instructions.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('');
        if (instructionsSection) instructionsSection.style.display = 'block';
    } else {
        if (instructionsSection) instructionsSection.style.display = 'none';
    }
'''

# Insert before modal.classList.add('active');
content = re.sub(
    r"(modalEquipment\.textContent = exercise\.equipment \|\| 'Body weight';)\s*\n\s*\n\s*(// Show modal)",
    r"\1\n" + instructions_code + r"\n    \2",
    content
)

# Write back
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\js\app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("JS fixes applied successfully!")
