$content = Get-Content "src\main\resources\static\index.html" -Raw -Encoding UTF8

$exerciseModal = @"

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

"@

# Add exercise modal before toast container if not present
if ($content -notmatch 'exercise-modal') {
    $content = $content -replace '    <!-- TOAST CONTAINER -->', "$exerciseModal    <!-- TOAST CONTAINER -->"
    Write-Host "Added exercise modal"
} else {
    Write-Host "Exercise modal already exists"
}

# Add exercises.js script if not present
if ($content -notmatch 'exercises\.js') {
    $content = $content -replace '    <script src="/js/app.js"></script>', "    <script src=`"/js/exercises.js`"></script>`r`n    <script src=`"/js/app.js`"></script>"
    Write-Host "Added exercises.js script tag"
} else {
    Write-Host "exercises.js script tag already exists"
}

# Write back
$content | Out-File "src\main\resources\static\index.html" -Encoding UTF8 -NoNewline
Write-Host "Done!"
