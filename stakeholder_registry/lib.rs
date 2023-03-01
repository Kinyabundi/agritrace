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
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(event)]
    pub struct ManufacturerAdded {
        #[ink(topic)]
        manufacturer: AccountId,
    }

    #[ink(event)]
    pub struct SupplierAdded {
        #[ink(topic)]
        manufacturer: AccountId,
        #[ink(topic)]
        supplier: AccountId,
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
                suppliers: None,
            }
        }
    }

    #[ink(storage)]
    pub struct StakeholderRegistry {
        manufacturers: Mapping<AccountId, Manufacturer>,
        manufacturers_accounts: Vec<AccountId>,
    }

    impl StakeholderRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                manufacturers: Mapping::new(),
                manufacturers_accounts: Vec::new(),
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
            };

            if self.manufacturers.contains(&address) {
                self.env().emit_event(ManufacturerAdded {
                    manufacturer: address,
                });
            } else {
                self.manufacturers_accounts.push(address);
                self.manufacturers.insert(address, &manufacturer);
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

        /// Join as Supplier when they accept the join link when they connect their wallet
        /// address belongs to manufacturer
        ///
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
                self.env().emit_event(SupplierAdded {
                    manufacturer: address,
                    supplier: caller,
                });
                Ok(())
            } else {
                Err(Error::ManufacturerDoesNotExist)
            }
        }
    }
}
