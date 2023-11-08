import { IProduct } from "@/types";
import mercadopago from "mercadopago";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextApiRequest, NextApiResponse } from "next";

const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_MP_ACCESS_TOKEN!, options: { timeout: 5000, idempotencyKey: 'abc' } })


// preference.create({
//     'items': []
// })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const product: IProduct = req.body.product

        const URL = 'http://localhost:3000' // URL to redirect to

        const notifyURL = 'http://localhost:3001/api/cda07a09-a8d6-49db-acef-9401fd8da327/notify'
        
        const preference = new Preference(client)
        
        preference.create({
            body: {
                'items': [
                    {
                        'id': '1',
                        'title': 'test',
                        'description': 'dummy description',
                        'unit_price': 100,
                        'picture_url': '',
                        'quantity': 1,
                    }
                ],
            },
            requestOptions: {},
        }).then((preferenceResponse) => res.status(200).send({ url: preferenceResponse.init_point}))
        .catch((e) => console.log('Error creating preference', e));
    } else {
        res.status(400).json({ message: "Method not allowed" })
    }
}