-- loads data from CSV files into the db

\set localpath `pwd`'/db/data/questions.csv'
COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

\set localpath `pwd`'/db/data/answers.csv'
COPY answers(id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

\set localpath `pwd`'/db/data/answers_photos.csv'
COPY photos(photo_id, answer_id, url)
FROM :'localpath'
DELIMITER ','
CSV HEADER;

-- Add foreign keys

ALTER TABLE answers
  ADD CONSTRAINT fk_question_id FOREIGN KEY (question_id) REFERENCES questions (question_id);

ALTER TABLE photos
  ADD CONSTRAINT fk_answer_id FOREIGN KEY (answer_id) REFERENCES answers (id);

-- creates indexes to decrease lookup time

CREATE INDEX idx_product_id ON questions(product_id);
CREATE INDEX idx_answer_id ON answers(question_id);
CREATE INDEX idx_photo_id ON photos(answer_id);

-- prevent primary keys from breaking sequence

SELECT setval(pg_get_serial_sequence('questions', 'question_id'), (SELECT MAX(question_id) FROM questions)+1);
SELECT setval(pg_get_serial_sequence('answers', 'id'), (SELECT MAX(id) FROM answers)+1);
SELECT setval(pg_get_serial_sequence('photos', 'photo_id'), (SELECT MAX(photo_id) FROM photos)+1);

-- psql -d qa -f db/loader.sql