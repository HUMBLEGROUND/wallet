import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import "./ConnectWallet.css";
import { Wallet } from "../models/Wallet";
import { Chain } from "../models/Chain";
import useWallets from "../hooks/useWallets";
import { useSnackbar } from "notistack";

export type ConnectWalletType = {
  wallets: Array<Wallet>;
  onWalletConnected: (wallet: Wallet, chain: Chain) => void;
};

export const ConnectWallet = (props: ConnectWalletType) => {
  const { wallets, onWalletConnected } = props;

  const [wallet, setWallet] = useState<Wallet | null>();
  const [walletId, setWalletId] = useState("");
  const [chainArr, setChainArr] = useState(new Array<Chain>());
  const [chain, setChain] = useState<Chain | null>();
  const [chainId, setChainId] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [installed, SetInstalled] = useState<Boolean>(); // 지갑설치여부

  const { enqueueSnackbar } = useSnackbar();
  const { isInstalled, isConnected, connected, getAddress, getBalance } =
    useWallets();

  // 지갑이 변경되었을때 감지
  const handleSelecWallet = (event: any) => {
    const selectedWallet = wallets.find(
      wallet => wallet.id === event.target.value
    ); // json 파일에서 id 값이 === select된 값과 일치
    setChain(null);
    setChainId("");
    setChainArr([]);

    if (selectedWallet) {
      // 일치한다면 (true 이라면)
      setWalletId(event.target.value); // json 파일에서 id 값
      setWallet(selectedWallet);
      setChainArr(selectedWallet.chains); // json 파일에서 chains 값들 배열

      const firstChain = selectedWallet.chains[0];
      // json 파일에서 chains 값들 배열중에 0번째 값

      if (selectedWallet.chains.length === 1) {
        // // json 파일에서 chains 값들 배열의 길이가 1
        setChain(firstChain);
        setChainId(firstChain.id);
      }

      const walletInstalled = isInstalled(selectedWallet);
      // target.value (선택된값) 을 hooks로 넘겨서 true or false 인지 반환시킴
      SetInstalled(walletInstalled); // 반환된 값 담기
    }
  };

  // 체인이 변경되었을때 감지
  const handleSelectChain = (event: any) => {
    const selectedChain = chainArr.find(
      chain => chain.id === event.target.value
    );
    // json 파일에서 chain id 값이 === select된 값과 일치
    if (wallet) {
      // 지갑선택이 되어있다면 true
      setChainId(event.target.value); // json 파일에서 chain ID값
      setChain(selectedChain);

      if (isConnected(wallet) && selectedChain) {
        // 지갑연결이 되어있고 && 체인선택도 되어있다면
        onWalletConnected(wallet, selectedChain);
      }
    }
  };

  // 지갑연결하기
  const handleConnectWallet = async () => {
    try {
      if (wallet && chain) {
        // 지갑과 체인이 연결되어있다면
        await connected(wallet, chain);
        enqueueSnackbar("Operation success", { variant: "success" });
        const _address = await getAddress(wallet, chain);
        setAddress(_address);

        const _balance = await getBalance(wallet, _address);
        setBalance(_balance);
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Operation cancelled", { variant: "error" });
    }
  };

  const handleCleanSelections = () => {
    setWallet(null);
    setWalletId("");
    setChain(null);
    setChainId("");
    setChainArr([]);
    setAddress("");
    setBalance("");
    SetInstalled(false);
  };

  return (
    <div className="ConnectWallet">
      <h4> Wallet Connector </h4>
      <Box id="AddressBox">{address}</Box>
      <Box id="AddressBox">{balance}</Box>
      <FormControl className="FormControl" fullWidth>
        <InputLabel>Select Wallet</InputLabel>
        <Select
          id="WalletDropdown"
          labelId="Wallet"
          value={walletId}
          label="Select Wallet"
          onChange={handleSelecWallet}
        >
          {wallets.map((wallet, index) => (
            <MenuItem className="DropdownItem" key={index} value={wallet.id}>
              <div className={"icon " + wallet.icon} />
              <span>{wallet.name}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {wallet && installed && (
        <FormControl className="FormControl" fullWidth>
          <InputLabel>Origin Chain</InputLabel>
          <Select
            id="OriginChainDropdown"
            labelId="OriginChainDropdown"
            value={chainId}
            label="Origin Chain"
            onChange={handleSelectChain}
          >
            {chainArr.map((chain, index) => (
              <MenuItem className="DropdownItem" key={index} value={chain.id}>
                <div className={"icon " + chain.icon} />
                <span>{chain.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {wallet && !installed && (
        <Alert severity="info" onClose={() => handleCleanSelections()}>
          Install {wallet.name} to connect to select a chain
        </Alert>
      )}
      {wallet && chain && isInstalled(wallet) && (
        <div>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleConnectWallet()}
          >
            Use {wallet.name} with {chain?.name}
          </Button>
        </div>
      )}
    </div>
  );
};
