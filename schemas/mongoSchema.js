import mongoose from 'mongoose';
const { Schema } = mongoose;

// {
//   'product_id': int,
//   'questions': {
//     question_id: int,
//     question_body: string,
//     question_date: DATE,
//     asker_name: string,
//     reported: false,
//     answers: {
//       id: int,
//       body: string,
//       date: DATE,
//       answerer_name: string,
//       helpfulness: int,
//       photos: {
//         id: int,
//         url: string
//       }
//     }
//   }
// }