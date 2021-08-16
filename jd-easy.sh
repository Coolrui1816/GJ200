#version 1.0
#!/bin/bash

# 更新依赖
sudo apt-get update;
sudo apt-get upgrade;

# 安装工具
sudo apt-get install net-tools ssh apt-transport-https ca-certificates curl gnupg lsb-release;

# docker安装
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update;
sudo apt-get install docker-ce docker-ce-cli containerd.io;

# 添加hosts
sudo su;
echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts


# 执行jd-bash.sh
wget -q https://raw.githubusercontent.com/Coolrui1816/GJ200/mb/jd-base.sh -O jd-bash.sh && chmod +x jd-bash.sh && ./jd-bash.sh
# 搭建成功后访问： http://ip:5678  账号密码: admin/shuye72
# 可手动执行脚本进行测试
