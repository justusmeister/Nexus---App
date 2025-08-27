import axios from "axios";
import teachersData from "../assets/teachersData";
import subjectsData from "../assets/subjectsData";

// Zeiten als Zahlen, keine Strings
const lessonStartTime = [
    750,  // 07:50
    835,  // 08:35
    940,  // 09:40
    1025, // 10:25
    1130, // 11:30
    1220, // 12:15
    1315, // 13:15
    1400, // 14:00
    1455, // 14:55
    1540, // 15:40
];

const lessonEndTime = [
    835,
    920,
    1025,
    1110,
    1215,
    1305,
    1400,
    1445,
    1540,
    1620,
]

const BASE_URL = "https://nessa.webuntis.com/WebUntis/jsonrpc.do?school=Ursulaschule+Osnabrueck";
const USERNAME = "urs";
const PASSWORD = "Oso7o52o25!";
const CLIENT = "WebUntis";

let sessionId = null;

const getWeekRange = (offset = 0) => {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff + offset * 7);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const format = (d) =>
        `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

    return {
        startDate: format(monday),
        endDate: format(friday),
    };
};

const getSession = async () => {
    if (sessionId) return sessionId;

    try {
        const res = await axios.post(BASE_URL, {
            id: 1,
            method: "authenticate",
            params: {
                user: USERNAME,
                password: PASSWORD,
                client: CLIENT,
            },
            jsonrpc: "2.0",
        });

        sessionId = res.data.result.sessionId;
        //console.log("✅ Login erfolgreich!");
        return sessionId;
    } catch (err) {
        console.log("❌ Login fehlgeschlagen:", err);
        return null;
    }
};

const getRooms = async () => {
    try {
        const res = await axios.post(
            BASE_URL,
            {
                id: 2,
                method: "getRooms",
                params: {},
                jsonrpc: "2.0",
            },
            {
                headers: { Cookie: `JSESSIONID=${sessionId}` },
            }
        );

        const roomMap = {};
        res.data.result.forEach((room) => {
            roomMap[room.id] = room.name;
        });
        return roomMap;
    } catch (err) {
        console.log("❌ Raumdaten-Fehler:", err);
        return {};
    }
};

const getLehrerName = (id) => {
    const lehrer = teachersData.find((t) => t.id === id);
    return lehrer ? lehrer.kuerzel : `${id}`;
};

const getFachNameById = (id) => {
    const fachObj = subjectsData.find((f) => f.id === id);
    return fachObj ? fachObj.fach : id || "unbekannt";
};

const formatLessons = (lessonsRaw, roomMap) => {
    const days = Array(5).fill(null).map(() => ({ stunden: [] }));

    // Kopie erstellen, um nicht während des Loops zu verändern
    const expandedLessons = [];

    lessonsRaw.forEach((lesson) => {
        // Unverändert zur weiteren Verarbeitung
        expandedLessons.push(lesson);

        // Nur erweitern, wenn es eine Vertretung ist und endTime existiert
        const isIrregular = lesson.code && lesson.code === "irregular";
        const startIndex = lessonStartTime.indexOf(lesson.startTime);
        const endIndex = lessonEndTime.indexOf(lesson.endTime);

        if (isIrregular && startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            for (let i = startIndex + 1; i <= endIndex; i++) {
                // Kopie der Lesson für jede weitere Stunde
                expandedLessons.push({
                    ...lesson,
                    startTime: lessonStartTime[i],
                });
            }
        }
    });

    // Jetzt ganz normal durch die erweiterten Lessons iterieren
    expandedLessons.forEach((lesson) => {
        const dateStr = lesson.date.toString();
        const year = parseInt(dateStr.slice(0, 4));
        const month = parseInt(dateStr.slice(4, 6)) - 1;
        const day = parseInt(dateStr.slice(6, 8));
        const lessonDate = new Date(year, month, day);
        const dayIndex = lessonDate.getDay() - 1;

        if (dayIndex < 0 || dayIndex >= 5) return;

        const startHourIndex = lessonStartTime.indexOf(lesson.startTime);
        if (startHourIndex === -1) return;

        const fachId = lesson.su?.[0]?.id;
        const fachName = getFachNameById(fachId);
        const lehrer = getLehrerName(lesson.te?.[0]?.id);
        const raum = roomMap[lesson.ro?.[0]?.id] || "—";

        let status = "normal";
        if (lesson.code === "cancelled") {
            status = "cancelled";
        } else if (lesson.code && lesson.code !== "regular") {
            status = "vertretung";
        }

        const eintrag = {
            fach: fachName,
            raum,
            lehrer,
            status,
        };

        const stundenArray = days[dayIndex].stunden;

        while (stundenArray.length <= startHourIndex) {
            stundenArray.push(null);
        }

        if (!stundenArray[startHourIndex]) {
            stundenArray[startHourIndex] = [];
        }

        stundenArray[startHourIndex].push(eintrag);
    });

    for (let i = 0; i < 5; i++) {
        const stunden = days[i].stunden;
        const hasContent = stunden.some((s) => s !== null);
        if (!hasContent) {
            days[i].stunden = [null];
        }
    }

    return days;
};


const printStundenProTag = (days) => {
    days.forEach((day, i) => {
        console.log(`Tag ${i + 1} (${["Mo", "Di", "Mi", "Do", "Fr"][i]}): ${day.stunden.length} Stunden`);
    });
};

export const getFullWeekPlan = async () => {
    const session = await getSession();
    if (!session) return [];

    const roomMap = await getRooms();

    const weeks = [getWeekRange(0), getWeekRange(1), getWeekRange(2)];

    const allLessons = [];

    for (const { startDate, endDate } of weeks) {
        const response = await axios.post(
            BASE_URL,
            {
                id: 3,
                method: "getTimetable",
                params: {
                    options: {
                        element: {
                            id: 1676, // 👈 Deine Schüler-ID anpassen!
                            type: 5,  // 5 = Schüler
                        },
                        startDate,
                        endDate,
                        showBooking: true,
                    },
                },
                jsonrpc: "2.0",
            },
            {
                headers: { Cookie: `JSESSIONID=${session}` },
            }
        );

        const lessons = response.data.result || [];
         console.log(JSON.stringify(lessons, null, 2));
        const formattedDays = formatLessons(lessons, roomMap);
        printStundenProTag(formattedDays);

        allLessons.push(formattedDays);
    }

    return allLessons;
};

