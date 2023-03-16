#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod stakeholder_registry {

    use ink::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    /// Errors that might occur while calling this contract
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Manufacturer already exists
        ManufacturerAlreadyExists,
        /// Manufacturer does not exist
        ManufacturerDoesNotExist,
        /// Supplier already exists
        SupplierAlreadyExists,
        ///supplier does not exists
        SupplierDoesNotExist,
        /// Distributor already exists
        DistributorAlreadyExists,
        /// Distributor does not exist
        DistributorDoesNotExist,
        /// error thrown whenever account id used already exists as Supplier
        AccountIdAlreadyExistsAsSupplier,
        /// error thrown whenever account id used already exists as Manufacturer
        AccountIdAlreadyExistsAsManufacturer,
        /// error thrown whenever account id used already exists as Distributor
        AccountIdAlreadyExistsAsDistributor,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum Role {
        Manufacturer,
        Supplier,
        Retailer,
        Distributor,
    }

    #[ink(event)]
    pub struct ManufacturerAdded {
        #[ink(topic)]
        manufacturer: AccountId,
    }

    #[ink(event)]
    pub struct SupplierAdded {
        #[ink(topic)]
        supplier: AccountId,
    }

    #[ink(event)]
    pub struct DistributorAdded {
        #[ink(topic)]
        distributor: AccountId,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Manufacturer {
        name: String,
        corporate_no: String,
        phone_nos: Vec<String>,
        products: Vec<String>,
        location: String,
        address: AccountId,
        timestamp: Timestamp,
        role: Role,
        suppliers: Option<Vec<AccountId>>,
    }

    impl Default for Manufacturer {
        fn default() -> Self {
            Self {
                name: String::from(""),
                corporate_no: String::from(""),
                phone_nos: Vec::new(),
                products: Vec::new(),
                location: String::from(""),
                address: AccountId::from([0x0; 32]),
                timestamp: Timestamp::default(),
                role: Role::Manufacturer,
                suppliers: None,
            }
        }
    }
    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Supplier {
        name: String,
        phone_no: String,
        email: String,
        raw_materials: Option<Vec<String>>,
        address: AccountId,
        timestamp: Timestamp,
        role: Role,
        location: String,
    }

    impl Default for Supplier {
        fn default() -> Self {
            Self {
                name: String::from(""),
                phone_no: String::from(""),
                email: String::from(""),
                raw_materials: None,
                address: AccountId::from([0x0; 32]),
                timestamp: Timestamp::default(),
                role: Role::Supplier,
                location: String::from(""),
            }
        }
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Distributor {
        name: String,
        phone_no: String,
        email: String,
        address: AccountId,
        timestamp: Timestamp,
        role: Role,
        location: String,
    }

    impl Default for Distributor {
        fn default() -> Self {
            Self {
                name: String::from(""),
                phone_no: String::from(""),
                email: String::from(""),
                address: AccountId::from([0x0; 32]),
                timestamp: Timestamp::default(),
                role: Role::Distributor,
                location: String::from(""),
            }
        }
    }

    #[ink(storage)]
    pub struct StakeholderRegistry {
        manufacturers: Mapping<AccountId, Manufacturer>,
        manufacturers_accounts: Vec<AccountId>,
        suppliers: Mapping<AccountId, Supplier>,
        suppliers_accounts: Vec<AccountId>,
        distributors: Mapping<AccountId, Distributor>,
        distributors_accounts: Vec<AccountId>,
    }

    impl StakeholderRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                manufacturers: Mapping::new(),
                manufacturers_accounts: Vec::new(),
                suppliers: Mapping::new(),
                suppliers_accounts: Vec::new(),
                distributors: Mapping::new(),
                distributors_accounts: Vec::new(),
            }
        }

        /// Onboards manufacturer
        #[ink(message)]
        pub fn add_manufacturer(
            &mut self,
            name: String,
            corporate_no: String,
            phone_nos: Vec<String>,
            products: Vec<String>,
            location: String,
        ) -> Result<()> {
            let address = self.env().caller();
            let manufacturer = Manufacturer {
                name,
                corporate_no,
                phone_nos,
                products,
                location,
                address: self.env().caller(),
                timestamp: self.env().block_timestamp(),
                suppliers: None,
                role: Role::Manufacturer,
            };

            if self.manufacturers.contains(&address) {
                return Err(Error::ManufacturerAlreadyExists);
            } else {
                // check if the account exists as supplier
                if self.suppliers.contains(&address) {
                    return Err(Error::AccountIdAlreadyExistsAsSupplier);
                }
                self.manufacturers_accounts.push(address);
                self.manufacturers.insert(address, &manufacturer);
                self.env().emit_event(ManufacturerAdded {
                    manufacturer: address,
                });
            }

            Ok(())
        }

        /// Returns manufacturer
        #[ink(message)]
        pub fn get_manufacturer(&self, address: AccountId) -> Result<Manufacturer> {
            if self.manufacturers.contains(&address) {
                Ok(self.manufacturers.get(&address).unwrap())
            } else {
                Err(Error::ManufacturerDoesNotExist)
            }
        }

        /// Returns all manufacturers
        #[ink(message)]
        pub fn get_manufacturers(&self) -> Vec<Manufacturer> {
            let mut manufacturers = Vec::new();
            for address in self.manufacturers_accounts.iter() {
                manufacturers.push(self.manufacturers.get(address).unwrap());
            }
            manufacturers
        }

        //save supplier
        #[ink(message)]
        pub fn save_supplier(
            &mut self,
            name: String,
            phone_no: String,
            email: String,
            location: String,
        ) -> Result<()> {
            let address = self.env().caller();
            let supplier = Supplier {
                name,
                phone_no,
                email,
                raw_materials: None,
                address: self.env().caller(),
                timestamp: self.env().block_timestamp(),
                role: Role::Supplier,
                location,
            };
            if self.suppliers.contains(&address) {
                return Err(Error::SupplierAlreadyExists);
            } else {
                // check if the account exists as manufacturer
                if self.manufacturers.contains(&address) {
                    return Err(Error::ManufacturerAlreadyExists);
                }
                self.suppliers_accounts.push(address);
                self.suppliers.insert(address, &supplier);
                self.env().emit_event(SupplierAdded { supplier: address });
            }
            Ok(())
        }
        /// Join as Supplier when they accept the join link when they connect their wallet
        /// address belongs to manufacturer

        #[ink(message)]
        pub fn join_as_supplier(&mut self, address: AccountId) -> Result<()> {
            let caller = self.env().caller();
            if self.manufacturers.contains(&address) {
                let mut manufacturer = self.manufacturers.get(&address).unwrap();
                if manufacturer.suppliers.is_none() {
                    manufacturer.suppliers = Some(Vec::new());
                }
                let suppliers = manufacturer.suppliers.as_mut().unwrap();
                // Validate if supplier already exists
                if suppliers.contains(&caller) {
                    return Err(Error::SupplierAlreadyExists);
                }
                suppliers.push(caller);
                self.manufacturers.insert(address, &manufacturer);
                self.env().emit_event(SupplierAdded { supplier: caller });
                Ok(())
            } else {
                Err(Error::ManufacturerDoesNotExist)
            }
        }

        /// This fn gets the connected wallet and retrieves its data
        #[ink(message)]
        pub fn get_supplier(&self, address: AccountId) -> Result<Supplier> {
            if self.suppliers.contains(&address) {
                Ok(self.suppliers.get(&address).unwrap())
            } else {
                Err(Error::SupplierDoesNotExist)
            }
        }

        /// Returns all suppliers
        #[ink(message)]
        pub fn get_suppliers(&self) -> Vec<Supplier> {
            let mut suppliers = Vec::new();
            for address in self.suppliers_accounts.iter() {
                suppliers.push(self.suppliers.get(address).unwrap());
            }
            suppliers
        }

        /// Adds new distributor
        #[ink(message)]
        pub fn add_distributor(
            &mut self,
            name: String,
            phone_no: String,
            email: String,
            location: String,
        ) -> Result<()> {
            let address = self.env().caller();
            let distributor = Distributor {
                name,
                phone_no,
                email,
                address: self.env().caller(),
                timestamp: self.env().block_timestamp(),
                role: Role::Distributor,
                location,
            };
            if self.distributors.contains(&address) {
                return Err(Error::DistributorAlreadyExists);
            } else {
                self.distributors_accounts.push(address);
                self.distributors.insert(address, &distributor);
                self.env().emit_event(DistributorAdded {
                    distributor: address,
                });
            }
            Ok(())
        }

        /// Returns distributor
        #[ink(message)]
        pub fn get_distributor(&self, address: AccountId) -> Result<Distributor> {
            if self.distributors.contains(&address) {
                Ok(self.distributors.get(&address).unwrap())
            } else {
                Err(Error::DistributorDoesNotExist)
            }
        }

        /// Returns all distributors
        #[ink(message)]
        pub fn get_distributors(&self) -> Vec<Distributor> {
            let mut distributors = Vec::new();
            for address in self.distributors_accounts.iter() {
                distributors.push(self.distributors.get(address).unwrap());
            }
            distributors
        }
    }
}
