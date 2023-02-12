const puppeteer = require("puppeteer");

const three= async(search) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://pharmeasy.in/search/all?name=${search}`);


    const data = await page.evaluate(() => {
        // Select the elements you want to extract
        const namelist = Array.from(document.querySelectorAll(".ProductCard_medicineName__8Ydfq")).map(
          (x) => x.textContent);
        const pricelist = Array.from(document.querySelectorAll(".ProductCard_ourPrice__yDytt")).map(
          (x) => x.textContent);
        const mrp = Array.from(document.querySelectorAll(".ProductCard_striked__jkSiD")).map(
           (x) => x.textContent);
        const linklist = Array.from(document.querySelectorAll(".ProductCard_medicineUnitContainer__cBkHl")).map(x => {
           const a = x.querySelector("a");
               if (!a) return ""; // or return a default image URL
               return a.href;});

        




        
    for (let i = 0; i < namelist.length; i++) {
      namelist[i] = namelist[i].replace(/(  |\n)/gm, "");
    }

    for (let i = 0; i < pricelist.length; i++) {
      pricelist[i] = pricelist[i].replace(/(  |\n)/gm, "");
    }
    for (let i = 0; i < mrp.length; i++) {
      mrp[i] = mrp[i].replace(/(  |\n)/gm, "");
    }
       

    // LINK.......................................................
    const pharmas = [];
      let x=0;
    for (let i = 0; i < 30; i++) {
      const netmeds = { index: i, name:"", actualPrice: "" ,mrp:"",image: "" ,link:""};
      if(mrp[i]!=null){
      netmeds.name = namelist[i];
      if(pricelist[i].slice(0,1)=="M"){
          netmeds.actualPrice = pricelist[i].slice(5);
          netmeds.actualPrice= netmeds.actualPrice.replace("*","");
          x++;
          netmeds.mrp = 0;
      }else{
      netmeds.actualPrice = pricelist[i].slice(1);
      netmeds.actualPrice= netmeds.actualPrice.replace("*","");
      netmeds.mrp = mrp[i-x];
    }
    netmeds.link = linklist[i];
    }
        pharmas.push(netmeds);
      }
  
  
  
      return pharmas
    });
    // console.log(search)
    await browser.close();
    return data;
}

const getPharmeasy = (e) => {
    return three(e);}

module.exports = { getPharmeasy };
