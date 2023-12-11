import {format} from "date-fns"

import prismadb from "@/lib/prismadb";
import { SliderClient } from "./components/client";
import { SliderColumn } from "./components/columns";

const SliderPage = async ({ params }: { params: { storeId: string } }) => {
	const sliders = await prismadb.slider.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formattedSliders: SliderColumn[] = sliders.map((item) => ({
		id: item.id,
		label: item.label,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SliderClient data={formattedSliders} />
			</div>
		</div>
	);
};

export default SliderPage;
