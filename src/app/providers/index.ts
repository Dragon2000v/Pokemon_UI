import { compose } from "@/shared/lib/compose";
import { withRouter } from "./with-router";
import { withWeb3 } from "./with-web3";

export const withProviders = compose(withRouter, withWeb3);
