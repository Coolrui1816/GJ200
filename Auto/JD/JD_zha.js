/*
  京东<集爆竹炸年兽>任务
  脚本执行时间过长，建议调低手机屏幕亮度，减少电量消耗和发热

  已知问题：
  Q：明明有任务，但是识别不出来就退出了
  A：目前发现分身的应用有这种问题，可重启应用和脚本重进，一般即可解决

  20220110 V1.5.1

*/
Start();
console.info("开始任务");

//浏览任务可能有直播或视频，提前静音
console.info("设备设置静音");
var v=device.getMusicVolume()
device.setMusicVolume(0)
sleep(1000);

/*
  参数说明：
  参数1：启动的APP名称，如需手动，则填手动
  参数2：对应参数1的APP名称，是否是分身应用，0：正常应用，1：分身有术Pro内部分身，暂不支持其他分身应用（如是多开分身，可在参数1中直接填入分身应用APP名称即可）
  参数3：助力邀请，0：跳过助力邀请 1：助力邀请  关于<邀请码>：搜索关键字"邀请码"，按规则填入即可互相助力
  参数4：是否入会，0：不执行入会任务 1：执行入会任务，遇到新入会店铺则退出任务 2：执行入会任务，遇到需入会店铺则返回，等待刷新别的店铺 3:执行入会任务，遇到需入会店铺，等待手动入会
 */
//京东例子
//Run("京东",0,0,2);home();
//Run("京东",1,1,0);home();
//Run("京东-2",1,1,0);home();
//手动例子
Run("手动",0,0,0);home();
//分身有术缓存清理
//CleanCache("分身有术Pro",1);
console.info("结束任务");

console.info("设备恢复原来音量");
device.setMusicVolume(v)
console.log("音量恢复为"+v);
sleep(1000);

console.log("已退出脚本");
engines.myEngine().forceStop()

function Start() {
    auto.waitFor();//获取无障碍服务权限
    console.show();//开启悬浮窗
    console.info("京东<集爆竹炸年兽>任务");
    //截图权限申请
    threads.start(function () {
        var beginBtn;
        if (beginBtn = classNameContains("Button").textContains("立即开始").findOne(2000)) {
            sleep(1000);
            beginBtn.click();
        }
    });
    sleep(1000);
    if (!requestScreenCapture(false)) {
        console.log("请求截图失败");
        exit();
    }
}

