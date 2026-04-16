import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get('by-course')
  findByCourse(@Query('courseId') courseId: string) {
    return this.groupsService.findByCourse(Number(courseId));
  }

  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(Number(id));
  }
}
