import { useMetaMask } from "metamask-react";
import { Wallet } from "../models/Wallet";
import { Chain, KeplrChain } from "../models/Chain";
import Web3 from "web3";
import { Connection, PublicKey } from "@solana/web3.js";

const useWallets = () => {
  const metamask = useMetaMask();
  const _window: any = window;

  // 각 지갑 설치여부 (true or false 로 반환)
  const isInstalled = (wallet: Wallet): boolean => {
    switch (wallet.id) {
      case "keplr":
        return _window.keplr !== undefined;
      case "metamask":
        return metamask.status !== "unavailable";
      case "phantom":
        return _window.solana?.isPantom;
      default:
        throw Error(`Unknown wallet with id '${wallet.id}'`);
      // 위에 3개의 지갑이 아닌 다른지갑이면 에러
    }
  };

  // 지갑연결이 되었는지 확인여부 (true or false 로 반환)
  const isConnected = (wallet: Wallet): boolean => {
    switch (wallet.id) {
      case "keplr":
        return false;
      case "metamask":
        return metamask.status === "connected";
      case "phantom":
        return _window.solana.isConnected;
      default:
        throw Error(`Unknown wallet with id '${wallet.id}'`);
    }
  };

  // 지갑연결
  const connected = async (wallet: Wallet, chain: Chain): Promise<any> => {
    switch (wallet.id) {
      case "keplr":
        return _connectKeplrWallet(chain as KeplrChain);
      case "metamask":
        return metamask.connect();
      case "phantom":
        return _window.solana?.connect();
      default:
        throw Error(`Unknown wallet with id '${wallet.id}'`);
    }
  };

  // Keplr 지갑은 체인을 추가로 따로 설정
  const _connectKeplrWallet = async (chain: KeplrChain): Promise<any> => {
    return _window.keplr.enable(chain.keplrChainId);
  };

  // 지갑주소 가져오기
  const getAddress = async (wallet: Wallet, chain?: Chain): Promise<string> => {
    // 체인별로 주소가 다를수있기때문에 (keplr 에만 해당)
    switch (wallet.id) {
      case "keplr":
        const keplrChainId = (chain as KeplrChain).keplrChainId;
        const offlineSigner = _window.getOfflineSigner(keplrChainId);
        const accounts = await offlineSigner.getAccounts();
        return accounts[0].address;
      case "metamask":
        return metamask.account as string;
      case "phantom":
        return _window.solana?.publicKey.toString();
      default:
        throw Error(`Unknown wallet with id '${wallet.id}'`);
    }
  };

  const getBalance = async (
    wallet: Wallet,
    // chain: Chain,
    address: string
  ): Promise<string> => {
    let balance = "";
    switch (wallet.id) {
      case "metamask":
        const web3 = new Web3(_window.ethereum);
        balance = await web3.eth.getBalance(address); // 잔고조회
        balance = web3.utils.fromWei(balance, "ether"); // wei 단위 바꾸기
        return balance;
      case "phantom":
        const connection = new Connection("https://api.devnet.solana.com");
        const publicKey = new PublicKey(address);
        let sol_balance = await connection.getBalance(publicKey);
        return sol_balance.toString();
      default:
        throw Error(`Unknown wallet with id '${wallet.id}'`);
    }
  };

  return {
    isInstalled,
    isConnected,
    connected,
    getAddress,
    getBalance,
  };
};

export default useWallets;
