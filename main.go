package main

import (
	"crypto/md5"
	"database/sql"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"time"
	// 驱动的引用与连接
	_ "teachinghelper/memory"
	"teachinghelper/session"

	_ "github.com/go-sql-driver/mysql"
)

// 在main包中创建一个全局的session管理器
var globalSessions *session.Manager

//然后在init函数中初始化
func init() {
	globalSessions, _ = session.NewManager("memory", "gosessionid", 3600)

	// 管理销毁
	go globalSessions.GC()
	fmt.Println("fd")
}

func main() {
	//mux := http.NewServeMux()
	http.HandleFunc("/login", login)
	http.HandleFunc("/register", register)
	//mux.HandleFunc("/insert", insert)
	http.HandleFunc("/query", query)
	http.HandleFunc("/queryresults", queryresults)
	http.HandleFunc("/queryanswer", queryanswer)
	//mux.HandleFunc("/querygrade", querygrade)
	//mux.HandleFunc("/commitanwer", commitanwer)
	http.HandleFunc("/queryquesbank", queryquesbank)
	http.HandleFunc("/querypaper", querypaper)
	http.HandleFunc("/querypapers", querypapers)
	http.HandleFunc("/querytasks", querytasks)
	http.HandleFunc("/querytask", querytask)
	http.HandleFunc("/insertpaper", insertpaper)
	http.HandleFunc("/upload", upload)
	http.HandleFunc("/insertque", insertque)

	//mux.HandleFunc("/index", index)

	// 重定向第一种写法
	http.Handle("/123", http.RedirectHandler("view/login.html", http.StatusFound))
	// 重定向第二种写法
	//http.HandleFunc("/123", Redir)

	// 文件服务器
	http.Handle("/", http.FileServer(http.Dir("C:/Users/ajini/Desktop/goproject/src/teachinghelper")))

	// 未找到
	http.Handle("/234", http.NotFoundHandler())

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

// func Index(w http.ResponseWriter, r *http.Request) {
// 	t, err := template.ParseFiles("index.html")
// 	if err != nil {
// 		log.Println(err)
// 	}
// 	t.Execute(w, nil)
// }

// // 重定向第二种写法
// func Redir(w http.ResponseWriter, r *http.Request) {
// 	if r.URL.Path == "/123" {
// 		http.Redirect(w, r, "view/login.html", http.StatusFound)
// 	}
// }

// login 登陆
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // 允许跨域

	sess := globalSessions.SessionStart(w, r)

	r.ParseForm()                    // 解析参数，默认是不会解析的
	fmt.Println("method:", r.Method) // 获取请求的方法

	if r.Method == "GET" {
		// 显示登陆界面
		t, _ := template.ParseFiles("view/login.html")
		// ??
		w.Header().Set("Content-Type", "text/html")
		t.Execute(w, sess.Get("username"))
	} else {
		// 请求的是登陆数据，那么执行登陆的逻辑判断

		// 在控制台上输出信息
		fmt.Println("Form: ", r.Form)
		fmt.Println("Path: ", r.URL.Path)
		username, found1 := r.Form["username"]
		fmt.Println(username)
		fmt.Println(found1)
		password, found2 := r.Form["password"]
		if !(found1 && found2) {
			io.WriteString(w, "请勿非法访问")
			return
		}

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
		if err != nil {
			fmt.Println(err)
		}

		defer db.Close()

		// 对密码进行加密
		var post_data PostData
		post_data.user_name = username[0]
		post_data.pass_word = password[0]

		var filter_data FilterData = post_data
		post_data = filter_data.formatData()

		var row *sql.Row
		row = db.QueryRow("select USER_ID,PASSWORD from login.user where USER_ID = ? and password = ?", post_data.user_name, post_data.pass_word)
		var userName, passWord string
		err = row.Scan(&userName, &passWord) // 遍历结果

		if err != nil {
			w.WriteHeader(406)
			fmt.Println(err)
		} else {

			sess.Set("username", username[0])

			w.WriteHeader(200)
			t, err := template.ParseFiles("index.html")
			if err != nil {
				log.Println(err)
			}
			t.Execute(w, nil)
		}
	}
}

// 注册
func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	r.ParseForm()
	username, found1 := r.Form["username"]
	password, found2 := r.Form["password"]
	if !(found1 && found2) {
		io.WriteString(w, "请勿非法访问")
		return
	}
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		io.WriteString(w, "连接数据库失败")
		return
	}
	defer db.Close() //在返回前关闭资源（延迟）

	var post_data PostData
	post_data.user_name = username[0]
	post_data.pass_word = password[0]

	var filter_data FilterData = post_data
	post_data = filter_data.formatData()

	_, err = db.Exec("insert into login.user (USER_ID, password) values(?,?)", post_data.user_name, post_data.pass_word) //插入数据
	if err != nil {
		w.WriteHeader(406)
		fmt.Println(err)
		//arr := StatueText(406)
		//io.WriteString(w, "注册失败") // 返回结果
	} else {
		w.WriteHeader(200)
		fmt.Printf("1")
		//arr := http.StatueText(200)
		//io.WriteString(w, arr) // 返回结果
		t, err := template.ParseFiles("template/user/login.html")
		if err != nil {
			log.Println(err)
		}
		t.Execute(w, nil)
	}
}

// Cookie

// expiration := time.Now()
// expiration = expiration.AddDate(1, 0, 0)
// cookie := http.Cookie{Name: "username", Value: "astaxie", Expires: expiration}
// http.SetCookie(w, &cookie)

// cookie, _ := r.Cookie("username")
// fmt.Fprint(w, cookie)

// http.SetCookie(w ResponseWriter, cookie *Cookie){

// }

// 当我们进行了任意一个session操作，都会对Session实体进行更新，都会触发对最后访问时间的修改，
// 这样当GC的时候就不会误删除还在使用的Session实体
func count(w http.ResponseWriter, r *http.Request) {
	sess := globalSessions.SessionStart(w, r)
	createtime := sess.Get("createtime")
	if createtime == nil {
		sess.Set("createtime", time.Now().Unix())
	} else if (createtime.(int64) + 360) < (time.Now().Unix()) {
		globalSessions.SessionDestroy(w, r)
		sess = globalSessions.SessionStart(w, r)
	}
	ct := sess.Get("countnum")
	if ct == nil {
		sess.Set("countnum", 1)
	} else {
		sess.Set("countnum", (ct.(int) + 1))
	}
	t, _ := template.ParseFiles("count.gtpl")
	w.Header().Set("Content-Type", "text/html")
	t.Execute(w, sess.Get("countnum"))
}

/*
var filter_data FilterData = post_data
post_data = filter_data.formatData()

type FilterData interface { //定义数据接口
	formatData() PostData
}

func (post_data PostData) formatData() PostData { // 格式化数据
	post_data.pass_word = mdFormat(post_data.pass_word)
	return post_data
}

func mdFormat(data string) string { // 对字符串进行 md5 加密
	t := md5.New()
	io.WriteString(t, data)
	return fmt.Sprintf("%x", t.Sum(nil))
}
*/

type FilterData interface { //定义数据接口
	formatData() PostData
}

type PostData struct { //定义传递数据结构体
	user_name string
	pass_word string
}

func (post_data PostData) formatData() PostData { //格式化数据
	post_data.pass_word = mdFormat(post_data.pass_word)
	return post_data
}

func mdFormat(data string) string { //对字符串进行md5加密
	t := md5.New()
	io.WriteString(t, data)
	return fmt.Sprintf("%x", t.Sum(nil))
}
