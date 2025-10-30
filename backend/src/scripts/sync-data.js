import { DataSyncService } from '../services/data-sync.service.js';

const syncService = new DataSyncService();

/**
 * Script to sync MGNREGA data for a specific state
 * Usage: node src/scripts/sync-data.js <STATE_NAME> [FINANCIAL_YEAR]
 * Example: node src/scripts/sync-data.js "MAHARASHTRA" "2024-2025"
 */

async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('Usage: node src/scripts/sync-data.js <STATE_NAME> [FINANCIAL_YEAR]');
      console.log('Example: node src/scripts/sync-data.js "MAHARASHTRA" "2024-2025"');
      console.log('');
      console.log('To sync latest data for all states:');
      console.log('node src/scripts/sync-data.js --latest');
      process.exit(1);
    }

    if (args[0] === '--latest') {
      console.log('Starting sync for latest data (current financial year)...\n');
      const result = await syncService.syncLatestData();
      console.log('\n✅ Sync completed successfully!');
      console.log(`Total records synced: ${result.recordCount}`);
    } else {
      const stateName = args[0];
      const finYear = args[1] || null;

      console.log(`Starting sync for state: ${stateName}`);
      if (finYear) {
        console.log(`Financial Year: ${finYear}`);
      }
      console.log('');

      const result = await syncService.syncStateData(stateName, finYear);
      
      console.log('\n✅ Sync completed successfully!');
      console.log(`Total records synced: ${result.recordCount}`);
    }

    // Display sync status
    console.log('\nFetching sync status...');
    const status = await syncService.getSyncStatus();
    
    console.log('\n📊 Database Statistics:');
    console.log(`Total States: ${status.totalStates}`);
    console.log(`Total Districts: ${status.totalDistricts}`);
    console.log(`Total Records: ${status.totalRecords}`);
    
    if (status.lastSuccessfulSync) {
      console.log('\n🕐 Last Successful Sync:');
      console.log(`Type: ${status.lastSuccessfulSync.syncType}`);
      console.log(`Records: ${status.lastSuccessfulSync.recordCount}`);
      console.log(`Completed: ${status.lastSuccessfulSync.completedAt}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    process.exit(1);
  }
}

main();
