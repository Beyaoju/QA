const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');
const app = express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/fec2/hr-lax/', router);

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});

