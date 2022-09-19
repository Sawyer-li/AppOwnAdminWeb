import axios from 'axios';
import { INftItem } from './index.d';
const MetaBackHost = 'http://47.100.7.228:3000';

export const getAccountNftByEthScan = (address: string) => {
  return axios
    .get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'addresstokennftbalance',
        address,
        page: 1,
        offset: 100,
        apikey: 'A5FT8AKBXR76E9IVQRAY9DGC797R3BVEC5',
      },
    })
    .then((res) => res.data);
};

export const getAccountNftByMoralis = (address: string) => {
  return axios
    .get(`https://deep-index.moralis.io/api/v2/${address}/nft/collections`, {
      headers: {
        Accept: 'application/json',
        'X-API-Key':
          'nRh0Ps4in5X8rmSQPb9sn6txS8SW0450aIHTEnuGQDvcrHzinlQpo2Fl2s0Chcns',
      },
      params: {
        chain: 'eth',
      },
    })
    .then((res) => res.data);
};

/** 获取账户所有nft */
export const getAccountNft1ByMoralis = (address: string) => {
  return axios
    .get(`https://deep-index.moralis.io/api/v2/${address}/nft`, {
      headers: {
        Accept: 'application/json',
        'X-API-Key':
          'nRh0Ps4in5X8rmSQPb9sn6txS8SW0450aIHTEnuGQDvcrHzinlQpo2Fl2s0Chcns',
      },
      params: {
        chain: 'eth',
        format: 'decimal',
      },
    })
    .then((res) => res.data);
};

/** 获取账户所有nft */
export const getAccountNftByUnmarshal = (address: string) => {
  return axios
    .get(
      `https://api.unmarshal.com/v3/ethereum/address/${address}/nft-assets`,
      {
        headers: {
          Accept: 'application/json',
          'X-API-Key':
            'nRh0Ps4in5X8rmSQPb9sn6txS8SW0450aIHTEnuGQDvcrHzinlQpo2Fl2s0Chcns',
        },
        params: {
          // contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
          auth_key: 'yhfIqv6P1Zavn1TOBIlwRafiMBZOrtYy1cfBbPdJ',
          pageSize: 100,
        },
      },
    )
    .then((res) => res.data);
};

export const addSelectNft = (params: {
  publicKey: string;
  nftItem: INftItem;
}) => {
  return axios.post(MetaBackHost + '/submitAccount', params);
};
export const getAccount = (publicKey: string): Promise<boolean> => {
  return axios
    .get(MetaBackHost + '/getAccount', {
      params: {
        publicKey,
      },
    })
    .then((res) => res.data);
};
