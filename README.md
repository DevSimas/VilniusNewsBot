# 🚀 VilniusNewsBot

## 📌 About
VilniusNewsBot is a Node.js-based web scraper that monitors new articles on [Made In Vilnius](https://madeinvilnius.lt/verslas/statybos-vilniuje/) and automatically sends email notifications about the latest publications.

The system runs every 30 minutes via `node-cron`, logs all activity, and sends error reports if any issues occur.

---

## ✅ Features
- ✅ Web scraping with `axios` & `cheerio`
- ✅ Stores last processed article ID to prevent duplicate emails
- ✅ Sends emails via SMTP using `nodemailer`
- ✅ Logs all actions using `winston`
- ✅ Automated execution with `node-cron`
- 🔜 **Docker support for containerized deployment**

---

## 📥 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/DevSimas/VilniusNewsBot.git
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a .env file based on .env.sample and provide your SMTP credentials:
```ini
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
EMAIL_TO=recipient@email.com
ADMIN_EMAIL=admin@email.com
```

### 4️⃣ Run the bot
```bash
node index.js
```
🔹 This will immediately check for new articles and send email notifications if necessary.
🔹 The process will then continue running **every 30 minutes**.

---

## 📜 Logging
All logs are stored in the `logs/` directory. Each day gets a new log file (`YYYY-MM-DD.log`).

---

## 🛠 Planned Features
- 📦 **Dockerization** – Deploy the bot in a containerized environment.

---

## 📄 License
MIT License - Feel free to use and contribute!