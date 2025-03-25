import 'dotenv/config';

import PgBoss from 'pg-boss';
import { updateTokenRisks } from './update-token-risk';
import { markPendingInsightsAsStale } from './mark-pending-insights-stale';

export async function initJobManager() {
  const boss = new PgBoss({
    connectionString: process.env.DATABASE_URL,
    schema: 'jobs',
    application_name: 'nuvolari-service',
  });
  
  boss.on('error', error => console.error('PgBoss error:', error));
  
  await boss.start();
  console.log('PgBoss job manager started');
  
  // Create queues
  await boss.createQueue('update-token-risks');
  console.log('Queue created: update-token-risks');
  
  await boss.createQueue('mark-insights-stale');
  console.log('Queue created: mark-insights-stale');
  
  await registerJobHandlers(boss);
  
  await scheduleJobs(boss);
  return boss;
}

async function registerJobHandlers(boss: PgBoss) {
  // Handler for token risk updates
  await boss.work('update-token-risks', async job => {
    console.log(`Processing token risk update job`);
    
    try {
      const result = await updateTokenRisks();
      return { success: true, updatedCount: result?.updatedCount || 0 };
    } catch (error) {
      console.error('Error processing token risk update job:', error);
      throw error;
    }
  });
  
  // Handler for marking insights as stale
  await boss.work('mark-insights-stale', async job => {
    console.log(`Processing mark insights stale job`);
    
    try {
      const result = await markPendingInsightsAsStale();
      return result;
    } catch (error) {
      console.error('Error processing mark insights stale job:', error);
      throw error;
    }
  });
  
  console.log('Job handlers registered');
}

async function scheduleJobs(boss: PgBoss) {
  // Cancel any existing scheduled jobs
  await boss.unschedule('update-token-risks');
  await boss.unschedule('mark-insights-stale');
  
  // Schedule token risk updates every 10 minutes
  await boss.schedule('update-token-risks', '*/10 * * * *', {}, {
    retryLimit: 3,
    retryDelay: 60,
    retryBackoff: true,
  });
  
  console.log('Token risk update job scheduled to run every 10 minutes');
  
  // Schedule marking insights as stale every 15 minutes
  await boss.schedule('mark-insights-stale', '*/15 * * * *', {}, {
    retryLimit: 3,
    retryDelay: 60,
    retryBackoff: true,
  });
  
  console.log('Mark insights stale job scheduled to run every 15 minutes');
}

async function main() {
  try {
    const boss = await initJobManager();
    
    // Send test jobs
    await boss.send('update-token-risks', {});
    console.log('Initial token risk job sent');
    
    await boss.send('mark-insights-stale', {});
    console.log('Initial mark insights stale job sent');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Stopping job manager...');
      await boss.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to initialize job manager:', error);
  }
}

main();
