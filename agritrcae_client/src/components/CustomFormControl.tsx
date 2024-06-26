import { FC } from "react";
import {
  CustomFormMultiSelectProps,
  ICustomFormControl,
  IOption,
} from "@/types/FormControl";
import TextLink from "./TextLink";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Textarea,
  Select as ChakraSelect,
  Button,
} from "@chakra-ui/react";

import Select from "react-select";

import makeAnimated from "react-select/animated";

const animatedComponent = makeAnimated();

const CustomFormControl: FC<ICustomFormControl> = ({
  as,
  labelText,
  placeholder,
  value,
  setValue,
  inputType = "text",
  isDisabled = false,
  variant = "input",
  addRightLeftElement = false,
  rightElementText = "",
  rightElementLink = "/",
  options,
  colSpan,
  onChange,
}) => {
  const LinkText = () => (
    <TextLink
      fontSize={"xs"}
      color={"blue.600"}
      target={"_blank"}
      href={rightElementLink}
    >
      {rightElementText}
    </TextLink>
  );
  return (
    <FormControl py={3} as={as} colSpan={colSpan}>
      <FormLabel display="flex" ms="4px" fontSize="md" fontWeight="semibold">
        {labelText}
      </FormLabel>
      {variant === "input" && (
        <InputGroup>
          <Input
            fontSize="sm"
            placeholder={placeholder}
            fontWeight="500"
            size="md"
            focusBorderColor="navyblue"
            type={inputType}
            disabled={isDisabled}
            borderRadius={25}
            borderColor={"gray.300"}
            borderWidth={1}
            _focus={{
              borderColor: "gray.100",
              borderWidth: 1,
            }}
            value={value}
            onChange={(e) =>
              !onChange && !setValue
                ? () => {}
                : onChange
                ? onChange(e)
                : setValue
                ? setValue(e.target.value)
                : () => {}
            }
          />
          {addRightLeftElement && (
            <InputRightElement>
              <LinkText />
            </InputRightElement>
          )}
        </InputGroup>
      )}

      {variant === "textarea" && (
        <Textarea
          fontSize="sm"
          placeholder={placeholder}
          fontWeight="500"
          size="lg"
          borderColor={"gray.300"}
          borderWidth={1}
          focusBorderColor="gray.400"
          borderRadius={25}
          disabled={isDisabled}
          value={value as string}
          onChange={(e) =>
            onChange
              ? onChange(e)
              : setValue
              ? setValue(e.target.value)
              : () => {}
          }
          rows={7}
        />
      )}

      {variant === "select" && (
        <ChakraSelect
          size="md"
          placeholder="Choose ..."
          borderRadius={25}
          borderColor={"gray.300"}
          borderWidth={1}
          focusBorderColor="gray.400"
          disabled={isDisabled}
          value={value}
          onChange={(e) =>
            onChange
              ? onChange(e)
              : setValue
              ? setValue(e.target.value)
              : () => {}
          }
        >
          {/* Check If Options is of type IOption[] or string[] */}
          {options &&
            // @ts-ignore
            (options[0] as IOption)?.label &&
            (options as IOption[]).map((option: IOption) => (
              // @ts-ignore
              <option key={option?.value} value={option?.value}>
                {/* @ts-ignore */}
                {option?.label}
              </option>
            ))}
          {options &&
            // @ts-ignore
            !(options[0] as IOption)?.label &&
            // @ts-ignore
            (options as string[]).map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </ChakraSelect>
      )}
    </FormControl>
  );
};

export const CustomFormMultiSelect = ({
  as,
  colSpan,
  options,
  label,
  placeholder,
  onChange,
  formLabel,
  value,
  defaultValue,
}: CustomFormMultiSelectProps) => {
  return (
    <FormControl as={as} colSpan={colSpan} py={3} w="full">
      <FormLabel display="flex" ms="4px" fontSize="md" fontWeight="semibold">
        {formLabel}
      </FormLabel>
      <Select
        // defaultValue={value}
        value={value}
        isMulti
        name={label}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        components={animatedComponent}
        placeholder={placeholder}
        onChange={onChange}
      />
    </FormControl>
  );
};

export default CustomFormControl;
