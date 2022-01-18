#!/usr/bin/env python3
# -*- coding: utf-8 -*
'''
项目名称: JD-Script / jd_59-20 
Author: Curtin
功能：抢兑换59-20 并发
Date: 2022/1/17 下午10:45
TG交流 https://t.me/topstyle996
TG频道 https://t.me/TopStyle2021
'''

#是否开启通知，Ture：发送通知，False：不发送
isNotice="true"
# UA 可自定义你的，注意格式: 【 jdapp;iPhone;10.0.4;14.2;9fb54498b32e17dfc5717744b5eaecda8366223c;network/wifi;ADID/2CF597D0-10D8-4DF8-C5A2-61FD79AC8035;model/iPhone11,1;addressid/7785283669;appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1 】
UserAgent = ''

#
qd_sleep = 0.1 # 休眠0.1s



from threading import Thread

import sys
import time
try:
    import requests
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：python3 -m pip install requests")
    exit(3)
from urllib.parse import unquote

try:
    from jd_cookie import getJDCookie
    getCk = getJDCookie()
except:
    print("请先下载依赖脚本，\n下载链接：https://ghproxy.com/https://raw.githubusercontent.com/curtinlv/JD-Script/main/jd_tool_dl.py")
    sys.exit(3)



def k(cookie,user):
    try:
        url = "https://api.m.jd.com/client.action?functionId=receiveNecklaceCoupon"

        body = 'body=%7B%22shshshfpb%22%3A%22JD0111d47dlqCNIVw4zg164242789847801hw6Uy6XWmUnhz_vVqgirDBkOQREPjmaQ1REZn1NUFSUmfefMBSjQA5yRv95p_F3x1xa8la5~ynIYPK2nUXbHG100XAKS6RRFDlLi1%2BI9v3AXyZ91CPff4%5C/gk3RsZDmzQfuj1%5C/eR5xmkugmSu1o6xoEwjRha%2BlRVOsxfgwbYtq56rw0ZQ3HHOOGdur%2B5fwXlss3PaKKOWA%22%2C%22globalLng%22%3A%22bfc35e61490b1ad3d40fcff4128f42dd%22%2C%22globalLat%22%3A%22b35dab3881ab13da1e79744dd9eaa4e7%22%2C%22couponSource%22%3A%22manual%22%2C%22channel%22%3A%22%E9%A2%86%E5%88%B8%E4%B8%AD%E5%BF%83%22%2C%22monitorSource%22%3A%22ccresource_ios_index_config%22%2C%22source%22%3A%22couponCenter_app%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22pageClickKey%22%3A%22CouponCenter%22%2C%22rcType%22%3A%224%22%2C%22batchId%22%3A%22832383710%22%2C%22lat%22%3A%226f5b461378b8af05430fe2914ddc9a9b1ba5d0609fdeb3ffed6d7d91351cff1f%22%2C%22extend%22%3A%2288DB80104521161CDFFBD5A8057E28D3941D590E2F7DC02E1D31B071454EC165A213BE06482C2B115ACD30536499B3CB0A01A2E3517769E5B0D9D7A5FEB8B889BD33FABABAAE44534079014FFCB53C97B5ACFB3C73B064AF602F259517F10CD2CF9FFA4E97DC19833515F74A04925067E404D540ED11CF8A0BD830251F4556FDDB4FEA8299CAE51DBF8C31D429B66716B0FA3AF69E2E2528D8923313E598855E97BFD9F37AF2A55AF661F5BD921C0D07D9D236AB33D1924692F33C61F5A3A705E7CA9190CBCC29C60BCB818157CA502A180BEA44C59B725290F61D48A2BCF6DCAC6A696E3E9B43D484977EB4F3C5DC88C290BB851A97032A6174A65104483CB8D0D9231B560F3C8ACEE723A8AEF51E20DED5ECA43B86FB547444C4463493CAD8E6B8790F64CD1ABEA463B6C58E30B22701733ABC217A08D2BF0490734EA3EA362101E14E918806949DEE51CB01DC8DBE%22%2C%22subChannel%22%3A%22feeds%E6%B5%81%22%2C%22lng%22%3A%224b0110e965fcf50fc96636191be1dd1af017afd1cb2413ed581952a6e2648705%22%2C%22couponSourceDetail%22%3Anull%2C%22eid%22%3A%22eidI87e58120afs2ze5p4K%2BFRSa1DxGhDSeWks3ua13D4%5C/wE8GqX7WRq%2BbgN71ig61iDLHkwPrqo0%2B3aqlD7ng6HECrRABg8PmL0Mjqg8eX3d1exGsFI%22%7D&build=167874&client=apple&clientVersion=10.2.4&d_brand=apple&d_model=iPhone14%2C3&ef=1&eid=&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJS4DMeyDzc4%22%2C%22wifiBssid%22%3A%221%3D%22%2C%22osVersion%22%3A%22CJUkCG%3D%3D%22%2C%22area%22%3A%221%22%2C%22openudid%22%3A%22DtVwZtvvZJcmZwPtDtc5DJSmCtZvDzLsCzK2DJG2DtU1EWG5Dzc2ZK%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1642426405%2C%22hdid%22%3A%221%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%7D&isBackground=N&joycious=87&lang=zh_CN&networkType=wifi&networklibtype=&partner=apple&rfs=0000&scope=01&sign=cf65186121d3f0b16dfe3159d9407015&st=1642428001679&sv=122&uemps=0-0&uts='

        header = {
            "Host": "api.m.jd.com",
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept-Language": "zh-Hans-CN;q=1",
            "User-Agent": "JD4iPhone/167874%20(iPhone;%20iOS;%20Scale/3.00)",
            "Referer": "",
            "Cookie": cookie,

        }

        r = requests.post(url=url, headers=header, data=body)
        if r.status_code == 200:
            print(r.json())
        else:
            print("error")
            print(r.status_code)
            print(r.text)
    except Exception as e:
        print(f"{user} [{e}]")


if __name__ == '__main__':
    cookieList, nameList = getCk.iscookie()
    for ck, user in zip(cookieList, nameList):
        t = Thread(target=k, args=(ck, user,))
        t.start()
        time.sleep(qd_sleep)

