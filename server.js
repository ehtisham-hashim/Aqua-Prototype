const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Parse company and role headers
app.use((req, res, next) => {
  req.company = (req.headers['x-company-context'] || 'aquasphere').toLowerCase();
  req.role = (req.headers['x-user-role'] || 'owner').toLowerCase();
  next();
});

// Helper for next auto-increment ID
function getNextId(company, table) {
  const data = db.read(company, table);
  if (data.length === 0) return 1;
  const ids = data.map(item => parseInt(item.id, 10)).filter(id => !isNaN(id));
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

// Permission checking middleware
function checkPermission(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ error: `Forbidden: role '${req.role}' has no access.` });
    }
    next();
  };
}

// Daily closing lock middleware
function checkClosedDay(getDateFunc) {
  return (req, res, next) => {
    if (req.role === 'owner') {
      return next(); // Owner bypasses locks
    }
    const dateVal = getDateFunc(req);
    if (!dateVal) return next();
    const dateStr = dateVal.substring(0, 10); // YYYY-MM-DD
    const closings = db.read(req.company, 'daily_closings');
    const isClosed = closings.some(c => c.date.substring(0, 10) === dateStr);
    if (isClosed) {
      return res.status(403).json({ error: `Date ${dateStr} is closed. Only Owner can modify.` });
    }
    next();
  };
}

// Helper to get latest purchase unit cost
function getLatestUnitCost(company, itemId, defaultVal) {
  const purchases = db.read(company, 'purchases').filter(p => p.itemId === itemId);
  if (purchases.length === 0) return defaultVal;
  purchases.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
  return parseFloat(purchases[0].unitCost) || defaultVal;
}

// ================= CUSTOMERS =================
app.get('/api/customers', checkPermission(['owner', 'admin', 'accountant', 'mm']), (req, res) => {
  const customers = db.read(req.company, 'customers');
  const q = (req.query.q || '').toLowerCase();
  
  const filtered = customers.filter(c => 
    String(c.id).includes(q) || 
    (c.name && c.name.toLowerCase().includes(q)) || 
    (c.phone && c.phone.includes(q))
  );

  const enriched = filtered.map(c => {
    const balances = db.getCustomerBalances(req.company, c.id);
    return { ...c, ...balances };
  });

  res.json(enriched);
});

app.post('/api/customers', checkPermission(['owner', 'accountant', 'mm']), (req, res) => {
  const customers = db.read(req.company, 'customers');
  const { phone, name, address, mapsLocation, customerType, creditLimit, creditDuration, defaultPrice, remarks, homePictureUrl } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ error: "Phone and Name are required." });
  }

  const exists = customers.some(c => c.phone === phone);
  if (exists) {
    return res.status(400).json({ error: "Customer with this phone number already exists." });
  }

  const newCust = {
    id: getNextId(req.company, 'customers'),
    phone,
    name,
    address,
    mapsLocation: mapsLocation || null,
    homePictureUrl: homePictureUrl || null,
    customerType: customerType || 'Home',
    creditLimit: parseFloat(creditLimit) || 0,
    creditDuration: parseInt(creditDuration, 10) || 30,
    defaultPrice: defaultPrice ? parseFloat(defaultPrice) : null,
    remarks: remarks || ""
  };

  customers.push(newCust);
  db.write(req.company, 'customers', customers);
  res.status(201).json(newCust);
});

// ================= ORDERS =================
app.get('/api/orders', checkPermission(['owner', 'admin', 'accountant', 'mm', 'pm']), (req, res) => {
  const orders = db.read(req.company, 'orders');
  const customers = db.read(req.company, 'customers');
  
  const enriched = orders.map(o => {
    const cust = customers.find(c => c.id === o.customerId);
    return {
      ...o,
      customerName: cust ? cust.name : "Unknown",
      customerPhone: cust ? cust.phone : ""
    };
  });
  
  res.json(enriched);
});

