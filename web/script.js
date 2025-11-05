// Lab Controller Class
class LabController {
    constructor() {
        this.startBtn = document.getElementById('startBtn');
        this.statusArea = document.getElementById('statusArea');
        this.statusMessage = document.getElementById('statusMessage');
        this.ipDisplay = document.getElementById('ipDisplay');
        this.ipAddress = document.getElementById('ipAddress');
        this.copyBtn = document.getElementById('copyBtn');
        
        this.isDeploying = false;
        this.victimIP = null;
        
        this.init();
    }
    
    init() {
        // Attach event listeners
        this.startBtn.addEventListener('click', () => this.handleStartExercise());
        this.copyBtn.addEventListener('click', () => this.handleCopyIP());
        
        // Add keyboard shortcut for copy (Ctrl+C when IP field is focused)
        this.ipAddress.addEventListener('focus', () => {
            this.ipAddress.select();
        });
    }
    
    async handleStartExercise() {
        if (this.isDeploying) return;
        
        this.isDeploying = true;
        
        // Disable start button
        this.startBtn.classList.add('disabled');
        this.startBtn.innerHTML = `
            <span class="btn-icon">⏳</span>
            <span class="btn-text">DEPLOYING...</span>
        `;
        
        // Show status area
        this.statusArea.classList.remove('hidden');
        this.ipDisplay.classList.add('hidden');
        
        // Simulate deployment process
        try {
            const ip = await this.spawnVictimVM();
            this.victimIP = ip;
            
            // Update UI with success state
            this.statusMessage.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>DEPLOYMENT SUCCESSFUL</span>
            `;
            
            // Wait a moment then show IP
            setTimeout(() => {
                this.statusArea.classList.add('hidden');
                this.ipDisplay.classList.remove('hidden');
                this.ipAddress.value = this.victimIP;
                
                // Update button to restart mode
                this.startBtn.classList.remove('disabled');
                this.startBtn.innerHTML = `
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">RESTART EXERCISE</span>
                `;
                
                this.isDeploying = false;
                
                // Add animation to IP display
                this.animateIPDisplay();
            }, 1500);
            
        } catch (error) {
            this.handleDeploymentError(error);
        }
    }
    
    async spawnVictimVM() {
        // Simulated deployment function
        // In production, this would make an API call to the backend
        
        // Simulate deployment time (5-10 seconds)
        const deploymentTime = Math.floor(Math.random() * 5000) + 5000;
        
        return new Promise((resolve, reject) => {
            // Update status messages during deployment
            const messages = [
                'Initializing container...',
                'Setting up network...',
                'Configuring ProFTPD service...',
                'Starting Apache web server...',
                'Finalizing deployment...'
            ];
            
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                if (messageIndex < messages.length) {
                    this.statusMessage.innerHTML = `
                        <div class="spinner"></div>
                        <span>${messages[messageIndex]}</span>
                    `;
                    messageIndex++;
                }
            }, deploymentTime / messages.length);
            
            setTimeout(() => {
                clearInterval(messageInterval);
                
                // Generate a random IP address for simulation
                // In production, this would come from the actual container
                const ip = this.generateRandomIP();
                resolve(ip);
            }, deploymentTime);
        });
    }
    
    generateRandomIP() {
        // Generate a realistic private IP address
        const octets = [
            172,
            Math.floor(Math.random() * (31 - 16 + 1)) + 16, // 16-31 for Docker networks
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 254) + 1 // 1-254 (avoid .0 and .255)
        ];
        
        return octets.join('.');
    }
    
    handleDeploymentError(error) {
        console.error('Deployment failed:', error);
        
        this.statusMessage.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span style="color: #ef4444;">DEPLOYMENT FAILED</span>
        `;
        
        setTimeout(() => {
            this.statusArea.classList.add('hidden');
            this.startBtn.classList.remove('disabled');
            this.startBtn.innerHTML = `
                <span class="btn-icon">▶</span>
                <span class="btn-text">START EXERCISE</span>
            `;
            this.isDeploying = false;
        }, 3000);
    }
    
    async handleCopyIP() {
        if (!this.victimIP) return;
        
        try {
            // Try using the modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(this.victimIP);
            } else {
                // Fallback for older browsers
                this.ipAddress.select();
                document.execCommand('copy');
            }
            
            // Visual feedback
            this.copyBtn.classList.add('copied');
            const originalHTML = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
                this.copyBtn.innerHTML = originalHTML;
            }, 2000);
            
            // Show notification
            this.showNotification('IP address copied to clipboard!');
            
        } catch (err) {
            console.error('Failed to copy IP:', err);
            this.showNotification('Failed to copy IP address', 'error');
        }
    }
    
    animateIPDisplay() {
        // Add a subtle animation when IP is displayed
        this.ipDisplay.style.opacity = '0';
        this.ipDisplay.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            this.ipDisplay.style.transition = 'all 0.5s ease';
            this.ipDisplay.style.opacity = '1';
            this.ipDisplay.style.transform = 'translateY(0)';
        }, 100);
    }
    
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Advanced Backend Integration (Placeholder for production)
class LabBackendAPI {
    constructor() {
        this.apiEndpoint = '/api/lab'; // Placeholder endpoint
    }
    
    async deployContainer() {
        // In production, this would make an actual API call
        // For now, it's a placeholder that returns simulated data
        
        // Example of what the real implementation would look like:
        /*
        const response = await fetch(`${this.apiEndpoint}/deploy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                labType: 'proftpd-1.3.5',
                config: {
                    enableModCopy: true,
                    ftpPort: 21,
                    httpPort: 80
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Deployment failed');
        }
        
        const data = await response.json();
        return data.victimIP;
        */
        
        // Simulated response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    victimIP: '172.17.0.4',
                    containerId: 'lab_' + Date.now(),
                    services: {
                        ftp: { port: 21, status: 'running' },
                        http: { port: 80, status: 'running' }
                    }
                });
            }, 3000);
        });
    }
    
    async stopContainer(containerId) {
        // Placeholder for stopping container
        console.log('Stopping container:', containerId);
    }
    
    async getContainerStatus(containerId) {
        // Placeholder for getting container status
        return {
            status: 'running',
            uptime: '5 minutes',
            resources: {
                cpu: '5%',
                memory: '128MB'
            }
        };
    }
}

// Initialize the lab controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.labController = new LabController();
    window.labAPI = new LabBackendAPI();
    
    // Add console banner for hackers
    console.log('%c🎯 ProFTPD 1.3.5 mod_copy RCE Lab', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%c⚠️ For educational purposes only!', 'color: #f59e0b; font-size: 14px;');
    console.log('%cHappy hunting! 🐛', 'color: #10b981; font-size: 14px;');
});
