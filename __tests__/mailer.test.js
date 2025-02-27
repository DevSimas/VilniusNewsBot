const { sendArticlesEmail, sendErrorEmail } = require('../src/mailer');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe(`Mailer Module`, () => {
    let sendMailMock;

    beforeAll(() => {
        sendMailMock = jest.fn().mockResolvedValue({ messageId: `123` });

        nodemailer.createTransport.mockReturnValue({
            sendMail: sendMailMock,
        });
    });

    beforeEach(() => {
        sendMailMock.mockClear();
    });

    test(`Should send an email with articles`, async () => {
        const articles = [
            { pid: `123`, title: `Test Article`, link: `https://example.com` },
        ];

        await sendArticlesEmail(articles);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: expect.stringContaining(`new articles`),
            })
        );
    });

    test(`Should send an error email`, async () => {
        const error = new Error(`Test error`);

        await sendErrorEmail(error);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: `🚨 VilniusNewsBot Error Report`,
            })
        );
    });
});