app.post('/api/orders', 
  checkPermission(['owner', 'mm']), 
  checkClosedDay(req => req.body.expectedDelivery), 
  (req, res) => {
    const { customerId, orderType, amountCharged, expectedDelivery, remarks, qtyOrdered, qty05LOrdered, qty15LOrdered } = req.body;
    
    if (!customerId || !orderType || !expectedDelivery) {
      return res.status(400).json({ error: "CustomerId, orderType, and expectedDelivery are required." });
    }

    const customers = db.read(req.company, 'customers');
    const cust = customers.find(c => c.id === parseInt(customerId, 10));
    if (!cust) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Credit limit warning logic (soft-block)
    const balances = db.getCustomerBalances(req.company, cust.id);
    const newTotalOutstanding = balances.outstanding + (parseFloat(amountCharged) || 0);
    let warning = null;
    if (cust.creditLimit > 0 && newTotalOutstanding > cust.creditLimit && !req.body.confirmCreditBreach) {
      return res.json({
        warning: true,
        type: "CREDIT_LIMIT_EXCEEDED",
        message: `Outstanding balance Rs. ${balances.outstanding.toFixed(2)} + new order Rs. ${parseFloat(amountCharged).toFixed(2)} = Rs. ${newTotalOutstanding.toFixed(2)} exceeds credit limit Rs. ${cust.creditLimit.toFixed(2)}. Proceed?`
      });
    }

    const orders = db.read(req.company, 'orders');
    const newOrder = {
      id: getNextId(req.company, 'orders'),
      customerId: parseInt(customerId, 10),
      orderType,
      amountCharged: parseFloat(amountCharged) || 0,
      deliveryStatus: 'pending',
      paymentStatus: 'unpaid',
      expectedDelivery,
      remarks: remarks || "",
      qtyOrdered: parseInt(qtyOrdered, 10) || 0,
      qty05LOrdered: parseInt(qty05LOrdered, 10) || 0,
      qty15LOrdered: parseInt(qty15LOrdered, 10) || 0,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    db.write(req.company, 'orders', orders);
    res.status(201).json(newOrder);
});

// ================= DELIVERIES =================
app.get('/api/deliveries', checkPermission(['owner', 'admin', 'accountant', 'mm', 'pm']), (req, res) => {
  res.json(db.read(req.company, 'deliveries'));
});

app.post('/api/deliveries', 
  checkPermission(['owner', 'mm']), 
  checkClosedDay(req => req.body.deliveredAt), 
  (req, res) => {
    const { 
      orderId, 
      qtyDelivered, 
      bottlesReturnedGood, 
      bottlesReturnedBroken, 
      qty05LDelivered, 
      qty15LDelivered, 
      cashReceived, 
      paymentMethod, 
      remarks, 
      deliveredAt 
    } = req.body;

    if (!orderId || !deliveredAt) {
      return res.status(400).json({ error: "OrderId and deliveredAt are required." });
    }

    const orders = db.read(req.company, 'orders');
    const order = orders.find(o => o.id === parseInt(orderId, 10));
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // For 19L order: check returned bottle limit against customer's current balance
    if (order.orderType === '19L') {
      const balances = db.getCustomerBalances(req.company, order.customerId);
      const totalReturned = (parseInt(bottlesReturnedGood, 10) || 0) + (parseInt(bottlesReturnedBroken, 10) || 0);
      if (totalReturned > balances.bottleBalance && !req.body.confirmExcessReturn) {
        return res.json({
          warning: true,
          type: "EXCESS_BOTTLES_RETURNED",
          message: `Customer only holds ${balances.bottleBalance} bottles. Returning ${totalReturned} bottles. Proceed?`
        });
      }
    }

    const deliveries = db.read(req.company, 'deliveries');
    const deliveryId = getNextId(req.company, 'deliveries');
    const newDelivery = {
      id: deliveryId,
      orderId: parseInt(orderId, 10),
      deliveredAt,
      qtyDelivered: parseInt(qtyDelivered, 10) || 0,
      bottlesReturnedGood: parseInt(bottlesReturnedGood, 10) || 0,
      bottlesReturnedBroken: parseInt(bottlesReturnedBroken, 10) || 0,
      qty05LDelivered: parseInt(qty05LDelivered, 10) || 0,
      qty15LDelivered: parseInt(qty15LDelivered, 10) || 0,
      remarks: remarks || ""
    };

    deliveries.push(newDelivery);
    db.write(req.company, 'deliveries', deliveries);

    // Save payments if cash received > 0
    const cashAmt = parseFloat(cashReceived) || 0;
    if (cashAmt > 0) {
      const payments = db.read(req.company, 'payments');
      payments.push({
        id: getNextId(req.company, 'payments'),
        orderId: order.id,
        customerId: order.customerId,
        amount: cashAmt,
        method: paymentMethod || 'cash',
        receivedAt: deliveredAt
      });
      db.write(req.company, 'payments', payments);
    }

    // Trigger calculations
    const invTxns = db.read(req.company, 'inventory_transactions');
    const bottleTxns = db.read(req.company, 'bottle_transactions');

    if (order.orderType === '19L') {
      const qDel = parseInt(qtyDelivered, 10) || 0;
      
      // 1. Deduct 1 Large Cap (Item 10)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions'),
        itemId: 10,
        direction: 'OUT',
        qty: qDel,
        refType: 'sale',
        refId: String(deliveryId),
        createdAt: deliveredAt
      });

      // 2. Deduct Mineral Sets: 23L water = 23 / 15140 mineral sets per bottle
      const mineralsDeducted = (23 * qDel) / 15140;
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 1,
        itemId: 12,
        direction: 'OUT',
        qty: mineralsDeducted,
        refType: 'sale',
        refId: String(deliveryId),
        createdAt: deliveredAt
      });

      // 3. Create bottle transactions
      // Delivered to customer
      bottleTxns.push({
        id: getNextId(req.company, 'bottle_transactions'),
        customerId: order.customerId,
        txnType: 'delivered_to_customer',
        qty: qDel,
        refDeliveryId: deliveryId,
        note: `Delivery for order #${orderId}`,
        createdAt: deliveredAt
      });

      // Returned Good
      const rGood = parseInt(bottlesReturnedGood, 10) || 0;
      if (rGood > 0) {
        bottleTxns.push({
          id: getNextId(req.company, 'bottle_transactions') + 1,
          customerId: order.customerId,
          txnType: 'returned_good',
          qty: rGood,
          refDeliveryId: deliveryId,
          note: `Good returns for delivery #${deliveryId}`,
          createdAt: deliveredAt
        });
      }

      // Returned Broken
      const rBroken = parseInt(bottlesReturnedBroken, 10) || 0;
      if (rBroken > 0) {
        bottleTxns.push({
          id: getNextId(req.company, 'bottle_transactions') + 2,
          customerId: order.customerId,
          txnType: 'returned_broken',
          qty: rBroken,
          refDeliveryId: deliveryId,
          note: `Broken returns for delivery #${deliveryId}`,
          createdAt: deliveredAt
        });
      }
      
      db.write(req.company, 'bottle_transactions', bottleTxns);
    } else if (order.orderType === 'PET') {
      const q05Del = parseInt(qty05LDelivered, 10) || 0;
      const q15Del = parseInt(qty15LDelivered, 10) || 0;

      // 1. Deduct finished goods pack (0.5L PET Pack = Item 14)
      if (q05Del > 0) {
        invTxns.push({
          id: getNextId(req.company, 'inventory_transactions'),
          itemId: 14,
          direction: 'OUT',
          qty: q05Del,
          refType: 'sale',
          refId: String(deliveryId),
          createdAt: deliveredAt
        });
      }

      // 2. Deduct finished goods pack (1.5L PET Pack = Item 13)
      if (q15Del > 0) {
        invTxns.push({
          id: getNextId(req.company, 'inventory_transactions') + 1,
          itemId: 13,
          direction: 'OUT',
          qty: q15Del,
          refType: 'sale',
          refId: String(deliveryId),
          createdAt: deliveredAt
        });
      }
    }

    db.write(req.company, 'inventory_transactions', invTxns);

    // Recompute order statuses
    const allDeliveries = deliveries.filter(d => d.orderId === order.id);
    let totalDelivered = 0;
    let total05Del = 0;
    let total15Del = 0;

    allDeliveries.forEach(d => {
      totalDelivered += d.qtyDelivered;
      total05Del += d.qty05LDelivered;
      total15Del += d.qty15LDelivered;
    });

    if (order.orderType === '19L') {
      order.deliveryStatus = totalDelivered >= order.qtyOrdered ? 'delivered' : (totalDelivered > 0 ? 'partial' : 'pending');
    } else {
      const all05 = total05Del >= order.qty05LOrdered;
      const all15 = total15Del >= order.qty15LOrdered;
      const some05 = total05Del > 0;
      const some15 = total15Del > 0;
      order.deliveryStatus = (all05 && all15) ? 'delivered' : ((some05 || some15) ? 'partial' : 'pending');
    }

    const allPayments = db.read(req.company, 'payments').filter(p => p.orderId === order.id);
    const paidTotal = allPayments.reduce((sum, p) => sum + p.amount, 0);
    order.paymentStatus = paidTotal >= order.amountCharged ? 'paid' : (paidTotal > 0 ? 'partial' : 'unpaid');

    db.write(req.company, 'orders', orders);

    res.json({ message: "Delivery recorded successfully", delivery: newDelivery });
});

