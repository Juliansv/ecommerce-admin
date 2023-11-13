export type MercadoPagoItems = {
    id: string;
    title: string;
    description?: string | undefined;
    picture_url?: string | undefined;
    category_id?: string | undefined;
    quantity: number;
    currency_id?: string | undefined;
    unit_price: number;
}