#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod transactions {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Errors that might occur while calling this contract
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Transaction already exists
        TransactionAlreadyExists,
        /// Transaction does not exist
        TransactionDoesNotExist,
        /// Invalid Buyer
        InvalidBuyer,
        /// Invalid Seller
        InvalidSeller,
        /// Backtrace doesnt exist
        BacktraceDoesNotExist,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(event)]
    pub struct TransactionEvent {
        #[ink(topic)]
        entity: EntityPurchase,
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        seller: AccountId,
    }

    #[ink(event)]
    pub struct ProductTransactionEvent {
        #[ink(topic)]
        product: ProductPurchase,
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        seller: AccountId,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum TransactionStatus {
        Initiated,
        InProgress,
        Completed,
        Reverted,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum TransactionType {
        Entity,
        Product,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct EntityPurchase {
        entity_code: String,
        quantity: u32,
        quantity_unit: String,
        batch_no: u64,
        created_at: Timestamp,
        buyer: AccountId,
        seller: AccountId,
        status: TransactionStatus,
        updated_at: Timestamp,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct ProductPurchase {
        product_code: String,
        quantity: u32,
        quantity_unit: String,
        batch_no: Vec<u64>,
        created_at: Timestamp,
        buyer: AccountId,
        seller: AccountId,
        status: TransactionStatus,
        updated_at: Timestamp,
        serial_no: String,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Backtrace {
        product_transaction: ProductPurchase,
        entity_transactions: Vec<EntityPurchase>,
    }

    #[ink(storage)]
    pub struct Transactions {
        transactions: Mapping<String, EntityPurchase>,
        transaction_items: Vec<String>,
        product_transactions: Mapping<String, ProductPurchase>,
        product_items: Vec<String>,
    }

    impl Transactions {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                transactions: Mapping::new(),
                transaction_items: Vec::new(),
                product_transactions: Mapping::new(),
                product_items: Vec::new(),
            }
        }

        /// This function initiate sell of an entity by the seller to a buyer
        #[ink(message)]
        pub fn initiate_sell(
            &mut self,
            entity_code: String,
            quantity: u32,
            quantity_unit: String,
            batch_no: u64,
            buyer: AccountId,
        ) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let status = TransactionStatus::Initiated;
            let transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity,
                quantity_unit,
                batch_no,
                created_at: timestamp.clone(),
                buyer,
                seller,
                status: status.clone(),
                updated_at: timestamp.clone(),
            };
            self.transactions.insert(entity_code.clone(), &transaction);
            self.transaction_items.push(entity_code.clone());
            self.env().emit_event(TransactionEvent {
                entity: transaction,
                buyer,
                seller,
            });
            Ok(())
        }

        /// This function is for buyer actually purchasing the item
        #[ink(message)]
        pub fn purchase(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let buyer = self.env().caller();
            let transaction = self.transactions.get(&entity_code).unwrap();
            if transaction.buyer != buyer {
                return Err(Error::InvalidBuyer);
            }
            let status = TransactionStatus::InProgress;
            let transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };
            self.transactions.insert(entity_code.clone(), &transaction);
            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer,
                seller: transaction.seller,
            });
            Ok(())
        }

        /// This function is for marking the transaction as complete
        #[ink(message)]
        pub fn complete(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.transactions.get(&entity_code).unwrap();
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }
            let status = TransactionStatus::Completed;
            let transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };
            self.transactions.insert(entity_code.clone(), &transaction);
            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer: transaction.buyer,
                seller,
            });
            Ok(())
        }

        /// This function is for marking the transaction as reverted
        #[ink(message)]
        pub fn revert(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.transactions.get(&entity_code).unwrap();
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }
            let status = TransactionStatus::Reverted;
            let transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };
            self.transactions.insert(entity_code.clone(), &transaction);
            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer: transaction.buyer,
                seller,
            });
            Ok(())
        }

        /// This function returns the transaction details for a given entity code
        #[ink(message)]
        pub fn get_transaction(&self, entity_code: String) -> Result<EntityPurchase> {
            match self.transactions.get(&entity_code) {
                Some(transaction) => Ok(transaction),
                None => Err(Error::TransactionDoesNotExist),
            }
        }

        ///  This function returns all transactions for a given seller
        #[ink(message)]
        pub fn get_transactions_by_seller(&self, seller: AccountId) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.transaction_items.iter() {
                let transaction = self.transactions.get(transaction).unwrap();
                if transaction.seller == seller {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        ///  This function returns all transactions for a given buyer
        #[ink(message)]
        pub fn get_transactions_by_buyer(&self, buyer: AccountId) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.transaction_items.iter() {
                let transaction = self.transactions.get(transaction).unwrap();
                if transaction.buyer == buyer {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        /// This function returns all transactions
        #[ink(message)]
        pub fn get_all_transactions(&self) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.transaction_items.iter() {
                let transaction = self.transactions.get(transaction).unwrap();
                transactions.push(transaction);
            }
            transactions
        }

        /// This function returns all transactions for a given status by AccountId
        #[ink(message)]
        pub fn get_transactions_by_status(
            &self,
            status: TransactionStatus,
            account_id: AccountId,
        ) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.transaction_items.iter() {
                let transaction = self.transactions.get(transaction).unwrap();
                if transaction.status == status && transaction.buyer == account_id {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        /// Initiate sell of a product item
        #[ink(message)]
        pub fn sell_product(
            &mut self,
            product_code: String,
            quantity: u32,
            quantity_unit: String,
            batch_no: Vec<u64>,
            buyer: AccountId,
            serial_no: String,
        ) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let status = TransactionStatus::Initiated;
            let product_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity,
                quantity_unit: quantity_unit.clone(),
                batch_no,
                created_at: timestamp.clone(),
                buyer: buyer.clone(),
                seller: seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no,
            };

            self.product_transactions
                .insert(product_code.clone(), &product_transaction);
            self.product_items.push(product_code.clone());
            self.env().emit_event(ProductTransactionEvent {
                product: product_transaction,
                buyer,
                seller,
            });
            Ok(())
        }

        /// This function is for marking the transaction as complete
        #[ink(message)]
        pub fn complete_product(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let product_transaction = self.product_transactions.get(&product_code).unwrap();
            if product_transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }
            let status = TransactionStatus::Completed;
            let product_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: product_transaction.quantity,
                quantity_unit: product_transaction.quantity_unit.clone(),
                batch_no: product_transaction.batch_no,
                created_at: product_transaction.created_at.clone(),
                buyer: product_transaction.buyer.clone(),
                seller: product_transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: product_transaction.serial_no.clone(),
            };
            self.product_transactions
                .insert(product_code.clone(), &product_transaction);
            self.env().emit_event(ProductTransactionEvent {
                product: product_transaction.clone(),
                buyer: product_transaction.buyer,
                seller,
            });
            Ok(())
        }

        /// This function is for marking the transaction as reverted
        #[ink(message)]
        pub fn revert_product(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let product_transaction = self.product_transactions.get(&product_code).unwrap();
            if product_transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }
            let status = TransactionStatus::Reverted;
            let product_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: product_transaction.quantity,
                quantity_unit: product_transaction.quantity_unit.clone(),
                batch_no: product_transaction.batch_no,
                created_at: product_transaction.created_at.clone(),
                buyer: product_transaction.buyer.clone(),
                seller: product_transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: product_transaction.serial_no.clone(),
            };
            self.product_transactions
                .insert(product_code.clone(), &product_transaction);
            self.env().emit_event(ProductTransactionEvent {
                product: product_transaction.clone(),
                buyer: product_transaction.buyer,
                seller,
            });
            Ok(())
        }

        /// This function returns the transaction details for a given product code
        #[ink(message)]
        pub fn get_product_transaction(&self, product_code: String) -> Result<ProductPurchase> {
            match self.product_transactions.get(&product_code) {
                Some(transaction) => Ok(transaction),
                None => Err(Error::TransactionDoesNotExist),
            }
        }

        /// This function returns all transactions for a given seller
        #[ink(message)]
        pub fn get_product_transactions_by_seller(
            &self,
            seller: AccountId,
        ) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.product_items.iter() {
                let transaction = self.product_transactions.get(transaction).unwrap();
                if transaction.seller == seller {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        ///  This function returns all transactions for a given buyer
        #[ink(message)]
        pub fn get_product_transactions_by_buyer(&self, buyer: AccountId) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.product_items.iter() {
                let transaction = self.product_transactions.get(transaction).unwrap();
                if transaction.buyer == buyer {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        /// This function returns all transactions
        #[ink(message)]
        pub fn get_all_product_transactions(&self) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.product_items.iter() {
                let transaction = self.product_transactions.get(transaction).unwrap();
                transactions.push(transaction);
            }
            transactions
        }

        /// This function returns all transactions for a given status by AccountId
        #[ink(message)]
        pub fn get_product_transactions_by_status(
            &self,
            status: TransactionStatus,
            account_id: AccountId,
        ) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for transaction in self.product_items.iter() {
                let transaction = self.product_transactions.get(transaction).unwrap();
                if transaction.status == status && transaction.buyer == account_id {
                    transactions.push(transaction);
                }
            }
            transactions
        }

        /// This function performs backtracing by use of product code.
        /// This by using serial_no and after retriving the product check the batch nos to determine the entities used for production
        #[ink(message)]
        pub fn get_product_backtrace(&self, serial_no: String) -> Result<Backtrace> {
            let mut transactions = Vec::new();
            // get production by serial no
            for transaction in self.product_items.iter() {
                let transaction = self.product_transactions.get(transaction).unwrap();
                if transaction.serial_no == serial_no {
                    transactions.push(transaction);
                }
            }

            // just get one item transaction
            let transaction = transactions.get(0).unwrap();

            // get all the production batches in the transaction
            let batch_nos = transaction.batch_no.to_vec();

            // entity transactions
            let mut entity_transactions = Vec::new();

            // get all entities with the batch no
            for batch_no in batch_nos.iter() {
                // get production by batch no
                for transaction in self.product_items.iter() {
                    let transaction = self.transactions.get(transaction).unwrap();
                    if transaction.batch_no == *batch_no {
                        entity_transactions.push(transaction);
                    }
                }
            }

            // encapsulate all that info
            let backtrace = Backtrace {
                product_transaction: transaction.clone(),
                entity_transactions,
            };
            // check if the backtrace is empty
            if backtrace.entity_transactions.is_empty() {
                return Err(Error::BacktraceDoesNotExist);
            } else {
                Ok(backtrace)
            }
        }
    }
}
