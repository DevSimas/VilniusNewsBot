const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const URL = 'https://madeinvilnius.lt/verslas/statybos-vilniuje/';
const PIDS_FILE = path.join(__dirname, '../data/pids.json');

/**
 * Fetches the latest articles from the website.
 * @returns {Promise<Array<{pid: string, title: string, link: string}>>} List of articles with PID, title, and link.
 */
async function fetchArticles() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        let articles = [];

        $(".p-wrap.p-grid.p-grid-1").each((_, el) => {
            const pid = $(el).attr("data-pid")?.trim();
            const title = $(el).find(".entry-title a").text().trim();
            const link = $(el).find(".entry-title a").attr("href")?.trim();
        
            if (pid && title && link) {
                articles.push({ pid, title, link });
            }
        });

        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        return [];
    }
}

/**
 * Reads the last saved PID from pids.json.
 * @returns {Promise<string|null>} The last saved PID or null if not found
 */
async function getLastSavedPID() {
    if (await fs.pathExists(PIDS_FILE)) {
        const savedData = await fs.readJson(PIDS_FILE);
        return savedData.lastPID || null;
    }
    return null;
}

/**
 * Saves the latest PID to pids.json.
 * @param {string} lastPID - The latest PID to be saved.
 * @returns {Promise<void>}
 */
async function saveLastPID(lastPID) {
    await fs.writeJson(PIDS_FILE, { lastPID });
}

/**
 * Compares fetched articles with the last saved PID and returns only new articles.
 * @returns {Promise<Array<{pid: string, title: string, link: string}>>} New articles found since last check.
 */
async function getNewArticles() {
    const articles = await fetchArticles();
    if (articles.length === 0) return [];

    const lastSavedPID = await getLastSavedPID();

    let newArticles = [];
    if (lastSavedPID) {
        for (const article of articles) {
            if (article.pid === lastSavedPID) break;
            newArticles.push(article);
        }
    } else {
        // First run: return all articles
        newArticles = articles;
    }

    // Save the latest PID
    if (articles.length > 0) {
        await saveLastPID(articles[0].pid);
    }

    return newArticles;
}

module.exports = { getNewArticles };