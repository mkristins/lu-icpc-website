interface Problem{
  index: string;
}

interface Party{
  participantId: number
};

interface ResultsRow{
  rank: number;
  penalty: number;
  points: number;
  party: Party;
}

interface ResultsResponse{
  problems: Problem[];
  rows: ResultsRow[];
}

interface ResultResponse{
  result: ResultsResponse
}

interface Author{
    participantId: number
}

interface Submission{
  author: Author;
  relativeTimeSeconds: number;
  problem: Problem;
  verdict: string;
}

interface SubmissionsResponse{
  result: Submission[];
}

export interface CFAPIResponse{
  results: ResultResponse;
  submissions: SubmissionsResponse;
}