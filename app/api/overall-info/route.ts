import Coal from "@/models/Coal";
import connectMongo from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function GET(request:NextRequest){
    try {
        await connectMongo();

        const info = await Coal.aggregate([
            {
                $group: {
                    _id: null,
                    totalProduction: { $sum: "$production" },
                    totalEmission: { $sum: "$totalemission" },
                    averagePLF: { $avg: "$plf" }
                }
            }
        ])

        return NextResponse.json({data:info,message:"successful data fetch"},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message||"Server Error"},{status:500})
    }
}