const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const chromium = require("chrome-aws-lambda");
// const font=require("./")

module.exports.html_to_pdf = async ({ renderedHtml,dataBinding, options }) => {
  const template = handlebars.compile(renderedHtml);
  const finalHtml = encodeURIComponent(template(dataBinding));
  await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
  const browser = await chromium.puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
    // executablePath: '/usr/bin/chromium-browser',
    // args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote', '--force-color-profile=srgb', '--font-render-hinting=none' ]
  });
  const page = await browser.newPage();
  await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf(options);
  await browser.close();
};
