import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { DataSyncService } from './services/data-sync.service.js';

const app = express();
const prisma = new PrismaClient();
const syncService = new DataSyncService();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MGNREGA API is running' });
});

// ==================== STATES ====================

/**
 * GET /api/states
 * Get all states
 */
app.get('/api/states', async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      orderBy: { stateName: 'asc' },
      include: {
        _count: {
          select: { districts: true },
        },
      },
    });

    res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
    });
  }
});

/**
 * GET /api/states/:stateCode
 * Get a specific state with its districts
 */
app.get('/api/states/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    
    const state = await prisma.state.findUnique({
      where: { stateCode },
      include: {
        districts: {
          orderBy: { districtName: 'asc' },
        },
      },
    });

    if (!state) {
      return res.status(404).json({
        success: false,
        error: 'State not found',
      });
    }

    res.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch state',
    });
  }
});

// ==================== DISTRICTS ====================

/**
 * GET /api/districts
 * Get all districts (optionally filtered by state)
 */
app.get('/api/districts', async (req, res) => {
  try {
    const { stateCode } = req.query;
    
    const where = stateCode ? { stateCode } : {};
    
    const districts = await prisma.district.findMany({
      where,
      orderBy: { districtName: 'asc' },
      include: {
        state: true,
      },
    });

    res.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch districts',
    });
  }
});

/**
 * GET /api/districts/:districtCode
 * Get a specific district
 */
app.get('/api/districts/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    const district = await prisma.district.findUnique({
      where: { districtCode },
      include: {
        state: true,
      },
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        error: 'District not found',
      });
    }

    res.json({
      success: true,
      data: district,
    });
  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch district',
    });
  }
});

// ==================== MGNREGA DATA ====================

/**
 * GET /api/mgnrega-data
 * Get MGNREGA data with filters
 */
app.get('/api/mgnrega-data', async (req, res) => {
  try {
    const { districtCode, finYear, month, limit = 100, offset = 0 } = req.query;
    
    const where = {};
    if (districtCode) where.districtCode = districtCode;
    if (finYear) where.finYear = finYear;
    if (month) where.month = month;
    
    const [data, total] = await Promise.all([
      prisma.mgnregaData.findMany({
        where,
        orderBy: [
          { finYear: 'desc' },
          { month: 'desc' },
        ],
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          district: {
            include: {
              state: true,
            },
          },
        },
      }),
      prisma.mgnregaData.count({ where }),
    ]);

    // Convert BigInt to string for JSON serialization
    const serializedData = data.map(record => ({
      ...record,
      approvedLabourBudget: record.approvedLabourBudget?.toString(),
      totalHouseholdsWorked: record.totalHouseholdsWorked?.toString(),
      totalIndividualsWorked: record.totalIndividualsWorked?.toString(),
      totalNoOfActiveJobCards: record.totalNoOfActiveJobCards?.toString(),
      totalNoOfActiveWorkers: record.totalNoOfActiveWorkers?.toString(),
      totalNoOfHhsCompleted100DaysOfWageEmployment: record.totalNoOfHhsCompleted100DaysOfWageEmployment?.toString(),
      totalNoOfJobCardsIssued: record.totalNoOfJobCardsIssued?.toString(),
      totalNoOfWorkers: record.totalNoOfWorkers?.toString(),
      differentlyAbledPersonsWorked: record.differentlyAbledPersonsWorked?.toString(),
      scPersondays: record.scPersondays?.toString(),
      scWorkersAgainstActiveWorkers: record.scWorkersAgainstActiveWorkers?.toString(),
      stPersondays: record.stPersondays?.toString(),
      stWorkersAgainstActiveWorkers: record.stWorkersAgainstActiveWorkers?.toString(),
      womenPersondays: record.womenPersondays?.toString(),
      numberOfCompletedWorks: record.numberOfCompletedWorks?.toString(),
      numberOfOngoingWorks: record.numberOfOngoingWorks?.toString(),
      totalNoOfWorksTakenup: record.totalNoOfWorksTakenup?.toString(),
      numberOfGPsWithNILExp: record.numberOfGPsWithNILExp?.toString(),
      persondaysOfCentralLiabilitySoFar: record.persondaysOfCentralLiabilitySoFar?.toString(),
    }));

    res.json({
      success: true,
      data: serializedData,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error fetching MGNREGA data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MGNREGA data',
    });
  }
});

