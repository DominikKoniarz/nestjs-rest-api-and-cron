import { Controller, Get } from '@nestjs/common';
import { DiskService } from './disk.service';

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
}
