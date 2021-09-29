/*
  20210929
  调整脚本写法，增加可读性
  增加活动助力代码，以便自动进入会场完成助力
//author：嘉佳
//京东东东玩家
***/
Start();
CheckEnvironment();
console.info("开始任务");
/*
关于<邀请码>：搜索关键字"邀请码"，按规则填入即可互相助力
第一个参数：通过APP名指定打开APP
           填入“手动”则需要手动打开APP，脚本每5秒以当前页面有“领京豆”关键字作为判断启动成功的标准
           如果没有检测成功，可尝试切换页面触发检测
第二个参数：0：跳过助力邀请 1：助力邀请
第三个参数：0：不执行入会任务 1：执行入会任务，遇到新入会店铺则退出脚本
第四个参数：运行环境检测参数，不用管
*/
Run("京东",1,1,Isnormal);Bcak();
Run("手动",1,1,Isnormal);Bcak();//手动例子

//指定打开哪些京东分身，就可以达到执行一次脚本，同时完成多个小号的目的
//仅在<多开分身>中测试，其他分身APP自行测试
//如果分身是同名APP，仅是图标上有区分，那不用试了，跳转不了
/*示例
Run("京东分身",1,1,Isnormal);Bcak();
Run("京东分身2",1,1,Isnormal);Bcak();
*/

console.info("结束任务");
home();
sleep(1000);

console.log("已退出脚本");
engines.myEngine().forceStop()

function Start() {
    auto.waitFor();//获取无障碍服务权限
    console.show();//开启悬浮窗
    console.info("京东<东东玩家>任务");
    sleep(2000);
    console.log("倒计时5秒开始执行脚本");
    sleep(5000);
}

function CheckEnvironment() {
    console.info("运行环境检测");
    var launchResult = app.launchApp("多开分身")
    if (!launchResult) {
        console.error("你没有安装<多开分身>！");
        console.error("其他分身APP未经测试，不确保脚本分身功能可用");
        sleep(1000)
        return Isnormal = 0;
    }
    else{
        console.log("检测到<多开分身>，脚本可用");
        home();
        return Isnormal = 1;
    }
}

