import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { sliderId: string } }
) {
	try {
		if (!params.sliderId) {
			return new NextResponse("Slider id is required", { status: 400 });
		}

		const slider = await prismadb.slider.findUnique({
			where: {
				id: params.sliderId,
			},
		});

		return NextResponse.json(slider);
	} catch (error) {
		console.log("[SLIDER_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; sliderId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { label, imageUrl } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 400 });
		}

		if (!label) {
			return new NextResponse("Label is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("Image is required", { status: 400 });
		}

		if (!params.sliderId) {
			return new NextResponse("Slider id is required", { status: 400 });
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

		const slider = await prismadb.slider.updateMany({
			where: {
				id: params.sliderId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		return NextResponse.json(slider);
	} catch (error) {
		console.log("[SLIDER_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; sliderId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 400 });
		}

		if (!params.sliderId) {
			return new NextResponse("Slider id is required", { status: 400 });
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

		const slider = await prismadb.slider.deleteMany({
			where: {
				id: params.sliderId,
			},
		});

		return NextResponse.json(slider);
	} catch (error) {
		console.log("[SLIDER_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
