import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getHomeLandingData } from '../api/yandex';


export const getHomeData = createAsyncThunk(
  'home', 
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await getHomeLandingData();

      return response.data.result.blocks;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e);
    } finally {
      setLoading(false);
    }
  }
);

interface HomeState {
  loading: boolean,
  blocks: Yandex.LandingBlock[]
}

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    loading: false,
    blocks: []
  } as HomeState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBlocks: (state, action: PayloadAction<Yandex.LandingBlock[]>) => {
      state.blocks = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getHomeData.fulfilled, (state, { payload }) => {
      state.blocks = payload;
    });
  }
});

export const { setLoading, setBlocks } = homeSlice.actions;

export default homeSlice.reducer;