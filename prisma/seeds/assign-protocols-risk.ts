import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
 stability
 stable-jack
 steer
 rings-wstkscusd
 rings-sc
 silo-v2-protected
 silo-v2
 rings
 origin-vaults
 rings-sc-staked-wrapped
 origin-wos
 pendle-markets
 rings-sc-staked
 beefy
 beets-sts
 pendle-sy
 euler-v2
 origin-os
 rings-scusd
 rings-stkscusd
 aave-v3
*/
const riskScores = [
    {
      ensoId: 'beefy',
      risk: {
        codeSecurityScore: 1.7,
        protocolMaturityScore: 2.1,
        economicDesignScore: 2.3,
        operationalRiskScore: 1.9,
        liquidityProfileScore: 2.5,
        finalPRF: 2.07,
        grade: 'B'
      }
    },
    {
      ensoId: 'beets-sts',
      risk: {
        codeSecurityScore: 1.9,
        protocolMaturityScore: 1.8,
        economicDesignScore: 2.2,
        operationalRiskScore: 1.8,
        liquidityProfileScore: 2.1,
        finalPRF: 1.96,
        grade: 'B'
      }
    },
    {
      ensoId: 'rings',
      risk: {
        codeSecurityScore: 2.5,
        protocolMaturityScore: 3.2,
        economicDesignScore: 2.6,
        operationalRiskScore: 2.5, 
        liquidityProfileScore: 3.0,
        finalPRF: 2.72,
        grade: 'C'
      }
    },
    {
      ensoId: 'rings-wstkscusd',
      risk: {
        codeSecurityScore: 2.5,
        protocolMaturityScore: 3.2,
        economicDesignScore: 2.6,
        operationalRiskScore: 2.5, 
        liquidityProfileScore: 3.0,
        finalPRF: 2.72,
        grade: 'C'
      }
    },
    {
        ensoId: 'rings-sc',
        risk: {
          codeSecurityScore: 2.5,
          protocolMaturityScore: 3.2,
          economicDesignScore: 2.6,
          operationalRiskScore: 2.5, 
          liquidityProfileScore: 3.0,
          finalPRF: 2.72,
          grade: 'C'
        }
    },
    {
      ensoId: 'silo-v2',
      risk: {
        codeSecurityScore: 1.6,
        protocolMaturityScore: 2.3,
        economicDesignScore: 2.1,
        operationalRiskScore: 1.9,
        liquidityProfileScore: 2.4,
        finalPRF: 2.02,
        grade: 'B'
      }
    },
    {
        ensoId: 'silo-v2-protected',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'stable-jack',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
        },
      {
        ensoId: 'steer',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'pendle-markets',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'origin-vaults',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'origin-wos',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'rings-sc-staked-wrapped',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'euler-v2',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'origin-os',
        risk: {
          codeSecurityScore: 1.6,
          protocolMaturityScore: 2.3,
          economicDesignScore: 2.1,
          operationalRiskScore: 1.9,
          liquidityProfileScore: 2.4,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      // Adding the missing ensoIds from the comment
      {
        ensoId: 'stability',
        risk: {
          codeSecurityScore: 1.8,
          protocolMaturityScore: 2.2,
          economicDesignScore: 2.0,
          operationalRiskScore: 1.8,
          liquidityProfileScore: 2.3,
          finalPRF: 2.02,
          grade: 'B'
        }
      },
      {
        ensoId: 'rings-sc-staked',
        risk: {
          codeSecurityScore: 2.5,
          protocolMaturityScore: 3.2,
          economicDesignScore: 2.6,
          operationalRiskScore: 2.5,
          liquidityProfileScore: 3.0,
          finalPRF: 2.72,
          grade: 'C'
        }
      },
      {
        ensoId: 'pendle-sy',
        risk: {
          codeSecurityScore: 1.7,
          protocolMaturityScore: 2.2,
          economicDesignScore: 2.0,
          operationalRiskScore: 1.8,
          liquidityProfileScore: 2.3,
          finalPRF: 2.00,
          grade: 'B'
        }
      },
      {
        ensoId: 'rings-scusd',
        risk: {
          codeSecurityScore: 2.5,
          protocolMaturityScore: 3.2,
          economicDesignScore: 2.6,
          operationalRiskScore: 2.5,
          liquidityProfileScore: 3.0,
          finalPRF: 2.72,
          grade: 'C'
        }
      },
      {
        ensoId: 'rings-stkscusd',
        risk: {
          codeSecurityScore: 2.5,
          protocolMaturityScore: 3.2,
          economicDesignScore: 2.6,
          operationalRiskScore: 2.5,
          liquidityProfileScore: 3.0,
          finalPRF: 2.72,
          grade: 'C'
        }
      },
      {
        ensoId: 'aave-v3',
        risk: {
          codeSecurityScore: 1.4,
          protocolMaturityScore: 1.6,
          economicDesignScore: 1.8,
          operationalRiskScore: 1.5,
          liquidityProfileScore: 1.7,
          finalPRF: 1.60,
          grade: 'A'
        }
      },
      {
        ensoId: 'wrapped-native',
        risk: {
          codeSecurityScore: 1.4,
          protocolMaturityScore: 1.6,
          economicDesignScore: 1.8,
          operationalRiskScore: 1.5,
          liquidityProfileScore: 1.7,
          finalPRF: 1.60,
          grade: 'A'
        }
      }
  ];

async function main() {
    console.log('Assigning protocols risk...');
    const protocols = await prisma.protocol.findMany();

    await prisma.protocolRisk.deleteMany();
    
    for (const protocol of protocols) {
      const risk = riskScores.find((risk) => risk.ensoId === protocol.ensoId);
      if (risk) {
        await prisma.protocolRisk.create({
          data: {
            protocolId: protocol.id,
            codeSecurityScore: risk.risk.codeSecurityScore,
            protocolMaturityScore: risk.risk.protocolMaturityScore,
            economicDesignScore: risk.risk.economicDesignScore,
            operationalRiskScore: risk.risk.operationalRiskScore,
            liquidityProfileScore: risk.risk.liquidityProfileScore,
            finalPRF: risk.risk.finalPRF,
            grade: risk.risk.grade
          }
        });
      }
    }
    console.log('Protocols risk assigned successfully');
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });