const https = require('https');

const exerciseImages = {
    // Chest
    'push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop',
    'bench press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    'chest press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    'fly': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',

    // Back
    'pull-up': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
    'row': 'https://images.unsplash.com/photo-1603287681836-e566f56523fd?w=400&h=300&fit=crop',
    'lat pulldown': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
    'deadlift': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',

    // Legs
    'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
    'lunge': 'https://images.unsplash.com/photo-1579364046732-c21c2177730d?w=400&h=300&fit=crop',
    'leg press': 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=300&fit=crop',

    // Shoulders
    'shoulder press': 'https://images.unsplash.com/photo-1532029837206-abbe2b7a4abb?w=400&h=300&fit=crop',
    'overhead press': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop',
    'lateral raise': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',

    // Arms
    'bicep curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    'tricep': 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop',
    'dip': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',

    // Cardio
    'run': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop',
    'running': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop',
    'jog': 'https://images.unsplash.com/photo-1552674605-46d536d23488?w=400&h=300&fit=crop',
    'cycle': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop',
    'cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop',
    'swim': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
    'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
    'jump rope': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',

    // Other
    'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    'pilates': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    'hiit': 'https://images.unsplash.com/photo-1601422407692-ec4ee6f51b15?w=400&h=300&fit=crop',
    'crossfit': 'https://images.unsplash.com/photo-1517963879466-e9b5ce382569?w=400&h=300&fit=crop',
    'plank': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop',

    // Default
    'default': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'
};

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => {
            resolve(false);
        });
    });
}

async function verifyImages() {
    console.log('Verifying images...');
    for (const [key, url] of Object.entries(exerciseImages)) {
        const isValid = await checkUrl(url);
        if (!isValid) {
            console.log(`❌ Broken: ${key} -> ${url}`);
        } else {
            console.log(`✅ Valid: ${key}`);
        }
    }
}

verifyImages();
