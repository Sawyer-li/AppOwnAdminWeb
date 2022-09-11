import styles from './index.less';
import { useState, useEffect } from 'react';
import { Button, Steps, Tabs, Card, Descriptions } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { getAccountNftByMoralis } from './service';

const { Meta } = Card;
const { Step } = Steps;
const nftArr = ['bayc', 'mayc', 'clonex', 'moonbird', 'azuki'];

export default function Page() {
  const [publicKey, setPublicKey] = useState(''); 
  const [step, setStep] = useState(1); 
  const [personNft, setPersonNft] = useState<{
    contract_type: string;
    name :  string;
    symbol: string;
    token_address: string;
  }[]>([])
  useEffect(()=>{
    getAccountNftByMoralis('0x5BbdF8bD5f80b8B6639e4F1BFe16B8D136990fF0')
      .then((res)=>{
        setPersonNft(res.total);
        setStep(2);
        console.log(res);
      })
  },[]) 
  const connectMeta = async () =>{
      console.log('start');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setPublicKey(account);
  }
  const tabChanged = (key: string) => {
    console.log(key)
  }
  return (
    <PageContainer
      title="123123"
    >
      <Steps current={step}>
        <Step title="授权" description="点击启动小狐狸，进行授权" />
        <Step title="选择一个nft" description="This is a description." />
        <Step title="完成" description="This is a description." />
      </Steps>
      <div className={styles.stepBody}>
        { step === 1 && <Button type='primary' onClick={connectMeta}>启动小狐狸</Button>}
        { step === 2 && <div>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          >
            <Descriptions.Item label="名字">fdsf</Descriptions.Item>
            <Descriptions.Item label="合约地址">fdsf</Descriptions.Item>
            <Descriptions.Item label="其他">fdsf</Descriptions.Item>
          </Card>
        </div> 
        }
        { step === 4 && <div>
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
        { step === 3 && <Button type='primary' onClick={connectMeta}>启动小狐狸</Button>}
      </div>
       

    </PageContainer>
  );
}
