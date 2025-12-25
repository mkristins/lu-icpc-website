interface Member{
  contestantId?: number;
  name: string;
}

export interface UploadTeamData{
  rank: number,
  participantId: number,
  teamName: string,
  member1: Member,
  member2: Member,
  member3: Member,
  teamId: number | null,
  solvedProblems: number,
  penalty: number
};