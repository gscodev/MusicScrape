/*05-02-2022  -  07-2-2022   Geon Suresh
Scraping songs titles,date of release and artist names.This is part of the Spotify Music project.
Had to improvise due to blocking of Cloudflare...when using Scrapy. Cloudflare Update System....An amateur got through :))
*/
var fs = require('fs')
//Had to use puppeteer stealth to get through their constant blocking
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin())

puppeteer.launch({headless: false}).then(async browser =>{
	console.log('Scraping Started...');

    const page = await browser.newPage();
    await page.goto("https://www.albumoftheyear.org/releases/singles/", {waitUntil: 'networkidle0'});

    const DailyMusic = await page.evaluate(() => {

        const musicStorage = [];

        //Using for loop to get all the values on the page.
        for (let i = 0; i <=59; i++){
        let musicUntouched = document.querySelectorAll(".albumBlock")[i].innerText;
        const musicManipulate = musicUntouched.split("\n")

        //Data split, extracted and put into their corresponding titles.
        let date = musicManipulate[0];
        let artist = musicManipulate[1];
        let title = musicManipulate[2];

        //Pushed back into the Array to store
         musicStorage.push({
            date: date,
            artist: artist,
            title: title,
        })
    }
    return musicStorage;

  });
  //Small wait so it can load and get data before closing
  await page.waitForTimeout(1000);
  console.log(DailyMusic);
  await browser.close();

  //Put the data into a json file to use 
  const json = JSON.stringify(DailyMusic);
  console.log(json);
  fs.writeFile('./MusicToday.json', JSON.stringify(DailyMusic), err => {
  if(err){
      console.log(err);
  }else{
      console.log('File successfully')
  }
  });
});
