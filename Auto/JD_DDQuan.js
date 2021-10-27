/*
  京东<点点券>任务
  已知问题
  Q：无法收取气泡奖励
  A：目前判断方式是取数字20进行判断，按控件顺序点击，但左侧每日签到奖励如果也是20，则会每次都点击到每日签到上，导致无法收取成功。
          暂时未找到其他判断方式，遇到这种情形，建议手动收取，第二天的签到奖励不是20即可恢复正常。
  20211009 V1.0
  支持手动、自动两种打开APP方式
  由于悬浮窗会遮挡点点券的入口和点击位置，中途可手动关闭浮窗，不影响任务
  20211009 V1.1
  增加逛30秒任务
  增加60点点券收取判断
  修复逛精彩活动任务结束后不关闭弹窗问题
  20211009 V1.2
  修复60点点券任务报错问题
  增加寻找活动界面函数
  尝试修复60点点券任务无法跳转问题
  增加签到50点点券收取判断
  20211011 V1.3
  增加浏览2组会场、浏览2组商品和暴力好券三个任务
  去除退出APP函数，只回到桌面
  20211011 V1.4
  增加逛15秒任务
  收取点点券上限设置为6次，避免网络卡顿导致无限循环
  20211012 V1.5
  增加收取每日签到气泡
  加长返回等待时间，避免重复执行任务
  增加普通任务领取时的日志
  20211015 V1.6
  增加浏览10秒并关注任务
  修复不识别继续完成状态的任务问题
  收取点券上限调整为10次，避免出现未完全收取的情况
  20211015 V1.7
  调整浏览10秒并关注任务的点击按钮，改为控件点击
  20211025 V1.8
  增加40点点券气泡的收取动作
  20211027 V1.9
  浏览精选任务增加到8次循环
 */
