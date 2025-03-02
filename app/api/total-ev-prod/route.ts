import Coal from "@/models/Coal";
import connectMongo from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        await connectMongo();
        const requestbody = await request.json();
        const {start,end} = requestbody;

        const ProductionDate = await Coal.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:new Date(start),
                        $lte:new Date(end)
                    }
                }
            },
            {
                $project:{
                    _id:1,
                    production:1,
                    createdAt:1
                }
            },
            {
                $match:{
                    production:{
                        $exists:true,
                        $ne:null
                    }
                }
            },
        ])

        return NextResponse.json({data:ProductionDate,count:ProductionDate.length,message:"Succesful Data fetched"},{status:201});
    } catch (error) {
        return NextResponse.json({error:error.message||"Something went wrong"},{status:500});
    }
}