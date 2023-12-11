import prismadb from "@/lib/prismadb";
import SliderForm from "./components/slider-form";

const SliderPage = async ({
	params,
}: {
	params: { sliderId: string };
}) => {
	const slider = await prismadb.slider.findUnique({
		where: {
			id: params.sliderId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
                <SliderForm initialData={slider} />
            </div>
		</div>
	);
};

export default SliderPage;