/**
 * GET /api/mgnrega-data/latest/:districtCode
 * Get latest data for a district
 */
app.get('/api/mgnrega-data/latest/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    const latestData = await prisma.mgnregaData.findFirst({
      where: { districtCode },
      orderBy: [
        { finYear: 'desc' },
        { month: 'desc' },
      ],
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });

    if (!latestData) {
      return res.status(404).json({
        success: false,
        error: 'No data found for this district',
      });
    }

    // Convert BigInt to string
    const serialized = {
      ...latestData,
      approvedLabourBudget: latestData.approvedLabourBudget?.toString(),
      totalHouseholdsWorked: latestData.totalHouseholdsWorked?.toString(),
      totalIndividualsWorked: latestData.totalIndividualsWorked?.toString(),
      totalNoOfActiveJobCards: latestData.totalNoOfActiveJobCards?.toString(),
      totalNoOfActiveWorkers: latestData.totalNoOfActiveWorkers?.toString(),
      totalNoOfHhsCompleted100DaysOfWageEmployment: latestData.totalNoOfHhsCompleted100DaysOfWageEmployment?.toString(),
      totalNoOfJobCardsIssued: latestData.totalNoOfJobCardsIssued?.toString(),
      totalNoOfWorkers: latestData.totalNoOfWorkers?.toString(),
      differentlyAbledPersonsWorked: latestData.differentlyAbledPersonsWorked?.toString(),
      scPersondays: latestData.scPersondays?.toString(),
      scWorkersAgainstActiveWorkers: latestData.scWorkersAgainstActiveWorkers?.toString(),
      stPersondays: latestData.stPersondays?.toString(),
      stWorkersAgainstActiveWorkers: latestData.stWorkersAgainstActiveWorkers?.toString(),
      womenPersondays: latestData.womenPersondays?.toString(),
      numberOfCompletedWorks: latestData.numberOfCompletedWorks?.toString(),
      numberOfOngoingWorks: latestData.numberOfOngoingWorks?.toString(),
      totalNoOfWorksTakenup: latestData.totalNoOfWorksTakenup?.toString(),
      numberOfGPsWithNILExp: latestData.numberOfGPsWithNILExp?.toString(),
      persondaysOfCentralLiabilitySoFar: latestData.persondaysOfCentralLiabilitySoFar?.toString(),
    };

    res.json({
      success: true,
      data: serialized,
    });
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest data',
    });
  }
});

/**
 * GET /api/mgnrega-data/comparison/:districtCode
 * Get comparison data for a district (current vs previous periods)
 */
app.get('/api/mgnrega-data/comparison/:districtCode', async (req, res) => {
  try {
    const { districtCode } = req.params;
    const { finYear } = req.query;
    
    // Get data for the specified financial year
    const currentYearData = await prisma.mgnregaData.findMany({
      where: {
        districtCode,
        finYear: finYear || undefined,
      },
      orderBy: { month: 'asc' },
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });

    // Get all available years for this district
    const allYears = await prisma.mgnregaData.findMany({
      where: { districtCode },
      distinct: ['finYear'],
      select: { finYear: true },
      orderBy: { finYear: 'desc' },
    });

    // Calculate aggregates for current year
    const currentYearAggregates = currentYearData.length > 0 ? {
      totalHouseholdsWorked: currentYearData.reduce((sum, d) => sum + Number(d.totalHouseholdsWorked || 0), 0),
      totalIndividualsWorked: currentYearData.reduce((sum, d) => sum + Number(d.totalIndividualsWorked || 0), 0),
      totalExpenditure: currentYearData.reduce((sum, d) => sum + Number(d.totalExp || 0), 0),
      averageWageRate: currentYearData.reduce((sum, d) => sum + Number(d.averageWageRatePerDayPerPerson || 0), 0) / currentYearData.length,
      totalWorks: currentYearData.reduce((sum, d) => sum + Number(d.totalNoOfWorksTakenup || 0), 0),
      completedWorks: currentYearData.reduce((sum, d) => sum + Number(d.numberOfCompletedWorks || 0), 0),
    } : null;

    res.json({
      success: true,
      data: {
        currentYearData,
        currentYearAggregates,
        availableYears: allYears.map(y => y.finYear),
      },
    });
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comparison data',
    });
  }
});

