export interface INftItem {
  contract_type: string;
  /** 名字 */
  name :  string;
  /** 代号 */
  symbol: string;
  /** token地址 */
  token_address: string;
  /** token hash */
  token_hash?: string;
  /** 图片 */
  image: string;
  token_id: string;
  metadata: any;
}