import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Response } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}



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

  
} 