// ================= PAYMENTS =================
app.get('/api/payments', checkPermission(['owner', 'admin', 'accountant', 'mm']), (req, res) => {
  res.json(db.read(req.company, 'payments'));
});

app.post('/api/payments', 
  checkPermission(['owner', 'accountant', 'mm']), 
  checkClosedDay(req => req.body.receivedAt), 
  (req, res) => {
    const { orderId, customerId, amount, method, receivedAt, remarks } = req.body;
    if (!customerId || !amount || !receivedAt) {
      return res.status(400).json({ error: "CustomerId, amount, and receivedAt are required." });
    }

    const payments = db.read(req.company, 'payments');
    const payment = {
      id: getNextId(req.company, 'payments'),
      orderId: orderId ? parseInt(orderId, 10) : null,
      customerId: parseInt(customerId, 10),
      amount: parseFloat(amount) || 0,
      method: method || 'cash',
      receivedAt,
      remarks: remarks || ""
    };

    payments.push(payment);
    db.write(req.company, 'payments', payments);

    if (orderId) {
      const orders = db.read(req.company, 'orders');
      const order = orders.find(o => o.id === parseInt(orderId, 10));
      if (order) {
        const orderPays = payments.filter(p => p.orderId === order.id);
        const totalPaid = orderPays.reduce((sum, p) => sum + p.amount, 0);
        order.paymentStatus = totalPaid >= order.amountCharged ? 'paid' : (totalPaid > 0 ? 'partial' : 'unpaid');
        db.write(req.company, 'orders', orders);
      }
    }

    res.status(201).json(payment);
});

// ================= PRODUCTION BATCHES =================
app.get('/api/production-batches', checkPermission(['owner', 'admin', 'pm']), (req, res) => {
  res.json(db.read(req.company, 'production_batches'));
});

