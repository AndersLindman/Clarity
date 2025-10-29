
# Clarity: Noisy Key Exchange

**Clarity** is a transparent, educational implementation of a key exchange that demonstrates the core principles of **lattice-based cryptography** through simple, noisy modular arithmetic.

Unlike optimized production protocols that hide complexity behind algebraic structures, Clarity strips away the optimizations to reveal the **fundamental concept**: secure key exchange through controlled noise and reconciliation.

### ⚠️ Security Note: Vulnerability to Brute Force

The default parameters use a secret size of **40 bits** for demonstration speed and to ensure $100\%$ key agreement.

**This implementation is NOT secure for production use.** The small $\approx 2^{40}$ secrets are vulnerable to a **bit-by-bit brute-force attack (Guess and Check)**, which can be completed in seconds on a modern computer.

For educational security analysis:
* To slow down the brute-force attack significantly, increase the `SECRET_MAX` in the code to require $\mathbf{80}$ or more bits of entropy.
* For actual post-quantum security against a quantum computer, secrets and noise would need to be coupled across all 256 dimensions and sampled from a distribution whose security is based on a problem with a complexity of $\mathbf{2^{256}}$ or higher (like Kyber's Module-LWE).?

> 💡 **Philosophy**: *"Make the complex comprehensible"*

## 🔑 Key Features

- ✅ **256-bit shared secret generation** with 100% reliability
- ✅ **Perfect key agreement** – no retries ever needed
- ✅ **Cryptographically secure noise** using Web Crypto API
- ✅ **Pure JavaScript reference implementation** – no external dependencies
- ✅ **Educational focus** – each of the 256 bits is independent and traceable
- ✅ **CC0 Public Domain** – free to use, modify, and learn from

## 📚 How It Works

Clarity implements **256 independent 1-bit key exchanges**:

1. **Key Generation**: Alice and Bob each generate 256 small (40-bit) private secrets
2. **Public Keys**: They compute public keys using modular multiplication: `G * secret mod Q`
3. **Add Noise**: Each public key gets independent noise from {-1, 0, +1}
4. **Exchange**: Public keys are exchanged over an insecure channel
5. **Shared Secret**: Both parties compute 256 noisy shared values
6. **Reconciliation**: Extract the Most Significant Bit (MSB) from each shared value
7. **Result**: Identical 256-bit keys with **zero probability of mismatch**

### Core Mathematical Concept
```
shared = (G * alice_secret * bob_secret) + (noise * other_secret)
```
Since `|noise * other_secret| < 2^40` and we work modulo `2^256`, 
the MSB is **never affected by noise**, guaranteeing perfect agreement.

## ⚠️ Important Notes

### This is EDUCATIONAL CODE ONLY
- **Not for production use**
- **No authentication** (vulnerable to man-in-the-middle attacks)
- **Large key sizes** (~64 KB) compared to optimized protocols
- Use **standardized libraries** like [Open Quantum Safe](https://openquantumsafe.org/) for real applications

### Name Disambiguation
This project is called **Clarity** since it provides clarity in understanding and implementing post-quantum cryptography. It is **NOT affiliated** with the Clarity smart contract language used in the Stacks.

## 🔬 Comparison with Real Protocols

| Feature | Clarity | Kyber (NIST Standard) |
|---------|---------|----------------------|
| **Purpose** | Education & demonstration | Production deployment |
| **Key Size** | ~64 KB | **1.2 KB** |
| **Reliability** | ✅ 100% (no retries) | ⚠️ Rare retries needed |
| **Complexity** | Simple, transparent | Highly optimized |
| **Learning Value** | **Excellent** | Complex to understand |

## 🧪 Experiment Ideas

- **Modify noise levels**: See when correctness breaks
- **Change secret sizes**: Trade security vs. reliability
- **Implement single-value version**: Extract safe bits from one computation
- **Add authentication**: Prevent man-in-the-middle attacks
- **Create visualizations**: Show noise distribution and bit extraction

## 📄 License

This project is dedicated to the **public domain** under the [CC0 1.0 Universal license](LICENSE).

```
CC0 1.0 Universal

To the extent possible under law, the author(s) have dedicated all 
copyright and related and neighboring rights to this software to the 
public domain worldwide.
```

## 🙏 Acknowledgments

- Inspired by the **Learning With Errors (LWE)** problem
- Built on **BigInt** and **Web Crypto API** standards
- Educational approach influenced by **cryptographic pedagogy** best practices

## 📚 Learn More

- [Learning With Errors (Wikipedia)](https://en.wikipedia.org/wiki/Learning_with_errors)
- [NIST Post-Quantum Cryptography Standardization](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [Open Quantum Safe Project](https://openquantumsafe.org/)
- [Lattice Cryptography for the Internet (PDF)](https://cryptojedi.org/papers/lattice-survey-20151226.pdf)

---

**Clarity** makes post-quantum cryptography accessible to everyone.  
*Understand the future of secure communication, one bit at a time.* 🔐✨
```
