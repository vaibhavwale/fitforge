import re

# Read the CSS file
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\css\style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix .auth-header h2 color
content = re.sub(
    r'(\.auth-header h2 \{[^}]*color:\s*)#111827',
    r'\1#1F2937',
    content
)

# Fix .auth-header p color and font-weight
content = re.sub(
    r'(\.auth-header p \{[^}]*color:\s*)#4B5563',
    r'\1#374151',
    content
)
content = re.sub(
    r'(\.auth-header p \{[^}]*font-weight:\s*)500',
    r'\1600',
    content
)

# Fix .form-group label color
content = re.sub(
    r'(\.form-group label \{[^}]*color:\s*)#374151',
    r'\1#1F2937',
    content
)

# Write back
with open(r'c:\Users\VAIBHAV\Desktop\App by pratik\src\main\resources\static\css\style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS fixes applied successfully!")
