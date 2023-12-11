"use client";

import * as z from "zod";

import { useState } from "react";
import { Slider } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const fromSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

type SliderFormValues = z.infer<typeof fromSchema>;

interface SliderFormProps {
	initialData: Slider | null;
}

const SliderForm: React.FC<SliderFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit slider" : "Create slider";
	const description = initialData ? "Edit a slider" : "Add a new slider";
	const toastMessage = initialData ? "Slider updated" : "Slider created";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<SliderFormValues>({
		resolver: zodResolver(fromSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	const onSubmit = async (data: SliderFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/sliders/${params.sliderId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/sliders`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/sliders`)
			toast.success(toastMessage);
		} catch (error) {
			toast.error("something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/sliders/${params.sliderId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/sliders`);
			toast.success("Slider deleted");
		} catch (error) {
			toast.error(
				"Make sure you removed all categories using this something first"
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Slider label"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default SliderForm;
