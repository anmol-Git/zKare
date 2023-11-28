"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { PropsWithChildren } from 'react';
const client = new ApolloClient({
    uri: 'https://optimism-goerli.easscan.org/graphql',
    cache: new InMemoryCache(),
});

export default function Apollo({children}: PropsWithChildren) {
    return <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
}