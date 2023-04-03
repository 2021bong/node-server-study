const users = [{ profileImg: 'link', userId: 1, desc: 'user1' }];
const feeds = [
  {
    userName: 'user1',
    imageSrc: 'link',
    imgAlt: 'img alt',
    content: 'post text',
    createdTime: new Date(),
  },
];

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'hi!' });
});

// 회원 가입
app.post('/user/signup', (req, res) => {
  try {
    const { profileImg, userId, desc } = req.body.newuser;
    users.push({
      profileImg,
      userId,
      desc,
    });
    return res.status(200).json({ message: 'signup success!' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// 포스트 작성
app.post('/post', (req, res) => {
  try {
    const { userName, imageSrc, imgAlt, content, createdTime } =
      req.body.newfeed;
    feeds.push({
      userName,
      imageSrc,
      imgAlt,
      content,
      createdTime,
    });
    return res.status(200).json({ message: 'posting success!' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// 포스트 목록 읽기
app.get('/post', (req, res) => {
  try {
    res.status(200).json({ data: feeds });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 포스트 수정
app.patch('/post', (req, res) => {
  try {
    const { id } = req.body.editfeed;
    feeds = feeds.map((feed) => {
      if (id === feed.id) {
        return (feed = req.body.editfeed);
      } else {
        return feed;
      }
    });
    return res.status(200).json({ data: feeds[id - 1] });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// 포스트 삭제
app.delete('/post', (req, res) => {
  try {
    const { id } = req.query;
    feeds.forEach((feed, i) => {
      if (feed.id == id) {
        feeds.splice(i, 1);
      }
    });
    return res.status(200).json({ message: 'postingDeleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

// 유저가 쓴 포스팅 목록 읽기
app.get('/user/post', (req, res) => {
  const { searchuser } = req.query;
  try {
    let arr = [];
    feeds.forEach((feed) => {
      if (searchuser === feed.userName) {
        arr.push(feed);
      }
    });
    res.status(200).json({
      data: {
        userName: searchuser,
        posting: arr,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

const server = http.createServer(app);

const start = () => {
  try {
    server.listen(8000, (req, res) => {
      console.log({ message: 'Listening to requests on port 8000' });
    });
  } catch (err) {
    console.log(err);
  }
};

start();
