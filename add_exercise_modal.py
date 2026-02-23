# Script to safely add exercise modal to index.html
import re

# Read the file
with open('src/main/resources/static/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Exercise modal HTML to insert
exercise_modal = '''
    <!-- EXERCISE DETAILS MODAL -->
    <div id="exercise-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exercise-modal-title">Exercise Details</h3>
                <button class="modal-close" id="exercise-modal-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="exercise-modal-body">
                <div id="exercise-modal-image-container" style="margin-bottom: 1.5rem; text-align: center;">
                    <img id="exercise-modal-image" src="" alt="Exercise" style="max-width: 100%; border-radius: 12px;">
                </div>
                <div class="form-group">
                    <label>Body Part</label>
                    <p id="exercise-modal-bodypart"></p>
                </div>
                <div class="form-group">
                    <label>Target Muscle</label>
                    <p id="exercise-modal-target"></p>
                </div>
                <div class="form-group">
                    <label>Equipment</label>
                    <p id="exercise-modal-equipment"></p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="exercise-modal-close-footer-btn">Close</button>
            </div>
        </div>
    </div>

'''

# Insert before toast container if not already present
if 'exercise-modal' not in content:
    content = content.replace(
        '    <!-- TOAST CONTAINER -->',
        exercise_modal + '    <!-- TOAST CONTAINER -->'
    )
    print("Added exercise modal")
else:
    print("Exercise modal already exists")

# Add exercises.js script if not present
if 'exercises.js' not in content:
    content = content.replace(
        '    <script src="/js/app.js"></script>',
        '    <script src="/js/exercises.js"></script>\n    <script src="/js/app.js"></script>'
    )
    print("Added exercises.js script tag")
else:
    print("exercises.js script tag already exists")

# Write back
with open('src/main/resources/static/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
