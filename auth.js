// ==================== AUTHENTICATION CONFIGURATION ====================

const API_URL = '/api';

// ==================== HELPER FUNCTIONS ====================

function setAuthToken(token) {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function isAuthenticated() {
    return !!getAuthToken();
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function redirectToHome() {
    window.location.href = 'index.html';
}

// ==================== LOGIN PAGE ====================

if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (isAuthenticated()) {
        redirectToHome();
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        errorMessage.style.display = 'none';
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setAuthToken(data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                redirectToHome();
            } else {
                errorMessage.textContent = data.error || 'Login failed';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Cannot connect to server. Is it running?';
            errorMessage.style.display = 'block';
        }
    });
}

// ==================== SIGNUP PAGE ====================

if (document.getElementById('signupForm')) {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (isAuthenticated()) {
        redirectToHome();
    }
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        errorMessage.style.display = 'none';
        
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters';
            errorMessage.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setAuthToken(data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                redirectToHome();
            } else {
                errorMessage.textContent = data.error || 'Signup failed';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Cannot connect to server. Is it running?';
            errorMessage.style.display = 'block';
        }
    });
}

// ==================== PROFILE PAGE ====================

if (document.getElementById('profileForm')) {
    if (!isAuthenticated()) {
        redirectToLogin();
    }
    
    async function loadProfile() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('profileName').value = data.user.name || '';
                document.getElementById('profileEmail').value = data.user.email;
                document.getElementById('memberSince').textContent = data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'Just joined';
            } else {
                redirectToLogin();
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    }
    
    loadProfile();
    
    const profileForm = document.getElementById('profileForm');
    const profileMessage = document.getElementById('profileMessage');
    
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('profileName').value;
        profileMessage.style.display = 'none';
        
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ name })
            });
            
            if (response.ok) {
                const data = await response.json();
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.name = data.user.name;
                localStorage.setItem('user', JSON.stringify(user));
                
                profileMessage.textContent = 'Profile updated successfully!';
                profileMessage.style.display = 'block';
                setTimeout(() => {
                    profileMessage.style.display = 'none';
                }, 3000);
            } else {
                profileMessage.textContent = 'Failed to update profile';
                profileMessage.style.display = 'block';
            }
        } catch (error) {
            profileMessage.textContent = 'Network error';
            profileMessage.style.display = 'block';
        }
    });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            redirectToLogin();
        });
    }
}