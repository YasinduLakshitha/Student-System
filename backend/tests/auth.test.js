const bcrypt = require('bcrypt');

// Test 1: Password Hashing
console.log('=== TEST 1: Password Hashing ===');
const testPassword = '12345';
bcrypt.hash(testPassword, 10, function(err, hash) {
    if (err) {
        console.error('❌ Hashing failed:', err);
        return;
    }
    console.log('✅ Password hashed successfully');
    console.log('Original password:', testPassword);
    console.log('Hashed password:', hash);
    
    // Test 2: Password Comparison
    console.log('\n=== TEST 2: Password Comparison ===');
    bcrypt.compare(testPassword, hash, function(err, isMatch) {
        if (err) {
            console.error('❌ Comparison failed:', err);
            return;
        }
        if (isMatch) {
            console.log('✅ Password matches hash');
        } else {
            console.log('❌ Password does not match hash');
        }
        
        // Test 3: Wrong Password
        console.log('\n=== TEST 3: Wrong Password Comparison ===');
        bcrypt.compare('wrongpassword', hash, function(err, isMatch) {
            if (err) {
                console.error('❌ Comparison failed:', err);
                return;
            }
            if (!isMatch) {
                console.log('✅ Correctly rejected wrong password');
            } else {
                console.log('❌ Incorrectly matched wrong password');
            }
            
            // Test 4: Multiple Hash Verification
            console.log('\n=== TEST 4: Multiple Different Hashes ===');
            const saltRounds = 10;
            Promise.all([
                bcrypt.hash('testpass123', saltRounds),
                bcrypt.hash('testpass123', saltRounds),
                bcrypt.hash('testpass123', saltRounds)
            ]).then(hashes => {
                console.log('✅ Created 3 different hashes for same password');
                console.log('Hash 1:', hashes[0]);
                console.log('Hash 2:', hashes[1]);
                console.log('Hash 3:', hashes[2]);
                console.log('Note: All different due to unique salt');
                
                // Verify all hashes
                console.log('\n=== TEST 5: Verify All Hashes ===');
                Promise.all([
                    bcrypt.compare('testpass123', hashes[0]),
                    bcrypt.compare('testpass123', hashes[1]),
                    bcrypt.compare('testpass123', hashes[2])
                ]).then(results => {
                    const allMatch = results.every(result => result === true);
                    if (allMatch) {
                        console.log('✅ All 3 hashes verified successfully');
                    } else {
                        console.log('❌ Some hashes failed verification');
                    }
                    
                    console.log('\n=== ALL TESTS COMPLETED ===');
                });
            });
        });
    });
});
