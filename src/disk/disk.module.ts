import { Module } from '@nestjs/common';
import { DiskController } from './disk.controller';
import { DiskService } from './disk.service';

@Module({
  controllers: [DiskController],
  providers: [DiskService]
})
export class DiskModule {}
