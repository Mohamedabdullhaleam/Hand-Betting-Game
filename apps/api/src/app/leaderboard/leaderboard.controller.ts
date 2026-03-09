import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardEntryDto } from './create-leaderboard-entry.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getTopScores(@Query('limit') limit?: string) {
    return this.leaderboardService.getTopScores(
      limit ? parseInt(limit, 10) : 5
    );
  }

  @Post()
  create(@Body() dto: CreateLeaderboardEntryDto) {
    return this.leaderboardService.create(dto);
  }
}
