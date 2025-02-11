import { WebUntis } from "webuntis";

const untis = new WebUntis(
  "ursusaschule",
  "justus.meister",
  "u.g.i!JM08",
  "nessa.webuntis.com"
);

await untis.login();
const timetable = await untis.getOwnTimetableForToday();

console.log(timetable);
