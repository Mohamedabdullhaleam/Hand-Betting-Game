import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leaderboard } from './leaderboard.schema';
import { CreateLeaderboardEntryDto } from './create-leaderboard-entry.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Leaderboard.name)
    private readonly leaderboardModel: Model<Leaderboard>
  ) {}

  async getTopScores(limit = 5): Promise<Leaderboard[]> {
    return this.leaderboardModel
      .find()
      .sort({ score: -1 })
      .limit(limit)
      .exec();
  }

  async create(dto: CreateLeaderboardEntryDto): Promise<Leaderboard> {
    return this.leaderboardModel.create(dto);
  }
}
