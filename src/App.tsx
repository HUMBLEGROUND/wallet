import { Card, CardContent } from "@mui/material";
import React from "react";
import "./App.css";
import { ConnectWallet } from "./components/ConnectWallet";

function App() {
  return (
    <div className="App">
      <Card className="AppBody">
        <CardContent>
          <ConnectWallet />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
