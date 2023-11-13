import { headers } from "next/headers"
import { NextResponse } from "next/server"
import MercadoPagoConfig, { Payment } from "mercadopago";

import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
    const response = new URL(req.url).searchParams
    

    if (response.get("type") && response.get("type") === "payment") {
        const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_MP_ACCESS_TOKEN!, options: { timeout: 5000, idempotencyKey: 'abc' } })
        const payment = new Payment(client);
        const id = response.get("data.id") 
        
        if (id !== null) {
            try {
                const data = await payment.get({ id: id })
                console.log(data);
                
                
                //update order status
                // const order = await prismadb.order.update({
                //     where: {
                //         id: data.
                //     }
                // })
            } catch (error) {
                console.log("error has ocurred: ", error);
            }
        }
    }

    return new NextResponse("Post request received", { status: 200 })
}