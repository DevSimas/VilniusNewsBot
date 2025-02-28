const cron = require('node-cron');
const { getNewArticles } = require('./src/scraper');
const { sendArticlesEmail, sendErrorEmail } = require('./src/mailer');
const { logInfo, logError } = require('./src/logger');

/**
 * Runs the scraper, processes new articles, and sends emails if necessary.
 */
async function runScraper() {
    try {
        logInfo(`Starting scraper...`);
        const articles = await getNewArticles();

        if (articles.length > 0) {
            logInfo(`Found ${articles.length} new articles. Sending email...`);
            await sendArticlesEmail(articles);
            logInfo(`Articles email sent.`);
        } else {
            logInfo(`New articles doesn't exist.`);
        }
    } catch (error) {
        logError(`Scraper error: ${error.message}`);
        await sendErrorEmail(error);
    }
}

// Run immediately on startup
runScraper();

// Schedule scraper to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    logInfo(`Scheduled scraper execution.`);
    await runScraper();
});

logInfo(`VilniusNewsBot started successfully.`);