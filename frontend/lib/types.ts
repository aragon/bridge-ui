import { ProcessContractParameters, ProcessMetadata } from "dvote-js";

export type TokenInfo = {
  name: string;
  symbol: string;
  address: string;
  totalSupply: string;
  decimals: number;
  balanceMappingPosition: number;
  icon: string;
  processes: string[];
};

export type ProcessInfo = {
  id: string;
  metadata: ProcessMetadata;
  parameters: ProcessContractParameters;
  tokenAddress: string;
};

export type ProposalCategories = {
  active: TaggedProposal[];
  closed: TaggedProposal[];
  pending: TaggedProposal[];
  all: TaggedProposal[];
};

export interface VoteResult {
  problem: TaggedProposal;
  percentage: number;
  balance: number;
}

export interface IpfsProposal {
  address: string;
  msg: string;
  sig: string;
  verison: number;
}

export interface TaggedProposal {
  address: string;
  msg: Msg;
  sig: string;
  version: number;
  tags: string[];
  hash: string;
}

export interface Proposal {
  address: string;
  msg: Msg;
  sig: string;
  verison: number;
}

export interface SnapshotData {
  address: string;
  msg: Msg;
  sig: string;
  authorIpfsHash: string;
  relayerIpfsHash: string;
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

export interface Project {
  name: string;
  network: string;
  symbol: string;
  skin: string;
  strategies: Strategy[];
  members: string[];
  filters: Filters;
}

export interface Filters {
  defaultTab: string;
  minScore: number;
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
