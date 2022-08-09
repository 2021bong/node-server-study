const users = [
  {
    profileImg: './img/default_profile.png',
    userId: 'justcode',
    desc: '> 저스트코드 | 부트캠프',
  },
  {
    profileImg: './img/default_profile.png',
    userId: 'justuser',
    desc: '걍 유저입니다',
  },
  {
    profileImg: './img/default_profile.png',
    userId: 'just_do_it!',
    desc: '나이키를 좋아합니다',
  },
  {
    profileImg: './img/default_profile.png',
    userId: 'happy2022',
    desc: '홍길동(hong gil dong)',
  },
  {
    profileImg: './img/bongprofile.png',
    userId: '2021bong',
    desc: '봉원희입니다',
  },
  {
    profileImg: './img/bongprofile.png',
    userId: 'bong_bong',
    desc: '봉보로봉봉',
  },
  {
    profileImg: './img/default_profile.png',
    userId: 'yahoho',
    desc: '',
  },
  {
    profileImg: './img/default_profile.png',
    userId: 'alkjgjlsgls',
    desc: '#f4f',
  },
  {
    profileImg: './img/heart_full.png',
    userId: '__._.__',
    desc: '2000.02.02',
  },
  {
    profileImg: './img/heart_full.png',
    userId: 'yewon_J',
    desc: 'justcode 6기',
  },
];

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'hi!' });
});
app.post('/signup', (req, res) => {
  const user = req.body.newuser;
  users.push(user);
  res.json({ message: 'signup success!' });
});

const server = http.createServer(app);

server.listen(8000, (req, res) => {
  console.log({ message: 'Listening to requests on port 8000' });
});
