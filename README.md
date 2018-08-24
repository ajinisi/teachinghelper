“百思得”英语智能教学辅助网站开发
====

项目描述
----
一个帮助中小学老师自主组题，生成试卷，考核批改并统计学生学习情况的辅助教学平台；
在基本功能之外，基于区块链技术，解决内容生产者（辅导机构），内容消费者（老师和学生）和相关支持方的对接和利益分配；
数据是互联网上最宝贵的资产，用户虽然使用互联网是免费的，但其实出卖了个人的数据给了大公司。引入区块链保护个人隐私和其生产的优质内容不被平台窃取。

技术选型
----
* 数据库：MySQL
* 后台：GO包"net/http"，"gorilla/mux"
* 前端：不使用任何框架，采用Grid和Flex布局模式

项目结构
----
目录 | 说明 
:-: | :-:
SQL | 建库的语句
static | 样式文件，js文件，静态资源如图片、音频等
template | 按照业务逻辑归类的网页
index.html | 首页 
main.go | 主程序


开发指南
----
* 使用go命令开启web服务器
```
$ go run *.go
```
* 在浏览器中打开localhost:8080进入首页
* 与区块链的交互


License
----
GPL


演示视频
----

学生端
<iframe height=498 width=510 src="static/images/student.mp4" frameborder=0 allowfullscreen></iframe>
老师端
<iframe height=498 width=510 
src="static/images/teacher.mp4" 
frameborder=0 allowfullscreen>
</iframe>
