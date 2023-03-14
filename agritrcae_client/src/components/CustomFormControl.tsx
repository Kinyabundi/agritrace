import { FC } from "react";
import { ICustomFormControl, IOption } from "@/types/FormControl";
import TextLink from "./TextLink";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Textarea,
  Select,
  Button,
} from "@chakra-ui/react";

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
        <Select
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
        </Select>
      )}
    </FormControl>
  );
};

const BtnRight = ({ text }: { text: string }) => {
  return (
    <Button
      variant="solid"
      colorScheme="teal"
      size="sm"
      borderRadius={25}
      px={5}
      py={2}
      fontSize="sm"
      fontWeight="500"
    >
      {text}
    </Button>
  );
};

export default CustomFormControl;
