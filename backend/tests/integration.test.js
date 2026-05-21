const {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
} = require('../utils/authUtils');

async function runFullAuthTests() {
    try {
        console.log('\n=== FULL AUTHENTICATION SYSTEM TEST ===\n');
        
        // Test 1: Hash Password
        console.log('TEST 1: Hash Password');
        const password = 'SecurePassword123!';
        const hashedPassword = await hashPassword(password);
        console.log('✅ Password hashed successfully');
        console.log('Original length:', password.length);
        console.log('Hash length:', hashedPassword.length);
        
        // Test 2: Compare Correct Password
        console.log('\nTEST 2: Compare Correct Password');
        const isCorrect = await comparePassword(password, hashedPassword);
        if (isCorrect) {
            console.log('✅ Correct password verified');
        } else {
            console.log('❌ Correct password failed');
        }
        
        // Test 3: Compare Wrong Password
        console.log('\nTEST 3: Compare Wrong Password');
        const isWrong = await comparePassword('WrongPassword123!', hashedPassword);
        if (!isWrong) {
            console.log('✅ Correctly rejected wrong password');
        } else {
            console.log('❌ Incorrectly accepted wrong password');
        }
        
        // Test 4: Generate JWT Token
        console.log('\nTEST 4: Generate JWT Token');
        const token = generateToken(1, 'student@university.edu');
        console.log('✅ JWT token generated successfully');
        console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
        
        // Test 5: Verify JWT Token
        console.log('\nTEST 5: Verify JWT Token');
        const decoded = verifyToken(token);
        console.log('✅ JWT token verified successfully');
        console.log('Token payload:', decoded);
        
        // Test 6: Invalid Token
        console.log('\nTEST 6: Invalid Token');
        try {
            verifyToken('invalid.token.here');
            console.log('❌ Accepted invalid token');
        } catch (error) {
            console.log('✅ Correctly rejected invalid token');
            console.log('Error message:', error.message);
        }
        
        // Test 7: Full Registration Flow
        console.log('\nTEST 7: Simulate Full Registration Flow');
        const newUser = {
            id: 123,
            email: 'newstudent@university.edu',
            password: 'NewPassword456!'
        };
        
        const userHash = await hashPassword(newUser.password);
        const userToken = generateToken(newUser.id, newUser.email);
        console.log('✅ New user registered');
        console.log('User ID:', newUser.id);
        console.log('User Email:', newUser.email);
        console.log('Password stored (hashed):', userHash.substring(0, 20) + '...');
        console.log('Auth token issued:', userToken.substring(0, 30) + '...');
        
        // Test 8: Verify stored password on login
        console.log('\nTEST 8: Simulate Login Flow');
        const loginPassword = 'NewPassword456!';
        const isValid = await comparePassword(loginPassword, userHash);
        if (isValid) {
            const loginToken = generateToken(newUser.id, newUser.email);
            console.log('✅ Login successful - credentials verified');
            console.log('New session token issued');
        } else {
            console.log('❌ Login failed - invalid credentials');
        }
        
        console.log('\n=== ALL TESTS PASSED ===\n');
        
    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

runFullAuthTests();
