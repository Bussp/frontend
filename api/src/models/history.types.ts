
export interface HistoryRequest {
    email: string;
  }
  
  export interface TripHistoryItem {
    date: string; // ISO datetime
    score: number;
  }
  
  export interface HistoryResponse {
    trips: TripHistoryItem[];
  }
  