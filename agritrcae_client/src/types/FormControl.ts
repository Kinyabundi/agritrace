import React from "react";

export interface ICustomFormControl {
	as?: any;
	colSpan?: any;
	labelText: string;
	placeholder?: string;
	inputType?: string;
	isDisabled?: boolean;
	value?: string | number
	setValue?: (value: string) => void;
	variant?: "input" | "select" | "textarea";
	options?: string[];
	addRightLeftElement?: boolean;
	rightElementText?: string;
	rightElementLink?: string;
	onChange?: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => void;
}