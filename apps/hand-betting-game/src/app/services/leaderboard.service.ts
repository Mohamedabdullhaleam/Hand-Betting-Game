import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaderboardEntry } from '@hand-betting-game/shared-types';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private http = inject(HttpClient);

  getTopScores(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${API_BASE}/leaderboard`);
  }

  saveScore(entry: Omit<LeaderboardEntry, '_id'>): Observable<LeaderboardEntry> {
    return this.http.post<LeaderboardEntry>(`${API_BASE}/leaderboard`, entry);
  }
}
