package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	// 驱动的引用与连接
	_ "github.com/go-sql-driver/mysql"
)

// 定义传递数据结构体
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func main() {
	//mux := http.NewServeMux()
	//mux.HandleFunc("/login", login)
	http.HandleFunc("/register", register)
	//mux.HandleFunc("/insert", insert)
	http.HandleFunc("/query", query)
	http.HandleFunc("/queryresults", queryresults)
	http.HandleFunc("/queryanswer", queryanswer)
	//mux.HandleFunc("/querygrade", querygrade)
	//mux.HandleFunc("/commitanwer", commitanwer)
	http.HandleFunc("/queryquesbank", queryquesbank)
	http.HandleFunc("/upload", upload)
	//mux.HandleFunc("/index", index)

	// http.HandleFunc("/123", NotFoundHandler)

	http.Handle("/", http.FileServer(http.Dir("C:/Users/ajini/Desktop/goproject/src/teachinghelper")))
	http.HandleFunc("/index", Index)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func Index(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("index.html")
	if err != nil {
		log.Println(err)
	}
	t.Execute(w, nil)
}

// func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.URL.Path == "/" {
// 		http.Redirect(w, r, "/index.html", http.StatusFound)
// 	}
// }

/*
// login 登陆
func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // 允许跨域
	//r.ParseForm()                                    // 解析参数，默认是不会解析的

	// 在控制台上输出信息
	//fmt.PrintIn("Form: ", r.Form)
	//fmt.PrintIn("Path: ", r.URL.Path)

	//username, found1 := r.Form["username"]
	//password, found2 := r.Form["password"]

	//
	body, _ := ioutil.ReadAll(r.Body)
	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		fmt.Println(err)
	}

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
	if err != nil {
		fmt.Println(err)
	}

	defer db.Close()

	var row *sql.Row
	row = db.QueryRow("select * from login.users where username = ? and password = ?", user.Username, user.Password)
	var user_name, pass_word string
	err = row.Scan(&user_name, &pass_word) // 遍历结果

	if err != nil {
		arr := &result{
			500,
			"登陆失败",
			//[]string{},
		}
		b, json_err := json.Marshal(arr) // json化结果集
		if json_err != nil {
			fmt.Println("encoding faild")
		} else {
			io.WriteString(w, string(b)) // 返回结果
		}
	} else {
		arr := &result{
			200,
			"登陆成功",
			//[]string{},
		}
		b, json_err := json.Marshal(arr) // json化结果集
		if json_err != nil {
			fmt.Println("encoding faild")
		} else {
			io.WriteString(w, string(b)) // 返回结果
		}
	}
}

*/

// 注册
func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//r.ParseForm()
	//username, found1 := r.Form["username"]
	//password, found2 := r.Form["password"]
	//if !(found1 && found2) {
	//io.WriteString(w, "请勿非法访问")
	//return
	//}
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		io.WriteString(w, "连接数据库失败")
		return
	}
	defer db.Close() //在返回前关闭资源（延迟）

	//var post_data PostData
	//post_data.user_name = username[0]
	//post_data.pass_word = password[0]

	//var filter_data FilterData = post_data
	//	post_data = filter_data.formatData()

	body, _ := ioutil.ReadAll(r.Body)
	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		fmt.Println(err)
	}

	_, err = db.Exec("insert into login.users (username, password) values(?,?)", user.Username, user.Password) //插入数据
	if err != nil {
		w.WriteHeader(406)
		//arr := StatueText(406)
		//io.WriteString(w, "注册失败") // 返回结果
	} else {
		w.WriteHeader(200)
		//arr := http.StatueText(200)
		//io.WriteString(w, arr) // 返回结果

	}
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
