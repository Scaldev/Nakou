const { users } = require("./log.js");
const { setup } = require("./page.js");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateBlitzNumber(page, userId) {

    await page.reload();
    await sleep(2000);
    await page.$eval(`span[data-profile=${users[userId].username}]`, el => el.click());
    await sleep(2000);
    let blitzNumber = await page.evaluate(() => { return parseInt(document.querySelector(".infos-parties").childNodes[2].textContent.split(" ")[0]); });
    users[userId].blitz = blitzNumber;

}

async function updateScreenshot(userId, page1, page2, interaction) {

    if (users[userId].endLoop) return;

    await page1.screenshot({ path: './src/utility/page1.jpg' });
    await page2.screenshot({ path: './src/utility/page2.jpg' });
    await interaction.editReply({ files: [] });
    await interaction.editReply({ files: [{ attachment: "./src/utility/page1.jpg"}, { attachment: './src/utility/page2.jpg'}] });

    await sleep(5000);
    await updateScreenshot(userId, page1, page2, interaction);
}

async function checkBlitzGames(interaction, browser, page1, page2, userId) {

    if (users[userId].endLoop) return;

    await updateScreenshot(userId, page1, page2, interaction);

    let previousBlitzNumber = users[userId].blitz;
    await updateBlitzNumber(page1, userId);
    let currentBlitzNumber = users[userId].blitz;

    if (currentBlitzNumber == previousBlitzNumber) {
        console.log("> Still in game, will try later.");
        await sleep(6000);

    } else if ((currentBlitzNumber > previousBlitzNumber) || previousBlitzNumber == null) {
        await page2.close();
        page2 = await browser.newPage();
        setup(page2);
        await page2.goto('https://www.loups-garous-en-ligne.com/room');
        await sleep(3000);
        await page2.$eval(`.join-blitz`, el => el.click());
        await sleep(3000);
        console.log("NEW GAME! ############################################");
    }

    await page2.screenshot({ path: 'ingame.jpg' });
    await sleep(20000);
    await checkBlitzGames(interaction, browser, page1, page2, userId); // try again
}

async function startLoop(interaction) {

    let browser = users[interaction.user.id].browser;
    users[interaction.user.id].blitz = null;

    console.log(browser);

    let page1 = await browser.newPage();
    let page2 = await browser.newPage();

    await setup(page1);
    await page1.goto('https://www.loups-garous-en-ligne.com/room');

    console.log("Let's start the loop!");
    await interaction.editReply({ content: "C'est parti, je commence à jouer à ta placer!" });

    checkBlitzGames(interaction, browser, page1, page2, interaction.user.id);

}

module.exports = { startLoop };