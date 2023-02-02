import { io } from 'socket.io-client'
import React, { createContext, useState } from 'react'
export const SocketContext = createContext({})

export const SocketProvider = (props:any) => {
    var addrss: string = process.env.NEXT_PUBLIC_API_HOST ? process.env.NEXT_PUBLIC_API_HOST :"http://192.168.1.18:3000"
    const [socket] = useState(io(addrss))

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    )
}
