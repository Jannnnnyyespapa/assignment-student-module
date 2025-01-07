import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('new')
  @Render('new-student')
  newStudentForm() {
    return {};
  }

  @Get('view')
  @Render('students')
  async getStudentView() {
    const students = await this.appService.getAllStudents();
    return { students };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.appService.createStudent(createStudentDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Student created successfully',
      data: student
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllStudents() {
    const students = await this.appService.getAllStudents();
    return {
      status: HttpStatus.OK,
      data: students
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getStudentById(@Param('id') id: number) {
    const student = await this.appService.getStudentById(id);
    return {
      status: HttpStatus.OK,
      data: student
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateStudent(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.appService.updateStudent(id, updateStudentDto);
    return {
      status: HttpStatus.OK,
      message: 'Student updated successfully',
      data: student
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: number) {
    await this.appService.deleteStudent(id);
    return {
      status: HttpStatus.OK,
      message: 'Student deleted successfully'
    };
  }
}