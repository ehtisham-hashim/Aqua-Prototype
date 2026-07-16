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
    { id: 14, name: "0.5L PET finished goods", category: "finished_good", unit: "pcs", reorderLevel: 0 }
  ];

  const DEFAULT_INVENTORY_TXNS = [
    { id: 1, itemId: 1, direction: "IN", qty: 10, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 2, itemId: 2, direction: "IN", qty: 30, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 3, itemId: 3, direction: "IN", qty: 15, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 4, itemId: 4, direction: "IN", qty: 8000, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 5, itemId: 5, direction: "IN", qty: 9000, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 6, itemId: 6, direction: "IN", qty: 25, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 7, itemId: 7, direction: "IN", qty: 20, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 8, itemId: 8, direction: "IN", qty: 18, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 9, itemId: 9, direction: "IN", qty: 8500, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 10, itemId: 10, direction: "IN", qty: 800, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 11, itemId: 11, direction: "IN", qty: 120, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 12, itemId: 12, direction: "IN", qty: 5, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 13, itemId: 13, direction: "IN", qty: 50, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" },
    { id: 14, itemId: 14, direction: "IN", qty: 80, refType: "adjustment", refId: "seed", createdAt: "2026-07-16" }
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
    const key = getDbKey(table);
    let data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }

  function saveTable(table, data) {
    const key = getDbKey(table);
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Seeding Database
  function initDatabase() {
    const companies = ['aquasphere', 'badana'];
    companies.forEach(comp => {
      const checkKey = `${comp}_customers`;
      if (!localStorage.getItem(checkKey)) {
        localStorage.setItem(`${comp}_customers`, JSON.stringify(DEFAULT_CUSTOMERS));
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
  function getItemStock(itemId) {
    const txns = getTable('inventory_transactions');
    let stock = 0;
    txns.forEach(t => {
      if (t.itemId === itemId) {
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

  // --- ROLE AND COMPANY ACCESS FILTERS ---
  function applyRoleSecurity() {
    const role = state.role;
    
    // 1. Hide/show metrics bar options
    const metricsBar = document.getElementById('owner-metrics-bar');
    if (role === 'admin' || role === 'pm') {
      metricsBar.classList.add('hidden');
    } else {
      metricsBar.classList.remove('hidden');
      if (role === 'accountant') {
        // accountant cannot see net profit calculations
        document.querySelectorAll('.owner-only').forEach(el => el.classList.add('hidden'));
      } else {
        document.querySelectorAll('.owner-only').forEach(el => el.classList.remove('hidden'));
      }
    }

    // 2. Hide/show tabs in sidebar
    const navItems = document.querySelectorAll('#main-nav-tabs .nav-item');
    navItems.forEach(item => {
      const tabName = item.getAttribute('data-tab');
      let visible = true;

      if (role === 'pm') {
        // PM sees only production and blowing
        visible = ['tab-production', 'tab-blowing'].includes(tabName);
      } else if (role === 'accountant') {
        // Accountant sees purchases, expenses, and closing
        visible = ['tab-purchases', 'tab-expenses', 'tab-closing', 'tab-blowing'].includes(tabName);
      } else if (role === 'mm') {
        // MM sees CRM, deliveries, and blowing
        visible = ['tab-crm', 'tab-orders', 'tab-blowing'].includes(tabName);
      }
      
      if (visible) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // 3. Fallback active tab if current is hidden
    const activeBtn = document.querySelector('#main-nav-tabs .nav-item.active');
    if (activeBtn && activeBtn.classList.contains('hidden')) {
      // Find first visible nav item
      const firstVisible = document.querySelector('#main-nav-tabs .nav-item:not(.hidden)');
      if (firstVisible) {
        firstVisible.click();
      }
    }
  }

  // --- RENDERING ROUTINES ---

  // 1. Render Dashboard/Stats metrics
  function renderDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = getTable('deliveries');
    const payments = getTable('payments');
    const orders = getTable('orders');
    const expenses = getTable('expenses');

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

    document.getElementById('stat-sales').innerText = `Rs. ${sales.toLocaleString()}`;
    document.getElementById('stat-cash').innerText = `Rs. ${cashCollected.toLocaleString()}`;
    document.getElementById('stat-credit').innerText = `Rs. ${creditSales.toLocaleString()}`;
    document.getElementById('stat-expenses').innerText = `Rs. ${expenseTotal.toLocaleString()}`;
    document.getElementById('stat-profit').innerText = `Rs. ${estProfit.toLocaleString()}`;

    // Update pending order badge count
    const pendingCount = orders.filter(o => o.deliveryStatus !== 'delivered').length;
    document.getElementById('pending-orders-count').innerText = pendingCount;
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
  function renderPendingOrders() {
    const orders = getTable('orders');
    const customers = getTable('customers');
    const deliveries = getTable('deliveries');
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';

    const pendingOrders = orders.filter(o => o.deliveryStatus !== 'delivered');
    const searchVal = document.getElementById('order-list-search').value.toLowerCase().trim();

    const filtered = pendingOrders.filter(o => {
      const cust = customers.find(c => c.id === o.customerId);
      return cust ? cust.name.toLowerCase().includes(searchVal) : false;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 25px;">No pending deliveries found. All clean!</td></tr>`;
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
        <td>
          <button class="btn btn-sm btn-cyan btn-log-deliv" data-id="${o.id}">Complete Delivery</button>
        </td>
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
    const items = getTable('items');
    const grid = document.getElementById('production-inventory-status');
    grid.innerHTML = '';

    items.forEach(item => {
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
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px;">No production runs recorded yet.</td></tr>`;
      return;
    }

    batches.sort((a,b) => b.id - a.id).forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#PROD-${b.id}</td>
        <td>${b.productionDate}</td>
        <td>${b.qty05LProduced} packs</td>
        <td>${b.qty15LProduced} packs</td>
        <td class="bold text-accent">${parseFloat(b.mineralSetsConsumed).toFixed(5)} sets</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateProductionRunLive() {
    const q05 = parseFloat(document.getElementById('prod-qty-05l').value) || 0;
    const q15 = parseFloat(document.getElementById('prod-qty-15l').value) || 0;

    const totalWater = (q05 * 12 * 9) + (q15 * 6 * 12);
    const minerals = totalWater / 15140;

    document.getElementById('run-water-litres').innerText = totalWater.toLocaleString();
    document.getElementById('run-mineral-sets').innerText = minerals.toFixed(5);
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

    const rawItems = getTable('items').filter(i => i.category === 'raw_material');
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
  function renderExpenses() {
    const expenses = getTable('expenses');
    const tbody = document.getElementById('expenses-table-log-body');
    tbody.innerHTML = '';

    const sorted = expenses.sort((a,b) => b.id - a.id);
    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 15px;">No expenses or spot sales logged.</td></tr>`;
      return;
    }

    sorted.forEach(e => {
      let typeLabel = '';
      let amountLabel = '';
      let details = e.remarks || '';

      if (e.type === 'spot_sale') {
        typeLabel = `<span class="badge badge-success">Spot Sale</span>`;
        amountLabel = `<span class="bold text-success">+ Rs. ${e.cashReceived.toLocaleString()}</span>`;
        details += ` (${e.litresSold}L sold, ${e.capsSold} caps)`;
      } else {
        typeLabel = `<span class="badge badge-danger">Expense: ${e.type}</span>`;
        amountLabel = `<span class="bold text-danger">- Rs. ${e.amount.toLocaleString()}</span>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${typeLabel}</td>
        <td>${e.date}</td>
        <td>${amountLabel}</td>
        <td>${details}</td>
      `;
      tbody.appendChild(tr);
    });

    // Populate spot sale customer select options
    const select = document.getElementById('spot-customer');
    const customers = getTable('customers');
    select.innerHTML = '<option value="">-- Cash Sale Only --</option>' + 
      customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');
  }

  // 7. Render Daily Closing
  function renderDailyClosing() {
    const closings = getTable('daily_closings');
    const tbody = document.getElementById('closings-history-body');
    tbody.innerHTML = '';

    if (closings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 15px;">No closed days ledger entries.</td></tr>`;
      return;
    }

    closings.sort((a,b) => b.id - a.id).forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="bold">${c.date}</td>
        <td>${c.totalDeliveries}</td>
        <td class="text-cyan">Rs. ${c.salesValue.toLocaleString()}</td>
        <td class="text-success">Rs. ${c.cashCollected.toLocaleString()}</td>
        <td class="text-danger">Rs. ${c.expenses.toLocaleString()}</td>
        <td><span class="badge badge-success">Closed (Locked)</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function updateDailyClosingCalculations() {
    const dateVal = document.getElementById('closing-date').value;
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
    document.getElementById('modal-delivery').classList.add('hidden');
    renderPendingOrders();
    renderDashboard();
  });

  // 3. Post PET production batch
  document.getElementById('pet-production-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('closing-date').value || new Date().toISOString().split('T')[0];
    const q05 = parseInt(document.getElementById('prod-qty-05l').value, 10) || 0;
    const q15 = parseInt(document.getElementById('prod-qty-15l').value, 10) || 0;

    if (isDateClosed(date)) {
      alert("ERROR: This date is CLOSED and locked. Cannot submit production.");
      return;
    }

    const totalWater = (q05 * 12 * 9) + (q15 * 6 * 12);
    const minerals = totalWater / 15140;

    const batches = getTable('production_batches');
    const bId = batches.length > 0 ? Math.max(...batches.map(b => b.id)) + 1 : 1;
    batches.push({
      id: bId,
      productionDate: date,
      qty05LProduced: q05,
      qty15LProduced: q15,
      mineralSetsConsumed: minerals
    });
    saveTable('production_batches', batches);

    // Save inventory transactions
    const invTxns = getTable('inventory_transactions');
    
    // 0.5L pack: 12x 0.5L empty, 12x caps, 6.72g labels, 50g wrap, finished IN
    if (q05 > 0) {
      invTxns.push({ id: invTxns.length + 1, itemId: 5, direction: 'OUT', qty: q05 * 12, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 9, direction: 'OUT', qty: q05 * 12, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 7, direction: 'OUT', qty: (6.72 * q05) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 8, direction: 'OUT', qty: (50.0 * q05) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 14, direction: 'IN', qty: q05, refType: 'production_output', refId: String(bId), createdAt: date });
    }

    // 1.5L pack: 6x 1.5L empty, 6x caps, 7.86g labels, 50g wrap, finished IN
    if (q15 > 0) {
      invTxns.push({ id: invTxns.length + 1, itemId: 4, direction: 'OUT', qty: q15 * 6, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 9, direction: 'OUT', qty: q15 * 6, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 6, direction: 'OUT', qty: (7.86 * q15) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 8, direction: 'OUT', qty: (50.0 * q15) / 1000, refType: 'production_consume', refId: String(bId), createdAt: date });
      invTxns.push({ id: invTxns.length + 1, itemId: 13, direction: 'IN', qty: q15, refType: 'production_output', refId: String(bId), createdAt: date });
    }

    // Minerals Sets OUT
    if (minerals > 0) {
      invTxns.push({ id: invTxns.length + 1, itemId: 12, direction: 'OUT', qty: minerals, refType: 'production_consume', refId: String(bId), createdAt: date });
    }

    saveTable('inventory_transactions', invTxns);
    alert("SUCCESS: Production run posted.");
    document.getElementById('pet-production-form').reset();
    updateProductionRunLive();
    renderProduction();
  });

  // 4. Post vendor purchase bill
  document.getElementById('purchase-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const vendorId = parseInt(document.getElementById('purchase-vendor').value, 10);
    const itemId = parseInt(document.getElementById('purchase-item').value, 10);
    const qty = parseFloat(document.getElementById('purchase-qty').value);
    const cost = parseFloat(document.getElementById('purchase-cost').value);
    const date = document.getElementById('expense-date').value || new Date().toISOString().split('T')[0];

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
    document.getElementById('blow-sale-form').reset();
    renderBlowing();
  });

  // --- MODAL DIALOGS SUBMITS (CRUD) ---

  // 1. Add Customer Profile
  document.getElementById('modal-customer-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const maps = document.getElementById('cust-maps').value;
    const photo = document.getElementById('cust-photo').value;
    const type = document.getElementById('cust-type').value;
    const price = parseFloat(document.getElementById('cust-price').value) || 250;
    const limit = parseFloat(document.getElementById('cust-credit-limit').value) || 0;
    const duration = parseInt(document.getElementById('cust-credit-duration').value, 10) || 1;
    const remarks = document.getElementById('cust-remarks').value;

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

    alert("SUCCESS: Vendor payment recorded.");
    document.getElementById('modal-vendor-payment').classList.add('hidden');
    renderPurchases();
    renderDashboard();
  });

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
  document.getElementById('closing-date').addEventListener('change', updateDailyClosingCalculations);

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

  // 1. Sidebar tab switching
  const navItems = document.querySelectorAll('#main-nav-tabs .nav-item');
  const panels = document.querySelectorAll('.content-panel .tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const targetTab = item.getAttribute('data-tab');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');

      // Update page title in header
      const label = item.querySelector('.nav-label').innerText;
      document.getElementById('page-title').innerText = label.split(' (')[0];

      // Tab specific re-renders
      if (targetTab === 'tab-crm') {
        renderCRM();
      } else if (targetTab === 'tab-orders') {
        renderPendingOrders();
      } else if (targetTab === 'tab-production') {
        renderProduction();
      } else if (targetTab === 'tab-purchases') {
        renderPurchases();
      } else if (targetTab === 'tab-expenses') {
        renderExpenses();
      } else if (targetTab === 'tab-closing') {
        renderDailyClosing();
        updateDailyClosingCalculations();
      } else if (targetTab === 'tab-blowing') {
        renderBlowing();
      }
    });
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
  });

  // --- BOOTSTRAP INITIALIZATION ---
  function initApp() {
    initDatabase();
    
    // Set current date in top badge & forms
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('expense-date').value = todayStr;
    document.getElementById('closing-date').value = todayStr;

    // Initial setups
    applyRoleSecurity();
    renderDashboard();
    renderCRM();
  }

  window.addEventListener('DOMContentLoaded', initApp);

})();