app.post('/api/production-batches', 
  checkPermission(['owner', 'pm']), 
  checkClosedDay(req => req.body.productionDate), 
  (req, res) => {
    const { qty05LProduced, qty15LProduced, productionDate } = req.body;
    if (qty05LProduced === undefined || qty15LProduced === undefined || !productionDate) {
      return res.status(400).json({ error: "qty05LProduced, qty15LProduced, and productionDate are required." });
    }

    const q05 = parseInt(qty05LProduced, 10) || 0;
    const q15 = parseInt(qty15LProduced, 10) || 0;

    // Calculate mineral sets: 0.5L pack = 12 * 9L water, 1.5L pack = 6 * 12L water, treats 15140L/set
    const water05 = q05 * 12 * 9;
    const water15 = q15 * 6 * 12;
    const totalWater = water05 + water15;
    const mineralSets = totalWater / 15140;

    const batches = db.read(req.company, 'production_batches');
    const batchId = getNextId(req.company, 'production_batches');

    const newBatch = {
      id: batchId,
      productionDate,
      qty05LProduced: q05,
      qty15LProduced: q15,
      mineralSetsConsumed: mineralSets
    };

    batches.push(newBatch);
    db.write(req.company, 'production_batches', batches);

    // Save inventory transactions
    const invTxns = db.read(req.company, 'inventory_transactions');

    // 1. Process 0.5L PET pack consumption (12 empty bottles, 12 small caps, 6.72g labels, 50g shrink wrap, minerals)
    if (q05 > 0) {
      // 0.5L Empty Bottles (Item 5)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions'),
        itemId: 5,
        direction: 'OUT',
        qty: q05 * 12,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Small Caps (Item 9)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 1,
        itemId: 9,
        direction: 'OUT',
        qty: q05 * 12,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // 0.5L Labels (Item 7) - 6.72g per pack
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 2,
        itemId: 7,
        direction: 'OUT',
        qty: (6.72 * q05) / 1000,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Shrink Wrap (Item 8) - 50g per pack
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 3,
        itemId: 8,
        direction: 'OUT',
        qty: (50.0 * q05) / 1000,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Finished Goods Addition (Item 14)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 4,
        itemId: 14,
        direction: 'IN',
        qty: q05,
        refType: 'production_output',
        refId: String(batchId),
        createdAt: productionDate
      });
    }

    // 2. Process 1.5L PET pack consumption (6 empty bottles, 6 small caps, 7.86g labels, 50g shrink wrap, minerals)
    if (q15 > 0) {
      // 1.5L Empty Bottles (Item 4)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 5,
        itemId: 4,
        direction: 'OUT',
        qty: q15 * 6,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Small Caps (Item 9)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 6,
        itemId: 9,
        direction: 'OUT',
        qty: q15 * 6,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // 1.5L Labels (Item 6) - 7.86g per pack
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 7,
        itemId: 6,
        direction: 'OUT',
        qty: (7.86 * q15) / 1000,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Shrink Wrap (Item 8) - 50g per pack
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 8,
        itemId: 8,
        direction: 'OUT',
        qty: (50.0 * q15) / 1000,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
      // Finished Goods Addition (Item 13)
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 9,
        itemId: 13,
        direction: 'IN',
        qty: q15,
        refType: 'production_output',
        refId: String(batchId),
        createdAt: productionDate
      });
    }

    // 3. Deduct Mineral Sets (Item 12)
    if (mineralSets > 0) {
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions') + 10,
        itemId: 12,
        direction: 'OUT',
        qty: mineralSets,
        refType: 'production_consume',
        refId: String(batchId),
        createdAt: productionDate
      });
    }

    db.write(req.company, 'inventory_transactions', invTxns);
    res.status(201).json(newBatch);
});

// ================= PURCHASES =================
app.get('/api/purchases', checkPermission(['owner', 'admin', 'accountant', 'pm']), (req, res) => {
  res.json(db.read(req.company, 'purchases'));
});

app.post('/api/purchases', 
  checkPermission(['owner', 'accountant']), 
  checkClosedDay(req => req.body.purchasedAt), 
  (req, res) => {
    const { vendorId, itemId, qty, unitCost, purchasedAt, remarks } = req.body;
    if (!vendorId || !itemId || !qty || !unitCost || !purchasedAt) {
      return res.status(400).json({ error: "vendorId, itemId, qty, unitCost, and purchasedAt are required." });
    }

    const purchases = db.read(req.company, 'purchases');
    const pId = getNextId(req.company, 'purchases');
    const totalCost = parseFloat(qty) * parseFloat(unitCost);

    const newPurchase = {
      id: pId,
      vendorId: parseInt(vendorId, 10),
      itemId: parseInt(itemId, 10),
      qty: parseFloat(qty),
      unitCost: parseFloat(unitCost),
      totalCost,
      purchasedAt,
      remarks: remarks || ""
    };

    purchases.push(newPurchase);
    db.write(req.company, 'purchases', purchases);

    // Save to relevant ledgers
    if (parseInt(itemId, 10) === 11) {
      // 19L Empty bottles purchase is an asset ledger transaction
      const bottleTxns = db.read(req.company, 'bottle_transactions');
      bottleTxns.push({
        id: getNextId(req.company, 'bottle_transactions'),
        customerId: null,
        txnType: 'purchased_new',
        qty: parseInt(qty, 10),
        refDeliveryId: null,
        note: remarks || `Purchase reference #${pId}`,
        createdAt: purchasedAt
      });
      db.write(req.company, 'bottle_transactions', bottleTxns);
    } else {
      // General raw material item transaction
      const invTxns = db.read(req.company, 'inventory_transactions');
      invTxns.push({
        id: getNextId(req.company, 'inventory_transactions'),
        itemId: parseInt(itemId, 10),
        direction: 'IN',
        qty: parseFloat(qty),
        refType: 'purchase',
        refId: String(pId),
        createdAt: purchasedAt
      });
      db.write(req.company, 'inventory_transactions', invTxns);
    }

    res.status(201).json(newPurchase);
});

// ================= VENDOR PAYMENTS =================
app.get('/api/vendor-payments', checkPermission(['owner', 'admin', 'accountant']), (req, res) => {
  res.json(db.read(req.company, 'vendor_payments'));
});

