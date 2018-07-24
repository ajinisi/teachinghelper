package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	// 驱动的引用与连接
	_ "teachinghelper/memory"

	_ "github.com/go-sql-driver/mysql"
)

// 查询任务库
func quer(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	// 验证是否登陆
	// sess := globalSessions.SessionStart(w, r)
	// if sess.Get("username") == nil {
	// 	w.WriteHeader(403)

	// } else {

	body, _ := ioutil.ReadAll(r.Body)
	fmt.Println(body)
	//username := sess.Get("username") // string(body)

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	// Query 查询
	rows, err := db.Query("SELECT login.task.ID,login.task.CLASSNAME,login.task.TYPE,login.task.DEADLINE,login.paper_bank.paper_name FROM login.task,login.paper_bank where login.task.PAPERNo=login.paper_bank.ID AND login.task.T_No=?", "1980080802")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()
	var tem int
	var temp1, temp2, temp3, temp4 string
	type task struct {
		TaskID    int    `json:"taskid"`
		ClassName string `json:"classname"`
		Type      string `json:"type"`
		Deadline  string `json:"deadline"`
		PaperName string `json:"papername"`
	}
	var tasks []task
	for rows.Next() {
		if err := rows.Scan(&tem, &temp1, &temp2, &temp3, &temp4); err != nil {
			log.Fatal(err)
		}
		var pap = task{
			tem,
			temp1,
			temp2,
			temp3,
			temp4,
		}
		tasks = append(tasks, pap)
	}

	ret, json_err := json.Marshal(&tasks) // json化结果集
	if json_err != nil {
		log.Println(json_err)
	}
	fmt.Fprint(w, string(ret)) // json转化为字符串发送
	//}
}
