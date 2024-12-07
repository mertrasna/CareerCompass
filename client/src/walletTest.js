// Automated unit tests
// wallet logic
function updateWalletBalance(currentBalance, transaction) {
    if (transaction.type === 'add') {
      return currentBalance + transaction.amount;
    } else if (transaction.type === 'deduct') {
      if (transaction.amount > currentBalance) {
        throw new Error('Insufficient balance');
      }
      return currentBalance - transaction.amount;
    }
    throw new Error('Invalid transaction type');
  }
  
  // Test 1 - add balance
  try {
    const initialBalance1 = 100;
    const transaction1 = { type: 'add', amount: 50 };
    const expectedBalance1 = 150;
  
    const actualBalance1 = updateWalletBalance(initialBalance1, transaction1);
    console.log('Test Case 1:', actualBalance1 === expectedBalance1 ? 'Pass' : 'Fail');
  } catch (error) {
    console.error('Test Case 1: Fail', error.message);
  }
  
  // Test 2 - decut balance
  try {
    const initialBalance2 = 150;
    const transaction2 = { type: 'deduct', amount: 30 };
    const expectedBalance2 = 120;
  
    const actualBalance2 = updateWalletBalance(initialBalance2, transaction2);
    console.log('Test Case 2:', actualBalance2 === expectedBalance2 ? 'Pass' : 'Fail');
  } catch (error) {
    console.error('Test Case 2: Fail', error.message);
  }
  
  // Test 3 -  insufficient funds
  try {
    const initialBalance3 = 50;
    const transaction3 = { type: 'deduct', amount: 100 };
  
    updateWalletBalance(initialBalance3, transaction3);
    console.log('Test Case 3: Fail (Should have thrown an error)');
  } catch (error) {
    console.log('Test Case 3:', error.message === 'Insufficient balance' ? 'Pass' : 'Fail');
  }
  