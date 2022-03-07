const express = require('express');
const db = require('./db');
const router = express.Router();

/********************************************************* GET REQUESTS ********************************************************/

router.get('/qa/questions/:product_id', (req, res) => {
  const { page = 1, count = 5 } = req.query;
  const { product_id } = req.params;
  const query1 = `SELECT product_id, coalesce(json_agg(json_build_object(
    'question_id',q.question_id,
    'question_body', q.question_body,
    'question_date', to_timestamp(question_date/1000)::timestamp,
    'asker_name', q.asker_name,
    'question_helpfulness', q.question_helpfulness,
    'reported', q.reported,
    'answers', (SELECT coalesce(json_object_agg(id, json_build_object('id', id, 'body', body, 'date', to_timestamp(date/1000)::timestamp, 'answerer_name', answerer_name,
    'helpfulness', helpfulness, 'photos', (SELECT coalesce(json_agg(url), '[]'::json) photos FROM photos p LEFT JOIN answers a ON a.id = p.answer_id LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = $1))), '[]'::json) answers FROM answers a LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = $1)
    )
    ), '[]'::json) as results FROM questions q
    WHERE product_id = $1 AND q.reported = false GROUP BY product_id LIMIT $2`;

  const queryArgs = [product_id, count]

  db.query(query1, queryArgs)
    .then(response => {
      response = response.rows[0] ? response.rows[0] : { 'product_id': product_id, 'results': []};
      res.send(response);
    })
    .catch(err => res.status(400).send(err))

})

router.get('/qa/questions/:question_id/answers', (req, res) => {
  const { page = 1, count = 5 } = req.query;
  const { question_id } = req.params;
  const query5 = `SELECT json_build_object(
    'question', a.question_id,
    'page', $2::json,
    'count', $3::INTEGER,
    'results', json_agg(json_build_object(
      'answer_id', a.id,
      'body', a.body,
      'date', to_timestamp(date/1000)::timestamp,
      'answerer_name', answerer_name,
      'helpfulness', helpfulness,
      'photos', (SELECT coalesce(json_agg(json_build_object('id', photo_id, 'url', url)), '[]'::json) photos FROM photos p LEFT JOIN answers a ON a.id = p.answer_id LEFT JOIN questions q ON a.question_id = q.question_id WHERE q.question_id = $1)
      ))) FROM answers a WHERE a.question_id = $1 AND a.reported = false GROUP BY a.question_id LIMIT $3`

  const queryArgs = [question_id, page, count];

  db.query(query5, queryArgs)
    .then(response => {
      response = response.rows[0] ? response.rows[0] : {json_build_object: { 'question': question_id, 'page': page, 'count': count, 'results': []}};
      res.send(response.json_build_object);
    })
    .catch(err => res.status(400).send(err))
})

/********************************************************* POST REQUESTS ********************************************************/

router.post('/qa/questions', (req, res) => {
  const { product_id, body, name, email } = req.body;
  const query = 'INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email) VALUES ($1, $2, $3, $4, $5)';
  const queryArgs= [product_id, body, Date.now(), name, email];

  db.query(query, queryArgs)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(err))
})

router.post('/qa/questions/:question_id/answers', (req, res) => {
  const { product_id, body, name, email, photos } = req.body;
  const { question_id } = req.params;

  if (!photos) {
    const query = 'INSERT INTO answers (question_id, body, date, answerer_name, answerer_email) VALUES ($1, $2, $3, $4, $5)';
    const queryArgs= [question_id, body, Date.now(), name, email];

    db.query(query, queryArgs)
      .then(response => res.status(201).send(response))
      .catch(err => res.status(400).send(err))

  } else {
    const query = 'INSERT INTO answers (question_id, body, date, answerer_name, answerer_email) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const queryArgs = [question_id, body, Date.now(), name, email];
    db.query(query, queryArgs, async (err, response) => {
      if (err) {
        res.send(err.stack);
      } else {
        const { id } = response.rows[0];
        const photos_query = 'INSERT INTO photos (answer_id, url) VALUES ($1, $2)';

        const promisePhotos = [];

        photos.forEach(photo => {
          const photos_args = [id, photo];
          let func = db.query(photos_query, photos_args)
            .then(data => data);
            promisePhotos.push(func);
        })
        let bunchOfPhotos = await Promise.all(promisePhotos);
        res.send(bunchOfPhotos);
      }
    })
  }
})

/********************************************************* PUT REQUESTS ********************************************************/

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  const query = 'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1';
  const queryArgs = [question_id];

  db.query(query, queryArgs)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(err))
})

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  const query = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1';
  const queryArgs = [answer_id];

  db.query(query, queryArgs)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(err))
})

router.put('/qa/questions/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  const query = 'UPDATE questions SET reported = NOT reported WHERE question_id = $1';
  const queryArgs = [question_id];

  db.query(query, queryArgs)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(err))
})

router.put('/qa/answers/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  const query = 'UPDATE answers SET reported = NOT reported WHERE id = $1';
  const queryArgs = [answer_id];

  db.query(query, queryArgs)
    .then(response => res.status(201).send(response))
    .catch(err => res.status(400).send(err))
})


module.exports = router;


/*************************** QUERY GRAVEYARD ******************************
 *
 *
 *
 *
 *
   const query = 'SELECT * FROM questions WHERE product_id=$1';
   const query3 = `SELECT coalesce(json_object_agg(id, json_build_object('id', id, 'body', body, 'date', to_timestamp(date/1000)::timestamp, 'answerer_name', answerer_name,
   'helpfulness', helpfulness)), '[]'::json) answers FROM answers a LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = $1`
   const query2 = `SELECT coalesce(json_agg(url), '[]'::json) photos FROM photos p LEFT JOIN answers a ON a.id = p.answer_id LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = $1`

   TIME
   SELECT to_char (to_timestamp(question_date/1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') from questions where question_id = 1;
 *
 *
 *
 *
  const query = 'SELECT * FROM answers WHERE question_id=$1';
  const query1 = `SELECT * FROM answers as a LEFT JOIN questions as q ON q.question_id = a.question_id WHERE a.question_id = $1`;
  const query2 = `EXPLAIN ANALYZE SELECT * FROM photos as p JOIN answers as a ON a.id = p.answer_id WHERE a.id = $1`;
  const query3 = `SELECT a.question_id, json_agg(json_build_object(
      'answer_id', a.id,
      'body', a.body,
      'date', to_timestamp(date/1000)::timestamp,
      'answerer_name', answerer_name,
      'helpfulness', helpfulness,
      'photos', (SELECT coalesce(json_agg(json_build_object('id', photo_id, 'url', url)), '[]'::json) photos FROM photos p LEFT JOIN answers a ON a.id = p.answer_id LEFT JOIN questions q ON a.question_id = q.question_id WHERE q.question_id = $1))) results FROM answers a WHERE a.question_id = $1 and a.reported = false GROUP BY a.question_id`
  const query4 = `SELECT coalesce(json_agg(json_build_object('id', photo_id, 'url', url)), '[]'::json) photos FROM photos p LEFT JOIN answers a ON a.id = p.answer_id LEFT JOIN questions q ON a.question_id = q.question_id WHERE q.question_id = $1`;
 *
 *
 *
 * *************************************************************************/