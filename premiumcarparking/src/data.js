export default function getTime() {
  var d = new Date();
  const day_1 = d.getDate();
  let month_1 = d.getMonth();
  const year_1 = d.getFullYear();
  d.setDate(d.getDate() + 1);
  const day_2 = d.getDate();
  let month_2 = d.getMonth();
  const year_2 = d.getFullYear();
  d.setDate(d.getDate() + 1);
  const day_3 = d.getDate();
  let month_3 = d.getMonth();
  const year_3 = d.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  month_1 = monthNames[month_1];
  month_2 = monthNames[month_2];
  month_3 = monthNames[month_3];

  let date_1 = {
    day: day_1,
    month: month_1,
    year: year_1,
  };
  let date_2 = {
    day: day_2,
    month: month_2,
    year: year_2,
  };
  let date_3 = {
    day: day_3,
    month: month_3,
    year: year_3,
  };
  
  return [date_1, date_2, date_3];
}

// const dayAvailable = [
//     {
//         day : 17,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             },
//             {
//                 time: "15.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 18,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 19,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 20,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             },
//             {
//                 time: "15.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 21,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             },
//             {
//                 time: "15.00",
//                 status: "Available"
//             }
//             ,
//             {
//                 time: "16.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 22,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             },
//             {
//                 time: "15.00",
//                 status: "Available"
//             }
//             ,
//             {
//                 time: "16.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 23,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             },
//             {
//                 time: "15.00",
//                 status: "Available"
//             }
//             ,
//             {
//                 time: "16.00",
//                 status: "Available"
//             }
//             ,
//             {
//                 time: "19.00",
//                 status: "Available"
//             }
//             ,
//             {
//                 time: "22.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 24,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 25,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 26,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
//     {
//         day : 27,
//         month : 'Feb',
//         year : 2022,
//         allTime:[
//             {
//                 time: "9.00",
//                 status: "Available"
//             },
//             {
//                 time: "12.00",
//                 status: "Available"
//             }
//         ],
//     },
// ]

// export default dayAvailable;
