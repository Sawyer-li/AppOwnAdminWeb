import styles from './index.less';
import { useState } from 'react';
import { Button, Steps, Tabs, Card, Descriptions, Row, Col, Result } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { getAccountNft1ByMoralis, addSelectNft, getAccount } from './service';
import { INftItem } from './index.d';


const { Step } = Steps;
const nftArr = ['bayc', 'mayc', 'clonex', 'moonbird', 'azuki'];
const NftCards = (props: { personNft: INftItem[], onClick: (item: INftItem)=> void}) => <Row gutter={[20,10]}> 
  { props.personNft.map((item,index) =>
    <Col span={4} key={index}>
      <Card
        hoverable
        cover={<img alt="example" src={item.image} />}
        onClick={() => props.onClick(item)}
      >
        <Descriptions  column={1} > 
          <Descriptions.Item label="名字">{item.name}</Descriptions.Item>
          <Descriptions.Item label="代号">{item.symbol}</Descriptions.Item>
          <Descriptions.Item label="合约地址">{item.token_address}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Col>
    )
  }
</Row>;


export const handleImageUrl = (originUrl: string): string => {
  if(originUrl.indexOf('http') !== -1){
    return originUrl;
  }else{
    return "https://ipfs.io/ipfs/"+originUrl.slice(7)
  }
} 

export default function Page() {
  const [publicKey, setPublicKey] = useState(''); 
  const [step, setStep] = useState(0); 
  const [personNft, setPersonNft] = useState<INftItem[]>([]);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const connectMeta = async () =>{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const isRegister =  await getAccount(account)
      if(!isRegister){
        setPublicKey(account);
        setStep(1);
        getAccountNft1ByMoralis('0x5BbdF8bD5f80b8B6639e4F1BFe16B8D136990fF0')
          .then((res)=>{
            res.result.forEach((item) => {
              if(item.metadata){
                item.metadata = JSON.parse(item.metadata)
                item.image = handleImageUrl(item.metadata.image);
              }
            })
            setPersonNft(res.result);
          })
      } else {
        setIsRegister(true);
        setStep(2);
      }
  }
  const tabChanged = (key: string) => {
    console.log(key)
  }

  const handleSelectNft = async (nftItem: INftItem) => {
    await addSelectNft({
      publicKey,
      nftItem,
    })
    setStep(2);
  }
  return (
    <PageContainer
      title="选择你名下得一个NFT"
    >
      <Steps current={step}>
        <Step title="授权" description="点击启动小狐狸，进行授权" />
        <Step title="选择一个nft" description="点击一个资产即可" />
        <Step title="完成" description="设置成功" />
      </Steps>
      <div className={styles.stepBody}>
        { step === 0 && <Button type='primary' onClick={connectMeta}>启动小狐狸</Button>}
        { step === 1 && <NftCards personNft={personNft} onClick={handleSelectNft} /> }
        { step === 2 && <Result
          status="success"
          title={ isRegister ? "你以注册上传过无需重复上传" : "成功设置你的NFT"}
        /> }
        { step === 3 && <div>
            你的账户为： {publicKey}
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: `Tab 1`,
                  key: '1',
                  children: `Content of Tab Pane 1`,
                },
                {
                  label: `Tab 2`,
                  key: '2',
                  children: `Content of Tab Pane 2`,
                },
                {
                  label: `Tab 3`,
                  key: '3',
                  children: `Content of Tab Pane 3`,
                },
              ]}
              onChange={tabChanged}
            />
          </div> 
        }
      </div>
       

    </PageContainer>
  );
}
