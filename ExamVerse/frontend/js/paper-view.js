let currentPaper = null;
let paperId = null;

// Check authentication
if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

// Get paper ID from URL
const urlParams = new URLSearchParams(window.location.search);
paperId = urlParams.get('id');

if (!paperId) {
    window.location.href = 'dashboard.html';
}

// Load paper details
async function loadPaper() {
    try {
        console.log('Loading paper with ID:', paperId);
        const data = await apiRequest(API_CONFIG.ENDPOINTS.PAPER_BY_ID(paperId), {
            method: 'GET'
        });

        console.log('Paper data received:', data);
        currentPaper = data.paper;
        
        if (!currentPaper) {
            throw new Error('Paper data is empty');
        }
        
        // Add empty questions array if not present (for old papers)
        if (!currentPaper.questions) {
            currentPaper.questions = [];
        }
        
        displayPaper(currentPaper);
    } catch (error) {
        console.error('Error loading paper:', error);
        alert('Error: ' + error.message + '\nCheck console for details');
        showToast(`Failed to load paper: ${error.message}`, 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
    }
}

// Display paper
function displayPaper(paper) {
    document.getElementById('paperTitle').textContent = paper.title;
    document.getElementById('paperSubject').textContent = paper.subject;
    document.getElementById('paperYear').textContent = paper.year;
    document.getElementById('paperCollege').textContent = paper.collegeName;
    
    // Update save button
    const user = getUserData();
    if (user.savedPapers && user.savedPapers.includes(paper._id)) {
        document.getElementById('saveBtn').innerHTML = '<i class="fas fa-bookmark"></i>';
    }
    
    // Load questions
    loadQuestions(paper);
}

// Load and display questions
function loadQuestions(paper) {
    const container = document.getElementById('questionsContainer');
    
    // Check if paper has questions
    if (!paper.questions || paper.questions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-file-pdf text-6xl text-gray-600 mb-4"></i>
                <p class="text-gray-400 mb-4">No questions added yet. Download PDF to view the paper.</p>
                <button onclick="downloadPaper()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
                    <i class="fas fa-download mr-2"></i>Download PDF
                </button>
            </div>
        `;
        return;
    }
    
    // Display questions
    container.innerHTML = paper.questions.map((q, index) => `
        <div class="glass-card p-6 rounded-xl">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
                        ${q.questionNumber || index + 1}
                    </div>
                    <div>
                        <span class="text-sm text-gray-400">Question ${q.questionNumber || index + 1}</span>
                        ${q.marks ? `<span class="ml-3 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">${q.marks} marks</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="text-white mb-4 leading-relaxed">
                ${q.questionText || 'Question text not available'}
            </div>
            
            <div class="border-t border-white/10 pt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-semibold text-purple-400">
                        <i class="fas fa-robot mr-2"></i>AI Solution
                    </h4>
                    ${!q.aiSolution || !q.aiSolution.isGenerated ? 
                        `<button onclick="generateQuestionSolution(${q.questionNumber || index + 1})" class="text-sm px-3 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-all">
                            <i class="fas fa-magic mr-1"></i>Generate
                        </button>` : 
                        `<span class="text-xs text-green-400"><i class="fas fa-check-circle mr-1"></i>Generated</span>`
                    }
                </div>
                
                <div id="solution-${q.questionNumber || index + 1}" class="text-gray-300 leading-relaxed">
                    ${q.aiSolution && q.aiSolution.isGenerated ? 
                        `<div class="bg-white/5 p-4 rounded-lg">${formatSolution(q.aiSolution.answer)}</div>` : 
                        '<p class="text-gray-500 italic">Click "Generate" to get AI-powered solution</p>'
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// Format solution text
function formatSolution(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Generate solution for a specific question
async function generateQuestionSolution(questionNumber) {
    const solutionDiv = document.getElementById(`solution-${questionNumber}`);
    solutionDiv.innerHTML = '<div class="flex items-center space-x-2"><div class="spinner"></div><span class="text-gray-400">Generating solution...</span></div>';
    
    try {
        const question = currentPaper.questions.find(q => (q.questionNumber || currentPaper.questions.indexOf(q) + 1) === questionNumber);
        
        const data = await apiRequest(API_CONFIG.ENDPOINTS.GENERATE_SOLUTION, {
            method: 'POST',
            body: JSON.stringify({
                question: question.questionText,
                paperId: paperId,
                subject: currentPaper.subject
            })
        });
        
        solutionDiv.innerHTML = `<div class="bg-white/5 p-4 rounded-lg">${formatSolution(data.answer)}</div>`;
        showToast('Solution generated successfully', 'success');
        
        // Reload paper to get updated data
        setTimeout(() => loadPaper(), 1000);
        
    } catch (error) {
        solutionDiv.innerHTML = '<p class="text-red-400">Failed to generate solution. Please try again.</p>';
        showToast(error.message, 'error');
    }
}

// Generate AI solution
async function generateAISolution() {
    const question = document.getElementById('questionInput').value.trim();
    
    if (!question) {
        showToast('Please enter a question', 'warning');
        return;
    }

    const aiSolutionDiv = document.getElementById('aiSolution');
    const aiAnswerDiv = document.getElementById('aiAnswer');
    
    aiSolutionDiv.classList.remove('hidden');
    aiAnswerDiv.innerHTML = '<div class="spinner mx-auto"></div>';

    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.GENERATE_SOLUTION, {
            method: 'POST',
            body: JSON.stringify({
                question: question,
                paperId: paperId,
                subject: currentPaper.subject
            })
        });

        aiAnswerDiv.innerHTML = data.answer.replace(/\n/g, '<br>');
        showToast('AI solution generated successfully', 'success');
    } catch (error) {
        aiAnswerDiv.innerHTML = '<p class="text-red-400">Failed to generate solution. Please try again.</p>';
        showToast(error.message, 'error');
    }
}

// Search videos
async function searchVideos() {
    const query = `${currentPaper.subject} ${currentPaper.title}`;
    
    const modal = document.getElementById('videoModal');
    const videoList = document.getElementById('videoList');
    
    modal.classList.remove('hidden');
    videoList.innerHTML = '<div class="flex justify-center"><div class="spinner"></div></div>';

    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.YOUTUBE_SEARCH, {
            method: 'POST',
            body: JSON.stringify({ query: query, maxResults: 5 })
        });

        if (data.videos && data.videos.length > 0) {
            videoList.innerHTML = data.videos.map(video => `
                <div class="glass-card p-4 rounded-lg hover:bg-white/10 transition-all">
                    <div class="flex gap-4">
                        <img src="${video.thumbnail}" alt="${video.title}" class="w-32 h-24 object-cover rounded-lg">
                        <div class="flex-1">
                            <h4 class="text-white font-semibold mb-2 line-clamp-2">${video.title}</h4>
                            <p class="text-sm text-gray-400 mb-2">${video.channelTitle}</p>
                            <a href="${video.url}" target="_blank" class="inline-flex items-center text-sm text-purple-400 hover:text-purple-300">
                                <i class="fas fa-external-link-alt mr-2"></i>Watch on YouTube
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            videoList.innerHTML = '<p class="text-gray-400 text-center">No videos found</p>';
        }
    } catch (error) {
        videoList.innerHTML = '<p class="text-red-400 text-center">Failed to load videos</p>';
        showToast(error.message, 'error');
    }
}

// Close video modal
function closeVideoModal() {
    document.getElementById('videoModal').classList.add('hidden');
}

// Download paper
async function downloadPaper() {
    try {
        await apiRequest(API_CONFIG.ENDPOINTS.DOWNLOAD(paperId), {
            method: 'POST'
        });

        const pdfUrl = `${API_CONFIG.BASE_URL.replace('/api', '')}${currentPaper.pdfURL}`;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${currentPaper.title}.pdf`;
        link.click();
        
        showToast('Download started', 'success');
    } catch (error) {
        showToast('Download failed', 'error');
    }
}

// Toggle save
async function toggleSave() {
    try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.SAVE(paperId), {
            method: 'POST'
        });

        const saveBtn = document.getElementById('saveBtn');
        if (data.isSaved) {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
            showToast('Paper saved', 'success');
        } else {
            saveBtn.innerHTML = '<i class="far fa-bookmark"></i>';
            showToast('Paper removed from saved', 'info');
        }

        // Update local user data
        const user = getUserData();
        user.savedPapers = data.savedPapers;
        localStorage.setItem('examverse_user', JSON.stringify(user));
    } catch (error) {
        showToast('Failed to save paper', 'error');
    }
}

// Initialize
loadPaper();
