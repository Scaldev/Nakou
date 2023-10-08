async function setup(page) {

    page.setDefaultNavigationTimeout(0);
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort()
        else request.continue()
    })

}

module.exports = { setup };