app.post('/api/vendor-payments', 
  checkPermission(['owner', 'accountant']), 
  checkClosedDay(req => req.body.paidAt), 
  (req, res) => {
    const { vendorId, amount, method, paidAt, remarks } = req.body;
    if (!vendorId || !amount || !paidAt) {
      return res.status(400).json({ error: "vendorId, amount, and paidAt are required." });
    }

    const payments = db.read(req.company, 'vendor_payments');
    const newPayment = {
      id: getNextId(req.company, 'vendor_payments'),
      vendorId: parseInt(vendorId, 10),
      amount: parseFloat(amount) || 0,
      method: method || 'cash',
      paidAt,
      remarks: remarks || ""
    };

    payments.push(newPayment);
    db.write(req.company, 'vendor_payments', payments);
    res.status(201).json(newPayment);
});

// ================= EXPENSES =================
app.get('/api/expenses', checkPermission(['owner', 'admin', 'accountant']), (req, res) => {
  res.json(db.read(req.company, 'expenses'));
});

app.post('/api/expenses', 
  checkPermission(['owner', 'accountant']), 
  checkClosedDay(req => req.body.date), 
  (req, res) => {
    const { type, amount, date, remarks, receiptPhoto } = req.body;
    if (!type || !amount || !date) {
      return res.status(400).json({ error: "type, amount, and date are required." });
    }

    // Enforce mandatory receipt for accountant
    if (req.role === 'accountant' && !receiptPhoto) {
      return res.status(400).json({ error: "Accountant must upload receipt photo." });
    }

    const expenses = db.read(req.company, 'expenses');
    const newExpense = {
      id: getNextId(req.company, 'expenses'),
      type,
      amount: parseFloat(amount) || 0,
      date,
      remarks: remarks || "",
      receiptPhoto: receiptPhoto || null
    };

    expenses.push(newExpense);
    db.write(req.company, 'expenses', expenses);
    res.status(201).json(newExpense);
});

// ================= DAILY CLOSINGS =================
app.get('/api/daily-closings', checkPermission(['owner', 'admin']), (req, res) => {
  res.json(db.read(req.company, 'daily_closings'));
});

app.post('/api/daily-closings', 
  checkPermission(['owner', 'admin']), 
  (req, res) => {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: "Date is required." });
    }

    const closings = db.read(req.company, 'daily_closings');
    const alreadyClosed = closings.some(c => c.date.substring(0, 10) === date.substring(0, 10));
    if (alreadyClosed) {
      return res.status(400).json({ error: "This day is already closed." });
    }

    const newClosing = {
      id: getNextId(req.company, 'daily_closings'),
      date: date.substring(0, 10),
      closedBy: req.role,
      closedAt: new Date().toISOString()
    };

    closings.push(newClosing);
    db.write(req.company, 'daily_closings', closings);
    res.status(201).json(newClosing);
});

// ================= BLOWING PRODUCTION =================
app.get('/api/blowing-production', checkPermission(['owner', 'admin', 'pm', 'accountant']), (req, res) => {
  const txns = db.read(req.company, 'blowing_transactions');
  
  // Calculate current stock levels dynamically
  let purePreforms = 0;
  let mixedPreforms = 0;
  const bottleStock = {};

  txns.forEach(t => {
    const q = parseFloat(t.qty) || 0;
    if (t.item === 'pure_preform') {
      purePreforms += (t.direction === 'IN' ? q : -q);
    } else if (t.item === 'mixed_preform') {
      mixedPreforms += (t.direction === 'IN' ? q : -q);
    } else if (t.item.startsWith('bottle_')) {
      bottleStock[t.item] = (bottleStock[t.item] || 0) + (t.direction === 'IN' ? q : -q);
    }
  });

  res.json({
    transactions: txns,
    stock: {
      purePreformFactoryKg: purePreforms,
      mixedPreformFactoryKg: mixedPreforms,
      bottlesWarehousePcs: bottleStock
    }
  });
});

app.post('/api/blowing-production', 
  checkPermission(['owner', 'pm']), 
  checkClosedDay(req => req.body.date), 
  (req, res) => {
    const { type, preformType, qty, date, remarks, companyName, bottleSize, grade } = req.body;
    const mode = type || 'production';

    if (!date || !qty) {
      return res.status(400).json({ error: "date and qty are required." });
    }

    const txns = db.read(req.company, 'blowing_transactions');

    if (mode === 'purchase') {
      if (!preformType) {
        return res.status(400).json({ error: "preformType is required for purchase." });
      }
      
      const newTxn = {
        id: getNextId(req.company, 'blowing_transactions'),
        txnType: 'preform_purchase',
        preformType,
        qty: parseFloat(qty),
        createdAt: date + "T12:00:00+05:00",
        remarks: remarks || ""
      };

      txns.push(newTxn);
      db.write(req.company, 'blowing_transactions', txns);
      return res.status(201).json(newTxn);

    } else if (mode === 'production') {
      if (!companyName || !bottleSize || !grade) {
        return res.status(400).json({ error: "companyName, bottleSize, and grade are required for production." });
      }

      // Enforce: Aqua Sphere only has Pure bottles
      if (companyName.toLowerCase() === 'aquasphere' && grade.toLowerCase() === 'mixed') {
        return res.status(400).json({ error: "Aqua Sphere only produces Pure preform bottles." });
      }

      const qVal = parseInt(qty, 10) || 0;
      let preformWeight = 0;
      if (grade.toLowerCase() === 'pure') {
        preformWeight = qVal * (bottleSize === '1.5L' ? 30 : 15);
      } else {
        preformWeight = qVal * (bottleSize === '1.5L' ? 27 : 13);
      }
      const weightKg = preformWeight / 1000;

      const newTxn = {
        id: getNextId(req.company, 'blowing_transactions'),
        txnType: 'production',
        brand: companyName.toLowerCase(),
        preformType: grade.toLowerCase(),
        size: bottleSize,
        qty: qVal,
        preformWeightDeducted: weightKg,
        createdAt: date + "T12:00:00+05:00",
        remarks: remarks || ""
      };

      txns.push(newTxn);
      db.write(req.company, 'blowing_transactions', txns);

      return res.status(201).json(newTxn);
    } else if (mode === 'transfer') {
      if (!companyName || !bottleSize || !grade) {
        return res.status(400).json({ error: "companyName, bottleSize, and grade are required for transfer." });
      }
      const qVal = parseInt(qty, 10) || 0;
      const newTxn = {
        id: getNextId(req.company, 'blowing_transactions'),
        txnType: 'transfer',
        brand: companyName.toLowerCase(),
        preformType: grade.toLowerCase(),
        size: bottleSize,
        qty: qVal,
        createdAt: date + "T12:00:00+05:00",
        remarks: remarks || ""
      };
      txns.push(newTxn);
      db.write(req.company, 'blowing_transactions', txns);
      return res.status(201).json(newTxn);
    } else {
      return res.status(400).json({ error: "Invalid type. Must be 'purchase', 'production', or 'transfer'." });
    }
});

