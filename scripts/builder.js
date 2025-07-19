document.addEventListener('DOMContentLoaded', function() {
    // First verify all required elements exist
    const generatePreviewBtn = document.getElementById('generate-preview');
    if (!generatePreviewBtn) {
        console.error('Generate Preview button not found! Check your HTML for element with ID "generate-preview"');
        return;
    }

    // State variables
    let currentTheme = 'professional';
    let profilePhoto = 'https://via.placeholder.com/150';
    let portfolioData = {};

    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formSections = document.querySelectorAll('.form-section');
    const previewContainer = document.getElementById('previewContainer');
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const skillsContainer = document.getElementById('skills-container');
    const addSkillBtn = document.getElementById('add-skill');
    const projectsContainer = document.getElementById('projects-container');
    const addProjectBtn = document.getElementById('add-project');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Initialize form with one skill and one project
    addSkillItem();
    addProjectItem();

    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            setActiveTab(tabId);
        });
    });

    // Next/previous buttons
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            const nextTab = this.getAttribute('data-next');
            setActiveTab(nextTab);
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            const prevTab = this.getAttribute('data-prev');
            setActiveTab(prevTab);
        });
    });

    // Skills management
    addSkillBtn.addEventListener('click', addSkillItem);

    // Projects management
    addProjectBtn.addEventListener('click', addProjectItem);

    // Photo upload handling
    photoUpload.addEventListener('change', handlePhotoUpload);

    // Theme selection - updated to prevent auto-adding fields
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            currentTheme = this.getAttribute('data-theme');
            setActiveTheme(currentTheme);
            
            // Only update preview if there's content and preview already exists
            if (previewContainer.innerHTML.includes('portfolio-container')) {
                const currentData = collectFormData();
                previewContainer.innerHTML = generatePortfolioHTML(currentData);
            }
        });
    });

    // Generate preview with proper error handling
    generatePreviewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Generate Preview clicked');
        generatePreview();
    });

    // Live preview updates
    const livePreviewFields = ['name', 'title', 'bio', 'email', 'phone'];
    livePreviewFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                if (previewContainer && previewContainer.innerHTML.includes('portfolio-container')) {
                    const currentData = collectFormData();
                    previewContainer.innerHTML = generatePortfolioHTML(currentData);
                }
            });
        }
    });

    // Helper functions
    function setActiveTab(tabId) {
        // Update active tab button
        tabButtons.forEach(btn => {
            btn.classList.remove('border-b-2', 'border-blue-500', 'text-blue-600');
            btn.classList.add('text-gray-500');
        });
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('border-b-2', 'border-blue-500', 'text-blue-600');
            activeTabBtn.classList.remove('text-gray-500');
        }
        
        // Show corresponding form section
        formSections.forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(`${tabId}-form`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    function addSkillItem() {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item mb-4 flex items-center';
        skillItem.innerHTML = `
            <input type="text" placeholder="Skill name" class="skill-name px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow">
            <select class="skill-level ml-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
            </select>
            <button class="remove-skill ml-2 text-red-500 hover:text-red-700">×</button>
        `;
        if (skillsContainer) {
            skillsContainer.appendChild(skillItem);
            
            // Add event to remove button
            const removeBtn = skillItem.querySelector('.remove-skill');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    skillItem.remove();
                });
            }
        }
    }

    function addProjectItem() {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item mb-6 p-4 border rounded-lg';
        projectItem.innerHTML = `
            <div class="mb-4">
                <label class="block text-gray-700 mb-2">Project Title</label>
                <input type="text" class="project-title w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 mb-2">Description</label>
                <textarea class="project-description w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 mb-2">Technologies Used</label>
                <input type="text" class="project-tech w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Comma separated">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 mb-2">Project URL (optional)</label>
                <input type="url" class="project-url w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <button class="remove-project text-red-500 hover:text-red-700">Remove Project</button>
        `;
        if (projectsContainer) {
            projectsContainer.appendChild(projectItem);
            
            // Add event to remove button
            const removeBtn = projectItem.querySelector('.remove-project');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    projectItem.remove();
                });
            }
        }
    }

    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePhoto = event.target.result;
                if (photoPreview) {
                    photoPreview.src = profilePhoto;
                }
                if (previewContainer && previewContainer.innerHTML.includes('portfolio-container')) {
                    const currentData = collectFormData();
                    previewContainer.innerHTML = generatePortfolioHTML(currentData);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function setActiveTheme(theme) {
        themeOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        const selectedTheme = document.querySelector(`.theme-option[data-theme="${theme}"]`);
        if (selectedTheme) {
            selectedTheme.classList.add('selected');
        }
    }

    function generatePreview() {
        console.log('Generating preview...');
        
        if (!previewContainer) {
            console.error('Preview container not found');
            return;
        }

        try {
            const data = collectFormData();
            console.log('Portfolio data:', data);
            previewContainer.innerHTML = generatePortfolioHTML(data);
            console.log('Preview generated successfully');
        } catch (error) {
            console.error('Error generating preview:', error);
            if (previewContainer) {
                previewContainer.innerHTML = `<div class="text-red-500 p-4">Error generating preview: ${error.message}</div>`;
            }
        }
    }

    function collectFormData() {
        const data = {
            basic: {
                name: document.getElementById('name')?.value || '',
                title: document.getElementById('title')?.value || '',
                bio: document.getElementById('bio')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || ''
            },
            skills: [],
            projects: [],
            social: {
                linkedin: document.getElementById('linkedin')?.value || '',
                github: document.getElementById('github')?.value || '',
                twitter: document.getElementById('twitter')?.value || '',
                website: document.getElementById('website')?.value || ''
            }
        };
        
        // Get skills - only if they have a name
        document.querySelectorAll('.skill-item').forEach(item => {
            const skillName = item.querySelector('.skill-name')?.value.trim();
            if (skillName) {
                data.skills.push({
                    name: skillName,
                    level: item.querySelector('.skill-level')?.value || 'beginner'
                });
            }
        });
        
        // Get projects - only if they have a title
        document.querySelectorAll('.project-item').forEach(item => {
            const projectTitle = item.querySelector('.project-title')?.value.trim();
            if (projectTitle) {
                data.projects.push({
                    title: projectTitle,
                    description: item.querySelector('.project-description')?.value || '',
                    technologies: item.querySelector('.project-tech')?.value || '',
                    url: item.querySelector('.project-url')?.value || ''
                });
            }
        });
        
        return data;
    }

    function generatePortfolioHTML(data) {
        let themeStyles = {};
        
        switch(currentTheme) {
            case 'professional':
                themeStyles = {
                    primaryColor: 'text-gray-800',
                    secondaryColor: 'text-blue-600',
                    bgColor: 'bg-white',
                    skillColor: 'bg-blue-600',
                    borderColor: 'border-gray-200',
                    headerBg: 'bg-gray-50'
                };
                break;
            case 'modern':
                themeStyles = {
                    primaryColor: 'text-gray-800',
                    secondaryColor: 'text-green-600',
                    bgColor: 'bg-white',
                    skillColor: 'bg-green-600',
                    borderColor: 'border-gray-200',
                    headerBg: 'bg-green-50'
                };
                break;
            case 'creative':
                themeStyles = {
                    primaryColor: 'text-gray-800',
                    secondaryColor: 'text-red-500',
                    bgColor: 'bg-white',
                    skillColor: 'bg-red-500',
                    borderColor: 'border-gray-200',
                    headerBg: 'bg-red-50'
                };
                break;
            default:
                themeStyles = {
                    primaryColor: 'text-gray-800',
                    secondaryColor: 'text-blue-600',
                    bgColor: 'bg-white',
                    skillColor: 'bg-blue-600',
                    borderColor: 'border-gray-200',
                    headerBg: 'bg-gray-50'
                };
        }

        return `
            <div class="portfolio-container font-sans max-w-4xl mx-auto ${themeStyles.bgColor}">
                <!-- Header Section with Photo -->
                <header class="${themeStyles.headerBg} py-8 px-6 mb-8 rounded-lg">
                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <img src="${profilePhoto}" alt="Profile Photo" class="w-32 h-32 rounded-full object-cover border-4 ${themeStyles.borderColor} shadow-md">
                        <div>
                            <h1 class="text-4xl font-bold ${themeStyles.primaryColor}">${data.basic.name || 'Your Name'}</h1>
                            <p class="text-xl ${themeStyles.secondaryColor} mt-2">${data.basic.title || 'Professional Title'}</p>
                            <p class="text-gray-600 mt-4">${data.basic.bio || 'A short bio about yourself and your professional journey.'}</p>
                        </div>
                    </div>
                </header>
                
                <!-- Contact Info -->
                <section class="mb-8">
                    <h2 class="text-2xl font-bold mb-4 ${themeStyles.primaryColor} border-b pb-2">Contact Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p><span class="font-medium">Email:</span> ${data.basic.email || 'your.email@example.com'}</p>
                        ${data.basic.phone ? `<p><span class="font-medium">Phone:</span> ${data.basic.phone}</p>` : ''}
                    </div>
                </section>
                
                <!-- Skills Section - Only show if there are skills -->
                ${data.skills.length > 0 ? `
                <section class="mb-8">
                    <h2 class="text-2xl font-bold mb-4 ${themeStyles.primaryColor} border-b pb-2">Skills</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${data.skills.map(skill => `
                            <div class="skill-item">
                                <div class="flex justify-between mb-1">
                                    <span class="font-medium">${skill.name}</span>
                                    <span class="text-sm text-gray-600 capitalize">${skill.level}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="${themeStyles.skillColor} h-2.5 rounded-full" style="width: ${getSkillWidth(skill.level)}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
                
                <!-- Projects Section - Only show if there are projects -->
                ${data.projects.length > 0 ? `
                <section class="mb-8">
                    <h2 class="text-2xl font-bold mb-4 ${themeStyles.primaryColor} border-b pb-2">Projects</h2>
                    <div class="space-y-6">
                        ${data.projects.map(project => `
                            <div class="project-item border ${themeStyles.borderColor} rounded-lg p-4 hover:shadow-md transition">
                                <h3 class="text-xl font-semibold ${themeStyles.primaryColor}">${project.title}</h3>
                                ${project.url ? `<a href="${project.url}" target="_blank" class="${themeStyles.secondaryColor} text-sm block mb-2 hover:underline">View Project</a>` : ''}
                                <p class="text-gray-700 mb-3">${project.description || 'Project description goes here.'}</p>
                                ${project.technologies ? `
                                <div class="tech-tags flex flex-wrap gap-2">
                                    ${project.technologies.split(',').map(tech => tech.trim()).filter(tech => tech).map(tech => `
                                        <span class="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">${tech}</span>
                                    `).join('')}
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
                
                <!-- Social Links -->
                ${data.social.linkedin || data.social.github || data.social.twitter || data.social.website ? `
                <section class="mb-8">
                    <h2 class="text-2xl font-bold mb-4 ${themeStyles.primaryColor} border-b pb-2">Connect With Me</h2>
                    <div class="flex flex-wrap gap-4">
                        ${data.social.linkedin ? `<a href="${data.social.linkedin}" target="_blank" class="${themeStyles.secondaryColor} hover:underline flex items-center gap-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            LinkedIn
                        </a>` : ''}
                        ${data.social.github ? `<a href="${data.social.github}" target="_blank" class="text-gray-800 hover:underline flex items-center gap-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>
                            GitHub
                        </a>` : ''}
                        ${data.social.twitter ? `<a href="${data.social.twitter}" target="_blank" class="text-blue-400 hover:underline flex items-center gap-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                            Twitter
                        </a>` : ''}
                        ${data.social.website ? `<a href="${data.social.website}" target="_blank" class="${currentTheme === 'modern' ? 'text-teal-600' : currentTheme === 'creative' ? 'text-yellow-600' : 'text-green-600'} hover:underline flex items-center gap-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" clip-rule="evenodd"/></svg>
                            Website
                        </a>` : ''}
                    </div>
                </section>
                ` : ''}
            </div>
        `;
    }

    function getSkillWidth(level) {
        switch(level) {
            case 'beginner': return 25;
            case 'intermediate': return 50;
            case 'advanced': return 75;
            case 'expert': return 100;
            default: return 25;
        }
    }
});