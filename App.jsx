
import { useEffect, useState } from 'react'
import './App.css'

const DAYS = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba'
]

const MENU = [
  'Dashboard',
  'O‘quvchilar',
  'O‘qituvchilar',
  'Sinflar va kurslar',
  'Dars jadvali',
  'Davomat',
  'Baholar',
  'To‘lovlar',
  'Hisobotlar',
  'Ota-onalar'
]

const loadData = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const makeId = () => Date.now() + Math.floor(Math.random() * 1000)

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  // Asosiy ma'lumotlar
  const [students, setStudents] = useState(() =>
    loadData('muhsin_students')
  )
  const [teachers, setTeachers] = useState(() =>
    loadData('muhsin_teachers')
  )
  const [classes, setClasses] = useState(() =>
    loadData('muhsin_classes')
  )

  // Yangi haftalik jadval alohida saqlanadi
  const [schedules, setSchedules] = useState(() =>
    loadData('muhsin_weekly_schedules_v2')
  )

  const [attendance, setAttendance] = useState(() =>
    loadData('muhsin_attendance')
  )
  const [grades, setGrades] = useState(() =>
    loadData('muhsin_grades')
  )
  const [payments, setPayments] = useState(() =>
    loadData('muhsin_payments')
  )
  const [parents, setParents] = useState(() =>
    loadData('muhsin_parents')
  )

  // Qidiruv va formalar
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [editId, setEditId] = useState(null)

  // O'quvchi formasi
  const [studentForm, setStudentForm] = useState({
    name: '',
    phone: '',
    group: '',
    payment: '',
    status: 'Faol'
  })

  // O'qituvchi formasi
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    phone: '',
    subject: '',
    salary: '',
    status: 'Faol'
  })

  // Sinf formasi
  const [classForm, setClassForm] = useState({
    name: '',
    teacherId: '',
    price: '',
    days: [],
    startTime: '',
    endTime: '',
    status: 'Faol'
  })

  // Haftalik jadval formasi
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDay, setSelectedDay] = useState('Dushanba')
  const [lessonForm, setLessonForm] = useState({
    subject: '',
    teacherId: '',
    startTime: '',
    endTime: ''
  })

  // Boshqa bo'limlar
  const [simpleForm, setSimpleForm] = useState({
    studentId: '',
    teacherId: '',
    classId: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Keldi',
    subject: '',
    grade: '',
    amount: '',
    note: '',
    name: '',
    phone: ''
  })

  // Ma'lumotlarni saqlash
  useEffect(() => {
    localStorage.setItem('muhsin_students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem('muhsin_teachers', JSON.stringify(teachers))
  }, [teachers])

  useEffect(() => {
    localStorage.setItem('muhsin_classes', JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    localStorage.setItem(
      'muhsin_weekly_schedules_v2',
      JSON.stringify(schedules)
    )
  }, [schedules])

  useEffect(() => {
    localStorage.setItem('muhsin_attendance', JSON.stringify(attendance))
  }, [attendance])

  useEffect(() => {
    localStorage.setItem('muhsin_grades', JSON.stringify(grades))
  }, [grades])

  useEffect(() => {
    localStorage.setItem('muhsin_payments', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('muhsin_parents', JSON.stringify(parents))
  }, [parents])

  // Formani tozalash
  const resetForms = () => {
    setStudentForm({
      name: '',
      phone: '',
      group: '',
      payment: '',
      status: 'Faol'
    })

    setTeacherForm({
      name: '',
      phone: '',
      subject: '',
      salary: '',
      status: 'Faol'
    })

    setClassForm({
      name: '',
      teacherId: '',
      price: '',
      days: [],
      startTime: '',
      endTime: '',
      status: 'Faol'
    })

    setLessonForm({
      subject: '',
      teacherId: '',
      startTime: '',
      endTime: ''
    })

    setSimpleForm({
      studentId: '',
      teacherId: '',
      classId: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Keldi',
      subject: '',
      grade: '',
      amount: '',
      note: '',
      name: '',
      phone: ''
    })

    setEditId(null)
    setShowForm(false)
  }

  const removeItem = (setter, id) => {
    if (window.confirm('Haqiqatan ham o‘chirmoqchimisiz?')) {
      setter(old => old.filter(item => item.id !== id))
    }
  }

  const getTeacherName = id =>
    teachers.find(t => String(t.id) === String(id))?.name || 'Belgilanmagan'

  const getStudentName = id =>
    students.find(s => String(s.id) === String(id))?.name || 'Belgilanmagan'

  const getClassName = id =>
    classes.find(c => String(c.id) === String(id))?.name || 'Belgilanmagan'

  // O'quvchi qo'shish / tahrirlash
  const saveStudent = e => {
    e.preventDefault()

    if (!studentForm.name.trim()) {
      alert('O‘quvchi ismini kiriting')
      return
    }

    if (editId) {
      setStudents(old =>
        old.map(item =>
          item.id === editId ? { ...item, ...studentForm } : item
        )
      )
    } else {
      setStudents(old => [...old, { id: makeId(), ...studentForm }])
    }

    resetForms()
  }

  const editStudent = student => {
    setStudentForm({
      name: student.name || '',
      phone: student.phone || '',
      group: student.group || '',
      payment: student.payment || '',
      status: student.status || 'Faol'
    })
    setEditId(student.id)
    setShowForm(true)
  }

  // O'qituvchi qo'shish / tahrirlash
  const saveTeacher = e => {
    e.preventDefault()

    if (!teacherForm.name.trim()) {
      alert('O‘qituvchi ismini kiriting')
      return
    }

    if (editId) {
      setTeachers(old =>
        old.map(item =>
          item.id === editId ? { ...item, ...teacherForm } : item
        )
      )
    } else {
      setTeachers(old => [...old, { id: makeId(), ...teacherForm }])
    }

    resetForms()
  }

  const editTeacher = teacher => {
    setTeacherForm({
      name: teacher.name || '',
      phone: teacher.phone || '',
      subject: teacher.subject || '',
      salary: teacher.salary || '',
      status: teacher.status || 'Faol'
    })
    setEditId(teacher.id)
    setShowForm(true)
  }

  // Sinf qo'shish / tahrirlash
  const saveClass = e => {
    e.preventDefault()

    if (!classForm.name.trim()) {
      alert('Sinf nomini kiriting')
      return
    }

    const data = {
      ...classForm,
      days: classForm.days || []
    }

    if (editId) {
      setClasses(old =>
        old.map(item =>
          item.id === editId ? { ...item, ...data } : item
        )
      )
    } else {
      setClasses(old => [...old, { id: makeId(), ...data }])
    }

    resetForms()
  }

  const editClass = item => {
    setClassForm({
      name: item.name || '',
      teacherId: item.teacherId || '',
      price: item.price || '',
      days: item.days || [],
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      status: item.status || 'Faol'
    })
    setEditId(item.id)
    setShowForm(true)
  }

  // Haftalik jadvalga dars qo'shish
 
// Haftalik jadvalga dars qo'shish

const saveLesson = e => {
  e.preventDefault()

  if (!selectedClass) {
    alert('Avval sinfni tanlang')
    return
  }

  if (!lessonForm.subject.trim()) {
    alert('Fan nomini kiriting')
    return
  }

  if (!lessonForm.teacherId) {
    alert('O‘qituvchini tanlang')
    return
  }

  if (!lessonForm.startTime || !lessonForm.endTime) {
    alert('Dars boshlanishi va tugash vaqtini kiriting')
    return
  }

  if (lessonForm.startTime >= lessonForm.endTime) {
    alert('Dars tugash vaqti boshlanish vaqtidan keyin bo‘lishi kerak')
    return
  }

  // O'qituvchining boshqa darsi bilan vaqt to'qnashuvini tekshirish
  const conflict = schedules.find(item => {
    // Tahrir qilinayotgan darsni tekshirmaslik
    if (String(item.id) === String(editId)) return false

    const sameTeacher =
      String(item.teacherId || '') === String(lessonForm.teacherId)

    const sameDay =
      String(item.day || '') === String(selectedDay)

    const oldStart = String(item.startTime || '')
    const oldEnd = String(item.endTime || '')

    const overlaps =
      lessonForm.startTime < oldEnd &&
      lessonForm.endTime > oldStart

    return sameTeacher && sameDay && overlaps
  })

  if (conflict) {
    const conflictClass = classes.find(
      c => String(c.id) === String(conflict.classId)
    )

    alert(
      `Bu o‘qituvchida shu vaqtda boshqa dars bor!\n\n` +
      `Sinf: ${conflictClass?.name || 'Noma’lum'}\n` +
      `Fan: ${conflict.subject || 'Belgilanmagan'}\n` +
      `Vaqt: ${conflict.startTime || ''} – ${conflict.endTime || ''}`
    )

    return
  }

  const data = {
    id: editId || makeId(),
    classId: selectedClass,
    day: selectedDay,
    subject: lessonForm.subject.trim(),
    teacherId: lessonForm.teacherId,
    startTime: lessonForm.startTime,
    endTime: lessonForm.endTime
  }

  if (editId) {
    setSchedules(old =>
      old.map(item =>
        String(item.id) === String(editId) ? data : item
      )
    )
  } else {
    setSchedules(old => [...old, data])
  }

  setLessonForm({
    subject: '',
    teacherId: '',
    startTime: '',
    endTime: ''
  })

  setEditId(null)
  setShowForm(false)
}
  // Davomat
  const saveAttendance = e => {
    e.preventDefault()

    if (!simpleForm.studentId) {
      alert('O‘quvchini tanlang')
      return
    }

    setAttendance(old => [
      ...old,
      {
        id: makeId(),
        studentId: simpleForm.studentId,
        date: simpleForm.date,
        status: simpleForm.status,
        note: simpleForm.note
      }
    ])
    resetForms()
  }

  // Baholar
  const saveGrade = e => {
    e.preventDefault()

    if (!simpleForm.studentId || !simpleForm.subject || !simpleForm.grade) {
      alert('O‘quvchi, fan va bahoni kiriting')
      return
    }

    setGrades(old => [
      ...old,
      {
        id: makeId(),
        studentId: simpleForm.studentId,
        subject: simpleForm.subject,
        grade: simpleForm.grade,
        date: simpleForm.date
      }
    ])
    resetForms()
  }

  // To'lovlar
  const savePayment = e => {
    e.preventDefault()

    if (!simpleForm.studentId || !simpleForm.amount) {
      alert('O‘quvchi va to‘lov summasini kiriting')
      return
    }

    setPayments(old => [
      ...old,
      {
        id: makeId(),
        studentId: simpleForm.studentId,
        amount: simpleForm.amount,
        date: simpleForm.date,
        note: simpleForm.note
      }
    ])
    resetForms()
  }

  // Ota-onalar
  const saveParent = e => {
    e.preventDefault()

    if (!simpleForm.name.trim()) {
      alert('Ota-ona ismini kiriting')
      return
    }

    setParents(old => [
      ...old,
      {
        id: makeId(),
        name: simpleForm.name,
        phone: simpleForm.phone,
        studentId: simpleForm.studentId
      }
    ])
    resetForms()
  }

  const openAddForm = () => {
    resetForms()
    setShowForm(true)
  }

  const filteredStudents = students.filter(student =>
    `${student.name} ${student.phone} ${student.group}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.name} ${teacher.phone} ${teacher.subject}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredClasses = classes.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

// =====================================
// DARS JADVALI UCHUN YORDAMCHI FUNKSIYALAR
// =====================================

// Tanlangan sinfning darslarini olish va vaqt bo'yicha saralash
const selectedClassLessons = schedules
  .filter(item => String(item.classId) === String(selectedClass))
  .sort((a, b) =>
    String(a.startTime || '').localeCompare(String(b.startTime || ''))
  )

// Sinfdagi dars kunlarini belgilash
const changeClassDay = day => {
  setClassForm(old => ({
    ...old,
    days: old.days.includes(day)
      ? old.days.filter(item => item !== day)
      : [...old.days, day]
  }))
}

// Darsni tahrirlash
const editLesson = lesson => {
  setSelectedClass(String(lesson.classId))
  setSelectedDay(lesson.day || 'Dushanba')

  setLessonForm({
    subject: lesson.subject || '',
    teacherId: String(lesson.teacherId || ''),
    startTime: lesson.startTime || '',
    endTime: lesson.endTime || ''
  })

  setEditId(lesson.id)
  setShowForm(true)
}

  const today = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const pageTitle = activePage

  return (
    <div className="app">
      <style>{`
        .weekly-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        .weekly-table th, .weekly-table td {
          border: 1px solid #e5eaf1;
          padding: 12px;
          text-align: left;
          vertical-align: top;
        }
        .weekly-table th {
          background: #f4f7fb;
          color: #344054;
        }
        .lesson-card {
          background: #f0f5ff;
          border-left: 4px solid #4776e6;
          padding: 10px;
          border-radius: 7px;
          margin-bottom: 8px;
        }
        .lesson-card strong {
          display: block;
          margin-bottom: 5px;
        }
        .lesson-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }
        .lesson-actions button, .action-button {
          border: 0;
          padding: 6px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .lesson-actions button:first-child {
          background: #e4edff;
          color: #2456b5;
        }
        .lesson-actions button:last-child {
          background: #ffe8e8;
          color: #c62828;
        }
        .schedule-toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .schedule-toolbar select, .schedule-toolbar button {
          padding: 10px;
          border: 1px solid #d7deea;
          border-radius: 7px;
        }
        .schedule-add {
          background: #315ed6;
          color: white;
          border: 0 !important;
          cursor: pointer;
        }
        .schedule-print {
          background: #edf1f7;
          cursor: pointer;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .form-grid label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #344054;
          font-size: 13px;
        }
        .form-grid input, .form-grid select {
          padding: 10px;
          border: 1px solid #d7deea;
          border-radius: 7px;
          min-width: 0;
          color: #26344a;
          background: white;
        }
        .form-grid input:focus, .form-grid select:focus {
          outline: 2px solid #b9ccff;
          border-color: #4776e6;
        }
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .form-actions button {
          padding: 10px 16px;
          border: 0;
          border-radius: 7px;
          cursor: pointer;
        }
        .form-save {
          background: #315ed6;
          color: white;
        }
        .form-cancel {
          background: #edf1f7;
          color: #344054;
        }
        .day-checkboxes {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .day-checkboxes label {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 5px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .data-table th, .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e8edf3;
          text-align: left;
        }
        .data-table th {
          background: #f4f7fb;
        }
        .table-actions {
          display: flex;
          gap: 6px;
        }
        .table-actions button {
          padding: 6px 9px;
          border: 0;
          border-radius: 5px;
          cursor: pointer;
        }
        .edit-btn {
          background: #e4edff;
          color: #2456b5;
        }
        .delete-btn {
          background: #ffe8e8;
          color: #c62828;
        }
        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }
        .stat-number {
          font-size: 25px;
          font-weight: 700;
        }
        .empty-message {
          padding: 25px;
          text-align: center;
          color: #7b8798;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          .weekly-table {
            min-width: 0 !important;
            font-size: 11px;
          }
          .weekly-table th, .weekly-table td {
            padding: 6px !important;
          }
        }
        @media (max-width: 650px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* CHAP MENYU */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>
          <div>
            <h2>MUHSIN</h2>
            <span>TA'LIM MARKAZI</span>
          </div>
        </div>

        <div className="menu">
          <div className="menu-title">ASOSIY MENYU</div>

          {MENU.map((item, index) => (
            <button
              key={item}
              className={`menu-item ${activePage === item ? 'selected' : ''}`}
              onClick={() => {
                setActivePage(item)
                setSearch('')
                resetForms()
              }}
            >
              <span className="menu-icon">
                {['▦', '♙', '♟', '▤', '▦', '✓', '★', '＄', '▥', '♧'][index]}
              </span>
              {item}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">M</div>
            <div>
              <strong>Administrator</strong>
              <span>Boshqaruv paneli</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ASOSIY QISM */}
      <main className="main">
        <header className="topbar">
          <div>
            <h2>{pageTitle}</h2>
            <p className="breadcrumb">Bosh sahifa / {pageTitle}</p>
          </div>
          <div className="top-date">{today}</div>
        </header>

        {/* DASHBOARD */}
        {activePage === 'Dashboard' && (
          <>
            <section className="welcome">
              <div className="welcome-content">
                <span className="welcome-tag">BOSHQARUV PANELI</span>
                <h1>Xush kelibsiz!</h1>
                <p>MUHSIN TA'LIM MARKAZI boshqaruv tizimi</p>
              </div>
              <div className="welcome-art">🎓</div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">♙</div>
                <div className="stat-info">
                  <span>O‘quvchilar</span>
                  <div className="stat-number">{students.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">♟</div>
                <div className="stat-info">
                  <span>O‘qituvchilar</span>
                  <div className="stat-number">{teachers.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">▤</div>
                <div className="stat-info">
                  <span>Sinflar va kurslar</span>
                  <div className="stat-number">{classes.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">▦</div>
                <div className="stat-info">
                  <span>Haftalik darslar</span>
                  <div className="stat-number">{schedules.length}</div>
                </div>
              </div>
            </section>

            <section className="dashboard-insights">
              <article className="dashboard-insight-card dashboard-income">
                <div className="dashboard-insight-top">
                  <span className="dashboard-insight-icon">↗</span>
                  <span className="dashboard-insight-label">JAMI TUSHUM</span>
                </div>
                <strong>
                  {payments.reduce((sum, item) => sum + (Number(String(item.amount || '').replace(/[^0-9.-]/g, '')) || 0), 0).toLocaleString('uz-UZ')} so‘m
                </strong>
                <p>{payments.length} ta to‘lov qayd etilgan</p>
              </article>

              <article className="dashboard-insight-card dashboard-attendance">
                <div className="dashboard-insight-top">
                  <span className="dashboard-insight-icon">✓</span>
                  <span className="dashboard-insight-label">DAVOMAT</span>
                </div>
                <strong>
                  {attendance.length ? Math.round(attendance.filter(item => item.status === 'Keldi').length / attendance.length * 100) : 0}%
                </strong>
                <p>{attendance.filter(item => item.status === 'Keldi').length} ta kelgan / {attendance.length} ta qayd</p>
              </article>

              <article className="dashboard-insight-card dashboard-grades">
                <div className="dashboard-insight-top">
                  <span className="dashboard-insight-icon">★</span>
                  <span className="dashboard-insight-label">O‘RTACHA BAHO</span>
                </div>
                <strong>
                  {(() => {
                    const numericGrades = grades.map(item => Number(item.grade)).filter(value => Number.isFinite(value) && value > 0)
                    return numericGrades.length
                      ? (numericGrades.reduce((sum, value) => sum + value, 0) / numericGrades.length).toFixed(1)
                      : '—'
                  })()}
                </strong>
                <p>{grades.length} ta baholash qayd etilgan</p>
              </article>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h3>So‘nggi qo‘shilgan o‘quvchilar</h3>
              </div>
              {students.length === 0 ? (
                <div className="empty-message">Hozircha o‘quvchilar yo‘q</div>
              ) : (
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ism familiya</th>
                        <th>Telefon</th>
                        <th>Sinf / Guruh</th>
                        <th>Holati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(-5).reverse().map(student => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.phone}</td>
                          <td>{student.group}</td>
                          <td>{student.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* O'QUVCHILAR */}
        {activePage === 'O‘quvchilar' && (
          <section className="panel students-panel">
            <div className="students-heading">
              <div>
                <h2>O‘quvchilar ro‘yxati</h2>
                <p>O‘quvchilarni kartochkalar orqali boshqarish</p>
              </div>
              <button className="add-student" onClick={openAddForm}>
                + O‘quvchi qo‘shish
              </button>
            </div>

            <div className="student-cards-toolbar">
              <div className="student-search">
                <span className="search-icon">⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="O‘quvchini qidirish..."
                />
              </div>
              <div className="student-total">
                Jami: <strong>{filteredStudents.length}</strong> ta o‘quvchi
              </div>
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveStudent}>
                <h3>{editId ? 'O‘quvchini tahrirlash' : 'Yangi o‘quvchi'}</h3>
                <div className="form-grid">
                  <label>Ism familiya
                    <input required value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} />
                  </label>
                  <label>Telefon
                    <input value={studentForm.phone} onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })} />
                  </label>
                  <label>Sinf / Guruh
                    <input value={studentForm.group} onChange={e => setStudentForm({ ...studentForm, group: e.target.value })} />
                  </label>
                  <label>To‘lov
                    <input value={studentForm.payment} onChange={e => setStudentForm({ ...studentForm, payment: e.target.value })} />
                  </label>
                  <label>Holati
                    <select value={studentForm.status} onChange={e => setStudentForm({ ...studentForm, status: e.target.value })}>
                      <option>Faol</option>
                      <option>Nofaol</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save" type="submit">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            {filteredStudents.length > 0 ? (
              <div className="student-cards-grid">
                {filteredStudents.map((student, index) => (
                  <article className="student-card" key={student.id}>
                    <div className="student-card-cover">
                      <span className="student-card-number">
                        №{index + 1}
                      </span>
                    </div>

                    <div className="student-card-body">
                      <div className="student-card-avatar">
                        {(student.name || 'O‘').trim().split(/\s+/).map(part => part[0] || '').slice(0, 2).join('').toUpperCase()}
                      </div>

                      <h3 className="student-card-name">
                        {student.name}
                      </h3>

                      <p className="student-card-group">
                        {student.group || 'Guruh belgilanmagan'}
                      </p>

                      <button
                        className="student-card-detail-btn"
                        onClick={() => setSelectedStudent(student)}
                      >
                        Batafsil ko‘rish
                      </button>

                      <div className="student-card-details">
                        <div>
                          <span>Telefon</span>
                          <strong>{student.phone || 'Kiritilmagan'}</strong>
                        </div>
                        <div>
                          <span>Oylik to‘lov</span>
                          <strong>{student.payment || 'Belgilanmagan'}</strong>
                        </div>
                      </div>

                      <div className="student-card-bottom">
                        <span className={`student-card-status ${student.status === 'Faol' ? 'active' : 'inactive'}`}>
                          {student.status || 'Nofaol'}
                        </span>
                      </div>

                      <div className="student-card-actions">
                        <button
                          className="student-card-edit"
                          onClick={() => editStudent(student)}
                        >
                          Tahrirlash
                        </button>
                        <button
                          className="student-card-delete"
                          onClick={() => removeItem(setStudents, student.id)}
                        >
                          O‘chirish
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                O‘quvchilar topilmadi
              </div>
            )}
            {selectedStudent && (
              <div
                className="student-detail-overlay"
                onClick={() => setSelectedStudent(null)}
              >
                <div
                  className="student-detail-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="student-detail-close"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ×
                  </button>

                  <h2>O‘quvchi ma’lumotlari</h2>

                  <div className="student-detail-info">
                    <p><strong>Ismi:</strong> {selectedStudent.name}</p>
                    <p><strong>Telefon:</strong> {selectedStudent.phone || 'Kiritilmagan'}</p>
                    <p><strong>Guruh:</strong> {selectedStudent.group || 'Kiritilmagan'}</p>
                    <p><strong>To‘lov:</strong> {selectedStudent.payment || 'Kiritilmagan'}</p>
                    <p><strong>Holati:</strong> {selectedStudent.status || 'Faol'}</p>
                  </div>

                  <div className="student-detail-actions">
                    <button
                      type="button"
                      className="student-card-edit"
                      onClick={() => {
                        editStudent(selectedStudent)
                        setSelectedStudent(null)
                      }}
                    >
                      Tahrirlash
                    </button>

                    <button
                      type="button"
                      className="student-card-delete"
                      onClick={() => {
                        removeItem(setStudents, selectedStudent.id)
                        setSelectedStudent(null)
                      }}
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {/* O'QITUVCHILAR */}
        {activePage === 'O‘qituvchilar' && (
          <section className="panel">
            <div className="students-heading">
              <div>
                <h2>O‘qituvchilar ro‘yxati</h2>
                <p>O‘qituvchilar ma’lumotlarini boshqarish</p>
              </div>
              <button className="add-student" onClick={openAddForm}>+ O‘qituvchi qo‘shish</button>
            </div>

            <div className="student-search">
              <span className="search-icon">⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="O‘qituvchini qidirish..." />
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveTeacher}>
                <h3>{editId ? 'O‘qituvchini tahrirlash' : 'Yangi o‘qituvchi'}</h3>
                <div className="form-grid">
                  <label>Ism familiya
                    <input required value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                  </label>
                  <label>Telefon
                    <input value={teacherForm.phone} onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })} />
                  </label>
                  <label>Fan
                    <input value={teacherForm.subject} onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })} />
                  </label>
                  <label>Oylik maoshi
                    <input value={teacherForm.salary} onChange={e => setTeacherForm({ ...teacherForm, salary: e.target.value })} />
                  </label>
                  <label>Holati
                    <select value={teacherForm.status} onChange={e => setTeacherForm({ ...teacherForm, status: e.target.value })}>
                      <option>Faol</option>
                      <option>Nofaol</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="teacher-cards-grid">
              {filteredTeachers.map((teacher, index) => (
                <article className="teacher-card teacher-card-compact" key={teacher.id}>

  <div className="teacher-compact-top">
    <div className="teacher-compact-avatar">
      {(teacher.name || 'O‘').trim().split(/\s+/).map(part => part[0] || '').slice(0, 2).join('').toUpperCase()}
    </div>

    <span className="teacher-compact-number">
      #{index + 1}
    </span>
  </div>

  <div className="teacher-compact-content">
    <span className="teacher-compact-label">
      O‘QITUVCHI
    </span>

    <h3>{teacher.name}</h3>
  </div>

  <div className="teacher-card-actions">
    <button
      type="button"
      className="teacher-detail-btn"
      onClick={() => setSelectedTeacher(teacher)}
    >
      Batafsil
    </button>

    <button
      type="button"
      className="edit-btn"
      onClick={() => editTeacher(teacher)}
    >
      Tahrirlash
    </button>

    <button
      type="button"
      className="delete-btn"
      onClick={() => removeItem(setTeachers, teacher.id)}
    >
      O‘chirish
    </button>
  </div>

</article>
              ))}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="empty-message">O‘qituvchilar topilmadi</div>
            )}
            {selectedTeacher && (
              <div
                className="teacher-detail-overlay"
                onClick={() => setSelectedTeacher(null)}
              >
                <div
                  className="teacher-detail-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="teacher-detail-header">
                    <button
                      type="button"
                      className="teacher-detail-close"
                      onClick={() => setSelectedTeacher(null)}
                    >
                      ×
                    </button>

                    <div className="teacher-detail-avatar">
                      {(selectedTeacher.name || 'O‘').trim().split(/\s+/).map(part => part[0] || '').slice(0, 2).join('').toUpperCase()}
                    </div>

                    <h2>{selectedTeacher.name}</h2>
                    <span className="teacher-detail-subtitle">O‘qituvchi profili</span>
                    <span className={`teacher-detail-status ${selectedTeacher.status === 'Faol' ? 'active' : 'inactive'}`}>
                      {selectedTeacher.status || 'Faol'}
                    </span>
                  </div>

                  <div className="teacher-detail-body">
                    <div className="teacher-info-card">
                      <span>☎</span>
                      <div>
                        <small>Telefon raqami</small>
                        <strong>{selectedTeacher.phone || 'Kiritilmagan'}</strong>
                      </div>
                    </div>

                    <div className="teacher-info-card">
                      <span>📚</span>
                      <div>
                        <small>O‘qitadigan fani</small>
                        <strong>{selectedTeacher.subject || 'Kiritilmagan'}</strong>
                      </div>
                    </div>

                    <div className="teacher-info-card">
                      <span>💰</span>
                      <div>
                        <small>Oylik maoshi</small>
                        <strong>{selectedTeacher.salary || 'Belgilanmagan'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="teacher-detail-footer">
                    <button
                      type="button"
                      className="teacher-detail-edit"
                      onClick={() => {
                        editTeacher(selectedTeacher)
                        setSelectedTeacher(null)
                      }}
                    >
                      Tahrirlash
                    </button>

                    <button
                      type="button"
                      className="teacher-detail-done"
                      onClick={() => setSelectedTeacher(null)}
                    >
                      Yopish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SINFLAR VA KURSLAR */}
        {activePage === 'Sinflar va kurslar' && (
          <section className="panel">
            <div className="students-heading">
              <div>
                <h2>Sinflar va kurslar</h2>
                <p>Yangi sinf yoki kurs yaratish</p>
              </div>
              <button className="add-student" onClick={openAddForm}>+ Sinf qo‘shish</button>
            </div>

            <div className="student-search">
              <span className="search-icon">⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sinfni qidirish..." />
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveClass}>
                <h3>{editId ? 'Sinfni tahrirlash' : 'Yangi sinf yoki kurs'}</h3>
                <div className="form-grid">
                  <label>Sinf nomi (masalan, 7-A)
                    <input required value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} />
                  </label>
                  <label>Mas'ul o‘qituvchi
                    <select value={classForm.teacherId} onChange={e => setClassForm({ ...classForm, teacherId: e.target.value })}>
                      <option value="">Tanlang</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </label>
                  <label>Oylik to‘lov
                    <input value={classForm.price} onChange={e => setClassForm({ ...classForm, price: e.target.value })} />
                  </label>
                  <label>Boshlanish vaqti
                    <input type="time" value={classForm.startTime} onChange={e => setClassForm({ ...classForm, startTime: e.target.value })} />
                  </label>
                  <label>Tugash vaqti
                    <input type="time" value={classForm.endTime} onChange={e => setClassForm({ ...classForm, endTime: e.target.value })} />
                  </label>
                </div>

                <p style={{ marginTop: 15 }}>Dars kunlari:</p>
                <div className="day-checkboxes">
                  {DAYS.map(day => (
                    <label key={day}>
                      <input type="checkbox" checked={classForm.days.includes(day)} onChange={() => changeClassDay(day)} />
                      {day}
                    </label>
                  ))}
                </div>

                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr><th>№</th><th>Sinf / Kurs</th><th>Mas'ul o‘qituvchi</th><th>To‘lov</th><th>Dars kunlari</th><th>Amallar</th></tr>
                </thead>
                <tbody>
                  {filteredClasses.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{getTeacherName(item.teacherId)}</td>
                      <td>{item.price}</td>
                      <td>{(item.days || []).join(', ')}</td>
                      <td><div className="table-actions">
                        <button className="edit-btn" onClick={() => editClass(item)}>Tahrirlash</button>
                        <button className="delete-btn" onClick={() => removeItem(setClasses, item.id)}>O‘chirish</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredClasses.length === 0 && <div className="empty-message">Hozircha sinflar yo‘q</div>}
            </div>
          </section>
        )}

        {/* DARS JADVALI */}
        {activePage === 'Dars jadvali' && (
          <section className="panel">
            <div className="students-heading">
              <div>
                <h2>Haftalik dars jadvali</h2>
                <p>Har bir sinf uchun alohida dars jadvali</p>
              </div>
            </div>

            {classes.length === 0 ? (
              <div className="empty-message">
                Avval “Sinflar va kurslar” bo‘limidan sinf yarating.
              </div>
            ) : (
              <>
                <div className="schedule-toolbar no-print">
                  <label>
                    Sinfni tanlang:
                    <select
                      value={selectedClass}
                      onChange={e => setSelectedClass(e.target.value)}
                      style={{ marginLeft: 8 }}
                    >
                      <option value="">Sinfni tanlang</option>
                      {classes.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="schedule-add"
                    onClick={() => {
                      if (!selectedClass) {
                        alert('Avval sinfni tanlang')
                        return
                      }
                      setSelectedDay('Dushanba')
                      setLessonForm({
                        subject: '',
                        teacherId: '',
                        startTime: '',
                        endTime: ''
                      })
                      setEditId(null)
                      setShowForm(true)
                    }}
                  >
                    + Dars qo‘shish
                  </button>

                  <button className="schedule-print" onClick={() => window.print()}>
                    🖨 Chop etish
                  </button>
                </div>

                {showForm && (
                  <form className="panel no-print" onSubmit={saveLesson}>
                    <h3>{editId ? 'Darsni tahrirlash' : 'Yangi dars qo‘shish'}</h3>
                    <div className="form-grid">
                      <label>Sinf
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                          {classes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                      </label>
                      <label>Hafta kuni
                        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                          {DAYS.map(day => <option key={day}>{day}</option>)}
                        </select>
                      </label>
                      <label>Fan nomi
                        <input required placeholder="Masalan: Matematika" value={lessonForm.subject} onChange={e => setLessonForm({ ...lessonForm, subject: e.target.value })} />
                      </label>
                      <label>O‘qituvchi
                        <select required value={lessonForm.teacherId} onChange={e => setLessonForm({ ...lessonForm, teacherId: e.target.value })}>
                          <option value="">O‘qituvchini tanlang</option>
                          {teachers.map(t => <option key={t.id} value={t.id}>{t.name} {t.subject ? `— ${t.subject}` : ''}</option>)}
                        </select>
                      </label>
                      <label>Dars boshlanishi
                        <input required type="time" value={lessonForm.startTime} onChange={e => setLessonForm({ ...lessonForm, startTime: e.target.value })} />
                      </label>
                      <label>Dars tugashi
                        <input required type="time" value={lessonForm.endTime} onChange={e => setLessonForm({ ...lessonForm, endTime: e.target.value })} />
                      </label>
                    </div>
                    <div className="form-actions">
                      <button className="form-save" type="submit">Saqlash</button>
                      <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                    </div>
                  </form>
                )}

                {selectedClass ? (
                  <div className="print-area">
                    <h2 style={{ textAlign: 'center', margin: '20px 0 5px' }}>
                      {getClassName(selectedClass)} — Haftalik dars jadvali
                    </h2>
                    <p style={{ textAlign: 'center', marginBottom: 15 }}>
                      MUHSIN TA'LIM MARKAZI
                    </p>

                    <div className="table-scroll">
                      <table className="weekly-table">
                        <thead>
                          <tr>
                            <th style={{ width: '14%' }}>Hafta kuni</th>
                            <th>Darslar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DAYS.map(day => {
                            const dayLessons = selectedClassLessons
                              .filter(item => item.day === day)
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))

                            return (
                              <tr key={day}>
                                <th>{day}</th>
                                <td>
                                  {dayLessons.length === 0 ? (
                                    <span style={{ color: '#98a2b3' }}>Dars belgilanmagan</span>
                                  ) : (
                                    dayLessons.map((lesson, index) => (
                                      <div className="lesson-card" key={lesson.id}>
                                        <strong>{index + 1}. {lesson.subject}</strong>
                                        <div>{lesson.startTime} – {lesson.endTime}</div>
                                        <div>O‘qituvchi: {getTeacherName(lesson.teacherId)}</div>
                                        <div className="lesson-actions no-print">
                                          <button onClick={() => editLesson(lesson)}>Tahrirlash</button>
                                          <button onClick={() => removeItem(setSchedules, lesson.id)}>O‘chirish</button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="empty-message">Jadvalni ko‘rish uchun sinfni tanlang</div>
                )}
              </>
            )}
          </section>
        )}

        {/* DAVOMAT */}
        {activePage === 'Davomat' && (
          <section className="panel">
            <div className="students-heading">
              <div><h2>Davomat</h2><p>O‘quvchilar davomatini qayd etish</p></div>
              <button className="add-student" onClick={openAddForm}>+ Davomat qo‘shish</button>
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveAttendance}>
                <div className="form-grid">
                  <label>O‘quvchi
                    <select required value={simpleForm.studentId} onChange={e => setSimpleForm({ ...simpleForm, studentId: e.target.value })}>
                      <option value="">Tanlang</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label>Sana
                    <input type="date" value={simpleForm.date} onChange={e => setSimpleForm({ ...simpleForm, date: e.target.value })} />
                  </label>
                  <label>Davomat holati
                    <select value={simpleForm.status} onChange={e => setSimpleForm({ ...simpleForm, status: e.target.value })}>
                      <option>Keldi</option><option>Kelmadi</option><option>Kechikdi</option>
                    </select>
                  </label>
                  <label>Izoh
                    <input value={simpleForm.note} onChange={e => setSimpleForm({ ...simpleForm, note: e.target.value })} />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>O‘quvchi</th><th>Sana</th><th>Holati</th><th>Izoh</th><th>Amal</th></tr></thead>
                <tbody>
                  {attendance.map(item => (
                    <tr key={item.id}>
                      <td>{getStudentName(item.studentId)}</td><td>{item.date}</td><td>{item.status}</td><td>{item.note}</td>
                      <td><button className="delete-btn" onClick={() => removeItem(setAttendance, item.id)}>O‘chirish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {attendance.length === 0 && <div className="empty-message">Davomat ma’lumotlari yo‘q</div>}
            </div>
          </section>
        )}

        {/* BAHOLAR */}
        {activePage === 'Baholar' && (
          <section className="panel">
            <div className="students-heading">
              <div><h2>Baholar</h2><p>O‘quvchilar bilimini baholash</p></div>
              <button className="add-student" onClick={openAddForm}>+ Baho qo‘shish</button>
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveGrade}>
                <div className="form-grid">
                  <label>O‘quvchi
                    <select required value={simpleForm.studentId} onChange={e => setSimpleForm({ ...simpleForm, studentId: e.target.value })}>
                      <option value="">Tanlang</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label>Fan
                    <input required value={simpleForm.subject} onChange={e => setSimpleForm({ ...simpleForm, subject: e.target.value })} />
                  </label>
                  <label>Baho
                    <input required type="number" min="1" max="100" value={simpleForm.grade} onChange={e => setSimpleForm({ ...simpleForm, grade: e.target.value })} />
                  </label>
                  <label>Sana
                    <input type="date" value={simpleForm.date} onChange={e => setSimpleForm({ ...simpleForm, date: e.target.value })} />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>O‘quvchi</th><th>Fan</th><th>Baho</th><th>Sana</th><th>Amal</th></tr></thead>
                <tbody>
                  {grades.map(item => (
                    <tr key={item.id}>
                      <td>{getStudentName(item.studentId)}</td><td>{item.subject}</td><td>{item.grade}</td><td>{item.date}</td>
                      <td><button className="delete-btn" onClick={() => removeItem(setGrades, item.id)}>O‘chirish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {grades.length === 0 && <div className="empty-message">Baholar kiritilmagan</div>}
            </div>
          </section>
        )}

        {/* TO'LOVLAR */}
        {activePage === 'To‘lovlar' && (
          <section className="panel">
            <div className="students-heading">
              <div><h2>To‘lovlar</h2><p>O‘quvchilar to‘lovlarini nazorat qilish</p></div>
              <button className="add-student" onClick={openAddForm}>+ To‘lov qo‘shish</button>
            </div>

            {showForm && (
              <form className="panel" onSubmit={savePayment}>
                <div className="form-grid">
                  <label>O‘quvchi
                    <select required value={simpleForm.studentId} onChange={e => setSimpleForm({ ...simpleForm, studentId: e.target.value })}>
                      <option value="">Tanlang</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label>To‘lov summasi
                    <input required value={simpleForm.amount} onChange={e => setSimpleForm({ ...simpleForm, amount: e.target.value })} placeholder="500 000" />
                  </label>
                  <label>Sana
                    <input type="date" value={simpleForm.date} onChange={e => setSimpleForm({ ...simpleForm, date: e.target.value })} />
                  </label>
                  <label>Izoh
                    <input value={simpleForm.note} onChange={e => setSimpleForm({ ...simpleForm, note: e.target.value })} />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>O‘quvchi</th><th>Summa</th><th>Sana</th><th>Izoh</th><th>Amal</th></tr></thead>
                <tbody>
                  {payments.map(item => (
                    <tr key={item.id}>
                      <td>{getStudentName(item.studentId)}</td><td>{item.amount}</td><td>{item.date}</td><td>{item.note}</td>
                      <td><button className="delete-btn" onClick={() => removeItem(setPayments, item.id)}>O‘chirish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && <div className="empty-message">To‘lovlar kiritilmagan</div>}
            </div>
          </section>
        )}

        {/* HISOBOTLAR */}
        {activePage === 'Hisobotlar' && (
          <section className="panel">
            <h2>Hisobotlar</h2>
            <p>Ta'lim markazining umumiy ko‘rsatkichlari</p>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-info"><span>Jami o‘quvchilar</span><div className="stat-number">{students.length}</div></div></div>
              <div className="stat-card"><div className="stat-info"><span>Jami o‘qituvchilar</span><div className="stat-number">{teachers.length}</div></div></div>
              <div className="stat-card"><div className="stat-info"><span>Jami sinflar</span><div className="stat-number">{classes.length}</div></div></div>
              <div className="stat-card"><div className="stat-info"><span>Davomat yozuvlari</span><div className="stat-number">{attendance.length}</div></div></div>
              <div className="stat-card"><div className="stat-info"><span>Baholar soni</span><div className="stat-number">{grades.length}</div></div></div>
              <div className="stat-card"><div className="stat-info"><span>To‘lovlar soni</span><div className="stat-number">{payments.length}</div></div></div>
            </div>
            <h3 style={{ marginTop: 25 }}>To‘lovlar hisoboti</h3>
            <p>Jami tushum: <strong>{payments.reduce((sum, item) => sum + (Number(String(item.amount).replace(/\s/g, '')) || 0), 0).toLocaleString('uz-UZ')}</strong></p>
            <button className="schedule-print" onClick={() => window.print()}>🖨 Hisobotni chop etish</button>
          </section>
        )}

        {/* OTA-ONALAR */}
        {activePage === 'Ota-onalar' && (
          <section className="panel">
            <div className="students-heading">
              <div><h2>Ota-onalar</h2><p>Ota-onalar va farzandlari ma’lumotlari</p></div>
              <button className="add-student" onClick={openAddForm}>+ Ota-ona qo‘shish</button>
            </div>

            {showForm && (
              <form className="panel" onSubmit={saveParent}>
                <div className="form-grid">
                  <label>Ota-ona ismi
                    <input required value={simpleForm.name} onChange={e => setSimpleForm({ ...simpleForm, name: e.target.value })} />
                  </label>
                  <label>Telefon
                    <input value={simpleForm.phone} onChange={e => setSimpleForm({ ...simpleForm, phone: e.target.value })} />
                  </label>
                  <label>Farzandi
                    <select value={simpleForm.studentId} onChange={e => setSimpleForm({ ...simpleForm, studentId: e.target.value })}>
                      <option value="">Tanlang</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button className="form-save">Saqlash</button>
                  <button className="form-cancel" type="button" onClick={resetForms}>Bekor qilish</button>
                </div>
              </form>
            )}

            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Ota-ona</th><th>Telefon</th><th>Farzandi</th><th>Amal</th></tr></thead>
                <tbody>
                  {parents.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td><td>{item.phone}</td><td>{getStudentName(item.studentId)}</td>
                      <td><button className="delete-btn" onClick={() => removeItem(setParents, item.id)}>O‘chirish</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parents.length === 0 && <div className="empty-message">Ota-onalar ma’lumotlari yo‘q</div>}
            </div>
          </section>
        )}

        <footer style={{ textAlign: 'center', padding: 25, color: '#8993a4' }}>
          © 2026 MUHSIN TA'LIM MARKAZI
        </footer>
      </main>
    </div>
  )
}

export default App







