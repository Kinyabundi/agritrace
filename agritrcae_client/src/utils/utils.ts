import { IManufacturer } from "@/types/Manufacturer";
import { IOption } from "@/types/FormControl";
import { customAlphabet } from "nanoid";
import { truncateHash } from "./truncateHash";
import { IRawMaterial } from "@/types/Contracts";
import { IBacktrace, IEntity, IProductSale } from "@/types/Transaction";
import { IDistributor } from "@/types/Distributor";

export const concatManufacturers = (
  manufacturers: IManufacturer[]
): IOption[] => {
  return manufacturers.map((manufacturer) => ({
    value: manufacturer.address,
    label: `${manufacturer.name} - ${truncateHash(manufacturer.address)}`,
  }));
};
export const concatDistributors = (distributors: IDistributor[]): IOption[] => {
  return distributors.map((distributor) => ({
    value: distributor.address,
    label: `${distributor.name} - ${truncateHash(distributor.address)}`,
  }));
};
export const concatRawMaterials = (rawMaterials: IRawMaterial[]): IOption[] => {
  return rawMaterials.map((rawMaterial) => ({
    value: rawMaterial.batchNo,
    label: `${rawMaterial.name} - ${rawMaterial.batchNo}`,
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

// Checks whether a given raw material is in tranactions

export function checkRawMaterialInTransactions(
  entities: IEntity[],
  batchNo: number
) {
  let isPresent = false;
  entities.forEach((entity) => {
    if (entity.batchNo === batchNo) {
      isPresent = true;
    }
  });
  return isPresent;
}
// Checks whether a given Product is in tranactions

export function checkProductInTransactions(
  productSale: IProductSale[],
  productCode: string
) {
  let isPresent = false;
  productSale.forEach((product) => {
    if (product.productCode === productCode) {
      isPresent = true;
    }
  });
  return isPresent;
}

// Validate the if the product status is Initiated or InProgress for a given productCode
export const validateProductStatus = (
  productSale: IProductSale[],
  productCode: string
): boolean => {
  let isValid = false;
  productSale.forEach((product) => {
    if (
      product.productCode === productCode &&
      (product.status === "Initiated" || product.status === "InProgress")
    ) {
      isValid = true;
    }
  });
  return isValid;
};

export const testFetchBackTrace = (
  products_transactions: IProductSale[],
  entity_transactions: IEntity[],
  product_serial_no: string
) => {
  // fetch product sale item using its serial no
  const productSaleItem = products_transactions.find(
    (product) => product.serialNo === product_serial_no
  );

  // get all the batch nos from the product sale
  const productProductionBatchNos = productSaleItem.batchNo;

  // get all the entities that have the same batch no as the product sale
  const entities = entity_transactions.filter((entity) =>
    productProductionBatchNos.includes(entity.batchNo)
  );

  const backtrace: IBacktrace = {
    productTransaction: productSaleItem,
    entityTransactions: entities,
  };

  return backtrace;
};
