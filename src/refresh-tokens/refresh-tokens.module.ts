import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
