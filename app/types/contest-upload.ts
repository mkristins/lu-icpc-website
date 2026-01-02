interface Member{
  contestantId?: number;
  name: string;
}

export interface UploadTeamData{
  rank: number;
  participantId: number;
  teamName: string;
  member1: Member;
  member2: Member;
  member3: Member;
  teamId?: number;
  solvedProblems: number;
  penalty: number;
};

export interface UploadSubmissionData{
  participantId: number;
  submissionTime: number;
  problemIndex: string;
  isVerdictOk: boolean;
}

export interface TeamSelect{
    id: number;
    name: string;
    members: {
        contestant: {
            id: number;
            name: string | null;
        };
    }[]
}

export interface ContestantSelect{
  id: number;
  name: string;
}

export interface MemberInfo{
    id?: number,
    name: string
}

export interface TeamInfo{
    contextId: number,
    teamId?: number,
    name: string,
    member1: MemberInfo,
    member2: MemberInfo,
    member3: MemberInfo
    rank: number,
    points: number,
    penalty: number,
    medalIndex: number
}