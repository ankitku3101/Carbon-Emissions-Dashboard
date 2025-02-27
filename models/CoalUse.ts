import mongoose from "mongoose";

const CoalUseSchema = new mongoose.Schema(
    {
        coaltype:{
            type:String,
            enum:['anthracite',"bituminous","lignite"],
            lowercase:true
        },
        gcv:{
            type:Number,
            min:[0,"GCV(Gross calorific value) can not be negative"]
        },
        burntamount:{
            type:Number,
            min:[0,"Burnt coal amount can not be negative"]
        },
        carbonemission:{
            type:Number,
            min:[0,"Carbon emission amount can not be negative"]
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.models.CoalUse || mongoose.model('CoalUse',CoalUseSchema);