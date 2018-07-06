package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

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

	// 返回“插入成功”
	w.WriteHeader(200)

}

// 插入原创题目
// func insertque(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

// 	r.ParseForm() // 解析参数，默认是不会解析的
// 	// 在控制台上输出信息
// 	fmt.Println("Form: ", r.Form)
// 	fmt.Println("Path: ", r.URL.Path)
// 	type1 := r.Form["type"][0]
// 	grade := r.Form["grade"][0]
// 	stars := r.Form["stars"][0]
// 	answers := r.Form["answers"][0]
// 	content := r.Form["content"][0]
// 	options := r.Form["options"][0]

// 	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8") //登陆msyql
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	defer db.Close()

// 	// 转换为json字符串，存储在数据库中
// 	temp, err := json.Marshal()
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	temp1 := string(temp)

// 	// 插入
// 	stmt, err := db.Prepare(`INSERT questionbank (QUES) values (?)`)
// 	res, err := stmt.Exec(temp1)
// 	id, err := res.LastInsertId()
// 	fmt.Println(id)

// 	// 返回“插入成功”
// 	w.WriteHeader(200)
// }

// querygrade 计算学生的成绩并返回
func querygrade(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*") //允许跨域

	var student Student
	var teacher Teacher
	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &student); err != nil {
		fmt.Println(err)
	}

	// Open 打开
	db, err := sql.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/login?charset=utf8")
	if err != nil {
		//fmt.Println(err)
		fmt.Printf("连接数据库失败")
	}

	// 从数据库提取学生的解答
	row := db.QueryRow("SELECT * FROM login.myque WHERE username = ? AND date = ?", student.Username, student.Date)
	var temp string
	err = row.Scan(&temp) // 遍历结果
	if err != nil {
		fmt.Println(err)
	}
	if err := json.Unmarshal([]byte(temp), &student.Solutions); err != nil {
		fmt.Println(err)
	}
	// 从数据库提取老师的问题
	row1 := db.QueryRow("SELECT * FROM login.myque WHERE username = 'root' AND date = ?", student.Date)
	err = row1.Scan(&temp) // 遍历结果
	if err != nil {
		fmt.Println(err)
	}
	if err := json.Unmarshal([]byte(temp), &teacher.Questions); err != nil {
		fmt.Println(err)
	}

	// 计算学生的成绩
	for i := 0; i < len(teacher.Questions); i++ {
		for j := 0; j < len(teacher.Questions[i].Answers); j++ {
			if student.Solutions[i].Result[j] == teacher.Questions[i].Answers[j] {
				student.Solutions[i].Grade = append(student.Solutions[i].Grade, "1")
			} else {
				student.Solutions[i].Grade = append(student.Solutions[i].Grade, "0")
			}
		}
	}

	// 将学生成绩存储在数据库中
	temp1, _ := json.Marshal(&student.Solutions)
	temp2 := string(temp1)

	stmt1, err := db.Prepare(`INSERT datas (DATE,USERNAME,QUESTIONS) values (?,?,?)`)
	res1, err := stmt1.Exec(student.Date, student.Username, temp2)
	id1, err := res1.LastInsertId()
	fmt.Println(id1)

}
