import { MercadoPagoItems } from "@/types";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

interface Payload {
    id: string,
    quantity: string
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const {payload} = await req.json()

    const productIds = payload.map((product: Payload) => product.id)

    if (!productIds || productIds === 0) {
        return new NextResponse("Product ids are required", { status: 400 })
    }

    // Retrieve the products using the ids received 
    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds,
            }
        }
    });

    // Create the items array that is going to be passed to mercadopago
    const lineItems: MercadoPagoItems[] = []
    
    products.forEach((product) => {
        // Extract the quantity for each product and then 
        const quantity = payload.map((product: Payload) => (product.id === product.id ? product.quantity : 1))
        lineItems.push({
            id: product.id,
            title: product.name,
            quantity: Number(quantity),
            unit_price: Number(product.price),
            currency_id: 'ARS'
        })
    })

    // Create order in database
    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: payload.map((product: Payload) => ({
                    product: {
                        connect: {
                            id: product.id
                        }
                    },
                    quantity: product.quantity.toString()
                }))
            },
        }
    });

    // Create client using mercadopago API
    const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_MP_ACCESS_TOKEN!, options: { timeout: 5000, idempotencyKey: 'abc' } })

    // Create preference
    const preference = new Preference(client)
        
    const session = await preference.create({
        body: {
            'items': lineItems,
            'back_urls': {
                success: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
                failure: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            },
            'auto_return': 'all',
            'notification_url': `${process.env.NEXT_MP_NOTIFICATION_URL}/api/webhook`,
        },
        requestOptions: {},
    })

    return NextResponse.json({ url: session.init_point }, {
        headers: corsHeaders
    })
}