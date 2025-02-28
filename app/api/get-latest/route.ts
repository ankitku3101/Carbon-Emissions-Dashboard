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
                $addFields: {
                    highestBurntCoal: {
                        $arrayElemAt: [
                            {
                                $sortArray: {
                                    input: "$coalusage",
                                    sortBy: { burntamount: -1 }
                                }
                            },
                            0
                        ]
                    },
                    totalBurntAmount: {
                        $sum: "$coalusage.burntamount"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    coaltype: "$highestBurntCoal.coaltype",
                    gcv: "$highestBurntCoal.gcv",
                    burntamount: "$highestBurntCoal.burntamount",
                    totalBurntAmount: 1,
                    plf: 1,
                    production: 1,
                    totalemission: 1,
                    totalBurntAmountOfLatestEntry: "$totalBurntAmount" // This is the new field
                }
            }
        ])

        return NextResponse.json({latestData},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Server error"},{status:500});
    }
}