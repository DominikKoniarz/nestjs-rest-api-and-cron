import { Injectable } from '@nestjs/common';
import { promises as fsp } from 'fs';
import * as path from 'path';

@Injectable()
export class DiskService {
  private cwdPath = path.join(process.cwd());
  private uploadsPath = path.join(this.cwdPath, 'uploads');

  async listCwd() {
    const things = await fsp.readdir(this.cwdPath);

    return things;
  }

  async listUploads() {
    const things = await fsp.readdir(this.uploadsPath);

    const data = `${new Date().toISOString()}`;

    await fsp.writeFile(path.join(this.uploadsPath, 'log.txt'), data);

    return things;
  }

  async listUploadsLog() {
    const log = await fsp.readFile(
      path.join(this.uploadsPath, 'log.txt'),
      'utf-8',
    );

    return log;
  }
}
