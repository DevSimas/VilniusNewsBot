const { logInfo, logWarning, logError } = require('../src/logger');
const fs = require('fs-extra');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const TEST_LOG_FILE = path.join(LOG_DIR, `${new Date().toISOString().split("T")[0]}.log`);

describe(`Logger Module`, () => {
    beforeAll(async () => {
        await fs.ensureDir(LOG_DIR);
        await fs.ensureFile(TEST_LOG_FILE);
    });

    afterAll(async () => {
        await fs.remove(TEST_LOG_FILE);
    });

    test(`Should write an info log`, async () => {
        logInfo(`Test info log`);
        await new Promise((r) => setTimeout(r, 300));
        await fs.ensureFile(TEST_LOG_FILE);
        const logs = await fs.readFile(TEST_LOG_FILE, `utf8`);
        expect(logs).toContain(`INFO`);
        expect(logs).toContain(`Test info log`);
    });

    test(`Should write a warning log`, async () => {
        logWarning(`Test warning log`);
        await new Promise((r) => setTimeout(r, 300));
        await fs.ensureFile(TEST_LOG_FILE);
        const logs = await fs.readFile(TEST_LOG_FILE, `utf8`);
        expect(logs).toContain(`WARN`);
        expect(logs).toContain(`Test warning log`);
    });

    test(`Should write an error log`, async () => {
        logError(`Test error log`);
        await new Promise((r) => setTimeout(r, 300));
        await fs.ensureFile(TEST_LOG_FILE);
        const logs = await fs.readFile(TEST_LOG_FILE, `utf8`);
        expect(logs).toContain(`ERROR`);
        expect(logs).toContain(`Test error log`);
    });
});