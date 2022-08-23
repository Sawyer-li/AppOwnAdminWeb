import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import { useModel } from '@umijs/max';
import styles from './index.less';
import { recOpenClick, recCloseClick } from '../../utils/rec'
import { asrOnTouchStart } from '../../utils/asr';



const { TextArea } = Input;
const HomePage: React.FC = () => {
  const { name } = useModel('global');
const [isRec, setIsRec] = useState(false);

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        { !isRec ? 
          <Button 
            type='primary' 
            onClick={() => {
              recOpenClick();
              setIsRec(true);
            }} >打开录音+识别功能</Button> : 
          <Button type="primary" onClick={()=> {
            recCloseClick();
            setIsRec(false);
          }} danger>关闭录音</Button>
        }
        <Button onClick={() => asrOnTouchStart(()=>{})}>免按住开始录音+识别</Button>
        <TextArea />
      </div>
    </PageContainer>
  );
};

export default HomePage;
