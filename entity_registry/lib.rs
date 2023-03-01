#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod entity_registry {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Errors that might occur while calling this contract
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// The entity already exists
        EntityAlreadyExists,
        /// The entity does not exist
        EntityDoesNotExist,
        /// The product already exists
        ProductAlreadyExists,
        /// The product does not exist
        ProductDoesNotExist,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(event)]
    pub struct EntityAdded {
        #[ink(topic)]
        entity_code: String,
        #[ink(topic)]
        name: String,
    }

    #[ink(event)]
    pub struct ProductAdded {
        #[ink(topic)]
        product_code: String,
        #[ink(topic)]
        name: String,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Entity {
        name: String,
        quantity: u32,
        quantity_unit: String,
        entity_code: String,
        timestamp: Timestamp,
        batch_no: u64,
        addedby: AccountId,
        buyer: AccountId,
    }
    impl Default for Entity {
        fn default() -> Self {
            Self {
                name: String::from(""),
                quantity: 0,
                quantity_unit: String::from(""),
                entity_code: String::from(""),
                timestamp: Timestamp::default(),
                batch_no: 0,
                addedby: AccountId::from([0x0; 32]),
                buyer: AccountId::from([0x0; 32]),
            }
        }
    }
    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Product {
        name: String,
        product_code: String,
        quantity: u64,
        quantity_units: String,
        batch_no: u64,
        timestamp: Timestamp,
        raw_materials: Vec<u64>,
        addedby: AccountId,
    }

    impl Default for Product {
        fn default() -> Self {
            Self {
                name: String::from(""),
                product_code: String::from(""),
                quantity: 0,
                quantity_units: String::from(""),
                batch_no: 0,
                timestamp: Timestamp::default(),
                raw_materials: Vec::new(),
                addedby: AccountId::from([0x0; 32]),
            }
        }
    }

    #[ink(storage)]
    pub struct EntityRegistry {
        entities: Mapping<(String, AccountId), Entity>,
        entities_items: Vec<String>,
        products: Mapping<(String, AccountId), Product>,
        products_items: Vec<String>,
    }

    impl EntityRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                entities: Mapping::new(),
                entities_items: Vec::new(),
                products: Mapping::new(),
                products_items: Vec::new(),
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new()
        }

        /// This fn adds new entity to the supply chain
        #[ink(message)]
        pub fn add_entity(
            &mut self,
            name: String,
            quantity: u32,
            quantity_unit: String,
            entity_code: String,
            batch_no: u64,
            buyer: AccountId,
        ) -> Result<()> {
            let caller = self.env().caller();
            let entity = Entity {
                name,
                quantity,
                quantity_unit,
                entity_code: entity_code.clone(),
                batch_no,
                timestamp: self.env().block_timestamp(),
                buyer,
                addedby: caller,
            };

            if self.entities.contains(&(entity_code.clone(), caller)) {
                return Err(Error::EntityAlreadyExists);
            }

            self.entities.insert((entity_code.clone(), caller), &entity);
            self.entities_items.push(entity_code.clone());

            self.env().emit_event(EntityAdded {
                entity_code,
                name: entity.name,
            });

            Ok(())
        }

        /// This fn returns the entity details
        #[ink(message)]
        pub fn get_entity(&self, entity_code: String, caller: AccountId) -> Result<Entity> {
            let entity = self
                .entities
                .get(&(entity_code.clone(), caller))
                .ok_or(Error::EntityDoesNotExist)?;
            Ok(entity)
        }

        /// Get all entities belonging to a given owner
        #[ink(message)]
        pub fn get_entities(&self, owner_address: AccountId) -> Result<Vec<Entity>> {
            let mut entities = Vec::new();
            for entity_code in self.entities_items.iter() {
                let entity = self
                    .entities
                    .get(&(entity_code.clone(), owner_address))
                    .ok_or(Error::EntityDoesNotExist)?;
                entities.push(entity);
            }
            Ok(entities)
        }

        /// This fn adds new product to the supply chain
        #[ink(message)]
        pub fn add_product(
            &mut self,
            name: String,
            product_code: String,
            quantity: u64,
            quantity_units: String,
            batch_no: u64,
            raw_materials: Vec<u64>,
        ) -> Result<()> {
            let caller = self.env().caller();
            let product = Product {
                name,
                product_code: product_code.clone(),
                quantity,
                quantity_units,
                batch_no,
                timestamp: self.env().block_timestamp(),
                raw_materials,
                addedby: caller,
            };

            if self.products.contains(&(product_code.clone(), caller)) {
                return Err(Error::ProductAlreadyExists);
            }

            self.products
                .insert((product_code.clone(), caller), &product);
            self.products_items.push(product_code.clone());

            self.env().emit_event(ProductAdded {
                product_code,
                name: product.name,
            });

            Ok(())
        }

        /// This fn returns the product details
        #[ink(message)]
        pub fn get_product(&self, product_code: String, caller: AccountId) -> Result<Product> {
            let product = self
                .products
                .get(&(product_code.clone(), caller))
                .ok_or(Error::ProductDoesNotExist)?;
            Ok(product)
        }

        /// Get all products belonging to a given owner
        #[ink(message)]
        pub fn get_products(&self, owner_address: AccountId) -> Result<Vec<Product>> {
            let mut products = Vec::new();
            for product_code in self.products_items.iter() {
                let product = self
                    .products
                    .get(&(product_code.clone(), owner_address))
                    .ok_or(Error::ProductDoesNotExist)?;
                products.push(product);
            }
            Ok(products)
        }

        /// This fn gets all entities belonging to a given buyer
        #[ink(message)]
        pub fn get_entities_by_buyer(
            &self,
            buyer: AccountId,
            owner_address: AccountId,
        ) -> Result<Vec<Entity>> {
            let mut entities = Vec::new();
            for entity_code in self.entities_items.iter() {
                let entity = self
                    .entities
                    .get(&(entity_code.clone(), owner_address))
                    .ok_or(Error::EntityDoesNotExist)?;
                if entity.buyer == buyer {
                    entities.push(entity);
                }
            }
            Ok(entities)
        }
    }
}
