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

// 学生的数据结构
type Student struct {
	Date      string     `json:"date"`
	Username  string     `json:"username"`
	Solutions []Solution `json:"solution"`
}

type Solution struct {
	Result []string `json:"result"`
	Grade  []string `json:"grade"`
}

// 老师的数据结构
type Teacher struct {
	Date      string     `json:"date"`
	Username  string     `json:"username"`
	Questions []Question `json:"questions"`
}

type Question struct {
	Type    string   `json:"type"`
	Content string   `json:"content"`
	Options []string `json:"options"`
	Answers []string `json:"answers"`
}

func insert(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	body, _ := ioutil.ReadAll(r.Body)
	// 收到的json字符串
	fmt.Println(string(body))

	var teacher Teacher
	if err := json.Unmarshal(body, &teacher); err != nil {
		fmt.Println(err)
	}
	// 解析后的结构体
	fmt.Println(teacher)

	// Open 打开
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	// json数组转换为json字符串，存储在数据库中
	temp, err := json.Marshal(&teacher.Questions)
	if err != nil {
		fmt.Println(err)
	}

	temp1 := string(temp)

	// 插入
	stmt, err := db.Prepare(`INSERT datas (DATE,USERNAME,QUESTIONS) values (?,?,?)`)
	res, err := stmt.Exec(teacher.Date, teacher.Username, temp1)
	id, err := res.LastInsertId()
	fmt.Println(id)
	defer stmt.Close()

	// 返回“插入成功”
	w.WriteHeader(200)

}

// 插入原创题目
func insertQues(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	r.ParseForm() // 解析参数，默认是不会解析的
	// 在控制台上输出信息
	fmt.Println("Form: ", r.Form)
	fmt.Println("Path: ", r.URL.Path)

	// 接收到的数据处理
	// id := r.Form["id"][0]
	// id1, err := strconv.Atoi(id)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	type1 := r.Form["type"][0]
	grade := r.Form["grade"][0]
	grade1, _ := strconv.Atoi(grade)
	stars := r.Form["stars"][0]
	stars1, _ := strconv.Atoi(stars)

	content := r.Form["content"][0]
	url := r.Form["URL"][0]
	options := r.Form["options"]
	answers := r.Form["answers"]

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
	if err != nil {
		fmt.Println(err)
	}

	defer db.Close()

	// insert into login.questionbank (ques) values ('{
	// 	"id":13,
	// 	"type": "single",
	// 	"content": "Once___,the book is likely to be popular.",
	// 	"options": ["print","printing","to print","printed"],
	// 	"answers":[3],
	// 	"grade":3,
	// 	"stars":5
	// }');

	type Question1 struct {
		//		ID      int      `json:"id"`
		Type    string   `json:"type"`
		Content string   `json:"content"`
		Options []string `json:"options"`
		Answers []string `json:"answers"`
		Grade   int      `json:"grade"`
		Stars   int      `json:"stars"`
		URL     string   `json:"URL"`
	}

	var que = &Question1{
		//		id1,
		type1,
		content,
		options,
		answers,
		grade1,
		stars1,
		url,
	}

	// 转换为json字符串，存储在数据库中
	temp, err := json.Marshal(que)
	if err != nil {
		fmt.Println(err)
	}

	temp1 := string(temp)

	// 插入
	stmt, err := db.Prepare(`INSERT into login.ques_bank (QUES) values (?)`)
	res, err := stmt.Exec(temp1)
	id2, err := res.LastInsertId()
	fmt.Println(id2)
	defer stmt.Close()
	// 返回“插入成功”
	w.WriteHeader(200)
}

// // 存储学生答案results
// func insertResult(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

// 	r.ParseForm() // 解析参数，默认是不会解析的
// 	// 在控制台上输出信息
// 	fmt.Println("Form: ", r.Form)
// 	fmt.Println("Path: ", r.URL.Path)

// 	taskNo := r.Form["taskNo"][0]

// 	sess := globalSessions.SessionStart(w, r)
// 	username := sess.Get("username")

// 	var result [][]string

// 	body, _ := ioutil.ReadAll(r.Body)
// 	fmt.Println(string(body))
// 	if err := json.Unmarshal(body, &result); err != nil {
// 		fmt.Println(err)
// 	}
// 	fmt.Println(result)

// 	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	defer db.Close()

// 	// 插入学生的做题结果result和提交时间
// 	stmt, err := db.Prepare(`UPDATE login.rept SET result=?,submitted_at=? where S_No=? AND TASKNo=?`)
// 	res, err := stmt.Exec(string(body), time.Now(), username, taskNo)
// 	id2, err := res.LastInsertId()
// 	fmt.Println(id2)
// 	defer stmt.Close()

// 	// 查找试卷的答案
// 	var temp1 string
// 	row := db.QueryRow("SELECT PAPERCONTENT FROM login.paper_bank,task where task.PAPERNo = paper_bank.ID AND task.ID=?", taskNo)
// 	if err := row.Scan(&temp1); err != nil {
// 		log.Fatal(err)
// 	}

