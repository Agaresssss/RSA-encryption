const {
  generateKeyPairSync,
  createVerify,
  privateDecrypt,
} = require("node:crypto");

//console.log(publicKey, privateKey);
class Server {
  #publicKey;
  #privateKey;
  #signature;

  constructor() {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    this.#publicKey = publicKey;
    this.#privateKey = privateKey;
  }
  getPublicKey() {
    return this.#publicKey;
  }
  sendData(encryptedData, publicKey, signature) {
    console.log(
      "encryptedData from client :",
      encryptedData.toString("base64")
    );
    const plainText = privateDecrypt(this.#privateKey, encryptedData);
    const verify = createVerify("RSA-SHA256");
    verify.write(plainText);
    verify.end();
    console.log(
      "Signature verified: ",
      verify.verify(publicKey, signature, "hex")
    );
    console.log("Plain text from server: ", plainText.toString());
  }
}

module.exports = { Server };
