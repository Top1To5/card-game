// Facebook Login Callback Handler - Production Environment
// Processes Facebook authentication response and handles user data

class FacebookCallbackHandler {
    constructor() {
        this.isTestMode = false;
        this.gameUrl = 'index.html';
        this.redirectDelay = 5000; // 5 seconds
        this.init();
    }
    
    init() {
        // Initialize callback processing
        this.logMessage('Initializing Facebook callback handler...');
        
        // Check if we're in an iframe (Facebook login popup)
        if (window.location !== window.parent.location) {
            this.logMessage('Detected iframe environment');
        }
        
        // Start processing the callback
        setTimeout(() => {
            this.processCallback();
        }, 1000);
    }
    
    processCallback() {
        try {
            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const fragment = new URLSearchParams(window.location.hash.substring(1));
            
            // Check for Facebook OAuth parameters
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            
            // Check for access token in fragment (implicit flow)
            const accessToken = fragment.get('access_token');
            const tokenType = fragment.get('token_type');
            const expiresIn = fragment.get('expires_in');
            
            this.logMessage('Processing OAuth response...', {
                code: code ? 'present' : 'missing',
                state: state ? 'present' : 'missing',
                accessToken: accessToken ? 'present' : 'missing',
                error: error || 'none'
            });
            
            if (error) {
                this.handleError(error, errorDescription);
                return;
            }
            
            if (accessToken) {
                this.handleAccessToken(accessToken, tokenType, expiresIn);
            } else if (code) {
                this.handleAuthCode(code, state);
            } else {
                this.handleError('invalid_response', 'No authentication data received');
            }
            
        } catch (error) {
            this.logMessage('Error processing callback:', error);
            this.handleError('callback_error', error.message);
        }
    }
    
    handleAccessToken(accessToken, tokenType, expiresIn) {
        this.logMessage('Processing access token...', {
            tokenType: tokenType,
            expiresIn: expiresIn
        });
        
        // Validate token and get user info
        this.getUserInfo(accessToken);
    }
    
    handleAuthCode(code, state) {
        this.logMessage('Processing authorization code...', {
            code: code.substring(0, 10) + '...',
            state: state
        });
        
        // Exchange authorization code for access token
        this.exchangeCodeForToken(code, state);
    }
    