/**
 * GET /api/mgnrega-data/state-average/:stateCode
 * Get state-level aggregates for comparison
 */
app.get('/api/mgnrega-data/state-average/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    const { finYear } = req.query;
    
    // Get all districts in the state
    const districts = await prisma.district.findMany({
      where: { stateCode },
      select: { districtCode: true },
    });

    const districtCodes = districts.map(d => d.districtCode);

    // Get data for all districts in the financial year
    const stateData = await prisma.mgnregaData.findMany({
      where: {
        districtCode: { in: districtCodes },
        finYear: finYear || undefined,
      },
    });

    // Calculate state averages
    const stateAverages = stateData.length > 0 ? {
      averageWageRate: stateData.reduce((sum, d) => sum + Number(d.averageWageRatePerDayPerPerson || 0), 0) / stateData.length,
      averageDaysOfEmployment: stateData.reduce((sum, d) => sum + Number(d.averageDaysOfEmploymentProvidedPerHousehold || 0), 0) / stateData.length,
      totalHouseholdsWorked: stateData.reduce((sum, d) => sum + Number(d.totalHouseholdsWorked || 0), 0),
      totalExpenditure: stateData.reduce((sum, d) => sum + Number(d.totalExp || 0), 0),
      totalWorks: stateData.reduce((sum, d) => sum + Number(d.totalNoOfWorksTakenup || 0), 0),
    } : null;

    res.json({
      success: true,
      data: stateAverages,
    });
  } catch (error) {
    console.error('Error fetching state average:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch state average',
    });
  }
});

// ==================== DATA SYNC ====================

/**
 * POST /api/sync/state
 * Sync data for a specific state
 */
app.post('/api/sync/state', async (req, res) => {
  try {
    const { stateName, finYear } = req.body;
    
    if (!stateName) {
      return res.status(400).json({
        success: false,
        error: 'State name is required',
      });
    }

    // Start sync in background
    syncService.syncStateData(stateName, finYear)
      .then(result => {
        console.log('Sync completed:', result);
      })
      .catch(error => {
        console.error('Sync error:', error);
      });

    res.json({
      success: true,
      message: 'Sync started in background',
    });
  } catch (error) {
    console.error('Error starting sync:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start sync',
    });
  }
});

/**
 * POST /api/sync/latest
 * Sync latest data (current financial year)
 */
app.post('/api/sync/latest', async (req, res) => {
  try {
    // Start sync in background
    syncService.syncLatestData()
      .then(result => {
        console.log('Latest data sync completed:', result);
      })
      .catch(error => {
        console.error('Latest data sync error:', error);
      });

    res.json({
      success: true,
      message: 'Latest data sync started in background',
    });
  } catch (error) {
    console.error('Error starting latest sync:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start latest sync',
    });
  }
});

/**
 * GET /api/sync/status
 * Get sync status and history
 */
app.get('/api/sync/status', async (req, res) => {
  try {
    const status = await syncService.getSyncStatus();
    
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sync status',
    });
  }
});

// ==================== GEOLOCATION ====================

/**
 * POST /api/location/detect-district
 * Detect district from coordinates (lat/lng)
 * Note: This is a simple implementation. In production, use a proper geocoding service
 */
app.post('/api/location/detect-district', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required',
      });
    }

    // TODO: Implement proper geocoding service
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Geolocation feature requires geocoding service integration',
      data: null,
    });
  } catch (error) {
    console.error('Error detecting district:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect district',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 MGNREGA API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
