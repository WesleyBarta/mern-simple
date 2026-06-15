import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    view: 'landing',
    user: null,
    selectedService: null,
    curtain: '',
  },
  reducers: {
    setView: (state, action) => {
      state.view = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload
    },
    setCurtain: (state, action) => {
      state.curtain = action.payload
    },
  },
})

export const { setView, setUser, setSelectedService, setCurtain } = appSlice.actions
export default appSlice.reducer
