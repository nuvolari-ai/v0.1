import { EnsoAPIClient } from "../tools/enso/api";
import { OctavAPI } from "../tools/octav-fi/api";
import { CoinGeckoAPI } from "../tools/coingecko/api";

/**
 * Creates a new instance of the plugin APIs
 * @returns An object containing instances of the plugin APIs
 */
export const createPluginApis = () => {
    const ensoKey = process.env.ENSO_API_KEY;
    const octavKey = process.env.OCTAV_API_KEY;
    const coingeckoKey = process.env.COINGECKO_API_KEY;

    if (!ensoKey || !octavKey || !coingeckoKey) {
        throw new Error('ENSO_API_KEY, OCTAV_API_KEY and COINGECKO_API_KEY must be set');
    }

    return {
        enso: new EnsoAPIClient(ensoKey),
        octav: new OctavAPI(octavKey),
        coingecko: new CoinGeckoAPI(coingeckoKey),
    }
}

export type PluginApis = ReturnType<typeof createPluginApis>;