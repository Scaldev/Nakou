const puppeteer = require("puppeteer");
const { setup } = require("./page.js");

let users = {}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(userId, username, password) {

    let lgelURL = 'https://www.loups-garous-en-ligne.com';

    // Set browser settings
    const browser = await puppeteer.launch({
        headless:false,
        args: ["--no-sandbox"]
    });
    let page = await browser.newPage();
    await setup(page);


    // Load
    await page.goto(lgelURL);
    sleep(1000);
    await page.screenshot({ path: 'test.jpg' });
    await page.waitForSelector('input[name=qpseudo]');

    // Input username and password
    await page.$eval('input[name=qpseudo]', (el, username) => { el.value = username }, username);
    await page.$eval('input[name=qpassword]', (el, password) => { el.value = password }, password);
 
    // Go!
    const [button] = await page.$x("//button[contains(., 'GO')]");
    await button.click();

    // Make sure it's loaded and show it to the user
    await sleep(3000);
    await page.mouse.click(10, 400);
    await sleep(1000);
    await page.screenshot({ path: 'login.jpg' });

    if (userId in users == false) users[userId] = {};
    users[userId].username = username;
    users[userId].browser = browser;

    return true;

}

module.exports = { login, users };