import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { label, imageUrl } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!label) {
			return new NextResponse("label is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("image is required", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const slider = await prismadb.slider.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(slider);
	} catch (error) {
		console.log("[SLIDER_POST", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const sliders = await prismadb.slider.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(sliders);
	} catch (error) {
		console.log("[SLIDER_GET", error);
		return new NextResponse("internal error", { status: 500 });
	}
}
