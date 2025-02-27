import connectMongo from "@/lib/mongodb";
import Coal from "@/models/Coal";
import CoalUse from "@/models/CoalUse";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        await connectMongo();

        const requestBody = await request.json();
        const {
            plf,
            production,
            coaluses_incoming
        } = requestBody;

        if(typeof(plf)!=='number'){
            return NextResponse.json({error:"Value must be numeric"},{status:400})
        }
        if(typeof(production)!=='number'){
            return NextResponse.json({error:"Value must be numeric"},{status:400})
        }
        if(!Array.isArray(coaluses_incoming)){
            return NextResponse.json({error:"Data type must be in array"},{status:400})
        }

        let totalemission=0;
        for(let i=0;i<coaluses_incoming.length;i++){
            totalemission+=coaluses_incoming[i].carbonemission;
        }
        const coalusedocument = await CoalUse.insertMany(coaluses_incoming);
        if(!coalusedocument){
            return NextResponse.json({error:"Failed in inserting many values"},{status:500});
        }

        const coalusedocument_ids = coalusedocument.map((item)=>item._id);

        const coalDoc = await Coal.create({
            coaluses:coalusedocument_ids,
            plf,
            production,
            totalemission
        });
        if (!coalDoc) {
            return NextResponse.json({ error: "Failed to create Coal document" }, { status: 500 })
          }
      
          return NextResponse.json(
            {
              success: true,
              data: coalDoc,
            },
            { status: 201 },
          )

    } catch (error) {
        return NextResponse.json({error:error.message||"Something went wrong"},{status:500});
    }
}