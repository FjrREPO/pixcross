import { gql } from "graphql-request";

export const queryLoanTokens = () => {
  return gql`
    {
      loanTokens {
        id
        loanToken
      }
    }
  `;
};
