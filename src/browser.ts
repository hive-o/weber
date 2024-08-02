import { BrowserContext, launch, Browser as PuppeteerBrowser } from 'puppeteer';

export class Browser {
  private _context?: BrowserContext; // Singleton instance

  private static _instance: Browser;

  private browser?: PuppeteerBrowser;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static instance(): Browser {
    if (!Browser._instance) {
      Browser._instance = new Browser();
    }

    return Browser._instance;
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      this._context = undefined;
    }
  }

  public async launch(): Promise<PuppeteerBrowser> {
    if (!this.browser) {
      this.browser = await launch();
      this._context = await this.browser.createBrowserContext();
    }

    return this.browser;
  }

  public get context(): BrowserContext {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._context!;
  }
}
