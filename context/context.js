'use client'
import React , {useState, useEffect, createContext, useContext, useReducer} from 'react'
import { io } from 'socket.io-client';
import getCookie from '@/components/getCoockie';




// Define initial state
const initialState = {
   receiverId : ''
  };


  // Define actions
const actions = {
    setreceiverId: (state, payload) => ({ ...state, receiverId: payload }),
  
   
  };


const AppContext = createContext()



const appReducer = (state, action) => {
    if (actions[action.type]) {
      return actions[action.type](state, action.payload);
    }
    return state;
  };




export const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(appReducer, initialState);


    const [socket, setSocket] = useState(null);

    const [user , setUser] = useState('')

   

   




    


    useEffect(() => {

        const initializeSocket = async () => {
            try {
              const cookie = (await getCookie('c_user')).value;
              setUser(cookie);
        
              // Initialize socket connection with the user ID
              const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_API, {
                query: { userID: cookie }  // Use the updated 'user' value here
              });
        
              // Set the socket in the state
              setSocket(newSocket);
            } catch (error) {
              console.error('Error fetching user ID:', error);
            }
          };
        
          // Call the initialization function
          initializeSocket();
        
          // Cleanup function to disconnect the socket when the component is unmounted
          return () => {
            if (socket) {
              socket.disconnect();
            }
          };
      }, []);







return <AppContext.Provider value={{socket, state, dispatch}}>{children}</AppContext.Provider>
}


export const useAppContext = () => {
    return useContext(AppContext);
  };

export {AppContext}

