import React, { ReactNode } from "react";

export interface IOption = {
  value: string;
  label: string;
}

export interface ICustomFormControl {
  as?: any;
  colSpan?: any;
  labelText: string;
  placeholder?: string;
  inputType?: string;
  isDisabled?: boolean;
  value?: string | number;
  setValue?: (value: string) => void;
  variant?: "input" | "select" | "textarea";
  options?: string[] | IOption[];
  addRightLeftElement?: boolean;
  rightElementText?: string;
  rightElementLink?: string;
  rightElement?: ReactNode;
  onClickRightElement?: () => {};
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}
