'use client'
import React, { useState, useEffect, createContext, useContext, useReducer, useRef } from 'react';
import { io } from 'socket.io-client';
import getCookie from '@/components/getCoockie';

// Define initial state
const initialState = {
  receiverId: ''
};

// Define actions
const actions = {
  setreceiverId: (state, payload) => ({ ...state, receiverId: payload })
};

const AppContext = createContext();

const appReducer = (state, action) => {
  if (actions[action.type]) {
    return actions[action.type](state, action.payload);
  }
  return state;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [user, setUser] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userId = (await getCookie('c_user')).value;
        const cookie = (await getCookie('token')).value;
        setUser(userId);

        // Initialize socket connection with the user ID if it's not already initialized
        if (!socketRef.current) {
          const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_API, {
            query: { userID: userId, receiverId: '' },
            auth: {
              token: cookie
            }
          });

          // Set the socket in the ref
          socketRef.current = newSocket;
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    // Call the initialization function
    initializeSocket();

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <AppContext.Provider value={{ socket: socketRef.current, state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext };
