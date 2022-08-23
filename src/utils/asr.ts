import { rec } from './rec'
import { recAsrStatus } from './recAsrStatus';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav';
import 'recorder-core/src/extensions/asr.aliyun.short';

export let asr:any;
export const asrOnTouchStart=function(cancel: (msg:string)=> void){
  if(!rec){
		recAsrStatus("未打开录音", 1);
    cancel("未打开录音");
		return;
	};
  if(asr){
    cancel("上次asr未关闭");
		recAsrStatus("上次asr未关闭",1);
		return;
	};

  asr = Recorder.ASR_Aliyun_Short({
    tokenApi: 'http://127.0.0.1:9527/token',
    apiArgs:{
      lang: '普通话',
      xxx:"其他请求参数"
    },
    asrProcess:function(text: string, nextDuration: number, abortMsg: boolean){
      // /***实时识别结果，必须返回true才能继续识别，否则立即超时停止识别***/
      console.log('11111111111111111111');
      console.log(text);
      if(abortMsg){
        //语音识别中途出错
        recAsrStatus("[asrProcess回调]被终止："+abortMsg,1);
        cancel("语音识别出错");//立即结束录音，就算继续录音也不会识别
        return false;
      };
      
      // $(".recAsrTxt").text(text);
      // $(".recAsrTime").html("识别时长: "+formatTime(asr2.asrDuration())
      //   +" 已发送数据时长: "+formatTime(asr2.sendDuration()));
      return nextDuration<=2*60*1000;//允许识别2分钟的识别时长（比录音时长小5秒）
    },
    log: function(msg: string,color: string){
      console.log(msg, color);
      console.log('<span style="opacity:0.15">'+msg+'</span>',color);
    }
  });

  asr.start(function(){//无需特殊处理start和stop的关系，只要调用了stop，会阻止未完成的start，不会执行回调
		//开始录音
		console.log("开始录音..."); 
		rec.start();
		rec.s_isStart=true;
		recAsrStatus("滴~~ 已开始语音识别，请讲话（asrProcess中已限制最多识别60*2-5*(2-1)=115秒）...",2);
	},function(errMsg: string){
		recAsrStatus("语音识别开始失败，请重试："+errMsg,1);
		
		cancel("语音识别开始失败");
	});
}
