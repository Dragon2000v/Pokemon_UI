import compose from "compose-function";
import { withRouter } from "./with-router";
import { withWeb3 } from "./with-web3";

export const withProviders = compose(withWeb3, withRouter);
