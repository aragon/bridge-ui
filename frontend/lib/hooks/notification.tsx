import React from 'react'
import { ToastHub, Toast } from "@aragon/ui";

export const  useNotificationContext = React.createContext(null);

export default function UseNotificationProvider({ children }) {
    // for the moment we use a toast component,
    // but a more sofisticated notification might be needed down the road,
    // perhaps accounting for success, fail and warning notification
    return (
        <ToastHub 
        timeout={3000}
        showIndicator={true}
        position={'right'}
        >
          <Toast>
            {launchToast => (
                <useNotificationContext.Provider
                    value={{ 'launchToast': launchToast }}
                >
                    {children}
                </useNotificationContext.Provider>
            )}
          </Toast>
        </ToastHub> 
    );
}
