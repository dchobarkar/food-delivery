"use client";

import { ApolloProvider } from "@apollo/client";

import { graphqlClient } from "../../graphql/gql.setup";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
}
