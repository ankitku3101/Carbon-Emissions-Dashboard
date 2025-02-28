import Coal from "@/models/Coal";
import connectMongo from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        await connectMongo();
        const requestbody = await request.json();
        const {start,end} = requestbody;

        const emissionAggregation = await Coal.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:new Date(start),
                        $lte:new Date(end)
                    }
                }
            },
            {
                $lookup:{
                    from:'coaluses',
                    localField:'coaluses',
                    foreignField:'_id',
                    as:'coalusages'
                },
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: '$coalusages' }, 0] } // Only keep non-empty arrays
                }
            },
            {
                $project:{
                    _id:1,
                    "coalusages._id":1,
                    "coalusages.coaltype":1,
                    "coalusages.carbonemission":1,
                    totalemission:1,
                    createdAt:1
                }
            }
        ])

        return NextResponse.json({data:emissionAggregation,message:"Total emission data fetched"},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Something went wrong"},{status:500});
    }
}