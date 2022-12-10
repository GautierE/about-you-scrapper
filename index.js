import got from "got";
import tough from "tough-cookie";

const pidList = [8600400, 7132808, 7778434, 6985548];

const regions = [
  { code: "fr", shopId: 658 },
  { code: "de", shopId: 139 },
  { code: "nl", shopId: 545 },
  { code: "it", shopId: 671 },
  { code: "es", shopId: 670 },
  { code: "cz", shopId: 554 },
  { code: "sk", shopId: 586 },
  { code: "pt", shopId: 685 },
  { code: "pl", shopId: 550 },
];

const cookiejar = new tough.CookieJar();
const client = got.extend({ cookieJar: cookiejar });

for (let i = 0; i < regions.length; i++) {
  await getSessionRegion(regions[i]);
}

async function getSessionRegion(region) {
  try {
    console.log(`------ ${region.code.toUpperCase()} ------`);
    console.log("Getting session..");
    await client.get(`https://aboutyou.${region.code}`);

    let session = "";
    cookiejar.store.findCookie(
      `aboutyou.${region.code}`,
      "/",
      "ay-ab-test-user-id",
      (err, cookie) => (err ? console.log(err) : (session = cookie.value))
    );

    await getAllForRegion(region, session);
  } catch (e) {
    console.log("Error getting product");
    console.log(e.message);
  }
}

async function getAllForRegion(region, session) {
  for (let j = 0; j < pidList.length; j++) {
    await getProductForRegion(region.shopId, pidList[j], session);
    await sleep(1500);
  }
  console.log(`----------------------------------------`);
  await sleep(3000);
}

async function getProductForRegion(shopId, productId, session) {
  try {
    console.log("Trying get product..");

    const res = await client.post(
      "https://api.aboutyou.com/user/me/wishlist/bapi?with=items.product.attributes:key(brand%7CbrandLogo%7CcaptchaRequired%7Cname%7CquantityPerPack%7CplusSize%7CcolorDetail%7CsponsorBadge%7CsponsoredType%7Cpremium%7CmaternityNursing%7Cexclusive%7Cgenderage%7CspecialSizesProduct%7CmaterialStyle%7CsustainabilityIcons%7CassortmentType),items.product.advancedAttributes:key(materialCompositionTextile%7Csiblings),items.product.variants,items.product.variants.attributes:key(shopSize%7CcategoryShopFilterSizes%7Ccup%7Ccupsize%7CvendorSize%7Clength%7Cdimension3%7CsizeType%7Csort),items.product.images.attributes:legacy(false):key(imageNextDetailLevel%7CimageBackground%7CimageFocus%7CimageGender%7CimageType%7CimageView),items.product.priceRange,items.product.lowestPriorPrice",
      {
        throwHttpErrors: false,
        cookieJar: cookiejar,
        headers: {
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-auth-token": session,
          "sec-ch-ua-mobile": "?0",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          "sec-ch-ua-platform": "Windows",
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          dnt: 1,
        },
        searchParams: {
          with: "items.product.attributes:key(brand%7CbrandLogo%7CcaptchaRequired%7Cname%7CquantityPerPack%7CplusSize%7CcolorDetail%7CsponsorBadge%7CsponsoredType%7Cpremium%7CmaternityNursing%7Cexclusive%7Cgenderage%7CspecialSizesProduct%7CmaterialStyle%7CsustainabilityIcons%7CassortmentType),items.product.advancedAttributes:key(materialCompositionTextile%7Csiblings),items.product.variants,items.product.variants.attributes:key(shopSize%7CcategoryShopFilterSizes%7Ccup%7Ccupsize%7CvendorSize%7Clength%7Cdimension3%7CsizeType%7Csort),items.product.images.attributes:legacy(false):key(imageNextDetailLevel%7CimageBackground%7CimageFocus%7CimageGender%7CimageType%7CimageView),items.product.priceRange,items.product.lowestPriorPrice",
          shopId: shopId,
          sId: session,
        },
        body: `{"productId":${productId},"customData":{},"shopId":${shopId}}`,
      }
    );

    res.body.includes("No variant for product id")
      ? console.log(`Product ${productId} not loaded`)
      : console.log(`Product ${productId} loaded`);
  } catch (e) {
    console.log("Error getting product");
    console.log(e.message);
  }
}

function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
