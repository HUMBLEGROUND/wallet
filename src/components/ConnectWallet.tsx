import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./ConnectWallet.css";
import wallets from "../assets/wallets.json";

export const ConnectWallet = () => {
  const walletId = "test";
  const handleSelecWallet = () => {};

  return (
    <div className="ConnectWallet">
      <FormControl className="FormControl">
        <InputLabel>Select Wallet</InputLabel>
        <Select
          id="WalletDropdown"
          labelId="Wallet"
          value={walletId}
          label="Select Wallet"
          onChange={handleSelecWallet}
        />
        {wallets.map((wallet, index) => (
          <MenuItem className="DropdownItem" key={index} value={wallet.id}>
            <div className={"icon " + wallet.icon} />
            <span>{wallet.name}</span>
          </MenuItem>
        ))}
      </FormControl>
    </div>
  );
};
