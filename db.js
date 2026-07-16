const fs = require('fs');
const path = require('path');

// ponytail: basic atomic file operations with tmp rename to avoid partial writes
function getFilePath(company, table) {
  const comp = company.toLowerCase() === 'badana' ? 'badana' : 'aquasphere';
  return path.join(__dirname, 'data', comp, `${table}.json`);
}

function read(company, table) {
  const filePath = getFilePath(company, table);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    // ponytail: fallback to empty if parse fails, prevent crash
    return [];
  }
}

function write(company, table, data) {
  const filePath = getFilePath(company, table);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
}

function getInventory(company) {
  const items = read(company, 'items');
  const txns = read(company, 'inventory_transactions');
  const inventory = {};
  items.forEach(item => {
    inventory[item.id] = 0;
  });
  txns.forEach(t => {
    const qty = parseFloat(t.qty) || 0;
    if (t.direction === 'IN') {
      inventory[t.itemId] = (inventory[t.itemId] || 0) + qty;
    } else if (t.direction === 'OUT') {
      inventory[t.itemId] = (inventory[t.itemId] || 0) - qty;
    }
  });
  return inventory;
}

function getCustomerBalances(company, customerId) {
  const orders = read(company, 'orders').filter(o => o.customerId === customerId);
  const payments = read(company, 'payments').filter(p => p.customerId === customerId);
  
  const ordersTotal = orders.reduce((sum, o) => sum + (parseFloat(o.amountCharged) || 0), 0);
  const paymentsTotal = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const outstanding = ordersTotal - paymentsTotal;
  
  const bottleTxns = read(company, 'bottle_transactions').filter(t => t.customerId === customerId);
  let bottleBalance = 0;
  bottleTxns.forEach(t => {
    const qty = parseInt(t.qty, 10) || 0;
    if (t.txnType === 'delivered_to_customer') {
      bottleBalance += qty;
    } else if (t.txnType === 'returned_good' || t.txnType === 'returned_broken' || t.txnType === 'lost') {
      bottleBalance -= qty;
    }
  });
  
  return {
    outstanding,
    bottleBalance
  };
}

function getVendorBalances(company, vendorId) {
  const purchases = read(company, 'purchases').filter(p => p.vendorId === vendorId);
  const payments = read(company, 'vendor_payments').filter(vp => vp.vendorId === vendorId);
  
  const purchasesTotal = purchases.reduce((sum, p) => sum + (parseFloat(p.totalCost) || (parseFloat(p.qty) * parseFloat(p.unitCost)) || 0), 0);
  const paymentsTotal = payments.reduce((sum, vp) => sum + (parseFloat(vp.amount) || 0), 0);
  
  return purchasesTotal - paymentsTotal;
}

function getBottleSummary(company) {
  const txns = read(company, 'bottle_transactions');
  let atFactory = 0;
  let withCustomers = 0;
  let broken = 0;
  let lost = 0;
  
  txns.forEach(t => {
    const qty = parseInt(t.qty, 10) || 0;
    if (t.txnType === 'purchased_new') {
      atFactory += qty;
    } else if (t.txnType === 'delivered_to_customer') {
      atFactory -= qty;
      withCustomers += qty;
    } else if (t.txnType === 'returned_good') {
      atFactory += qty;
      withCustomers -= qty;
    } else if (t.txnType === 'returned_broken') {
      broken += qty;
      withCustomers -= qty;
    } else if (t.txnType === 'lost') {
      lost += qty;
      if (t.customerId) {
        withCustomers -= qty;
      } else {
        atFactory -= qty;
      }
    } else if (t.txnType === 'factory_adjustment') {
      atFactory += qty;
    }
  });
  
  const totalOwned = atFactory + withCustomers + broken;
  return {
    totalOwned,
    atFactory,
    withCustomers,
    broken,
    lost
  };
}

module.exports = {
  read,
  write,
  getFilePath,
  getInventory,
  getCustomerBalances,
  getVendorBalances,
  getBottleSummary
};

