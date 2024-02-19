const crypto = require("node:crypto");
const { Server } = require("./mockserver");

let server = new Server();

let { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    // cipher: "aes-256-cbc",
    // passphrase: "top secret",
  },
});

let sign = crypto.createSign("RSA-SHA256");

// console.log(user);
let data = "This is something that I want to keep secret";
//-----encrypt before sending to server
let encryptedData = crypto.publicEncrypt(server.getPublicKey(), data);

// sign the data before sending to the server
sign.update(data).end();
let signature = sign.sign(privateKey, "hex");

// assume that the encrypted data is sent to the server
server.sendData(encryptedData, publicKey, signature);
// signature is sent to the server
