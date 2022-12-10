import { Chain } from "./Chain";

export type WalletId = "keplr" | "metamask" | "phantom" | string;

export type Wallet = {
  id: WalletId;
  name: string;
  icon: string;
  chains: Array<Chain>;
  // 각 지갑마다 관리하는 체인이 다르기때문에
};
