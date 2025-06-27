import { gql } from "graphql-request";

export const queryBalanceByAddressAndCurator = ({
  address,
  curator,
}: {
  address: HexAddress;
  curator: HexAddress;
}) => {
  return gql`{
    balance(
      id: "${curator.toLowerCase()}-${address.toLowerCase()}"
      ) {
      id
      shares
      totalDeposited
      totalWithdrawn
      balance
      curator
      account {
        id
      }
    }
  }`;
};
