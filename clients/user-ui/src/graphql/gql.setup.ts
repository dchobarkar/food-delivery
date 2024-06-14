import { ApolloClient, InMemoryCache } from "@apollo/client";

export const graphqlClient = new ApolloClient({
  uri: process.env.SERVER_URL,
  cache: new InMemoryCache(),
});