// ================= BLOWING SALES =================
app.get('/api/blowing-sales', checkPermission(['owner', 'admin', 'accountant', 'mm']), (req, res) => {
  res.json(db.read(req.company, 'blowing_sales'));
});

app.post('/api/blowing-sales', 
  checkPermission(['owner', 'accountant', 'mm']), 
  checkClosedDay(req => req.body.date), 
  (req, res) => {
    const { companyName, bottleSize, grade, qty, location, amountCharged, cashReceived, paymentMethod, customerName, date, remarks } = req.body;
    if (!companyName || !bottleSize || !grade || !qty || !location || !amountCharged || !date) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    const blowingSales = db.read(req.company, 'blowing_sales');
    const newSale = {
      id: getNextId(req.company, 'blowing_sales'),
      companyName,
      bottleSize,
      grade,
      qty: parseInt(qty, 10) || 0,
      location,
      amountCharged: parseFloat(amountCharged) || 0,
      cashReceived: parseFloat(cashReceived) || 0,
      paymentMethod: paymentMethod || 'cash',
      customerName: customerName || "Generic Customer",
      date,
      remarks: remarks || ""
    };

    blowingSales.push(newSale);
    db.write(req.company, 'blowing_sales', blowingSales);

    // Save deduction in blowing_transactions
    const txns = db.read(req.company, 'blowing_transactions');
    txns.push({
      id: getNextId(req.company, 'blowing_transactions'),
      txnType: 'sale',
      brand: companyName.toLowerCase(),
      preformType: grade.toLowerCase(),
      size: bottleSize,
      qty: parseInt(qty, 10) || 0,
      location: location.toLowerCase(),
      createdAt: date + "T12:00:00+05:00",
      remarks: remarks || ""
    });
    db.write(req.company, 'blowing_transactions', txns);

    res.status(201).json(newSale);
});

