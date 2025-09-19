# Netzguard


NetGuard is a **cybersecurity simulation dashboard** that analyzes emails for phishing attempts and monitors network traffic for anomalies

##  Features
- **Email Security Analysis**  
  - Detects phishing using keyword weights, suspicious URLs, urgency, grammar checks, and more.  
  - Sample phishing & legitimate emails included for quick testing.  
  - Generates risk levels (SAFE, LOW, MEDIUM, HIGH) with recommendations.  

- **Network Traffic Simulation**  
  - Simulates random traffic and flags anomalies (e.g., large packet sizes, suspicious ports, high frequency).  
  - Alerts with severity levels (INFO, MEDIUM, HIGH, CRITICAL).  

- **Dashboard Overview**  
  - Live stats: Emails Scanned, Threats Blocked, Network Anomalies.  
  - Recent Alerts panel with severity badges.  
  - Responsive design with a professional look.  

## Tech Stack
- **Frontend:** HTML, CSS (grid, flexbox, animations)  
- **Logic:** Vanilla JavaScript (ES6 Classes)  
- **Design:** Dark theme with CSS variables for easy customization  

##  Challenges Faced
Building NetGuard-AI wasn’t without hurdles:
- **Phishing Classification** – Designing logic that can actually differentiate between real emails and phishing attempts. At first, legitimate newsletters with “unsubscribe” links were wrongly flagged. Balancing suspicious vs. legitimate keywords was tricky.  
- **Network Traffic Simulation** – Making random traffic feel *realistic* while still being testable.  
- **Styling Bugs** – Some CSS variable typos (`--dsanger`, `var(-danger)`) caused parts of the UI to break until debugged.  
- **False Positives** – Emails that were safe sometimes got flagged as phishing, especially when they had urgency words. Handling this taught me about precision vs. recall trade-offs in security systems.  

##  Future Improvements
- Add **machine learning model integration** for smarter email classification.  
- Persist alerts & stats using localStorage or a small backend.  
- Improve grammar/spam detection with NLP techniques.  
- Export reports of detected threats.  

Here is a link to take a look and test:   https://oneaarmdeveloper.github.io/Netzguard/

##  How to Run
1. Clone the repo:  
   ```bash
   git clone https://github.com/oneaarmdeveloper/Netzguard.git
   cd Netzguard
2. Open index.html in your browser.

3. Test with the sample emails or enter your own content.
