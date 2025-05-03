// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// function toGMT(date) {
//   let today = date;
//   return new Date(today.setHours(today.getHours() + 3));
// }

// async function getTimeTable() {
//   const ClassRooms = [
//     {
//       roomName: '621-б',
//       roomId: 210737156,
//     },
//     {
//       roomName: '623-а',
//       roomId: 228802167,
//     },
//     {
//       roomName: '1-355',
//       roomId: 198310464,
//     },
//     {
//       roomName: '8-606',
//       roomId: 198338254,
//     },
//     {
//       roomName: '8-319',
//       roomId: 197814710,
//     },
//     {
//       roomName: '8-305',
//       roomId: 198339551,
//     },
//     {
//       roomName: '8-321',
//       roomId: 197814690,
//     },
//     {
//       roomName: '1-458',
//       roomId: 199713942,
//     },
//     {
//       roomName: '1-343',
//       roomId: 198310463,
//     },
//   ];

//   function getNextMonday(date = new Date()) {
//     const dateCopy = new Date(date.getTime());

//     const nextMonday = new Date(
//       dateCopy.setDate(
//         dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7)
//       )
//     );

//     return nextMonday;
//   }

//   function getDates() {
//     let dates = [];
//     dates.push(new Intl.DateTimeFormat('lt').format(new Date()));
//     dates.push(new Intl.DateTimeFormat('lt').format(getNextMonday()));
//     dates.push(
//       new Intl.DateTimeFormat('lt').format(getNextMonday(getNextMonday()))
//     );
//     return dates;
//   }

//   const dates = getDates();

//   for (let day of dates) {
//     for (let room of ClassRooms) {
//       const resp = await (
//         await fetch(
//           `https://edu.donstu.ru/api/Rasp?idAudLine=${room.roomId}&sdate=${day}`
//         )
//       ).json();

//       for (let para of resp.data.rasp) {
//         console.log(para.аудитория);
//         const lesson = await prisma.timetable.findFirst({
//           where: {
//             date: new Date(para.дата),
//             numberLesson: Number(para.номерЗанятия),
//             classroom: para.аудитория,
//           },
//         });

//         console.log(lesson);

//         if (lesson) {
//           await prisma.timetable.update({
//             where: {
//               id: lesson.id,
//               booked: 0,
//             },
//             data: {
//               classroom: para.аудитория,
//               numberLesson: Number(para.номерЗанятия),
//               weekDay: Number(para.деньНедели),
//               classroom: para.аудитория,
//               discipline: para.дисциплина,
//               group: para.группа,
//               teacher: para.преподаватель,
//               date: toGMT(new Date(para.дата)),
//             },
//           });
//         } else {
//           await prisma.timetable.create({
//             data: {
//               classroom: para.аудитория,
//               numberLesson: Number(para.номерЗанятия),
//               weekDay: Number(para.деньНедели),
//               classroom: para.аудитория,
//               discipline: para.дисциплина,
//               group: para.группа,
//               teacher: para.преподаватель,
//               date: toGMT(new Date(para.дата)),
//             },
//           });
//         }
//       }
//     }
//   }

//   const timetableData = await prisma.timetable.findMany();
// }

// getTimeTable();