// 	rows, err := db.Query("SELECT QUES->'$.answers' FROM login.ques_bank where ID in (" + temp1 + ")" + "order by field(ID," + temp1 + ")")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	defer rows.Close()

// 	var temp string
// 	var answers [][]string
// 	var answer []string

// 	for rows.Next() {
// 		if err := rows.Scan(&temp); err != nil {
// 			log.Fatal(err)
// 		}

// 		// 未知类型的推荐处理方法
// 		json.Unmarshal([]byte(temp), &answer)

// 		/***
// 		***如果不使用深复制，则每次追加操作都会改变前面的值，因为追加的是同一个地址
// 		***调了一个下午！！！
// 		***/
// 		slice := make([]string, len(answer))
// 		copy(slice, answer)
// 		answers = append(answers, slice)

// 	}
// 	fmt.Println(answers)

// 	// 再计算学生的对错grades和得分scores
// 	grades := make([][]string, len(answers))

// 	for i := 0; i < len(answers); i++ {
// 		for j := 0; j < len(answers[i]); j++ {
// 			if result[i][j] == answers[i][j] {
// 				grades[i] = append(grades[i], "1")
// 			} else {
// 				grades[i] = append(grades[i], "0")
// 			}
// 		}
// 	}
// 	fmt.Println(grades)
// 	temp11, _ := json.Marshal(&grades)

// 	// 插入学生的做题对错grades
// 	stmt1, err := db.Prepare(`UPDATE login.rept SET grade=? where S_No=? AND TASKNo=?`)
// 	res1, err := stmt1.Exec(string(temp11), username, taskNo)
// 	id3, err := res1.LastInsertId()
// 	fmt.Println(id3)
// 	defer stmt1.Close()

// 	// 返回“插入成功”
// 	w.WriteHeader(200)

// }

type ReturnValue struct {
	Result [][]string `json:"results"`
	Score  []int      `json:"scores"`
	Grade  [][]string `json:"grades"`
}

// 存储学生
func insertAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	r.ParseForm() // 解析参数，默认是不会解析的
	// 在控制台上输出信息
	fmt.Println("Form: ", r.Form)
	fmt.Println("Path: ", r.URL.Path)

	taskNo := r.Form["taskNo"][0]

	sess := globalSessions.SessionStart(w, r)
	username := sess.Get("username")

	var returnValue ReturnValue
	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &returnValue); err != nil {
		fmt.Println(err)
	}

	temp1, _ := json.Marshal(&returnValue.Result)
	temp2, _ := json.Marshal(&returnValue.Grade)
	temp3, _ := json.Marshal(&returnValue.Score)

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	// 插入学生的做题结果result和提交时间
	stmt, err := db.Prepare(`UPDATE login.rept SET result=?,grade=?,score=?,submitted_at=? where S_No=? AND TASKNo=?`)
	res, err := stmt.Exec(string(temp1), string(temp2), string(temp3), time.Now(), username, taskNo)
	id2, err := res.LastInsertId()
	fmt.Println(id2)
	defer stmt.Close()

	// 返回“插入成功”
	w.WriteHeader(200)

}

// 返回学生成绩
func queryResult(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	r.ParseForm() // 解析参数，默认是不会解析的
	// 在控制台上输出信息
	fmt.Println("Form: ", r.Form)
	fmt.Println("Path: ", r.URL.Path)

	taskNo := r.Form["taskNo"][0]

	sess := globalSessions.SessionStart(w, r)
	username := sess.Get("username")

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	var results [][]string
	var scores []int
	var grades [][]string

	var temp1, temp2, temp3 string

	row := db.QueryRow("SELECT result,grade,score FROM login.rept where taskNo=? AND S_No=?", taskNo, username)
	if err := row.Scan(&temp1, &temp2, &temp3); err != nil {
		log.Fatal(err)
	}

	json.Unmarshal([]byte(temp1), &results)
	json.Unmarshal([]byte(temp2), &grades)
	json.Unmarshal([]byte(temp3), &scores)

	var returnValue = &ReturnValue{
		results,
		scores,
		grades,
	}
	temp12, _ := json.Marshal(&returnValue)
	fmt.Fprint(w, string(temp12))

	w.WriteHeader(200)
}

// 教师查询具体某一个学生的成绩
func queryResultByUsername(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	r.ParseForm() // 解析参数，默认是不会解析的
	// 在控制台上输出信息
	fmt.Println("Form: ", r.Form)
	fmt.Println("Path: ", r.URL.Path)

	taskNo := r.Form["taskNo"][0]
	username := r.Form["username"][0]

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	var results [][]string
	var scores []int
	var grades [][]string

	var temp1, temp2, temp3 string

	row := db.QueryRow("SELECT result,grade,score FROM login.rept where taskNo=? AND S_No=?", taskNo, username)
	if err := row.Scan(&temp1, &temp2, &temp3); err != nil {
		log.Fatal(err)
	}

	json.Unmarshal([]byte(temp1), &results)
	json.Unmarshal([]byte(temp2), &grades)
	json.Unmarshal([]byte(temp3), &scores)

	var returnValue = &ReturnValue{
		results,
		scores,
		grades,
	}
	temp12, _ := json.Marshal(&returnValue)
	fmt.Fprint(w, string(temp12))

	w.WriteHeader(200)
}