Start();
console.info("开始任务");
Run("京东");home();
//Run("手动");home();//手动例子
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
  ActiveInterface();
  console.show();
  if (text("每日攒点点券").exists()) {
    console.info("发现任务列表");
    sleep(1000);
    if(text("待领取").exists() |text("天天攒天天兑").exists()){
      console.log("展开任务列表");
      if(text("待领取").exists()){
        boundsX = text("待领取").findOne().bounds().centerX();
        boundsY = text("待领取").findOne().bounds().centerY();
      }
      else if(text("天天攒天天兑").exists()){
        boundsX = text("天天攒天天兑").findOne().bounds().centerX();
        boundsY = text("天天攒天天兑").findOne().bounds().centerY();
      }
      click(boundsX,boundsY);
      sleep(1000);
    }
    //做任务
    for(;;) {
      if ((textStartsWith("浏览2组会场").exists() && (textStartsWith("浏览2组会场").findOnce().parent().child(3).text() == "领取任务" )
          |(textStartsWith("浏览2组会场").findOnce().parent().child(3).text() == "继续完成"))) {
        console.log("开始浏览会场任务");
        textStartsWith("浏览2组会场").findOnce().parent().child(3).click();
        sleep(2000);
        if(textContains("/6）").exists()){
          var t = 6
        }else if(textContains("/5）").exists()){
          var t = 5
        }else if(textContains("/4）").exists()){
          var t = 4
        }else if(textContains("/3）").exists()){
          var t = 3
        }
        for(var i = 0;i < t;i++){
          console.log("第"+(i+1)+"次浏览");
          className("android.view.View").textStartsWith("浏览2组会场（").findOnce().parent().child(2).child(0).click();
          sleep(2000);
          back();
          sleep(2000);
        }
        console.log("浏览完成");
        //关闭浮窗
        console.log("关闭弹窗");
        className("android.view.View").textStartsWith("浏览2组会场（").findOnce().parent().child(0).click();
        sleep(1000);
      } else if ((textStartsWith("浏览2组商品").exists() && (textStartsWith("浏览2组商品").findOnce().parent().child(3).text() == "领取任务" )
          |(textStartsWith("浏览2组商品").findOnce().parent().child(3).text() == "继续完成"))) {
        console.log("开始浏览商品任务");
        textStartsWith("浏览2组商品").findOnce().parent().child(3).click();
        sleep(2000);
        if(textContains("/6）").exists()){
          var t = 6
        }else if(textContains("/5）").exists()){
          var t = 5
        }else if(textContains("/4）").exists()){
          var t = 4
        }else if(textContains("/3）").exists()){
          var t = 3
        }
        for(var i = 0;i < t;i++){
          console.log("第"+(i+1)+"次浏览");
          className("android.view.View").textStartsWith("浏览2组商品（").findOnce().parent().child(2).child(0).click();
          sleep(2000);
          back();
          sleep(2000);
        }
        console.log("浏览完成");
        //关闭浮窗
        console.log("关闭弹窗");
        className("android.view.View").textStartsWith("浏览2组商品（").findOnce().parent().child(0).click();
        sleep(1000);
      }else if ((textStartsWith("关注浏览10s").exists() && (textStartsWith("关注浏览10s").findOnce().parent().child(3).text() == "领取任务" )
          |(textStartsWith("关注浏览10s").findOnce().parent().child(3).text() == "继续完成"))) {
        console.log("开始关注浏览10s任务");
        textStartsWith("关注浏览10s").findOnce().parent().child(3).click();
        sleep(2000);
        for(var i = 0;text("浏览并关注").exists();i++){
          console.log("第"+(i+1)+"次关注浏览");
          className("android.view.View").textStartsWith("关注浏览10s（").findOnce().parent().child(2).child(0).click();
          sleep(random(2000,3000)+10000);//增加等待时间，避免任务无法完成
          back();
          sleep(2000);
        }
        console.log("关注浏览完成");
        //关闭浮窗
        console.log("关闭弹窗");
        className("android.view.View").textStartsWith("关注浏览10s（").findOnce().parent().child(0).click();
        sleep(1000);
      } else if ((text("领暴力好券").exists() && (text("领暴力好券").findOnce().parent().child(3).text() == "领取任务" )
          |(text("领暴力好券").findOnce().parent().child(3).text() == "继续完成"))) {
        console.log("开始领券任务");
        text("领暴力好券").findOnce().parent().child(3).click();
        sleep(2000);
        for(var i = 0;text("立即领取").exists();i++){
          console.log("第"+(i+1)+"次领券");
          boundsX = text("立即领取").findOnce().bounds().centerX();
          boundsY = text("立即领取").findOnce().bounds().centerY();
          click(boundsX,boundsY);
          sleep(2000);
        }
        console.log("领券完成");
        //关闭浮窗
        console.log("关闭弹窗");
        className("android.view.View").textStartsWith("领暴力好券（").findOnce().parent().child(0).click();
        sleep(1000);
      } else if ((text("浏览精选活动").exists() && (text("浏览精选活动").findOnce().parent().child(3).text() == "领取任务" )
          |(text("浏览精选活动").findOnce().parent().child(3).text() == "继续完成"))) {
        console.log("开始浏览任务");
        textContains("浏览精选活动").findOnce().parent().child(3).click();
        className("android.view.View").textContains("浏览精选活动（").waitFor();
        if(textContains("/8）").exists()){
          var t = 8
        }else if(textContains("/7）").exists()){
          var t = 7
        }else if(textContains("/6）").exists()){
          var t = 6
        }else if(textContains("/5）").exists()){
          var t = 5
        }else if(textContains("/4）").exists()){
          var t = 4
        }else if(textContains("/3）").exists()){
          var t = 3
        }
        for(var i = 0;i < t;i++){
          console.log("第"+(i+1)+"次浏览");
          className("android.view.View").textContains("浏览精选活动（").findOnce().parent().child(2).child(0).click();
          sleep(2000);
          back();
          sleep(2000);
        }
        console.log("浏览完成");
        //关闭浮窗
        console.log("关闭弹窗");
        className("android.view.View").textContains("浏览精选活动（").findOnce().parent().child(0).click();
        sleep(1000);
      } else if (text("逛领券15s").exists()){
        console.log("开始逛15s任务");
        text("逛领券15s").findOnce().parent().parent().child(3).click();
        console.log("跳转首页");
        sleep(2000);
        text("去完成任务").findOnce().click();
        className("android.widget.TextView").text("领券").waitFor();
        console.log("进入领券中心");
        className("android.widget.TextView").text("领券").findOnce().parent().click();
        console.log("浏览15秒");
        for(var i = 0;i < 15;i++){
          console.log(15-i);
          sleep(1000);
        }
        sleep(2000);
        console.log("任务完成");
        ActiveInterface();
      } else if (text("逛30s").exists()){
        console.log("开始逛30s任务");
        text("逛30s").findOnce().parent().parent().child(3).click();
        console.log("跳转首页");
        sleep(2000);
        text("去完成任务").findOnce().click();
        className("android.widget.TextView").text("领券").waitFor();
        console.log("进入领券中心");
        className("android.widget.TextView").text("领券").findOnce().parent().click();
        console.log("浏览30秒");
        for(var i = 0;i < 30;i++){
          console.log(30-i);
          sleep(1000);
        }
        sleep(2000);
        console.log("任务完成");
        ActiveInterface();
      } else if (text("领取任务").exists()){
        console.log("领取任务");
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
        sleep(2000);
        ActiveInterface();
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
    if(textContains("0每日签到").exists()){//此气泡会在领券中心签到时自动领取
      boundsX = textContains("0每日签到").findOnce().bounds().centerX();
      boundsY = textContains("0每日签到").findOnce().bounds().centerY();
      toastLog("收取每日签到点点券");
      click(boundsX,boundsY);
      sleep(2000);
    }
    if((text("逛30s").exists() |text("逛15s").exists()) && textStartsWith("+60").exists()){
      boundsX = textStartsWith("+60").findOnce().bounds().centerX();
      boundsY = textStartsWith("+60").findOnce().bounds().centerY();
      toastLog("收取60点点券");
      click(boundsX,boundsY);
      sleep(1000);
    }
    for(var i = 0;i < 10 && text("待收取").exists();i++){
      if(textStartsWith("+20").exists()){
        boundsX = textStartsWith("+20").findOnce().bounds().centerX();
        boundsY = textStartsWith("+20").findOnce().bounds().centerY();
        toastLog("第"+(i+1)+"次收20点点券");
        click(boundsX,boundsY);
      }
      if(textStartsWith("+40").exists()){
        boundsX = textStartsWith("+40").findOnce().bounds().centerX();
        boundsY = textStartsWith("+40").findOnce().bounds().centerY();
        toastLog("第"+(i+1)+"次收40点点券");
        click(boundsX,boundsY);
      }
      sleep(2000);
    }
    console.show();
    console.log("显示日志悬浮窗");
    console.log("点点券收取完毕");
  }
  console.log("当前账号所有任务已完成，若有剩余可再启动脚本或手动完成");

  function ActiveInterface() {
    //活动界面判断&点点券签到
    while (text("每日攒点点券").findOnce() == null) {
      if(className("android.widget.TextView").text("领券").exists()){
        console.log("进入领券");
        className("android.widget.TextView").text("领券").findOnce().parent().click();
        sleep(1000);
        if(text("签到领奖励").exists()){
          console.hide();
          var boundsX = text("签到领奖励").findOnce().bounds().centerX();
          var boundsY = text("签到领奖励").findOnce().bounds().centerY();
          console.log("签到领奖励");
          click(boundsX,boundsY);
          sleep(1000);
          className("android.widget.ImageView").desc("关闭弹窗").findOne().click();
        }
        console.log("进入点点券");
        desc("领券中心").findOnce().parent().child(3).click();
        console.show();
        sleep(2000);
      }
      if(desc("领券中心").exists()){
        if(text("签到领奖励").exists()){
          console.hide();
          var boundsX = text("签到领奖励").findOnce().bounds().centerX();
          var boundsY = text("签到领奖励").findOnce().bounds().centerY();
          console.log("签到领奖励");
          click(boundsX,boundsY);
          sleep(1000);
          className("android.widget.ImageView").desc("关闭弹窗").findOne().click();
        }
        console.log("进入点点券");
        desc("领券中心").findOnce().parent().child(3).click();
        console.show();
        sleep(2000);
      }
      toastLog("未找到活动界面，请手动进入，如遮挡了入口，可关闭此悬浮窗");
      sleep(3000);
    }
  }
}
