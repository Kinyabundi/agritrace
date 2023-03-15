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
        entities: Mapping<String, Entity>,
        entities_items: Vec<String>,
        products: Mapping<String, Product>,
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

        #[ink(message)]
        pub fn add_entity(
            &mut self,
            name: String,
            quantity: u64,
            quantity_unit: String,
            entity_code: String,
            batch_no: u64,
            buyer: AccountId,
        ) -> Result<()> {
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();
            let entity = Entity {
                name,
                quantity: quantity as u32,
                quantity_unit,
                entity_code: entity_code.clone(),
                timestamp,
                batch_no,
                addedby: caller,
                buyer,
            };
            if self.entities.contains(&entity_code) {
                return Err(Error::EntityAlreadyExists);
            }
            self.entities.insert(entity_code.clone(), &entity);
            self.entities_items.push(entity_code.clone());
            self.env().emit_event(EntityAdded {
                entity_code,
                name: entity.name,
            });
            Ok(())
        }

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
            let timestamp = self.env().block_timestamp();
            let product = Product {
                name,
                product_code: product_code.clone(),
                quantity,
                quantity_units,
                batch_no,
                timestamp,
                raw_materials,
                addedby: caller,
            };
            if self.products.contains(&product_code) {
                return Err(Error::ProductAlreadyExists);
            }
            self.products.insert(product_code.clone(), &product);
            self.products_items.push(product_code.clone());
            self.env().emit_event(ProductAdded {
                product_code,
                name: product.name,
            });
            Ok(())
        }
        /// get product by entity code
        #[ink(message)]
        pub fn get_entity(&self, entity_code: String) -> Option<Entity> {
            if !self.entities.contains(&entity_code) {
                return None;
            }
            Some(self.entities.get(&entity_code).unwrap())
        }

        /// get product by product code
        #[ink(message)]
        pub fn get_product(&self, product_code: String) -> Option<Product> {
            if !self.products.contains(&product_code) {
                return None;
            }
            Some(self.products.get(&product_code).unwrap())
        }

        /// Get all entities
        #[ink(message)]
        pub fn get_entities(&self) -> Vec<Entity> {
            let mut entities = Vec::new();
            for entity_code in self.entities_items.iter() {
                entities.push(self.entities.get(entity_code).unwrap());
            }
            entities
        }

        /// Get all products
        #[ink(message)]
        pub fn get_products(&self) -> Vec<Product> {
            let mut products = Vec::new();
            for product_code in self.products_items.iter() {
                products.push(self.products.get(product_code).unwrap());
            }
            products
        }
        //Get all products by added_by
        #[ink(message)]
        pub fn get_products_by_added_by(&self, added_by: AccountId) -> Vec<Product> {
            let mut products = Vec::new();
            for product_code in self.products_items.iter() {
                let product = self.products.get(product_code).unwrap();
                if product.addedby == added_by {
                    products.push(product);
                }
            }
            products
        }

        /// Get all entities by added_by
        #[ink(message)]
        pub fn get_entities_by_added_by(&self, added_by: AccountId) -> Vec<Entity> {
            let mut entities = Vec::new();
            for entity_code in self.entities_items.iter() {
                let entity = self.entities.get(entity_code).unwrap();
                if entity.addedby == added_by {
                    entities.push(entity);
                }
            }
            entities
        }

        /// Get all entities by buyer
        #[ink(message)]
        pub fn get_entities_by_buyer(&self, buyer: AccountId) -> Vec<Entity> {
            let mut entities = Vec::new();
            for entity_code in self.entities_items.iter() {
                let entity = self.entities.get(entity_code).unwrap();
                if entity.buyer == buyer {
                    entities.push(entity);
                }
            }
            entities
        }
    }
}
