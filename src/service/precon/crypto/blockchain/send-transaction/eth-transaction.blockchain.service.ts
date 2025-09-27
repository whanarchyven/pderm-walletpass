import web3 from "web3";
import { Transaction } from "ethereumjs-tx";
import Common from "ethereumjs-common";

export const ChainIdMap = {
  Mainnet: 1,
  Goerli: 5,
  Polygon: 137,
  Mumbai: 80001,
  Harmony: 1666600000,
  Localhost: 1337,
  Hardhat: 31337,
  Fantom: 250,
  FantomTestnet: 4002,
  Avalanche: 43114,
  AvalancheFujiTestnet: 43113,
  Optimism: 10,
  OptimismGoerli: 420,
  Arbitrum: 42161,
  ArbitrumGoerli: 421613,
  BinanceSmartChainMainnet: 56,
  BinanceSmartChainTestnet: 97,
};
export class EthTransactionService {
  async sendZeroTransaction(params: {
    httpProvider: string;
    fromAddress: string;
    privateKey: string;
    toAddress: string;
    contractAbi: any[];
    method: string;
    methodParams: any[];
    isBnb?: boolean;
  }) {
    // const common = Common.forCustomChain(
    //   "mainnet",
    //   {
    //     name: "custom",
    //     networkId: 56,
    //     chainId: 56,
    //   },
    //   "luban"
    // );
    // );

    const web3js = new web3(
      new web3.providers.HttpProvider(params.httpProvider)
    );
    const privateKey = Buffer.from(params.privateKey, "hex");
    const contractABI = params.contractAbi;
    const contractAddress = params.toAddress;

    const chainId = await web3js.eth.getChainId();
    const blocknumber = await web3js.eth.getBlockNumber();
    console.log("chainId", chainId);
    console.log("blocknumber", blocknumber);
    const count = (
      await web3js.eth.getTransactionCount(params.fromAddress)
    ).toString();

    const contract = new web3js.eth.Contract(
      contractABI as any,
      contractAddress
    );

    const method = contract.methods?.[params.method](
      // @ts-ignore
      ...params.methodParams
    );
    console.log(method?.encodeABI());
    const balance = await web3js.eth.getBalance(params.fromAddress);
    console.log("balance", balance);

    const price = await method.estimateGas({
      from: params.fromAddress,
      gasPrice: web3js.utils.toWei("4", "gwei"),
    });
    console.log("price", price);

    const gasPrice = await web3js.eth.getGasPrice();
    const gasAmount = await web3js.eth.estimateGas({
      to: params.toAddress,
      from: params.fromAddress,
      // value: web3.utils.toWei(`${amount}`, "ether"),
    });

    console.log(method?.encodeABI());
    // const signedTx = await web3js.eth.accounts.signTransaction(
    //   {
    //     from: params.fromAddress,
    //     to: params.toAddress,
    //     value: 1,
    //
    //     // gasLimit: web3js.utils.toHex(420000),
    //     chainId: 56,
    //     // gasPrice: 40000, //web3js.utils.toHex(40 * 1e9),
    //     // gasLimit: 840000,
    //     gas: price,
    //     // gasPrice: gasPrice,
    //     // maxFeePerGas: 1000000000,
    //     // gas: 72151,
    //     // gasPrice: web3js.utils.toWei("136", "gwei"),
    //     // gasLimit: 300000,
    //     nonce: count + 5,
    //     // data: method?.encodeABI(),
    //     common: {
    //       customChain: {
    //         name: "custom-chain",
    //         chainId: 56,
    //         networkId: 56,
    //       },
    //     },
    //   },
    //   // process.env.MAIN_WALLET_PRIVATE
    //   params.privateKey
    // );

    // BNB send
    // let BNBtx = await web3js.eth.sendSignedTransaction(signedTx.rawTransaction);
    // console.log(signedTx, BNBtx);

    // const rawTransaction = {
    //   from: params.fromAddress,
    //   // gasPrice: 420000,
    //   gas: web3js.utils.toHex(
    //     await method.estimateGas({ from: params.fromAddress })
    //   ),
    //   //parseInt(
    //   //(await method.estimateGas({ from: params.fromAddress })).toString()
    //   //), //web3js.utils.toHex(210000),
    //   // gasLimit: 420000,
    //   gasPrice: web3js.utils.toHex(20 * 1e9),
    //   // gasLimit: web3js.utils.toHex(210000),
    //   to: contractAddress,
    //   value: "0x0",
    //   // value: web3js.utils.toHex(1),
    //   data: method?.encodeABI(),
    //   nonce: web3js.utils.toHex(count),
    //   chain: web3js.utils.toHex(ChainIdMap.BinanceSmartChainMainnet),
    // };
    //
    // console.log("make trans", rawTransaction);
    // // console.log(rawTransaction);
    // //creating tranaction via ethereumjs-tx
    // const transaction = new Transaction(rawTransaction, { common });
    //
    // //signing transaction with private key
    // transaction.sign(privateKey);
    // //sending transacton via web3js module
    // console.log("try send");
    // await web3js.eth
    //   .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
    //   .catch((e) => {
    //     console.log(JSON.stringify(e, null, 2));
    //   });
    return true;
    // .on('transactionHash', console.log);
  }
}
