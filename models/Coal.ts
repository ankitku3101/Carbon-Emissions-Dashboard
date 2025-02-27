import mongoose from "mongoose";

const CoalSchema = new mongoose.Schema(
    {
        coaluses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"CoalUse"
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

const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

CoalSchema.pre('save', async function (next) {
    const Coal = mongoose.model('Coal', CoalSchema);

    const latestEntry = await Coal.findOne().sort({ createdAt: -1 });

    if (latestEntry) {
        const lastEntryDate = stripTime(latestEntry.createdAt); // Date part only (no time)
        const todayDate = stripTime(new Date());

        const diffInDays = Math.floor((todayDate.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays !== 7) {
            return next(new Error(`New entries must be exactly 7 days apart. Last entry was on ${lastEntryDate.toDateString()}.`));
        }
    }

    next();
});

export default mongoose.models.Coal || mongoose.model("Coal",CoalSchema);