function Run(LauchAPPName,IsInvite,IsJoinMember,Isnormal) {
    //运行环境正常，则按设置的参数启动相应APP
    if(Isnormal == 1 && LauchAPPName != "手动"){
        console.log("即将启动<"+LauchAPPName+">");
        var launchResult = app.launchApp(LauchAPPName);
        if (!launchResult) {
            console.error("你还没有安装<"+LauchAPPName+">！");
            sleep(1000)
            return;
        }
    }
    else if(LauchAPPName == "手动"){
        console.log("请手动打开APP，以便进行下一步");
        while(text("领京豆").findOnce() == null){
            console.log("当前为手动模式，未检测到京东界面，继续等待……");
            sleep(5000);
        }
        console.log("已检测到京东APP，等待下一步");
    }
    //运行环境不满足，则指定启动京东
    else if(Isnormal != 1 && (LauchAPPName != "手动" | LauchAPPName != "京东")){
        console.log("分身运行环境检测异常，即将启动<京东>");
        LauchAPPName="京东";
        app.launchApp(LauchAPPName);
    }
    if(IsInvite == 1){
        console.info("开始活动助力");
        sleep(1000);
        //将京口令分段填入，只要里面的特征码即可，分不清什么是特征码的也可以整段放进来，注意用双引号和逗号隔开
        Code=new Array("#40dBz1QucsR9F4%","da#00If23CRWraP0F%","da￥85ym8Fok5IIJfo￥");//助力码
        RunTime=Code.length;
        console.info("共识别到"+RunTime+"个助力码");
        sleep(1000);
        for(var i = 0; i < RunTime; i++){
            console.log("第"+(i+1)+"个助力码");
            setClip(Code[i]);
            console.log("助力码写入剪切板");
            if(i > 0){
                if(LauchAPPName == "手动"){
                    console.log("请手动打开APP，以便进行下一步");
                    while(text("领京豆").findOnce() == null){
                        console.log("当前为手动模式，未检测到京东界面，继续等待……");
                        sleep(5000);
                    }
                    console.log("已检测到京东APP，等待下一步");
                }
                else{
                    console.log("打开"+LauchAPPName+"");
                    app.launchApp(LauchAPPName);
                    sleep(1000);
                }
            }
            if(text("立即查看").findOnce() == null){
                console.log("等待APP识别助力码");
                var j = 0;
                while(j < 15 | text("立即查看").findOnce() == null){
                    if(text("立即查看").exists()){
                        break;
                    }
                    sleep(1000);
                    console.log(j+1);
                    j++;
                    if(j == 10){
                        sleep(1000);
                        console.log("未检测到新助力码，尝试再次复制");
                        back();
                        sleep(500);
                        back();
                        sleep(500);
                        setClip(Code[i]);
                        console.log("助力码重新写入剪切板");
                        sleep(2000);
                        if(LauchAPPName == "手动"){
                            console.log("请手动打开APP，以便进行下一步");
                            while(text("领京豆").findOnce() == null){
                                console.log("当前为手动模式，未检测到京东界面，继续等待……");
                                sleep(3000);
                                if(text("立即查看").exists()){
                                    break;
                                }
                            }
                            console.log("检测到京东APP，等待再次检测");
                        }
                        else{
                            app.launchApp(LauchAPPName);
                            console.log("重启APP成功，等待再次检测");
                            sleep(2000);
                        }
                    }
                    if(j > 15){
                        console.error("超时未检测到新助力码，跳过助力任务");
                        break;
                    }
                }
                if(j > 15){
                    //超时则跳出当前助力任务
                    continue;
                }
            }
            text("立即查看").waitFor();
            sleep(1000);
            console.log("立即查看");
            text("立即查看").findOnce().click();
            sleep(1000);
            text("为TA赚好玩豆").waitFor();
            sleep(1000);
            console.log("为TA赚好玩豆");
            text("为TA赚好玩豆").findOne().click();
            console.log("助力完成");
            sleep(1000);
            //最后一次助力不返回首页，以便进行下一个任务
            if(i < RunTime-1){
                back();
                sleep(2000);
                home();
            }
        }
    }
    if(IsInvite == 0){
        console.info("跳过活动助力");
    }
    RunTask(IsJoinMember);

    function RunTask(IsJoinMember) {
        console.info("开始寻找活动任务列表");
        setScreenMetrics(1440, 3120);//基于分辨率1440*3120的点击
        //是否执行入会
        //var IsJoinMember = 1 //0：不执行入会任务 1：执行入会任务，遇到新入会店铺则退出脚本
        var t = 0
        while (textContains("全民玩家瓜分5亿").findOnce() == null) {
            console.info("未找到活动界面，请手动进入");
            sleep(3000);
        }
        if (textContains("全民玩家瓜分5亿").exists()) {
            console.info("成功进入活动界面");
            console.log("等待加载……");
            sleep(5000);//防止网络加载过慢，增加等待时间
            if (text("开心收下").exists()) {
                text("开心收下").findOnce().click();
                console.log("收下奖励");
                sleep(3000);
            }
            if (text("取消").exists()) {
                text("取消").findOnce().click();
                console.log("取消通知");
                sleep(3000);
            }
            if (text("立即抽奖").exists()) {
                text("立即抽奖").findOnce().parent().parent().child(2).click();
                console.log("跳过抽奖");
                sleep(3000);
            }
            click(712,2670);
            sleep(1000);
        }
        if (text("去完成").exists()) {
            console.info("发现任务列表");
            sleep(500);
            for(;;) {
                if (textMatches(/.*[0-9]S.*/).exists() && textMatches(/.*[0-9]S.*/).findOnce().parent().child(8).text() == "去完成") {
                    console.info("开始浏览任务");
                    textMatches(/.*[0-9]S.*/).findOnce().parent().child(8).click();
                    t = 0;
                    while(text("任务已完成，获得2000好玩豆").findOnce() == null) {
                        sleep(1000);
                        t=t+1
                        if(t==5 |t==8){
                            console.log("已等待"+t+"秒");
                        }
                        if(t==16){//默认浏览时长上限10秒，如网络不稳，可适当延长
                            if(textContains("东东超市").exists()){
                                //东东超市加载时间较久，延长等待时间，确保完成任务
                                console.log("当前为东东超市任务，延长浏览时间");
                                sleep(5000);
                            }
                            break;
                        }
                    }
                    if(textContains("任务已完成，获得2000好玩豆").exists()){
                        console.log("任务完成");
                    }
                    else{
                        console.info("已达浏览时长上限，即将返回");
                    }
                } else if (textContains("加购").exists() && textContains("加购").findOnce().parent().child(8).text() == "去完成") {
                    console.info("开始加购任务");
                    textContains("加购").findOnce().parent().child(8).click();
                    sleep(3000);
                    for(var i = 0; i < 5; i++){
                        className("android.view.View").scrollable(true).depth(15).findOne().child(i).child(0).child(4).click();
                        console.log("加购第" + (i+1) + "个商品");
                        sleep(3000);
                        back();
                        console.log("返回加购界面");
                        sleep(3000);
                    }
                    console.log("浏览加购完成，返回");
                } else if (textContains("浏览小程序会场").exists() && textContains("浏览小程序会场").findOnce().parent().child(8).text() == "去完成") {
                    console.info("开始浏览小程序任务");
                    textContains("浏览小程序会场").findOnce().parent().child(8).click();
                    console.log("当前为微信任务，延长浏览时间");
                    sleep(10000);//小程序加载时间较久，可自行调整延长等待时间，默认10秒
                    if(id("_n_26").exists()){
                        click(720,2650);
                        sleep(1000);
                        while(text("去完成").exists()) {
                            if (textMatches(/.*[0-9]S.*/).exists() && textMatches(/.*[0-9]S.*/).findOnce().parent().child(4).text() == "去完成") {
                                console.info("开始浏览任务");
                                textMatches(/.*[0-9]S.*/).findOnce().parent().child(4).click();
                                sleep(10000);
                                back();
                                console.log("小程序任务完成");
                            } else if(textContains("浏览").exists() && textContains("浏览").findOnce().parent().child(4).text() == "去完成") {
                                console.info("开始浏览任务");
                                textContains("浏览").findOnce().parent().child(4).click();
                                sleep(3000);
                                back();
                                console.log("小程序浏览任务完成");
                            } else{
                                console.log("小程序所有任务完成");
                                break;
                            }
                        }
                    }
                    console.log("浏览完成，返回");
                }else if (textContains("浏览").exists() && textContains("浏览").findOnce().parent().child(8).text() == "去完成") {
                    console.info("开始浏览任务");
                    textContains("浏览").findOnce().parent().child(8).click();
                    sleep(3000);
                    console.log("浏览完成，返回");
                } else if (textStartsWith("成功关注").exists() && textStartsWith("成功关注").findOnce().parent().child(8).text() == "去完成") {
                    console.info("开始关注任务");
                    textStartsWith("成功关注").findOnce().parent().child(8).click();
                    sleep(3000);
                    console.log("任务完成，返回");
                } else if (IsJoinMember == 1 && textContains("开通品牌会员").exists() && textContains("开通品牌会员").findOnce().parent().child(8).text() == "去完成") {
                    textContains("开通品牌会员").findOnce().parent().child(8).click();
                    sleep(3000);
                    if(textContains("确认授权并加入店铺会员").exists()){
                        console.log("涉及个人隐私,请手动加入店铺会员或者忽略加入会员任务");
                        break;
                    }
                    else{
                        console.info("已是当前店铺会员");
                        console.log("任务完成，返回");
                    }
                }
                else {
                    //所有任务已完成，退出循环
                    if(IsJoinMember != 1){
                        console.log("入会任务请手动完成");
                    }
                    break;
                }
                sleep(1000);
                back();
                sleep(3000);
                for(var i=0;!textContains("全民玩家瓜分5亿").exists() && i<5;i++){
                    toast("返回");
                    sleep(200);
                    back();
                    sleep(200);
                    if(i==5){
                        console.log("无法返回任务界面,请重新执行脚本");
                        exit();
                    }
                }
            }
        }
        else{
            console.log("如未能正确打开任务列表，请手动打开任务列表后再启动脚本");
            sleep(3000);
        }
        console.log("当前账号所有任务已完成，若有剩余可再启动脚本或手动完成");
        sleep(2000);
        back();
    }
}
//确保退出活动界面及当前账号
function Bcak() {
    sleep(500);
    back();
    sleep(500);
    back();
}
