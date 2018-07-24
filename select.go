package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

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
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)
		t, err := template.ParseFiles("view/login.html")
		if err != nil {
			log.Println(err)
		}
		// ??
		w.Header().Set("Content-Type", "text/html")
		t.Execute(w, nil)

		http.Redirect(w, r, "view/login.html", http.StatusFound)

	} else {

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		defer db.Close()

		rows, err := db.Query("SELECT ID,QUES FROM login.ques_bank")
		if err != nil {
			log.Fatal(err)
		}

		defer rows.Close()

		var tem int
		var temp string
		var questions []interface{}
		var question interface{}

		for rows.Next() {
			if err := rows.Scan(&tem, &temp); err != nil {
				log.Fatal(err)
			}
			// 未知类型的推荐处理方法

			temp = strings.Replace(temp, "}", ",", 1)
			temp = temp + "\"id\":" + strconv.Itoa(tem) + "}"
			fmt.Println(temp)
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
	fmt.Println(num)
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	var temp1 string
	row := db.QueryRow("SELECT PAPERCONTENT FROM login.paper_bank where id=?", num)
	if err := row.Scan(&temp1); err != nil {
		log.Fatal(err)
	}

	// rows, err := db.Query("SELECT QUES FROM login.questionbank")
	// rows, err := db.Query("SELECT QUES FROM login.questionbank where QUES->'$.type'='fill'")
	rows, err := db.Query("SELECT QUES FROM login.ques_bank where ID in (" + temp1 + ")" + "order by field(ID," + temp1 + ")")
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
		username := sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT paper_name,ID FROM login.paper_bank where T_No=?", username)
		if err != nil {
			log.Fatal(err)
		}

		defer db.Close()

		var temp2 string
		var tem int
		type paper struct {
			PaperName string `json:"papername"`
			ID        int    `json:"id"`
		}
		var papers []paper
		for rows.Next() {
			if err := rows.Scan(&temp2, &tem); err != nil {
				log.Fatal(err)
			}
			var pap = paper{
				temp2,
				tem,
			}
			papers = append(papers, pap)
		}
		fmt.Println(papers)
		ret, json_err := json.Marshal(&papers) // json化结果集
		if json_err != nil {
			log.Println(json_err)
		}
		fmt.Fprint(w, string(ret)) // json转化为字符串发送
	}
}

func insertpaper(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {
		r.ParseForm() // 解析参数，默认是不会解析的
		// 获得
		username := sess.Get("username")
		paperName := r.Form["papername"][0]
		paperContent := r.Form["papercontent"][0]

		// 打开数据库
		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// 插入
		stmt, err := db.Prepare(`INSERT paper_bank (T_No,PAPERCONTENT,paper_name) values (?,?,?)`)
		res, err := stmt.Exec(username, paperContent, paperName)
		id, err := res.LastInsertId()
		fmt.Println(id)

		// 返回“插入成功”
		w.WriteHeader(200)
	}
}

// 查询任务库
func querytasks(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {

		// body, _ := ioutil.ReadAll(r.Body)
		username := sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT login.task.ID,login.task.CLASSNAME,login.task.TYPE,login.task.DEADLINE,login.paper_bank.paper_name FROM login.task,login.paper_bank where login.task.PAPERNo=login.paper_bank.ID AND login.task.T_No=?", username)
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
	}
}

// 查询该任务的完成情况
func querytask(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {

		// username := sess.Get("username") // string(body)

		body, _ := ioutil.ReadAll(r.Body)
		var taskID = string(body)
		fmt.Println(taskID)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT S_No,RESULT FROM login.rept where TASKNo=?", taskID)
		if err != nil {
			log.Fatal(err)
		}

		defer db.Close()

		var temp1, temp2 string

		type report struct {
			Username       string `json:"username"`
			CompletionDate string `json:"completiondate"`
		}
		var reports []report
		for rows.Next() {
			if err := rows.Scan(&temp1, &temp2); err != nil {
				log.Fatal(err)
			}
			var pap = report{
				temp1,
				temp2,
			}
			reports = append(reports, pap)
		}

		ret, json_err := json.Marshal(&reports) // json化结果集
		if json_err != nil {
			log.Println(json_err)
		}
		fmt.Fprint(w, string(ret)) // json转化为字符串发送
	}
}

// 查询教师执教的班级
func queryclass(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {

		username := sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT class_name FROM login.user_teacher where T_No = ?", username)
		if err != nil {
			log.Fatal(err)
		}

		defer db.Close()

		var temp1 string

		type clan struct {
			ClassName string `json:"classname"`
		}
		var clas []clan
		for rows.Next() {
			if err := rows.Scan(&temp1); err != nil {
				log.Fatal(err)
			}
			var cla = clan{
				temp1,
			}
			clas = append(clas, cla)
		}

		ret, json_err := json.Marshal(&clas) // json化结果集
		if json_err != nil {
			log.Println(json_err)
		}
		fmt.Fprint(w, string(ret)) // json转化为字符串发送
	}
}

// 学生查看自己要做的任务
func querytodo(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域
	//ret, _ := json.Marshal("wang")

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {
		username := sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
		if err != nil {
			//fmt.Println(err)
			fmt.Printf("连接数据库失败")
		}

		// Query 查询
		rows, err := db.Query("SELECT PAPERNo,RESULT,paper_name FROM login.rept,login.task,login.paper_bank where TASKNo=login.task.ID AND PAPERNo=login.paper_bank.ID AND S_No = ?", username)
		if err != nil {
			log.Fatal(err)
		}

		defer db.Close()

		var temp1 int
		var temp2, temp3 string

		type clan struct {
			PaperNo   int    `json:"paperNo"`
			Result    string `json:"result"`
			PaperName string `json:"papername"`
		}
		var clas []clan
		for rows.Next() {
			if err := rows.Scan(&temp1, &temp2, &temp3); err != nil {
				log.Fatal(err)
			}
			var cla = clan{
				temp1,
				temp2,
				temp3,
			}
			clas = append(clas, cla)
		}

		ret, json_err := json.Marshal(&clas) // json化结果集
		if json_err != nil {
			log.Println(json_err)
		}
		fmt.Fprint(w, string(ret)) // json转化为字符串发送
	}
}
