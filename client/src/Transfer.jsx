import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import * as utils from 'ethereum-cryptography/utils';

BigInt.prototype.toJSON = function () { return this.toString() }


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // sign message
    const messageText = `Send ${sendAmount} to ${recipient}`;
    const hashMessage = keccak256(utils.utf8ToBytes(messageText));
    const signature = await secp.secp256k1.sign(hashMessage, privateKey);
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    const sender = utils.toHex(publicKey);

    console.log(recipient, messageText, sender);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        amount: parseInt(sendAmount),
        recipient,
        signature,
        messageText,
        sender

      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
