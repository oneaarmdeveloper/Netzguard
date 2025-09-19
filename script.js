const sampleEmails = [
    {
        subject: "Account Verification Required",
        content: `Dear Customer,
Your account has been suspended due to suspicious activity. 
Click here immediately to verify your account: http://secure-bank-verify.com/login

You must act now or your account will be permanently closed.

Best regards,
Security Team`,
        description: "Classic phishing with Urgency and fake verification link"
    },
    {
        subject: "Weekly Newsletter",
        content: `Hello Subscriber,
Thank you for subscribing to our weekly newsletter. Here are this week's highlights:

- New product launches
- Industry insights
- Customer success stories

You can unsubscribe at any time using the link below.
Privacy policy: www.company.com/privacy

Best regards,
Marketing Team`,
        description: "Legitimate newsletter with unsubscribe and privacy policy"
    },
    {
        subject: "CONGRATULATIONS! You have won $1,000,000 !!!",
        content: `URGENT!!! CONGRATULATIONS!!!
You have been selected as the WINNER of our international lottery!
You have won ONE MILLION DOLLARS ($1,000,000)!!!

To claim your prize, send your personal details immediately:
- Full name
- Social security number
- Bank account details

Send to: winner@nigerian-lottery.net

ACT NOW!!! This offer expires TODAY!!!`,
        description: "Obvious lottery scam with multiple red flags"
    },
    {
        subject: "Meeting Reminder",
        content: `Hi Team,

Just a reminder about our meeting tomorrow at 2 PM in Conference Room B.

Agenda:
- Project updates
- Budget review
- Next quarter planning

Please bring your reports and any questions you might have.

Thanks,
John Manager`,
        description: "Normal business email with no suspicious elements"
    },
    {
        subject: "Urgent: Update your payment Information",
        content: `Dear Valued Customer,

We have detected an issue with your payment method. Your account will be suspended if you don't update your payment information within 24 hours.

Click here to update: http://paypal-verify.com/update-payment

Failure to comply will result in immediate account closure.

PayPal Security Team`,
        description: "Payment update scam with PayPal domain"
    }
];

class PhishingClassifier {
    constructor() {
        this.suspiciousKeywords = {
            'urgent': 2, 'immediate': 2, 'expires today': 3, 'act now': 3, 'limited time': 2,
            'account suspended': 4, 'verify account': 3, 'click here': 2, 'confirm identity': 3,
            'update payment': 4, 'congratulations': 2, 'winner': 3, 'free money': 4,
            'lottery': 4, 'inheritance': 4, 'nigerian prince': 5, 'wire transfer': 4,
            'social security': 3
        };
        this.legitimateKeywords = {
            'unsubscribe': -1, 'privacy policy': -1, 'terms of service': -1, 'official': -1
        };
    }

    classify(emailText) {
        const text = emailText.toLowerCase();
        let suspicionScore = 0;
        let foundKeywords = [];

        for (const [keyword, weight] of Object.entries(this.suspiciousKeywords)) {
            if (text.includes(keyword)) {
                suspicionScore += weight;
                foundKeywords.push(keyword);
            }
        }

        for (const [keyword, weight] of Object.entries(this.legitimateKeywords)) {
            if (text.includes(keyword)) {
                suspicionScore += weight;
            }
        }

        suspicionScore += this.checkURLs(text);
        suspicionScore += this.checkGrammar(text);
        suspicionScore += this.checkUrgency(text);

        const confidence = Math.min(Math.abs(suspicionScore) * 10, 100);
        const isPhishing = suspicionScore >= 3;

        return {
            isPhishing,
            confidence,
            score: suspicionScore,
            foundKeywords,
            riskLevel: this.getRiskLevel(suspicionScore)
        };
    }

    checkURLs(text) {
        const urlPattern = /https?:\/\/[^\s]+/g;
        const urls = text.match(urlPattern) || [];
        let score = 0;

        urls.forEach(url => {
            if (url.includes('bit.ly') || url.includes('tinyurl')) score += 2;
            if (url.includes('secure-bank') || url.includes('paypal-verify')) score += 3;
        });

        return score;
    }

