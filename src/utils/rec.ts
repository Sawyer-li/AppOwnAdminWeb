import Recorder from 'recorder-core';
import { recAsrStatus } from './recAsrStatus';
import 'recorder-core/src/engine/wav';
import 'recorder-core/src/extensions/asr.aliyun.short';
import { asr } from './asr';

export let rec: any;


export const recOpenClick = () => {
  /** 获取录音权限 **/
  rec = Recorder({
    type:"wav",
    sampleRate:16000,
    bitRate:16,
    onProcess: (buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd) => {
      //实时推入asr处理。asr.input随时都可以调用，就算asr并未start，会缓冲到asr.start完成然后将已input的数据进行识别
      if(asr){
        //buffers是从录音开头到现在的缓冲，因此需要提供 buffersOffset=newBufferIdx
        asr.input(buffers, bufferSampleRate, newBufferIdx);
      };
    }
  });
  rec.open(function(){//打开麦克风授权获得相关资源
    recAsrStatus("录音已打开，可以长按录音+识别了",2);
  },function(msg: string, isUserNotAllow: boolean){//用户拒绝未授权或不支持
    recAsrStatus((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg, 1);
  });
  return rec;
}

export const recCloseClick = () => {
  if(rec){
    rec.close();
    rec=null;
  }else{
    console.log('并未开始录音');
  }
}