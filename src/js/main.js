import config from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    const contentContainer = document.querySelector('#content-container');
    
    // Handle navigation
    document.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            loadModule(module);
        });
    });
    
    // Loading state handlers
    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        contentContainer.appendChild(loader);
    }

    function hideLoading() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }

    // Error handler
    function handleApiError(error, module) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerHTML = `
            <p>Error loading ${module} data. Please try again later.</p>
            <button onclick="retryLoad('${module}')">Retry</button>
        `;
        contentContainer.appendChild(errorContainer);
    }

    // Load module content
    async function loadModule(moduleName) {
        showLoading();
        try {
            const response = await fetch(`${moduleName}.html`);
            const html = await response.text();
            contentContainer.innerHTML = html;
            await initializeModule(moduleName);
        } catch (error) {
            console.error('Error loading module:', error);
            handleApiError(error, moduleName);
        } finally {
            hideLoading();
        }
    }

    // API Integration Functions
    async function fetchJobListings(query, location) {
        try {
            const response = await fetch(`${config.apis.jobs.endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${config.apis.jobs.key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, location }),
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            handleApiError(error, 'job listings');
        }
    }

    async function fetchSkillsAssessment() {
        try {
            const response = await fetch(`${config.apis.skills.endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${config.apis.skills.key}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching skills assessment:', error);
            handleApiError(error, 'skills assessment');
        }
    }

    async function generateResume(data) {
        try {
            const response = await fetch(`${config.apis.resume.endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.apis.resume.key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error generating resume:', error);
            handleApiError(error, 'resume generation');
        }
    }

    async function fetchMilitaryTranslation(mos) {
        try {
            const response = await fetch(`${config.apis.military.endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${config.apis.military.key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mos }),
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching military translation:', error);
            handleApiError(error, 'military translation');
        }
    }

    // Initialize module-specific functionality
    async function initializeModule(moduleName) {
        switch(moduleName) {
            case 'compare':
                await initializeCompareModule();
                break;
            case 'opportunities':
                await initializeOpportunitiesModule();
                break;
            case 'keyword':
                await initializeKeywordModule();
                break;
            case 'skills':
                await initializeSkillsModule();
                break;
            case 'military':
                await initializeMilitaryModule();
                break;
            case 'resume':
                await initializeResumeModule();
                break;
        }
    }

    // Module-specific initializations
    async function initializeCompareModule() {
        const compareForm = document.querySelector('.career-select');
        if (compareForm) {
            compareForm.addEventListener('change', async function(e) {
                const career1 = document.querySelector('#career1').value;
                const career2 = document.querySelector('#career2').value;
                if (career1 && career2) {
                    showLoading();
                    try {
                        const comparisonData = await fetchJobListings(career1, career2);
                        displayComparisonResults(comparisonData);
                    } finally {
                        hideLoading();
                    }
                }
            });
        }
    }

    async function initializeOpportunitiesModule() {
        const searchForm = document.querySelector('.job-search');
        if (searchForm) {
            searchForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const title = searchForm.querySelector('input[type="text"]').value;
                const location = searchForm.querySelector('input[placeholder="Location"]').value;
                
                showLoading();
                try {
                    const jobs = await fetchJobListings(title, location);
                    displayJobResults(jobs);
                } finally {
                    hideLoading();
                }
            });
        }
    }

    async function initializeKeywordModule() {
        const searchTool = document.querySelector('.search-tool');
        if (searchTool) {
            searchTool.addEventListener('submit', async function(e) {
                e.preventDefault();
                const keywords = searchTool.querySelector('input[type="text"]').value;
                const location = searchTool.querySelector('input[placeholder="Location"]').value;
                
                showLoading();
                try {
                    const results = await fetchJobListings(keywords, location);
                    displaySearchResults(results);
                } finally {
                    hideLoading();
                }
            });
        }
    }

    async function initializeSkillsModule() {
        const form = document.querySelector('#skillsForm');
        if (form) {
            const assessment = await fetchSkillsAssessment();
            populateAssessment(assessment);

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                showLoading();
                try {
                    const formData = new FormData(form);
                    const results = await processSkillsAssessment(formData);
                    displaySkillsResults(results);
                    document.querySelector('.completion-message').style.display = 'block';
                } finally {
                    hideLoading();
                }
            });
        }
    }

    async function initializeMilitaryModule() {
        const militaryTool = document.querySelector('.military-tool');
        if (militaryTool) {
            militaryTool.addEventListener('submit', async function(e) {
                e.preventDefault();
                const mos = militaryTool.querySelector('input[type="text"]').value;
                
                showLoading();
                try {
                    const translation = await fetchMilitaryTranslation(mos);
                    displayMilitaryResults(translation);
                } finally {
                    hideLoading();
                }
            });
        }
    }

    async function initializeResumeModule() {
        const resumeTool = document.querySelector('.resume-tool');
        if (resumeTool) {
            const generateBtn = resumeTool.querySelector('.generate-btn');
            generateBtn.addEventListener('click', async function() {
                const resumeData = collectResumeData();
                showLoading();
                try {
                    const generatedResume = await generateResume(resumeData);
                    displayGeneratedResume(generatedResume);
                } finally {
                    hideLoading();
                }
            });
        }
    }

    // Display functions
    function displayComparisonResults(data) {
        const resultsContainer = document.querySelector('.comparison-results');
        if (resultsContainer && data) {
            // Implement comparison display logic
            resultsContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    }

    function displayJobResults(jobs) {
        const resultsContainer = document.querySelector('.job-results');
        if (resultsContainer && jobs) {
            // Implement job results display logic
            resultsContainer.innerHTML = jobs.map(job => `
                <div class="job-card">
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                    <p>${job.location}</p>
                </div>
            `).join('');
        }
    }

    function displaySearchResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer && results) {
            // Implement search results display logic
            resultsContainer.innerHTML = results.map(result => `
                <div class="search-result">
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                </div>
            `).join('');
        }
    }

    function displaySkillsResults(results) {
        const resultsContainer = document.querySelector('.assessment-content');
        if (resultsContainer && results) {
            // Implement skills results display logic
            resultsContainer.innerHTML = `
                <div class="skills-results">
                    <h3>Your Skills Assessment Results</h3>
                    <div class="skills-chart"></div>
                </div>
            `;
        }
    }

    function displayMilitaryResults(translation) {
        const resultsContainer = document.querySelector('.military-results');
        if (resultsContainer && translation) {
            // Implement military translation results display logic
            resultsContainer.innerHTML = `
                <div class="translation-results">
                    <h3>Civilian Career Matches</h3>
                    ${translation.matches.map(match => `
                        <div class="career-match">
                            <h4>${match.title}</h4>
                            <p>${match.description}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    function displayGeneratedResume(resume) {
        const resumeContainer = document.querySelector('.resume-sections');
        if (resumeContainer && resume) {
            // Implement resume display logic
            resumeContainer.innerHTML = `
                <div class="generated-resume">
                    <h3>Generated Resume</h3>
                    <div class="resume-content">
                        ${resume.sections.map(section => `
                            <div class="resume-section">
                                <h4>${section.title}</h4>
                                ${section.content}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Utility functions
    function collectResumeData() {
        // Implement resume data collection logic
        return {
            personal: {
                name: document.querySelector('[name="name"]')?.value,
                email: document.querySelector('[name="email"]')?.value,
                phone: document.querySelector('[name="phone"]')?.value
            },
            experience: [],
            education: [],
            skills: []
        };
    }

    function populateAssessment(assessment) {
        const container = document.querySelector('.assessment-content');
        if (container && assessment) {
            // Implement assessment population logic
            container.innerHTML = assessment.questions.map((q, index) => `
                <div class="question" data-id="${index}">
                    <h4>${q.text}</h4>
                    <div class="options">
                        ${q.options.map(opt => `
                            <label>
                                <input type="radio" name="q${index}" value="${opt.value}">
                                ${opt.text}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    async function processSkillsAssessment(formData) {
        // Implement assessment processing logic
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = value;
        }
        return answers;
    }

    // Initialize default module
    loadModule('opportunities');
});