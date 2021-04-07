import Long from "long";

export interface Token {
  id: import("@hashgraph/sdk").TokenId;
  balance: Long;
  decimals: number;
}