'use client'
// ResponseContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Define initial state
const initialState = {
  responseData: {}
};

// Define actions
const actions = {
  setResponseData: (state, payload) => ({ ...state, responseData: payload }),
};

// Create the context
const ResponseContext = createContext();

// Reducer function
const responseReducer = (state, action) => {
  if (actions[action.type]) {
    return actions[action.type](state, action.payload);
  }
  return state;
};

// Custom provider
export const ResponseProvider = ({ children }) => {
  const [states, dispatchs] = useReducer(responseReducer, initialState);

  return (
    <ResponseContext.Provider value={{ states, dispatchs}}>
      {children}
    </ResponseContext.Provider>
  );
};

// Custom hook to use the response context
export const useResponseContext = () => {
  return useContext(ResponseContext);
};

export {ResponseContext}
