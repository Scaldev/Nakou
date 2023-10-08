
const { queryData } = require("../utility/mysql.js");
const puppeteer = require("puppeteer");

async function getStatsData(pseudoJoueur) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort()
        else request.continue()
    })

    // Logging in
    await page.goto('https://www.loups-garous-en-ligne.com');
    await page.waitForSelector('input[name=qpseudo]');
    await page.focus('input[name=qpseudo]');
    await page.keyboard.type(pseudoJoueur);
    await page.$eval('input[name=qpassword]', el => el.value = ''); // MDP RETIRE LA AUSSI PTDR
    const [button] = await page.$x("//button[contains(., 'GO')]");
    await button.click();

    const hameaux = await queryData(`SELECT tag FROM Hameaux;`);

    for (let i in hameaux) {

        let tag = hameaux[i].tag;

        await page.goto(`https://www.loups-garous-en-ligne.com/hameau?tag=${tag}#hameau`);
        await page.waitForSelector('.hameau_membres');

        // Scraping
        let result = await page.evaluate(() => { return document.querySelector(".hameau_membres").textContent; });
        result = result.split("\n\n\n").filter(content => content.includes('['));
        let data = {};

        for (let m in result) {
            let playerData = result[m].split("\n\n");
            if (playerData[0][0] !== "[") playerData.shift();
            let pseudo = playerData[0].split(" ")[1];
            let points = parseInt(playerData[1].split(" ").slice(0, -1).join(""));
            data[pseudo] = points;
        };

        let texte = [];
        for (let membre in data) texte.push(`("${membre}", "${tag}")`);
        const rows = await queryData(`INSERT INTO Joueurs VALUES ${texte.join(", ")};`, []);
        console.log("NEW DATA FOUND:")
        console.table(rows);

    }

    await browser.close();

};

module.exports = { getStatsData };