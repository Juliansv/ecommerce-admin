"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

import { SliderColumn, columns } from "./columns";

interface SliderClientProps {
	data: SliderColumn[];
}

export const SliderClient: React.FC<SliderClientProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Slider (${data.length})`}
					description="Manage slider for you store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/sliders/new`)}
				>
					<Plus className="mr-2 h4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="label" columns={columns} data={data} />
			<Heading title="API" description="API calls for sliders" />
			<Separator />
			<ApiList entityName="sliders" entityIdName="sliderId" /> 
		</>
	);
};
