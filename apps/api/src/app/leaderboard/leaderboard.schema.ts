import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Leaderboard extends Document {
  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  date: string;
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
