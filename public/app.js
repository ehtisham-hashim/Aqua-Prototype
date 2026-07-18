/* ==========================================
   AQUA SPHERE OS - CORE CLIENT APPLICATION LOGIC
   Manages all transactions, math, roles & views locally
   ========================================== */

(function () {
  'use strict';

  // --- DEFAULT SEED DATA ---
  const DEFAULT_ITEMS = [
    { id: 1, name: "Sodium", category: "raw_material", unit: "kg", reorderLevel: 3 },
    { id: 2, name: "Calcium", category: "raw_material", unit: "kg", reorderLevel: 10 },
    { id: 3, name: "Magnesium", category: "raw_material", unit: "kg", reorderLevel: 5 },
    { id: 4, name: "1.5L Empty", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
    { id: 5, name: "0.5L Empty", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
    { id: 6, name: "1.5L Labels", category: "raw_material", unit: "kg", reorderLevel: 15 },
    { id: 7, name: "0.5L Labels", category: "raw_material", unit: "kg", reorderLevel: 10 },
    { id: 8, name: "Shrink Wrap", category: "raw_material", unit: "kg", reorderLevel: 10 },
    { id: 9, name: "Small Caps", category: "raw_material", unit: "pcs", reorderLevel: 6000 },
    { id: 10, name: "Large Caps (19L)", category: "raw_material", unit: "pcs", reorderLevel: 500 },
    { id: 11, name: "19L Empty Bottles", category: "raw_material", unit: "pcs", reorderLevel: 50 },
    { id: 12, name: "Mineral Sets", category: "raw_material", unit: "set", reorderLevel: 1 },
    { id: 13, name: "1.5L PET finished goods", category: "finished_good", unit: "pcs", reorderLevel: 0 },
    { id: 14, name: "0.5L PET finished goods", category: "finished_good", unit: "pcs", reorderLevel: 0 },
    { id: 15, name: "Pure Preform", category: "raw_material", unit: "kg", reorderLevel: 100 },
    { id: 16, name: "Mix Preform", category: "raw_material", unit: "kg", reorderLevel: 100 },
    { id: 17, name: "0.5L Pure Bottle", category: "finished_good", unit: "pcs", reorderLevel: 0 },
    { id: 18, name: "1.5L Pure Bottle", category: "finished_good", unit: "pcs", reorderLevel: 0 },
    { id: 19, name: "0.5L Mix Bottle", category: "finished_good", unit: "pcs", reorderLevel: 0 },
    { id: 20, name: "1.5L Mix Bottle", category: "finished_good", unit: "pcs", reorderLevel: 0 }
  ];

  const DEFAULT_INVENTORY_TXNS = [
    { id: 1, itemId: 1, direction: "IN", qty: 10, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 2, itemId: 2, direction: "IN", qty: 30, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 3, itemId: 3, direction: "IN", qty: 15, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 4, itemId: 4, direction: "IN", qty: 8000, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 5, itemId: 5, direction: "IN", qty: 9000, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 6, itemId: 6, direction: "IN", qty: 25, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 7, itemId: 7, direction: "IN", qty: 20, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 8, itemId: 8, direction: "IN", qty: 18, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 9, itemId: 9, direction: "IN", qty: 8500, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 10, itemId: 10, direction: "IN", qty: 800, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 11, itemId: 11, direction: "IN", qty: 120, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 12, itemId: 12, direction: "IN", qty: 5, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 13, itemId: 13, direction: "IN", qty: 50, refType: "adjustment", refId: "seed", location: "warehouse", createdAt: "2026-07-16" },
    { id: 14, itemId: 14, direction: "IN", qty: 80, refType: "adjustment", refId: "seed", location: "warehouse", createdAt: "2026-07-16" },
    { id: 15, itemId: 15, direction: "IN", qty: 500, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 16, itemId: 16, direction: "IN", qty: 500, refType: "adjustment", refId: "seed", location: "factory", createdAt: "2026-07-16" },
    { id: 17, itemId: 17, direction: "IN", qty: 1000, refType: "adjustment", refId: "seed", location: "warehouse", createdAt: "2026-07-16" }
  ];

  const DEFAULT_BOTTLE_TXNS = [
    { id: 1, customerId: null, txnType: "purchased_new", qty: 120, refDeliveryId: null, note: "Initial company fleet stock", createdAt: "2026-07-16" }
  ];

  const DEFAULT_CUSTOMERS = [
    {
      id: 1,
      phone: "+923001234567",
      name: "Ali Khan",
      address: "House 123, Street 5, F-10, Islamabad",
      mapsLocation: "https://maps.google.com/?q=33.6844,73.0479",
      homePictureUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120",
      customerType: "Home",
      creditLimit: 5000,
      creditDuration: 1,
      defaultPrice: 250,
      remarks: "Regular home client"
    },
    {
      id: 2,
      phone: "+925111172867",
      name: "Savory Foods",
      address: "Plot 14, Blue Area, Islamabad",
      mapsLocation: "https://maps.google.com/?q=33.7123,73.0567",
      homePictureUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=120",
      customerType: "Restaurant",
      creditLimit: 15000,
      creditDuration: 1,
      defaultPrice: 220,
      remarks: "Deliver on weekends morning"
    },
    {
      id: 3,
      phone: "+923339876543",
      name: "Khyber Store",
      address: "Shop 4, G-9 Markaz, Islamabad",
      mapsLocation: "https://maps.google.com/?q=33.6901,73.0234",
      homePictureUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=120",
      customerType: "Shop",
      creditLimit: 0, // Unlimited
      creditDuration: 1,
      defaultPrice: 200,
      remarks: "Commercial shop dealer"
    }
  ];

  const DEFAULT_VENDORS = [
    { id: 1, name: "Standard Caps Co", phone: "+923009998877", remarks: "Small/large cap vendor" },
    { id: 2, name: "Preform Plastics Corp", phone: "+923214567890", remarks: "Raw preform supplier" }
  ];

  // --- APP STATE ---
  let state = {
    company: 'aquasphere', // 'aquasphere' or 'badana'
    role: 'owner',         // 'owner', 'operator', 'accountant', 'pm', 'mm'
    selectedCustomerId: null
  };

  // --- WARNING OVERRIDE CONTROLS ---
  let warningPromiseResolver = null;

  // --- IN-MEMORY DB / LOCALSTORAGE LOGIC ---
  function getDbKey(table) {
    return `${state.company}_${table}`;
  }

  function getTable(table) {
    let t = table;
    if (t === 'production_runs' || t === 'productions') {
      t = 'production_batches';
    }
    const key = getDbKey(t);
    let data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    let arr = JSON.parse(data);
    if (t === 'production_batches') {
      return arr.map(b => ({
        ...b,
        qty05L: b.qty05LProduced !== undefined ? b.qty05LProduced : (b.qty05L || 0),
        qty15L: b.qty15LProduced !== undefined ? b.qty15LProduced : (b.qty15L || 0),
        qty05LProduced: b.qty05LProduced !== undefined ? b.qty05LProduced : (b.qty05L || 0),
        qty15LProduced: b.qty15LProduced !== undefined ? b.qty15LProduced : (b.qty15L || 0),
        sodiumUsed: b.sodiumConsumed !== undefined ? b.sodiumConsumed : (b.sodiumUsed || 0),
        calciumUsed: b.calciumConsumed !== undefined ? b.calciumConsumed : (b.calciumUsed || 0),
        magnesiumUsed: b.magnesiumConsumed !== undefined ? b.magnesiumConsumed : (b.magnesiumUsed || 0),
        sodiumConsumed: b.sodiumConsumed !== undefined ? b.sodiumConsumed : (b.sodiumUsed || 0),
        calciumConsumed: b.calciumConsumed !== undefined ? b.calciumConsumed : (b.calciumUsed || 0),
        magnesiumConsumed: b.magnesiumConsumed !== undefined ? b.magnesiumConsumed : (b.magnesiumUsed || 0),
        brokenEmpty: b.brokenEmpty !== undefined ? b.brokenEmpty : ((parseInt(b.broken05L || 0) + parseInt(b.broken15L || 0)) || 0),
        date: b.productionDate || b.date
      }));
    }
    return arr;
  }

  function saveTable(table, data) {
    let t = table;
    if (t === 'production_runs' || t === 'productions') {
      t = 'production_batches';
    }
    const key = getDbKey(t);
    localStorage.setItem(key, JSON.stringify(data));
  }

  function logActivity(actionDesc) {
    const logs = getTable('activity_logs') || [];
    const nextLogId = logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1;
    logs.push({
      id: nextLogId,
      timestamp: new Date().toLocaleString(),
      role: state.role.toUpperCase(),
      name: state.role === 'owner' ? 'Owner' : (state.role.toUpperCase() + ' User'),
      action: actionDesc
    });
    saveTable('activity_logs', logs);
  }

  // Seeding Database
  function initDatabase() {
    const companies = ['aquasphere', 'badana'];
    companies.forEach(comp => {
      const checkKey = `${comp}_customers`;
      if (!localStorage.getItem(checkKey)) {
        if (comp === 'badana') {
          const DEFAULT_BADANA_CUSTOMERS = [
            { id: 1, name: "Aqua Sphere", phone: "+923000000001", customerType: "Client", creditLimit: 50000 },
            { id: 2, name: "Deosani", phone: "+923000000002", customerType: "Client", creditLimit: 50000 },
            { id: 3, name: "Pivrifine", phone: "+923000000003", customerType: "Client", creditLimit: 50000 }
          ];
          localStorage.setItem(`${comp}_customers`, JSON.stringify(DEFAULT_BADANA_CUSTOMERS));
        } else {
          localStorage.setItem(`${comp}_customers`, JSON.stringify(DEFAULT_CUSTOMERS));
        }
        localStorage.setItem(`${comp}_items`, JSON.stringify(DEFAULT_ITEMS));
        localStorage.setItem(`${comp}_inventory_transactions`, JSON.stringify(DEFAULT_INVENTORY_TXNS));
        localStorage.setItem(`${comp}_bottle_transactions`, JSON.stringify(DEFAULT_BOTTLE_TXNS));
        localStorage.setItem(`${comp}_vendors`, JSON.stringify(DEFAULT_VENDORS));
        localStorage.setItem(`${comp}_orders`, JSON.stringify([]));
        localStorage.setItem(`${comp}_deliveries`, JSON.stringify([]));
        localStorage.setItem(`${comp}_payments`, JSON.stringify([]));
        localStorage.setItem(`${comp}_production_batches`, JSON.stringify([]));
        localStorage.setItem(`${comp}_purchases`, JSON.stringify([]));
        localStorage.setItem(`${comp}_vendor_payments`, JSON.stringify([]));
        localStorage.setItem(`${comp}_expenses`, JSON.stringify([]));
        localStorage.setItem(`${comp}_daily_closings`, JSON.stringify([]));
        localStorage.setItem(`${comp}_blowing_transactions`, JSON.stringify([]));
        localStorage.setItem(`${comp}_blowing_sales`, JSON.stringify([]));
      }
    });
  }

  // --- CORE DERIVED CALCULATIONS ---

  // 1. Get stock level for item
  function getItemStock(itemId, location = null) {
    const txns = getTable('inventory_transactions');
    let stock = 0;
    txns.forEach(t => {
      if (t.itemId === itemId && (!location || t.location === location)) {
        if (t.direction === 'IN') stock += parseFloat(t.qty);
        else if (t.direction === 'OUT') stock -= parseFloat(t.qty);
      }
    });
    return stock;
  }

  // 2. Get customer balances
  function getCustomerBalances(customerId) {
    const orders = getTable('orders').filter(o => o.customerId === customerId);
    const payments = getTable('payments').filter(p => p.customerId === customerId);

    // Sum outstanding orders
    const ordersTotal = orders.reduce((sum, o) => sum + (parseFloat(o.totalCharged) || 0), 0);
    const paymentsTotal = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    // Also include spot sales credited to this customer
    const expenses = getTable('expenses').filter(e => e.type === 'spot_sale' && parseInt(e.customerId) === customerId);
    const spotSalesCreditTotal = expenses.reduce((sum, e) => sum + (parseFloat(e.creditAmount) || 0), 0);

    return {
      outstanding: (ordersTotal + spotSalesCreditTotal) - paymentsTotal
    };
  }

  // 3. Get customer bottles balance
  function getCustomerBottles(customerId) {
    const txns = getTable('bottle_transactions').filter(t => t.customerId === customerId);
    let count = 0;
    txns.forEach(t => {
      if (t.txnType === 'delivered_to_customer') {
        count += parseInt(t.qty, 10);
      } else if (['returned_good', 'returned_broken', 'lost'].includes(t.txnType)) {
        count -= parseInt(t.qty, 10);
      }
    });
    return count;
  }

  // 4. Reconcile 19L Bottles asset ledger
  function getBottleSummary() {
    const txns = getTable('bottle_transactions');
    let atFactory = 0;
    let withCustomers = 0;
    let broken = 0;
    let lost = 0;

    txns.forEach(t => {
      const q = parseInt(t.qty, 10) || 0;
      if (t.txnType === 'purchased_new') {
        atFactory += q;
      } else if (t.txnType === 'delivered_to_customer') {
        atFactory -= q;
        withCustomers += q;
      } else if (t.txnType === 'returned_good') {
        atFactory += q;
        withCustomers -= q;
      } else if (t.txnType === 'returned_broken') {
        broken += q;
        withCustomers -= q;
      } else if (t.txnType === 'lost') {
        lost += q;
        if (t.customerId) {
          withCustomers -= q;
        } else {
          atFactory -= q;
        }
      } else if (t.txnType === 'factory_adjustment') {
        atFactory += q;
      }
    });

    const totalOwned = atFactory + withCustomers + broken;
    return { totalOwned, atFactory, withCustomers, broken, lost };
  }

  // 5. Vendor payable logic
  function getVendorPayable(vendorId) {
    const purchases = getTable('purchases').filter(p => p.vendorId === vendorId);
    const payments = getTable('vendor_payments').filter(vp => vp.vendorId === vendorId);

    const liabilityTotal = purchases.reduce((sum, p) => sum + (parseFloat(p.totalCost) || 0), 0);
    const paidTotal = payments.reduce((sum, vp) => sum + (parseFloat(vp.amount) || 0), 0);

    return liabilityTotal - paidTotal;
  }

  // 6. Blowing stock levels calculations
  function getBlowingStock() {
    const txns = getTable('blowing_transactions');
    let preforms = { pure: 0, mix: 0 };
    let bottles = {};

    txns.forEach(t => {
      const q = parseFloat(t.qty) || 0;
      if (t.txnType === 'preform_purchase') {
        preforms[t.preformType] += q;
      } else if (t.txnType === 'production') {
        preforms[t.preformType] -= parseFloat(t.preformWeightDeducted);
        const key = `${t.brand}_${t.size}_${t.preformType}_factory`;
        bottles[key] = (bottles[key] || 0) + parseInt(t.qty, 10);
      } else if (t.txnType === 'transfer') {
        const fromKey = `${t.brand}_${t.size}_${t.preformType}_factory`;
        const toKey = `${t.brand}_${t.size}_${t.preformType}_warehouse`;
        bottles[fromKey] = (bottles[fromKey] || 0) - parseInt(t.qty, 10);
        bottles[toKey] = (bottles[toKey] || 0) + parseInt(t.qty, 10);
      } else if (t.txnType === 'sale') {
        const key = `${t.brand}_${t.size}_${t.preformType}_${t.location}`;
        bottles[key] = (bottles[key] || 0) - parseInt(t.qty, 10);
      }
    });

    return { preforms, bottles };
  }

  // 7. Check if date is locked by daily closing
  function isDateClosed(dateStr) {
    if (state.role === 'owner') return false; // Owner bypasses closing lock
    const closings = getTable('daily_closings');
    return closings.some(c => c.date === dateStr);
  }

  // --- WARNING OVERLAYS MODALS TRIGGER ---
  async function triggerSoftBlockCheck(warningMessage) {
    document.getElementById('warning-message').innerText = warningMessage;
    document.getElementById('modal-warning').classList.remove('hidden');

    return new Promise((resolve) => {
      warningPromiseResolver = resolve;
    });
  }

  // Helper: Read uploaded files as Base64 data URLs
  function readFileAsBase64(fileInputEl) {
    return new Promise((resolve) => {
      if (!fileInputEl || !fileInputEl.files || !fileInputEl.files[0]) {
        resolve(null);
        return;
      }
      const file = fileInputEl.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        resolve(event.target.result);
      };
      reader.onerror = function() {
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }

  // --- ROLE AND COMPANY ACCESS FILTERS ---
  const PORTAL_SIDEBAR_CONFIG = {
    owner: [
      { label: 'Dashboard', icon: '📊', tab: 'tab-dashboard' },
      { label: 'Orders', icon: '🚚', tab: 'tab-orders' },
      { label: 'Customers', icon: '👤', tab: 'tab-crm' },
      { label: 'Production', icon: '🏭', tab: 'tab-production' },
      { label: 'Inventory', icon: '📦', tab: 'tab-inventory' },
      { label: 'Bottle Ledger', icon: '🌀', tab: 'tab-bottle-company' },
      { label: 'Purchases', icon: '🛒', tab: 'tab-purchases' },
      { label: 'Vendors', icon: '🤝', tab: 'tab-vendors' },
      { label: 'Expenses', icon: '💵', tab: 'tab-expenses', filter: 'all' },
      { label: 'Counter Sales', icon: '🏪', tab: 'tab-counter-sales' },
      { label: 'Reports', icon: '📈', tab: 'tab-reports', filter: 'sales' },
      { label: 'Website Settings', icon: '🌐', tab: 'tab-website' },
      { label: 'Users & Roles', icon: '👥', tab: 'tab-users-roles', filter: 'users' },
      { label: 'Settings', icon: '⚙️', tab: 'tab-settings' }
    ],
    admin: [
      { label: 'Dashboard', icon: '📊', tab: 'tab-dashboard' },
      { label: 'Orders', icon: '🚚', tab: 'tab-orders' },
      { label: 'Production', icon: '🏭', tab: 'tab-production' },
      { label: 'Inventory', icon: '📦', tab: 'tab-inventory' },
      { label: 'Cash Summary', icon: '💰', tab: 'tab-cash-summary' },
      { label: 'Daily Closing', icon: '🔒', tab: 'tab-closing' }
    ],
    pm: [
      { label: 'Dashboard', icon: '📊', tab: 'tab-production-history' },
      { label: 'Production', icon: '🏭', tab: 'tab-production' },
      { label: 'Production History', icon: '📅', tab: 'tab-production-history' },
      { label: 'Raw Materials', icon: '📦', tab: 'tab-raw-materials' },
      { label: 'Finished Goods', icon: '✨', tab: 'tab-finished-goods' },
      { label: 'Broken Bottles', icon: '💔', tab: 'tab-broken-bottles' },
      { label: 'Inventory View', icon: '🔍', tab: 'tab-inventory' },
      { label: 'Daily Closing', icon: '🔒', tab: 'tab-closing', filter: 'production' }
    ],
    mm: [
      { label: 'Dashboard', icon: '📊', tab: 'tab-orders', filter: 'pending' },
      { label: 'New Order', icon: '➕', tab: 'tab-new-order' },
      { label: 'Pending Orders', icon: '⏳', tab: 'tab-orders', filter: 'pending' },
      { label: 'Deliveries', icon: '🚚', tab: 'tab-deliveries' },
      { label: 'Customers', icon: '👤', tab: 'tab-crm' },
      { label: 'Payments', icon: '💵', tab: 'tab-payments' },
      { label: 'Invoices', icon: '📄', tab: 'tab-invoices' },
      { label: 'Search', icon: '🔍', tab: 'tab-search' },
      { label: 'Daily Closing', icon: '🔒', tab: 'tab-closing', filter: 'orders' }
    ],
    accountant: [
      { label: 'Dashboard', icon: '📊', tab: 'tab-cash-summary' },
      { label: 'Purchases', icon: '🛒', tab: 'tab-purchases' },
      { label: 'Vendors', icon: '🤝', tab: 'tab-vendors' },
      { label: 'Production', icon: '🏭', tab: 'tab-blowing' },
      { label: 'Expenses', icon: '💵', tab: 'tab-expenses', filter: 'all' },
      { label: 'Counter Sales', icon: '🏪', tab: 'tab-counter-sales' },
      { label: 'Reports', icon: '📈', tab: 'tab-reports', filter: 'sales' },
      { label: 'Daily Closing', icon: '🔒', tab: 'tab-closing', filter: 'purchases' }
    ]
  };

  const SUB_TABS_CONFIG = {
    'tab-dashboard': [
      { label: 'Overview', tab: 'tab-dashboard' },
      { label: 'Sales Analytics', tab: 'tab-dashboard-sales' },
      { label: 'Financial Overview', tab: 'tab-dashboard-financial' },
      { label: 'Inventory Summary', tab: 'tab-inventory' },
      { label: 'Production Summary', tab: 'tab-production-history' },
      { label: 'Low Stock Alerts', tab: 'tab-dashboard-low-stock' }
    ],
    'tab-orders': [
      { label: 'New Order', tab: 'tab-new-order' },
      { label: 'Pending Orders', tab: 'tab-orders', filter: 'pending' },
      { label: 'In Progress', tab: 'tab-orders-inprogress' },
      { label: 'Completed Orders', tab: 'tab-orders-completed' },
      { label: 'Cancelled Orders', tab: 'tab-orders-cancelled' },
      { label: 'Delivery Tracking', tab: 'tab-deliveries' }
    ],
    'tab-crm': [
      { label: 'Customer List', tab: 'tab-crm' },
      { label: 'Add Customer', tab: 'tab-customer-add' },
      { label: 'Customer Credits', tab: 'tab-customer-credits' },
      { label: 'Bottle Balance', tab: 'tab-customer-bottles' },
      { label: 'Customer History', tab: 'tab-customer-history' },
      { label: 'Customer Locations', tab: 'tab-customer-locations' },
      { label: 'Customer Reminders', tab: 'tab-customer-reminders' }
    ],
    'tab-production': [
      { label: 'New Production', tab: 'tab-production' },
      { label: 'Production History', tab: 'tab-production-history' },
      { label: 'Production Reports', tab: 'tab-production-reports' },
      { label: 'Broken Bottles', tab: 'tab-broken-bottles' },
      { label: 'Water Consumption', tab: 'tab-production-water' },
      { label: 'Mineral Consumption', tab: 'tab-production-mineral' }
    ],
    'tab-inventory': [
      { label: 'Raw Materials', tab: 'tab-raw-materials' },
      { label: 'Finished Goods', tab: 'tab-finished-goods' },
      { label: 'Stock Transactions', tab: 'tab-inventory-txns' },
      { label: 'Low Stock Alerts', tab: 'tab-inventory-low-stock' },
      { label: 'Inventory Adjustments', tab: 'tab-inventory-adjust' }
    ],
    'tab-bottle-company': [
      { label: 'Company Bottles', tab: 'tab-bottle-company' },
      { label: 'Customer Bottles', tab: 'tab-bottle-customer' },
      { label: 'Broken Bottles', tab: 'tab-bottle-broken' },
      { label: 'Lost Bottles', tab: 'tab-bottle-lost' },
      { label: 'Bottle Purchases', tab: 'tab-bottle-purchased' },
      { label: 'Bottle Transactions', tab: 'tab-bottle-txns' }
    ],
    'tab-purchases': [
      { label: 'New Purchase', tab: 'tab-purchases' },
      { label: 'Purchase History', tab: 'tab-purchases-history' },
      { label: 'Purchase Bills', tab: 'tab-purchases-bills' },
      { label: 'Pending Purchases', tab: 'tab-purchases-pending' }
    ],
    'tab-vendors': [
      { label: 'Vendor List', tab: 'tab-vendors' },
      { label: 'Add Vendor', tab: 'tab-vendor-add' },
      { label: 'Vendor Payments', tab: 'tab-vendor-payments' },
      { label: 'Vendor Balances', tab: 'tab-vendor-balances' },
      { label: 'Purchase History', tab: 'tab-vendor-purchase-history' }
    ],
    'tab-expenses': [
      { label: 'Fuel', tab: 'tab-expenses', filter: 'fuel' },
      { label: 'Salaries', tab: 'tab-expenses', filter: 'salaries' },
      { label: 'Electricity', tab: 'tab-expenses', filter: 'electricity' },
      { label: 'Plant Rent', tab: 'tab-expenses', filter: 'plant_rent' },
      { label: 'Vehicle Repairs', tab: 'tab-expenses', filter: 'vehicle_repair' },
      { label: 'Machine Repairs', tab: 'tab-expenses', filter: 'machine_repair' },
      { label: 'Miscellaneous', tab: 'tab-expenses', filter: 'misc' },
      { label: 'Expense History', tab: 'tab-expenses', filter: 'all' }
    ],
    'tab-counter-sales': [
      { label: 'New Counter Sale', tab: 'tab-counter-sales' },
      { label: 'Counter Sale History', tab: 'tab-counter-sales-history' },
      { label: 'Counter Sale Reports', tab: 'tab-counter-sales-reports' }
    ],
    'tab-website': [
      { label: 'Website Settings', tab: 'tab-website' },
      { label: 'Homepage', tab: 'tab-website-homepage' },
      { label: 'Customers', tab: 'tab-website-customers' },
      { label: 'Reviews', tab: 'tab-website-reviews' },
      { label: 'Careers', tab: 'tab-website-careers' },
      { label: 'Contact', tab: 'tab-website-contact' }
    ],
    'tab-users-roles': [
      { label: 'Users', tab: 'tab-users-roles', filter: 'users' },
      { label: 'Roles', tab: 'tab-users-roles', filter: 'roles' },
      { label: 'Permissions', tab: 'tab-users-roles', filter: 'permissions' },
      { label: 'Password Management', tab: 'tab-settings', filter: 'passwords' },
      { label: 'Activity Logs', tab: 'tab-settings', filter: 'logs' }
    ],
    'tab-settings': [
      { label: 'Company Profile', tab: 'tab-settings-profile' },
      { label: 'Product Settings', tab: 'tab-settings-products' },
      { label: 'Inventory Settings', tab: 'tab-settings-inventory' },
      { label: 'Notification Settings', tab: 'tab-settings-notifications' },
      { label: 'Backup & Restore', tab: 'tab-settings', filter: 'backup' },
      { label: 'System Settings', tab: 'tab-settings-system' }
    ]
  };

  function applyRoleSecurity() {
    const role = state.role;
    const items = PORTAL_SIDEBAR_CONFIG[role] || PORTAL_SIDEBAR_CONFIG['owner'];
    const navContainer = document.getElementById('main-nav-tabs');
    if (!navContainer) return;
    
    // Build navigation items
    navContainer.innerHTML = '';
    
    items.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      if (index === 0) btn.classList.add('active');
      btn.innerHTML = `
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      `;
      btn.dataset.tab = item.tab;
      btn.dataset.filter = item.filter || '';
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Switch tab panels
        document.querySelectorAll('.content-panel .tab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(item.tab);
        if (panel) {
          panel.classList.add('active');
          
          // Disable/Enable form elements based on view-only settings
          const isView = item.viewOnly || (role === 'admin' && item.tab !== 'tab-closing');
          panel.querySelectorAll('form').forEach(form => {
            if (form.id !== 'admin-closing-checklist-form') {
              form.querySelectorAll('button[type="submit"], input, select, textarea').forEach(el => {
                el.disabled = isView;
              });
            }
          });
          
          // Set page header title
          document.getElementById('page-title').innerText = item.label;
          
          // Trigger specific panel updates
          triggerTabRender(item.tab, item.filter || '', isView);
        }
      });
      
      navContainer.appendChild(btn);
    });

    // Hide/show metrics bar
    const metricsBar = document.getElementById('owner-metrics-bar');
    if (metricsBar) {
      if (role === 'admin' || role === 'pm' || role === 'mm') {
        metricsBar.classList.add('hidden');
      } else {
        metricsBar.classList.remove('hidden');
      }
    }

    // Owner-only fields
    if (role === 'owner') {
      document.querySelectorAll('.owner-only').forEach(el => el.classList.remove('hidden'));
    } else {
      document.querySelectorAll('.owner-only').forEach(el => el.classList.add('hidden'));
    }

    // Daily closing forms visibility
    const ownerClosingForm = document.getElementById('daily-closing-form');
    const adminClosingForm = document.getElementById('admin-closing-checklist-form');
    if (role === 'admin') {
      if (ownerClosingForm) ownerClosingForm.classList.add('hidden');
      if (adminClosingForm) adminClosingForm.classList.remove('hidden');
    } else {
      if (ownerClosingForm) ownerClosingForm.classList.remove('hidden');
      if (adminClosingForm) adminClosingForm.classList.add('hidden');
    }

    // Trigger loading first tab
    const firstItem = navContainer.querySelector('.nav-item');
    if (firstItem) {
      firstItem.click();
    }
  }

  function triggerTabRender(tabId, filter = '', viewOnly = false) {
    if (tabId === 'tab-dashboard') {
      renderDashboard();
    } else if (tabId === 'tab-dashboard-sales') {
      renderDashboardSales();
    } else if (tabId === 'tab-dashboard-financial') {
      renderDashboardFinancial();
    } else if (tabId === 'tab-dashboard-low-stock') {
      renderDashboardLowStock();
    } else if (tabId === 'tab-crm') {
      renderCRM();
    } else if (tabId === 'tab-customer-add') {
      renderCustomerAddTab();
    } else if (tabId === 'tab-customer-credits') {
      renderCustomerCredits();
    } else if (tabId === 'tab-customer-bottles') {
      renderCustomerBottles();
    } else if (tabId === 'tab-customer-history') {
      renderCustomerHistory();
    } else if (tabId === 'tab-customer-locations') {
      renderCustomerLocations();
    } else if (tabId === 'tab-customer-reminders') {
      renderCustomerReminders();
    } else if (tabId === 'tab-orders') {
      renderPendingOrders(filter, viewOnly);
    } else if (tabId === 'tab-orders-inprogress') {
      renderOrdersInProgress();
    } else if (tabId === 'tab-orders-completed') {
      renderOrdersCompleted();
    } else if (tabId === 'tab-orders-cancelled') {
      renderOrdersCancelled();
    } else if (tabId === 'tab-deliveries') {
      renderDeliveriesLog();
    } else if (tabId === 'tab-production') {
      renderProduction();
    } else if (tabId === 'tab-production-history') {
      renderProductionHistory();
    } else if (tabId === 'tab-production-reports') {
      renderProductionReports();
    } else if (tabId === 'tab-broken-bottles') {
      renderBrokenBottlesLog();
    } else if (tabId === 'tab-production-water') {
      renderProductionWater();
    } else if (tabId === 'tab-production-mineral') {
      renderProductionMineral();
    } else if (tabId === 'tab-raw-materials') {
      renderRawMaterials();
    } else if (tabId === 'tab-finished-goods') {
      renderFinishedGoods();
    } else if (tabId === 'tab-inventory-txns') {
      renderInventoryTxns();
    } else if (tabId === 'tab-inventory-low-stock') {
      renderInventoryLowStock();
    } else if (tabId === 'tab-inventory-adjust') {
      renderInventoryAdjust();
    } else if (tabId === 'tab-bottle-company') {
      renderBottleCompany();
    } else if (tabId === 'tab-bottle-customer') {
      renderBottleCustomer();
    } else if (tabId === 'tab-bottle-broken') {
      renderBottleBroken();
    } else if (tabId === 'tab-bottle-lost') {
      renderBottleLost();
    } else if (tabId === 'tab-bottle-purchased') {
      renderBottlePurchased();
    } else if (tabId === 'tab-bottle-txns') {
      renderBottleTxns();
    } else if (tabId === 'tab-purchases') {
      renderPurchases();
    } else if (tabId === 'tab-purchases-history') {
      renderPurchasesHistory();
    } else if (tabId === 'tab-purchases-bills') {
      renderPurchasesBills();
      renderPurchasesPending();
    } else if (tabId === 'tab-purchases-pending') {
      renderPurchasesPending();
    } else if (tabId === 'tab-vendors') {
      renderVendors();
    } else if (tabId === 'tab-vendor-add') {
      renderVendorAddTab();
    } else if (tabId === 'tab-vendor-payments') {
      renderVendorPayments();
    } else if (tabId === 'tab-vendor-balances') {
      renderVendorBalances();
    } else if (tabId === 'tab-vendor-purchase-history') {
      renderVendorPurchaseHistory();
    } else if (tabId === 'tab-expenses') {
      renderExpenses(filter);
    } else if (tabId === 'tab-counter-sales') {
      renderCounterSales();
    } else if (tabId === 'tab-counter-sales-history') {
      renderCounterSalesHistory();
    } else if (tabId === 'tab-counter-sales-reports') {
      renderCounterSalesReports();
    } else if (tabId === 'tab-closing') {
      renderDailyClosing(filter);
    } else if (tabId === 'tab-blowing') {
      renderBlowing();
    } else if (tabId === 'tab-reports') {
      renderReports(filter);
    } else if (tabId === 'tab-website') {
      renderWebsiteSettings();
    } else if (tabId === 'tab-website-homepage') {
      renderWebsiteHomepage();
    } else if (tabId === 'tab-website-customers') {
      renderWebsiteCustomers();
    } else if (tabId === 'tab-website-reviews') {
      renderWebsiteReviews();
    } else if (tabId === 'tab-website-careers') {
      renderWebsiteCareers();
    } else if (tabId === 'tab-website-contact') {
      renderWebsiteContact();
    } else if (tabId === 'tab-users-roles') {
      renderUsersRoles(filter);
    } else if (tabId === 'tab-settings') {
      renderSettings(filter);
    } else if (tabId === 'tab-settings-profile') {
      renderSettingsProfile();
    } else if (tabId === 'tab-settings-products') {
      renderSettingsProducts();
    } else if (tabId === 'tab-settings-inventory') {
      renderSettingsInventory();
    } else if (tabId === 'tab-settings-notifications') {
      renderSettingsNotifications();
    } else if (tabId === 'tab-settings-system') {
      renderSettingsSystem();
    } else if (tabId === 'tab-inventory') {
      renderInventorySummary();
    } else if (tabId === 'tab-cash-summary') {
      renderCashSummary();
    } else if (tabId === 'tab-new-order') {
      renderNewOrderForm();
    } else if (tabId === 'tab-payments') {
      renderPaymentsTab();
    } else if (tabId === 'tab-invoices') {
      renderInvoicesTab();
    } else if (tabId === 'tab-search') {
      renderSearchTab();
    }

    // Highlight active sub-tab on the page
    document.querySelectorAll('.page-subtabs-row .subtab-btn').forEach(btn => {
      const isMatch = btn.dataset.tab === tabId && (btn.dataset.filter || '') === filter;
      btn.classList.toggle('active', isMatch);
    });
  }

  // --- RENDERING ROUTINES ---

  // 1. Render Dashboard/Stats metrics — populates both old metrics bar AND new KPI cards
  function renderDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = getTable('deliveries');
    const payments = getTable('payments');
    const orders = getTable('orders');
    const expenses = getTable('expenses');
    const customers = getTable('customers');
    const vendors = getTable('vendors');

    let sales = 0;
    let cashCollected = 0;
    let creditSales = 0;
    let expenseTotal = 0;

    // Today's Sales from deliveries done
    deliveries.forEach(d => {
      if (d.deliveredAt && d.deliveredAt.startsWith(today)) {
        const order = orders.find(o => o.id === d.orderId);
        if (order) {
          if (order.orderType === '19L') {
            sales += parseFloat(d.qtyDelivered) * parseFloat(order.unitPrice || 250);
          } else {
            sales += (parseFloat(d.qty05LDelivered || 0) * parseFloat(order.unitPrice05L || 500)) + 
                     (parseFloat(d.qty15LDelivered || 0) * parseFloat(order.unitPrice15L || 450));
          }
        }
      }
    });

    // Today's Payments received
    payments.forEach(p => {
      if (p.receivedAt && p.receivedAt.startsWith(today)) {
        cashCollected += parseFloat(p.amount);
      }
    });

    // Add cash spot sales & deduct credit spot sales
    expenses.forEach(e => {
      if (e.date && e.date.startsWith(today)) {
        if (e.type === 'expense') {
          expenseTotal += parseFloat(e.amount);
        } else if (e.type === 'spot_sale') {
          const cashVal = parseFloat(e.cashReceived || 0);
          const creditVal = parseFloat(e.creditAmount || 0);
          sales += (cashVal + creditVal);
          cashCollected += cashVal;
        }
      }
    });

    creditSales = sales - cashCollected;
    if (creditSales < 0) creditSales = 0;

    let estProfit = sales - expenseTotal;

    // Old metrics bar
    document.getElementById('stat-sales').innerText = `Rs. ${sales.toLocaleString()}`;
    document.getElementById('stat-cash').innerText = `Rs. ${cashCollected.toLocaleString()}`;
    document.getElementById('stat-credit').innerText = `Rs. ${creditSales.toLocaleString()}`;
    document.getElementById('stat-expenses').innerText = `Rs. ${expenseTotal.toLocaleString()}`;
    document.getElementById('stat-profit').innerText = `Rs. ${estProfit.toLocaleString()}`;

    // Update pending order badge count
    const pendingCount = orders.filter(o => o.deliveryStatus !== 'delivered').length;
    document.getElementById('pending-orders-count').innerText = pendingCount;

    // --- New Dashboard KPI cards ---
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setEl('dash-sales', `Rs. ${sales.toLocaleString()}`);
    setEl('dash-cash', `Rs. ${cashCollected.toLocaleString()}`);
    setEl('dash-credit', `Rs. ${creditSales.toLocaleString()}`);
    setEl('dash-expenses', `Rs. ${expenseTotal.toLocaleString()}`);
    setEl('dash-profit', `Rs. ${estProfit.toLocaleString()}`);
    setEl('dash-pending-orders', String(pendingCount));

    const completedToday = deliveries.filter(d => d.deliveredAt && d.deliveredAt.startsWith(today)).length;
    setEl('dash-completed-orders', String(completedToday));

    // Customer outstanding total
    let custOutstanding = 0;
    customers.forEach(c => { custOutstanding += getCustomerBalances(c.id).outstanding; });
    setEl('dash-cust-outstanding', `Rs. ${custOutstanding.toLocaleString()}`);

    // Vendor outstanding total
    let vendorOutstanding = 0;
    vendors.forEach(v => { vendorOutstanding += getVendorPayable(v.id); });
    setEl('dash-vendor-outstanding', `Rs. ${vendorOutstanding.toLocaleString()}`);

    setEl('dash-total-cust', String(customers.length));
    setEl('dash-total-vendor', String(vendors.length));

    // --- Chemical Stock Progress Bars ---
    const sodiumStock = getItemStock(1);
    const calciumStock = getItemStock(2);
    const magnesiumStock = getItemStock(3);

    const sodiumMax = 10; // seed qty for reference bar
    const calciumMax = 30;
    const magnesiumMax = 15;

    const clampPct = (v, max) => Math.min(100, Math.max(0, (v / max) * 100));

    const pbSodium = document.getElementById('pb-sodium');
    const pbCalcium = document.getElementById('pb-calcium');
    const pbMagnesium = document.getElementById('pb-magnesium');
    if (pbSodium) {
      pbSodium.style.width = clampPct(sodiumStock, sodiumMax) + '%';
      // Flash danger color when below reorder
      pbSodium.className = `progress-bar-fill ${sodiumStock <= 3 ? 'fill-danger' : 'fill-cyan'}`;
    }
    if (pbCalcium) {
      pbCalcium.style.width = clampPct(calciumStock, calciumMax) + '%';
      pbCalcium.className = `progress-bar-fill ${calciumStock <= 10 ? 'fill-danger' : 'fill-success'}`;
    }
    if (pbMagnesium) {
      pbMagnesium.style.width = clampPct(magnesiumStock, magnesiumMax) + '%';
      pbMagnesium.className = `progress-bar-fill ${magnesiumStock <= 5 ? 'fill-danger' : 'fill-warning'}`;
    }
    setEl('val-sodium', `${sodiumStock.toFixed(2)} / ${sodiumMax} kg`);
    setEl('val-calcium', `${calciumStock.toFixed(2)} / ${calciumMax} kg`);
    setEl('val-magnesium', `${magnesiumStock.toFixed(2)} / ${magnesiumMax} kg`);

    // Sales vs Cash ratio bars
    const maxSalesBar = Math.max(sales, 1);
    const pbSalesRatio = document.getElementById('pb-dash-sales-ratio');
    const pbCashRatio = document.getElementById('pb-dash-cash-ratio');
    if (pbSalesRatio) pbSalesRatio.style.width = '100%';
    if (pbCashRatio) pbCashRatio.style.width = clampPct(cashCollected, maxSalesBar) + '%';
    setEl('ratio-sales-label', `Sales Billed: Rs. ${sales.toLocaleString()}`);
    setEl('ratio-cash-label', `Cash Collected: Rs. ${cashCollected.toLocaleString()}`);

    // --- Low stock alert banners ---
    const alertArea = document.getElementById('dash-alerts-area');
    if (alertArea) {
      alertArea.innerHTML = '';
      const items = getTable('items');
      items.forEach(item => {
        const stock = getItemStock(item.id);
        if (stock <= item.reorderLevel && item.reorderLevel > 0) {
          alertArea.innerHTML += `<div class="alert-banner alert-low-stock">⚠️ LOW STOCK: ${item.name} — ${stock.toFixed(2)} ${item.unit} remaining (reorder at ${item.reorderLevel})</div>`;
        }
      });

      // Credit breach alerts (Rs. 5000 limit)
      customers.forEach(c => {
        if (c.creditLimit > 0) {
          const bal = getCustomerBalances(c.id);
          if (bal.outstanding > c.creditLimit) {
            alertArea.innerHTML += `<div class="alert-banner alert-warning">💳 CREDIT BREACH: ${c.name} owes Rs. ${bal.outstanding.toLocaleString()} (limit Rs. ${c.creditLimit.toLocaleString()}) <button class="btn btn-sm btn-primary btn-whatsapp-bill" data-customer-id="${c.id}" style="margin-left:10px">Send WhatsApp Bill</button></div>`;
          }
        }
      });

      // Bind WhatsApp bill buttons
      alertArea.querySelectorAll('.btn-whatsapp-bill').forEach(btn => {
        btn.addEventListener('click', function() {
          const custId = parseInt(this.getAttribute('data-customer-id'), 10);
          generateWhatsAppBill(custId);
        });
      });
    }
  }

  // Credit breach WhatsApp bill generator
  function generateWhatsAppBill(customerId) {
    const c = getTable('customers').find(x => x.id === customerId);
    if (!c) return;
    const bal = getCustomerBalances(customerId);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const message = `*AQUA SPHERE — Payment Reminder*\n\nDear ${c.name},\n\nYour current outstanding balance is *Rs. ${bal.outstanding.toLocaleString()}*.\nYour credit limit is Rs. ${c.creditLimit.toLocaleString()}.\n\nPlease clear your dues at your earliest convenience.\n\nDate: ${today}\nThank you for your business!\n\n— Aqua Sphere Water`;

    const phone = c.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // 2. Render CRM Customer Directory
  function renderCRM(query = '') {
    const customers = getTable('customers');
    const container = document.getElementById('crm-customer-list');
    container.innerHTML = '';

    const normalized = query.toLowerCase().trim();
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(normalized) || 
      c.phone.includes(normalized) || 
      String(c.id).includes(normalized)
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state-card"><h3>No customers found.</h3></div>`;
      return;
    }

    filtered.forEach(c => {
      const bal = getCustomerBalances(c.id);
      const bottles = getCustomerBottles(c.id);

      // Inactivity alerts (no orders for 7 days)
      let isInactive = false;
      const custOrders = getTable('orders').filter(o => o.customerId === c.id);
      if (custOrders.length > 0) {
        custOrders.sort((a,b) => b.id - a.id);
        const lastOrderDate = new Date(custOrders[0].expectedDelivery);
        const daysDiff = (new Date() - lastOrderDate) / (1000 * 60 * 60 * 24);
        if (daysDiff >= 7) isInactive = true;
      } else {
        isInactive = true; // Never ordered
      }

      const card = document.createElement('div');
      card.className = `customer-row ${state.selectedCustomerId === c.id ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="cust-info">
          <h4>${c.name} (ID: ${c.id})</h4>
          <p>${c.phone} | ${c.address.substring(0, 25)}...</p>
        </div>
        <div class="cust-meta">
          <span class="badge ${c.customerType === 'Home' ? 'badge-home' : 'badge-rest'}">${c.customerType}</span>
          ${isInactive ? '<span class="badge badge-warning">Inactive 1w</span>' : ''}
          <span class="bold ${bal.outstanding > 0 ? 'text-danger' : 'text-success'}">Rs. ${bal.outstanding.toLocaleString()}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectCustomer(c.id);
      });
      container.appendChild(card);
    });
  }

  // Select customer from list
  function selectCustomer(customerId) {
    state.selectedCustomerId = customerId;
    renderCRM(document.getElementById('crm-search-input').value);

    const c = getTable('customers').find(x => x.id === customerId);
    if (!c) return;

    document.getElementById('crm-empty-state').classList.add('hidden');
    const profile = document.getElementById('customer-profile-details');
    profile.classList.remove('hidden');

    // Bind profile text fields
    document.getElementById('profile-name').innerText = c.name;
    document.getElementById('profile-phone').innerText = c.phone;
    document.getElementById('profile-address').innerText = c.address;
    document.getElementById('profile-type').innerText = c.customerType;
    document.getElementById('profile-type').className = `badge ${c.customerType === 'Home' ? 'badge-home' : 'badge-rest'}`;
    document.getElementById('profile-maps').href = c.mapsLocation || '#';

    if (c.homePictureUrl) {
      document.getElementById('profile-picture').src = c.homePictureUrl;
    } else {
      document.getElementById('profile-picture').src = "https://via.placeholder.com/80/e2e8f0/000000?text=No+Photo";
    }

    const bal = getCustomerBalances(customerId);
    const bottles = getCustomerBottles(customerId);

    document.getElementById('profile-balance').innerText = `Rs. ${bal.outstanding.toLocaleString()}`;
    document.getElementById('profile-balance').className = `value ${bal.outstanding > 0 ? 'text-danger' : 'text-success'}`;
    document.getElementById('profile-bottles-held').innerText = bottles;
    document.getElementById('profile-credit-limit').innerText = c.creditLimit > 0 ? `Rs. ${c.creditLimit.toLocaleString()}` : "Unlimited";

    // Inactivity alerts & summaries calculations
    let isInactive = false;
    const orders = getTable('orders').filter(o => o.customerId === customerId);
    if (orders.length > 0) {
      orders.sort((a,b) => b.id - a.id);
      document.getElementById('profile-last-delivery').innerText = orders[0].expectedDelivery;

      const lastOrderDate = new Date(orders[0].expectedDelivery);
      const daysDiff = (new Date() - lastOrderDate) / (1000 * 60 * 60 * 24);
      if (daysDiff >= 7) isInactive = true;

      const firstOrderDate = new Date(orders[orders.length - 1].expectedDelivery);
      const months = Math.max(1, (new Date() - firstOrderDate) / (1000 * 60 * 60 * 24 * 30));
      document.getElementById('profile-avg-orders').innerText = Math.round(orders.length / months);
    } else {
      document.getElementById('profile-last-delivery').innerText = "Never";
      document.getElementById('profile-avg-orders').innerText = "0";
      isInactive = true;
    }

    if (isInactive) {
      document.getElementById('profile-alert-inactive').classList.remove('hidden');
    } else {
      document.getElementById('profile-alert-inactive').classList.add('hidden');
    }

    // Set order form defaults
    document.getElementById('order-customer-id').value = customerId;
    document.getElementById('order-expected-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('order-price-19l').value = c.defaultPrice || 250;

    recalcOrderTotal();
  }

  // Calc order charged
  function recalcOrderTotal() {
    const type = document.getElementById('order-type-val').value;
    let total = 0;
    if (type === '19L') {
      const q = parseFloat(document.getElementById('order-qty-19l').value) || 0;
      const p = parseFloat(document.getElementById('order-price-19l').value) || 0;
      total = q * p;
    } else {
      const q05 = parseFloat(document.getElementById('order-qty-05l').value) || 0;
      const p05 = parseFloat(document.getElementById('order-price-05l').value) || 0;
      const q15 = parseFloat(document.getElementById('order-qty-15l').value) || 0;
      const p15 = parseFloat(document.getElementById('order-price-15l').value) || 0;
      total = (q05 * p05) + (q15 * p15);
    }
    document.getElementById('order-charged-amount').value = total;
  }

  // 3. Render Deliveries table
  function renderPendingOrders(filter = '', viewOnly = false) {
    const orders = getTable('orders');
    const customers = getTable('customers');
    const deliveries = getTable('deliveries');
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    let list = orders;
    if (filter === 'pending') {
      list = orders.filter(o => o.deliveryStatus !== 'delivered');
    } else {
      if (state.role !== 'owner' && state.role !== 'admin') {
        list = orders.filter(o => o.deliveryStatus !== 'delivered');
      }
    }
    const searchVal = document.getElementById('order-list-search').value.toLowerCase().trim();

    const filtered = list.filter(o => {
      const cust = customers.find(c => c.id === o.customerId);
      return cust ? cust.name.toLowerCase().includes(searchVal) : false;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 25px;">No deliveries found.</td></tr>`;
      return;
    }

    filtered.forEach(o => {
      const cust = customers.find(c => c.id === o.customerId);
      const name = cust ? cust.name : `Customer ID: ${o.customerId}`;

      let desc = '';
      if (o.orderType === '19L') {
        const delivQty = deliveries.filter(d => d.orderId === o.id).reduce((sum, d) => sum + parseInt(d.qtyDelivered, 10), 0);
        desc = `${delivQty} / ${o.qtyOrdered} Refills`;
      } else {
        const deliv05 = deliveries.filter(d => d.orderId === o.id).reduce((sum, d) => sum + parseInt(d.qty05LDelivered || 0, 10), 0);
        const deliv15 = deliveries.filter(d => d.orderId === o.id).reduce((sum, d) => sum + parseInt(d.qty15LDelivered || 0, 10), 0);
        desc = `0.5L: ${deliv05}/${o.qty05LOrdered} | 1.5L: ${deliv15}/${o.qty15LOrdered}`;
      }

      const bal = getCustomerBalances(o.customerId);
      
      const isView = viewOnly || state.role === 'admin';
      const actionBtn = isView
        ? `<span class="badge badge-muted">View Only</span>`
        : `<button class="btn btn-sm btn-cyan btn-log-deliv" data-id="${o.id}">Complete Delivery</button>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#ORD-${o.id}</td>
        <td class="bold">${name}</td>
        <td><span class="badge ${o.orderType === '19L' ? 'badge-home' : 'badge-rest'}">${o.orderType}</span></td>
        <td>${desc}</td>
        <td>${o.expectedDelivery}</td>
        <td><span class="badge badge-danger">${o.deliveryStatus}</span></td>
        <td><span class="badge badge-danger">${o.paymentStatus}</span></td>
        <td class="bold ${bal.outstanding > 0 ? 'text-danger' : 'text-success'}">Rs. ${bal.outstanding.toLocaleString()}</td>
        <td>${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-log-deliv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        openDeliveryModal(id);
      });
    });
  }

  // Open delivery completion modal
  function openDeliveryModal(orderId) {
    const orders = getTable('orders');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const cust = getTable('customers').find(c => c.id === order.customerId);
    const holds = getCustomerBottles(order.customerId);

    document.getElementById('delivery-order-id').value = orderId;
    document.getElementById('deliv-cust-name').innerText = cust ? cust.name : 'Unknown';
    document.getElementById('deliv-cust-holds').innerText = holds;
    document.getElementById('deliv-date').value = new Date().toISOString().split('T')[0];

    // Defaults
    document.getElementById('deliv-cash').value = order.totalCharged;
    document.getElementById('deliv-remarks').value = '';

    if (order.orderType === '19L') {
      document.getElementById('deliv-19l-returns').classList.remove('hidden');
      document.getElementById('deliv-pet-quantities').classList.add('hidden');
      document.getElementById('deliv-qty').value = order.qtyOrdered;
      document.getElementById('deliv-order-details').innerText = `${order.qtyOrdered} Refills`;
      document.getElementById('deliv-return-good').value = order.qtyOrdered;
      document.getElementById('deliv-return-broken').value = 0;
    } else {
      document.getElementById('deliv-19l-returns').classList.add('hidden');
      document.getElementById('deliv-pet-quantities').classList.remove('hidden');
      document.getElementById('deliv-order-details').innerText = `0.5L: ${order.qty05LOrdered} | 1.5L: ${order.qty15LOrdered}`;
      document.getElementById('deliv-qty-05l').value = order.qty05LOrdered;
      document.getElementById('deliv-qty-15l').value = order.qty15LOrdered;
    }

    document.getElementById('modal-delivery').classList.remove('hidden');
  }

  // 4. Render PET Production
  function renderProduction() {
    const isBadana = state.company === 'badana';
    
    // Toggle containers
    document.getElementById('water-production-container').classList.toggle('hidden', isBadana);
    document.getElementById('badana-production-container').classList.toggle('hidden', !isBadana);

    // Populate clients if Badana
    if (isBadana) {
      const clientsSelect = document.getElementById('badana-prod-client');
      if (clientsSelect.options.length === 0) {
        const customers = getTable('customers').filter(c => c.customerType === 'Client');
        clientsSelect.innerHTML = customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      }
    }

    // Filter items based on company
    const allItems = getTable('items');
    const items = isBadana 
      ? allItems.filter(i => [15,16,17,18,19,20].includes(i.id))
      : allItems.filter(i => ![15,16,17,18,19,20].includes(i.id));

    const grid = document.getElementById('production-inventory-status');
    grid.innerHTML = '';

    items.forEach(item => {
      // For Badana raw preform, sum across locations or show combined. We'll show combined for simplicity here.
      const stock = getItemStock(item.id);
      const isLow = stock <= item.reorderLevel;

      const card = document.createElement('div');
      card.className = `item-metric-card ${isLow ? 'low-stock' : ''}`;
      card.innerHTML = `
        <span class="metric-name">${item.name}</span>
        <span class="metric-qty ${isLow ? 'text-danger' : 'text-accent'}">${stock.toFixed(2)} ${item.unit}</span>
        <span class="metric-reorder">Low warning limit: ${item.reorderLevel} ${item.unit}</span>
      `;
      grid.appendChild(card);
    });

    const batches = getTable('production_batches');
    const tbody = document.getElementById('production-history-body');
    tbody.innerHTML = '';

    if (batches.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 15px;">No production runs recorded yet.</td></tr>`;
      return;
    }

    batches.sort((a,b) => b.id - a.id).forEach(b => {
      const broken05 = parseInt(b.broken05L || 0, 10);
      const broken15 = parseInt(b.broken15L || 0, 10);
      const brokenTotal = broken05 + broken15;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#PROD-${b.id}</td>
        <td>${b.productionDate}</td>
        <td>${b.qty05LProduced} packs</td>
        <td>${b.qty15LProduced} packs</td>
        <td class="bold text-cyan">${parseFloat(b.sodiumConsumed || 0).toFixed(5)}</td>
        <td class="bold text-success">${parseFloat(b.calciumConsumed || 0).toFixed(5)}</td>
        <td class="bold text-warning">${parseFloat(b.magnesiumConsumed || 0).toFixed(5)}</td>
        <td class="${brokenTotal > 0 ? 'bold text-danger' : ''}">${brokenTotal > 0 ? brokenTotal : '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateProductionRunLive() {
    const q05 = parseFloat(document.getElementById('prod-qty-05l').value) || 0;
    const q15 = parseFloat(document.getElementById('prod-qty-15l').value) || 0;

    // 0.5L pack = 12 bottles × 9L = 108L water per pack
    // 1.5L pack = 6 bottles × 12L = 72L water per pack
    const totalWater = (q05 * 108) + (q15 * 72);
    // Per 15,140 L: Calcium 2 kg, Sodium 0.5 kg, Magnesium 1.0 kg
    const ratio = totalWater / 15140;
    const sodiumKg = ratio * 0.5;
    const calciumKg = ratio * 2.0;
    const magnesiumKg = ratio * 1.0;

    document.getElementById('run-water-litres').innerText = totalWater.toLocaleString();
    document.getElementById('run-sodium-kg').innerText = sodiumKg.toFixed(5);
    document.getElementById('run-calcium-kg').innerText = calciumKg.toFixed(5);
    document.getElementById('run-magnesium-kg').innerText = magnesiumKg.toFixed(5);
  }

  function updateBadanaProductionLive() {
    const size = document.getElementById('badana-prod-size').value;
    const type = document.getElementById('badana-prod-preform').value;
    const qty = parseInt(document.getElementById('badana-prod-qty').value) || 0;

    // 0.5L Mix=27g, 1.5L Mix=15g, 1.5L Pure=13g, 0.5L Pure=15g
    let preformGrams = 0;
    if (size === '0.5L' && type === 'Mix') preformGrams = 27;
    else if (size === '1.5L' && type === 'Mix') preformGrams = 15;
    else if (size === '1.5L' && type === 'Pure') preformGrams = 13;
    else if (size === '0.5L' && type === 'Pure') preformGrams = 15;

    const totalKg = (preformGrams * qty) / 1000;

    document.getElementById('run-preform-deduction').innerText = totalKg.toFixed(3);
    document.getElementById('run-bottle-addition').innerText = qty.toString();
  }

  // 5. Render Purchases & Vendors
  function renderPurchases() {
    const vendors = getTable('vendors');
    const tbody = document.getElementById('vendors-table-body');
    tbody.innerHTML = '';

    vendors.forEach(v => {
      const payable = getVendorPayable(v.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${v.name}</td>
        <td>${v.phone}</td>
        <td class="bold ${payable > 0 ? 'text-danger' : 'text-success'}">Rs. ${payable.toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-cyan btn-pay-vendor" data-id="${v.id}">Record Payment</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-pay-vendor').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'), 10);
        openVendorPaymentModal(id);
      });
    });

    // Form Dropdowns
    const vSelect = document.getElementById('purchase-vendor');
    vSelect.innerHTML = vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('');

    const isBadana = state.company === 'badana';
    const allItems = getTable('items');
    const companyItems = isBadana 
      ? allItems.filter(i => [15,16,17,18,19,20].includes(i.id))
      : allItems.filter(i => ![15,16,17,18,19,20].includes(i.id));

    const rawItems = companyItems.filter(i => i.category === 'raw_material');
    const iSelect = document.getElementById('purchase-item');
    iSelect.innerHTML = rawItems.map(i => `<option value="${i.id}">${i.name} (${i.unit})</option>`).join('');

    // Purchases Table
    const purchases = getTable('purchases');
    const ptbody = document.getElementById('purchases-table-body');
    ptbody.innerHTML = '';

    if (purchases.length === 0) {
      ptbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 15px;">No raw purchases logged yet.</td></tr>`;
      return;
    }

    purchases.sort((a,b) => b.id - a.id).forEach(p => {
      const vendorName = (vendors.find(v => v.id === p.vendorId) || {}).name || 'Unknown';
      const itemName = (rawItems.find(i => i.id === p.itemId) || {}).name || 'Unknown';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#PUR-${p.id}</td>
        <td>${p.purchasedAt}</td>
        <td>${vendorName}</td>
        <td class="bold">${itemName}</td>
        <td>${p.qty}</td>
        <td class="bold text-danger">Rs. ${p.totalCost.toLocaleString()}</td>
      `;
      ptbody.appendChild(tr);
    });
  }

  function openVendorPaymentModal(vendorId) {
    const vendors = getTable('vendors');
    const v = vendors.find(x => x.id === vendorId);
    if (!v) return;

    const payable = getVendorPayable(vendorId);

    document.getElementById('pay-vendor-id').value = vendorId;
    document.getElementById('pay-vendor-name').innerText = v.name;
    document.getElementById('pay-vendor-balance').innerText = `Rs. ${payable.toLocaleString()}`;
    document.getElementById('pay-vendor-amount').value = payable;

    document.getElementById('modal-vendor-payment').classList.remove('hidden');
  }

  // 6. Render Expenses & Counter Sales Logs
  function renderExpenses(filter = '') {
    const expenses = getTable('expenses');
    const tbody = document.getElementById('expenses-table-log-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Apply category filter
    let filtered = expenses.filter(e => e.type !== 'spot_sale'); // only real expenses
    if (filter && filter !== 'all' && filter !== '') {
      filtered = filtered.filter(e => e.type === filter);
    } else if (!filter || filter === 'all') {
      filtered = expenses; // show all including spot sales
    }

    // Update the expense-type dropdown to match filter
    const typeSelect = document.getElementById('expense-type');
    if (typeSelect && filter && filter !== 'all') {
      typeSelect.value = filter;
    }

    const sorted = filtered.sort((a,b) => b.id - a.id);
    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px;">No ${filter && filter !== 'all' ? filter.replace('_', ' ') : ''} expenses logged.</td></tr>`;
    } else {
      sorted.forEach(e => {
        let typeLabel = '';
        let amountLabel = '';
        let details = e.remarks || '';
        let payMethod = e.paymentMethod || 'Cash';

        if (e.type === 'spot_sale') {
          typeLabel = `<span class="badge badge-success">Spot Sale</span>`;
          const cash = parseFloat(e.cashReceived || 0);
          amountLabel = `<span class="bold text-success">+ Rs. ${cash.toLocaleString()}</span>`;
          details += ` (${e.litresSold}L sold, ${e.capsSold} caps)`;
        } else {
          const catLabels = { fuel: 'Fuel', salaries: 'Salaries', electricity: 'Electricity', plant_rent: 'Plant Rent', vehicle_repair: 'Vehicle Repair', machine_repair: 'Machine Repair', misc: 'Misc' };
          const catLabel = catLabels[e.type] || e.type;
          typeLabel = `<span class="badge badge-danger">${catLabel}</span>`;
          const amt = parseFloat(e.amount || 0);
          amountLabel = `<span class="bold text-danger">- Rs. ${amt.toLocaleString()}</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${typeLabel}</td>
          <td>${e.date || '—'}</td>
          <td>${amountLabel}</td>
          <td>${details}</td>
          <td>${e.photoData ? '<span class="badge badge-success">📎 Attached</span>' : '—'}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Populate spot sale customer select options
    const select = document.getElementById('spot-customer');
    if (select) {
      const customers = getTable('customers');
      select.innerHTML = '<option value="">-- Cash Sale Only --</option>' +
        customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');
    }
  }

  // 7. Render Daily Closing
  function renderDailyClosing(filter = '') {
    const closings = getTable('daily_closings');
    const tbody = document.getElementById('closings-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Show the correct sub-view based on filter
    const form = document.getElementById('daily-closing-form');
    const adminForm = document.getElementById('admin-closing-checklist-form');

    // Auto-check and focus inputs based on verification selection
    if (filter === 'close') {
      if (form) form.classList.remove('hidden');
      if (adminForm) adminForm.classList.add('hidden');
    } else if (filter === 'checklist' || filter === 'stock' || filter === 'production' || filter === 'orders' || filter === 'cash' || filter === 'materials' || filter === 'materials_usage' || filter === 'deliveries' || filter === 'payments' || filter === 'purchases' || filter === 'expenses') {
      if (form) form.classList.add('hidden');
      if (adminForm) adminForm.classList.remove('hidden');

      const chkStock = document.getElementById('chk-closing-stock');
      const chkProd = document.getElementById('chk-closing-prod');
      const chkOrders = document.getElementById('chk-closing-orders');
      const chkCash = document.getElementById('chk-closing-cash');

      if ((filter === 'stock' || filter === 'purchases' || filter === 'materials') && chkStock) {
        chkStock.checked = true;
        chkStock.focus();
        chkStock.parentElement.style.outline = '2px solid var(--cyan-primary)';
        setTimeout(() => { chkStock.parentElement.style.outline = 'none'; }, 2000);
      } else if ((filter === 'production' || filter === 'materials_usage') && chkProd) {
        chkProd.checked = true;
        chkProd.focus();
        chkProd.parentElement.style.outline = '2px solid var(--cyan-primary)';
        setTimeout(() => { chkProd.parentElement.style.outline = 'none'; }, 2000);
      } else if ((filter === 'orders' || filter === 'deliveries') && chkOrders) {
        chkOrders.checked = true;
        chkOrders.focus();
        chkOrders.parentElement.style.outline = '2px solid var(--cyan-primary)';
        setTimeout(() => { chkOrders.parentElement.style.outline = 'none'; }, 2000);
      } else if ((filter === 'cash' || filter === 'payments' || filter === 'expenses') && chkCash) {
        chkCash.checked = true;
        chkCash.focus();
        chkCash.parentElement.style.outline = '2px solid var(--cyan-primary)';
        setTimeout(() => { chkCash.parentElement.style.outline = 'none'; }, 2000);
      }
    } else {
      // Default: show both for owner
      if (state.role === 'owner') {
        if (form) form.classList.remove('hidden');
        if (adminForm) adminForm.classList.add('hidden');
      } else if (state.role === 'admin') {
        if (form) form.classList.add('hidden');
        if (adminForm) adminForm.classList.remove('hidden');
      }
    }

    // Always populate the closings history table
    if (closings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 15px;">No closed days ledger entries yet.</td></tr>`;
      return;
    }

    closings.sort((a,b) => b.id - a.id).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.id || '—'}</td>
        <td>${c.date}</td>
        <td>${c.totalDeliveries || 0}</td>
        <td class="text-cyan bold">Rs. ${(c.salesValue || 0).toLocaleString()}</td>
        <td class="text-success bold">${c.closedByRole || 'owner'}</td>
        <td><span class="badge ${c.adminVerified ? 'badge-success' : 'badge-warning'}">${c.adminVerified ? '✅ Verified' : '⏳ Pending'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateDailyClosingCalculations() {
    const isOwner = (state.role === 'owner');
    const dateInputId = isOwner ? 'closing-date' : 'closing-date-admin';
    const dateInput = document.getElementById(dateInputId);
    const dateVal = dateInput ? dateInput.value : '';
    if (!dateVal) return;

    const deliveries = getTable('deliveries');
    const payments = getTable('payments');
    const orders = getTable('orders');
    const expenses = getTable('expenses');

    let deliveryCount = 0;
    let sales = 0;
    let cashCollected = 0;
    let expenseTotal = 0;

    deliveries.forEach(d => {
      if (d.deliveredAt && d.deliveredAt.startsWith(dateVal)) {
        deliveryCount++;
        const order = orders.find(o => o.id === d.orderId);
        if (order) {
          if (order.orderType === '19L') {
            sales += parseFloat(d.qtyDelivered) * parseFloat(order.unitPrice || 250);
          } else {
            sales += (parseFloat(d.qty05LDelivered || 0) * parseFloat(order.unitPrice05L || 500)) + 
                     (parseFloat(d.qty15LDelivered || 0) * parseFloat(order.unitPrice15L || 450));
          }
        }
      }
    });

    payments.forEach(p => {
      if (p.receivedAt && p.receivedAt.startsWith(dateVal)) {
        cashCollected += parseFloat(p.amount);
      }
    });

    expenses.forEach(e => {
      if (e.date && e.date.startsWith(dateVal)) {
        if (e.type === 'expense') {
          expenseTotal += parseFloat(e.amount);
        } else if (e.type === 'spot_sale') {
          const cash = parseFloat(e.cashReceived || 0);
          const credit = parseFloat(e.creditAmount || 0);
          sales += (cash + credit);
          cashCollected += cash;
        }
      }
    });

    const netValue = cashCollected - expenseTotal;

    document.getElementById('close-delivery-count').innerText = deliveryCount;
    document.getElementById('close-sales-value').innerText = `Rs. ${sales.toLocaleString()}`;
    document.getElementById('close-cash-value').innerText = `Rs. ${cashCollected.toLocaleString()}`;
    document.getElementById('close-expense-value').innerText = `Rs. ${expenseTotal.toLocaleString()}`;
    document.getElementById('close-net-value').innerText = `Rs. ${netValue.toLocaleString()}`;
    document.getElementById('close-net-value').className = `bold ${netValue >= 0 ? 'text-success' : 'text-danger'}`;
  }

  // 8. Render Blowing Division Tab
  function renderBlowing() {
    const data = getBlowingStock();
    document.getElementById('blow-stat-pure-preform').innerText = `${data.preforms.pure.toFixed(2)} kg`;
    document.getElementById('blow-stat-mix-preform').innerText = `${data.preforms.mix.toFixed(2)} kg`;

    const brands = ['AquaSphere', 'Deosai', 'Pivrifine', 'Dasani'];
    const sizes = ['0.5L', '1.5L'];
    const types = ['pure', 'mix'];

    const tbody = document.getElementById('blow-inventory-body');
    tbody.innerHTML = '';

    brands.forEach(b => {
      sizes.forEach(s => {
        types.forEach(t => {
          if (b === 'AquaSphere' && t === 'mix') return; // AquaSphere has pure only

          const factKey = `${b}_${s}_${t}_factory`;
          const wareKey = `${b}_${s}_${t}_warehouse`;

          const fStock = data.bottles[factKey] || 0;
          const wStock = data.bottles[wareKey] || 0;

          if (fStock > 0 || wStock > 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="bold">${b}</td>
              <td>${s}</td>
              <td><span class="badge ${t === 'pure' ? 'badge-home' : 'badge-rest'}">${t}</span></td>
              <td class="bold">${fStock}</td>
              <td class="bold">${wStock}</td>
            `;
            tbody.appendChild(tr);
          }
        });
      });
    });

    if (tbody.innerHTML === '') {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px;">Blowing inventory stock ledger is empty.</td></tr>`;
    }
  }

  // ── NEW ROLE-SPECIFIC RENDER FUNCTIONS ──────────────────────────────────

  // Vendors standalone tab
  function renderVendors() {
    const vendors = getTable('vendors');
    const tbody = document.getElementById('vendors-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (vendors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:15px;">No vendors registered yet.</td></tr>`;
      return;
    }
    vendors.forEach(v => {
      const payable = getVendorPayable(v.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${v.name}</td>
        <td>${v.phone || '—'}</td>
        <td class="bold ${payable > 0 ? 'text-danger' : 'text-success'}">Rs. ${payable.toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-cyan btn-pay-vendor" data-id="${v.id}">Record Payment</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-pay-vendor').forEach(btn => {
      btn.addEventListener('click', e => openVendorPaymentModal(parseInt(e.target.getAttribute('data-id'), 10)));
    });
  }

  // Counter Sales standalone tab
  function renderCounterSales() {
    const expenses = getTable('expenses');
    const spotSales = expenses.filter(e => e.type === 'spot_sale').sort((a,b) => b.id - a.id);
    const tbody = document.getElementById('spot-sales-table-log-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (spotSales.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:15px;">No counter / spot sales recorded yet.</td></tr>`;
      return;
    }
    spotSales.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.date}</td>
        <td>${e.litresSold || 0}L</td>
        <td>${e.capsSold || 0}</td>
        <td class="bold text-success">Rs. ${(e.cashReceived || 0).toLocaleString()}</td>
        <td class="bold text-warning">Rs. ${(e.creditAmount || 0).toLocaleString()}</td>
        <td>${e.remarks || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }


  // Inventory Summary (view-only — Owner and Admin and PM)
  function renderInventorySummary() {
    const items = getTable('items');
    const txns = getTable('inventory_transactions');

    // Raw Materials
    const rawBody = document.getElementById('inventory-raw-materials-body');
    if (rawBody) {
      rawBody.innerHTML = '';
      const rawItems = items.filter(i => i.category === 'raw_material');
      if (rawItems.length === 0) {
        rawBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:15px;">No raw materials tracked.</td></tr>`;
      } else {
        rawItems.forEach(item => {
          const balance = txns
            .filter(t => t.itemId === item.id)
            .reduce((sum, t) => sum + (t.type === 'in' ? t.qty : -t.qty), 0);
          const safetyLevel = item.safetyLevel || 0;
          const statusBadge = balance <= 0
            ? `<span class="badge badge-danger">Out of Stock</span>`
            : balance < safetyLevel
            ? `<span class="badge badge-warning">Low Stock</span>`
            : `<span class="badge badge-success">OK</span>`;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="bold">${item.name}</td>
            <td>${item.category}</td>
            <td class="bold">${balance} ${item.unit}</td>
            <td>${safetyLevel} ${item.unit}</td>
            <td>${statusBadge}</td>
          `;
          rawBody.appendChild(tr);
        });
      }
    }

    // Finished Goods (PET packs etc.)
    const fgBody = document.getElementById('inventory-finished-goods-body');
    if (fgBody) {
      fgBody.innerHTML = '';
      const blowData = getBlowingStock();
      const brands = ['AquaSphere', 'Deosai', 'Pivrifine', 'Dasani'];
      const sizes = ['0.5L', '1.5L'];
      const types = ['pure', 'mix'];
      let hasRows = false;
      brands.forEach(b => {
        sizes.forEach(s => {
          types.forEach(t => {
            if (b === 'AquaSphere' && t === 'mix') return;
            const factKey = `${b}_${s}_${t}_factory`;
            const wareKey = `${b}_${s}_${t}_warehouse`;
            const fStock = blowData.bottles[factKey] || 0;
            const wStock = blowData.bottles[wareKey] || 0;
            if (fStock > 0 || wStock > 0) {
              hasRows = true;
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td class="bold">${b} ${s} ${t}</td>
                <td><span class="badge ${t === 'pure' ? 'badge-home' : 'badge-rest'}">${t}</span></td>
                <td>${fStock}</td>
                <td>${fStock}</td>
                <td>${wStock}</td>
              `;
              fgBody.appendChild(tr);
            }
          });
        });
      });
      if (!hasRows) {
        fgBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:15px;">No finished PET stock recorded yet.</td></tr>`;
      }
    }
  }

  // Cash Summary (Admin-only)
  function renderCashSummary() {
    const today = new Date().toISOString().split('T')[0];
    const payments = getTable('payments').filter(p => p.paidAt === today);
    const expenses = getTable('expenses').filter(e => e.date === today);

    let totalSales = 0;
    let totalCollected = 0;
    let totalExpenses = 0;

    const orders = getTable('orders');
    orders.forEach(o => {
      if (o.expectedDelivery === today) totalSales += o.chargedAmount || 0;
    });
    payments.forEach(p => { totalCollected += p.amount || 0; });
    expenses.filter(e => e.type !== 'spot_sale').forEach(e => { totalExpenses += e.amount || 0; });
    const spotIncome = expenses.filter(e => e.type === 'spot_sale').reduce((s,e) => s + (e.cashReceived || 0), 0);
    totalCollected += spotIncome;

    const netDelta = totalCollected - totalExpenses;

    const salesEl = document.getElementById('cash-summary-sales');
    const collectedEl = document.getElementById('cash-summary-collected');
    const expensesEl = document.getElementById('cash-summary-expenses');
    const netEl = document.getElementById('cash-summary-net');
    if (salesEl) salesEl.innerText = `Rs. ${totalSales.toLocaleString()}`;
    if (collectedEl) collectedEl.innerText = `Rs. ${totalCollected.toLocaleString()}`;
    if (expensesEl) expensesEl.innerText = `Rs. ${totalExpenses.toLocaleString()}`;
    if (netEl) {
      netEl.innerText = `Rs. ${netDelta.toLocaleString()}`;
      netEl.className = `value ${netDelta >= 0 ? 'text-success' : 'text-danger'}`;
    }

    // Build transaction ledger
    const tbody = document.getElementById('cash-summary-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = [];
    payments.forEach(p => {
      const cust = getTable('customers').find(c => c.id === p.customerId);
      rows.push({ time: p.paidAt, cat: 'Customer Payment', ref: cust ? cust.name : `ID:${p.customerId}`, mode: p.mode || 'cash', income: p.amount, expense: 0 });
    });
    expenses.filter(e => e.type === 'spot_sale').forEach(e => {
      rows.push({ time: e.date, cat: 'Counter Sale', ref: `${e.litresSold}L`, mode: 'cash', income: e.cashReceived || 0, expense: 0 });
    });
    expenses.filter(e => e.type !== 'spot_sale').forEach(e => {
      rows.push({ time: e.date, cat: `Expense: ${e.type}`, ref: e.remarks || '—', mode: 'cash', income: 0, expense: e.amount || 0 });
    });

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:15px;">No transactions recorded for today.</td></tr>`;
      return;
    }

    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.time}</td>
        <td>${r.cat}</td>
        <td class="bold">${r.ref}</td>
        <td><span class="badge badge-muted">${r.mode}</span></td>
        <td class="bold text-success">${r.income > 0 ? `Rs. ${r.income.toLocaleString()}` : '—'}</td>
        <td class="bold text-danger">${r.expense > 0 ? `Rs. ${r.expense.toLocaleString()}` : '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Production History (PM-only)
  function renderProductionHistory() {
    const productions = getTable('production_batches');
    const tbody = document.getElementById('production-history-seg-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (productions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:15px;">No production batches logged yet.</td></tr>`;
      return;
    }
    productions.sort((a,b) => b.id - a.id).forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#BATCH-${p.id}</td>
        <td>${p.date}</td>
        <td>${p.qty05L || 0} packs</td>
        <td>${p.qty15L || 0} packs</td>
        <td>${p.sodiumKg ? p.sodiumKg.toFixed(4) : '—'}</td>
        <td>${p.calciumKg ? p.calciumKg.toFixed(4) : '—'}</td>
        <td>${p.magnesiumKg ? p.magnesiumKg.toFixed(4) : '—'}</td>
        <td>${p.brokenEmpty || 0}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Raw Materials (PM-only) — show stock card grid
  function renderRawMaterials() {
    const items = getTable('items').filter(i => i.category === 'raw_material');
    const txns = getTable('inventory_transactions');
    const grid = document.getElementById('raw-materials-status-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (items.length === 0) {
      grid.innerHTML = `<p class="description-text">No raw materials configured in items registry.</p>`;
      return;
    }
    items.forEach(item => {
      const balance = txns
        .filter(t => t.itemId === item.id)
        .reduce((sum, t) => sum + (t.type === 'in' ? t.qty : -t.qty), 0);
      const safetyLevel = item.safetyLevel || 0;
      const isLow = balance < safetyLevel;
      const isOut = balance <= 0;
      const statusClass = isOut ? 'status-out' : isLow ? 'status-low' : 'status-ok';
      const statusLabel = isOut ? '⛔ Out' : isLow ? '⚠️ Low' : '✅ OK';
      const card = document.createElement('div');
      card.className = `material-card ${statusClass}`;
      card.innerHTML = `
        <div class="material-name">${item.name}</div>
        <div class="material-balance">${balance} <span class="material-unit">${item.unit}</span></div>
        <div class="material-safety">Safety Level: ${safetyLevel} ${item.unit}</div>
        <div class="material-status">${statusLabel}</div>
      `;
      grid.appendChild(card);
    });
  }

  // Finished Goods (PM-only) — packed PET bottles
  function renderFinishedGoods() {
    const productions = getTable('production_batches');
    const tbody = document.getElementById('finished-goods-status-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Calculate cumulative from production logs
    let total05L = 0, total15L = 0;
    productions.forEach(p => {
      total05L += p.qty05L || 0;
      total15L += p.qty15L || 0;
    });

    const deliveries = getTable('deliveries');
    let deliv05L = 0, deliv15L = 0;
    deliveries.forEach(d => {
      deliv05L += parseInt(d.qty05LDelivered || 0, 10);
      deliv15L += parseInt(d.qty15LDelivered || 0, 10);
    });

    const avail05 = total05L - deliv05L;
    const avail15 = total15L - deliv15L;

    const rows = [
      { sku: 'AquaSphere 0.5L PET Pack (12 bottles)', vol: '0.5L', loc: 'Factory / Warehouse', stock: avail05 },
      { sku: 'AquaSphere 1.5L PET Pack (6 bottles)', vol: '1.5L', loc: 'Factory / Warehouse', stock: avail15 }
    ];
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${r.sku}</td>
        <td>${r.vol}</td>
        <td>${r.loc}</td>
        <td class="bold ${r.stock <= 0 ? 'text-danger' : 'text-success'}">${r.stock} packs</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Broken Bottles log (PM-only)
  function renderBrokenBottlesLog() {
    const blowTxns = getTable('blowing_transactions').filter(t => t.qty < 0 || (t.remarks && t.remarks.toLowerCase().includes('broke')));
    const tbody = document.getElementById('broken-bottles-log-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (blowTxns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:15px;">No broken bottle records found.</td></tr>`;
      return;
    }
    blowTxns.sort((a,b) => b.id - a.id).forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.date || '—'}</td>
        <td class="bold">${t.brand || '—'} ${t.size || ''} ${t.type || ''}</td>
        <td class="bold text-danger">${Math.abs(t.qty)}</td>
        <td>${t.stage || 'Production'}</td>
        <td>${t.company || 'AquaSphere'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // New Order form (MM-only) — populate customer select
  function renderNewOrderForm() {
    const customers = getTable('customers');
    const select = document.getElementById('new-order-cust');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose Customer --</option>' +
      customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');

    // Tab switcher within the form
    const btn19l = document.getElementById('std-order-19l-btn');
    const btnPet = document.getElementById('std-order-pet-btn');
    const row19l = document.getElementById('std-row-19l-inputs');
    const rowPet = document.getElementById('std-row-pet-inputs');
    const typeInput = document.getElementById('std-order-type-val');

    if (btn19l && !btn19l.dataset.bound) {
      btn19l.dataset.bound = '1';
      btn19l.addEventListener('click', () => {
        btn19l.classList.add('active'); btnPet.classList.remove('active');
        row19l.classList.remove('hidden'); rowPet.classList.add('hidden');
        typeInput.value = '19L';
        updateStandaloneOrderCharged();
      });
      btnPet.addEventListener('click', () => {
        btnPet.classList.add('active'); btn19l.classList.remove('active');
        rowPet.classList.remove('hidden'); row19l.classList.add('hidden');
        typeInput.value = 'PET';
        updateStandaloneOrderCharged();
      });
      ['std-order-qty-19l','std-order-price-19l','std-order-qty-05l','std-order-price-05l','std-order-qty-15l','std-order-price-15l'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateStandaloneOrderCharged);
      });
    }
    updateStandaloneOrderCharged();
  }

  function updateStandaloneOrderCharged() {
    const type = (document.getElementById('std-order-type-val') || {}).value;
    let charged = 0;
    if (type === '19L') {
      const qty = parseFloat(document.getElementById('std-order-qty-19l').value) || 0;
      const price = parseFloat(document.getElementById('std-order-price-19l').value) || 0;
      charged = qty * price;
    } else {
      const q05 = parseFloat(document.getElementById('std-order-qty-05l').value) || 0;
      const p05 = parseFloat(document.getElementById('std-order-price-05l').value) || 0;
      const q15 = parseFloat(document.getElementById('std-order-qty-15l').value) || 0;
      const p15 = parseFloat(document.getElementById('std-order-price-15l').value) || 0;
      charged = (q05 * p05) + (q15 * p15);
    }
    const chargedEl = document.getElementById('std-order-charged-amount');
    if (chargedEl) chargedEl.value = charged;
  }

  // Deliveries log (MM-only)
  function renderDeliveriesLog() {
    const deliveries = getTable('deliveries');
    const customers = getTable('customers');
    const orders = getTable('orders');
    const tbody = document.getElementById('deliveries-seg-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (deliveries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:15px;">No deliveries logged yet.</td></tr>`;
      return;
    }
    deliveries.sort((a,b) => b.id - a.id).forEach(d => {
      const order = orders.find(o => o.id === d.orderId);
      const custId = order ? order.customerId : null;
      const custName = custId ? (customers.find(c => c.id === custId) || {}).name || `ID:${custId}` : '—';
      const qtyLabel = d.qtyDelivered > 0 ? `${d.qtyDelivered} × 19L` : `${d.qty05LDelivered || 0}×0.5L / ${d.qty15LDelivered || 0}×1.5L`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#DEL-${d.id}</td>
        <td>${d.deliveredAt || '—'}</td>
        <td class="bold">${custName}</td>
        <td>${qtyLabel}</td>
        <td>${d.emptyReturned || 0}</td>
        <td class="bold text-success">Rs. ${(d.cashCollected || 0).toLocaleString()}</td>
        <td>${d.remarks || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Payments tab (MM and Accountant)
  function renderPaymentsTab() {
    const customers = getTable('customers');
    const payments = getTable('payments');

    // Populate customer select
    const select = document.getElementById('post-pay-cust');
    if (select) {
      select.innerHTML = '<option value="">-- Choose Customer --</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    // Set today's date default
    const dateEl = document.getElementById('post-pay-date');
    if (dateEl && !dateEl.value) dateEl.value = new Date().toISOString().split('T')[0];

    // Render payments log
    const tbody = document.getElementById('payments-seg-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (payments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:15px;">No payments recorded yet.</td></tr>`;
      return;
    }
    payments.sort((a,b) => b.id - a.id).forEach(p => {
      const cust = customers.find(c => c.id === p.customerId);
      const custName = cust ? cust.name : `ID:${p.customerId}`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#PAY-${p.id}</td>
        <td>${p.paidAt}</td>
        <td class="bold">${custName}</td>
        <td class="bold text-success">Rs. ${(p.amount || 0).toLocaleString()}</td>
        <td><span class="badge badge-muted">${p.mode || 'cash'}</span></td>
        <td>${p.reference || p.remarks || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Invoices tab (MM and Accountant)
  function renderInvoicesTab() {
    const customers = getTable('customers');
    const tbody = document.getElementById('invoices-seg-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const withBalance = customers
      .map(c => ({ ...c, bal: getCustomerBalances(c.id) }))
      .sort((a,b) => b.bal.outstanding - a.bal.outstanding);
    if (withBalance.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:15px;">No customers registered.</td></tr>`;
      return;
    }
    withBalance.forEach(c => {
      const limitStatus = c.creditLimit > 0
        ? (c.bal.outstanding >= c.creditLimit
          ? `<span class="badge badge-danger">Limit Exceeded</span>`
          : `<span class="badge badge-success">Within Limit</span>`)
        : `<span class="badge badge-muted">No Limit Set</span>`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td class="bold ${c.bal.outstanding > 0 ? 'text-danger' : 'text-success'}">Rs. ${c.bal.outstanding.toLocaleString()}</td>
        <td>${c.bal.bottlesHeld || 0}</td>
        <td>${limitStatus}</td>
        <td>
          <button class="btn btn-sm btn-cyan" onclick="document.getElementById('tab-crm').classList.add('active');">
            View CRM
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Search tab (MM-only unified search)
  function renderSearchTab() {
    const input = document.getElementById('unified-search-input');
    if (input && !input.dataset.bound) {
      input.dataset.bound = '1';
      input.addEventListener('input', runUnifiedSearch);
    }
  }

  function runUnifiedSearch() {
    const query = (document.getElementById('unified-search-input').value || '').toLowerCase().trim();
    const results = document.getElementById('unified-search-results');
    if (!results) return;
    if (!query) {
      results.innerHTML = `<p class="description-text">Type above to query the ledger database.</p>`;
      return;
    }
    const customers = getTable('customers');
    const orders = getTable('orders');
    const payments = getTable('payments');
    const deliveries = getTable('deliveries');

    const matchedCustomers = customers.filter(c =>
      c.name.toLowerCase().includes(query) || (c.phone || '').includes(query)
    );
    const matchedOrders = orders.filter(o =>
      String(o.id).includes(query) || (o.remarks || '').toLowerCase().includes(query)
    );
    const matchedPayments = payments.filter(p =>
      String(p.id).includes(query) || (p.reference || '').toLowerCase().includes(query)
    );

    let html = '';
    if (matchedCustomers.length > 0) {
      html += `<h3 class="search-section-title">Customers (${matchedCustomers.length})</h3><ul class="search-list">`;
      matchedCustomers.forEach(c => {
        const bal = getCustomerBalances(c.id);
        html += `<li><span class="bold">${c.name}</span> — ${c.phone} — Balance: <span class="${bal.outstanding > 0 ? 'text-danger' : 'text-success'}">Rs. ${bal.outstanding.toLocaleString()}</span></li>`;
      });
      html += `</ul>`;
    }
    if (matchedOrders.length > 0) {
      html += `<h3 class="search-section-title">Orders (${matchedOrders.length})</h3><ul class="search-list">`;
      matchedOrders.forEach(o => {
        const cust = customers.find(c => c.id === o.customerId);
        html += `<li><span class="bold">#ORD-${o.id}</span> — ${cust ? cust.name : 'Unknown'} — ${o.deliveryStatus} — Rs. ${(o.chargedAmount || 0).toLocaleString()}</li>`;
      });
      html += `</ul>`;
    }
    if (matchedPayments.length > 0) {
      html += `<h3 class="search-section-title">Payments (${matchedPayments.length})</h3><ul class="search-list">`;
      matchedPayments.forEach(p => {
        const cust = customers.find(c => c.id === p.customerId);
        html += `<li><span class="bold">#PAY-${p.id}</span> — ${cust ? cust.name : 'Unknown'} — Rs. ${(p.amount || 0).toLocaleString()} — ${p.paidAt}</li>`;
      });
      html += `</ul>`;
    }
    if (!html) html = `<p class="description-text">No results found for "<strong>${query}</strong>".</p>`;
    results.innerHTML = html;
  }

  // Reports tab (Owner and Accountant)
  function renderReports(filter = '') {
    const el = document.getElementById('tab-reports');
    if (!el) return;

    if (filter) {
      if (filter === 'daily' || filter === 'weekly' || filter === 'monthly' || filter === 'yearly') {
        state.reportPeriod = filter;
      } else {
        state.reportType = filter;
      }
    }

    const reportType = state.reportType || 'sales';
    const reportPeriod = state.reportPeriod || 'monthly';

    // Highlight report type buttons
    document.querySelectorAll('#report-type-tabs .subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.reportType === reportType);
    });
    // Highlight report period buttons
    document.querySelectorAll('#report-period-tabs .subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.reportPeriod === reportPeriod);
    });

    const fromEl = document.getElementById('rpt-from');
    const toEl = document.getElementById('rpt-to');

    // Auto-update from/to based on period selection
    if (reportPeriod) {
      const todayDate = new Date();
      const toVal = todayDate.toISOString().split('T')[0];
      let fromVal = toVal;
      if (reportPeriod === 'weekly') {
        const d = new Date();
        d.setDate(todayDate.getDate() - 7);
        fromVal = d.toISOString().split('T')[0];
      } else if (reportPeriod === 'monthly') {
        const d = new Date();
        d.setDate(todayDate.getDate() - 30);
        fromVal = d.toISOString().split('T')[0];
      } else if (reportPeriod === 'yearly') {
        const d = new Date();
        d.setDate(todayDate.getDate() - 365);
        fromVal = d.toISOString().split('T')[0];
      }
      if (fromEl) fromEl.value = fromVal;
      if (toEl) toEl.value = toVal;
    }

    const from = fromEl && fromEl.value ? fromEl.value : null;
    const today = new Date().toISOString().split('T')[0];
    const to = toEl && toEl.value ? toEl.value : today;

    // Use reportType as active filter
    const activeFilter = reportType;

    // Load base data
    const orders = getTable('orders');
    const deliveries = getTable('deliveries');
    const expenses = getTable('expenses').filter(e => e.type !== 'spot_sale');
    const spotSales = getTable('expenses').filter(e => e.type === 'spot_sale');
    const payments = getTable('payments');
    const customers = getTable('customers');
    const vendors = getTable('vendors');
    const runs = getTable('production_batches');
    const purchases = getTable('purchases');

    // Compute base KPIs
    let totalRevenue = 0;
    deliveries.forEach(del => {
      const ord = orders.find(o => o.id === del.orderId);
      if (ord) totalRevenue += parseFloat(del.qtyDelivered || 0) * parseFloat(ord.pricePerUnit || ord.unitPrice || 250);
    });
    spotSales.forEach(s => { totalRevenue += parseFloat(s.cashReceived || 0) + parseFloat(s.creditAmount || 0); });

    let totalExpenses = 0;
    expenses.forEach(e => { totalExpenses += parseFloat(e.amount || 0); });

    const netProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // Update KPI cards
    const kpiRevEl = document.getElementById('rpt-kpi-revenue');
    const kpiExpEl = document.getElementById('rpt-kpi-expenses');
    const kpiProfEl = document.getElementById('rpt-kpi-profit');
    const kpiMarEl = document.getElementById('rpt-kpi-margin');
    if (kpiRevEl) kpiRevEl.innerText = `Rs. ${totalRevenue.toLocaleString()}`;
    if (kpiExpEl) kpiExpEl.innerText = `Rs. ${totalExpenses.toLocaleString()}`;
    if (kpiProfEl) { kpiProfEl.innerText = `Rs. ${netProfit.toLocaleString()}`; kpiProfEl.className = `value ${netProfit >= 0 ? 'text-success' : 'text-danger'}`; }
    if (kpiMarEl) kpiMarEl.innerText = `${margin}%`;

    // Build chart & table based on filter
    const chart = document.getElementById('rpt-chart');
    const tbody = document.getElementById('rpt-tbody');
    const chartTitle = document.getElementById('rpt-chart-title');
    const tableTitle = document.getElementById('rpt-table-title');
    if (!chart || !tbody) return;

    if (activeFilter === 'sales') {
      if (chartTitle) chartTitle.innerText = 'Sales Revenue (Last 7 Days)';
      if (tableTitle) tableTitle.innerText = 'Sales Transactions';

      // Chart: last 7 days
      const last7 = [];
      for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); last7.push(d.toISOString().split('T')[0]); }
      let maxV = 1000;
      const dayVals = last7.map(day => {
        let v = 0;
        deliveries.forEach(del => { if (del.deliveredAt && del.deliveredAt.startsWith(day)) { const ord = orders.find(o => o.id === del.orderId); if (ord) v += parseFloat(del.qtyDelivered || 0) * parseFloat(ord.pricePerUnit || ord.unitPrice || 250); } });
        spotSales.forEach(s => { if (s.date === day) v += parseFloat(s.cashReceived || 0) + parseFloat(s.creditAmount || 0); });
        if (v > maxV) maxV = v;
        return { day, v };
      });
      chart.innerHTML = dayVals.map(item => `<div class="chart-bar-item"><span class="chart-bar-value">Rs. ${item.v.toLocaleString()}</span><div class="chart-bar-fill" style="height:${Math.max((item.v/maxV)*100, 2)}%; background:var(--cyan-primary);"></div><span class="chart-bar-label">${item.day.slice(5)}</span></div>`).join('');

      // Table: deliveries
      tbody.innerHTML = '';
      if (deliveries.length === 0 && spotSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No sales recorded yet.</td></tr>';
      } else {
        deliveries.slice().reverse().slice(0, 30).forEach(del => {
          const ord = orders.find(o => o.id === del.orderId);
          const cust = customers.find(c => c.id === (ord ? ord.customerId : null));
          const revenue = parseFloat(del.qtyDelivered || 0) * parseFloat(ord ? (ord.pricePerUnit || ord.unitPrice || 250) : 250);
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${del.deliveredAt ? del.deliveredAt.split('T')[0] : '—'}</td><td>${cust ? cust.name : 'Unknown'}</td><td>${ord ? ord.orderType : '—'}</td><td class="bold text-cyan">Rs. ${revenue.toLocaleString()}</td><td>${del.paymentCollectedBy || '—'}</td>`;
          tbody.appendChild(tr);
        });
      }

    } else if (activeFilter === 'expense') {
      if (chartTitle) chartTitle.innerText = 'Expense Breakdown by Category';
      if (tableTitle) tableTitle.innerText = 'Expense Records';

      const cats = { fuel: 0, salaries: 0, electricity: 0, plant_rent: 0, vehicle_repair: 0, machine_repair: 0, misc: 0 };
      expenses.forEach(e => { if (cats[e.type] !== undefined) cats[e.type] += parseFloat(e.amount || 0); });
      const maxC = Math.max(...Object.values(cats)) || 1000;
      const catNames = { fuel: 'Fuel', salaries: 'Salaries', electricity: 'Electricity', plant_rent: 'Rent', vehicle_repair: 'Vehicle', machine_repair: 'Machines', misc: 'Misc' };
      const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#6b7280'];
      let ci = 0;
      chart.innerHTML = Object.entries(cats).map(([k, v]) => `<div class="chart-bar-item"><span class="chart-bar-value">Rs. ${v.toLocaleString()}</span><div class="chart-bar-fill" style="height:${Math.max((v/maxC)*100, 2)}%; background:${colors[ci++ % colors.length]};"></div><span class="chart-bar-label">${catNames[k]}</span></div>`).join('');

      tbody.innerHTML = '';
      expenses.slice().reverse().slice(0, 30).forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${e.date || '—'}</td><td>${e.remarks || '—'}</td><td><span class="badge badge-danger">${catNames[e.type] || e.type}</span></td><td class="bold text-danger">Rs. ${parseFloat(e.amount || 0).toLocaleString()}</td><td>${e.paymentMethod || 'Cash'}</td>`;
        tbody.appendChild(tr);
      });
      if (expenses.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No expenses logged yet.</td></tr>';

    } else if (activeFilter === 'profit') {
      if (chartTitle) chartTitle.innerText = 'Revenue vs Expenses';
      if (tableTitle) tableTitle.innerText = 'Profit Summary';
      const maxV = Math.max(totalRevenue, totalExpenses) || 1000;
      chart.innerHTML = `<div class="chart-bar-item" style="flex:1"><span class="chart-bar-value">Rs. ${totalRevenue.toLocaleString()}</span><div class="chart-bar-fill" style="height:${(totalRevenue/maxV)*100}%; background:var(--color-success); width:60%"></div><span class="chart-bar-label">Revenue</span></div><div class="chart-bar-item" style="flex:1"><span class="chart-bar-value">Rs. ${totalExpenses.toLocaleString()}</span><div class="chart-bar-fill" style="height:${(totalExpenses/maxV)*100}%; background:var(--color-danger); width:60%"></div><span class="chart-bar-label">Expenses</span></div><div class="chart-bar-item" style="flex:1"><span class="chart-bar-value">Rs. ${netProfit.toLocaleString()}</span><div class="chart-bar-fill" style="height:${Math.max((Math.abs(netProfit)/maxV)*100,2)}%; background:${netProfit>=0?'var(--cyan-primary)':'#ef4444'}; width:60%"></div><span class="chart-bar-label">Net Profit</span></div>`;
      tbody.innerHTML = `<tr><td>${today}</td><td>Total Revenue</td><td>All Sources</td><td class="bold text-cyan">Rs. ${totalRevenue.toLocaleString()}</td><td>—</td></tr><tr><td>${today}</td><td>Total Expenses</td><td>Operating</td><td class="bold text-danger">Rs. ${totalExpenses.toLocaleString()}</td><td>—</td></tr><tr><td>${today}</td><td>Net Profit</td><td>—</td><td class="bold ${netProfit>=0?'text-success':'text-danger'}">Rs. ${netProfit.toLocaleString()}</td><td>${margin}% margin</td></tr>`;

    } else if (activeFilter === 'production') {
      if (chartTitle) chartTitle.innerText = 'Production Batches (Last 7)';
      if (tableTitle) tableTitle.innerText = 'Production Records';
      const recentRuns = [...runs].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
      const maxP = Math.max(...recentRuns.map(r => parseFloat(r.qty05L || 0) * 12 + parseFloat(r.qty15L || 0) * 6)) || 100;
      chart.innerHTML = recentRuns.length > 0 ? recentRuns.reverse().map(r => { const total = parseFloat(r.qty05L||0)*12 + parseFloat(r.qty15L||0)*6; return `<div class="chart-bar-item"><span class="chart-bar-value">${total}</span><div class="chart-bar-fill" style="height:${Math.max((total/maxP)*100,2)}%; background:var(--color-success);"></div><span class="chart-bar-label">${r.date}</span></div>`; }).join('') : '<p class="description-text">No production data.</p>';
      tbody.innerHTML = '';
      runs.slice().reverse().slice(0, 20).forEach(r => { const tr = document.createElement('tr'); tr.innerHTML = `<td>${r.date}</td><td>Batch #${r.id}</td><td>0.5L: ${r.qty05L||0} / 1.5L: ${r.qty15L||0}</td><td class="bold text-success">${parseFloat(r.qty05L||0)*12+parseFloat(r.qty15L||0)*6} bottles</td><td>${(parseFloat(r.broken05L||0)+parseFloat(r.broken15L||0))} broken</td></tr>`; tbody.appendChild(tr); });
      if (runs.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No production records.</td></tr>';

    } else if (activeFilter === 'credit') {
      if (chartTitle) chartTitle.innerText = 'Customer Outstanding Balances';
      if (tableTitle) tableTitle.innerText = 'Customer Credit Report';
      const withBalance = customers.filter(c => parseFloat(c.balance || 0) > 0);
      const maxB = Math.max(...withBalance.map(c => parseFloat(c.balance || 0))) || 1000;
      chart.innerHTML = withBalance.slice(0, 8).map(c => { const b = parseFloat(c.balance||0); return `<div class="chart-bar-item"><span class="chart-bar-value">Rs. ${b.toLocaleString()}</span><div class="chart-bar-fill" style="height:${Math.max((b/maxB)*100,2)}%; background:#ef4444;"></div><span class="chart-bar-label">${c.name.split(' ')[0]}</span></div>`; }).join('') || '<p class="description-text">No outstanding balances.</p>';
      tbody.innerHTML = '';
      customers.forEach(c => { const tr = document.createElement('tr'); const b = parseFloat(c.balance||0); tr.innerHTML = `<td class="bold">${c.name}</td><td>${c.phone||'—'}</td><td>${c.type}</td><td class="bold ${b>0?'text-danger':'text-success'}">Rs. ${b.toLocaleString()}</td><td>Rs. ${parseFloat(c.creditLimit||5000).toLocaleString()}</td>`; tbody.appendChild(tr); });
      if (customers.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No customers registered.</td></tr>';

    } else if (activeFilter === 'vendor') {
      if (chartTitle) chartTitle.innerText = 'Vendor Outstanding Payables';
      if (tableTitle) tableTitle.innerText = 'Vendor Report';
      const withPayable = vendors.filter(v => getVendorPayable(v.id) > 0);
      const maxVP = Math.max(...withPayable.map(v => getVendorPayable(v.id))) || 1000;
      chart.innerHTML = withPayable.slice(0, 8).map(v => { const b = getVendorPayable(v.id); return `<div class="chart-bar-item"><span class="chart-bar-value">Rs. ${b.toLocaleString()}</span><div class="chart-bar-fill" style="height:${Math.max((b/maxVP)*100,2)}%; background:#ef4444;"></div><span class="chart-bar-label">${v.name.split(' ')[0]}</span></div>`; }).join('') || '<p class="description-text">No outstanding vendor payables.</p>';
      tbody.innerHTML = '';
      vendors.forEach(v => { const vPurchases = purchases.filter(p => p.vendorId === v.id); const total = vPurchases.reduce((acc, p) => acc + parseFloat(p.quantity||0)*parseFloat(p.unitCost||0), 0); const bal = getVendorPayable(v.id); const tr = document.createElement('tr'); tr.innerHTML = `<td class="bold">${v.name}</td><td>${v.phone||'—'}</td><td>${vPurchases.length} orders</td><td class="bold text-danger">Rs. ${total.toLocaleString()}</td><td>Rs. ${bal.toLocaleString()}</td>`; tbody.appendChild(tr); });
      if (vendors.length === 0) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No vendors registered.</td></tr>';

    } else if (activeFilter === 'inventory') {
      if (chartTitle) chartTitle.innerText = 'Inventory Stock Levels';
      if (tableTitle) tableTitle.innerText = 'Inventory Summary';
      chart.innerHTML = '<p class="description-text" style="text-align:center; padding:30px;">Inventory chart — see Inventory module for details.</p>';
      tbody.innerHTML = '<tr><td>—</td><td>Raw Materials + Finished Goods</td><td>Stock</td><td class="bold text-cyan">See Inventory Module</td><td>—</td></tr>';

    } else if (activeFilter === 'bottle') {
      if (chartTitle) chartTitle.innerText = 'Bottle Ledger Summary';
      if (tableTitle) tableTitle.innerText = 'Bottle Report';
      const totalHeld = customers.reduce((acc, c) => acc + parseFloat(c.bottlesHeld || 0), 0);
      chart.innerHTML = `<div class="chart-bar-item" style="flex:1"><span class="chart-bar-value">${totalHeld}</span><div class="chart-bar-fill" style="height:80%; background:var(--cyan-primary); width:60%"></div><span class="chart-bar-label">Customer Held</span></div>`;
      tbody.innerHTML = '';
      customers.filter(c => parseFloat(c.bottlesHeld||0) > 0).forEach(c => { const tr = document.createElement('tr'); tr.innerHTML = `<td class="bold">${c.name}</td><td>${c.phone||'—'}</td><td>${c.type}</td><td class="bold text-cyan">${c.bottlesHeld} bottles</td><td>—</td>`; tbody.appendChild(tr); });
      if (tbody.innerHTML === '') tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No bottles currently held by customers.</td></tr>';
    }
  }

  // Global helper to switch report filter chips
  window.setReportFilter = function(filter) {
    renderReports(filter);
  };

  // Global helper to export report table as CSV
  window.exportReportCSV = function() {
    const tbody = document.getElementById('rpt-tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr')).map(tr =>
      Array.from(tr.querySelectorAll('td')).map(td => '"' + td.innerText.replace(/"/g, '""') + '"').join(',')
    );
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'aquasphere_report.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  // Website Settings tab (Owner only)
  function renderWebsiteSettings() {
    // Bind save button once
    const form = document.getElementById('settings-website-form');
    if (form && !form.dataset.bound) {
      form.dataset.bound = '1';
      form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Website settings saved (prototype — no backend).');
      });
    }
  }


  function updateBlowingProductionLive() {
    const qty = parseInt(document.getElementById('blow-prod-qty').value, 10) || 0;
    const size = document.getElementById('blow-prod-size').value;
    const type = document.getElementById('blow-prod-type').value;

    let wtG = 0;
    if (type === 'pure') {
      wtG = size === '1.5L' ? 30 : 15;
    } else {
      wtG = size === '1.5L' ? 27 : 13;
    }

    const wtKg = (qty * wtG) / 1000;
    document.getElementById('blow-run-weight').innerText = `${wtKg.toFixed(2)} kg`;
  }

  // --- SUBMIT EVENT LISTENERS ---

  // 1. Place order
  document.getElementById('quick-order-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const customerId = parseInt(document.getElementById('order-customer-id').value, 10);
    const type = document.getElementById('order-type-val').value;
    const date = document.getElementById('order-expected-date').value;
    const remarks = document.getElementById('order-remarks').value;
    const charged = parseFloat(document.getElementById('order-charged-amount').value) || 0;

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot place order.");
      return;
    }

    const cust = getTable('customers').find(c => c.id === customerId);
    if (!cust) return;

    // Credit limit warning logic (soft-block)
    if (cust.creditLimit > 0) {
      const bal = getCustomerBalances(customerId);
      const newBal = bal.outstanding + charged;
      if (newBal > cust.creditLimit) {
        const accept = await triggerSoftBlockCheck(
          `WARNING: Customer Credit Limit exceeded!\n` +
          `Limit: Rs. ${cust.creditLimit.toLocaleString()}\n` +
          `Outstanding: Rs. ${bal.outstanding.toLocaleString()}\n` +
          `Order Value: Rs. ${charged.toLocaleString()}\n` +
          `New Outstanding: Rs. ${newBal.toLocaleString()}\n` +
          `Proceed anyway?`
        );
        if (!accept) return;
      }
    }

    // Low stock warnings checks
    let warningMsg = '';
    if (type === '19L') {
      const q = parseInt(document.getElementById('order-qty-19l').value, 10) || 0;
      const caps = getItemStock(10);
      if (caps - q < 0) {
        warningMsg += `Warning: Large Caps stock will go negative (${caps} remaining).\n`;
      }
      const minerals = getItemStock(12);
      const mineralReq = (q * 23) / 15140;
      if (minerals - mineralReq < 0) {
        warningMsg += `Warning: Mineral Sets stock will go negative (${minerals.toFixed(4)} sets remaining).\n`;
      }
    } else {
      const q05 = parseFloat(document.getElementById('order-qty-05l').value) || 0;
      const q15 = parseFloat(document.getElementById('order-qty-15l').value) || 0;
      const stock05 = getItemStock(14);
      const stock15 = getItemStock(13);
      if (stock05 - q05 < 0) {
        warningMsg += `Warning: Finished 0.5L PET pack stock will go negative (${stock05} packs remaining).\n`;
      }
      if (stock15 - q15 < 0) {
        warningMsg += `Warning: Finished 1.5L PET pack stock will go negative (${stock15} packs remaining).\n`;
      }
    }

    if (warningMsg) {
      const accept = await triggerSoftBlockCheck(warningMsg + "Proceed anyway?");
      if (!accept) return;
    }

    // Save order
    const orders = getTable('orders');
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newOrder = {
      id: newId,
      customerId,
      orderType: type,
      deliveryStatus: 'pending',
      paymentStatus: 'unpaid',
      expectedDelivery: date,
      remarks,
      totalCharged: charged
    };

    if (type === '19L') {
      newOrder.qtyOrdered = parseInt(document.getElementById('order-qty-19l').value, 10);
      newOrder.unitPrice = parseFloat(document.getElementById('order-price-19l').value);
    } else {
      newOrder.qty05LOrdered = parseInt(document.getElementById('order-qty-05l').value, 10);
      newOrder.unitPrice05L = parseFloat(document.getElementById('order-price-05l').value);
      newOrder.qty15LOrdered = parseInt(document.getElementById('order-qty-15l').value, 10);
      newOrder.unitPrice15L = parseFloat(document.getElementById('order-price-15l').value);
    }

    orders.push(newOrder);
    saveTable('orders', orders);

    alert("SUCCESS: Order placed successfully.");
    logActivity(`Placed CRM Customer Order #${newId} for Customer ID ${customerId}, Type ${type}, Total Charged Rs. ${charged}`);
    document.getElementById('quick-order-form').reset();
    selectCustomer(customerId);
    renderDashboard();
  } );

  // 2. Complete Delivery modal
  document.getElementById('modal-delivery-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const orderId = parseInt(document.getElementById('delivery-order-id').value, 10);
    const date = document.getElementById('deliv-date').value;
    const cash = parseFloat(document.getElementById('deliv-cash').value) || 0;
    const method = document.getElementById('deliv-pay-method').value;
    const remarks = document.getElementById('deliv-remarks').value;

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot complete delivery.");
      return;
    }

    const orders = getTable('orders');
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // For 19L: check returns warning
    let retGood = 0;
    let retBroken = 0;
    let qtyDeliv = 0;
    let qty05Deliv = 0;
    let qty15Deliv = 0;

    if (order.orderType === '19L') {
      qtyDeliv = parseInt(document.getElementById('deliv-qty').value, 10) || 0;
      retGood = parseInt(document.getElementById('deliv-return-good').value, 10) || 0;
      retBroken = parseInt(document.getElementById('deliv-return-broken').value, 10) || 0;

      const holds = getCustomerBottles(order.customerId);
      const totalReturned = retGood + retBroken;
      if (totalReturned > holds) {
        const accept = await triggerSoftBlockCheck(
          `WARNING: Customer returns more bottles than they hold!\n` +
          `Held: ${holds} bottles\n` +
          `Returned: ${totalReturned} bottles\n` +
          `Proceed anyway?`
        );
        if (!accept) return;
      }
    } else {
      qty05Deliv = parseInt(document.getElementById('deliv-qty-05l').value, 10) || 0;
      qty15Deliv = parseInt(document.getElementById('deliv-qty-15l').value, 10) || 0;
    }

    // Post delivery record
    const deliveries = getTable('deliveries');
    const dId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
    const newDelivery = {
      id: dId,
      orderId,
      deliveredAt: date,
      qtyDelivered: qtyDeliv,
      qty05LDelivered: qty05Deliv,
      qty15LDelivered: qty15Deliv,
      bottlesReturnedGood: retGood,
      bottlesReturnedBroken: retBroken,
      remarks
    };
    deliveries.push(newDelivery);
    saveTable('deliveries', deliveries);

    // Post payment if any cash received
    if (cash > 0) {
      const payments = getTable('payments');
      payments.push({
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
        orderId,
        customerId: order.customerId,
        amount: cash,
        method,
        receivedAt: date + "T12:00:00+05:00"
      });
      saveTable('payments', payments);
    }

    // post inventory/bottle transactions
    const invTxns = getTable('inventory_transactions');
    const bottleTxns = getTable('bottle_transactions');

    if (order.orderType === '19L') {
      // Deduct Large Cap (Item 10) and Mineral Sets (Item 12)
      invTxns.push({
        id: invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1,
        itemId: 10, direction: 'OUT', qty: qtyDeliv, refType: 'sale', refId: String(dId), createdAt: date
      });
      invTxns.push({
        id: invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1,
        itemId: 12, direction: 'OUT', qty: (qtyDeliv * 23) / 15140, refType: 'sale', refId: String(dId), createdAt: date
      });

      // Bottle transactions
      bottleTxns.push({
        id: bottleTxns.length > 0 ? Math.max(...bottleTxns.map(t => t.id)) + 1 : 1,
        customerId: order.customerId, txnType: 'delivered_to_customer', qty: qtyDeliv, refDeliveryId: dId, note: `Delivery order #${orderId}`, createdAt: date
      });
      if (retGood > 0) {
        bottleTxns.push({
          id: bottleTxns.length > 0 ? Math.max(...bottleTxns.map(t => t.id)) + 1 : 1,
          customerId: order.customerId, txnType: 'returned_good', qty: retGood, refDeliveryId: dId, note: `Returns order #${orderId}`, createdAt: date
        });
      }
      if (retBroken > 0) {
        bottleTxns.push({
          id: bottleTxns.length > 0 ? Math.max(...bottleTxns.map(t => t.id)) + 1 : 1,
          customerId: order.customerId, txnType: 'returned_broken', qty: retBroken, refDeliveryId: dId, note: `Broken returns order #${orderId}`, createdAt: date
        });
      }
      saveTable('bottle_transactions', bottleTxns);
    } else {
      // Deduct finished goods packs
      if (qty05Deliv > 0) {
        invTxns.push({
          id: invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1,
          itemId: 14, direction: 'OUT', qty: qty05Deliv, refType: 'sale', refId: String(dId), createdAt: date
        });
      }
      if (qty15Deliv > 0) {
        invTxns.push({
          id: invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1,
          itemId: 13, direction: 'OUT', qty: qty15Deliv, refType: 'sale', refId: String(dId), createdAt: date
        });
      }
    }
    saveTable('inventory_transactions', invTxns);

    // Update order status recomputed
    const allDelivs = deliveries.filter(d => d.orderId === order.id);
    if (order.orderType === '19L') {
      const totalDeliv = allDelivs.reduce((sum, d) => sum + d.qtyDelivered, 0);
      order.deliveryStatus = totalDeliv >= order.qtyOrdered ? 'delivered' : 'partial';
    } else {
      const t05 = allDelivs.reduce((sum, d) => sum + d.qty05LDelivered, 0);
      const t15 = allDelivs.reduce((sum, d) => sum + d.qty15LDelivered, 0);
      order.deliveryStatus = (t05 >= order.qty05LOrdered && t15 >= order.qty15LOrdered) ? 'delivered' : 'partial';
    }

    const allPayments = getTable('payments').filter(p => p.orderId === order.id);
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
    order.paymentStatus = totalPaid >= order.totalCharged ? 'paid' : (totalPaid > 0 ? 'partial' : 'unpaid');

    saveTable('orders', orders);

    alert("SUCCESS: Delivery logged successfully.");
    logActivity(`Logged Delivery for Order #${orderId}: Delivered Qty(19L/0.5L/1.5L) = ${qtyDeliv}/${qty05Deliv}/${qty15Deliv}, Cash Collected = Rs. ${cash}`);
    document.getElementById('modal-delivery').classList.add('hidden');
    renderPendingOrders();
    renderDashboard();
  });

  // 3. Post PET production batch — deducts Sodium, Calcium, Magnesium individually + broken bottles
  document.getElementById('pet-production-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('closing-date').value || new Date().toISOString().split('T')[0];
    const q05 = parseInt(document.getElementById('prod-qty-05l').value, 10) || 0;
    const q15 = parseInt(document.getElementById('prod-qty-15l').value, 10) || 0;
    const broken05 = parseInt(document.getElementById('prod-broken-05l').value, 10) || 0;
    const broken15 = parseInt(document.getElementById('prod-broken-15l').value, 10) || 0;

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot submit production.");
      return;
    }

    const totalWater = (q05 * 108) + (q15 * 72);
    const ratio = totalWater / 15140;
    const sodiumKg = ratio * 0.5;
    const calciumKg = ratio * 2.0;
    const magnesiumKg = ratio * 1.0;

    const batches = getTable('production_batches');
    const bId = batches.length > 0 ? Math.max(...batches.map(b => b.id)) + 1 : 1;
    batches.push({
      id: bId,
      productionDate: date,
      qty05LProduced: q05,
      qty15LProduced: q15,
      sodiumConsumed: sodiumKg,
      calciumConsumed: calciumKg,
      magnesiumConsumed: magnesiumKg,
      broken05L: broken05,
      broken15L: broken15
    });
    saveTable('production_batches', batches);

    // Save inventory transactions
    const invTxns = getTable('inventory_transactions');
    const nextId = () => invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1;
    
    // 0.5L pack: 12x 0.5L empty, 12x caps, 6.72g labels, 50g wrap, finished IN
    if (q05 > 0) {
      invTxns.push({ id: nextId(), itemId: 5, direction: 'OUT', qty: q05 * 12, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 9, direction: 'OUT', qty: q05 * 12, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 7, direction: 'OUT', qty: (6.72 * q05) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 8, direction: 'OUT', qty: (50.0 * q05) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 14, direction: 'IN', qty: q05, refType: 'production_output', refId: String(bId), createdAt: date });
    }

    // 1.5L pack: 6x 1.5L empty, 6x caps, 7.86g labels, 50g wrap, finished IN
    if (q15 > 0) {
      invTxns.push({ id: nextId(), itemId: 4, direction: 'OUT', qty: q15 * 6, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 9, direction: 'OUT', qty: q15 * 6, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 6, direction: 'OUT', qty: (7.86 * q15) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 8, direction: 'OUT', qty: (50.0 * q15) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: nextId(), itemId: 13, direction: 'IN', qty: q15, refType: 'production_output', refId: String(bId), createdAt: date });
    }

    // Broken bottles: deduct from empty stock (no output produced)
    if (broken05 > 0) {
      invTxns.push({ id: nextId(), itemId: 5, direction: 'OUT', qty: broken05, refType: 'broken_in_production', refId: String(bId), createdAt: date });
    }
    if (broken15 > 0) {
      invTxns.push({ id: nextId(), itemId: 4, direction: 'OUT', qty: broken15, refType: 'broken_in_production', refId: String(bId), createdAt: date });
    }

    // Individual chemical deductions (Sodium=1, Calcium=2, Magnesium=3)
    if (sodiumKg > 0) {
      invTxns.push({ id: nextId(), itemId: 1, direction: 'OUT', qty: sodiumKg, refType: 'production_consume', refId: String(bId), createdAt: date });
    }
    if (calciumKg > 0) {
      invTxns.push({ id: nextId(), itemId: 2, direction: 'OUT', qty: calciumKg, refType: 'production_consume', refId: String(bId), createdAt: date });
    }
    if (magnesiumKg > 0) {
      invTxns.push({ id: nextId(), itemId: 3, direction: 'OUT', qty: magnesiumKg, refType: 'production_consume', refId: String(bId), createdAt: date });
    }

    saveTable('inventory_transactions', invTxns);
    logActivity(`Posted PET Production Batch #${bId}: 0.5L=${q05} packs, 1.5L=${q15} packs`);
    alert("SUCCESS: Production run posted.");
    document.getElementById('pet-production-form').reset();
    updateProductionRunLive();
    renderProduction();
    renderDashboard();
  });

  document.getElementById('badana-production-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('closing-date').value || new Date().toISOString().split('T')[0];
    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot submit production.");
      return;
    }

    const clientId = document.getElementById('badana-prod-client').value;
    const size = document.getElementById('badana-prod-size').value;
    const type = document.getElementById('badana-prod-preform').value;
    const qty = parseInt(document.getElementById('badana-prod-qty').value, 10) || 0;
    const location = document.getElementById('badana-prod-location').value;

    let preformGrams = 0;
    if (size === '0.5L' && type === 'Mix') preformGrams = 27;
    else if (size === '1.5L' && type === 'Mix') preformGrams = 15;
    else if (size === '1.5L' && type === 'Pure') preformGrams = 13;
    else if (size === '0.5L' && type === 'Pure') preformGrams = 15;

    const totalKg = (preformGrams * qty) / 1000;

    let preformItemId = type === 'Pure' ? 15 : 16;
    let bottleItemId = 0;
    if (size === '0.5L' && type === 'Pure') bottleItemId = 17;
    else if (size === '1.5L' && type === 'Pure') bottleItemId = 18;
    else if (size === '0.5L' && type === 'Mix') bottleItemId = 19;
    else if (size === '1.5L' && type === 'Mix') bottleItemId = 20;

    const batches = getTable('production_batches');
    const bId = batches.length > 0 ? Math.max(...batches.map(b => b.id)) + 1 : 1;
    batches.push({
      id: bId,
      productionDate: date,
      clientCompanyId: clientId,
      size,
      preformType: type,
      qtyProduced: qty,
      preformLocation: location,
      preformConsumed: totalKg
    });
    saveTable('production_batches', batches);

    const invTxns = getTable('inventory_transactions');
    const nextId = () => invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1;

    // Deduct raw preform from specified location
    invTxns.push({ id: nextId(), itemId: preformItemId, direction: 'OUT', qty: totalKg, refType: 'blowing_consume', refId: String(bId), location: location, createdAt: date });
    // Add finished bottles to warehouse
    invTxns.push({ id: nextId(), itemId: bottleItemId, direction: 'IN', qty: qty, refType: 'blowing_output', refId: String(bId), location: 'warehouse', createdAt: date });
    
    saveTable('inventory_transactions', invTxns);
    logActivity(`Posted Badana Batch #${bId}: ${qty}x ${size} ${type} bottles`);
    alert("SUCCESS: Blowing run posted.");
    document.getElementById('badana-production-form').reset();
    updateBadanaProductionLive();
    renderProduction();
    renderDashboard();
  });

  // 4. Post vendor purchase bill
  document.getElementById('purchase-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const vendorId = parseInt(document.getElementById('purchase-vendor').value, 10);
    const itemId = parseInt(document.getElementById('purchase-item').value, 10);
    const qty = parseFloat(document.getElementById('purchase-qty').value);
    const cost = parseFloat(document.getElementById('purchase-cost').value);
    const date = document.getElementById('expense-date').value || new Date().toISOString().split('T')[0];

    const location = document.getElementById('purchase-location').value;

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot post purchase.");
      return;
    }

    const purchases = getTable('purchases');
    const pId = purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) + 1 : 1;
    const totalCost = qty * cost;

    purchases.push({
      id: pId,
      vendorId,
      itemId,
      qty,
      unitCost: cost,
      totalCost,
      purchasedAt: date
    });
    saveTable('purchases', purchases);

    // Save to ledger
    if (itemId === 11) {
      // 19L Empty bottles purchase is a fleet asset movement
      const bottleTxns = getTable('bottle_transactions');
      bottleTxns.push({
        id: bottleTxns.length > 0 ? Math.max(...bottleTxns.map(t => t.id)) + 1 : 1,
        customerId: null,
        txnType: 'purchased_new',
        qty,
        refDeliveryId: null,
        note: `Purchase Ref #PUR-${pId}`,
        createdAt: date
      });
      saveTable('bottle_transactions', bottleTxns);
    } else {
      // Regular raw material IN transaction
      const invTxns = getTable('inventory_transactions');
      invTxns.push({
        id: invTxns.length > 0 ? Math.max(...invTxns.map(t => t.id)) + 1 : 1,
        itemId,
        direction: 'IN',
        qty,
        location: location,
        refType: 'purchase',
        refId: String(pId),
        createdAt: date
      });
      saveTable('inventory_transactions', invTxns);
    }

    alert("SUCCESS: Purchase logged successfully (On Credit).");
    document.getElementById('purchase-form').reset();
    document.getElementById('purchase-total-label').innerText = 'Rs. 0';
    renderPurchases();
  });

  // Calculate live purchase liability
  document.getElementById('purchase-qty').addEventListener('input', recalcPurchaseTotal);
  document.getElementById('purchase-cost').addEventListener('input', recalcPurchaseTotal);

  function recalcPurchaseTotal() {
    const q = parseFloat(document.getElementById('purchase-qty').value) || 0;
    const c = parseFloat(document.getElementById('purchase-cost').value) || 0;
    document.getElementById('purchase-total-label').innerText = `Rs. ${(q * c).toLocaleString()}`;
  }

  // 5. Post operating expense
  document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const type = document.getElementById('expense-type').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;
    const remarks = document.getElementById('expense-remarks').value;
    const fileEl = document.getElementById('expense-photo');

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot post expense.");
      return;
    }

    // Mandate photo upload for accountant
    if (state.role === 'accountant' && (!fileEl.files || fileEl.files.length === 0)) {
      alert("ERROR: Accountant must upload receipt photo to file an expense.");
      return;
    }

    const expenses = getTable('expenses');
    const newId = expenses.length > 0 ? Math.max(...expenses.map(ex => ex.id)) + 1 : 1;
    expenses.push({
      id: newId,
      type: 'expense',
      expenseType: type,
      amount,
      date,
      remarks,
      receiptAttached: fileEl.files.length > 0 ? true : false
    });
    saveTable('expenses', expenses);

    logActivity(`Recorded Operating Expense Ref #${newId}: Category ${type}, Amount Rs. ${amount}`);
    alert("SUCCESS: Expense recorded successfully.");
    document.getElementById('expense-form').reset();
    renderExpenses();
    renderDashboard();
  });

  // 6. Post counter spot sale
  document.getElementById('spot-sale-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const litres = parseFloat(document.getElementById('spot-litres').value) || 0;
    const caps = parseInt(document.getElementById('spot-caps').value, 10) || 0;
    const cash = parseFloat(document.getElementById('spot-cash').value) || 0;
    const credit = parseFloat(document.getElementById('spot-credit').value) || 0;
    const custId = document.getElementById('spot-customer').value;
    const remarks = document.getElementById('spot-remarks').value;
    const date = document.getElementById('expense-date').value || new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot post counter sale.");
      return;
    }

    if (credit > 0 && !custId) {
      alert("ERROR: A customer must be selected if credit amount is set.");
      return;
    }

    const expenses = getTable('expenses');
    const newId = expenses.length > 0 ? Math.max(...expenses.map(ex => ex.id)) + 1 : 1;

    // Deduct caps from inventory (Item 10 for Large Caps if litres sold, or small caps? Let's check Small Caps [Item 9])
    const invTxns = getTable('inventory_transactions');
    if (caps > 0) {
      invTxns.push({
        id: invTxns.length + 1,
        itemId: 9, direction: 'OUT', qty: caps, refType: 'adjustment', refId: `spot-${newId}`, createdAt: date
      });
    }
    // Deduct water minerals (using 23L/bottle ratio as standard refill scale: so treat litres as water sold directly)
    if (litres > 0) {
      invTxns.push({
        id: invTxns.length + 1,
        itemId: 12, direction: 'OUT', qty: litres / 15140, refType: 'adjustment', refId: `spot-${newId}`, createdAt: date
      });
    }
    saveTable('inventory_transactions', invTxns);

    expenses.push({
      id: newId,
      type: 'spot_sale',
      litresSold: litres,
      capsSold: caps,
      cashReceived: cash,
      creditAmount: credit,
      customerId: custId ? parseInt(custId, 10) : null,
      remarks,
      date
    });
    saveTable('expenses', expenses);

    logActivity(`Posted Counter Spot Sale Ref #${newId}: Litres ${litres}L, Cash Rs. ${cash}, Credit Rs. ${credit}`);
    alert("SUCCESS: Counter sale posted successfully.");
    document.getElementById('spot-sale-form').reset();
    renderExpenses();
    renderDashboard();
  });

  // 7. Post Daily closing entries
  document.getElementById('daily-closing-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('closing-date').value;

    const closings = getTable('daily_closings');
    const exists = closings.some(c => c.date === date);
    if (exists) {
      alert("ERROR: This day is already CLOSED and sealed.");
      return;
    }

    // Get today calculations
    const deliveries = getTable('deliveries');
    const orders = getTable('orders');
    const expenses = getTable('expenses');
    const payments = getTable('payments');

    let deliveryCount = 0;
    let sales = 0;
    let cashCollected = 0;
    let expenseTotal = 0;

    deliveries.forEach(d => {
      if (d.deliveredAt && d.deliveredAt.startsWith(date)) {
        deliveryCount++;
        const order = orders.find(o => o.id === d.orderId);
        if (order) {
          if (order.orderType === '19L') {
            sales += parseFloat(d.qtyDelivered) * parseFloat(order.unitPrice || 250);
          } else {
            sales += (parseFloat(d.qty05LDelivered || 0) * parseFloat(order.unitPrice05L || 500)) + 
                     (parseFloat(d.qty15LDelivered || 0) * parseFloat(order.unitPrice15L || 450));
          }
        }
      }
    });

    payments.forEach(p => {
      if (p.receivedAt && p.receivedAt.startsWith(date)) {
        cashCollected += parseFloat(p.amount);
      }
    });

    expenses.forEach(e => {
      if (e.date && e.date.startsWith(date)) {
        if (e.type === 'expense') {
          expenseTotal += parseFloat(e.amount);
        } else if (e.type === 'spot_sale') {
          const cash = parseFloat(e.cashReceived || 0);
          const credit = parseFloat(e.creditAmount || 0);
          sales += (cash + credit);
          cashCollected += cash;
        }
      }
    });

    const cId = closings.length > 0 ? Math.max(...closings.map(c => c.id)) + 1 : 1;
    closings.push({
      id: cId,
      date,
      totalDeliveries: deliveryCount,
      salesValue: sales,
      cashCollected,
      expenses: expenseTotal,
      closedBy: state.role,
      closedAt: new Date().toISOString()
    });
    saveTable('daily_closings', closings);

    alert(`SUCCESS: Day closed. All entries locked for ${date}.`);
    logActivity(`Submitted Daily Closing for ${date}: Deliveries=${deliveryCount}, Sales=Rs. ${sales}, Cash Collected=Rs. ${cashCollected}`);
    renderDailyClosing();
    updateDailyClosingCalculations();
  });

  // --- BLOWING DIVISION ACTIONS SUBMITS ---

  // 1. Buy Preforms
  document.getElementById('blow-preform-purchase-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const type = document.getElementById('blow-buy-type').value;
    const qty = parseFloat(document.getElementById('blow-buy-qty').value);
    const date = new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED. Locked.");
      return;
    }

    const txns = getTable('blowing_transactions');
    txns.push({
      id: txns.length + 1,
      txnType: 'preform_purchase',
      preformType: type,
      qty,
      createdAt: date + "T12:00:00+05:00"
    });
    saveTable('blowing_transactions', txns);

    alert("SUCCESS: Raw preforms purchase logged.");
    logActivity(`Blowing Division: Purchased raw preforms: Type ${type}, Qty ${qty} kg`);
    document.getElementById('blow-preform-purchase-form').reset();
    renderBlowing();
  });

  // 2. Blow Bottles Production
  document.getElementById('blow-production-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const brand = document.getElementById('blow-prod-brand').value;
    const type = document.getElementById('blow-prod-type').value;
    const size = document.getElementById('blow-prod-size').value;
    const qty = parseInt(document.getElementById('blow-prod-qty').value, 10);
    const date = new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: Locked day. Production blocked.");
      return;
    }

    // Enforce Aqua Sphere pure preforms restriction
    if (brand === 'AquaSphere' && type === 'mix') {
      alert("ERROR: Aqua Sphere division can only produce pure preform bottles.");
      return;
    }

    let wtG = 0;
    if (type === 'pure') {
      wtG = size === '1.5L' ? 30 : 15;
    } else {
      wtG = size === '1.5L' ? 27 : 13;
    }
    const weightKg = (qty * wtG) / 1000;

    // Check preform stock warning
    const status = getBlowingStock();
    const preformStock = status.preforms[type] || 0;
    if (preformStock - weightKg < 0) {
      alert(`ERROR: Insufficient preforms stock! ${preformStock.toFixed(2)} kg available, requires ${weightKg.toFixed(2)} kg.`);
      return;
    }

    const txns = getTable('blowing_transactions');
    txns.push({
      id: txns.length + 1,
      txnType: 'production',
      brand,
      preformType: type,
      size,
      qty,
      preformWeightDeducted: weightKg,
      createdAt: date + "T12:00:00+05:00"
    });
    saveTable('blowing_transactions', txns);

    alert("SUCCESS: Bottles blown successfully.");
    logActivity(`Blowing Division: Blown Bottles Production: Brand ${brand}, Size ${size}, Type ${type}, Qty ${qty}`);
    document.getElementById('blow-production-form').reset();
    updateBlowingProductionLive();
    renderBlowing();
  });

  // 3. Move factory to warehouse
  document.getElementById('blow-transfer-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const brand = document.getElementById('blow-trans-brand').value;
    const type = document.getElementById('blow-trans-type').value;
    const size = document.getElementById('blow-trans-size').value;
    const qty = parseInt(document.getElementById('blow-trans-qty').value, 10);
    const date = new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: Date locked.");
      return;
    }

    // Check Factory Stock
    const status = getBlowingStock();
    const key = `${brand}_${size}_${type}_factory`;
    const factoryQty = status.bottles[key] || 0;

    if (factoryQty - qty < 0) {
      const accept = await triggerSoftBlockCheck(
        `WARNING: Factory bottle stock is insufficient to move!\n` +
        `Factory stock: ${factoryQty} pcs\n` +
        `Request to move: ${qty} pcs\n` +
        `Proceed anyway?`
      );
      if (!accept) return;
    }

    const txns = getTable('blowing_transactions');
    txns.push({
      id: txns.length + 1,
      txnType: 'transfer',
      brand,
      preformType: type,
      size,
      qty,
      createdAt: date + "T12:00:00+05:00"
    });
    saveTable('blowing_transactions', txns);

    alert("SUCCESS: Inventory transfer posted.");
    logActivity(`Blowing Division: Blown Bottles Transfer: Moved ${qty} pcs of ${brand} ${size} ${type} from Factory to Warehouse`);
    document.getElementById('blow-transfer-form').reset();
    renderBlowing();
  });

  // 4. Sell Blown Bottles
  document.getElementById('blow-sale-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const brand = document.getElementById('blow-sale-brand').value;
    const type = document.getElementById('blow-sale-type').value;
    const size = document.getElementById('blow-sale-size').value;
    const loc = document.getElementById('blow-sale-loc').value; // 'factory' or 'warehouse'
    const qty = parseInt(document.getElementById('blow-sale-qty').value, 10);
    const unitPrice = parseFloat(document.getElementById('blow-sale-price').value) || 0;
    const customerName = document.getElementById('blow-sale-cust').value;
    const paymentMode = document.getElementById('blow-sale-pay').value;
    const date = new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: Date locked.");
      return;
    }

    // Check Stock
    const status = getBlowingStock();
    const key = `${brand}_${size}_${type}_${loc}`;
    const stockQty = status.bottles[key] || 0;

    if (stockQty - qty < 0) {
      const accept = await triggerSoftBlockCheck(
        `WARNING: Blown bottle stock is insufficient at ${loc}!\n` +
        `Stock: ${stockQty} pcs\n` +
        `Request to sell: ${qty} pcs\n` +
        `Proceed anyway?`
      );
      if (!accept) return;
    }

    // Save sales
    const sales = getTable('blowing_sales');
    const sId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    sales.push({
      id: sId,
      companyName: brand,
      bottleSize: size,
      grade: type,
      qty,
      location: loc,
      amountCharged: qty * unitPrice,
      paymentMethod: paymentMode,
      customerName,
      date
    });
    saveTable('blowing_sales', sales);

    // Save transaction
    const txns = getTable('blowing_transactions');
    txns.push({
      id: txns.length + 1,
      txnType: 'sale',
      brand,
      preformType: type,
      size,
      qty,
      location: loc,
      createdAt: date + "T12:00:00+05:00"
    });
    saveTable('blowing_transactions', txns);

    alert("SUCCESS: Empty bottles sale logged.");
    logActivity(`Blowing Division: Blown Bottles Sale: Sold ${qty} pcs of ${brand} ${size} ${type} from ${loc} to customer ${customerName}`);
    document.getElementById('blow-sale-form').reset();
    renderBlowing();
  });

  // --- MODAL DIALOGS SUBMITS (CRUD) ---

  // 1. Add Customer Profile
  document.getElementById('modal-customer-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const maps = document.getElementById('cust-maps').value;
    let photo = document.getElementById('cust-photo').value;
    const type = document.getElementById('cust-type').value;
    const price = parseFloat(document.getElementById('cust-price').value) || 250;
    const limit = parseFloat(document.getElementById('cust-credit-limit').value) || 0;
    const duration = parseInt(document.getElementById('cust-credit-duration').value, 10) || 1;
    const remarks = document.getElementById('cust-remarks').value;

    const fileInput = document.getElementById('cust-photo-file');
    if (fileInput && fileInput.files.length > 0) {
      photo = await getBase64(fileInput);
    }

    const customers = getTable('customers');
    const exists = customers.some(c => c.phone === phone);
    if (exists) {
      alert("ERROR: Customer phone number must be unique.");
      return;
    }

    const cId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push({
      id: cId,
      phone, name, address,
      mapsLocation: maps || null,
      homePictureUrl: photo || null,
      customerType: type,
      creditLimit: limit,
      creditDuration: duration,
      defaultPrice: price,
      remarks
    });
    saveTable('customers', customers);
    logActivity(`Registered new Customer Profile: Name ${name}, Phone ${phone}`);
    alert("SUCCESS: Customer registered successfully.");
    document.getElementById('modal-customer-form').reset();
    document.getElementById('modal-customer').classList.add('hidden');
    renderCRM();
  });

  // 2. Add Vendor
  document.getElementById('modal-vendor-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('vendor-name').value;
    const phone = document.getElementById('vendor-phone').value;
    const remarks = document.getElementById('vendor-remarks').value;

    const vendors = getTable('vendors');
    const exists = vendors.some(v => v.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("ERROR: Vendor name already exists.");
      return;
    }

    const vId = vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1;
    vendors.push({ id: vId, name, phone, remarks });
    saveTable('vendors', vendors);
    logActivity(`Registered new Vendor Profile: Name ${name}, Phone ${phone}`);
    alert("SUCCESS: Vendor registered.");
    document.getElementById('modal-vendor-form').reset();
    document.getElementById('modal-vendor').classList.add('hidden');
    renderPurchases();
  });

  // 3. Post vendor payment
  document.getElementById('modal-vendor-payment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const vendorId = parseInt(document.getElementById('pay-vendor-id').value, 10);
    const amount = parseFloat(document.getElementById('pay-vendor-amount').value);
    const method = document.getElementById('pay-vendor-method').value;
    const remarks = document.getElementById('pay-vendor-remarks').value;
    const date = document.getElementById('expense-date').value || new Date().toISOString().split('T')[0];

    if (isDateClosed(date)) {
      alert("ERROR: Locked day.");
      return;
    }

    const payments = getTable('vendor_payments');
    payments.push({
      id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
      vendorId,
      amount,
      method,
      remarks,
      paidAt: date
    });
    saveTable('vendor_payments', payments);
    logActivity(`Logged Vendor Payment: Vendor ID ${vendorId}, Amount Rs. ${amount}, Method ${method}`);
    alert("SUCCESS: Vendor payment recorded.");
    document.getElementById('modal-vendor-payment').classList.add('hidden');
    renderPurchases();
    renderDashboard();
  });

  // --- NEW ROLE-SPECIFIC SUBTAB RENDERERS ---

  function renderDashboardSales() {
    const deliveries = getTable('deliveries');
    const orders = getTable('orders');
    const chart = document.getElementById('sales-analytics-chart');
    const tbody = document.getElementById('sales-analytics-tbody');
    if (!chart || !tbody) return;

    const last5Days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last5Days.push(d.toISOString().split('T')[0]);
    }

    let html = '';
    let tableHtml = '';
    let maxVal = 1000;
    const dayVals = last5Days.map(day => {
      let val = 0;
      deliveries.forEach(del => {
        if (del.deliveredAt && del.deliveredAt.startsWith(day)) {
          const ord = orders.find(o => o.id === del.orderId);
          if (ord) {
            val += parseFloat(del.qtyDelivered || 0) * parseFloat(ord.pricePerUnit || 250);
          }
        }
      });
      if (val > maxVal) maxVal = val;
      return { day, val };
    });

    dayVals.forEach(item => {
      const pct = (item.val / maxVal) * 100;
      const formattedDate = new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      html += `
        <div class="chart-bar-item">
          <span class="chart-bar-value">Rs. ${item.val.toLocaleString()}</span>
          <div class="chart-bar-fill" style="height: ${pct}%; background-color: var(--cyan-primary);"></div>
          <span class="chart-bar-label">${formattedDate}</span>
        </div>
      `;
      tableHtml += `
        <tr>
          <td class="bold">${item.day}</td>
          <td>Rs. ${item.val.toLocaleString()}</td>
          <td>-</td>
          <td>-</td>
          <td class="bold text-success">Rs. ${item.val.toLocaleString()}</td>
        </tr>
      `;
    });
    chart.innerHTML = html;
    tbody.innerHTML = tableHtml;
  }

  function renderDashboardFinancial() {
    const deliveries = getTable('deliveries');
    const orders = getTable('orders');
    const expenses = getTable('expenses');
    
    let revenue = 0;
    deliveries.forEach(del => {
      const ord = orders.find(o => o.id === del.orderId);
      if (ord) {
        revenue += parseFloat(del.qtyDelivered || 0) * parseFloat(ord.pricePerUnit || 250);
      }
    });

    let expenseTotal = 0;
    expenses.forEach(e => {
      if (e.type !== 'spot_sale') {
        expenseTotal += parseFloat(e.amount || 0);
      } else {
        revenue += parseFloat(e.cashReceived || 0) + parseFloat(e.creditAmount || 0);
      }
    });

    let cogs = revenue * 0.45;
    let netProfit = revenue - expenseTotal - cogs;
    let margin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

    const revEl = document.getElementById('fin-total-revenue');
    if (revEl) revEl.innerText = `Rs. ${revenue.toLocaleString()}`;
    const expEl = document.getElementById('fin-total-expenses');
    if (expEl) expEl.innerText = `Rs. ${expenseTotal.toLocaleString()}`;
    const cogsEl = document.getElementById('fin-total-cogs');
    if (cogsEl) cogsEl.innerText = `Rs. ${cogs.toLocaleString()}`;
    const marginEl = document.getElementById('fin-profit-margin');
    if (marginEl) marginEl.innerText = `${margin}%`;

    const chart = document.getElementById('financial-overview-chart');
    if (!chart) return;
    const max = Math.max(revenue, expenseTotal) || 1000;
    chart.innerHTML = `
      <div class="chart-bar-item" style="flex:1;">
        <span class="chart-bar-value">Rs. ${revenue.toLocaleString()}</span>
        <div class="chart-bar-fill" style="height: ${(revenue/max)*100}%; background-color: var(--color-success); width:50%;"></div>
        <span class="chart-bar-label">Total Revenue</span>
      </div>
      <div class="chart-bar-item" style="flex:1;">
        <span class="chart-bar-value">Rs. ${expenseTotal.toLocaleString()}</span>
        <div class="chart-bar-fill" style="height: ${(expenseTotal/max)*100}%; background-color: var(--color-danger); width:50%;"></div>
        <span class="chart-bar-label">Total Expenses</span>
      </div>
    `;
  }

  function renderDashboardLowStock() {
    const tbody = document.getElementById('dash-low-stock-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const items = getTable('items');
    let count = 0;
    items.forEach(item => {
      if (item.category !== 'raw_material') return;
      const stock = getItemStock(item.id);
      const reorder = parseFloat(item.reorderLevel || 0);
      if (reorder > 0 && stock <= reorder) {
        count++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="bold">${item.name}</td>
          <td class="text-danger bold">${stock.toFixed(2)} ${item.unit}</td>
          <td>${reorder} ${item.unit}</td>
          <td><span class="badge badge-warning">Low Stock</span></td>
          <td><button class="btn btn-xs btn-cyan" onclick="triggerReorder(${item.id})">Reorder</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (count === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:15px;">All consumables are at safe levels.</td></tr>`;
    }
  }

  function renderCustomerAddTab() {
    const form = document.getElementById('standalone-customer-add-form');
    if (!form) return;
    form.onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('std-cust-name').value;
      const phone = document.getElementById('std-cust-phone').value;
      const address = document.getElementById('std-cust-address').value;
      const type = document.getElementById('std-cust-type').value;
      const price = parseFloat(document.getElementById('std-cust-price').value) || 250;
      const limit = parseFloat(document.getElementById('std-cust-credit-limit').value) || 5000;
      const duration = parseFloat(document.getElementById('std-cust-credit-duration').value) || 1;
      
      const maps = document.getElementById('std-cust-maps')?.value || null;
      let photoUrl = document.getElementById('std-cust-photo')?.value || null;

      const fileInput = document.getElementById('std-cust-photo-file');
      if (fileInput && fileInput.files.length > 0) {
        photoUrl = await getBase64(fileInput);
      }
      
      const customers = getTable('customers');
      if (customers.some(c => c.phone === phone)) {
        alert("ERROR: A customer with this phone number already exists.");
        return;
      }
      
      customers.push({
        id: nextId(customers),
        name, phone, address, type, price, creditLimit: limit, creditDuration: duration,
        mapsLocation: maps, homePictureUrl: photoUrl,
        balance: 0, bottlesHeld: 0
      });
      saveTable('customers', customers);
      alert("SUCCESS: Customer registered.");
      form.reset();
    }
  }

  function renderCustomerCredits() {
    const tbody = document.getElementById('customer-credits-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    customers.forEach(c => {
      const bal = parseFloat(c.balance || 0);
      const limit = parseFloat(c.creditLimit || 5000);
      const pct = limit > 0 ? Math.round((bal / limit) * 100) : 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td class="bold text-danger">Rs. ${bal.toLocaleString()}</td>
        <td>Rs. ${limit.toLocaleString()}</td>
        <td>
          <div class="progress-bar-track" style="height:8px; width:100px;">
            <div class="progress-bar-fill fill-danger" style="width: ${Math.min(pct, 100)}%;"></div>
          </div>
          <span class="help-text">${pct}% used</span>
        </td>
        <td><button class="btn btn-xs btn-cyan" onclick="alert('Customer selected!')">Manage</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderCustomerBottles() {
    const tbody = document.getElementById('customer-bottles-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    customers.forEach(c => {
      const held = getCustomerBottles(c.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td><span class="badge">${c.type}</span></td>
        <td class="bold text-cyan">${held} pcs</td>
        <td>—</td>
        <td><button class="btn btn-xs btn-muted" onclick="triggerCustomerBottleWriteOff(${c.id})">Write off</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderCustomerHistory() {
    const select = document.getElementById('history-cust-select');
    const tbody = document.getElementById('customer-history-tbody');
    if (!select || !tbody) return;
    
    const customers = getTable('customers');
    select.innerHTML = '<option value="">-- Choose Customer --</option>';
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerText = `${c.name} (${c.phone})`;
      select.appendChild(opt);
    });

    select.onchange = function() {
      const custId = parseInt(select.value, 10);
      if (!custId) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:20px;">Please select a customer above to view ledger statements.</td></tr>';
        return;
      }
      
      const orders = getTable('orders').filter(o => o.customerId === custId);
      const payments = getTable('payments').filter(p => p.customerId === custId);
      
      let ledger = [];
      orders.forEach(o => {
        ledger.push({
          date: o.placedAt ? o.placedAt.split('T')[0] : '—',
          type: 'Order Placed',
          ref: `#ORD-${o.id}`,
          debit: parseFloat(o.chargedAmount || 0),
          credit: 0
        });
      });
      payments.forEach(p => {
        ledger.push({
          date: p.receivedAt ? p.receivedAt.split('T')[0] : (p.paidAt || '—'),
          type: 'Payment Received',
          ref: `#PAY-${p.id}`,
          debit: 0,
          credit: parseFloat(p.amount || 0)
        });
      });
      
      ledger.sort((a, b) => new Date(a.date) - new Date(b.date));
      tbody.innerHTML = '';
      if (ledger.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:20px;">No statement entries found for this customer.</td></tr>';
        return;
      }
      
      let runningBalance = 0;
      ledger.forEach(item => {
        runningBalance += (item.debit - item.credit);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.date}</td>
          <td>${item.type}</td>
          <td>${item.ref}</td>
          <td class="${item.debit > 0 ? 'bold text-danger' : ''}">${item.debit > 0 ? 'Rs. ' + item.debit.toLocaleString() : '—'}</td>
          <td class="${item.credit > 0 ? 'bold text-success' : ''}">${item.credit > 0 ? 'Rs. ' + item.credit.toLocaleString() : '—'}</td>
          <td class="bold">Rs. ${runningBalance.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  function renderCustomerLocations() {
    const tbody = document.getElementById('customer-locations-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    customers.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td>${c.address || '—'}</td>
        <td><a href="${c.mapsUrl || '#'}" target="_blank" class="maps-btn">📍 Open Maps</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderCustomerReminders() {
    const tbody = document.getElementById('customer-reminders-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    let count = 0;
    customers.forEach(c => {
      if (parseFloat(c.balance) > 0) {
        count++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="bold">${c.name}</td>
          <td class="bold text-danger">Rs. ${parseFloat(c.balance).toLocaleString()}</td>
          <td>Overdue</td>
          <td><span class="badge badge-warning">Awaiting Send</span></td>
          <td><button class="btn btn-xs btn-cyan" onclick="alert('Notification sent!')">Send Alert</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (count === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">No outstanding payments required.</td></tr>';
    }
  }

  function renderOrdersInProgress() {
    const tbody = document.getElementById('orders-inprogress-tbody');
    if (!tbody) return;
    const orders = getTable('orders');
    const customers = getTable('customers');
    const progress = orders.filter(o => o.deliveryStatus === 'pending' || o.deliveryStatus === 'dispatched');
    tbody.innerHTML = '';
    if (progress.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:15px;">No active orders in progress.</td></tr>`;
      return;
    }
    progress.forEach(o => {
      const cust = customers.find(c => c.id === o.customerId) || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${o.id}</td>
        <td>${cust.name || 'Unknown'}</td>
        <td>${o.orderType} (${o.qtyOrdered || o.qty05LOrdered || 0} units)</td>
        <td>${o.expectedDelivery || '—'}</td>
        <td><span class="badge badge-warning">${o.deliveryStatus}</span></td>
        <td><button class="btn btn-xs btn-cyan" onclick="alert('Completing order...')">Complete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderOrdersCompleted() {
    const tbody = document.getElementById('orders-completed-tbody');
    if (!tbody) return;
    const orders = getTable('orders');
    const customers = getTable('customers');
    const completed = orders.filter(o => o.deliveryStatus === 'delivered');
    tbody.innerHTML = '';
    if (completed.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:15px;">No completed orders logged.</td></tr>`;
      return;
    }
    completed.forEach(o => {
      const cust = customers.find(c => c.id === o.customerId) || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${o.id}</td>
        <td>${cust.name || 'Unknown'}</td>
        <td>${o.orderType} (${o.qtyOrdered || o.qty05LOrdered || 0} units)</td>
        <td>${o.placedAt ? o.placedAt.split('T')[0] : '—'}</td>
        <td class="bold text-success">Rs. ${(o.chargedAmount || 0).toLocaleString()}</td>
        <td><span class="badge badge-success">${o.paymentStatus}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderOrdersCancelled() {
    const tbody = document.getElementById('orders-cancelled-tbody');
    if (!tbody) return;
    const orders = getTable('orders');
    const customers = getTable('customers');
    const cancelled = orders.filter(o => o.deliveryStatus === 'cancelled');
    tbody.innerHTML = '';
    if (cancelled.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:15px;">No cancelled orders logged.</td></tr>`;
      return;
    }
    cancelled.forEach(o => {
      const cust = customers.find(c => c.id === o.customerId) || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${o.id}</td>
        <td>${cust.name || 'Unknown'}</td>
        <td>${o.orderType}</td>
        <td>${o.remarks || 'No reason provided'}</td>
        <td><button class="btn btn-xs btn-primary" onclick="alert('Reactivating order...')">Reactivate</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderProductionReports() {
    const tbody = document.getElementById('production-reports-tbody');
    if (!tbody) return;
    const runList = getTable('production_batches');
    tbody.innerHTML = '';
    if (runList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:15px;">No production logs yet.</td></tr>`;
      return;
    }
    runList.forEach(run => {
      const tr = document.createElement('tr');
      const loss = parseFloat(run.broken05L || 0) + parseFloat(run.broken15L || 0);
      const yieldLitres = (parseFloat(run.qty05L || 0) * 0.5 * 12) + (parseFloat(run.qty15L || 0) * 1.5 * 6);
      const totalWater = yieldLitres + (loss * 1.5);
      const lossRate = totalWater > 0 ? ((loss * 1.5) / totalWater * 100).toFixed(2) : 0;
      
      tr.innerHTML = `
        <td>${run.date || '—'}</td>
        <td>${totalWater.toFixed(1)} L</td>
        <td>${run.qty05L || 0} packs</td>
        <td>${run.qty15L || 0} packs</td>
        <td>${loss} pcs</td>
        <td class="bold text-danger">${lossRate}%</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderProductionWater() {
    const chart = document.getElementById('production-water-chart');
    const tbody = document.getElementById('production-water-tbody');
    if (!chart || !tbody) return;
    const runList = getTable('production_batches');
    tbody.innerHTML = '';
    
    let html = '';
    let maxL = 1000;
    
    // Sort and grab last 5 runs
    const recentRuns = [...runList].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-5);
    recentRuns.forEach(run => {
      const yieldLitres = (parseFloat(run.qty05L || 0) * 0.5 * 12) + (parseFloat(run.qty15L || 0) * 1.5 * 6);
      if (yieldLitres > maxL) maxL = yieldLitres;
    });

    recentRuns.forEach(run => {
      const yieldLitres = (parseFloat(run.qty05L || 0) * 0.5 * 12) + (parseFloat(run.qty15L || 0) * 1.5 * 6);
      const pct = (yieldLitres / maxL) * 100;
      html += `
        <div class="chart-bar-item">
          <span class="chart-bar-value">${yieldLitres.toFixed(0)} L</span>
          <div class="chart-bar-fill" style="height: ${pct}%; background-color: var(--color-success);"></div>
          <span class="chart-bar-label">${run.date}</span>
        </div>
      `;
    });
    chart.innerHTML = html || '<p class="description-text">No water consumption data available</p>';

    if (runList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:15px;">No water logs found.</td></tr>';
      return;
    }
    runList.forEach(run => {
      const yieldLitres = (parseFloat(run.qty05L || 0) * 0.5 * 12) + (parseFloat(run.qty15L || 0) * 1.5 * 6);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${run.id}</td>
        <td>${run.date}</td>
        <td class="bold text-cyan">${yieldLitres.toFixed(1)} Litres</td>
        <td>Margalla Aquifer</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderProductionMineral() {
    const tbody = document.getElementById('production-mineral-tbody');
    if (!tbody) return;
    const runs = getTable('production_batches');
    tbody.innerHTML = '';
    if (runs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">No mineral dosing history found.</td></tr>';
      return;
    }
    runs.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${r.id}</td>
        <td>${r.date}</td>
        <td class="bold text-cyan">${(r.sodiumUsed || 0).toFixed(4)} kg</td>
        <td class="bold text-success">${(r.calciumUsed || 0).toFixed(4)} kg</td>
        <td class="bold text-warning">${(r.magnesiumUsed || 0).toFixed(4)} kg</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderInventoryTxns() {
    const tbody = document.getElementById('inventory-txns-tbody');
    if (!tbody) return;
    const purchases = getTable('purchases');
    const runs = getTable('production_batches');
    
    let txns = [];
    purchases.forEach(p => {
      txns.push({
        time: p.date || '—',
        desc: `Purchased: ${p.itemDescription}`,
        type: 'BUYS / IN',
        qty: `+${p.quantity}`,
        role: 'Accountant'
      });
    });
    runs.forEach(r => {
      txns.push({
        time: r.date || '—',
        desc: `Treated Water Production Yield`,
        type: 'PRODUCTION',
        qty: `+${(parseFloat(r.qty05L || 0)*12 + parseFloat(r.qty15L || 0)*6)} bottles`,
        role: 'Production Manager'
      });
    });
    
    txns.sort((a,b) => new Date(b.time) - new Date(a.time));
    tbody.innerHTML = '';
    if (txns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">No stock transactions registered.</td></tr>';
      return;
    }
    txns.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.time}</td>
        <td class="bold">${t.desc}</td>
        <td><span class="badge ${t.type.includes('IN') ? 'badge-success' : 'badge-primary'}">${t.type}</span></td>
        <td class="bold">${t.qty}</td>
        <td>${t.role}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderInventoryLowStock() {
    const tbody = document.getElementById('inventory-low-stock-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const items = getTable('items');
    let count = 0;
    items.forEach(item => {
      if (item.category !== 'raw_material') return;
      const stock = getItemStock(item.id);
      const reorder = parseFloat(item.reorderLevel || 0);
      if (reorder > 0 && stock <= reorder) {
        count++;
        const ratio = reorder > 0 ? (stock / reorder) : 1;
        const urgency = ratio <= 0.25 ? 'Urgent' : ratio <= 0.6 ? 'High' : 'Medium';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="bold">${item.name}</td>
          <td>${stock.toFixed(2)} ${item.unit}</td>
          <td>${reorder} ${item.unit}</td>
          <td><span class="badge ${urgency === 'Urgent' ? 'badge-danger' : (urgency === 'High' ? 'badge-warning' : 'badge-success')}">${urgency}</span></td>
          <td><button class="btn btn-xs btn-cyan" onclick="triggerReorder(${item.id})">Reorder</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (count === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:15px;">All items are at safe levels.</td></tr>`;
    }
  }

  function renderInventoryAdjust() {
    const form = document.getElementById('inventory-adjustment-form');
    if (!form) return;

    const select = document.getElementById('adj-material');
    if (select) {
      const isBadana = state.company === 'badana';
      const allItems = getTable('items');
      const items = isBadana 
        ? allItems.filter(i => [15,16,17,18,19,20].includes(i.id))
        : allItems.filter(i => ![15,16,17,18,19,20].includes(i.id));
      
      select.innerHTML = items.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
    }

    form.onsubmit = function(e) {
      e.preventDefault();
      const itemId = parseInt(document.getElementById('adj-material').value, 10);
      const type = document.getElementById('adj-type').value;
      const qty = parseFloat(document.getElementById('adj-qty').value);
      const location = document.getElementById('adj-location').value;
      const remarks = document.getElementById('adj-remarks').value;
      const date = document.getElementById('closing-date')?.value || new Date().toISOString().split('T')[0];

      if (isDateClosed(date)) {
        alert("ERROR: This date is CLOSED and locked.");
        return;
      }

      const txns = getTable('inventory_transactions');
      const nextId = txns.length > 0 ? Math.max(...txns.map(t => t.id)) + 1 : 1;
      
      txns.push({
        id: nextId,
        itemId: itemId,
        direction: type === 'add' ? 'IN' : 'OUT',
        qty: qty,
        location: location,
        refType: 'adjustment',
        refId: remarks,
        createdAt: date
      });

      saveTable('inventory_transactions', txns);
      logActivity(`Manual stock adjustment: ${type === 'add' ? '+' : '-'}${qty} for Item ID ${itemId} at ${location}`);
      
      alert(`SUCCESS: Manual stock adjustment of ${qty} units posted.`);
      form.reset();
      triggerTabRender('tab-inventory-adjust');
    }
  }

  function renderBottleCompany() {
    const purchases = getTable('purchases').filter(p => p.itemDescription && p.itemDescription.includes('19L'));
    const totalPurchased = purchases.reduce((acc, p) => acc + parseFloat(p.quantity || 0), 1200); // 1200 base
    
    const totalEl = document.getElementById('bottle-com-total');
    if (totalEl) totalEl.innerText = totalPurchased.toLocaleString();
    const whEl = document.getElementById('bottle-com-warehouse');
    if (whEl) whEl.innerText = Math.round(totalPurchased * 0.4).toLocaleString();
    const facEl = document.getElementById('bottle-com-factory');
    if (facEl) facEl.innerText = Math.round(totalPurchased * 0.2).toLocaleString();
  }

  function renderBottleCustomer() {
    const tbody = document.getElementById('bottle-customer-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    customers.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td class="bold text-cyan">${c.bottlesHeld || 0} pcs</td>
        <td>—</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderBottleBroken() {
    const tbody = document.getElementById('bottle-broken-tbody');
    if (!tbody) return;
    const runs = getTable('production_batches');
    tbody.innerHTML = '';
    runs.forEach(r => {
      const totalBroken = parseFloat(r.broken05L || 0) + parseFloat(r.broken15L || 0);
      if (totalBroken > 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.date || '—'}</td>
          <td class="bold text-danger">${totalBroken} bottles</td>
          <td>PET Packaging Line</td>
          <td>Production Manager</td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (tbody.innerHTML === '') {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:15px;">No broken reusable bottles registered.</td></tr>';
    }
  }

  function renderBottleLost() {
    const tbody = document.getElementById('bottle-lost-tbody');
    if (!tbody) return;
    const txns = getTable('bottle_transactions').filter(t => t.txnType === 'lost');
    tbody.innerHTML = '';
    if (txns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:15px;">No written-off empty bottles records.</td></tr>';
      return;
    }
    txns.forEach(t => {
      const tr = document.createElement('tr');
      const custName = t.customerId ? (getTable('customers').find(c => c.id === t.customerId)?.name || 'Unknown') : 'Factory';
      tr.innerHTML = `
        <td>${t.createdAt ? t.createdAt.split('T')[0] : '—'}</td>
        <td class="bold text-danger">${t.qty} pcs</td>
        <td>${custName}</td>
        <td>${t.note || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderBottlePurchased() {
    const tbody = document.getElementById('bottle-purchased-tbody');
    if (!tbody) return;
    const txns = getTable('bottle_transactions').filter(t => t.txnType === 'purchased_new');
    tbody.innerHTML = '';
    if (txns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">No new reusable bottle purchases logged.</td></tr>';
      return;
    }
    txns.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.createdAt ? t.createdAt.split('T')[0] : '—'}</td>
        <td class="bold text-success">${t.qty} pcs</td>
        <td>Rs. 700</td>
        <td class="bold">Rs. ${(t.qty * 700).toLocaleString()}</td>
        <td>Standard Supplier</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderBottleTxns() {
    const tbody = document.getElementById('bottle-txns-tbody');
    if (!tbody) return;
    const txns = getTable('bottle_transactions').sort((a,b) => b.id - a.id);
    tbody.innerHTML = '';
    if (txns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:15px;">No transactions recorded.</td></tr>';
      return;
    }
    txns.forEach(t => {
      const tr = document.createElement('tr');
      const custName = t.customerId ? (getTable('customers').find(c => c.id === t.customerId)?.name || 'Unknown') : 'Factory';
      const actionLabels = {
        delivered_to_customer: 'Delivered to Customer',
        returned_good: 'Returned Good',
        returned_broken: 'Returned Broken',
        lost: 'Lost / Write-off',
        purchased_new: 'Purchased New',
        factory_adjustment: 'Factory Adjustment'
      };
      tr.innerHTML = `
        <td>${t.createdAt ? t.createdAt.split('T')[0] : '—'}</td>
        <td><span class="badge ${t.txnType.includes('return') || t.txnType.includes('purchased') ? 'badge-success' : (t.txnType.includes('delivered') ? 'badge-primary' : 'badge-danger')}">${actionLabels[t.txnType] || t.txnType}</span></td>
        <td class="bold">${t.qty}</td>
        <td>${custName}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderPurchasesHistory() {
    const tbody = document.getElementById('purchases-history-tbody');
    if (!tbody) return;
    const purchases = getTable('purchases').sort((a,b) => b.id - a.id);
    tbody.innerHTML = '';
    if (purchases.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:15px;">No purchase records logged.</td></tr>';
      return;
    }
    purchases.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${p.id}</td>
        <td>${p.date || '—'}</td>
        <td class="bold">${p.vendorName || 'General Supplier'}</td>
        <td>${p.itemDescription}</td>
        <td>${p.quantity}</td>
        <td class="bold text-success">Rs. ${(parseFloat(p.quantity)*parseFloat(p.unitCost || 0)).toLocaleString()}</td>
        <td><a href="#" class="btn btn-xs btn-muted">View Photo</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderPurchasesBills() {
    const tbody = document.getElementById('purchases-bills-tbody');
    if (!tbody) return;
    const purchases = getTable('purchases');
    tbody.innerHTML = '';
    
    let count = 0;
    purchases.sort((a,b) => b.id - a.id).forEach(p => {
      const payable = getVendorPayable(p.vendorId);
      if (payable > 0) {
        count++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="bold">#BILL-${p.id}</td>
          <td>${p.date || '—'}</td>
          <td class="bold">${p.vendorName || 'Vendor'}</td>
          <td class="bold text-danger">Rs. ${(p.quantity * p.unitCost).toLocaleString()}</td>
          <td><button class="btn btn-xs btn-cyan" onclick="triggerVendorPayment(${p.vendorId})">Pay Vendor</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (count === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">All purchase bills are currently cleared.</td></tr>';
    }
  }

  function renderPurchasesPending() {
    const tbody = document.getElementById('purchases-pending-tbody');
    if (!tbody) return;
    const items = getTable('items');
    tbody.innerHTML = '';
    
    let count = 0;
    items.forEach(item => {
      const qty = getItemStock(item.id);
      const safetyLevel = parseFloat(item.reorderLevel || 0);
      if (safetyLevel > 0 && qty <= safetyLevel && item.category === 'raw_material') {
        count++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="bold">${item.name}</td>
          <td class="bold text-danger">${qty.toFixed(2)} ${item.unit}</td>
          <td>${safetyLevel} ${item.unit}</td>
          <td><button class="btn btn-xs btn-cyan" onclick="triggerReorder(${item.id})">Create Purchase Order</button></td>
        `;
        tbody.appendChild(tr);
      }
    });
    if (count === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:15px;">All raw materials are currently at safe stock levels.</td></tr>';
    }
  }

  function renderVendorAddTab() {
    const form = document.getElementById('standalone-vendor-add-form');
    if (!form) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('std-vendor-name').value;
      const phone = document.getElementById('std-vendor-phone').value;
      const remarks = document.getElementById('std-vendor-remarks').value;
      
      const vendors = getTable('vendors');
      if (vendors.some(v => v.name === name)) {
        alert("ERROR: This vendor name is already registered.");
        return;
      }
      
      vendors.push({
        id: nextId(vendors),
        name, phone, remarks
      });
      saveTable('vendors', vendors);
      alert("SUCCESS: Vendor registered.");
      form.reset();
    }
  }

  function renderVendorPayments() {
    const tbody = document.getElementById('vendor-payments-tbody');
    if (!tbody) return;
    const payments = getTable('vendor_payments') || [];
    tbody.innerHTML = '';
    if (payments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:15px;">No vendor payments logged.</td></tr>';
      return;
    }
    const vendors = getTable('vendors');
    payments.forEach(p => {
      const v = vendors.find(vd => vd.id === p.vendorId) || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.paidAt || '—'}</td>
        <td class="bold">${v.name || 'Unknown Vendor'}</td>
        <td class="bold text-success">Rs. ${(p.amount || 0).toLocaleString()}</td>
        <td>${p.method || 'Cash'}</td>
        <td>${p.remarks || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderVendorBalances() {
    const tbody = document.getElementById('vendor-balances-tbody');
    if (!tbody) return;
    const vendors = getTable('vendors');
    tbody.innerHTML = '';
    vendors.forEach(v => {
      const bal = getVendorPayable(v.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${v.name}</td>
        <td>${v.phone || '—'}</td>
        <td class="bold text-danger">Rs. ${bal.toLocaleString()}</td>
        <td><button class="btn btn-xs btn-cyan" onclick="triggerVendorPayment(${v.id})">Pay Supplier</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderVendorPurchaseHistory() {
    const select = document.getElementById('vendor-history-select');
    const tbody = document.getElementById('vendor-purchase-history-tbody');
    if (!select || !tbody) return;
    
    const vendors = getTable('vendors');
    select.innerHTML = '<option value="">-- Choose Vendor --</option>';
    vendors.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.innerText = v.name;
      select.appendChild(opt);
    });

    select.onchange = function() {
      const vId = parseInt(select.value, 10);
      if (!vId) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:20px;">Choose a supplier above to view procurement logs.</td></tr>';
        return;
      }
      const vendor = vendors.find(vd => vd.id === vId) || {};
      const purchases = getTable('purchases').filter(p => p.vendorName === vendor.name);
      tbody.innerHTML = '';
      if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding:20px;">No purchases logs for this supplier.</td></tr>';
        return;
      }
      purchases.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.date || '—'}</td>
          <td>${p.itemDescription}</td>
          <td>${p.quantity}</td>
          <td class="bold text-success">Rs. ${(parseFloat(p.quantity)*parseFloat(p.unitCost || 0)).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  function renderCounterSalesHistory() {
    const tbody = document.getElementById('counter-sales-history-tbody');
    if (!tbody) return;
    const expenses = getTable('expenses');
    const spots = expenses.filter(e => e.type === 'spot_sale').sort((a,b) => b.id - a.id);
    tbody.innerHTML = '';
    if (spots.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:15px;">No counter sales found.</td></tr>';
      return;
    }
    spots.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">#${e.id}</td>
        <td>${e.date}</td>
        <td>${e.litresSold || 0}L</td>
        <td>${e.capsSold || 0}</td>
        <td class="bold text-success">Rs. ${(e.cashReceived || 0).toLocaleString()}</td>
        <td class="bold text-warning">Rs. ${(e.creditAmount || 0).toLocaleString()}</td>
        <td>${e.remarks || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderCounterSalesReports() {
    const expenses = getTable('expenses');
    const spots = expenses.filter(e => e.type === 'spot_sale');
    
    let cash = 0;
    let credit = 0;
    let volume = 0;
    spots.forEach(e => {
      cash += parseFloat(e.cashReceived || 0);
      credit += parseFloat(e.creditAmount || 0);
      volume += parseFloat(e.litresSold || 0);
    });

    const cashEl = document.getElementById('counter-total-cash');
    if (cashEl) cashEl.innerText = `Rs. ${cash.toLocaleString()}`;
    const creditEl = document.getElementById('counter-total-credit');
    if (creditEl) creditEl.innerText = `Rs. ${credit.toLocaleString()}`;
    const volEl = document.getElementById('counter-total-litres');
    if (volEl) volEl.innerText = `${volume.toLocaleString()} L`;
  }

  function renderWebsiteHomepage() {
    // Already populated standard values in form placeholder
  }

  function renderWebsiteCustomers() {
    const tbody = document.getElementById('web-customers-tbody');
    if (!tbody) return;
    const customers = getTable('customers');
    tbody.innerHTML = '';
    customers.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.name}</td>
        <td>${c.type}</td>
        <td><span class="badge badge-success">Visible</span></td>
        <td><button class="btn btn-xs btn-muted" onclick="alert('Visibility toggled')">Toggle</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderWebsiteReviews() {
    // Reviews are statically set in the index.html placeholder to avoid bloat
  }

  function renderWebsiteCareers() {
    // Careers are statically set in the index.html placeholder to avoid bloat
  }

  function renderWebsiteContact() {
    // Contact feedback messages are statically set in the index.html placeholder to avoid bloat
  }

  function renderSettingsProfile() {
    // Settings form is pre-loaded in the index.html template
  }

  function renderSettingsProducts() {
    // Products SKU list table is loaded dynamically / statically in index.html
  }

  function renderSettingsInventory() {
    // Safety limits display settings
  }

  function renderSettingsNotifications() {
    // Notification switches settings
  }

  function renderSettingsSystem() {
    // Base locale variables settings
  }

  function renderUsersRoles(filter = '') {
    // Bind the Add User form if not already bound
    const form = document.getElementById('add-user-form');
    if (form && !form.dataset.bound) {
      form.dataset.bound = '1';
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('new-user-name').value.trim();
        const username = document.getElementById('new-user-username').value.trim();
        const role = document.getElementById('new-user-role').value;
        const phone = document.getElementById('new-user-phone').value.trim();
        const company = document.getElementById('new-user-company').value;
        const active = document.getElementById('new-user-active').checked;

        if (!name || !username) { alert('Please fill in Name and Username.'); return; }

        const users = getTable('system_users');
        if (users.some(u => u.username === username)) {
          alert('ERROR: A user with this username already exists.');
          return;
        }

        users.push({ id: nextId(users), name, username, role, phone, company, active, createdAt: new Date().toISOString() });
        saveTable('system_users', users);

        // Append to the visible user list
        const tbody = document.getElementById('users-list-tbody');
        if (tbody) {
          const roleBadgeMap = { owner: '', admin: 'badge-warning', pm: 'badge-success', mm: 'badge-primary', accountant: 'badge-cyan' };
          const roleLabels = { owner: 'Owner 👑', admin: 'Admin 🛡️', pm: 'PM 🏭', mm: 'MM 📞', accountant: 'Accountant 💰' };
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="bold">${name}</td>
            <td>${username}</td>
            <td><span class="badge ${roleBadgeMap[role] || ''}">${roleLabels[role] || role}</span></td>
            <td>${company === 'both' ? 'Both' : company}</td>
            <td>${phone || '—'}</td>
            <td><span class="badge ${active ? 'badge-success' : 'badge-danger'}">${active ? 'Active' : 'Inactive'}</span></td>
            <td><button class="btn btn-xs btn-danger" onclick="this.closest('tr').remove(); alert('User removed.')">Remove</button></td>
          `;
          tbody.appendChild(tr);
        }

        alert(`SUCCESS: User '${name}' added with role '${roleLabels[role] || role}'.`);
        form.reset();
      });
    }

    // Show/hide sections based on filter
    const activityPanel = document.getElementById('users-activity-logs-panel');
    if (filter === 'logs' && activityPanel) {
      activityPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderSettings(filter = '') {
    // Show password form or backup section based on filter
    const pwForm = document.getElementById('settings-password-form');
    const backupSection = document.getElementById('settings-logs-container');
    if (filter === 'passwords' && pwForm) pwForm.closest('.panel-card').scrollIntoView({ behavior: 'smooth' });
    if (filter === 'backup' && backupSection) backupSection.classList.remove('hidden');
  }

  // --- BUTTON CLICKS & TRIGGERS BINDINGS ---

  // CRM Search triggers
  document.getElementById('crm-search-input').addEventListener('input', (e) => {
    renderCRM(e.target.value);
  });

  document.getElementById('order-list-search').addEventListener('input', renderPendingOrders);

  // Tab switching inside Order desk (19L vs PET)
  document.getElementById('order-type-19l-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('order-type-19l-btn').classList.add('active');
    document.getElementById('order-type-pet-btn').classList.remove('active');
    document.getElementById('row-19l-inputs').classList.remove('hidden');
    document.getElementById('row-pet-inputs').classList.add('hidden');
    document.getElementById('order-type-val').value = '19L';
    recalcOrderTotal();
  });

  document.getElementById('order-type-pet-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('order-type-pet-btn').classList.add('active');
    document.getElementById('order-type-19l-btn').classList.remove('active');
    document.getElementById('row-pet-inputs').classList.remove('hidden');
    document.getElementById('row-19l-inputs').classList.add('hidden');
    document.getElementById('order-type-val').value = 'PET';
    recalcOrderTotal();
  });

  // Warning modal buttons
  document.getElementById('btn-warning-cancel').addEventListener('click', () => {
    document.getElementById('modal-warning').classList.add('hidden');
    if (warningPromiseResolver) warningPromiseResolver(false);
  });

  document.getElementById('btn-warning-confirm').addEventListener('click', () => {
    document.getElementById('modal-warning').classList.add('hidden');
    if (warningPromiseResolver) warningPromiseResolver(true);
  });

  // Modals open/close
  document.getElementById('btn-add-customer').addEventListener('click', () => {
    document.getElementById('modal-customer').classList.remove('hidden');
  });
  document.getElementById('btn-close-cust-modal').addEventListener('click', () => {
    document.getElementById('modal-customer').classList.add('hidden');
  });

  document.getElementById('btn-add-vendor').addEventListener('click', () => {
    document.getElementById('modal-vendor').classList.remove('hidden');
  });
  document.getElementById('btn-close-vendor-modal').addEventListener('click', () => {
    document.getElementById('modal-vendor').classList.add('hidden');
  });

  document.getElementById('btn-close-vp-modal').addEventListener('click', () => {
    document.getElementById('modal-vendor-payment').classList.add('hidden');
  });

  document.getElementById('btn-close-deliv-modal').addEventListener('click', () => {
    document.getElementById('modal-delivery').classList.add('hidden');
  });

  // Spot Sales credit customer visibility toggle
  document.getElementById('spot-credit').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    const group = document.getElementById('spot-customer-select-group');
    if (val > 0) {
      group.style.opacity = '1';
      document.getElementById('spot-customer').setAttribute('required', 'required');
    } else {
      group.style.opacity = '0.5';
      document.getElementById('spot-customer').removeAttribute('required');
    }
  });

  // Production and daily closing live summaries recalculate trigger
  document.getElementById('prod-qty-05l').addEventListener('input', updateProductionRunLive);
  document.getElementById('prod-qty-15l').addEventListener('input', updateProductionRunLive);
  
  document.getElementById('badana-prod-size').addEventListener('change', updateBadanaProductionLive);
  document.getElementById('badana-prod-preform').addEventListener('change', updateBadanaProductionLive);
  document.getElementById('badana-prod-qty').addEventListener('input', updateBadanaProductionLive);

  document.getElementById('closing-date').addEventListener('change', updateDailyClosingCalculations);
  const closingDateAdmin = document.getElementById('closing-date-admin');
  if (closingDateAdmin) {
    closingDateAdmin.addEventListener('change', updateDailyClosingCalculations);
  }

  // Blowing division forms selection tab triggers
  const blowForms = document.querySelectorAll('.blow-action-form');
  const blowTabs = document.querySelectorAll('.blow-act-btn');

  blowTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      blowTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      blowForms.forEach(f => f.classList.add('hidden'));

      if (tab.id === 'btn-blow-purchase') {
        document.getElementById('blow-preform-purchase-form').classList.remove('hidden');
      } else if (tab.id === 'btn-blow-production') {
        document.getElementById('blow-production-form').classList.remove('hidden');
      } else if (tab.id === 'btn-blow-transfer') {
        document.getElementById('blow-transfer-form').classList.remove('hidden');
      } else if (tab.id === 'btn-blow-sale') {
        document.getElementById('blow-sale-form').classList.remove('hidden');
      }
    });
  });

  document.getElementById('blow-prod-qty').addEventListener('input', updateBlowingProductionLive);
  document.getElementById('blow-prod-size').addEventListener('change', updateBlowingProductionLive);
  document.getElementById('blow-prod-type').addEventListener('change', updateBlowingProductionLive);

  // --- HEADER & CONTEXT NAVIGATION CONTROL ---
  // Sidebar nav items are built dynamically by applyRoleSecurity()

  // New Order submit (MM standalone order form)
  document.getElementById('standalone-order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const customerId = parseInt(document.getElementById('new-order-cust').value, 10);
    const type = document.getElementById('std-order-type-val').value;
    const date = document.getElementById('std-order-expected-date').value;
    const remarks = document.getElementById('std-order-remarks') ? document.getElementById('std-order-remarks').value : '';
    const charged = parseFloat(document.getElementById('std-order-charged-amount').value) || 0;
    if (!customerId) { alert('Please select a customer.'); return; }
    if (isDateClosed(date)) { alert('ERROR: This date is CLOSED and locked.'); return; }

    const orders = getTable('orders');
    let newOrder = { id: nextId(orders), customerId, orderType: type, chargedAmount: charged, expectedDelivery: date, remarks, deliveryStatus: 'pending', paymentStatus: 'unpaid', placedAt: new Date().toISOString() };
    if (type === '19L') {
      newOrder.qtyOrdered = parseInt(document.getElementById('std-order-qty-19l').value, 10) || 1;
      newOrder.pricePerUnit = parseFloat(document.getElementById('std-order-price-19l').value) || 0;
    } else {
      newOrder.qty05LOrdered = parseInt(document.getElementById('std-order-qty-05l').value, 10) || 0;
      newOrder.qty15LOrdered = parseInt(document.getElementById('std-order-qty-15l').value, 10) || 0;
      newOrder.price05L = parseFloat(document.getElementById('std-order-price-05l').value) || 0;
      newOrder.price15L = parseFloat(document.getElementById('std-order-price-15l').value) || 0;
    }
    orders.push(newOrder);
    saveTable('orders', orders);
    logActivity(`Placed Standalone Order #${newOrder.id} for Customer ID ${customerId}, Type ${type}, Value Rs. ${charged}`);
    alert('SUCCESS: Order posted.');
    e.target.reset();
    renderNewOrderForm();
    renderDashboard();
  });

  // Post Payment submit (MM / Accountant)
  document.getElementById('payments-posting-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerId = parseInt(document.getElementById('post-pay-cust').value, 10);
    const amount = parseFloat(document.getElementById('post-pay-amount').value) || 0;
    const date = document.getElementById('post-pay-date').value;
    const mode = document.getElementById('post-pay-mode').value;
    const reference = document.getElementById('post-pay-ref').value;
    if (!customerId) { alert('Please select a customer.'); return; }
    if (amount <= 0) { alert('Amount must be greater than 0.'); return; }
    if (isDateClosed(date)) { alert('ERROR: This date is CLOSED and locked.'); return; }
    const payments = getTable('payments');
    payments.push({ id: nextId(payments), customerId, amount, paidAt: date, mode, reference, loggedByRole: state.role });
    saveTable('payments', payments);
    logActivity(`Recorded Payment of Rs. ${amount} for Customer ID ${customerId} via ${mode}`);
    alert('SUCCESS: Payment recorded.');
    e.target.reset();
    renderPaymentsTab();
    renderDashboard();
  });

  // Admin Closing Checklist submit
  document.getElementById('admin-closing-checklist-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const checks = e.target.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checks).every(c => c.checked);
    if (!allChecked) {
      alert('Please verify all checklist items before confirming close of day.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const closings = getTable('daily_closings');
    if (closings.some(c => c.date === today && c.adminVerified)) {
      alert('Today has already been verified by Admin.');
      return;
    }
    const existing = closings.find(c => c.date === today);
    if (existing) {
      existing.adminVerified = true;
      existing.adminVerifiedAt = new Date().toISOString();
    } else {
      closings.push({ id: nextId(closings), date: today, adminVerified: true, adminVerifiedAt: new Date().toISOString(), closedByRole: 'admin' });
    }
    saveTable('daily_closings', closings);
    logActivity(`Admin verified and confirmed Daily Closing checklist for date ${today}`);
    alert('SUCCESS: Day verified and confirmed by Admin Supervisor.');
    e.target.reset();
    renderDailyClosing();
  });


  // 2. Company Switch Button Selection
  const btnAs = document.getElementById('btn-comp-as');
  const btnBi = document.getElementById('btn-comp-bi');

  btnAs.addEventListener('click', () => switchCompany('aquasphere'));
  btnBi.addEventListener('click', () => switchCompany('badana'));

  function switchCompany(companyName) {
    state.company = companyName;

    // Toggle button active states
    if (companyName === 'aquasphere') {
      btnAs.classList.add('active');
      btnBi.classList.remove('active');
      document.getElementById('sidebar-company-label').innerText = 'AquaSphere';
      document.getElementById('sidebar-company-label').className = 'active-company-badge';
    } else {
      btnBi.classList.add('active');
      btnAs.classList.remove('active');
      document.getElementById('sidebar-company-label').innerText = 'Badana Ind.';
      document.getElementById('sidebar-company-label').className = 'active-company-badge comp-badana';
    }

    // Reset customer selection
    state.selectedCustomerId = null;
    document.getElementById('customer-profile-details').classList.add('hidden');
    document.getElementById('crm-empty-state').classList.remove('hidden');
    document.getElementById('crm-search-input').value = '';

    // Re-render
    renderDashboard();
    logActivity(`Switched active company context to ${companyName === 'aquasphere' ? 'AquaSphere' : 'Badana Ind.'}`);
    
    // Find active tab and trigger its render
    const activeNav = document.querySelector('#main-nav-tabs .nav-item.active');
    if (activeNav) {
      activeNav.click();
    }
  }

  // 3. User Role Selector dropdown
  document.getElementById('role-dropdown').addEventListener('change', (e) => {
    state.role = e.target.value;
    applyRoleSecurity();
    renderDashboard();
    logActivity(`Switched active logged role context to ${e.target.value.toUpperCase()}`);
  });

  // --- WINDOW LEVEL HELPERS & DEEP-LINKS ---
  window.switchTab = function(tabId, filter = '') {
    let selector = `.nav-item[data-tab="${tabId}"]`;
    if (filter) {
      selector += `[data-filter="${filter}"]`;
    }
    const btn = document.querySelector(selector) || document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (btn) {
      btn.click();
    } else {
      document.querySelectorAll('.content-panel .tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(tabId);
      if (panel) {
        panel.classList.add('active');
        triggerTabRender(tabId, filter, false);
      }
    }
  };

  window.setReportType = function(type) {
    state.reportType = type;
    renderReports();
  };

  window.setReportPeriod = function(period) {
    state.reportPeriod = period;
    renderReports();
  };

  window.togglePurchasesBillsTab = function(subtab) {
    const cardBills = document.getElementById('card-purchases-bills');
    const cardPending = document.getElementById('card-purchases-pending');
    const btnBills = document.getElementById('btn-subtab-bills');
    const btnPending = document.getElementById('btn-subtab-pending');
    
    if (subtab === 'bills') {
      if (cardBills) cardBills.classList.remove('hidden');
      if (cardPending) cardPending.classList.add('hidden');
      if (btnBills) btnBills.classList.add('active');
      if (btnPending) btnPending.classList.remove('active');
    } else {
      if (cardBills) cardBills.classList.add('hidden');
      if (cardPending) cardPending.classList.remove('hidden');
      if (btnBills) btnBills.classList.remove('active');
      if (btnPending) btnPending.classList.add('active');
    }
  };

  window.filterExpensesList = function(category) {
    document.querySelectorAll('#expenses-filter-tabs .subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.expenseFilter === category);
    });
    renderExpenses(category);
  };

  window.triggerReorder = function(itemId) {
    const itemSelect = document.getElementById('purchase-item');
    if (itemSelect) {
      itemSelect.value = itemId;
      itemSelect.dispatchEvent(new Event('change'));
    }
    switchTab('tab-purchases');
    logActivity(`Initiated procurement reorder flow for item ID ${itemId}`);
  };

  window.triggerVendorPayment = function(vendorId) {
    const vendors = getTable('vendors');
    const v = vendors.find(vd => vd.id === vendorId);
    if (!v) return;
    const balance = getVendorPayable(vendorId);
    
    document.getElementById('pay-vendor-id').value = vendorId;
    document.getElementById('pay-vendor-name').innerText = v.name;
    document.getElementById('pay-vendor-balance').innerText = `Rs. ${balance.toLocaleString()}`;
    document.getElementById('pay-vendor-amount').value = balance;
    
    document.getElementById('modal-vendor-payment').classList.remove('hidden');
    logActivity(`Opened vendor payment modal for ${v.name}`);
  };

  window.triggerCustomerBottleWriteOff = async function(customerId) {
    const customers = getTable('customers');
    const c = customers.find(x => x.id === customerId);
    if (!c) return;
    const held = getCustomerBottles(customerId);
    if (held <= 0) {
      alert("ERROR: Customer has no bottles to write off.");
      return;
    }
    const qtyStr = prompt(`Customer holds ${held} bottles. Enter number of bottles to write off / mark lost:`, held);
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0 || qty > held) {
      alert("ERROR: Invalid quantity.");
      return;
    }
    const note = prompt("Enter reason for write-off / loss:", "Bottles lost by customer");
    if (note === null) return;
    
    const bt = getTable('bottle_transactions');
    bt.push({
      id: bt.length > 0 ? Math.max(...bt.map(t => t.id)) + 1 : 1,
      customerId: customerId,
      txnType: 'lost',
      qty,
      refDeliveryId: null,
      note,
      createdAt: new Date().toISOString()
    });
    saveTable('bottle_transactions', bt);
    
    logActivity(`Wrote off ${qty} empty bottles for customer ${c.name}`);
    alert(`SUCCESS: Wrote off ${qty} bottles.`);
    renderCustomerBottles();
    renderDashboard();
  };

  function bindSettingsActions() {
    const btnBackup = document.getElementById('btn-download-backup');
    const btnExportBulk = document.getElementById('btn-export-bulk');
    const btnImportBulk = document.getElementById('btn-import-bulk');
    const textareaBulk = document.getElementById('bulk-db-textarea');

    if (btnBackup) {
      btnBackup.addEventListener('click', (e) => {
        e.preventDefault();
        const backup = {};
        const tables = [
          'customers', 'items', 'inventory_transactions', 'bottle_transactions',
          'vendors', 'orders', 'deliveries', 'payments', 'production_batches',
          'purchases', 'vendor_payments', 'expenses', 'daily_closings',
          'blowing_transactions', 'blowing_sales', 'activity_logs'
        ];
        tables.forEach(table => {
          backup[table] = getTable(table);
        });
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aquasphere_os_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logActivity('Downloaded database backup JSON');
        alert('SUCCESS: Backup downloaded successfully.');
      });
    }

    const tables = [
      'customers', 'items', 'inventory_transactions', 'bottle_transactions',
      'vendors', 'orders', 'deliveries', 'payments', 'production_batches',
      'purchases', 'vendor_payments', 'expenses', 'daily_closings',
      'blowing_transactions', 'blowing_sales', 'activity_logs'
    ];

    if (btnExportBulk && textareaBulk) {
      btnExportBulk.addEventListener('click', (e) => {
        e.preventDefault();
        const backup = {};
        tables.forEach(table => {
          backup[table] = getTable(table);
        });
        textareaBulk.value = JSON.stringify(backup, null, 2);
        logActivity('Exported bulk database JSON lines');
        alert('SUCCESS: Database state exported to text area.');
      });
    }

    if (btnImportBulk && textareaBulk) {
      btnImportBulk.addEventListener('click', (e) => {
        e.preventDefault();
        const str = textareaBulk.value.trim();
        if (!str) {
          alert('ERROR: Text area is empty.');
          return;
        }
        try {
          const data = JSON.parse(str);
          tables.forEach(table => {
            if (data[table] !== undefined) {
              saveTable(table, data[table]);
            }
          });
          logActivity('Imported bulk database JSON lines');
          alert('SUCCESS: Database backup imported successfully.');
          renderDashboard();
        } catch (err) {
          alert('ERROR: Invalid JSON structure. Check your bulk lines input.');
        }
      });
    }

    const btnLogs = document.getElementById('btn-view-logs');
    if (btnLogs) {
      btnLogs.addEventListener('click', (e) => {
        e.preventDefault();
        const logsContainer = document.getElementById('settings-logs-container');
        if (logsContainer) {
          logsContainer.classList.toggle('hidden');
          if (!logsContainer.classList.contains('hidden')) {
            renderSettingsLogs();
          }
        }
      });
    }
  }

  function renderSettingsLogs() {
    const tbody = document.getElementById('settings-logs-body');
    if (!tbody) return;
    const logs = getTable('activity_logs').sort((a,b) => b.id - a.id);
    tbody.innerHTML = '';
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="padding:15px;">No integrity logs found.</td></tr>';
      return;
    }
    logs.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${l.timestamp}</td>
        <td><span class="badge badge-warning">${l.role}</span></td>
        <td>${l.action}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function injectSubtabs() {
    Object.entries(SUB_TABS_CONFIG).forEach(([mainTabId, subs]) => {
      if (subs.length <= 1) return;
      if (mainTabId === 'tab-reports') return; // reports uses inline HTML sub-tabs

      // Collect all unique target panels for this group
      const targetPanelIds = [...new Set(subs.map(s => s.tab))];

      targetPanelIds.forEach(targetTabId => {
        const panel = document.getElementById(targetTabId);
        if (!panel) return;

        const card = panel.querySelector('.panel-card');
        if (!card) return;

        if (card.querySelector('.page-subtabs-row')) return;

        const row = document.createElement('div');
        row.className = 'page-subtabs-row';
        row.style.marginBottom = '20px';

        subs.forEach(sub => {
          const btn = document.createElement('button');
          btn.className = 'subtab-btn';
          btn.dataset.tab = sub.tab;
          btn.dataset.filter = sub.filter || '';
          btn.innerText = sub.label;
          if (sub.tab === targetTabId && (sub.filter || '') === '') {
            btn.classList.add('active');
          }
          btn.addEventListener('click', () => {
            switchTab(sub.tab, sub.filter || '');
          });
          row.appendChild(btn);
        });

        card.insertBefore(row, card.firstChild);
      });
    });
  }

  // --- BOOTSTRAP INITIALIZATION ---
  function initApp() {
    initDatabase();
    bindSettingsActions();
    
    // Set current date in top badge & forms
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('expense-date').value = todayStr;
    document.getElementById('closing-date').value = todayStr;

    // Initial setups
    applyRoleSecurity();
    injectSubtabs();
    renderDashboard();
    renderCRM();
  }

  window.addEventListener('DOMContentLoaded', initApp);

})();
