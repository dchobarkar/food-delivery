"use client";

import { gql, DocumentNode } from "@apollo/client";

export const GET_RESTAURANT: DocumentNode = gql`
  query {
    getLoggedInRestaurant {
      restaurant {
        name
        country
        city
        address
        email
        password
        phone_number
      }
      access_token
      refresh_token
    }
  }
`;