    checkGrammar(text) {
        const grammarIssues = ['recieve', 'loose', 'there account', 'you\'re account', 'click hear', 'immediately'];
        return grammarIssues.reduce((score, issue) => text.includes(issue) ? score + 1 : score, 0);
    }

    checkUrgency(text) {
        let score = 0;
        const exclamationCount = (text.match(/!/g) || []).length;
        if (exclamationCount > 3) score += 1;

        const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
        if (capsWords.length > 2) score += 1;

        return score;
    }

    getRiskLevel(score) {
        if (score >= 5) return 'HIGH';
        if (score >= 3) return 'MEDIUM';
        if (score >= 1) return 'LOW';
        return 'SAFE';
    }
}

class NetworkAnomalyDetector {
    constructor(app) {
        this.isMonitoring = false;
        this.detectedAnomalies = [];
        this.monitoringInterval = null;
        this.app = app; // Reference to NetGuardApp for alerts
    }

    startMonitoring() {
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.simulateNetworkAnalysis();
        }, 3000);
    }

    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }

    simulateNetworkAnalysis() {
        const currentTraffic = this.generateRandomTraffic();
        const anomaly = this.detectAnomaly(currentTraffic);

        if (anomaly) {
            this.detectedAnomalies.push(anomaly);
            this.app.addAlert({
                type: 'network',
                severity: anomaly.severity,
                message: `Network anomaly: ${anomaly.reasons.join(', ')}`,
                details: anomaly,
                timestamp: new Date()
            });
        }

        this.updateNetworkDisplay(currentTraffic, anomaly);
    }

    generateRandomTraffic() {
        return {
            packetSize: Math.floor(Math.random() * 3000) + 500,
            connectionsPerMinute: Math.floor(Math.random() * 200) + 10,
            port: Math.floor(Math.random() * 65535) + 1,
            protocol: ['HTTP', 'HTTPS', 'FTP', 'SSH', 'UNKNOWN'][Math.floor(Math.random() * 5)],
            sourceIP: this.generateRandomIP(),
            timestamp: new Date()
        };
    }

    detectAnomaly(traffic) {
        let anomalyScore = 0;
        let anomalyReasons = [];

        if (traffic.packetSize > 3000) {
            anomalyScore += 2;
            anomalyReasons.push('Large packet size');
        }

        if (traffic.connectionsPerMinute > 150) {
            anomalyScore += 3;
            anomalyReasons.push('High connection frequency');
        }

        if (traffic.port < 1024 && ![80, 443, 25, 110, 143].includes(traffic.port)) {
            anomalyScore += 2;
            anomalyReasons.push('Suspicious port usage');
        }

        if (traffic.protocol === 'UNKNOWN') {
            anomalyScore += 1;
            anomalyReasons.push('Unknown protocol');
        }

        if (anomalyScore >= 2) {
            return {
                type: 'NETWORK_ANOMALY',
                severity: this.getSeverity(anomalyScore),
                traffic,
                reasons: anomalyReasons,
                score: anomalyScore,
                timestamp: new Date()
            };
        }

        return null;
    }

    generateRandomIP() {
        return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    }

    getSeverity(score) {
        if (score >= 5) return 'CRITICAL';
        if (score >= 3) return 'HIGH';
        return 'MEDIUM';
    }

    updateNetworkDisplay(traffic, anomaly) {
        const networkResults = document.getElementById('networkResults');
        if (!networkResults) return;

        const statusClass = anomaly ? 'error' : 'info';
        const statusIcon = anomaly ? '⚠️' : '✅';
        const statusText = anomaly ? 'Anomaly Detected' : 'Traffic Normal';

        networkResults.innerHTML = `
            <div class="result-message ${statusClass}">
                <span class="result-icon">${statusIcon}</span>
                <span class="result-text">${statusText}</span>
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                <div><strong>Source IP:</strong> ${traffic.sourceIP}</div>
                <div><strong>Port:</strong> ${traffic.port}</div>
                <div><strong>Protocol:</strong> ${traffic.protocol}</div>
                <div><strong>Packet Size:</strong> ${traffic.packetSize} bytes</div>
                <div><strong>Connections/min:</strong> ${traffic.connectionsPerMinute}</div>
                ${anomaly ? `<div style="color: var(--danger); margin-top: 0.5rem;"><strong>Issues:</strong> ${anomaly.reasons.join(', ')}</div>` : ''}
            </div>
        `;
    }
}

