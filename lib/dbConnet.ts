import mongoose from "mongoose"


type ConnectionObject = {
    isConnected?:number,
}

const Connection:ConnectionObject={}

export async function dbConnect(): Promise<void>{
    if (Connection.isConnected) {
        console.log("database connected")
    }
    try{
        const db = await mongoose.connect(process.env.mongo_url || '')
        Connection.isConnected = db.connections[0]?.readyState



    }catch(e){
        console.log(e, 'checking for error')
       process.exit()
    }
}