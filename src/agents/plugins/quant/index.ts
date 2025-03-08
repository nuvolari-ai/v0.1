import { Chain, PluginBase, WalletClientBase } from "@goat-sdk/core";
import { QuantService } from "./quant.service";

export class NuvolariQuantPlugin extends PluginBase<WalletClientBase> {
    constructor() {
        super("nuvolari-quant", [
            new QuantService()
        ]);
    }

    supportsChain(chain: Chain): boolean {
        return chain.type === "evm";
    }
}

export function nuvolariQuantPlugin(): NuvolariQuantPlugin {
    return new NuvolariQuantPlugin();
}