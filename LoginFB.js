const puppeteer = require("puppeteer");
const { username, password } = require("./credentials");

let swipeCount = 0;

(async () => {
  //set headless to false if you want to see the chrome
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--window-size=1920,1080",
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });
  // create browser context
  const context = browser.defaultBrowserContext();
  // allow location permission for tinder.com
  await context.overridePermissions("https://tinder.com", ["geolocation"]);

  // open a new tab
  const page = await browser.newPage();
  // fix the size of window
  await page._client.send("Emulation.clearDeviceMetricsOverride");

  //open tinder
  await page.goto("https://tinder.com");

  // add your cordinates of location
  await page.setGeolocation({ latitude: 28.649944, longitude: 77.0997011 });

  // wait for facebook login button to appear
  await page.waitForXPath(
    '(//*[@id="modal-manager"]/div/div/div/div/div[3]/div[2]/button)'
    // to get xpath right click on the element > copy > xpath
  );

  // select the login button
  const [FBLoginBtn] = await page.$x(
    '(//*[@id="modal-manager"]/div/div/div/div/div[3]/div[2]/button)'
  );

  // click the login button
  await FBLoginBtn.click();

  // capture the FB login popup
  const newPagePromise = new Promise(x =>
    browser.once("targetcreated", target => x(target.page()))
  );
  const popup = await newPagePromise;

  // wait for email box to open
  await popup.waitForSelector("#email");

  // click on the input
  await popup.click("#email");
  // type the username/email in textfeild
  await popup.keyboard.type(username);

  // click on the password input and type password
  await popup.click("#pass");
  await popup.keyboard.type(password);

  // wait for login btn to appear and then click on it
  await popup.waitForSelector("#loginbutton");
  await popup.click("#loginbutton");

  // popup.on("close", () => {
  //   console.log("Logged in!");
  // });
  // popup.screenshot({ path: "login.png" });

  // await page.keyboard.press("Enter");

  // wait for the swipe card to appear
  await page
    .waitForXPath(
      '(//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[1]/div[3]/div[1]/div/div)'
    )
    .then(() => console.log("Logged into Tinder"))
    .catch(err => console.log("Login failed" + err));

  // await page.waitForXPath(
  //   '(//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/button[1])'
  // );
  // await page.screenshot({ path: "loggedin.png" });

  // setInterval(() => {
  //   page
  //     .click('[aria-label="Nope"]')
  //     .then(() => {
  //       console.log(`${swipeCount} swiped`);
  //       swipeCount++;
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }, 300);

  // await browser.close();
})();