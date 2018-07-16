package main

import (
	"crypto/md5"
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Answer struct {
	Date     string `json:"date"`
	Username string `json:"username"`
	Choice   string `json:"choice"`
}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func delete(w http.ResponseWriter, r *http.Request) {

}

// 查询用户表
func query(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	// Query 查询
	rows, err := db.Query("SELECT * FROM login.users")
	if err != nil {
		log.Fatal(err)
	}
	var users = make([]User, 100, 100)
	var i = 0
	for rows.Next() {
		if err := rows.Scan(&(users[i].Username), &(users[i].Password)); err != nil {
			log.Fatal(err)
		}
		i++
	}

	ret, json_err := json.Marshal(&users) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送

}

// 查询结果
func queryresults(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	body, _ := ioutil.ReadAll(r.Body)
	var date = string(body)

	// Query 查询
	rows, err := db.Query("SELECT date,username,choice FROM login.answers WHERE date = ?", date)
	if err != nil {
		log.Fatal(err)
	}
	var answers = make([]Answer, 1000, 1000)
	var i = 0
	for rows.Next() {
		if err := rows.Scan(&(answers[i].Date), &(answers[i].Username), &(answers[i].Choice)); err != nil {
			log.Fatal(err)
		}
		i++
	}

	ret, json_err := json.Marshal(&answers) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送

}

// 查询答案
func queryanswer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	body, _ := ioutil.ReadAll(r.Body)
	var date = string(body)

	// Query 查询
	row := db.QueryRow("SELECT * FROM login.answers WHERE username = 'root' AND date = ?", date)
	var answer Answer
	err = row.Scan(&(answer.Date), &(answer.Username), &(answer.Choice)) // 遍历结果

	if err != nil {
		log.Fatal(err)
	}

	ret, json_err := json.Marshal(&answer) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送

}

// 查询题库
func queryquesbank(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	// 验证是否登陆
	// sess := globalSessions.SessionStart(w, r)
	// if sess.Get("username") == nil {
	// 	w.WriteHeader(403)
	// t, err := template.ParseFiles("view/login.html")
	// if err != nil {
	// 	log.Println(err)
	// }
	// // ??
	// w.Header().Set("Content-Type", "text/html")
	// t.Execute(w, nil)

	// http.Redirect(w, r, "view/login.html", http.StatusFound)

	// } else {

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	defer db.Close()

	rows, err := db.Query("SELECT QUES FROM login.questionbank")
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var temp string
	var questions []interface{}
	var question interface{}

	for rows.Next() {
		if err := rows.Scan(&temp); err != nil {
			log.Fatal(err)
		}
		// 未知类型的推荐处理方法

		json.Unmarshal([]byte(temp), &question)
		questions = append(questions, question)

		//貌似也可以
		// if err := rows.Scan(&question); err != nil {
		// 	log.Fatal(err)
		// }
		// questions = append(questions, question)

	}

	ret, json_err := json.Marshal(&questions) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送
	//log.Println(string(ret))
	//w.WriteHeader(200)
	//}
}

func upload(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	fmt.Println("method:", r.Method) //获取请求的方法
	if r.Method == "GET" {
		crutime := time.Now().Unix()
		h := md5.New()
		io.WriteString(h, strconv.FormatInt(crutime, 10))
		token := fmt.Sprintf("%x", h.Sum(nil))

		t, _ := template.ParseFiles("upload.gtpl")
		t.Execute(w, token)
	} else {
		// 设置最大内存
		r.ParseMultipartForm(32 << 20)
		// 获取上面文件的句柄
		file, handler, err := r.FormFile("uploadfile")
		if err != nil {
			fmt.Println(err)
			return
		}
		defer file.Close()
		fmt.Fprintf(w, "%v", handler.Header)
		f, err := os.OpenFile("view/papers/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer f.Close()
		io.Copy(f, file)
	}
}

// 查询试卷内容
func querypaper(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	// r.ParseForm() // 解析参数，默认是不会解析的
	// // 在控制台上输出信息
	// fmt.Println("Form: ", r.Form)
	// fmt.Println("Path: ", r.URL.Path)
	// //username := r.Form["username"][0]
	// date := r.Form["date"][0]

	body, _ := ioutil.ReadAll(r.Body)
	var num = string(body)

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	var temp1 string
	row := db.QueryRow("SELECT PAPERCONTENT FROM login.paperbank where id=?", num)
	if err := row.Scan(&temp1); err != nil {
		log.Fatal(err)
	}

	// rows, err := db.Query("SELECT QUES FROM login.questionbank")
	// rows, err := db.Query("SELECT QUES FROM login.questionbank where QUES->'$.type'='fill'")
	rows, err := db.Query("SELECT QUES FROM login.questionbank where ID in (" + temp1 + ")" + "order by field(ID," + temp1 + ")")
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var temp string
	var questions []interface{}
	var question interface{}

	for rows.Next() {
		if err := rows.Scan(&temp); err != nil {
			log.Fatal(err)
		}
		// 未知类型的推荐处理方法

		json.Unmarshal([]byte(temp), &question)
		questions = append(questions, question)

		//貌似也可以
		// if err := rows.Scan(&question); err != nil {
		// 	log.Fatal(err)
		// }
		// questions = append(questions, question)

	}

	ret, json_err := json.Marshal(&questions) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送

	// w.WriteHeader(200)
}

// 查询试卷库
func querypapers(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {

		// body, _ := ioutil.ReadAll(r.Body)
		var username = sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT CLASSNAME,PAPERNAME,ID FROM login.paperbank where username=?", username)
		if err != nil {
			log.Fatal(err)
		}

		defer db.Close()

		var temp1, temp2 string
		var tem int
		type paper struct {
			ClassName string `json:"classname"`
			PaperName string `json:"papername"`
			ID        int    `json:"id"`
		}
		var papers []paper
		for rows.Next() {
			if err := rows.Scan(&temp1, &temp2, &tem); err != nil {
				log.Fatal(err)
			}
			var pap = paper{
				temp1,
				temp2,
				tem,
			}
			papers = append(papers, pap)
		}

		ret, json_err := json.Marshal(&papers) // json化结果集
		if json_err != nil {
			log.Println(json_err)
		}
		fmt.Fprint(w, string(ret)) // json转化为字符串发送
	}
}

func insertpaper(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	body, _ := ioutil.ReadAll(r.Body)
	var paper = string(body)

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	// 插入
	stmt, err := db.Prepare(`INSERT paperbank (USERNAME,URL) values ("root",?)`)
	res, err := stmt.Exec(paper)
	id, err := res.LastInsertId()
	fmt.Println(id)

	// 返回“插入成功”
	w.WriteHeader(200)

}
