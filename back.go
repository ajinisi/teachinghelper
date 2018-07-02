package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Answer struct {
	Date     string `json:"date"`
	Username string `json:"username"`
	Choice   string `json:"choice"`
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

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	rows, err := db.Query("SELECT QUES FROM login.questionbank")
	if err != nil {
		log.Fatal(err)
	}

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
}

func upload(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	body, _ := ioutil.ReadAll(r.Body)
	//var str = string(body)

	//log.Println(str)
	//var d1 = []byte(str)
	err2 := ioutil.WriteFile("C:/Users/ajini/Desktop/goproject/src/teachingsite/view/test.html", body, 0666)
	if err2 != nil {
		log.Println(err2)
	}
}
