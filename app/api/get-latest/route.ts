import Coal from "@/models/Coal";
import connectMongo from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function GET(request:NextRequest){
    try {
        await connectMongo();
        const latestData = await Coal.aggregate([
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $limit:1
            },
            {
                $lookup:{
                    from:'coaluses',
                    localField:"coaluses",
                    foreignField:"_id",
                    as:"coalusage"
                }
            },
            {
                $project:{
                    _id:1,
                    "coalusage.coaltype":1,
                    "coalusage.gcv":1,
                    "coalusage.burntamount":1,
                    plf:1,
                    production:1,
                    totalemission:1
                }
            }
        ])

        return NextResponse.json({latestData},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Server error"},{status:500});
    }
}