const puppeteer = require("puppeteer");

const four= async(search) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.netmeds.com/catalogsearch/result/${search}/all`);


    const data = await page.evaluate(() => {
        // Select the elements you want to extract
        const namelist =  Array.from(document.querySelectorAll(".clsgetname")).map(
            (x) => x.textContent);
        const pricelist = Array.from(document.querySelectorAll("#final_price")).map(
            (x) => x.textContent);
        const mrp =  Array.from(document.querySelectorAll("#price")).map(
            (x) => x.textContent);
        const imagelist =  Array.from(document.querySelectorAll(".cat-img")).map(
            (x) => x.querySelector("img").src);
        const linklist =  Array.from(document.querySelectorAll(".cat-item ")).map(x => {
            const a = x.querySelector("a");
            if (!a) return ""; // or return a default image URL
            return a.href;
        });





    for (let i = 0; i < namelist.length; i++) {
      namelist[i] = namelist[i].replace(/(  |\n)/gm, "");
    }
    
    for (let i = 0; i < pricelist.length; i++) {
      pricelist[i] = pricelist[i].replace(/(  |\n)/gm, "");
    }
    for (let i = 0; i < pricelist.length; i++) {
      mrp[i] = mrp[i].replace(/(  |\n)/gm, "");
    }

      

// LINK.......................................................


const pharmas = [];
    for (let i = 0; i < 30; i++) {
      const netmeds = { index: i, name:"", actualPrice: "" ,mrp:"",image: "" ,link:"" };
      if(mrp[i]!=null){
      netmeds.name = namelist[i];
      netmeds.actualPrice = pricelist[i].slice(1);
      netmeds.mrp = mrp[i].slice(mrp[i].indexOf("MRP Rs.")+7);
      netmeds.image = imagelist[i];
      netmeds.link = linklist[i];
      }
    //   console.log(netmeds);
      pharmas.push(netmeds);
    }

  
  
    return pharmas
});
// console.log(search)
await browser.close();
return data;
}

const getNetmeds = (e) => {
return four(e);}

module.exports = { getNetmeds};