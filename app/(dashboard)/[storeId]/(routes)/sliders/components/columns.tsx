"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-actions";

export type SliderColumn = {
	id: string;
	label: string;
	createdAt: string;
};

export const columns: ColumnDef<SliderColumn>[] = [
	{
		accessorKey: "label",
		header: "Label",
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
