import type { User } from "./users.types";

/**
 * Response from GET /rank/user.
 */
export interface UserRankingResponse {
  position: number;
}

/**
 * Response from GET /rank/global.
 */
export interface GlobalRankingResponse {
  users: User[];
}