// ================= DASHBOARD =================
app.get('/api/dashboard', (req, res) => {
  const todayStr = req.query.date || new Date().toISOString().substring(0, 10);
  
  // Fetch databases
  const orders = db.read(req.company, 'orders');
  const payments = db.read(req.company, 'payments');
  const expenses = db.read(req.company, 'expenses');
  const deliveries = db.read(req.company, 'deliveries');
  const customers = db.read(req.company, 'customers');
  const vendors = db.read(req.company, 'vendors');
  const items = db.read(req.company, 'items');

  // Today's calculations
  const todayOrders = orders.filter(o => (o.createdAt && o.createdAt.startsWith(todayStr)) || (o.expectedDelivery && o.expectedDelivery.startsWith(todayStr)));
  const todaySales = todayOrders.reduce((sum, o) => sum + (parseFloat(o.amountCharged) || 0), 0);

  const todayPayments = payments.filter(p => p.receivedAt && p.receivedAt.startsWith(todayStr));
  const todayCashCollection = todayPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const todayCreditSales = Math.max(0, todaySales - todayCashCollection);

  const todayExps = expenses.filter(e => e.date && e.date.startsWith(todayStr));
  const todayExpenses = todayExps.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // COGS Calculation
  const costLargeCap = getLatestUnitCost(req.company, 10, 3.0);
  const costMineralSet = getLatestUnitCost(req.company, 12, 1200.0);
  const cost05Empty = getLatestUnitCost(req.company, 5, 5.0);
  const costSmallCap = getLatestUnitCost(req.company, 9, 1.0);
  const cost05Label = getLatestUnitCost(req.company, 7, 200.0);
  const costShrinkWrap = getLatestUnitCost(req.company, 8, 150.0);
  const cost15Empty = getLatestUnitCost(req.company, 4, 8.0);
  const cost15Label = getLatestUnitCost(req.company, 6, 250.0);

  const cogsPer19L = costLargeCap + (23 / 15140) * costMineralSet;
  const cogsPer05LPack = 12 * cost05Empty + 12 * costSmallCap + 0.00672 * cost05Label + 0.05 * costShrinkWrap + (108 / 15140) * costMineralSet;
  const cogsPer15LPack = 6 * cost15Empty + 6 * costSmallCap + 0.00786 * cost15Label + 0.05 * costShrinkWrap + (72 / 15140) * costMineralSet;

  const todayDeliveries = deliveries.filter(d => d.deliveredAt && d.deliveredAt.startsWith(todayStr));
  let todayCOGS = 0;
  todayDeliveries.forEach(d => {
    const o = orders.find(ord => ord.id === d.orderId);
    if (!o) return;
    if (o.orderType === '19L') {
      todayCOGS += (parseInt(d.qtyDelivered, 10) || 0) * cogsPer19L;
    } else {
      todayCOGS += (parseInt(d.qty05LDelivered, 10) || 0) * cogsPer05LPack;
      todayCOGS += (parseInt(d.qty15LDelivered, 10) || 0) * cogsPer15LPack;
    }
  });

  const estimatedProfit = todaySales - todayExpenses - todayCOGS;

  // Pending & Completed orders
  const pendingOrdersList = orders.filter(o => o.deliveryStatus === 'pending' || o.deliveryStatus === 'partial');
  const completedOrdersCount = orders.filter(o => o.deliveryStatus === 'delivered').length;

  // Customer outstanding summary
  let outstandingCustomerBalances = 0;
  customers.forEach(c => {
    outstandingCustomerBalances += db.getCustomerBalances(req.company, c.id).outstanding;
  });

  // Vendor outstanding summary
  let outstandingVendorBalances = 0;
  vendors.forEach(v => {
    outstandingVendorBalances += db.getVendorBalances(req.company, v.id);
  });

  // Inventory & Alerts
  const inventory = db.getInventory(req.company);
  const rawMaterialInventory = [];
  const finishedGoodsInventory = [];
  const lowStockAlerts = [];

  items.forEach(item => {
    const stock = inventory[item.id] || 0;
    const details = {
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      stock,
      reorderLevel: item.reorderLevel,
      lowStock: stock <= item.reorderLevel
    };

    if (item.category === 'raw_material') {
      rawMaterialInventory.push(details);
      if (details.lowStock) {
        lowStockAlerts.push(`Low stock warning for raw material: ${item.name}. Current stock: ${stock.toFixed(2)} ${item.unit}.`);
      }
    } else {
      finishedGoodsInventory.push(details);
    }
  });

  // 19L Bottle Summary
  const bottleSummary = db.getBottleSummary(req.company);

  // CRM Alerts
  const crmAlerts = [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  customers.forEach(c => {
    const custOrders = orders.filter(o => o.customerId === c.id);
    let inactive = false;
    if (custOrders.length === 0) {
      inactive = true;
    } else {
      custOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestOrderDate = new Date(custOrders[0].createdAt);
      if (latestOrderDate < sevenDaysAgo) {
        inactive = true;
      }
    }
    if (inactive) {
      crmAlerts.push({
        customerId: c.id,
        name: c.name,
        phone: c.phone,
        message: "Requires Follow-Up: No orders in last 1 week."
      });
    }

    // Credit limit breach check
    const cb = db.getCustomerBalances(req.company, c.id);
    if (c.creditLimit > 0 && cb.outstanding > c.creditLimit) {
      crmAlerts.push({
        customerId: c.id,
        name: c.name,
        phone: c.phone,
        message: `Credit Breach: Outstanding balance Rs. ${cb.outstanding.toFixed(2)} exceeds credit limit Rs. ${c.creditLimit.toFixed(2)}.`
      });
    }
  });

  // Response mapping with role permissions filtered out
  const responseData = {};

  // Financial / Profit metrics (hidden from Admin, PM)
  if (req.role !== 'admin' && req.role !== 'pm') {
    responseData.todaySales = todaySales;
    responseData.todayCashCollection = todayCashCollection;
    responseData.todayCreditSales = todayCreditSales;
    responseData.todayExpenses = todayExpenses;
    responseData.estimatedProfit = estimatedProfit;
    responseData.outstandingCustomerBalances = outstandingCustomerBalances;
    responseData.outstandingVendorBalances = outstandingVendorBalances;
  }

  // Stock / Inventory metrics (hidden from Accountant)
  if (req.role !== 'accountant') {
    responseData.rawMaterialInventory = rawMaterialInventory;
    responseData.finishedGoodsInventory = finishedGoodsInventory;
    responseData.lowStockAlerts = lowStockAlerts;
  }

  // Common metrics
  responseData.pendingOrdersCount = pendingOrdersList.length;
  responseData.pendingOrdersList = pendingOrdersList;
  responseData.completedOrdersCount = completedOrdersCount;
  responseData.bottleSummary = bottleSummary;
  responseData.crmAlerts = crmAlerts;

  res.json(responseData);
});

// ================= REPORTS =================
app.get('/api/reports', (req, res) => {
  const period = req.query.period || 'monthly'; // daily, weekly, monthly, yearly
  const orders = db.read(req.company, 'orders');
  const payments = db.read(req.company, 'payments');
  const expenses = db.read(req.company, 'expenses');
  const deliveries = db.read(req.company, 'deliveries');
  const batches = db.read(req.company, 'production_batches');
  const customers = db.read(req.company, 'customers');
  const vendors = db.read(req.company, 'vendors');

  const now = new Date();

  // Helper function to check if record date fits the period filter
  function matchPeriod(dateStr) {
    if (!dateStr) return false;
    const recordDate = new Date(dateStr);
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    if (period === 'daily') {
      return recordDate.toDateString() === now.toDateString();
    } else if (period === 'weekly') {
      return diffDays >= 0 && diffDays <= 7;
    } else if (period === 'monthly') {
      return diffDays >= 0 && diffDays <= 30;
    } else if (period === 'yearly') {
      return diffDays >= 0 && diffDays <= 365;
    }
    return true;
  }

  // 1. Sales Report
  const filteredOrders = orders.filter(o => matchPeriod(o.createdAt));
  const totalSales = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.amountCharged) || 0), 0);

  // 2. Expenses Report
  const filteredExpenses = expenses.filter(e => matchPeriod(e.date));
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // 3. Profit (COGS) Report
  const costLargeCap = getLatestUnitCost(req.company, 10, 3.0);
  const costMineralSet = getLatestUnitCost(req.company, 12, 1200.0);
  const cost05Empty = getLatestUnitCost(req.company, 5, 5.0);
  const costSmallCap = getLatestUnitCost(req.company, 9, 1.0);
  const cost05Label = getLatestUnitCost(req.company, 7, 200.0);
  const costShrinkWrap = getLatestUnitCost(req.company, 8, 150.0);
  const cost15Empty = getLatestUnitCost(req.company, 4, 8.0);
  const cost15Label = getLatestUnitCost(req.company, 6, 250.0);

  const cogsPer19L = costLargeCap + (23 / 15140) * costMineralSet;
  const cogsPer05LPack = 12 * cost05Empty + 12 * costSmallCap + 0.00672 * cost05Label + 0.05 * costShrinkWrap + (108 / 15140) * costMineralSet;
  const cogsPer15LPack = 6 * cost15Empty + 6 * costSmallCap + 0.00786 * cost15Label + 0.05 * costShrinkWrap + (72 / 15140) * costMineralSet;

  const filteredDeliveries = deliveries.filter(d => matchPeriod(d.deliveredAt));
  let totalCOGS = 0;
  filteredDeliveries.forEach(d => {
    const o = orders.find(ord => ord.id === d.orderId);
    if (!o) return;
    if (o.orderType === '19L') {
      totalCOGS += (parseInt(d.qtyDelivered, 10) || 0) * cogsPer19L;
    } else {
      totalCOGS += (parseInt(d.qty05LDelivered, 10) || 0) * cogsPer05LPack;
      totalCOGS += (parseInt(d.qty15LDelivered, 10) || 0) * cogsPer15LPack;
    }
  });

  const estimatedProfit = totalSales - totalExpenses - totalCOGS;

  // 4. Production Report
  const filteredBatches = batches.filter(b => matchPeriod(b.productionDate));
  const total05Produced = filteredBatches.reduce((sum, b) => sum + (parseInt(b.qty05LProduced, 10) || 0), 0);
  const total15Produced = filteredBatches.reduce((sum, b) => sum + (parseInt(b.qty15LProduced, 10) || 0), 0);

  // 5. Customer Credits Summary
  const customerCredits = customers.map(c => {
    const cb = db.getCustomerBalances(req.company, c.id);
    return {
      customerId: c.id,
      name: c.name,
      phone: c.phone,
      outstanding: cb.outstanding
    };
  }).filter(c => c.outstanding > 0);

  // 6. Vendor Balances Summary
  const vendorBalances = vendors.map(v => {
    const outstanding = db.getVendorBalances(req.company, v.id);
    return {
      vendorId: v.id,
      name: v.name,
      outstanding
    };
  }).filter(v => v.outstanding > 0);

  // Report structure based on roles
  const report = {};

  if (req.role !== 'pm') {
    report.totalSales = totalSales;
    report.totalExpenses = totalExpenses;
    if (req.role !== 'admin') {
      report.totalCOGS = totalCOGS;
      report.estimatedProfit = estimatedProfit;
    }
    report.customerCredits = customerCredits;
    report.vendorBalances = vendorBalances;
  }

  if (req.role !== 'accountant') {
    report.production = {
      total05ProducedPacks: total05Produced,
      total15ProducedPacks: total15Produced,
      batches: filteredBatches
    };
    report.bottleSummary = db.getBottleSummary(req.company);
  }

  res.json(report);
});

