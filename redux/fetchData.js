import { createSlice } from '@reduxjs/toolkit'
import {combineReducers} from 'redux'
// import {call,put,takeEvery} from 'redux-saga'
import dataOrg from '../data/data.json';       ////////////////////////////////////////////// xài tạm
import { call,put,takeEvery,take,takeLatest } from 'redux-saga/effects';
import { Dirs, FileSystem } from 'react-native-file-access';


export const read = createSlice({
  name: 'read',     
  initialState: {
    content:[],
    info:{},
    loading: false
  },
  reducers: {
    
    loader: (state,action) => {
      state.loading= true;
      state.content=[];
      state.info={};
    },

    handle: (state,action) => {
      state.content=action.payload;
      state.loading= false;
    },

    noLoading: (state,action) => {
      state.loading= false;
    },

}
})

export const searchContent = createSlice({
  name: 'searchContent',     
  initialState: {
    data1:dataOrg,
    loading1: false,
    result:false
  },
  reducers: {
    loader1: (state,action) => {
      state.loading1= true;
    },

    handle1: (state,action) => {
      state.result=action.payload;
      state.loading1= false;
    },
}
})

export const searchLaw = createSlice({
  name: 'searchLaw',     
  initialState: {
    loading2: false,
    input2:'',
    info:null,
  },
  reducers: {
    loader2: (state,action) => {
      state.loading2= true;
    },

    handle2: (state,action) => {
      state.info=action.payload.b;
      state.loading2= false;
    },
}
})

export const stackscreen = createSlice({    // không càn nữa
  name: 'stackscreen',     
  initialState: {
    loading3: false,
    info3:[],
  },
  reducers: {
    loader3: (state,action) => {
      state.loading3= true;

    },

    handle3: (state,action) => {
      state.info3=action.payload.b;
      state.loading3= false;

    },
}
})



export function* mySaga(state,action){
  
  try{
    yield put(loader())



    // let info = yield fetch(`https://us-central1-project2-197c0.cloudfunctions.net/callOneLaw?screen=${state.lawName}`,{
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   // body:JSON.stringify({screen:state.lawName})
    // })
  

    let info = yield fetch(`https://us-central1-project2-197c0.cloudfunctions.net/callOneLaw`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({screen:state.lawName})
    })

    let a = yield info.json()



    yield put(handle(a))
    
    // yield put(noLoading())

  }catch(e){

  }
}

export function* mySaga1(state,action){
  try{
    yield put(loader1())

    // let info = yield  fetch(`https://us-central1-project2-197c0.cloudfunctions.net/searchContent?input=${state.input}`,{
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   // body:JSON.stringify({input:state.input})
    // })
  

    let info = yield  fetch(`https://us-central1-project2-197c0.cloudfunctions.net/searchContent`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({input:state.input})
    })


    let b = yield info.json()


yield put(handle1(b))
  }catch(e){
  }
}

export function* mySaga2(state,action){
  try{
        
    yield put(loader2())
    
    // let info = yield  fetch(`https://us-central1-project2-197c0.cloudfunctions.net/searchLaw?input=${state.input}`,{
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   // body:JSON.stringify({input:state.input})
    // })
  

    let info = yield  fetch(`https://us-central1-project2-197c0.cloudfunctions.net/searchLaw`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({input:state.input})
    })

    let b = yield info.json()


    yield put(handle2({b}))
  }catch(e){
  }
}






export function* mySaga3(state,action){
  yield put(loader3())


    let info = yield fetch(`https://us-central1-project2-197c0.cloudfunctions.net/stackscreen`,{
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // body:JSON.stringify({screen:1})
    })
    
    let b = yield info.json()


    yield put(handle3({b}))
  }


export function* saga(){
  yield takeEvery('read',mySaga) 
  // yield takeEvery(handle.type,mySaga)    //xài cái này cũng được

}

export function* saga1(){
  yield takeEvery('searchContent',mySaga1)
  // yield takeEvery(handle1.type,mySaga1)

}

export function* saga2(){
  yield takeEvery('searchLaw',mySaga2)

}

export function* saga3(){
  yield takeEvery('stackscreen',mySaga3)

}

  
export const {loader,handle,noLoading} = read.actions;
export const {loader1,handle1} = searchContent.actions;
export const {loader2,handle2} = searchLaw.actions;
export const {loader3,handle3} = stackscreen.actions;
