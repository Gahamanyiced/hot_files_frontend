import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fileApi, healthApi } from '../../services/hotFilesApi';

// Async thunks
export const uploadHot22File = createAsyncThunk(
  'files/uploadHot22File',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const response = await fileApi.uploadHot22File(file, onProgress);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFileStats = createAsyncThunk(
  'files/fetchFileStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fileApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecords = createAsyncThunk(
  'files/fetchRecords',
  async ({ type, params }, { rejectWithValue }) => {
    try {
      const response = await fileApi.getRecords(type, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAllRecords = createAsyncThunk(
  'files/deleteAllRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fileApi.deleteAllRecords();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkHealth = createAsyncThunk(
  'files/checkHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await healthApi.checkHealth();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // File upload
  upload: {
    loading: false,
    progress: 0,
    error: null,
    result: null,
    currentFile: null,
  },
  
  // File statistics
  stats: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  
  // Records by type
  records: {
    data: [],
    loading: false,
    error: null,
    pagination: null,
    type: null,
    filters: {},
  },
  
  // Health status
  health: {
    data: null,
    loading: false,
    error: null,
    lastChecked: null,
  },
  
  // UI state
  ui: {
    showUploadDialog: false,
    showStatsDialog: false,
    selectedRecordType: 'BKS24',
    uploadHistory: [],
    maxHistorySize: 10,
  },
  
  // Processing status
  processing: {
    isProcessing: false,
    currentStep: '',
    totalSteps: 0,
    processedRecords: 0,
    totalRecords: 0,
    errors: [],
  },
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    // Upload actions
    setUploadProgress: (state, action) => {
      state.upload.progress = action.payload;
    },
    
    setCurrentFile: (state, action) => {
      state.upload.currentFile = action.payload;
    },
    
    clearUploadResult: (state) => {
      state.upload.result = null;
      state.upload.error = null;
      state.upload.progress = 0;
      state.upload.currentFile = null;
    },
    
    // UI actions
    setShowUploadDialog: (state, action) => {
      state.ui.showUploadDialog = action.payload;
    },
    
    setShowStatsDialog: (state, action) => {
      state.ui.showStatsDialog = action.payload;
    },
    
    setSelectedRecordType: (state, action) => {
      state.ui.selectedRecordType = action.payload;
    },
    
    addToUploadHistory: (state, action) => {
      const uploadRecord = {
        id: Date.now(),
        filename: action.payload.filename,
        timestamp: new Date().toISOString(),
        status: action.payload.status,
        recordCount: action.payload.recordCount,
        processingTime: action.payload.processingTime,
      };
      
      state.ui.uploadHistory.unshift(uploadRecord);
      
      // Keep only max history size
      if (state.ui.uploadHistory.length > state.ui.maxHistorySize) {
        state.ui.uploadHistory = state.ui.uploadHistory.slice(0, state.ui.maxHistorySize);
      }
    },
    
    clearUploadHistory: (state) => {
      state.ui.uploadHistory = [];
    },
    
    // Processing actions
    setProcessingStatus: (state, action) => {
      state.processing = { ...state.processing, ...action.payload };
    },
    
    startProcessing: (state, action) => {
      state.processing.isProcessing = true;
      state.processing.currentStep = action.payload.step || '';
      state.processing.totalSteps = action.payload.totalSteps || 0;
      state.processing.processedRecords = 0;
      state.processing.totalRecords = action.payload.totalRecords || 0;
      state.processing.errors = [];
    },
    
    updateProcessingProgress: (state, action) => {
      state.processing.processedRecords = action.payload.processedRecords;
      state.processing.currentStep = action.payload.currentStep || state.processing.currentStep;
    },
    
    addProcessingError: (state, action) => {
      state.processing.errors.push(action.payload);
    },
    
    finishProcessing: (state) => {
      state.processing.isProcessing = false;
      state.processing.currentStep = 'Completed';
    },
    
    // Clear data
    clearStats: (state) => {
      state.stats.data = null;
      state.stats.error = null;
    },
    
    clearRecords: (state) => {
      state.records.data = [];
      state.records.error = null;
      state.records.pagination = null;
    },
    
    clearHealth: (state) => {
      state.health.data = null;
      state.health.error = null;
    },
    
    // Reset state
    resetFiles: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Upload HOT22 File
    builder
      .addCase(uploadHot22File.pending, (state) => {
        state.upload.loading = true;
        state.upload.error = null;
        state.upload.progress = 0;
      })
      .addCase(uploadHot22File.fulfilled, (state, action) => {
        state.upload.loading = false;
        state.upload.result = action.payload;
        state.upload.progress = 100;
        state.upload.error = null;
        
        // Add to upload history
        fileSlice.caseReducers.addToUploadHistory(state, {
          payload: {
            filename: state.upload.currentFile?.name || 'Unknown',
            status: 'success',
            recordCount: action.payload.results?.summary?.totalSaved || 0,
            processingTime: action.payload.results?.summary?.processingTime || 0,
          },
        });
      })
      .addCase(uploadHot22File.rejected, (state, action) => {
        state.upload.loading = false;
        state.upload.error = action.payload;
        state.upload.progress = 0;
        
        // Add to upload history
        fileSlice.caseReducers.addToUploadHistory(state, {
          payload: {
            filename: state.upload.currentFile?.name || 'Unknown',
            status: 'error',
            recordCount: 0,
            processingTime: 0,
          },
        });
      })
      
      // Fetch File Stats
      .addCase(fetchFileStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchFileStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.data = action.payload;
        state.stats.lastUpdated = new Date().toISOString();
        state.stats.error = null;
      })
      .addCase(fetchFileStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      })
      
      // Fetch Records
      .addCase(fetchRecords.pending, (state, action) => {
        state.records.loading = true;
        state.records.error = null;
        state.records.type = action.meta.arg.type;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.records.loading = false;
        state.records.data = action.payload.data.records;
        state.records.pagination = action.payload.data.pagination;
        state.records.filters = action.payload.data.filters;
        state.records.error = null;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.records.loading = false;
        state.records.error = action.payload;
      })
      
      // Delete All Records
      .addCase(deleteAllRecords.pending, (state) => {
        state.processing.isProcessing = true;
        state.processing.currentStep = 'Deleting records...';
      })
      .addCase(deleteAllRecords.fulfilled, (state, action) => {
        state.processing.isProcessing = false;
        state.processing.currentStep = 'Deletion completed';
        // Clear stats to force refresh
        state.stats.data = null;
      })
      .addCase(deleteAllRecords.rejected, (state, action) => {
        state.processing.isProcessing = false;
        state.processing.currentStep = 'Deletion failed';
        fileSlice.caseReducers.addProcessingError(state, {
          payload: action.payload,
        });
      })
      
      // Check Health
      .addCase(checkHealth.pending, (state) => {
        state.health.loading = true;
        state.health.error = null;
      })
      .addCase(checkHealth.fulfilled, (state, action) => {
        state.health.loading = false;
        state.health.data = action.payload;
        state.health.lastChecked = new Date().toISOString();
        state.health.error = null;
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.health.loading = false;
        state.health.error = action.payload;
      });
  },
});

export const {
  setUploadProgress,
  setCurrentFile,
  clearUploadResult,
  setShowUploadDialog,
  setShowStatsDialog,
  setSelectedRecordType,
  addToUploadHistory,
  clearUploadHistory,
  setProcessingStatus,
  startProcessing,
  updateProcessingProgress,
  addProcessingError,
  finishProcessing,
  clearStats,
  clearRecords,
  clearHealth,
  resetFiles,
} = fileSlice.actions;

// Selectors
export const selectUpload = (state) => state.files.upload;
export const selectFileStats = (state) => state.files.stats;
export const selectRecords = (state) => state.files.records;
export const selectHealth = (state) => state.files.health;
export const selectFileUI = (state) => state.files.ui;
export const selectProcessing = (state) => state.files.processing;

export const selectFileLoading = (state) => 
  state.files.upload.loading ||
  state.files.stats.loading ||
  state.files.records.loading ||
  state.files.health.loading;

export const selectFileError = (state) => 
  state.files.upload.error ||
  state.files.stats.error ||
  state.files.records.error ||
  state.files.health.error;

export const selectUploadHistory = (state) => state.files.ui.uploadHistory;
export const selectIsProcessing = (state) => state.files.processing.isProcessing;

export default fileSlice.reducer;