import Coal from "@/models/Coal";
import connectMongo from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        await connectMongo();
        const requestbody = await request.json();
        const {start,end} = requestbody;

        const coalTypeAggregation = await Coal.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                }
            },
            {
                $lookup: {
                    from: 'coaluses',
                    localField: 'coaluses',
                    foreignField: '_id',
                    as: 'coalusages'
                }
            },
            {
                $unwind: '$coalusages' // Unwind to group by coal type
            },
            {
                $group: {
                    _id: '$coalusages.coaltype', // Group by coal type
                    dates: { $push: '$createdAt' }, // Collect dates into an array
                    emissions: { $push: '$coalusages.carbonemission' } // Collect emissions into an array
                }
            }
        ]);

        return NextResponse.json({data:coalTypeAggregation,message:"Succesfully gathering emission and coal type"},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Something went wrong"},{status:500});
    }
}