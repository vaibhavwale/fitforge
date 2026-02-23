import re

# Read the current HTML file
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The complete exercise modal HTML to insert
exercise_modal_html = '''    <!-- EXERCISE DETAILS MODAL -->
    <div id="exercise-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="exercise-modal-title">Exercise Details</h2>
                <button class="modal-close" id="exercise-modal-close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <img id="exercise-modal-image" src="" alt="Exercise" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div class="form-group">
                    <label>Body Part</label>
                    <p id="exercise-modal-bodypart" style="margin: 0; color: var(--text-primary);"></p>
                </div>
                
                <div class="form-group">
                    <label>Target Muscle</label>
                    <p id="exercise-modal-target" style="margin: 0; color: var(--text-primary);"></p>
                </div>
                
                <div class="form-group">
                    <label>Equipment</label>
                    <p id="exercise-modal-equipment" style="margin: 0; color: var(--text-primary);"></p>
                </div>
                
                <div class="form-group" id="exercise-instructions-section" style="display: none;">
                    <label>How to Perform</label>
                    <ol id="exercise-modal-instructions" style="margin: 0.5rem 0 0 1.5rem; color: var(--text-primary);"></ol>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="exercise-modal-close-footer-btn">Close</button>
            </div>
        </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div class="toast-container" id="toast-container"></div>

    <!-- JavaScript -->
    <script src="/js/app.js"></script>
</body>

</html>'''

# Remove any existing broken exercise modal and everything after it
# Find the last complete modal (goal-modal) and insert after it
pattern = r'(</div>\s*</div>\s*<!-- GOAL MODAL -->.*?</div>\s*</div>\s*</div>)\s*.*?</html>'
replacement = r'\1\n\n' + exercise_modal_html

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Exercise modal HTML fixed successfully!")
