interface RouteEntry {
  path: string;
  searchParams: URLSearchParams;
}

interface DomainEntry {
  domain: string;
  protocol: string;
  routes: Map<string, RouteEntry>; // Use a Map for route entries
}

export class Navigation {
  private static _instance: Navigation;
  private readonly registry: Map<string, DomainEntry> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static instance(): Navigation {
    if (!Navigation._instance) {
      Navigation._instance = new Navigation();
    }

    return Navigation._instance;
  }

  public entries() {
    const list: { searchParams: URLSearchParams; url: URL }[] = [];

    this.registry.forEach(({ domain, protocol, routes }) => {
      const site = `${protocol}//${domain}`;

      routes.forEach(({ path, searchParams }) => {
        const url = new URL(site + path);
        list.push({ searchParams, url });
      });
    });

    return list;
  }

  public forEach(
    cb: (value: DomainEntry, key: string, map: Map<string, DomainEntry>) => void
  ) {
    this.registry.forEach(cb);
  }

  public get(url: URL): DomainEntry | undefined {
    return this.registry.get(url.hostname);
  }

  public has(url: URL): boolean {
    const domain = url.hostname;
    const path = url.pathname;

    return this.registry.get(domain)?.routes.has(path) ?? false;
  }

  public routes(url: URL) {
    return this.get(url)?.routes;
  }

  public set(url: URL): DomainEntry {
    const domain = url.hostname;
    const path = url.pathname;

    let domainEntry = this.registry.get(domain);
    if (!domainEntry) {
      domainEntry = { domain, protocol: url.protocol, routes: new Map() };
      this.registry.set(domain, domainEntry);
    }

    let route_entry = domainEntry.routes.get(path);
    if (!route_entry) {
      route_entry = { path, searchParams: url.searchParams };
      domainEntry.routes.set(path, route_entry);
    } else {
      url.searchParams.forEach((value, key) => {
        route_entry?.searchParams.set(key, value);
      });
    }

    return domainEntry;
  }
}
