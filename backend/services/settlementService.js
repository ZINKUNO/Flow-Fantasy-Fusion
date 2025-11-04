const fcl = require('@onflow/fcl');
const fs = require('fs');
const path = require('path');

/**
 * Settlement Service - Automated league settlement
 * 
 * Since FlowTransactionScheduler is not yet on testnet, we use a backend polling approach.
 * This service checks for leagues that need settlement and executes them automatically.
 */

// Configure FCL
fcl.config()
  .put('accessNode.api', process.env.FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org')
  .put('flow.network', 'testnet');

/**
 * Get all leagues that need settlement
 * (endTime has passed and status is not "Completed")
 */
async function getLeaguesNeedingSettlement() {
  try {
    const script = `
      import LeagueFactory from 0x${process.env.CONTRACT_ADDRESS}
      
      access(all) fun main(): [UInt64] {
        let factory = getAccount(0x${process.env.CONTRACT_ADDRESS})
          .capabilities.borrow<&LeagueFactory.Factory>(LeagueFactory.FactoryPublicPath)
          ?? panic("Could not borrow factory reference")
        
        let allLeagues = factory.getAllLeagues()
        let needsSettlement: [UInt64] = []
        let currentTime = getCurrentBlock().timestamp
        
        for leagueId in allLeagues.keys {
          let league = allLeagues[leagueId]!
          
          // Check if league has ended and is not yet settled
          if league.endTime <= currentTime && league.status != "Completed" {
            needsSettlement.append(leagueId)
          }
        }
        
        return needsSettlement
      }
    `;

    const result = await fcl.query({
      cadence: script
    });

    return result || [];
  } catch (error) {
    console.error('Error getting leagues needing settlement:', error);
    return [];
  }
}

/**
 * Execute settlement for a specific league
 */
async function settleLeague(leagueId) {
  try {
    console.log(`Settling league ${leagueId}...`);

    const transaction = fs.readFileSync(
      path.join(__dirname, '../../transactions/SettleLeague.cdc'),
      'utf8'
    );

    const txId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(leagueId.toString(), t.UInt64)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999
    });

    console.log(`Settlement transaction submitted: ${txId}`);
    
    // Wait for transaction to be sealed
    const result = await fcl.tx(txId).onceSealed();
    console.log(`League ${leagueId} settled successfully!`);
    
    return { success: true, txId, result };
  } catch (error) {
    console.error(`Error settling league ${leagueId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Main settlement check function
 * Called periodically by the scheduler
 */
async function checkAndSettleLeagues() {
  console.log('[Settlement Service] Checking for leagues to settle...');
  
  try {
    const leaguesToSettle = await getLeaguesNeedingSettlement();
    
    if (leaguesToSettle.length === 0) {
      console.log('[Settlement Service] No leagues need settlement');
      return { settled: 0, results: [] };
    }

    console.log(`[Settlement Service] Found ${leaguesToSettle.length} league(s) to settle:`, leaguesToSettle);

    const results = [];
    for (const leagueId of leaguesToSettle) {
      const result = await settleLeague(leagueId);
      results.push({ leagueId, ...result });
      
      // Wait a bit between settlements to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return { settled: results.filter(r => r.success).length, results };
  } catch (error) {
    console.error('[Settlement Service] Error in checkAndSettleLeagues:', error);
    return { settled: 0, error: error.message };
  }
}

/**
 * Start the settlement service with periodic checks
 * @param {number} intervalMinutes - How often to check (default: 5 minutes)
 */
function startSettlementService(intervalMinutes = 5) {
  console.log(`[Settlement Service] Starting with ${intervalMinutes} minute interval`);
  
  // Run immediately on start
  checkAndSettleLeagues();
  
  // Then run periodically
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(checkAndSettleLeagues, intervalMs);
  
  console.log('[Settlement Service] Service started successfully');
}

module.exports = {
  getLeaguesNeedingSettlement,
  settleLeague,
  checkAndSettleLeagues,
  startSettlementService
};
