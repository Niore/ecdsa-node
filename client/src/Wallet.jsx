import server from "./server";

import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const privKey = evt.target.value;
    const publicKey = secp.secp256k1.getPublicKey(privKey);
    const address = toHex(publicKey);
    setAddress(toHex(publicKey));
    console.log(address);
    setPrivateKey(privKey);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an private key, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Wallet Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
