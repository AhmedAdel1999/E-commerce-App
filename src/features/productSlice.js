import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import {fetchInstance} from '../utils/constants';
import UploadImg from '../utils/uploadImg';

const initialState = {
  products: [],
  isCreating:false,
  isCreatedSuccessfully:false,
  isCreationError:false,
  creationErrMsg:"",
  creationSucMsg:"",

  isUpdating:false,
  isUpdatedSuccessfully:false,
  isUpdatingError:false,
  updatingErrMsg:"",
  updatingSucMsg:"",

  isDeleting:false,
  isDeletedSuccessfully:false,
  isDeletingError:false,
  deletingErrMsg:"",
  deletingSucMsg:"",

  isDeletingAll:false,
  isDeletedAllSuccessfully:false,
  isDeletingAllError:false,
  deletingAllErrMsg:"",
  deletingAllSucMsg:"",
};


export const createProduct =createAsyncThunk(
  "products/createProduct",
  async({product,productImg,userId},{fulfillWithValue,rejectWithValue})=>{
    try {
      const image = await UploadImg(productImg)
      let response = await fetchInstance.post(`users/${userId}/products`,{...product,image})
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const UpdateProduct =createAsyncThunk(
  "products/UpdateProduct",
  async({product,productImg,userId,productId},{fulfillWithValue,rejectWithValue})=>{
    try {
      if(productImg){
        const image = await UploadImg(productImg)
        let response = await fetchInstance.put(`users/${userId}/products/${productId}`,{...product,image})
        return fulfillWithValue(await response.data)
      }else{
        let response = await fetchInstance.put(`users/${userId}/products/${productId}`,{...product})
        return fulfillWithValue(await response.data)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


const deleteItem = async(productId,userId) =>{
   await fetchInstance.delete(`users/${userId}/products/${productId}`)
}


export const deleteProduct =createAsyncThunk(
  "products/deleteProduct",
  async({productId,userId},{fulfillWithValue,rejectWithValue})=>{
    try {
      await deleteItem(productId,userId)
      let response = await fetchInstance.get(`products`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


export const deleteCheckedProducts =createAsyncThunk(
  "products/deleteCheckedProducts",
  async({userId,checkedProductsIDS},{fulfillWithValue,rejectWithValue})=>{
    try {
      for(let i=0; i<checkedProductsIDS.length; i++){
          await deleteItem(checkedProductsIDS[i],userId)
      }
      let response = await fetchInstance.get(`products`)
      return fulfillWithValue(await response.data)
    }catch (error) {
        return rejectWithValue(error.message)
    }
  }
)


export const getAllProducts =createAsyncThunk(
  "products/getAllProducts",
  async(undefined,{fulfillWithValue,rejectWithValue})=>{
    try {
      let response = await fetchInstance.get(`products`)
      return fulfillWithValue(await response.data)
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    //check all products
    checkAllProducts:((state,action)=>{
      const {productsAfterFilter,checked} = action.payload
      const ids = productsAfterFilter.map((product)=>product.id)
      let checkedProducts =[]
       state.products.forEach((product)=>{
          if(ids.includes(product.id)){
            let checkedProduct={...product,checked}
            checkedProducts.push(checkedProduct)
          }else{
            checkedProducts.push(product)
          }
        })
        state.products=[...checkedProducts]
    }),

    //check single product
    checkSingleProduct:((state,action)=>{
      state.products.forEach((product)=>{
        if(product.id===action.payload){
          product.checked=!product.checked
        }
      })
    }),

    //clear state
    clearProductsState:((state)=>{
      state.isCreating=false;
      state.isCreatedSuccessfully=false;
      state.isCreationError=false;
      state.creationErrMsg="";
      state.creationSucMsg="";

      state.isUpdating=false;
      state.isUpdatedSuccessfully=false;
      state.isUpdatingError=false;
      state.updatingErrMsg="";
      state.updatingSucMsg="";

      state.isDeleting=false;
      state.isDeletedSuccessfully=false;
      state.isDeletingError=false;
      state.deletingErrMsg="";
      state.deletingSucMsg="";

      state.isDeletingAll=false;
      state.isDeletedAllSuccessfully=false;
      state.isDeletingAllError=false;
      state.deletingAllErrMsg="";
      state.deletingAllSucMsg="";
    })
  },
  extraReducers:{


    //create new product
    [createProduct.pending]:((state)=>{
      state.isCreating=true;
    }),
    [createProduct.fulfilled]:((state)=>{
      state.isCreatedSuccessfully=true;
      state.isCreating=false;
      state.creationSucMsg=`A New Product Has Been Add Successfully`
    }),
    [createProduct.rejected]:((state)=>{
      state.isCreationError=true;
      state.isCreating=false;
      state.creationErrMsg=`Error!! Failed To Add A New Product`
    }),

    //update product
    [UpdateProduct.pending]:((state)=>{
      state.isUpdating=true;
    }),
    [UpdateProduct.fulfilled]:((state)=>{
      state.isUpdatedSuccessfully=true;
      state.isUpdating=false;
      state.updatingSucMsg=`Product Has Been Updated Successfully`
    }),
    [UpdateProduct.rejected]:((state)=>{
      state.isUpdatingError=true;
      state.isUpdating=false;
      state.updatingErrMsg=`Error!! Failed To Update Product`
    }),

    //delete one product
    [deleteProduct.pending]:((state)=>{
      state.isDeleting=true;
    }),
    [deleteProduct.fulfilled]:((state,action)=>{
      state.isDeletedSuccessfully=true;
      state.isDeleting=false;
      state.deletingSucMsg=`Product Has Been Deleted Successfully`
      state.products=[...action.payload]
    }),
    [deleteProduct.rejected]:((state)=>{
      state.isDeletingError=true;
      state.isDeleting=false;
      state.deletingErrMsg=`Error!! Failed To Delete Product`
    }),

    //delete all checked products
    [deleteCheckedProducts.pending]:((state)=>{
      state.isDeletingAll=true
    }),
    [deleteCheckedProducts.fulfilled]:((state,action)=>{
      state.isDeletingAll=false
      state.isDeletedAllSuccessfully=true
      state.deletingAllSucMsg=`All Checked Products Have Been Deleted`
      state.products=[...action.payload]
    }),
    [deleteCheckedProducts.rejected]:((state)=>{
      state.isDeletingAll=false
      state.isDeletingAllError=true
      state.deletingAllErrMsg=`SomeThing wrong is happened`
    }),

    //get all products
    [getAllProducts.fulfilled]:((state,action)=>{
      state.products=[...action.payload]
    }),
  }
});

export const { checkAllProducts,checkSingleProduct,clearProductsState } = productSlice.actions
export default productSlice.reducer;
