import React, { useEffect } from 'react'
import './App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import uniswapLogo from '../uniswap-logo.png'
import UniLogo from '../uniswap-logo.png'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const Uni_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      derivedETH
      totalLiquidity
    }
  }
`

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`

function App() {
  const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY)
  const { loading: UniLoading, data: UniData } = useQuery(Uni_QUERY, {
    variables: {
      tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    }
  })

  const UniPriceInEth = UniData && UniData.tokens[0].derivedETH
  const UniTotalLiquidity = UniData && UniData.tokens[0].totalLiquidity
  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://uniswap.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={uniswapLogo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Uniswap Explorer
        </a>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <div>
                <img src={UniLogo} width="150" height="150" className="mb-4" alt="" />
                <h2>
                  Uni price:{' '}
                  {ethLoading || UniLoading
                    ? 'Loading token data...'
                    : '$' +
                      // parse responses as floats and fix to 2 decimals
                      (parseFloat(UniPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
                </h2>
                <h2>
                  Uni total liquidity:{' '}
                  {UniLoading
                    ? 'Loading token data...'
                    : // display the total amount of Uni spread across all pools
                      parseFloat(UniTotalLiquidity).toFixed(0)}
                </h2>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App
