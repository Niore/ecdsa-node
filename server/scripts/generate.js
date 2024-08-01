const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const key = secp.secp256k1.utils.randomPrivateKey();
console.log("private " + toHex(key));

const publicKey = secp.secp256k1.getPublicKey(key);
console.log("public " + toHex(publicKey));