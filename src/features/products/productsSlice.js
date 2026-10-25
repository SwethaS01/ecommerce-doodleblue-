
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHomeEssentials } from "../../api/homeEssentialsApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHomeEssentials();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Something went wrong";
      });
  },
});

export default productsSlice.reducer;
