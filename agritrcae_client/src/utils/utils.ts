import { IManufacturer } from "@/types/Manufacturer";
import { IOption } from "@/types/FormControl";
import { customAlphabet } from "nanoid";
import { truncateHash } from "./truncateHash";

export const concatManufacturers = (
  manufacturers: IManufacturer[]
): IOption[] => {
  return manufacturers.map((manufacturer) => ({
    value: manufacturer.address,
    label: `${manufacturer.name} - ${truncateHash(manufacturer.address)}`,
  }));
};

/**
 * Generates Unique numbers using nanoid
 */

export const generateNumbers = (size: number = 14): number => {
  const nanoid = customAlphabet("1234567890", size);
  return parseInt(nanoid());
};

function is(obj: any, type: NumberConstructor): obj is number;
function is(obj: any, type: StringConstructor): obj is string;
function is<T>(obj: any, type: { prototype: T }): obj is T;
function is(obj: any, type: any): boolean {
  const objType: string = typeof obj;
  const typeString = type.toString();
  const nameRegex: RegExp =
    /Arguments|Function|String|Number|Date|Array|Boolean|RegExp/;

  let typeName: string;

  if (obj && objType === "object") {
    return obj instanceof type;
  }

  if (typeString.startsWith("class ")) {
    return type.name.toLowerCase() === objType;
  }

  typeName = typeString.match(nameRegex);
  if (typeName) {
    return typeName[0].toLowerCase() === objType;
  }

  return false;
}

export function checkTypeArray(myArray: any[], type: any): boolean {
  return myArray.every((item) => {
    return is(item, type);
  });
}
