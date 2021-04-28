import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState: {
    maximized: false,
  },
  reducers: {
    setMaximized(state, action: PayloadAction<boolean>) {
      state.maximized = action.payload; 
    }
  }
});

export const { setMaximized } = toolbarSlice.actions;

export default toolbarSlice.reducer;