class NetGuardApp {
    constructor() {
        this.phishingClassifier = new PhishingClassifier();
        this.networkDetector = new NetworkAnomalyDetector(this);
        this.stats = {
            emailsScanned: 0,
            threatsBlocked: 0,
            networkAnomalies: 0
        };
        this.alerts = [];
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.updateStatsDisplay();
        console.log('NetGuard-AI initialized correctly and successfully');
    }

    setupEventListeners() {
        const analyzeButton = document.getElementById('analyzeEmail');
        if (analyzeButton) {
            analyzeButton.addEventListener('click', () => this.analyzeEmail());
        }

        const startButton = document.getElementById('startMonitoring');
        if (startButton) {
            startButton.addEventListener('click', () => this.startNetworkMonitoring());
        }

        const stopButton = document.getElementById('stopMonitoring');
        if (stopButton) {
            stopButton.addEventListener('click', () => this.stopNetworkMonitoring());
        }
    }

    analyzeEmail() {
        const emailInput = document.getElementById('emailInput');
        if (!emailInput) return;

        const emailContent = emailInput.value.trim();
        if (!emailContent) {
            this.showResult('emailResults', {
                type: 'error',
                message: 'Please enter email content to analyze'
            });
            return;
        }

        this.showResult('emailResults', {
            type: 'loading',
            message: 'Analyzing email content...'
        });

        setTimeout(() => {
            const result = this.phishingClassifier.classify(emailContent);
            this.stats.emailsScanned++;

            if (result.isPhishing) {
                this.stats.threatsBlocked++;
                this.addAlert({
                    type: 'email',
                    severity: 'HIGH',
                    message: `Phishing email detected with ${result.confidence}% confidence`,
                    details: result,
                    timestamp: new Date()
                });
            }

            this.updateStatsDisplay();
            this.displayEmailResult(result);
        }, 1500);
    }

