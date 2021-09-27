//本脚本需手动进入活动界面，且打开任务列表才可起效
//针对<东东玩家>活动进行调整 20210918
//修复无法参与开通会员，优化多账号切换，优化异常捕获，优化不在任务界面的逻辑处理 210925 by Ginvie
//仅供交流学习使用

start();
function start() {
    toast("请打开无障碍服务，启动 东家")
    auto.waitFor();//无障碍服务检测
    toast("无障碍服务已打开")
	//console.show();//开启悬浮窗
    //app.launch("com.jingdong.app.mall");
    while(1){
    while (text("去完成").findOnce() == null) {
		toast("请手动进入活动页面，并打开任务列表");
		sleep(6000);
	}
    if(text("去完成").exists()){
		toast("发现任务列表");
		sleep(3000);
	}
    doTask();
    toast("15秒后重新运行任务，请切换账号或关闭软件");
    sleep(5000);
    toast("10秒后重新运行任务，请切换账号或关闭软件");
    sleep(5000);
    toast("5秒后重新运行任务，请切换账号或关闭软件");
    sleep(5000);
    }
}

  function doTask() {
	  //关键字作为任务类型
	  var hasTask = true;
	  while (hasTask) {
		  try{
		if (textMatches(/.*[6-9]S.*/).exists() && textMatches(/.*[6-9]S.*/).findOnce().parent().child(8).text() == "去完成") {
			toast("开始浏览任务");
			textMatches(/.*[6-9]S.*/).findOnce().parent().child(8).click();
			sleep(16000);
			toast("任务完成");
		} else if (textContains("加购").exists() && textContains("加购").findOnce().parent().child(8).text() == "去完成") {
			toast("开始加购任务");
			textContains("加购").findOnce().parent().child(8).click();
			sleep(4000);
			for (var i = 0; i < 5; i++) {
				className("android.view.View").scrollable(true).depth(15).findOne().child(i).child(0).child(4).click();
				toast("加购第" + (i+1) + "个商品");
				sleep(6000);
				back();
				sleep(4000);
			}
			toast("浏览加购完成，返回");
		} else if (textContains("浏览").exists() && textContains("浏览").findOnce().parent().child(8).text() == "去完成") {
			toast("开始浏览任务");
			textContains("浏览").findOnce().parent().child(8).click();
			sleep(4000);
			toast("浏览完成，返回");
		} else if (textStartsWith("成功关注").exists() && textStartsWith("成功关注").findOnce().parent().child(8).text() == "去完成") {
			toast("开始关注任务");
			textStartsWith("成功关注").findOnce().parent().child(8).click();
			sleep(4000);
			toast("任务完成，返回");
		} else if (textContains("成功开通").exists() && textContains("成功开通").findOnce().parent().child(8).text() == "去完成") {
			textContains("成功开通").findOnce().parent().child(8).click();
			sleep(3000);//如果已经入会，只要点了去完成就行，缩短运行时间
			if(textContains("加入店铺会员").exists()){
				toast("若重复任务，请先手动入会");
				sleep(10000);
			//toast("脚本结束（涉及个人隐私,请手动加入店铺会员或者忽略加入会员任务)");
			//break;
			}
			toast("浏览入会界面，获取金币");
		}
		else {
			//toast("所有任务已完成，若有剩余可再启动一次脚本或手动完成"); 
			toast("任务完毕，感谢使用");
			device.vibrate(2000||1000);
			break;
		}
		sleep(2000);//给提示一个显示的时间
		back();
		sleep(4000);		
		for(var i=0;!text("去完成").exists()&&i<=12;i++){
			if (i == 12) {
                toast("无法返回任务界面,脚本结束");
                exit();
            }
			toast("请手动返回任务界面,第"+ i +"/12次等待返回");
			device.vibrate(1000||1000);
            sleep(10000);
			}
		}//避免弹窗,返回任务界面
		catch(e){
            toast("捕获一只异常鸟");
            sleep(1000);
            continue;}
	}
		
} 
