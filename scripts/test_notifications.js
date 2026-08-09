const assert = require('assert');
const notifications = require('../rubies-backend/notifications');

(async () => {
  const orderResult = await notifications.sendOrderNotifications({
    productName: 'Test Tea',
    clientName: 'Test User',
    clientEmail: 'test@example.com',
    clientPhone: '+2348123456789',
    sizeQuantity: '100g',
    logisticsInstructions: 'Leave at gate',
    orderId: 'test-order-1'
  }, { dryRun: true });

  assert.strictEqual(orderResult.success, true);
  assert.ok(orderResult.summary.includes('WhatsApp'));
  assert.ok(orderResult.summary.includes('SMS'));

  const contactResult = await notifications.sendContactNotifications({
    name: 'Test Contact',
    email: 'contact@example.com',
    phone: '+2348123456789',
    message: 'Hello from the test suite'
  }, { dryRun: true });

  assert.strictEqual(contactResult.success, true);
  assert.ok(contactResult.summary.includes('SMS'));
  console.log('Notification helper test passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
