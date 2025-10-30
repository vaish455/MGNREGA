import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_BASE_URL = 'https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722';
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

export class DataSyncService {
  /**
   * Sync data for a specific state and optional financial year
   */
  async syncStateData(stateName, finYear = null) {
    const syncLog = await prisma.syncLog.create({
      data: {
        syncType: 'state',
        status: 'started',
      },
    });

    try {
      let offset = 0;
      const limit = 1000;
      let totalRecords = 0;

      while (true) {
        const params = {
          'api-key': API_KEY,
          format: 'json',
          limit,
          offset,
          'filters[state_name]': stateName,
        };

        if (finYear) {
          params['filters[fin_year]'] = finYear;
        }

        console.log(`Fetching records: offset=${offset}, limit=${limit}`);
        const response = await axios.get(API_BASE_URL, { params });
        const { records, total } = response.data;

        if (!records || records.length === 0) break;

        await this.saveRecords(records);
        totalRecords += records.length;

        console.log(`Synced ${totalRecords} of ${total} records for ${stateName}`);

        if (offset + limit >= total) break;
        offset += limit;

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'completed',
          recordCount: totalRecords,
          completedAt: new Date(),
        },
      });

      console.log(`✅ Sync completed! Total records: ${totalRecords}`);
      return { success: true, recordCount: totalRecords };
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errorMsg: error.message,
          completedAt: new Date(),
        },
      });
      
      throw error;
    }
  }

  /**
   * Sync latest data (current financial year)
   */
  async syncLatestData() {
    const syncLog = await prisma.syncLog.create({
      data: {
        syncType: 'incremental',
        status: 'started',
      },
    });

    try {
      // Get current financial year (April to March)
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const finYear = month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

      console.log(`Syncing latest data for FY: ${finYear}`);

      let offset = 0;
      const limit = 1000;
      let totalRecords = 0;

      while (true) {
        const params = {
          'api-key': API_KEY,
          format: 'json',
          limit,
          offset,
          'filters[fin_year]': finYear,
        };

        const response = await axios.get(API_BASE_URL, { params });
        const { records, total } = response.data;

        if (!records || records.length === 0) break;

        await this.saveRecords(records);
        totalRecords += records.length;

        console.log(`Synced ${totalRecords} of ${total} latest records`);

        if (offset + limit >= total) break;
        offset += limit;

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'completed',
          recordCount: totalRecords,
          completedAt: new Date(),
        },
      });

      console.log(`✅ Latest data sync completed! Total records: ${totalRecords}`);
      return { success: true, recordCount: totalRecords };
    } catch (error) {
      console.error('❌ Latest data sync failed:', error.message);
      
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errorMsg: error.message,
          completedAt: new Date(),
        },
      });
      
      throw error;
    }
  }

  /**
   * Save records to database (upsert states, districts, and MGNREGA data)
   */
  async saveRecords(records) {
    for (const record of records) {
      try {
        // Upsert State
        await prisma.state.upsert({
          where: { stateCode: record.state_code },
          update: { stateName: record.state_name },
          create: {
            stateCode: record.state_code,
            stateName: record.state_name,
          },
        });

        // Upsert District
        await prisma.district.upsert({
          where: { districtCode: record.district_code },
          update: { 
            districtName: record.district_name,
            stateCode: record.state_code,
          },
          create: {
            districtCode: record.district_code,
            districtName: record.district_name,
            stateCode: record.state_code,
          },
        });

        // Upsert MGNREGA Data
        const data = this.mapRecordToData(record);
        await prisma.mgnregaData.upsert({
          where: {
            districtCode_finYear_month: {
              districtCode: record.district_code,
              finYear: record.fin_year,
              month: record.month,
            },
          },
          update: data,
          create: {
            districtCode: record.district_code,
            ...data,
          },
        });
      } catch (error) {
        console.error(`Error saving record for district ${record.district_code}:`, error.message);
      }
    }
  }

  /**
   * Map API record to database schema
   */
  mapRecordToData(record) {
    return {
      finYear: record.fin_year,
      month: record.month,
      approvedLabourBudget: this.parseBigInt(record.Approved_Labour_Budget),
      averageWageRatePerDayPerPerson: this.parseFloat(record.Average_Wage_rate_per_day_per_person),
      averageDaysOfEmploymentProvidedPerHousehold: this.parseInt(record.Average_days_of_employment_provided_per_Household),
      totalHouseholdsWorked: this.parseBigInt(record.Total_Households_Worked),
      totalIndividualsWorked: this.parseBigInt(record.Total_Individuals_Worked),
      totalNoOfActiveJobCards: this.parseBigInt(record.Total_No_of_Active_Job_Cards),
      totalNoOfActiveWorkers: this.parseBigInt(record.Total_No_of_Active_Workers),
      totalNoOfHhsCompleted100DaysOfWageEmployment: this.parseBigInt(record.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
      totalNoOfJobCardsIssued: this.parseBigInt(record.Total_No_of_JobCards_issued),
      totalNoOfWorkers: this.parseBigInt(record.Total_No_of_Workers),
      differentlyAbledPersonsWorked: this.parseBigInt(record.Differently_abled_persons_worked),
      scPersondays: this.parseBigInt(record.SC_persondays),
      scWorkersAgainstActiveWorkers: this.parseBigInt(record.SC_workers_against_active_workers),
      stPersondays: this.parseBigInt(record.ST_persondays),
      stWorkersAgainstActiveWorkers: this.parseBigInt(record.ST_workers_against_active_workers),
      womenPersondays: this.parseBigInt(record.Women_Persondays),
      numberOfCompletedWorks: this.parseBigInt(record.Number_of_Completed_Works),
      numberOfOngoingWorks: this.parseBigInt(record.Number_of_Ongoing_Works),
      totalNoOfWorksTakenup: this.parseBigInt(record.Total_No_of_Works_Takenup),
      numberOfGPsWithNILExp: this.parseBigInt(record.Number_of_GPs_with_NIL_exp),
      totalExp: this.parseFloat(record.Total_Exp),
      totalAdmExpenditure: this.parseFloat(record.Total_Adm_Expenditure),
      wages: this.parseFloat(record.Wages),
      materialAndSkilledWages: this.parseFloat(record.Material_and_skilled_Wages),
      persondaysOfCentralLiabilitySoFar: this.parseBigInt(record.Persondays_of_Central_Liability_so_far),
      percentOfCategoryBWorks: this.parseInt(record.percent_of_Category_B_Works),
      percentOfExpenditureOnAgricultureAlliedWorks: this.parseFloat(record.percent_of_Expenditure_on_Agriculture_Allied_Works),
      percentOfNRMExpenditure: this.parseFloat(record.percent_of_NRM_Expenditure),
      percentagePaymentsGeneratedWithin15Days: this.parseFloat(record.percentage_payments_gererated_within_15_days),
      remarks: record.Remarks || null,
    };
  }

  /**
   * Get sync status and history
   */
  async getSyncStatus() {
    const recentSyncs = await prisma.syncLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    const lastSuccessfulSync = await prisma.syncLog.findFirst({
      where: { status: 'completed' },
      orderBy: { completedAt: 'desc' },
    });

    const totalRecords = await prisma.mgnregaData.count();
    const totalStates = await prisma.state.count();
    const totalDistricts = await prisma.district.count();

    return {
      recentSyncs,
      lastSuccessfulSync,
      totalRecords,
      totalStates,
      totalDistricts,
    };
  }

  // Helper methods
  parseInt(value) {
    const num = parseInt(value);
    return isNaN(num) ? null : num;
  }

  parseFloat(value) {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  parseBigInt(value) {
    try {
      return value ? BigInt(value) : null;
    } catch {
      return null;
    }
  }
}

export default DataSyncService;
