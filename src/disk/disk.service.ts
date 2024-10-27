import { Injectable } from '@nestjs/common';
import { promises as fsp } from 'fs';
import * as path from 'path';

@Injectable()
export class DiskService {
  private cwdPath = path.join(process.cwd());
  private uploadsPath = path.join(this.cwdPath, 'uploads');

  async listCwd() {
    const things = await fsp.readdir(this.cwdPath);
    console.log('things:', things);

    return things;
  }

  async listUploads() {
    const things = await fsp.readdir(this.uploadsPath);
    console.log('things:', things);

    const data = `${new Date().toISOString()}\n`;

    await fsp.appendFile(path.join(this.uploadsPath, 'log.txt'), data);

    return things;
  }
}
