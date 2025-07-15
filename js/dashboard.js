// Dashboard JavaScript
// Interactive dashboard for project tracking

class ProjectDashboard {
    constructor() {
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.addInteractivity();
    }

    // Initialize Chart.js charts
    initializeCharts() {
        this.createCodeQualityChart();
    }

    // Create code quality radar chart
    createCodeQualityChart() {
        const ctx = document.getElementById('codeQualityChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Code Quality',
                    'Performance',
                    'Security',
                    'Maintainability',
                    'Documentation',
                    'Testing'
                ],
                datasets: [{
                    label: 'Current Project',
                    data: [95, 93, 88, 92, 85, 98],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Start real-time updates simulation
    startRealTimeUpdates() {
        // Update progress bars with animation
        this.animateProgressBars();
        
        // Simulate real-time activity updates
        this.updateActivityFeed();
        
        // Update timestamp
        this.updateTimestamp();
    }

    // Animate progress bars
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill, .coverage-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });

        // Animate task bars
        const taskBars = document.querySelectorAll('.task-bar');
        taskBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleX(1)';
                bar.style.transformOrigin = 'left';
            }, index * 200);
        });
    }

    // Update activity feed with new entries
    updateActivityFeed() {
        const activityFeed = document.querySelector('.activity-feed');
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Add new activity entry
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <span class="activity-time">${currentTime}</span>
            <span class="activity-description">Dashboard loaded and displaying real-time data</span>
            <span class="activity-author">System</span>
        `;
        
        // Insert at the beginning
        activityFeed.insertBefore(newActivity, activityFeed.firstChild);
    }

    // Update timestamp
    updateTimestamp() {
        const footer = document.querySelector('.footer-content p:last-child');
        const now = new Date();
        const timestamp = now.toISOString().split('T')[0];
        footer.textContent = footer.textContent.replace(/\d{4}-\d{2}-\d{2}/, timestamp);
    }

    // Add interactive features
    addInteractivity() {
        // Add hover effects to cards
        this.addCardHoverEffects();
        
        // Add click-to-expand functionality
        this.addExpandableCards();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
    }

    // Add hover effects to cards
    addCardHoverEffects() {
        const cards = document.querySelectorAll('.overview-card, .team-member, .metric-card, .task-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // Add expandable cards functionality
    addExpandableCards() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            member.addEventListener('click', () => {
                const memberName = member.querySelector('h4').textContent;
                this.showMemberDetails(memberName);
            });
            
            // Add cursor pointer
            member.style.cursor = 'pointer';
        });
    }

    // Show member details (placeholder for future expansion)
    showMemberDetails(memberName) {
        // This could open a modal with detailed member information
        console.log(`Showing details for ${memberName}`);
        
        // For now, just highlight the member
        const memberCards = document.querySelectorAll('.team-member');
        memberCards.forEach(card => {
            card.style.opacity = '0.6';
        });
        
        const clickedMember = event.currentTarget;
        clickedMember.style.opacity = '1';
        clickedMember.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            memberCards.forEach(card => {
                card.style.opacity = '1';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });
        }, 2000);
    }

    // Add keyboard navigation
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Press 'R' to refresh data
            if (e.key.toLowerCase() === 'r' && !e.ctrlKey) {
                e.preventDefault();
                this.refreshDashboard();
            }
            
            // Press 'H' to highlight current milestone
            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                this.highlightCurrentMilestone();
            }
        });
    }

    // Refresh dashboard data
    refreshDashboard() {
        // Add refresh animation
        const dashboard = document.querySelector('.dashboard-main');
        dashboard.style.opacity = '0.7';
        
        // Simulate data refresh
        setTimeout(() => {
            dashboard.style.opacity = '1';
            this.updateActivityFeed();
            this.animateProgressBars();
            
            // Show refresh notification
            this.showNotification('Dashboard refreshed!');
        }, 1000);
    }

    // Highlight current milestone
    highlightCurrentMilestone() {
        const currentMilestone = document.querySelector('.milestone.current');
        if (currentMilestone) {
            currentMilestone.style.background = 'rgba(102, 126, 234, 0.1)';
            currentMilestone.style.borderRadius = '8px';
            currentMilestone.style.padding = '1rem';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                currentMilestone.style.background = 'transparent';
                currentMilestone.style.padding = '0';
            }, 3000);
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    // Get project metrics (for potential API integration)
    getProjectMetrics() {
        return {
            completion: 75,
            timelineProgress: 40,
            qualityScore: 9.8,
            teamEfficiency: 250,
            tasksCompleted: {
                development: 15,
                design: 11,
                testing: 13,
                management: 12
            },
            milestones: {
                total: 4,
                completed: 3,
                current: 1
            },
            performance: {
                desktop: 95,
                mobile: 93,
                accessibility: 100
            }
        };
    }

    // Export dashboard data
    exportData() {
        const data = this.getProjectMetrics();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project-dashboard-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new ProjectDashboard();
    
    // Add export functionality
    console.log('📊 Project Dashboard Loaded');
    console.log('💡 Keyboard shortcuts:');
    console.log('  - Press "R" to refresh data');
    console.log('  - Press "H" to highlight current milestone');
    
    // Make dashboard globally accessible for debugging
    window.dashboard = dashboard;
});