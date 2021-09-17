const puppeteer = require('puppeteer');
const json2csv = require("json2csv").Parser;
const fs = require("fs");

async function click(button){
    await button.evaluate(button => button.click());
}
async function myForEach(arr, myCallBack, myString) {

  for (let i = 0; i < arr.length; i++) {

      await myCallBack(arr[i], index = i, arr, myString, () => {
         

      })

  }
}

async function rechaptcha(page){
  try{
    await page.click("body > main > div");
    console.log("clicked1")
    
    for(let i=1;i<=10;i++){
    try{
    await page.click('#px-captcha > iframe:nth-child(1)',{button:puppeteer.MouseButton,clickCount:3});
    }catch{
      
    }

    await page.keyboard.press('Enter',{delay:2000})

    }


    console.log("clicked2");
  }catch{
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  
async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 50;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
            }, 5);
      });
  });
}
  (async ()=>{

    url = "https://www.zillow.com/middleton-id/sold/land_type/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22usersSearchTerm%22%3A%22Middleton%2C%20ID%22%2C%22mapBounds%22%3A%7B%22west%22%3A-116.83622241723633%2C%22east%22%3A-116.21480823266602%2C%22south%22%3A43.57217250347738%2C%22north%22%3A43.860514276321375%7D%2C%22mapZoom%22%3A12%2C%22regionSelection%22%3A[%7B%22regionId%22%3A50539%2C%22regionType%22%3A6%7D]%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sf%22%3A%7B%22value%22%3Afalse%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%2C%22rs%22%3A%7B%22value%22%3Atrue%7D%2C%22fsba%22%3A%7B%22value%22%3Afalse%7D%2C%22fsbo%22%3A%7B%22value%22%3Afalse%7D%2C%22nc%22%3A%7B%22value%22%3Afalse%7D%2C%22cmsn%22%3A%7B%22value%22%3Afalse%7D%2C%22auc%22%3A%7B%22value%22%3Afalse%7D%2C%22fore%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D&fbclid=IwAR2h5eOPT4D2T9qCmcMhVQAaeLFY7gABPtfxDrGkdtumdYvWeW5XoLKVwus";

    const browser = await puppeteer.launch({
        headless : false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setCookie.apply(page)
    await page.goto(url,{waitUntil:'networkidle2'});

    while(1){
      
      while(1){
      try{
        await page.waitForXPath("//div[@class='list-card-top']/a")
        break;

      }catch{
        await rechaptcha(page);
      }
      }

      await autoScroll(page);
      await sleep(2000);

      const cookies = await page.cookies();

      const hrefs = await Promise.all((await page.$x("//div[@class='list-card-top']/a")).map(async item => await (await item.getProperty('href')).jsonValue()));

      console.log(hrefs.length);
      console.log(hrefs);
      
      await myForEach(hrefs, async (element, index, arr)=>{

      
      await sleep(1000);
      const page2 = await browser.newPage();
      await page2.setDefaultNavigationTimeout(0);
      await page2.setCookie.apply(page2,cookies)
      await page2.goto(element);
      await sleep(1000);
      
      while(1){
      try{
        await page2.waitForSelector('span[class="ds-bed-bath-living-area-container"]>span>span');
        break;
        
      }catch(err){
        await rechaptcha(page2);
      }
    }

      let landArea_elem  = await page2.$('span[class="ds-bed-bath-living-area-container"]>span>span');
      let Land_Area = await page2.evaluate(el => el.textContent, landArea_elem);
      
      console.log(Land_Area);

      let Address_elem  = await page2.$('h1[id ="ds-chip-property-address"]');
      let address = await page2.evaluate(el => el.textContent, Address_elem);

      await console.log(address);
      await page2.close();

      await sleep(1000)
    },hrefs)

    try{
      await page.waitForSelector('a[title="Next page"]');
      await page.click('a[title="Next page"]');
      await sleep(1000);  

    }catch{
      break;
    }
  }

  })();