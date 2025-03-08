import PgBoss from 'pg-boss';
import { updateTokenRisks } from './update-token-risk';

export async function initJobManager() {
  const boss = new PgBoss({
    connectionString: process.env.DATABASE_URL,
    schema: 'jobs',
    application_name: 'token-risk-service',
  });

  boss.on('error', error => console.error('PgBoss error:', error));
  
  await boss.start();
  console.log('PgBoss job manager started');

  // Create the queue first - this is the missing step
  await boss.createQueue('update-token-risks');
  console.log('Queue created: update-token-risks');

  await registerJobHandlers(boss);
  
  await scheduleJobs(boss);

  return boss;
}

async function registerJobHandlers(boss: PgBoss) {
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
  
  console.log('Job handlers registered');
}

async function scheduleJobs(boss: PgBoss) {
  // Cancel any existing scheduled jobs
  await boss.unschedule('update-token-risks');
  
  // Schedule token risk updates every 10 minutes
  await boss.schedule('update-token-risks', '*/10 * * * *', {}, {
    retryLimit: 3,
    retryDelay: 60,
    retryBackoff: true,
  });
  
  console.log('Token risk update job scheduled to run every 10 minutes');
}

async function main() {
  try {
    const boss = await initJobManager();
    
    await boss.send('update-token-risks', {});
    console.log('Test job sent');
    
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