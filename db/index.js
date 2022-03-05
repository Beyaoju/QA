const { Pool } = require('pg');
const config = require('../config.js');

const pool = new Pool(config);

module.exports = pool;


/*
{
    "question": "573711",
    "page": 1,
    "count": "1000",
    "results": [
        {
            "answer_id": 5361269,
            "body": "testing adding an answer",
            "date": "2022-03-03T00:00:00.000Z",
            "answerer_name": "mystery",
            "helpfulness": 0,
            "photos": [
                {
                    "id": 4780089,
                    "url": "https://www.indiantrailanimalhospital.com/sites/default/files/interesting-cat-facts.jpg"
                }
            ]
        },
        {
            "answer_id": 5361112,
            "body": "this is comfortable!",
            "date": "2022-02-25T00:00:00.000Z",
            "answerer_name": "estevan",
            "helpfulness": 0,
            "photos": []
        },
        {
            "answer_id": 5361236,
            "body": "WERE IN THIS",
            "date": "2022-03-01T00:00:00.000Z",
            "answerer_name": "JIMBOSLICE420",
            "helpfulness": 0,
            "photos": [
                {
                    "id": 4780087,
                    "url": "https://imgur.com/gallery/1vLEYrO"
                }
            ]
        }
    ]
}
*/

/* {
  "product_id": "42372",
  "results": [
      {
          "question_id": 348485,
          "question_body": "What fabric is the top made of?",
          "question_date": "2019-08-18T00:00:00.000Z",
          "asker_name": "coolkid",
          "question_helpfulness": 17,
          "reported": false,
          "answers": {
              "3257764": {
                  "id": 3257764,
                  "body": "Suede",
                  "date": "2019-09-18T00:00:00.000Z",
                  "answerer_name": "warmkid",
                  "helpfulness": 0,
                  "photos": [
                      "https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1974&q=80"
                  ]
              },
              "3257776": {
                  "id": 3257776,
                  "body": "Its the best! Seriously magic fabric",
                  "date": "2019-09-18T00:00:00.000Z",
                  "answerer_name": "warmkid",
                  "helpfulness": 1,
                  "photos": []
              },
              "5269665": {
                  "id": 5269665,
                  "body": "lax48 is cool",
                  "date": "2022-01-07T00:00:00.000Z",
                  "answerer_name": "lax@cool.com",
                  "helpfulness": 0,
                  "photos": [
                      "http://res.cloudinary.com/dtnikmimx/image/upload/v1641575697/nbymdq0n6x4asfzo3gka.jpg"
                  ]
              },
              "5269670": {
                  "id": 5269670,
                  "body": "lax48 is great",
                  "date": "2022-01-07T00:00:00.000Z",
                  "answerer_name": "lax 48",
                  "helpfulness": 0,
                  "photos": [
                      "http://res.cloudinary.com/dtnikmimx/image/upload/v1641577208/r6vbqj4hriet77apied9.jpg"
                  ]
              },
              "5269678": {
                  "id": 5269678,
                  "body": "lax 48 is awesome",
                  "date": "2022-01-07T00:00:00.000Z",
                  "answerer_name": "lax 48",
                  "helpfulness": 0,
                  "photos": [
                      "http://res.cloudinary.com/dtnikmimx/image/upload/v1641578977/iyyvjavwbx1lyg8awso0.jpg"
                  ]
              }
          }
      },
      {
          "question_id": 348487,
          "question_body": "Why is this product cheaper here than other sites?",
          "question_date": "2019-02-04T00:00:00.000Z",
          "asker_name": "l33tgamer",
          "question_helpfulness": 8,
          "reported": false,
          "answers": {
              "3990171": {
                  "id": 3990171,
                  "body": "the shoes looks cheap!",
                  "date": "2021-09-23T00:00:00.000Z",
                  "answerer_name": "slaay",
                  "helpfulness": 2,
                  "photos": []
              }
          }
      },
      {
          "question_id": 563534,
          "question_body": "Are these worth it?",
          "question_date": "2022-01-07T00:00:00.000Z",
          "asker_name": "test",
          "question_helpfulness": 2,
          "reported": false,
          "answers": {
              "5269657": {
                  "id": 5269657,
                  "body": "Yes!",
                  "date": "2022-01-07T00:00:00.000Z",
                  "answerer_name": "seller",
                  "helpfulness": 1,
                  "photos": []
              }
          }
      },
      {
          "question_id": 563535,
          "question_body": "Test",
          "question_date": "2022-01-07T00:00:00.000Z",
          "asker_name": "test",
          "question_helpfulness": 1,
          "reported": false,
          "answers": {
              "5269659": {
                  "id": 5269659,
                  "body": "test",
                  "date": "2022-01-07T00:00:00.000Z",
                  "answerer_name": "test",
                  "helpfulness": 1,
                  "photos": [
                      "http://res.cloudinary.com/dtnikmimx/image/upload/v1641541035/wolwis1smi5c9fbptl6y.jpg"
                  ]
              }
          }
      },
      {
          "question_id": 573642,
          "question_body": "Very bad are you????",
          "question_date": "2022-02-24T00:00:00.000Z",
          "asker_name": "Sivaaaaa",
          "question_helpfulness": 0,
          "reported": false,
          "answers": {}
      }
  ]
} */