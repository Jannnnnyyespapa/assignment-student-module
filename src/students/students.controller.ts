import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Response } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('view')
  async getStudentView(@Res() res: Response) {
    const students = await this.studentsService.getAllStudents();
    res.setHeader('Content-Type', 'text/html');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Student Module</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
          
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Student Module</h1>
                  <a href="/students/new" class="add-button">
                      <i class="fas fa-plus"></i> Add New Student
                  </a>
              </div>
              <div class="student-grid">
                  ${students.length ? students.map((student, index) => `
                      <div class="student-card" data-id="${student.id}" style="animation-delay: ${index * 0.1}s">
                          <div class="student-name">${student.firstName} ${student.lastName}</div>
                          <div class="student-info">
                              <i class="fas fa-envelope"></i>
                              ${student.email}
                          </div>
                          <div class="student-info">
                              <i class="fas fa-calendar-alt"></i>
                              Enrolled: ${new Date(student.enrollmentDate).toLocaleDateString()}
                          </div>
                          <div class="student-info">
                              <i class="fas fa-clock"></i>
                              Created: ${new Date(student.createdAt).toLocaleString()}
                          </div>
                          <div class="student-info">
                              <i class="fas fa-edit"></i>
                              Updated: ${new Date(student.updatedAt).toLocaleString()}
                          </div>
                          <div class="button-group">
                              <a href="/students/edit/${student.id}" class="edit-button">
                                  <i class="fas fa-pencil-alt"></i> Edit
                              </a>
                              <button onclick="deleteStudent(${student.id})" class="delete-button">
                                  <i class="fas fa-trash-alt"></i> Delete
                              </button>
                          </div>
                      </div>
                  `).join('') : `
                      <div class="empty-state">
                          <h2>No students found</h2>
                          <p>Add your first student to get started</p>
                      </div>
                  `}
              </div>
          </div>
          <script>
              function showNotification(message, type = 'success') {
                  const notification = document.createElement('div');
                  notification.className = 'notification';
                  notification.innerHTML = \`
                      <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                      \${message}
                  \`;
                  document.body.appendChild(notification);
                  
                  setTimeout(() => {
                      notification.addEventListener('animationend', function(e) {
                          if (e.animationName === 'fadeOut') {
                              notification.remove();
                          }
                      });
                  }, 3000);
              }

              function deleteStudent(id) {
                  if (confirm('Are you sure you want to delete this student?')) {
                      const card = document.querySelector(\`[data-id="\${id}"]\`);
                      
                      fetch('/students/' + id, {
                          method: 'DELETE',
                      })
                      .then(response => response.json())
                      .then(data => {
                          if (card) {
                              showNotification('Student deleted successfully!');
                              card.style.opacity = '0';
                              card.style.transform = 'scale(0.9)';
                              card.style.transition = 'all 0.3s ease';
                              
                              setTimeout(() => {
                                  card.remove();
                                  // Check if there are no more students
                                  const remainingCards = document.querySelectorAll('.student-card');
                                  if (remainingCards.length === 0) {
                                      const grid = document.querySelector('.student-grid');
                                      grid.innerHTML = \`
                                          <div class="empty-state">
                                              <h2>No students found</h2>
                                              <p>Add your first student to get started</p>
                                          </div>
                                      \`;
                                  }
                              }, 300);
                          }
                      })
                      .catch(error => {
                          showNotification('Error deleting student', 'error');
                          console.error('Error:', error);
                      });
                  }
              }
          </script>
      </body>
      </html>
    `;
    res.send(html);
  }

  @Get('new')
  newStudentForm(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Add New Student</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
          
          <script>
              function showNotification(message, type = 'success') {
                  const notification = document.createElement('div');
                  notification.className = 'notification ' + (type === 'error' ? 'error' : '');
                  notification.innerHTML = \`
                      <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                      \${message}
                  \`;
                  document.body.appendChild(notification);
                  
                  setTimeout(() => {
                      notification.addEventListener('animationend', function(e) {
                          if (e.animationName === 'fadeOut') {
                              notification.remove();
                          }
                      });
                  }, 3000);
              }

              function createStudent(event) {
                  event.preventDefault();
                  
                  const formData = {
                      firstName: document.getElementById('firstName').value,
                      lastName: document.getElementById('lastName').value,
                      email: document.getElementById('email').value,
                      enrollmentDate: document.getElementById('enrollmentDate').value
                  };

                  fetch('/students', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(formData)
                  })
                  .then(response => response.json())
                  .then(data => {
                      showNotification('Student created successfully!');
                      setTimeout(() => {
                          window.location.href = '/students/view';
                      }, 2000);
                  })
                  .catch(error => {
                      showNotification('Error creating student', 'error');
                      console.error('Error:', error);
                  });

                  return false;
              }
          </script>
      </head>
      <body>
          <div class="container">
              <h1><i class="fas fa-user-plus"></i> Add New Student</h1>
              <form onsubmit="return createStudent(event)">
                  <div class="form-group">
                      <label for="firstName">First Name</label>
                      <div class="input-icon">
                          <i class="fas fa-user"></i>
                          <input type="text" id="firstName" name="firstName" required placeholder="Enter first name">
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="lastName">Last Name</label>
                      <div class="input-icon">
                          <i class="fas fa-user"></i>
                          <input type="text" id="lastName" name="lastName" required placeholder="Enter last name">
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="email">Email Address</label>
                      <div class="input-icon">
                          <i class="fas fa-envelope"></i>
                          <input type="email" id="email" name="email" required placeholder="Enter email address">
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="enrollmentDate">Enrollment Date</label>
                      <div class="input-icon">
                          <i class="fas fa-calendar"></i>
                          <input type="date" id="enrollmentDate" name="enrollmentDate" required>
                      </div>
                  </div>
                  <div class="button-group">
                      <a href="/students/view" class="back-button">
                          <i class="fas fa-arrow-left"></i> Back
                      </a>
                      <button type="submit">
                          <i class="fas fa-save"></i> Save Student
                      </button>
                  </div>
              </form>
          </div>
      </body>
      </html>
    `;
    res.send(html);
  }

  // Branch: create-students
  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentsService.createStudent(createStudentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Student created successfully',
      data: student,
    };
  }

  // Branch: read-students
  @Get()
  async getAllStudents() {
    const students = await this.studentsService.getAllStudents();
    return {
      statusCode: HttpStatus.OK,
      data: students,
    };
  }

  @Get(':id')
  async getStudentById(@Param('id') id: number) {
    const student = await this.studentsService.getStudentById(id);
    return {
      statusCode: HttpStatus.OK,
      data: student,
    };
  }

 
} 