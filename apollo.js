// const puppeteer = require("puppeteer");
const { executablePath } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const hidden = require('puppeteer-extra-plugin-stealth');

const one= async(search) => {
  puppeteer.use(hidden());
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox", 
    ],
    ignoreHTTPSErrors: true,
  });
    const page = await browser.newPage();
    await page.goto(`https://www.apollopharmacy.in/search-medicines/${search}`, { waitUntil: 'load' });
    
    
    const data = await page.evaluate(() => {
      // Select the elements you want to extract
      const firstname = Array.from(document.querySelectorAll(".ProductCard_productName__f82e9")).map(
        (x) => x.textContent);
      const mrp = Array.from(document.querySelectorAll(".ProductCard_priceGroup__V3kKR")).map(
          (x) => x.textContent);
      const pricelist =  Array.from(document.querySelectorAll(".style__price-tag___KzOkY")).map(
            (x) => x.textContent);
       // IMAGE.......................................................
  const imagelist = Array.from(document.querySelectorAll(".ProductCard_bigAvatar__KUsDb")).map(x => {
    const img = x.querySelector("img");
    if (!img) return ""; // or return a default image URL
    return img.src;
  });

  // LINK.......................................................
  const linklist = Array.from(document.querySelectorAll(".ProductCard_pdHeader__ETKkp")).map(x => {
    const a = x.querySelector("a");
    if (!a) return ""; // or return a default image URL
    return a.href;
  });

      // NAME.......................................................
      let fname= new Array(firstname.length);
      for (let i = 0; i < firstname.length; i++) {
        fname[i]="";
      }
      for (let i = 0; i < firstname.length; i++) {
        firstname[i] = firstname[i].replace(/(  |\n)/gm, "");
        fname[i]= firstname[i];
      }
      
  // PRICE.......................................................
      for (let i = 0; i < mrp.length; i++) {
        mrp[i] = mrp[i].replace(/(  |\n)/gm, "");
        console.log(mrp[i]);
      }
      for (let i = 0; i < pricelist.length; i++) {
        pricelist[i] = pricelist[i].replace(/(  |\n)/gm, "");
        // console.log(pricelist[i]);
      }


      // "	https://newassets.apollo247.com/pub/media/catalog/product/cache/resized/100x/o/n/onw0007-1-nov22.jpg"
      // "	https://newassets.apollo247.com/pub/media/catalog/product/o/n/onw0007-1-nov22.jpg"

      // LINK.......................................................
      let modifiedList= new Array(imagelist.length);
for(let i=0;i<imagelist.length;i++){
  if(imagelist[i].indexOf("cache/resized/100x")!=-1){
    modifiedList[i]="https://newassets.apollo247.com/pub/media/catalog/product"+imagelist[i].slice(imagelist[i].indexOf("cache/resized/100x")+18);
    console.log(modifiedList[i]);
  }else{
    modifiedList[i]=imagelist[i];
    console.log(modifiedList[i]);
  }
}


      const pharmas = [];
      for (let i = 0; i < 30; i++) {
         // if (imagelist[i] === "") continue; // skip empty image URL
         const netmeds = { index: i,name:"",actualPrice:"",mrp:"",image: "" ,link:"" };
         if(mrp[i]!=null){
         netmeds.name = fname[i];
         netmeds.actualPrice = pricelist[i];
         if(mrp[i].slice(4,5)==="???"){
           netmeds.mrp = mrp[i].slice(5,mrp[i].indexOf(")"));
           netmeds.actualPrice = mrp[i].slice(mrp[i].indexOf(")???")+2);
         }else{
         netmeds.mrp = mrp[i].slice(4);
         netmeds.actualPrice = mrp[i].slice(4);
         }
         netmeds.image = modifiedList[i];
         netmeds.link = linklist[i];
       }
        pharmas.push(netmeds);
      }
      
      return pharmas
    });
    // console.log(search)
    await page.close();
    await browser.close();
    return data;
}

const getApollo = (e) => {
    return one(e);}

module.exports = { getApollo};