    exchangeCodeForToken(code, state) {
        this.updateStatus('Exchanging authorization code for access token...', 'processing');
        
        // In production, this would make a server-side call to exchange code for token
        // For now, we'll simulate this process
        const tokenEndpoint = '/api/facebook-token-exchange.php';
        const requestData = {
            code: code,
            state: state,
            redirect_uri: window.location.origin + '/facebook-callback.html'
        };
        
        fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.handleError('token_exchange_error', data.error);
            } else {
                this.handleAccessToken(data.access_token, data.token_type, data.expires_in);
            }
        })
        .catch(error => {
            this.handleError('network_error', error.message);
        });
    }
    
    getUserInfo(accessToken) {
        this.updateStatus('Retrieving user information...', 'processing');
        
        // Make Facebook Graph API call
        this.makeGraphAPICall(accessToken);
    }
    
    makeGraphAPICall(accessToken) {
        const graphUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
        
        fetch(graphUrl)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.handleError('api_error', data.error.message);
                } else {
                    this.handleUserData(data, accessToken);
                }
            })
            .catch(error => {
                this.handleError('network_error', error.message);
            });
    }
    
    handleUserData(userData, accessToken) {
        this.logMessage('User data received:', userData);
        
        // Store user data
        this.storeUserData(userData, accessToken);
        
        // Save user to database
        this.saveUserToDatabase(userData, accessToken);
        
        // Display user information
        this.displayUserInfo(userData);
        
        // Update status to success
        this.updateStatus('Login successful! Welcome, ' + userData.name, 'success');
        
        // Show redirect countdown
        this.showRedirectCountdown();
    }
    
    storeUserData(userData, accessToken) {
        try {
            const userSession = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                picture: userData.picture?.data?.url || null,
                accessToken: accessToken,
                loginTime: new Date().toISOString(),
                isTestMode: this.isTestMode
            };
            
            // Store in localStorage
            localStorage.setItem('facebookUser', JSON.stringify(userSession));
            localStorage.setItem('userLoggedIn', 'true');
            
            this.logMessage('User data stored successfully');
            
        } catch (error) {
            this.logMessage('Error storing user data:', error);
        }
    }
    
    saveUserToDatabase(userData, accessToken) {
        // Save user data to database via API
        const apiEndpoint = '/api/save-facebook-user.php';
        const requestData = {
            facebook_id: userData.id,
            name: userData.name,
            email: userData.email,
            picture_url: userData.picture?.data?.url || null,
            access_token: accessToken
        };
        
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.logMessage('User saved to database successfully');
            } else {
                this.logMessage('Error saving user to database:', data.error);
            }
        })
        .catch(error => {
            this.logMessage('Database save error:', error);
        });
    }
    
    displayUserInfo(userData) {
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userId = document.getElementById('userId');
        
        if (userName) userName.textContent = userData.name;
        if (userEmail) userEmail.textContent = userData.email;
        if (userId) userId.textContent = userData.id;
        
        if (userInfo) {
            userInfo.style.display = 'block';
        }
    }
    
    showRedirectCountdown() {
        const redirectInfo = document.getElementById('redirectInfo');
        const countdown = document.getElementById('countdown');
        const actionButtons = document.getElementById('actionButtons');
        
        if (redirectInfo) {
            redirectInfo.style.display = 'block';
        }
        
        if (actionButtons) {
            actionButtons.style.display = 'block';
        }
        
        let seconds = 5;
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdown) {
                countdown.textContent = seconds;
            }
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                this.redirectToGame();
            }
        }, 1000);
    }
    
    handleError(errorType, errorMessage) {
        this.logMessage('Error occurred:', { errorType, errorMessage });
        
        this.updateStatus('Login failed', 'error');
        
        const errorDetails = document.getElementById('errorDetails');
        const actionButtons = document.getElementById('actionButtons');
        
        if (errorDetails) {
            errorDetails.innerHTML = `
                <strong>Error Type:</strong> ${errorType}<br>
                <strong>Message:</strong> ${errorMessage}<br>
                <strong>Time:</strong> ${new Date().toLocaleString()}
            `;
            errorDetails.style.display = 'block';
        }
        
        if (actionButtons) {
            actionButtons.style.display = 'block';
        }
        
        this.hideLoader();
    }
    
    updateStatus(message, type) {
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.innerHTML = `<strong>${message}</strong>`;
            statusMessage.className = `status-message status-${type}`;
        }
        
        if (type === 'success' || type === 'error') {
            this.hideLoader();
        }
    }
    
    hideLoader() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
    
    redirectToGame() {
        this.logMessage('Redirecting to game...');
        
        // Add success parameter to game URL
        const gameUrl = this.gameUrl + '?login=success&timestamp=' + Date.now();
        window.location.href = gameUrl;
    }
    
    logMessage(message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp: timestamp,
            message: message,
            data: data,
            testMode: this.isTestMode
        };
        
        console.log('[Facebook Callback]', logEntry);
        
        // Store logs for debugging (production should use server-side logging)
        const logs = JSON.parse(localStorage.getItem('facebookCallbackLogs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 20 logs in production
        if (logs.length > 20) {
            logs.splice(0, logs.length - 20);
        }
        
        localStorage.setItem('facebookCallbackLogs', JSON.stringify(logs));
    }
}

// Global functions for button handlers
function redirectToGame() {
    if (window.callbackHandler) {
        window.callbackHandler.redirectToGame();
    }
}

function retryLogin() {
    // Clear any stored auth data
    localStorage.removeItem('facebookUser');
    localStorage.removeItem('userLoggedIn');
    
    // Redirect back to game to try login again
    window.location.href = 'index.html';
}

function showHelp() {
    alert('If you\'re experiencing issues with Facebook login, please try:\n\n' +
          '1. Clear your browser cache and cookies\n' +
          '2. Disable browser extensions that might block popups\n' +
          '3. Make sure JavaScript is enabled\n' +
          '4. Check your internet connection\n\n' +
          'If problems persist, please contact support.');
}

// Initialize callback handler when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.callbackHandler = new FacebookCallbackHandler();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('[Facebook Callback] Page hidden');
    } else {
        console.log('[Facebook Callback] Page visible');
    }
});

// Security: Clear sensitive data on page unload
window.addEventListener('beforeunload', function() {
    // Clear any temporary auth data but keep user session
    sessionStorage.removeItem('tempFacebookAuth');
});