import web3 from "./web3";
import BiblionChain from "./build/BiblionChain.json";

const instance = new web3.eth.Contract(
  BiblionChain.abi,
  "0x81240c5C2d5537Df783C20D5dbb71AE43f9eca0F"
);

export default instance;
