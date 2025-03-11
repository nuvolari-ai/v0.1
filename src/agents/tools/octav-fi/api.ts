import { type OctavPortfolio, type OctavTransaction } from "./types";

/**
 * Octav API Client
 * docs: https://api-docs.octav.fi/
 */
export class OctavAPI {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl = "https://api.octav.fi") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Helper method to make API requests
   */
  private async request<T>(
    url: string,
    baseUrl: string = this.baseUrl
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get a single portfolio by address
   */
  async getPortfolio(address: string): Promise<OctavPortfolio> {
    const url = `/v1/portfolio?addresses=${address}`;
    return this.request<OctavPortfolio>(url);
  }

  /**
   * Get multiple portfolios by addresses
   */
  async getSeveralPortfolios(addresses: string[]): Promise<OctavPortfolio[]> {
    const url = `/v1/portfolio?addresses=${addresses.join(",")}`;
    return this.request<OctavPortfolio[]>(url);
  }

  /**
   * Get multiple portfolios by addresses
   */
  async getTransactions(addresses: string[]): Promise<OctavTransaction[]> {
    const url = `/v1/transactions?addresses=${addresses.join(",")}&limit=1000&offset=0`;
    return this.request<OctavTransaction[]>(url);
  }
}
