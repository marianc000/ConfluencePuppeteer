import puppeteer from 'puppeteer';
import cookie from './cookie.js';
import { tables } from './db/data.js';

const browser = await puppeteer.launch({
  //    headless: false,
  defaultViewport: {
    width: 1280,
    height: 619
  }
});

let page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.text()));

await page.setCookie(cookie);

const PARENT_PAGE = 'https://medium0.atlassian.net/wiki/spaces/DEL/pages/5242881/HR2';
const CREATE_BTN = '#createGlobalItem';
const PUBLISH_BTN = '#publish-button.css-12eh8h8';
const CONTENT_DIV = '[contenteditable]';
const TITLE_TEXTAREA = 'textarea';

async function createPage({ title, html }, repeat = 0) {
  console.log(">createPage", title, repeat);
  try {
    await page.goto(PARENT_PAGE);
    await page.waitForSelector(CREATE_BTN);
    await page.click(CREATE_BTN);

    await page.waitForFunction(selector =>
      document.querySelector(selector) === document.activeElement,
      {}, TITLE_TEXTAREA
    );

    await page.keyboard.type(title);
    await page.keyboard.press('Enter');
    await page.keyboard.type('activate');

    await page.evaluate((html, selector) =>
      document.querySelector(selector).innerHTML = html, html, CONTENT_DIV);

    await page.waitForSelector(PUBLISH_BTN, { visible: true });
    await page.click(PUBLISH_BTN);
    await page.waitForNavigation();
  } catch (e) {
    await page.screenshot({
      path: 'error' + Date.now() + '.png'
    })
    console.log("ERROR", e);
    return createPage({ title, html }, ++repeat);
  }
}

for (let c = 0; c < tables.length; c++) {
  await createPage(tables[c]);
}

await browser.close();