// // querygrade 计算学生的成绩并返回
// func querygrade(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

// 	var student Student
// 	var teacher Teacher
// 	body, _ := ioutil.ReadAll(r.Body)
// 	if err := json.Unmarshal(body, &student); err != nil {
// 		fmt.Println(err)
// 	}

// 	// Open 打开
// 	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
// 	if err != nil {
// 		//fmt.Println(err)
// 		fmt.Printf("连接数据库失败")
// 	}

// 	// 从数据库提取学生的解答
// 	row := db.QueryRow("SELECT * FROM login.myque WHERE username = ? AND date = ?", student.Username, student.Date)
// 	var temp string
// 	err = row.Scan(&temp) // 遍历结果
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	if err := json.Unmarshal([]byte(temp), &student.Solutions); err != nil {
// 		fmt.Println(err)
// 	}
// 	// 从数据库提取老师的问题
// 	row1 := db.QueryRow("SELECT * FROM login.myque WHERE username = 'root' AND date = ?", student.Date)
// 	err = row1.Scan(&temp) // 遍历结果
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	if err := json.Unmarshal([]byte(temp), &teacher.Questions); err != nil {
// 		fmt.Println(err)
// 	}

// 	// 计算学生的成绩
// 	for i := 0; i < len(teacher.Questions); i++ {
// 		for j := 0; j < len(teacher.Questions[i].Answers); j++ {
// 			if student.Solutions[i].Result[j] == teacher.Questions[i].Answers[j] {
// 				student.Solutions[i].Grade = append(student.Solutions[i].Grade, "1")
// 			} else {
// 				student.Solutions[i].Grade = append(student.Solutions[i].Grade, "0")
// 			}
// 		}
// 	}

// 	// 将学生成绩存储在数据库中
// 	temp1, _ := json.Marshal(&student.Solutions)
// 	temp2 := string(temp1)

// 	stmt1, err := db.Prepare(`INSERT datas (DATE,USERNAME,QUESTIONS) values (?,?,?)`)
// 	res1, err := stmt1.Exec(student.Date, student.Username, temp2)
// 	id1, err := res1.LastInsertId()
// 	fmt.Println(id1)
// 	defer stmt1.Close()
// }

// 上传附件，如头像，图片，音频
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

		// fmt.Fprintf(w, "%v", handler.Header)

		f, err := os.OpenFile("static/resources/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer f.Close()
		io.Copy(f, file)

		// 返回附件的路径URL
		fmt.Fprintf(w, "../../static/resources/"+handler.Filename)
	}
}

// 插入新的任务
func inserttask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	r.ParseForm() // 解析参数，默认是不会解析的
	// 在控制台上输出信息
	fmt.Println("Form: ", r.Form)
	fmt.Println("Path: ", r.URL.Path)

	// 接收到的数据处理
	deadline := r.Form["deadline"][0]
	typ := r.Form["type"][0]
	classname := r.Form["classname"][0]
	paperNo := r.Form["paperNo"][0]

	// 验证是否登陆
	sess := globalSessions.SessionStart(w, r)
	if sess.Get("username") == nil {
		w.WriteHeader(403)

	} else {

		username := sess.Get("username") // string(body)

		db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
		if err != nil {
			fmt.Println(err)
		}

		defer db.Close()

		// 向任务中插入
		stmt, err := db.Prepare(`INSERT into login.task (T_No,DEADLINE,TYPE,CLASSNAME,PAPERNo) values (?,?,?,?,?)`)
		res, err := stmt.Exec(username, deadline, typ, classname, paperNo)
		id2, err := res.LastInsertId()
		fmt.Println(id2)
		defer stmt.Close()

		// `INSERT into login.rept (TaskNo,S_No) values (?)`, (SELECT S_No FROM login.user_student WHERE CLASSNAME = ?classname
		// "SELECT login.task.CLASSNAME,login.task.TYPE,login.task.DEADLINE,login.paper_bank.paper_name FROM login.task,login.paper_bank where login.task.PAPERNo=login.paper_bank.ID AND login.task.T_No=?", username
		// AND login.task.ID=?, id2

		// 向成绩单中插入
		stmt1, err := db.Prepare(`INSERT into login.rept (TaskNo,S_No) SELECT login.task.ID,login.user_student.S_No FROM login.task,login.user_student where login.task.classname=login.user_student.classname AND login.task.ID=?`)
		if err != nil {
			fmt.Println(err)
		}
		res1, err := stmt1.Exec(id2)
		if err != nil {
			fmt.Println(err)
		}
		id3, err := res1.LastInsertId()
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(id3)
		defer stmt1.Close()

		// 返回“插入成功”
		w.WriteHeader(200)
	}
}

func deletePaper(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	body, _ := ioutil.ReadAll(r.Body)
	var num = string(body)
	fmt.Println(num)

	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	_, err = db.Exec("DELETE FROM login.paper_bank where id=?", num)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(401)
	}

	w.WriteHeader(200)
}
