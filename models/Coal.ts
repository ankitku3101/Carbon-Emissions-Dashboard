import mongoose from "mongoose";

const CoalSchema = new mongoose.Schema(
    {
        year:{
            type:Number,
            min:[0,"Year can not be negative"],
        },
        month:{
            type:Number,
            min:[0,"Month can not be Negative"],
            max:[12,"Month can not be greater than 12"]
        },
        coaltype:{
            type:String,
            enum:['anthracite',"bituminous","lignite"],
            lowercase:true
        },
        gcv:{
            type:Number,
            min:[0,"GCV(Gross calorific value) can not be negative"]
        },
        plf:{
            type:Number,
            min:[0,"PLF(Plant Load Factor) can not be negative"]
        },
        production:{
            type:Number,
            min:[0,'Electricity Production Can not be negative']
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

export default mongoose.models.Coal || mongoose.model("Coal",CoalSchema);