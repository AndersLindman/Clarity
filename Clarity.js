/**
 * Clarity.js - Noisy Key Exchange Protocol
 * 
 * A transparent, easy-to-understand implementation of post-quantum key exchange
 * based on noisy modular arithmetic. This demonstrates the core principles of
 * lattice-based cryptography (Learning With Errors) through 256 independent
 * 1-bit exchanges with perfect reliability.
 * 
 * KEY FEATURES:
 * - 256-bit shared secret generation
 * - Cryptographically secure noise using Web Crypto API
 * - 100% key agreement (no retries needed)
 * - Pure JavaScript with BigInt (no external dependencies)
 * - Educational focus: clarity over optimization
 * 
 * SECURITY NOTE:
 * This is EDUCATIONAL CODE ONLY and not suitable for production use.
 * For real applications, use standardized libraries.
 * 
 * CONCEPT:
 * Alice and Bob independently generate 256 small secrets, compute noisy
 * public keys, exchange them, and derive identical 256-bit shared secrets
 * by extracting the most significant bit of each noisy shared value.
 * 
 * NAME: Clarity (providing clarity to complex post-quantum concepts)
 * INSPIRED BY: Learning With Errors (LWE) problem
 * 
 * @license CC0-1.0 (Public Domain)
 * @author Anders Lindman
 * @version 1.0.0
 * 
 * REFERENCES:
 * - Learning With Errors (LWE): https://en.wikipedia.org/wiki/Learning_with_errors
 * - NIST Post-Quantum Cryptography: https://csrc.nist.gov/projects/post-quantum-cryptography
 * 
 * NOTE: This implementation is NOT affiliated with the Clarity smart contract 
 * language used in Stacks.
 */

// ===== PARAMETERS FOR 256 INDEPENDENT BITS =====
const Q = (1n << 256n) - 189n;
const SECRET_MAX = 1n << 40n;   // 40-bit secrets for multiplication
const NOISE_MAX = 1n;
const NUM_BITS = 256;

// Helper functions
function randomBigInt(max) {
  const bits = max.toString(2).length;
  const bytes = Math.ceil(bits / 8);
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  let result = 0n;
  for (let i = 0; i < bytes; i++) {
    result = (result << 8n) + BigInt(array[i]);
  }
  return result % max;
}

// Secure noise: generates {-1, 0, 1} using CSPRNG
function addNoise(value) {
  // crypto.getRandomValues returns 0-255, we want 0-2
  const randomByte = crypto.getRandomValues(new Uint8Array(1))[0];
  const noiseCategory = randomByte % 3; // 0, 1, or 2
  const noise = BigInt(noiseCategory - 1); // -1, 0, or +1
  
  // Ensure positive result before mod
  return (value + noise + Q) % Q;
}

// ===== 256-BIT INDEPENDENT KEY EXCHANGE =====

// Public bases - one for each bit
const G_ARRAY = Array(NUM_BITS).fill(null).map(() => randomBigInt(Q));

// Alice's side - one secret per bit
const aliceSecrets = Array(NUM_BITS).fill(null).map(() => randomBigInt(SECRET_MAX));
const alicePublics = aliceSecrets.map((secret, i) => (G_ARRAY[i] * secret) % Q);
const alicePublicsNoisy = alicePublics.map(pub => addNoise(pub));

// Bob's side - one secret per bit  
const bobSecrets = Array(NUM_BITS).fill(null).map(() => randomBigInt(SECRET_MAX));
const bobPublics = bobSecrets.map((secret, i) => (G_ARRAY[i] * secret) % Q);
const bobPublicsNoisy = bobPublics.map(pub => addNoise(pub));

// Shared secret computation - 256 independent computations
const sharedAlice = bobPublicsNoisy.map((pub, i) => (pub * aliceSecrets[i]) % Q);
const sharedBob = alicePublicsNoisy.map((pub, i) => (pub * bobSecrets[i]) % Q);

// For each bit, we need to decide: is the shared value "high" or "low"?
// Since we don't have a pre-agreed bit, we use the MSB of each shared value
const keyAlice = sharedAlice.map(val => (val >> 255n) & 1n);
const keyBob = sharedBob.map(val => (val >> 255n) & 1n);

// Convert to single BigInt for display
function bitsToBigInt(bits) {
  return bits.reduce((acc, bit) => (acc << 1n) | bit, 0n);
}

const keyAliceBigInt = bitsToBigInt(keyAlice);
const keyBobBigInt = bitsToBigInt(keyBob);

console.log("=== 256 INDEPENDENT 1-BIT EXCHANGE ===");
console.log("Alice key:", keyAliceBigInt.toString(16).padStart(64, '0'));
console.log("Bob key:  ", keyBobBigInt.toString(16).padStart(64, '0'));
console.log("✅ Keys match:", keyAliceBigInt === keyBobBigInt);
