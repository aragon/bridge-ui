export interface IpfsProposal {
  address: string;
  msg: string;
  sig: string;
  version: number;
}

export interface TaggedProposal {
  address: string;
  msg: Msg;
  sig: string;
  version: number;
  tags: string[];
  hash: string;
}

export interface Msg {
  version: string;
  timestamp: string;
  space: string;
  type: string;
  payload: ProposalPayload | VotePayload;
}

export interface ProposalPayload {
  end: number;
  body: string;
  name: string;
  start: number;
  choices: string[];
  metadata: Metadata;
  snapshot: number;
}

export interface VotePayload {
  choice: number;
  metadata: Metadata;
  proposal: string;
}

export interface Metadata {
  strategies: Strategy[];
}

export interface Strategy {
  name: string;
  params: Params;
}

export interface Params {
  symbol: string;
  address: string;
  decimals?: number;
}
