import axios from 'axios';

interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

export class PriceService {
  private coingeckoAPI = 'https://api.coingecko.com/api/v3';

  async getTokenPrice(contractAddress: string): Promise<TokenPrice | null> {
    try {
      // Get token info from CoinGecko
      const response = await axios.get(
        `${this.coingeckoAPI}/coins/ethereum/contract/${contractAddress.toLowerCase()}`
      );

      const data = response.data;

      return {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        price: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_percentage_24h,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd
      };
    } catch (error: any) {
      console.error('Price Service Error:', error.message);
      return null;
    }
  }

  async getMultipleTokenPrices(symbols: string[]): Promise<any> {
    try {
      const ids = symbols.join(',');
      const response = await axios.get(
        `${this.coingeckoAPI}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      );
      return response.data;
    } catch (error: any) {
      console.error('Multi-price fetch error:', error.message);
      return {};
    }
  }

  async getEthPrice(): Promise<number> {
    try {
      const response = await axios.get(
        `${this.coingeckoAPI}/simple/price?ids=ethereum&vs_currencies=usd`
      );
      return response.data.ethereum.usd;
    } catch (error) {
      return 2500; // Fallback price
    }
  }
}

export const priceService = new PriceService();