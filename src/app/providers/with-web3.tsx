import { FC } from "react";
import { Web3Provider } from "../../entities/web3";

export const withWeb3 = (Component: FC) => () => {
  return (
    <Web3Provider>
      <Component />
    </Web3Provider>
  );
};
