“百思得”英语智能教学辅助网站开发
====

项目描述
----
一个帮助中小学老师自主组题，生成试卷，考核批改并统计学生学习情况的辅助教学平台。

技术选型
----
数据库：MySQL
后台：GO包"net/http"
前端：不使用任何框架，采用grid和Flex布局模式

项目结构
----
目录 | 说明 
:-: | :-:
static | 样式文件和js文件
view | 其他网页
index.html | 首页 
main.go | 主程序


开发指南
----
* 使用go命令开启web服务器
```
$ go run *.go
```
* 在浏览器中打开localhost:8080/index进入首页

License
----
GPL
