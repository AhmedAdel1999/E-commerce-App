import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/utils/baseUrl';
const initialState = {
  history:[],
  status: 'idle',
};

export const Orderhistory =createAsyncThunk(
  "history/Orderhistory",
  async({path,config},{rejectWithValue,fulfillWithValue})=>{
    try {
      let response = await axiosInstance.get(`${path}`,config)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)


export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers:{
    [Orderhistory.fulfilled]:((state,action)=>{
      state.history=[...action.payload]
    }),
    
  }
});
export default historySlice.reducer;
