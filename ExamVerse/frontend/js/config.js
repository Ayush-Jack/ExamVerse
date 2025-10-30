// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        // Auth
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
        
        // Papers
        PAPERS: '/papers',
        PAPER_BY_ID: (id) => `/papers/${id}`,
        DOWNLOAD: (id) => `/papers/${id}/download`,
        UPVOTE: (id) => `/papers/${id}/upvote`,
        SAVE: (id) => `/papers/${id}/save`,
        
        // AI
        GENERATE_SOLUTION: '/ai/generate-solution',
        SAVED_SOLUTIONS: (paperId) => `/ai/solutions/${paperId}`,
        SUMMARIZE: '/ai/summarize',
        
        // YouTube
        YOUTUBE_SEARCH: '/youtube/search'
    }
};

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('examverse_token');
};

// Helper function to get user data
const getUserData = () => {
    const userData = localStorage.getItem('examverse_user');
    return userData ? JSON.parse(userData) : null;
};

// Helper function to set auth data
const setAuthData = (token, user) => {
    localStorage.setItem('examverse_token', token);
    localStorage.setItem('examverse_user', JSON.stringify(user));
};

// Helper function to clear auth data
const clearAuthData = () => {
    localStorage.removeItem('examverse_token');
    localStorage.removeItem('examverse_user');
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
    return !!getAuthToken();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    };
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Helper function for file upload
const uploadFile = async (endpoint, formData) => {
    const token = getAuthToken();
    
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
};

// Show toast notification
const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-0`;
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    toast.classList.add(colors[type] || colors.info);
    toast.innerHTML = `
        <div class="flex items-center space-x-3 text-white">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Show loading spinner
const showLoading = (container) => {
    const spinner = document.createElement('div');
    spinner.className = 'flex justify-center items-center py-12';
    spinner.innerHTML = `
        <div class="spinner"></div>
    `;
    container.innerHTML = '';
    container.appendChild(spinner);
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
