import { useState } from "react"
import type { UploadTeamData } from "~/types/contest-upload"
import type { UploadSubmissionData } from "~/types/contest-upload"

function parseQuotedOrBare(s: string): string {
    const t = s.trim();
    if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
    return t;
}

function splitCsvLike(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Handle doubled quotes inside quoted fields: "" -> "
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur.trim());
  return out.map(parseQuotedOrBare);
}

export default function DatLoader({onLoad} : {onLoad : (teamList : UploadTeamData[], submissions : UploadSubmissionData[], problems : string[]) => void}){
    function parseText(t : string){
        const lines = t
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
        let teams : UploadTeamData[] = []
        const teamProblemStatus = new Map<string, number>()
        const submissions : UploadSubmissionData[] = []
        const problems : string[] = []
        

        for(const line of lines){
            if(line.startsWith("@p ")){
                const fields = splitCsvLike(line.slice(3));
                problems.push(fields[0])
            }
            if(line.startsWith("@t ")){
                const fields = splitCsvLike(line.slice(3));
                const team : UploadTeamData = {
                    participantId: parseInt(fields[0]),
                    rank: 0,
                    solvedProblems: 0,
                    penalty: 0,
                    official: true,
                    teamName: fields[3],
                    member1: {name: ""},
                    member2: {name: ""},
                    member3: {name: ""}
                }
                teams.push(team)
            }
            if(line.startsWith("@s ")){
                const fields = splitCsvLike(line.slice(3));
                if(fields[4] != "CE"){
                    const currentKey = `${parseInt(fields[0])}${fields[1]}`
                    
                    if(teamProblemStatus.get(currentKey) == -1){
                        continue
                    }

                    const submission : UploadSubmissionData = {
                        participantId: parseInt(fields[0]),
                        problemIndex: fields[1],
                        submissionTime: Math.floor(parseInt(fields[3]) / 60),
                        isVerdictOk: fields[4] == "OK"
                    }

                    if(fields[4] == "OK"){
                        for(let t of teams){
                            if(t.participantId == submission.participantId){
                                t.solvedProblems += 1
                                t.penalty += (teamProblemStatus.get(currentKey) ?? 0) * 20
                                t.penalty += submission.submissionTime
                            }
                        }
                        teamProblemStatus.set(currentKey, -1)   
                    }
                    else{
                        teamProblemStatus.set(currentKey, (teamProblemStatus.get(currentKey) ?? 0) + 1)
                    }

                    submissions.push(submission)
                }
            }
        }
        teams.sort((a, b) => {
            if(a.solvedProblems == b.solvedProblems){
                return a.penalty - b.penalty
            }
            else{
                return b.solvedProblems - a.solvedProblems
            }
        })
        let rank = 0
        for(let t of teams){
            rank ++ 
            t.rank = rank
        }
        onLoad(teams, submissions, problems)
    }
    const [text, setText] = useState("")
    return <div className="flex flex-col">
        <div className="font-bold text-2xl">Sacensību DAT fails</div>
        <div className=""></div>
        <textarea
            className="border w-[1000px] rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => parseText(text)} className="border bg-slate-900 hover:bg-slate-800 w-48 h-10 rounded-xl text-white text-sm m-2">
            Ielādēt!
        </button>
    </div>
}