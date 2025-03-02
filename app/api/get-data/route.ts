import Coal from "@/models/Coal";
import CoalUse from "@/models/CoalUse";
import connectMongo from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        await connectMongo();

        const requestBody = await request.json();
        const {
            start,
            end
        } = requestBody;

        if (!start || !end) {
            return NextResponse.json({error:"start or end value is missing"},{status:404});
        }

        const aggregatedDocument = await Coal.aggregate([
            {
                $match:{
                    createdAt:{ $gte: new Date(start), $lte: new Date(end) }
                }
            },
            {
                $lookup: {
                    from: 'coaluses',
                    localField: 'coaluses',
                    foreignField: '_id',
                    as: 'coalUsageData'
                }
            },
            {
                $unwind: '$coalUsageData'
            },
            {
                $group: {
                    _id: '$_id',
                    plf: { $first: '$plf' },
                    production: { $first: '$production' },
                    totalemission: { $first: '$totalemission' },
                    coalUsage: { $push: '$coalUsageData' }
                }
            }
        ])

        return NextResponse.json({data:aggregatedDocument},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Something went wrong in server"},{status:500});
    }
}