-- SELECT product_id, json_agg(json_build_object('question_id',q.question_id,
--                                                                 'question_body', q.question_body,
--                                                                 'question_date', to_timestamp(question_date/1000)::timestamp,
--                                                                 'asker_name', q.asker_name,
--                                                                 'question_helpfulness', q.question_helpfulness,
--                                                                 'reported', q.reported,
--                                                                 'answers', (SELECT json_object_agg(id, json_build_object('id', id, 'body', body, 'date', to_timestamp(date/1000)::timestamp, 'answerer_name', answerer_name,
--                                                                 'helpfulness', helpfulness)) answers FROM answers a LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = 42370)
--                                                               )
--                                                             ) as results FROM questions q
--                                                             WHERE product_id = 42370 GROUP BY product_id;

-- SELECT json_agg(url) FROM photos p JOIN answers a ON a.id = p.answer_id JOIN WHERE a.id = 5

-- SELECT json_agg(url)
-- FROM photos p
-- LEFT JOIN answers a ON a.id = p.answer_id
-- LEFT JOIN questions q ON a.question_id = q.question_id
-- WHERE product_id = 42370
-- WHERE a.id = 5

-- SELECT * FROM answers a LEFT JOIN questions q ON a.question_id = q.question_id WHERE product_id = 42371;

-- const query2 = `SELECT * FROM photos as p JOIN answers as a ON a.id = p.answer_id WHERE a.id = $1`;

-- "psql -d qa -f test.sql"