    displayEmailResult(result) {
        const resultsDiv = document.getElementById('emailResults');
        if (!resultsDiv) return;

        const escapeHTML = (str) => {
            return str.replace(/[&<>"']/g, match => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match]));
        };

        const resultHTML = `
            <div class="result-card ${result.isPhishing ? 'threat' : 'safe'}">
                <div class="result-header">
                    <h3>${result.isPhishing ? '⚠️ PHISHING DETECTED' : '✅ EMAIL SAFE'}</h3>
                    <span class="confidence">Confidence: ${result.confidence}%</span>
                </div>
                <div class="result-details">
                    <div class="detail-row">
                        <strong>Risk Level:</strong>
                        <span class="risk-level ${result.riskLevel.toLowerCase()}">${result.riskLevel}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Suspicion Score:</strong> ${result.score}
                    </div>
                    ${result.foundKeywords.length > 0 ? `
                        <div class="detail-row">
                            <strong>Suspicious Keywords:</strong>
                            <div class="keywords">
                                ${result.foundKeywords.map(keyword => `<span class="keyword">${escapeHTML(keyword)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="recommendations">
                        <strong>Recommendations:</strong>
                        <ul>
                            ${this.getRecommendations(result).map(rec => `<li>${escapeHTML(rec)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = resultHTML;
    }

    getRecommendations(result) {
        if (result.isPhishing) {
            return [
                "Do not click any links in this email",
                "Do not provide personal information",
                "Report this email as phishing",
                "Delete the email immediately",
                "Verify with sender through official channels"
            ];
        } else {
            return [
                "Email appears safe to read",
                "Still verify sender if requesting sensitive info",
                "Be cautious with attachments",
                "Check URLs before clicking"
            ];
        }
    }

    startNetworkMonitoring() {
        this.networkDetector.startMonitoring();

        const startButton = document.getElementById('startMonitoring');
        const stopButton = document.getElementById('stopMonitoring');
        if (startButton) startButton.disabled = true;
        if (stopButton) stopButton.disabled = false;

        this.showResult('networkResults', {
            type: 'info',
            message: '🔍 Network monitoring started. Analyzing traffic patterns...'
        });

        this.addAlert({
            type: 'system',
            severity: 'INFO',
            message: 'Network monitoring activated',
            timestamp: new Date()
        });
    }

    stopNetworkMonitoring() {
        this.networkDetector.stopMonitoring();

        const startButton = document.getElementById('startMonitoring');
        const stopButton = document.getElementById('stopMonitoring');
        if (startButton) startButton.disabled = false;
        if (stopButton) stopButton.disabled = true;

        this.showResult('networkResults', {
            type: 'info',
            message: '🔳 Network monitoring stopped'
        });

        this.addAlert({
            type: 'system',
            severity: 'INFO',
            message: 'Network monitoring deactivated',
            timestamp: new Date()
        });
    }

    addAlert(alert) {
        this.alerts.unshift(alert);
        if (this.alerts.length > 10) {
            this.alerts = this.alerts.slice(0, 10);
        }

        if (alert.type === 'network') {
            this.stats.networkAnomalies++;
            this.updateStatsDisplay();
        }

        this.updateAlertsDisplay();
    }

    updateAlertsDisplay() {
        const alertsList = document.getElementById('alertsList');
        if (!alertsList) return;

        if (this.alerts.length === 0) {
            alertsList.innerHTML = '<p class="no-alerts">No Recent Alerts</p>';
            return;
        }

        const alertsHTML = this.alerts.map(alert => `
            <div class="alert-item ${alert.severity.toLowerCase()}">
                <div class="alert-content">
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-meta">
                        <span class="alert-type">${alert.type.toUpperCase()}</span>
                        <span class="alert-time">${this.formatTime(alert.timestamp)}</span>
                    </div>
                </div>
                <div class="alert-severity">
                    <span class="severity-badge ${alert.severity.toLowerCase()}">${alert.severity}</span>
                </div>
            </div>
        `).join('');

        alertsList.innerHTML = alertsHTML;
    }

    updateStatsDisplay() {
        const emailsScanned = document.getElementById('emailsScanned');
        const threatsBlocked = document.getElementById('threatsBlocked');
        const networkAnomalies = document.getElementById('networkAnomalies');

        if (emailsScanned) emailsScanned.textContent = this.stats.emailsScanned;
        if (threatsBlocked) threatsBlocked.textContent = this.stats.threatsBlocked;
        if (networkAnomalies) networkAnomalies.textContent = this.stats.networkAnomalies;
    }

    showResult(elementId, result) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let className = '';
        let icon = '';

        switch (result.type) {
            case 'loading':
                className = 'loading';
                icon = '⏳';
                break;
            case 'error':
                className = 'error';
                icon = '❌';
                break;
            case 'info':
                className = 'info';
                icon = 'ℹ️';
                break;
            default:
                className = 'info';
                icon = 'ℹ️';
        }

        element.innerHTML = `
            <div class="result-message ${className}">
                <span class="result-icon">${icon}</span>
                <span class="result-text">${result.message}</span>
            </div>
        `;
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString();
    }
}

function loadSample(index) {
    const email = sampleEmails[index];
    if (!email) {
        netGuardApp.showResult('emailResults', {
            type: 'error',
            message: 'Invalid sample index'
        });
        return;
    }
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.value = email.content;
        netGuardApp.showResult('emailResults', {
            type: 'info',
            message: `Sample loaded: ${email.description}`
        });
    }
}

let netGuardApp;
document.addEventListener('DOMContentLoaded', () => {
    netGuardApp = new NetGuardApp();
});