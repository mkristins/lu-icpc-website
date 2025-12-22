import { createHash } from "crypto";

function randomLetters(length = 6) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }

  return "abcdef";
}

export async function fetchCodeforcesData(apiKey : string, secret : string, contestId : string){
    console.log("Attempt to fetch data from Codeforces.")
    const unixSeconds: number = Math.floor(Date.now() / 1000)
    const rand = randomLetters(6)
    
    const statusStr = `${rand}/contest.status?apiKey=${apiKey}&contestId=${contestId}&time=${unixSeconds}#${secret}`
    const statusHash = createHash('sha512').update(statusStr).digest('hex');
    const contestStatusUrl = `${process.env.CODEFORCES_API_URL}/contest.status?apiKey=${apiKey}&contestId=${contestId}&time=${unixSeconds}&apiSig=${rand}${statusHash}`
    const contestSubmissions = await fetch(contestStatusUrl)
    const contestSubmissionData = await contestSubmissions.json()
   
    const resultsRand = randomLetters(6)
    const resultsStr = `${resultsRand}/contest.standings?apiKey=${apiKey}&contestId=${contestId}&count=100&showUnofficial=true&time=${unixSeconds}#${secret}`
    const resultsHash = createHash("sha512").update(resultsStr, "utf8").digest("hex");
    const contestResultsUrl = `${process.env.CODEFORCES_API_URL}/contest.standings?apiKey=${apiKey}&contestId=${contestId}&count=100&showUnofficial=true&time=${unixSeconds}&apiSig=${resultsRand}${resultsHash}`
    const contestResults = await fetch(contestResultsUrl)
    const contestResultData = await contestResults.json()

    return statusHash
}