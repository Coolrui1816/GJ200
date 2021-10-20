/*
 *京东<点点券>任务
  20211009 V1.0
  支持手动、自动两种打开APP方式
  由于悬浮窗会遮挡点点券的入口和点击位置，中途可手动关闭浮窗，不影响任务
  20211009 V1.1
  增加逛30秒任务
  增加60点点券收取判断
  修复逛精彩活动任务结束后不关闭弹窗问题
  author：嘉佳
 */
Start();
console.info("开始任务");
Run("京东");Bcak();
//Run("手动");Bcak();//手动例子
console.info("结束任务");

console.log("已退出脚本"); 
engines.myEngine().forceStop()

function Start() {
  auto.waitFor();//获取无障碍服务权限
  console.show();//开启悬浮窗
  console.info("京东<点点券>任务");
}

function Run(LauchAPPName) {
  setScreenMetrics(1440, 3120);//声明是基于分辨率1440，3120的点击
  var boundsX = 0
  var boundsY = 0
  if(LauchAPPName == "手动"){
    console.log("请手动打开APP，以便进行下一步");
    while(text("领京豆").findOnce() == null){
      if(app.getAppName(currentPackage()) == "京东"|currentActivity() =="com.jingdong.app.mall.MainFrameActivity"){
        break;
      }
      console.log("当前应用名:  " + app.getAppName(currentPackage())+ "\n"
      +"当前活动:  " + currentActivity()+ "\n"
      +"未识别到京东界面，继续等待……");
      sleep(3000);
    }
    console.log("已检测到京东APP，等待下一步");
  }
  else{
    console.log("打开"+LauchAPPName+"");
    app.launchApp(LauchAPPName);
  }
  while (text("我的点点券").findOnce() == null) {
    toastLog("未找到活动界面，请手动进入，如遮挡了入口，可关闭此悬浮窗");
    sleep(3000);
  }
  console.show();
  if (text("每日攒点点券").exists()) {
    console.info("发现任务列表");
    sleep(1000);
    if(textContains("待领取").exists() |text("天天攒天天兑").exists()){
      console.info("展开任务列表");
      if(textContains("待领取").exists()){
        boundsX = textContains("待领取").findOne().bounds().centerX();
        boundsY = textContains("待领取").findOne().bounds().centerY();
      }
      if(text("天天攒天天兑").exists()){
        boundsX = text("天天攒天天兑").findOne().bounds().centerX();
        boundsY = text("天天攒天天兑").findOne().bounds().centerY();
      }
      press(boundsX,boundsY,100);//有反馈无法展开列表，尝试使用短按代替点击
      sleep(1000);
    }
    //做任务
    for(;;) {
      if (text("浏览精选活动").exists() && text("浏览精选活动").findOnce().parent().child(3).text() == ("领取任务" |"继续完成")) {
        console.info("开始浏览任务");
        textContains("浏览精选活动").findOnce().parent().child(3).click();
        className("android.view.View").textContains("浏览精选活动（").waitFor();
        if(textContains("/4）").exists()){
          var t = 4
        }
        if(textContains("/3）").exists()){
          var t = 3
        }
        for(var i = 0;i < t;i++){
          console.log("第"+(i+1)+"次浏览");
          click(1070,1100);
          sleep(2000);
          back();
          sleep(1000);
        }
        console.log("浏览完成");
        //关闭浮窗（暂用坐标点击）
        press(1307,665,100);
        console.log("关闭弹窗");
      } else if (text("逛30s").exists()){
        textContains("逛30s").findOnce().parent().child(3).click();
        console.log("浏览30秒");
        for(var i = 0;i < 30;i++){
          console.log(30-i);
          sleep(1000);
        }
        console.log("任务完成");
      } else if (text("领取任务").exists()){
        text("领取任务").findOnce().click();
        sleep(1000);
        console.log("任务完成");
      } else {
        //所有任务已完成，退出循环
        break;
      }
      sleep(1000);
      for(var i = 0;!text("每日攒点点券").exists() && i < 5;i++){
        console.log("返回");
        back();
        sleep(1000);
        if(i == 5){
          console.log("无法返回任务界面,请重新执行脚本");
          exit();
        }
      }
    }
    console.log("任务已完成");
    sleep(1000);
    //收点券
    console.info("开始收取点点券");
    console.log("日志悬浮窗会遮挡点点券收取坐标，准备隐藏");
    sleep(1000);
    console.hide();
    for(var i = 0;i < 1 && textStartsWith("+60").exists() && text("待收取").exists();i++){
      toastLog("第"+(i+1)+"次收60点点券");
      if(textStartsWith("+60").exists()){
        boundsX = textStartsWith("+60").findOne(i).bounds().centerX();
        boundsY = textStartsWith("+60").findOne(i).bounds().centerY();
        click(boundsX,boundsY)
      }
      sleep(2000);
    }
    for(var i = 0;i < 5 && textStartsWith("+20").exists() && text("待收取").exists();i++){
      toastLog("第"+(i+1)+"次收20点点券");
      if(textStartsWith("+20").exists()){
        boundsX = textStartsWith("+20").findOne(i).bounds().centerX();
        boundsY = textStartsWith("+20").findOne(i).bounds().centerY();
        click(boundsX,boundsY)
      }
      sleep(2000);
    }
    console.show();
    console.log("显示日志悬浮窗");
    console.log("点点券收取完毕");
  }
  console.log("当前账号所有任务已完成，若有剩余可再启动脚本或手动完成");
  back();
}
//确保退出活动界面及当前账号
function Bcak() {
  sleep(500);
  back();
  sleep(500);
  back();
  sleep(500);
  back();
  sleep(3000);
}