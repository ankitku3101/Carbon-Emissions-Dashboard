import connectMongo from "@/lib/mongodb";
import Coal from "@/models/Coal";
import CoalUse from "@/models/CoalUse";
import mongoose from "mongoose";
import { NextRequest,NextResponse } from "next/server";

//validate of 7 days
const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export async function POST(request:NextRequest){
    const session = await mongoose.startSession();
    try {
        await connectMongo();
        await session.startTransaction();

        const requestBody = await request.json();
        const {
            plf,
            production,
            coaluses_incoming
        } = requestBody;

        if(typeof(plf)!=='number'){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({error:"Value must be numeric"},{status:400})
        }
        if(typeof(production)!=='number'){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({error:"Value must be numeric"},{status:400})
        }
        if(!Array.isArray(coaluses_incoming)){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({error:"Data type must be in array"},{status:400})
        }

        let totalemission=0;
        for(let i=0;i<coaluses_incoming.length;i++){
            totalemission+=coaluses_incoming[i].carbonemission;
        }

        const coalusedocument = await CoalUse.insertMany(coaluses_incoming,{session});
        if(!coalusedocument){
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({error:"Failed in inserting many values"},{status:500});
        }

        const coalusedocument_ids = coalusedocument.map((item)=>item._id);

        const lastEntry = await Coal.findOne().sort({createdAt:-1}).session(session);
        let nextDate = new Date();
        if(lastEntry){
            nextDate = new Date(lastEntry.createdAt);
            nextDate.setUTCDate(nextDate.getUTCDate() + 7);

            // const currentTime = new Date();
            // const timeDifference = (currentTime.getTime() - new Date(lastEntry.createdAt).getTime()) / (1000 * 60 * 60 * 24);

            // if (timeDifference < 7) {
            //     return NextResponse.json({ error: "New entry can only be added after 7 days from the last entry" }, { status: 400 });
            // }

            // if (timeDifference === 7) {
            //     nextDate = new Date(lastEntry.createdAt);
            //     nextDate.setUTCDate(nextDate.getUTCDate() + 7); // Add 7 days only if exactly 7 days have passed
            // }
        }else {
            nextDate = new Date();
        }


        const coalDoc = await Coal.create({
            coaluses:coalusedocument_ids,
            plf,
            production,
            totalemission,
            createdAt:nextDate,
            updatedAt:nextDate,
        },{session});

        if (!coalDoc) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ error: "Failed to create Coal document" }, { status: 500 })
        }
        await session.commitTransaction();
        session.endSession();
      
        return NextResponse.json(
            {
              success: true,
              data: coalDoc,
            },
            { status: 201 },
        )

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({error:error.message||"Something went wrong"},{status:500});
    }
}