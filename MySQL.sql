/* 创建题库表
  ID字段主键
  QUENo优化索引，为以后分库分表做主键候选
  QUES用JSON格式存储一道题目的完整信息
 */
CREATE TABLE login.questionbank (
  ID INT NOT NULL IDENTITY,
  QUENo INT NULL DEFAULT 0,
  QUES JSON NULL DEFAULT 'unknown',
  PRIMARY KEY (ID));



/* 插入题目 */
insert into login.questionbank (QUES) values ('{
  "type": "single",
  "content": "Once___,the book is likely to be popular.",
  "options": ["print","printing","to print","printed"],
  "answers":[3],
  "grade":3,
  "stars":5
}');




/* 
  创建试卷库表
  ID字段主键
  AUTHOR试卷作者
*/
CREATE TABLE login.paperbank (
  ID INT NOT NULL IDENTITY,
  AUTHOR VARCHAR(10) NULL DEFAULT 'unknown',
  PAPERCONTENT VARCHAR(255) NULL DEFAULT 'unknown',
  PAPERNAME VARCHAR(50) NULL DEFAULT 'unknown',
  PRIMARY KEY (ID));