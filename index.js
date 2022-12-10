import got from "got";
import tough from "tough-cookie";

const pidList = [
  8600400, 7132808, 6954373, 7382308, 7444383, 7132808, 8809810, 7789288,
  7778434, 6985548, 7105820, 7110820, 7196558, 8843199, 7610590, 7465636,
  7786658, 8350130, 7130191, 7373277, 7720372, 7473348, 7155829, 7780083,
  7616651, 7733118, 7117354,
];

getProduct(139, 9020202);

async function getProduct(regionCode, productId) {
  try {
    const cookiejar = new tough.CookieJar();
    const client = got.extend({ cookieJar: cookiejar });

    console.log("Getting session..");
    await client.get("https://aboutyou.de");

    let session = "";
    cookiejar.store.findCookie(
      "aboutyou.de",
      "/",
      "ay-ab-test-user-id",
      (err, cookie) => (err ? console.log(err) : (session = cookie.value))
    );

    console.log("Getting product info..");

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
          shopId: regionCode,
          sId: session,
        },
        body: `{"productId":9020202,"customData":{},"shopId":${regionCode}}`,
      }
    );

    res.body.includes("No variant for product id")
      ? console.log("Product not loaded")
      : console.log("Product loaded");
  } catch (e) {
    console.log("Error getting product");
    console.log(e.message);
  }
}
