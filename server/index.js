const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "034b6904f8e5638e048ad368200c3f3f0d9262bf871754b37c59754c0a4b2a159c": 100, // 68fdc06c1194b0e75e1ff1257dbb6b1a0da7ce79273cf9d1ea000976118a4fab
  "0216de09dc0db033218d805c18f261e50dbab10c1e4e6a4c758649b8fd7ec8107d": 50, // 395792e80fc0ab67642fad9283f9fba5ddb3fece08efb9949035402aabc75672
  "0222caab1f13c6c7c6eebf0b57e540ae97c8ba976d002db7701f07bb792acd7ba2": 75, // 5b7934cba533a664dec3fba5fbdb786796194bef81bb430b40a7d6c64c0017bc
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // Recover Key from signes message

  const { amount, recipient,
    signature,
    messageText,
    sender } = req.body;

  const { r, recovery, s } = signature;
  const hashMessage = keccak256(utf8ToBytes(messageText));

  // Transform back to bigInt
  const isValid = secp.secp256k1.verify({ r: BigInt(r), recovery, s: BigInt(s) }, hashMessage, sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (isValid) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.send("not supported");
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
