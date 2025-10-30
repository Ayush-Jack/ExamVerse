let currentUser = null;

// Check authentication
if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

currentUser = getUserData();
if (currentUser.role !== 'faculty') {
    window.location.href = 'dashboard.html';
}

// Force verify current user (fix for old localStorage data)
if (currentUser && !currentUser.isVerified) {
    currentUser.isVerified = true;
    localStorage.setItem('examverse_user', JSON.stringify(currentUser));
}

// Drag and drop functionality
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('pdfFile');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-purple-500');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-purple-500');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-purple-500');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        fileInput.files = files;
        showFileName(files[0].name);
    } else {
        showToast('Please drop a PDF file', 'error');
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        showFileName(e.target.files[0].name);
    }
});

function showFileName(name) {
    const fileNameDiv = document.getElementById('fileName');
    fileNameDiv.textContent = `Selected: ${name}`;
    fileNameDiv.classList.remove('hidden');
}

// Add question field
function addQuestionField() {
    const container = document.getElementById('questionsContainer');
    const questionCount = container.querySelectorAll('.question-item').length + 1;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item flex gap-3';
    questionDiv.innerHTML = `
        <input type="number" placeholder="Q#" class="w-16 px-3 py-2 rounded-lg input-field text-white" value="${questionCount}">
        <input type="text" placeholder="Question text" class="flex-1 px-4 py-2 rounded-lg input-field text-white placeholder-gray-500">
        <input type="number" placeholder="Marks" class="w-20 px-3 py-2 rounded-lg input-field text-white" value="5">
        <button type="button" onclick="this.parentElement.remove()" class="text-red-400 hover:text-red-300 px-2">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(questionDiv);
}

// Handle upload form
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser.isVerified) {
        showToast('Your account is pending verification', 'warning');
        return;
    }

    const file = fileInput.files[0];
    if (!file) {
        showToast('Please select a PDF file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', document.getElementById('title').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('year', document.getElementById('year').value);
    formData.append('course', document.getElementById('course').value);
    formData.append('examType', document.getElementById('examType').value);
    formData.append('solutionText', document.getElementById('solutionText').value);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';
    submitBtn.disabled = true;

    const progressDiv = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    progressDiv.classList.remove('hidden');

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${Math.min(progress, 90)}%`;
    }, 200);

    try {
        const data = await uploadFile(API_CONFIG.ENDPOINTS.PAPERS, formData);
        
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        
        showToast('Paper uploaded successfully!', 'success');
        
        // Reset form
        e.target.reset();
        document.getElementById('fileName').classList.add('hidden');
        progressDiv.classList.add('hidden');
        progressBar.style.width = '0%';
        
        // Reload papers
        loadMyPapers();
    } catch (error) {
        clearInterval(progressInterval);
        showToast(error.message || 'Upload failed', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        progressDiv.classList.add('hidden');
        progressBar.style.width = '0%';
    }
});

// Load faculty's papers
async function loadMyPapers() {
    const container = document.getElementById('myPapersContainer');
    showLoading(container);

    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.PAPERS, {
            method: 'GET'
        });

        const myPapers = data.papers.filter(paper => 
            paper.uploadedBy._id === currentUser.id || paper.uploadedBy === currentUser.id
        );

        if (myPapers.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-8">No papers uploaded yet</p>';
            return;
        }

        container.innerHTML = myPapers.map(paper => `
            <div class="glass-card p-6 rounded-xl flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <i class="fas fa-file-pdf text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-white font-semibold">${paper.title}</h3>
                        <p class="text-sm text-gray-400">${paper.subject} • ${paper.year}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-400">
                        <span><i class="fas fa-eye mr-1"></i>${paper.views}</span>
                        <span class="ml-3"><i class="fas fa-download mr-1"></i>${paper.downloads}</span>
                    </div>
                    <button onclick="deletePaper('${paper._id}')" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-red-400 text-center py-8">Failed to load papers</p>';
    }
}

// Delete paper
async function deletePaper(paperId) {
    if (!confirm('Are you sure you want to delete this paper?')) {
        return;
    }

    try {
        await apiRequest(API_CONFIG.ENDPOINTS.PAPER_BY_ID(paperId), {
            method: 'DELETE'
        });

        showToast('Paper deleted successfully', 'success');
        loadMyPapers();
    } catch (error) {
        showToast(error.message || 'Failed to delete paper', 'error');
    }
}

// Show upload form
function showUploadForm() {
    document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth' });
}

// Logout
function logout() {
    clearAuthData();
    window.location.href = 'index.html';
}

// Initialize
loadMyPapers();
