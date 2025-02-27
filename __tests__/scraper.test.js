const { getNewArticles } = require('../src/scraper');
const fs = require('fs-extra');
const path = require('path');

const PIDS_FILE = path.join(__dirname, '../data/pids.json');

describe('Scraper Module', () => {
    beforeEach(async () => {
        await fs.ensureFile(PIDS_FILE);
        await fs.writeJson(PIDS_FILE, { lastPID: null });
    });

    afterEach(async () => {
        await fs.writeJson(PIDS_FILE, { lastPID: null });
    });

    test('Should fetch new articles', async () => {
        const articles = await getNewArticles();

        expect(Array.isArray(articles)).toBe(true);
        if (articles.length > 0) {
            expect(articles[0]).toHaveProperty('pid');
            expect(articles[0]).toHaveProperty('title');
            expect(articles[0]).toHaveProperty('link');
        }
    });

    test('Should update pids.json after fetching', async () => {
        const articles = await getNewArticles();
        const savedData = await fs.readJson(PIDS_FILE);
        
        if (articles.length > 0) {
            expect(savedData.lastPID).toBe(articles[0].pid);
        } else {
            expect(savedData).toHaveProperty('lastPID');
        }
    });
});