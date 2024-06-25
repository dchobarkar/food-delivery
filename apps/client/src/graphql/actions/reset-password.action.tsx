import { gql, DocumentNode } from "@apollo/client";

export const RESET_PASSWORD: DocumentNode = gql`
  mutation resetPassword($password: String!, $activation_token: String!) {
    resetPassword(
      resetPasswordDto: {
        password: $password
        activation_token: $activation_token
      }
    ) {
      user {
        id
        name
        email
        role
        password
      }
    }
  }
`;
