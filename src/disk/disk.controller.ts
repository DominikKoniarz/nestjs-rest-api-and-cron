import { Controller, Get } from '@nestjs/common';
import { DiskService } from './disk.service';

// Only in purpose of playing with docker volumes
@Controller('disk')
export class DiskController {
  constructor(private diskService: DiskService) {}

  @Get('/')
  async getAllInCwd() {
    const things = await this.diskService.listCwd();

    return {
      things,
    };
  }

  @Get('/uploads')
  async getAllInUploads() {
    const things = await this.diskService.listUploads();

    return {
      things,
    };
  }

  @Get('/uploads/log')
  async getUploadsLog() {
    const log = await this.diskService.listUploadsLog();

    return {
      log,
    };
  }
}
