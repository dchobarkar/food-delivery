"use client";

import { gql, DocumentNode } from "@apollo/client";

export const ACTIVATE_USER: DocumentNode = gql`
  mutation ActivateUser($activation_token: String!, $activation_code: String!) {
    activateUser(
      activationDto: {
        activation_token: $activation_token
        activation_code: $activation_code
      }
    ) {
      user {
        name
        email
        phone_number
        createdAt
      }
    }
  }
`;
