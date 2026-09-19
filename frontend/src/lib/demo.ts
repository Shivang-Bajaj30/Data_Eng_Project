import type { Note, StudyClass } from './auth'
export type VaultNote = Note & { downloads?: number; pages?: number; color?: string; trusted?: boolean }
export const demoClasses: StudyClass[] = [
 {id:'cs201',name:'CS 201',subject:'Computer Science',description:'Data structures & algorithms',noteCount:24},
 {id:'ma202',name:'MA 202',subject:'Mathematics',description:'Linear algebra',noteCount:18},
 {id:'ph101',name:'PH 101',subject:'Physics',description:'Fundamentals of physics',noteCount:16},
 {id:'cs301',name:'CS 301',subject:'Computer Science',description:'Database management systems',noteCount:12},
]
export const demoNotes: VaultNote[] = [
 ['1','Data structures, beautifully explained','A complete guide to trees, graphs, and the algorithms that connect them. Includes worked examples and complexity analysis.','Computer Science','cs201','Aanya Sharma','pdf',24,128,'lavender'],
 ['2','Linear algebra: the essentials','Vectors, matrices, eigenvalues, and everything in between. A visual revision guide for your next exam.','Mathematics','ma202','Rohan Mehta','pdf',18,96,'peach'],
 ['3','Understanding quantum mechanics','From wave functions to quantum entanglement basics, with intuitive explanations and annotated diagrams.','Physics','ph101','Maya Patel','pptx',32,84,'mint'],
 ['4','Database normalization, simplified','First through fifth normal forms with practical SQL examples and a handy revision checklist.','Computer Science','cs301','Arjun Rao','pdf',12,74,'blue'],
 ['5','Algorithms: a quick revision guide','Sorting, searching, dynamic programming, and greedy algorithms in one carefully organized document.','Computer Science','cs201','Neha Singh','docx',16,62,'sand'],
 ['6','Electromagnetism lecture notes','Electric fields, magnetic forces, and Maxwell’s equations from our latest lectures.','Physics','ph101','Kabir Shah','pdf',22,58,'rose'],
].map((r,i)=>({id:String(r[0]),title:String(r[1]),description:String(r[2]),subject:String(r[3]),classId:String(r[4]),uploadedByName:String(r[5]),fileName:`note-${r[0]}.${r[6]}`,pages:Number(r[7]),downloads:Number(r[8]),color:String(r[9]),status:'approved',trusted:i!==4,createdAt:new Date(Date.now()-i*86400000).toISOString(),tags:['Lecture notes','Exam prep']}))
