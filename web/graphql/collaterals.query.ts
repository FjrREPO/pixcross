import { gql } from "graphql-request";

export const queryCollaterals = () => {
  return gql`
    {
      collaterals {
        id
        collateralToken
      }
    }
  `;
};
