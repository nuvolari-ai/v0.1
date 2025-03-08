import "reflect-metadata";

import { Tool, WalletClientBase } from "@goat-sdk/core";
import { GetPoolsByRiskParameters } from "./parameters";
import { Pool } from "@prisma/client";
import { getPoolsByRiskScoreRange } from "@nuvolari/agents/core/_resolvers/pool-risks";
import { db } from "@nuvolari/server/db";

export class QuantService {
    constructor(
    ) {}

    @Tool({
        name: "get_pools_by_risk",
        description: "Get pools by precomputed risk level of the user",
    })
    async getPoolsByRisk(
        _walletClient: WalletClientBase,
        parameters: GetPoolsByRiskParameters
    ): Promise<Pool[]> {
        const { minRiskScore, maxRiskScore } = parameters;

        const pools = await getPoolsByRiskScoreRange(db, {
            minRiskScore,
            maxRiskScore,
            chainId: 146,
        });

        return pools;
    }
}


