import jsonp from "jsonp";
import { AD_API_BASEURL, DEFAULT_PARAMS, NAME_SPACE } from "../config";
import { getUID, getBrowser, stringify } from "../utils/common";

export default class FetchAd {
  url: string;
  params: Record<string, any>;

  constructor(opt: AdOptions) {
    this.url = "";
    this.params = {
      showid: opt.showid,
      uid: getUID(),
      tck: opt.mediaid || "",
      queryword: encodeURI(opt.query || opt.adOptions?.query || "")
    };
    this.init(opt);
  }

  init(opt: AdOptions): void {
    if (document.referrer) {
      this.params["refurl"] = document.referrer.slice(0, 100);
    }
    Object.keys(opt.adOptions || {}).forEach(key => {
      this.params[key] = opt.adOptions[key];
    });
    const browser = getBrowser();
    const version = parseInt(browser.version.split(".")[0], 10);
    const isChrome80 = browser.browser === "Chrome" && version >= 80;
    const allParams: any = { ...DEFAULT_PARAMS, ...this.params };
    const protocol = (document.location.protocol === "https:" || isChrome80) ? "https:" : "http:";
    if (protocol === "https:") {
      allParams["scheme"] = "https";
    }
    this.url = `${protocol}${AD_API_BASEURL}?${stringify(allParams)}`;
  }

  async send(): Promise<AdResponse> {
    return new Promise<AdResponse>((resolve, reject) => {
      jsonp(
        this.url,
        {
          timeout: 5000,
          param: "jsonp",
          prefix: `${NAME_SPACE}${new Date().getTime()}`
        },
        (err: any, data: any) => {
          if (err) {
            resolve({
              ads: [],
              impurl: ""
            });
            return;
          }
          const adData: any[] = [];
          if (!data?.adspaces?.[this.params.showid]?.ads) {
            resolve({
              ads: adData,
              impurl: data.impurl
            });
          }
        }
      );
    });
  }
}

interface AdOptions {
  showid: string;
  mediaid?: string;
  query?: string;
  adOptions?: Record<string, any>;
}

interface AdResponse {
  ads: any[];
  impurl: string;
}