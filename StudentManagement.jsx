import { useState, useEffect } from "react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  const saveStudents = (newStudents) => {
    setStudents(newStudents);
    fetch("http://localhost:5000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ students: newStudents }),
    });
  };

  const addStudent = () => {
    if (name.trim() && !students.some((s) => s.name === name)) {
      const newStudents = [...students, { name, present: 0, absent: 0, late: 0 }];
      saveStudents(newStudents);
      setName("");
    }
  };

  const loginAdmin = () => {
    if (password === "admin123") setIsAdmin(true);
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setPassword("");
  };

  const updateAttendance = (index, type, value) => {
    if (!isAdmin) return;
    const updatedStudents = [...students];
    updatedStudents[index][type] = value;
    saveStudents(updatedStudents);
  };

  return (
    <div className="p-4 relative">
      <div className="absolute top-4 right-4">
        {!isAdmin ? (
          <div className="flex items-center space-x-2">
            <input
              placeholder="管理员密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2"
            />
            <button onClick={loginAdmin} className="bg-blue-500 text-white p-2 rounded">管理登录</button>
          </div>
        ) : (
          <button onClick={logoutAdmin} className="bg-red-500 text-white p-2 rounded">退出管理</button>
        )}
      </div>
      
      <div className="p-4 mb-4 border shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">添加学生</h2>
        <div className="flex space-x-2">
          <input
            placeholder="输入你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 flex-1"
          />
          <button onClick={addStudent} className="bg-green-500 text-white p-2 rounded">提交</button>
        </div>
      </div>
      
      <table className="w-full border shadow-lg rounded-xl">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">姓名</th>
            <th className="p-2">考勤</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 text-center font-semibold">{student.name}</td>
              <td className="p-2 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateAttendance(index, "present", student.present + 1)}>+1</button>
                  <input type="number" value={student.present} onChange={(e) => updateAttendance(index, "present", parseInt(e.target.value) || 0)} disabled={!isAdmin} />
                  <span>来</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateAttendance(index, "absent", student.absent + 1)}>+1</button>
                  <input type="number" value={student.absent} onChange={(e) => updateAttendance(index, "absent", parseInt(e.target.value) || 0)} disabled={!isAdmin} />
                  <span>不来</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateAttendance(index, "late", student.late + 1)}>+1</button>
                  <input type="number" value={student.late} onChange={(e) => updateAttendance(index, "late", parseInt(e.target.value) || 0)} disabled={!isAdmin} />
                  <span>旷课</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
