"use client";

import { gql, DocumentNode } from "@apollo/client";

export const ACTIVATION_RESTAURANT: DocumentNode = gql`
  mutation activateRestaurant($activation_token: String!) {
    activateRestaurant(activationDto: { activation_token: $activation_token }) {
      restaurant {
        name
        country
        city
        address
        email
        password
        phone_number
      }
    }
  }
`;
