import mongoose from "mongoose";

const CoalSchema = new mongoose.Schema(
    {
        coaluses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'CoalUse'
            }
        ],
        plf:{
            type:Number,
            min:[0,"PLF(Plant Load Factor) can not be negative"]
        },
        production:{
            type:Number,
            min:[0,'Electricity Production Can not be negative']
        },
        totalemission:{
            type:Number,
            min:[0,"total emission can not be negative"]
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.models.Coal || mongoose.model("Coal",CoalSchema);