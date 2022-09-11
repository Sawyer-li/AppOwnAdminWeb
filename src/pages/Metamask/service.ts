
import axios from 'axios';

export const getAccountNftByEthScan = (address: string) => {
  return axios.get('https://api.etherscan.io/api', {
      params: {
          module: "account",
          action: "addresstokennftbalance",
          address,
          page: 1,
          offset: 100,
          apikey: "A5FT8AKBXR76E9IVQRAY9DGC797R3BVEC5"
      }
  }).then((res) => res.data)
}

export const getAccountNftByMoralis= (address: string) => {
  return axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft/collections`, {
      headers: {
        Accept: 'application/json', 
        'X-API-Key': 'nRh0Ps4in5X8rmSQPb9sn6txS8SW0450aIHTEnuGQDvcrHzinlQpo2Fl2s0Chcns'
      },
      params: {
        chain: "eth",
      }
  }).then((res) => res.data)
}
