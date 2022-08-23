import Recorder from './asr.aliyun.short';
let rec;

/**更新状态**/
let recAsrStatus=function(html,color){
	console.Log(html,color);
};
/**打开录音，先得到录音权限**/
export function recOpenClick(){
	rec=Recorder({
		type:"wav",
		sampleRate:16000,
		bitRate:16,
		onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd){
			Runtime.Process.apply(null,arguments);
			
			//实时推入asr处理。asr.input随时都可以调用，就算asr并未start，会缓冲到asr.start完成然后将已input的数据进行识别
			if(asr){
				//buffers是从录音开头到现在的缓冲，因此需要提供 buffersOffset=newBufferIdx
				asr.input(buffers, bufferSampleRate, newBufferIdx);
			};
		}
	});
	let t=setTimeout(function(){
		recAsrStatus("无法录音：权限请求被忽略（超时假装手动点击了确认对话框）",1);
		rec=null;
		end(false);
	},8000);
	recAsrStatus("正在打开录音权限，请稍后...");
	rec.open(function(){ //打开麦克风授权获得相关资源
		clearTimeout(t);
		recAsrStatus("录音已打开，可以长按录音+识别了",2);
		console.log('结束')
	},function(msg,isUserNotAllow){//用户拒绝未授权或不支持
		clearTimeout(t);
		recAsrStatus((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg, 1);
		rec=null;
		console.log('结束')
	});
};

/******核心的长按录音识别******/
/**长按开始录音**/
let asrOnTouchStart=function(cancel){
	if(!rec){
		cancel("未打开录音");
		recAsrStatus("未打开录音",1);
		return;
	};
	rec.s_isStart=false;
	if(asr){
		cancel("上次asr未关闭");
		recAsrStatus("上次asr未关闭",1);
		return;
	};
	$(".recAsrTxt").text("");
	$(".recAsrTime").html("");
	
	//创建语音识别对象，每次识别都要新建，asr不能共用
	var asr2=asr=Recorder.ASR_Aliyun_Short({
		tokenApi:$(".asrTokenApi").val()
		,apiArgs:{
			lang:$("[name=arsLang]:checked").val()
			,xxx:"其他请求参数"
		}
		,asrProcess:function(text,nextDuration,abortMsg){
			/***实时识别结果，必须返回true才能继续识别，否则立即超时停止识别***/
			if(abortMsg){
				//语音识别中途出错
				recAsrStatus("[asrProcess回调]被终止："+abortMsg,1);
				cancel("语音识别出错");//立即结束录音，就算继续录音也不会识别
				return false;
			};
			
			$(".recAsrTxt").text(text);
			$(".recAsrTime").html("识别时长: "+formatTime(asr2.asrDuration())
				+" 已发送数据时长: "+formatTime(asr2.sendDuration()));
			return nextDuration<=2*60*1000;//允许识别2分钟的识别时长（比录音时长小5秒）
		}
		,log:function(msg,color){
			Runtime.Log('<span style="opacity:0.15">'+msg+'</span>',color);
		}
	});
	Runtime.Log("语言："+asr.set.apiArgs.lang);
	recAsrStatus("连接服务器中，请稍后...");
	//打开语音识别，建议先打开asr，成功后再开始录音
	asr.start(function(){//无需特殊处理start和stop的关系，只要调用了stop，会阻止未完成的start，不会执行回调
		//开始录音
		Runtime.Log("开始录音...");
		rec.start();
		rec.s_isStart=true;
		
		recAsrStatus("滴~~ 已开始语音识别，请讲话（asrProcess中已限制最多识别60*2-5*(2-1)=115秒）...",2);
	},function(errMsg){
		recAsrStatus("语音识别开始失败，请重试："+errMsg,1);
		
		cancel("语音识别开始失败");
	});
};

/**松开停止录音**/
let asrOnTouchEnd=function(isCancel,isUser){
	recAsrStatus(isCancel?"已取消":isUser?"已松开":"长按被取消",isUser?0:1);
	
	let asr2=asr;asr=null;//先干掉asr，防止重复stop
	if(!asr2){
		Runtime.Log("未开始识别",1);
	}else{
		//asr.stop 和 rec.stop 无需区分先后，同时执行就ok了
		asr2.stop(function(text,abortMsg){
			if(abortMsg){
				abortMsg="发现识别中途被终止(一般无需特别处理)："+abortMsg;
			};
			recAsrStatus("语音识别完成"+(abortMsg?"，"+abortMsg:""),abortMsg?"#f60":2);
			Runtime.Log("识别最终结果："+text, 2);
		},function(errMsg){
			recAsrStatus("语音识别"+(!isUser?"被取消":"结束失败")+"："+errMsg, 1);
		});
	};
	
	let rec2=rec;
	if(rec2.s_isStart){
		rec2.s_isStart=false;
		rec2.stop(function(blob,duration){
			Runtime.LogAudio(blob,duration,rec2);
		},function(errMsg){
			Runtime.Log("录音失败:"+errMsg, 1);
		});
	};
};
