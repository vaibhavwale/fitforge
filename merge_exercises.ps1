$appJsPath = "src\main\resources\static\js\app.js"
$exercisesJsPath = "src\main\resources\static\js\exercises.js"

# Read contents
$appJs = Get-Content $appJsPath -Raw -Encoding UTF8
$exercisesJs = Get-Content $exercisesJsPath -Raw -Encoding UTF8

# Extract the function body from exercises.js (skipping comments at top)
# We want everything after line 6
$newExerciseLogic = $exercisesJs -replace '(?s)^.*?// Load exercises from API', '// Load exercises from API'

# Define the start and end markers for the section to replace in app.js
$startMarker = "// ========================================"
$sectionTitle = "// EXERCISES"
$endMarker = "console.log('FitForge app.js loaded successfully"

# Construct the regex to find the block to replace
# We look for the EXERCISES section header and match until the end of the file (or near it)
# The pattern matches:
# 1. The EXERCISES header
# 2. Everything until the final console.log
$pattern = "(?s)// ========================================\s+// EXERCISES\s+// ========================================.*?(?=console\.log\('FitForge app\.js loaded successfully)"

# The replacement string
$replacement = @"
// ========================================
// EXERCISES
// ========================================

$newExerciseLogic

"@

# Perform replacement
if ($appJs -match $pattern) {
    $newContent = $appJs -replace $pattern, $replacement
    $newContent | Out-File $appJsPath -Encoding UTF8 -NoNewline
    Write-Host "Successfully merged exercises.js into app.js"
}
else {
    Write-Host "Error: Could not find EXERCISES section in app.js"
    # Fallback: Append if not found (though it should be there)
    # $newContent = $appJs + "`n" + $replacement
}
