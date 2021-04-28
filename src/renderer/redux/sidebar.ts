import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    collapsed: true,
  },
  reducers: {
    setCollapsed(state, action: PayloadAction<boolean>) {
      state.collapsed = action.payload; 
    }
  }
});

export const { setCollapsed } = sidebarSlice.actions;

export default sidebarSlice.reducer;