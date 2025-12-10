每次完成Commit，都需要编写一个opsLog,在docs/evolution下编写一个md，顶部包含下列数据标签：
id: , date: , type: (feature | fix | refactor | decision) , status: (accepted | pending | rejected), tags: [ ], links:, commit_no: <hash value of commit>
同时包含下面的内容
Context: (为什么要做这个功能)
Options: (有什么方法去做)
Decisions: (最终选择什么方式去做)
Design: (你的设计是什么)
Result: (结果)
Lessons: (你在写代码的时候遇到了什么问题)

除了evolution外，还要在ops下编写json
包含:
id:
timestamp:
developer: AI:Gemini_3 / human:rokidna (你用AI:Gemini_3)
kind: (feature / fix / refactor / decision)
title: 
summary:
references: evolution_id编号

现在为你刚刚删除代码的行动编写这两个文件