// ================= VENDORS & RAW DB =================
app.get('/api/raw-db', checkPermission(['owner', 'admin']), (req, res) => {
  const tables = [
    'customers',
    'items',
    'inventory_transactions',
    'bottle_transactions',
    'vendors',
    'orders',
    'deliveries',
    'payments',
    'production_batches',
    'purchases',
    'vendor_payments',
    'expenses',
    'daily_closings',
    'blowing_transactions',
    'blowing_sales'
  ];
  const dbData = {};
  tables.forEach(table => {
    dbData[table] = db.read(req.company, table);
  });
  res.json(dbData);
});

app.post('/api/save-table/:table', (req, res) => {
  const table = req.params.table;
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Data must be an array." });
  }
  db.write(req.company, table, data);
  res.json({ success: true });
});


app.get('/api/vendors', checkPermission(['owner', 'admin', 'accountant']), (req, res) => {
  res.json(db.read(req.company, 'vendors'));
});

app.post('/api/vendors', checkPermission(['owner', 'accountant']), (req, res) => {
  const { name, phone, remarks } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Vendor name is required." });
  }
  const vendors = db.read(req.company, 'vendors');
  const exists = vendors.some(v => v.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Vendor with this name already exists." });
  }
  const newVendor = {
    id: getNextId(req.company, 'vendors'),
    name,
    phone: phone || "",
    remarks: remarks || ""
  };
  vendors.push(newVendor);
  db.write(req.company, 'vendors', vendors);
  res.status(201).json(newVendor);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
