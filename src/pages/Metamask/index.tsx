import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Result,
  Row,
  Steps,
  Tabs,
} from 'antd';
import { useState } from 'react';
import { INftItem } from './index.d';
import styles from './index.less';
import { addSelectNft, getAccount, getAccountNft1ByMoralis } from './service';

const { Step } = Steps;
// const nftArr = ['bayc', 'mayc', 'clonex', 'moonbird', 'azuki'];
const filterNftTokenAddress = [
  'bayc',
  '0xae63b956f7c77fba04e2eea59f7b8b2280f55431',
  '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
  '0x23581767a106ae21c074b2276d25e5c3e136a68b',
  '0xed5af388653567af2f388e6224dc7c4b3241c544',
];
const NftCards = (props: {
  personNft: INftItem[];
  onClick: (item: INftItem) => void;
}) =>
  props.personNft.length !== 0 ? (
    <Row gutter={[20, 10]}>
      {props.personNft.map((item, index) => (
        <Col span={5} key={index}>
          <Card
            hoverable
            cover={<img alt="example" src={item.image} />}
            onClick={() => props.onClick(item)}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="名字">{item.name}</Descriptions.Item>
              <Descriptions.Item label="代号">{item.symbol}</Descriptions.Item>
              <Descriptions.Item label="合约地址">
                {item.token_address}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      ))}
    </Row>
  ) : (
    <h2 style={{ color: 'red' }}> 未未在你的账户中找到以上NFT</h2>
  );

export const handleImageUrl = (originUrl: string): string => {
  if (!originUrl) {
    return '';
  } else if (originUrl.indexOf('http') !== -1) {
    return originUrl;
  } else {
    return 'https://ipfs.io/ipfs/' + originUrl.slice(7);
  }
};

export default function Page() {
  const [publicKey, setPublicKey] = useState('');
  const [step, setStep] = useState(0);
  const [personNft, setPersonNft] = useState<INftItem[]>([]);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const connectMeta = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    let account = accounts[0];
    const isRegister = await getAccount(account);
    if (!isRegister) {
      setPublicKey(account);
      setStep(1);
      getAccountNft1ByMoralis(account).then((res) => {
        const filterRes = res.result.filter((item) =>
          filterNftTokenAddress.includes(item.token_address),
        );
        filterRes.forEach((item) => {
          if (item.metadata) {
            item.metadata = JSON.parse(item.metadata);
            item.image = handleImageUrl(item.metadata.image);
          }
        });
        console.log(filterRes);
        setPersonNft(filterRes);
      });
    } else {
      setIsRegister(true);
      setStep(2);
    }
  };
  const tabChanged = (key: string) => {
    console.log(key);
  };

  const handleSelectNft = async (nftItem: INftItem) => {
    await addSelectNft({
      publicKey,
      nftItem,
    });
    setStep(2);
  };
  return (
    <PageContainer title={`你的公钥：${publicKey}`}>
      <Steps current={step}>
        <Step title="授权" description="点击启动metamask，进行授权" />
        <Step
          title="选择一个nft"
          description="仅显示bayc、mayc、 clonex、 moonbird、 azuki"
        />
        <Step title="完成" description="设置成功" />
      </Steps>
      <div className={styles.stepBody}>
        {step === 0 && (
          <Button type="primary" onClick={connectMeta}>
            授权metamask
          </Button>
        )}
        {step === 1 && (
          <NftCards personNft={personNft} onClick={handleSelectNft} />
        )}
        {step === 2 && (
          <Result
            status="success"
            title={
              isRegister ? '你以注册上传过，无需重复上传' : '成功设置你的NFT'
            }
          />
        )}
        {step === 3 && (
          <div>
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
        )}
      </div>
    </PageContainer>
  );
}