function Run(LauchAPPName,IsSeparation,IsInvite,IsJoinMember) {
    var PageStatus = 0//页面状态，用于记录当前页面状态，避免点击错位置
    if(IsSeparation == null){
        IsSeparation = 0 //0：正常应用 1：分身有术内部应用
    }if(IsJoinMember == null){
        IsJoinMember = 0 //0：不执行入会任务 1：执行入会任务，遇到新入会店铺则退出脚本 2：执行入会任务，遇到需入会店铺则返回，等待刷新别的店铺 3:执行入会任务，遇到需入会店铺，等待手动入会
    }
    var IsSeparation_info=""
    var IsInvite_info=""
    var IsJoinMember_info=""
    if(IsSeparation ==0){
        IsSeparation_info ="正常应用"
    } else if(IsSeparation == 1){
        IsSeparation_info ="分身有术Pro"
    } else{
        IsSeparation_info ="无效参数，改为默认值“非分身应用”"
        IsSeparation = 0
    }
    if(IsInvite == 0){
        IsInvite_info ="跳过助力邀请"
    } else if(IsInvite == 1){
        IsInvite_info ="助力邀请"
    } else{
        IsInvite_info ="无效参数，改为默认值“跳过助力邀请”"
        IsInvite = 0
    }
    if(IsJoinMember == 0){
        IsJoinMember_info ="不执行入会"
    } else if(IsJoinMember == 1){
        IsJoinMember_info ="有新入会店铺则退出脚本"
    } else if(IsJoinMember == 2){
        IsJoinMember_info ="有新入会店铺则返回，等待刷新别的店铺"
    } else if(IsJoinMember == 3){
        IsJoinMember_info ="有新入会店铺，等待手动入会"
    } else{
        IsJoinMember_info ="无效参数，改为默认值“不执行入会”"
        IsJoinMember = 0
    }
    console.info(
        "当前设置"+"\n"+
        "启动APP："+LauchAPPName+"\n"+
        "是否分身："+IsSeparation_info+"\n"+
        "是否助力："+IsInvite_info+"\n"+
        "是否入会："+IsJoinMember_info
    )
    sleep(2000);
    if(IsInvite == 1){
        //将京口令分段填入，只要里面的特征码即可，分不清什么是特征码的也可以整段放进来，注意用双引号和逗号隔开
        Code=new Array("￥91yW609MICRID%","#8Bk234cWiPXav@");//邀请码第一个是助力作者，第二个纯属举例，使用时建议删除
        RunTime=Code.length;
        console.info("共识别到"+RunTime+"个助力码");
        for(var i = 0; i < RunTime; i++){
            console.log("第"+(i+1)+"个助力码");
            setClip(Code[i]);
            console.log("助力码写入剪切板");
            if(LauchAPPName == "手动"){
                console.log("请手动打开APP，以便进行下一步");
                while(text("领京豆").findOnce() == null){
                    if(textMatches(/.*消耗.*爆竹/).exists()| text("立即查看").exists()|
                        app.getAppName(currentPackage()) == "京东"|currentActivity() =="com.jingdong.app.mall.MainFrameActivity"){
                        break;
                    }
                    console.log("当前应用名:  " + app.getAppName(currentPackage())+ "\n"
                        +"当前活动:  " + currentActivity()+ "\n"
                        +"未识别到京东相关界面，继续等待……");
                    sleep(3000);
                }
                console.log("已检测到京东APP，等待下一步");
            }
            else{
                if(IsSeparation == 1){
                    console.info("打开分身有术Pro，准备调用分身");
                    app.launchApp("分身有术Pro");
                    for(var t = 0;!id("tv_app_name").className("android.widget.TextView").text(LauchAPPName).exists(); t++){
                        console.log("等待识别分身……");
                        console.log("当前应用名:  " + app.getAppName(currentPackage()) + "\n"
                            +"未识别到<" + LauchAPPName + ">，继续等待……");
                        sleep(3000);
                        if(id("im_close_clear").exists()){
                            console.log("发现加速弹窗");
                            id("im_close_clear").findOne().click();
                            console.log("关闭加速弹窗");
                        }
                        if(t > 10){
                            console.log("识别超时，退出当前任务");
                            return;
                        }
                    }
                    if(id("tv_app_name").className("android.widget.TextView").text(LauchAPPName).exists()){
                        console.log("找到分身<" + LauchAPPName + ">");
                        text(LauchAPPName).findOne().parent().click();
                        console.log("分身已启动，等待活动检测……");
                    }
                }
                else{
                    console.info("打开" + LauchAPPName + "");
                    app.launchApp(LauchAPPName);
                    console.log("等待任务检测……");
                }
            }
            if(text("立即查看").findOne(2000) == null){
                console.log("等待APP识别助力码");
                var j = 0;
                while(j < 15 | text("立即查看").findOnce() == null){
                    if(text("立即查看").exists()){
                        break;
                    }
                    console.log( j + 1 );
                    j++;
                    sleep(1000);
                    if(j == 10){
                        console.log("未检测到新助力码，尝试再次复制");
                        OutAPP(1000);
                        setClip(Code[i]);
                        console.log("助力码重新写入剪切板");
                        sleep(1000);
                        if(LauchAPPName == "手动"){
                            console.log("请手动打开APP，以便进行下一步");
                            while(text("领京豆").findOnce() == null){
                                if(textMatches(/.*消耗.*爆竹/).exists()|
                                    app.getAppName(currentPackage()) == "京东"|currentActivity() =="com.jingdong.app.mall.MainFrameActivity"){
                                    break;
                                }
                                console.log("当前应用名:  " + app.getAppName(currentPackage())+ "\n"
                                    +"当前活动:  " + currentActivity()+ "\n"
                                    +"未识别到京东相关界面，继续等待……");
                                sleep(3000);
                            }
                            console.log("检测到京东APP，等待再次检测");
                        }
                        else{
                            if(IsSeparation == 1){
                                console.info("打开分身有术Pro，准备调用分身");
                                app.launchApp("分身有术Pro");
                                for(var t = 0;!id("tv_app_name").className("android.widget.TextView").text(LauchAPPName).exists(); t++){
                                    console.log("等待识别分身……");
                                    console.log("当前应用名:  " + app.getAppName(currentPackage()) + "\n"
                                        +"未识别到<" + LauchAPPName + ">，继续等待……");
                                    sleep(3000);
                                    if(id("im_close_clear").exists()){
                                        console.log("发现加速弹窗");
                                        id("im_close_clear").findOne().click();
                                        console.log("关闭加速弹窗");
                                    }
                                    if(t > 10){
                                        console.log("识别超时，退出当前任务");
                                        return;
                                    }
                                }
                                if(id("tv_app_name").className("android.widget.TextView").text(LauchAPPName).exists()){
                                    console.log("找到分身<" + LauchAPPName + ">");
                                    text(LauchAPPName).findOne().parent().click();
                                    console.log("分身已启动，等待活动检测……");
                                }
                            }
                            else{
                                console.info("打开" + LauchAPPName + "");
                                app.launchApp(LauchAPPName);
                            }
                            console.log("重启APP成功，等待再次检测");
                            sleep(1000);
                        }
                    }
                    if(j > 15){
                        console.error("超时未检测到新助力码，跳过助力任务");
                        sleep(1000);
                        if(i < RunTime-1){
                            console.log("退出当前APP，准备第" + ( i + 2 ) + "个助力码");
                            OutAPP(2000);
                        }
                        break;
                    }
                }
                if(j > 15){
                    //超时则跳出当前助力任务
                    console.info("跳过当前助力");
                    continue;
                }
            }
            setScreenMetrics(1440, 3120);//基于分辨率1440*3120的点击
            if (text("立即查看").exists()){
                console.log("立即查看");
                text("立即查看").findOnce().click();
                while(!textContains("的助力邀请").exists()){
                    sleep(2000);
                    console.log("等待加载……");
                }
                sleep(1000);
                click(720,1845);
                console.log("为TA助力");
                sleep(1000);
                console.log("助力完成");
            }
            setScreenMetrics(device.width, device.height);//恢复本机分辨率
            //最后一次助力不返回首页，以便进行下一个任务
            if(i < RunTime - 1){
                home();
                console.log("准备第" + ( i + 2 ) + "个助力码");
            }
            else{
                console.log("当前账户已助力完成");
            }
        }
    }
    if(IsInvite == 0){
        console.info("跳过活动助力");
        if(LauchAPPName == "手动"){
            console.log("请手动打开APP，以便进行下一步");
            while(text("领京豆").findOnce() == null){
                if(textMatches(/.*消耗.*爆竹/).exists()|
                    app.getAppName(currentPackage()) == "京东"|currentActivity() =="com.jingdong.app.mall.MainFrameActivity"){
                    break;
                }
                console.log("当前应用名:  " + app.getAppName(currentPackage())+ "\n"
                    +"当前活动:  " + currentActivity()+ "\n"
                    +"未识别到京东相关界面，继续等待……");
                sleep(3000);
            }
            console.log("已检测到京东APP，等待下一步");
        }
        else{
            if(IsSeparation == 1){
                console.info("打开分身有术Pro，准备调用分身");
                app.launchApp("分身有术Pro");
                for(var i = 0;!text(LauchAPPName).exists(); i++){
                    console.log("等待识别分身……");
                    sleep(3000);
                    if(i>10){
                        console.log("识别超时，退出当前任务");
                        return;
                    }
                }
                if(text(LauchAPPName).exists()){
                    text(LauchAPPName).findOne().parent().click();
                    console.log("分身已启动，等待活动检测……");
                }
            }
            else{
                console.info("打开"+LauchAPPName+"");
                app.launchApp(LauchAPPName);
                console.log("等待活动检测……");
            }
        }
        if(!text("累计任务奖励").exists()){
            if(!textMatches(/.*消耗.*爆竹/).exists()){
                //进入活动
                console.log("寻找活动入口……");
                if(LauchAPPName == "手动"){
                    for(;;){
                        if(textMatches(/.*消耗.*爆竹/).exists()){
                            break;
                        }
                        console.log("手动进入活动界面后，脚本将继续");
                        sleep(5000);
                    }
                }
                else {
                    if(!text("累计任务奖励").exists()){
                        if(!textMatches(/.*消耗.*爆竹/).exists()){
                            for(var i = 0;!textMatches(/.*消耗.*爆竹/).exists(); i++){
                                console.log("未识别到活动页面，尝试通过首页浮层进入");
                                if(text("首页").exists()){
                                    const into = descContains("浮层活动").findOne(20000);
                                    sleep(2000);
                                    if (into == null) {
                                        console.log("无法找到京东活动入口，退出当前任务");
                                        return;
                                    }
                                    click(into.bounds().centerX(), into.bounds().centerY());
                                    click(into.bounds().centerX(), into.bounds().centerY());
                                    sleep(3000);
                                }
                                if(i>10){
                                    console.log("识别超时，退出当前任务");
                                    return;
                                }
                                sleep(3000);
                            }
                            if(textMatches(/.*消耗.*爆竹/).exists()){
                                console.log("已检测到活动页面");
                                PageStatus=1//进入活动页面，未打开任务列表
                            }
                        }
                        else{
                            console.log("检测到活动页面");
                            PageStatus=1//进入活动页面，未打开任务列表
                        }
                    }
                    else{
                        console.log("检测到任务列表");
                        PageStatus=2//已打开任务列表
                    }
                }
                console.info("进入活动页面");
            }
        }
    }
    //确保退出活动界面及当前账号
    function OutAPP(SleepTime) {
        if(SleepTime == null){
            SleepTime=100
        }
        back();
        sleep(500);
        back();
        sleep(500);
        back();
        sleep(SleepTime);
    }

    sleep(2000);
    if(!text("累计任务奖励").exists()){
        if(!textMatches(/.*消耗.*爆竹/).exists()){
            for(var i = 0;!textMatches(/.*消耗.*爆竹/).exists(); i++){
                sleep(3000);
                console.log("未识别到活动页面，请手动进入");
                if(i>10){
                    console.log("识别超时，退出当前任务");
                    return;
                }
            }
            if(textMatches(/.*消耗.*爆竹/).exists()){
                console.log("已检测到活动页面");
                PageStatus=1//进入活动页面，未打开任务列表
            }
        }
        else{
            console.log("检测到活动页面");
            PageStatus=1//进入活动页面，未打开任务列表
        }
    }
    else{
        console.log("检测到任务列表");
        PageStatus=2//已打开任务列表
    }
    if(PageStatus != 2){
        sleep(2000);
        console.log("成功进入活动界面");
        console.log("等待加载弹窗……");
        while(textContains("继续环游").exists() |textContains("立即抽奖").exists() |textContains("开启今日环游").exists() |textContains("点我签到").exists() |textContains("开心收下").exists()){
            sleep(1000);
            if(textContains("继续环游").exists()){
                console.log("继续环游");
                textContains("继续环游").findOne().click();
                sleep(500);
            }else if(textContains("立即抽奖").exists()){
                console.log("关闭立即抽奖");
                textContains("立即抽奖").findOne().parent().child(1).click();
                sleep(500);
            }else if(textContains("开启今日环游").exists()){
                console.log("开启今日环游");
                textContains("开启今日环游").findOne().click();
                sleep(1000);
            }else if(textContains("点我签到").exists()){
                console.log("点我签到");
                textContains("点我签到").findOne().parent().click();
                sleep(1000);
                textContains("开心收下").waitFor();
                textContains("开心收下").findOne().parent().click();
                sleep(1000);
            }else if(textContains("开心收下").exists()){
                console.log("开心收下");
                textContains("开心收下").findOne().parent().click();
                sleep(1000);
            }else{
                console.log("暂无可处理弹窗");
                break;
            }
            sleep(1000);
        }
        console.log("如还有弹窗，请手动处理");
        sleep(3000);

        if(text("立即前往").exists()){
            console.log("前往签到");
            textContains("立即前往").findOne().parent().click();
            sleep(500);
            console.log("点我签到");
            textContains("点我签到").findOne().parent().click();
            sleep(1000);
            textContains("开心收下").waitFor();
            textContains("开心收下").findOne().parent().click();
            sleep(1000);
        }
        if(text("爆竹满了~~").exists()){
            console.log("爆竹已存满");
            text("爆竹满了~~").findOne().parent().parent().child(2).click();
            console.log("爆竹领取成功");
            sleep(2000);
        }
        else if(textContains("后满").exists()){
            textContains("后满").findOne().parent().parent().child(2).click();
            console.log("爆竹领取成功");
            sleep(2000);
        }

        if(text("放入我的＞我的优惠券").exists()){
            text("放入我的＞我的优惠券").findOne().parent().parent().child(0).click();
            sleep(1000);
        }
        console.info("准备打开任务列表");
        let taskListButton = textMatches(/.*消耗.*爆竹/).findOne(10000)
        if (!taskListButton) {
            console.log("未能识别任务列表，退出当前任务");
            return;
        }
        setScreenMetrics(1440, 3120);//基于分辨率1440*3120的点击
        click(1275,2100);
        click(1275,2100);
        sleep(2000);
        setScreenMetrics(device.width, device.height);//恢复本机分辨率

        for(var i = 0; !text("累计任务奖励").exists(); i++){
            console.log("未识别到任务列表，请手动打开")
            sleep(3000);
            if(i >= 10){
                console.log("未按时打开任务列表，退出当前任务");
                return;
            }
        }
    }
    console.log("寻找未领取奖励的任务……");
    let task1 = textMatches(/.*点击首页浮层可得.*|.*去组队可得.*/).find()
    if (task1.empty()) {
        sleep(100);
    }
    else{
        let task1Button,task1Text
        let task1img = captureScreen();
        for (let i = 0; i < task1.length; i++) {
            let task1item = task1[i]
            task1Text = task1item.text();
            task1Button = task1item.parent().child(3);
            let task1b = task1item.bounds()
            let task1color = images.pixel(task1img, task1b.left+task1b.width()/8, task1b.top+task1b.height()/2)
            console.error(colors.red(task1color)+","+colors.green(task1color)+","+colors.blue(task1color)+","+colors.alpha(task1color));
            console.error(task1color);
            if (colors.isSimilar(task1color, "#fff2da",60,"diff") |colors.isSimilar(task1color, "#caa282",60,"diff") |task1color == -3366) {
                console.log(task1Text);
                task1Button.click();
                sleep(2000);
            }
        }
    }
    console.log("寻找未完成任务……");
    while (true) {
        let taskButtons = textMatches(/.*浏览.*s.*|.*浏览.*秒.*|.*累计浏览.*|.*浏览即可得.*|.*浏览并关注可得.*|.*浏览可得.*|.*成功入会.*|.*小程序.*|.*玩AR游戏可得5000爆竹.*/).find()
        if (taskButtons.empty()) {
            console.log("未找到合适的任务，退出");
            sleep(3000);
            break;
        }
        let taskButton, taskText
        let img = captureScreen()
        for (let i = 0; i < taskButtons.length; i++) {
            let item = taskButtons[i]
            taskText = item.text();
            item = item.parent().child(3);
            let b = item.bounds()
            let color = images.pixel(img, b.left+b.width()/8, b.top+b.height()/2)
            if (colors.isSimilar(color, "#f75552",40,"diff")) {//如依然无法识别任务，可尝试继续调大第三个参数的识别范围，0~255之间，数字越大，匹配范围越大
                //跳过任务
                //if (taskText.match(/成功入会/)) continue
                //if (taskText.match(/小程序/)) continue
                //if (taskText.match(/加购/)) continue
                if (taskText.match(/成功入会/) && IsJoinMember == 0) {
                    console.log("识别到入会任务，当前设置为<不执行入会>，即将进入下一任务");
                    sleep(1000);
                    continue;
                }
                taskButton = item;
                break;
            }
        }
        img.recycle();//调用recycle回收
        if (!taskButton) {
            console.log("未找到可自动完成的任务，退出当前任务");
            console.log("互动任务需要手动完成");
            sleep(2000);
            break;
        }

        function timeTask() {
            taskButton.click();
            sleep(1000);
            console.log("等待浏览任务完成……");
            let c = 0
            while (c < 15) { // 15秒，防止死循环
                let finish_reg = /获得.*?爆竹|浏览完成|任务已达上限/
                if ((textMatches(finish_reg).exists() || descMatches(finish_reg).exists())){ // 等待已完成出现，有可能失败
                    break;
                }
                sleep(1000);
                c++;
                if (c == 3 |c == 6 |c == 12){
                    console.log("已等待"+c+"秒");
                    //财富岛任务无法直接返回，只能跳转返回
                    if(app.getAppName(currentPackage()) == "京喜"){
                        if(LauchAPPName == "手动"){
                            console.log("请手动返回任务界面，以便进行下一步");
                            while(text("累计任务奖励").findOnce() == null){
                                if(textMatches(/.*消耗.*爆竹/).exists()|
                                    app.getAppName(currentPackage()) == "京东"|currentActivity() =="com.jingdong.app.mall.MainFrameActivity"){
                                    break;
                                }
                                console.log("当前应用名:  " + app.getAppName(currentPackage())+ "\n"
                                    +"当前活动:  " + currentActivity()+ "\n"
                                    +"未识别到京东相关界面，继续等待……");
                                sleep(3000);
                            }
                            console.log("已检测到京东APP，等待下一步");
                        }
                        else{
                            if(IsSeparation == 1){
                                console.info("打开分身有术Pro，准备调用分身");
                                app.launchApp("分身有术Pro");
                                for(var i = 0;!text(LauchAPPName).exists(); i++){
                                    console.log("等待识别分身……");
                                    sleep(3000);
                                    if(i>10){
                                        console.log("识别超时，退出当前任务");
                                        return;
                                    }
                                }
                                if(text(LauchAPPName).exists()){
                                    text(LauchAPPName).findOne().parent().click();
                                    console.log("分身已启动，等待活动检测……");
                                }
                            }
                            else{
                                console.info("打开"+LauchAPPName+"");
                                app.launchApp(LauchAPPName);
                                console.log("等待活动检测……");
                            }
                        }
                    }
                }
            }
            if (c >= 15) {
                console.log("超时，即将返回");
            }
            else{
                console.log("浏览时长任务完成");
            }
        }

        function itemTask(cart) {
            taskButton.click();
            sleep(1000);
            console.log("等待进入商品列表……");
            textEndsWith("4个商品领爆竹").waitFor();//当前页浏览加购4个商品领爆竹|当前页点击浏览4个商品领爆竹
            let items = textEndsWith("4个商品领爆竹").findOne();
            for (let i = 0; i < 4; i++) {
                if (cart) {
                    console.log("加购并浏览");
                    items.parent().parent().child(2).child(i).child(4).click();
                } else {
                    console.log("浏览商品页");
                    items.parent().parent().child(2).child(i).child(4).click();
                }
                sleep(1000);
                console.log("返回");
                back();
                sleep(1000);
                while(!textEndsWith("4个商品领爆竹").exists()){
                    console.log("再次返回");
                    back();
                    sleep(2000);
                }
                if (i >= 3) {
                    break;
                }
            }
            console.log("浏览商品任务完成");
        }

        if (taskText.match(/浏览.*s|浏览.*秒/)) {
            console.log("进行", taskText);
            timeTask();
        } else if (taskText.match(/累计浏览/)) {
            console.log("进行", taskText);
            if (taskText.match(/加购/)){
                itemTask(true);
            }
            else {
                itemTask(false);
            }
        } else if (taskText.match(/小程序/)) {
            console.log("进行", taskText);
            taskButton.click();
            sleep(3000);
            while(id("ffp").exists() |text("取消").exists()){
                if(id("ffp").exists()){
                    id("ffp").findOne().click();
                    console.log("跳转微信异常，准备返回");
                    sleep(1000);
                }else if(text("取消").exists()){
                    text("取消").findOne().click();
                    console.log("取消");
                    sleep(1000);
                }
                sleep(1000);
            }
            console.log("任务完成");
        } else if (taskText.match(/成功入会/)) {
            console.log("进行", taskText);
            taskButton.click();
            sleep(3000);
            if(textContains("确认授权并加入店铺会员").exists()){
                if(IsJoinMember == 2){
                    console.log("当前店铺未入会，跳过");
                }
                else if(IsJoinMember == 1){
                    console.log("涉及个人隐私，请手动加入店铺会员或者忽略加入会员任务");
                    return;
                }
                else if(IsJoinMember == 3){
                    console.log("当前店铺未入会，等待手动");
                    sleep(8000);
                }
            }
            else{
                console.info("已是当前店铺会员");
                console.log("任务完成");
            }
        } else if (taskText.match(/玩AR游戏可得5000爆竹/)) {
            console.log("进行", taskText);
            taskButton.click();
            sleep(2000);
        } else if (taskText.match(/浏览并关注可得|浏览可得|浏览即可得/)) {
            console.log("进行", taskText);
            let taskItemText = taskButton.parent().child(1).text()
            if(taskItemText.match(/种草城/)){
                taskButton.click();
                sleep(5000);
                if(text("互动种草城").exists()){
                    if(textContains("/3)").exists()){
                        for(var i = 0; i < 3; i++){
                            console.log("第"+(i+1)+"次浏览店铺");
                            textContains("/3)").findOnce().parent().parent().child(2).click();
                            sleep(1000);
                            console.log("返回");
                            back();
                            sleep(2000);
                            while(!text("互动种草城").exists()){
                                console.log("再次返回");
                                back();
                                sleep(2000);
                            }
                        }
                    }
                }
            }
            else{
                taskButton.click();
                sleep(2000);
            }
            console.log("普通浏览任务完成");
        }

        for(var i = 0; text("累计任务奖励").findOnce() == null; i++){
            console.log("返回");
            back();
            sleep(1000);
            if(i==5){
                console.log("无法返回任务界面，退出当前任务");
                return;
            }
        }
        console.info("准备下一个任务");
    }
    if(text("当前进度10/10").exists()){
        console.log("领取累计任务奖励");
        for(var i = 1; text("当前进度10/10").exists() && i < 4; i++){
            console.log("第" + i + "个宝箱");
            text("当前进度10/10").findOne().parent().child(2).child(i).click();
            sleep(500);
            if(text("放入我的＞我的优惠券").exists()){
                console.log("发现优惠券")
                text("放入我的＞我的优惠券").findOne().parent().parent().child(0).click();
                sleep(100);
            }
            if(textContains("开心收下").exists()){
                console.log("开心收下")
                textContains("开心收下").findOne().parent().click();
                sleep(100);
            }
            sleep(500);
        }
        console.log("累计任务奖励领取完毕");
        sleep(2000);
    }
}

function CleanCache(LauchAPPName,Isclean) {
    if(LauchAPPName == "分身有术Pro" && Isclean == 1){
        console.info("打开分身有术Pro，准备清理缓存");
        app.launchApp("分身有术Pro");
        console.log("等待清理");
        for(var i = 0; !id("iv_home_clean").exists() && i < 15; i++){
            sleep(1000);
            if(i == 5 | i == 10 ){
                console.log("已等待" + i + "秒");
            }
            if(id("iv_home_clean").exists()){
                id("iv_home_clean").findOne().click();
                console.log("加速完毕");
                sleep(3000);
                break;
            }
        }
        if(i >= 15){
            console.error("识别超时，未能完成加速");
        }
        if(id("im_close_clear").exists()){
            sleep(2000);
            id("im_close_clear").findOne().click();
            console.log("关闭加速弹窗");
        }
    }
    else{
        console.error("参数不符，退出清理任务");
    }
}