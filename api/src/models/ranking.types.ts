

export interface RankUserRequest {
    email: string;
  }
  
  export interface RankUserResponse {
    position: number;
  }
  
  export interface RankedUser {
    name: string;
    email: string;
    score: number;
  }
  
  export interface GlobalRankResponse {
    users: RankedUser[];
  }
  