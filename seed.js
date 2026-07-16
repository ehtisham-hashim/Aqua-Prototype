const fs = require('fs');
const path = require('path');
const db = require('./db');

// Create directories for both companies
const dataDir = path.join(__dirname, 'data');
const companies = ['aquasphere', 'badana'];

companies.forEach(company => {
  const compDir = path.join(dataDir, company);
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }
});

const items = [
  { id: 1, name: "Sodium", category: "raw_material", unit: "kg", reorderLevel: 3 },
  { id: 2, name: "Calcium", category: "raw_material", unit: "kg", reorderLevel: 10 },
  { id: 3, name: "Magnesium", category: "raw_material", unit: "kg", reorderLevel: 5 },
  { id: 4, name: "1.5L Empty", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
  { id: 5, name: "0.5L Empty", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
  { id: 6, name: "1.5L Labels", category: "raw_material", unit: "kg", reorderLevel: 15 },
  { id: 7, name: "0.5L Labels", category: "raw_material", unit: "kg", reorderLevel: 10 },
  { id: 8, name: "Shrink Wrap", category: "raw_material", unit: "kg", reorderLevel: 10 },
  { id: 9, name: "Small Caps", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
  { id: 10, name: "Large Caps", category: "raw_material", unit: "pcs", reorderLevel: 500 },
  { id: 11, name: "19L Empty", category: "raw_material", unit: "pcs", reorderLevel: 50 },
  { id: 12, name: "Mineral Sets", category: "raw_material", unit: "set", reorderLevel: 0 },
  { id: 13, name: "1.5L PET Pack", category: "finished_good", unit: "pcs", reorderLevel: 0 },
  { id: 14, name: "0.5L PET Pack", category: "finished_good", unit: "pcs", reorderLevel: 0 }
];

const inventory_transactions = [
  { id: 1, itemId: 1, direction: "IN", qty: 10, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 2, itemId: 2, direction: "IN", qty: 30, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 3, itemId: 3, direction: "IN", qty: 15, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 4, itemId: 4, direction: "IN", qty: 6000, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 5, itemId: 5, direction: "IN", qty: 6000, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 6, itemId: 6, direction: "IN", qty: 20, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 7, itemId: 7, direction: "IN", qty: 15, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 8, itemId: 8, direction: "IN", qty: 20, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 9, itemId: 9, direction: "IN", qty: 6000, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 10, itemId: 10, direction: "IN", qty: 500, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 11, itemId: 11, direction: "IN", qty: 100, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 12, itemId: 12, direction: "IN", qty: 10, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 13, itemId: 13, direction: "IN", qty: 100, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" },
  { id: 14, itemId: 14, direction: "IN", qty: 100, refType: "adjustment", refId: "seed_initial", createdAt: "2026-07-16T15:21:46+05:00" }
];

const bottle_transactions = [
  {
    id: 1,
    customerId: null,
    txnType: "purchased_new",
    qty: 100,
    refDeliveryId: null,
    note: "Initial factory bottles",
    createdAt: "2026-07-16T15:21:46+05:00"
  }
];

const customers = [
  {
    id: 1,
    phone: "+923001234567",
    name: "Ali Khan",
    address: "House 123, Street 5, F-10, Islamabad",
    mapsLocation: "https://maps.google.com/?q=33.6844,73.0479",
    homePictureUrl: "/images/customers/ali_khan.jpg",
    customerType: "Home",
    creditLimit: 5000,
    creditDuration: 30,
    defaultPrice: null,
    remarks: "Likes quick delivery"
  },
  {
    id: 2,
    phone: "+925111172867",
    name: "Savory Foods",
    address: "Plot 14, Blue Area, Islamabad",
    mapsLocation: "https://maps.google.com/?q=33.7123,73.0567",
    homePictureUrl: "/images/customers/savory.jpg",
    customerType: "Restaurant",
    creditLimit: 15000,
    creditDuration: 30,
    defaultPrice: null,
    remarks: "Deliver in morning only"
  },
  {
    id: 3,
    phone: "+923339876543",
    name: "Khyber Store",
    address: "Shop 4, G-9 Markaz, Islamabad",
    mapsLocation: "https://maps.google.com/?q=33.6901,73.0234",
    homePictureUrl: "/images/customers/khyber_store.jpg",
    customerType: "Shop",
    creditLimit: 0,
    creditDuration: 30,
    defaultPrice: null,
    remarks: "Distributor price option"
  }
];

const vendors = [
  {
    id: 1,
    name: "Standard Caps Co",
    phone: "+923009998877",
    remarks: "Standard supplier"
  }
];

// Seed databases for both companies
companies.forEach(company => {
  db.write(company, 'items', items);
  db.write(company, 'inventory_transactions', inventory_transactions);
  db.write(company, 'bottle_transactions', bottle_transactions);
  db.write(company, 'customers', customers);
  db.write(company, 'vendors', vendors);
  db.write(company, 'orders', []);
  db.write(company, 'deliveries', []);
  db.write(company, 'payments', []);
  db.write(company, 'production_batches', []);
  db.write(company, 'purchases', []);
  db.write(company, 'vendor_payments', []);
  db.write(company, 'expenses', []);
  db.write(company, 'daily_closings', []);
});

console.log("Database seeded successfully.");
