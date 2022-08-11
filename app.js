let users = [
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

let feeds = [
  {
    id: 1,
    userName: '2021bong',
    imageSrc: './img/board_img.png',
    imgAlt: '과일 스티커',
    likeCount: 123,
    content: '공부화이팅~~😀😀😀',
    allComment: 3,
    createdTime: 1,
  },
  {
    id: 2,
    userName: 'justcode_bong',
    imageSrc: './img/board2_img.jpg',
    imgAlt: '마루는 강쥐 - 마루',
    likeCount: 1127482,
    content: '마루는 강쥐 보시나요? 아주 재밌어요 기절합니당 ㅎㅎㅎㅎ',
    allComment: 322,
    createdTime: 13,
  },
  {
    id: 3,
    userName: 'tomato2022',
    imageSrc: './img/board3_img.png',
    imgAlt: '토마토 캐릭터',
    likeCount: 1,
    content: '울퉁불퉁 멋진 몸매에 빨간 옷을 입고',
    allComment: 11,
    createdTime: 24,
  },
  {
    id: 4,
    userName: 'catperson',
    imageSrc:
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    imgAlt: '썬글라스를 쓴 고양이',
    likeCount: 239,
    content: '고양이가 최고야 지구는 고양이꺼야',
    allComment: 53,
    createdTime: 1,
  },
  {
    id: 5,
    userName: 'devil_23',
    imageSrc:
      'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80',
    imgAlt: '여러 색깔 빛의 잔상',
    likeCount: 0,
    content: '흙염룡이 날뛴다 . . .',
    allComment: 0,
    createdTime: 48,
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

// 과제 1
app.post('/signup', (req, res) => {
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

// 과제 2
app.post('/posting', (req, res) => {
  try {
    const {
      userName,
      imageSrc,
      imgAlt,
      likeCount,
      content,
      allComment,
      createdTime,
    } = req.body.newfeed;
    feeds.push({
      userName,
      imageSrc,
      imgAlt,
      likeCount,
      content,
      allComment,
      createdTime,
    });
    return res.status(200).json({ message: 'posting success!' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// 과제 3
app.get('/posting_get', (req, res) => {
  try {
    res.status(200).json({ data: feeds });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// 과제 4
app.patch('/posting_modify', (req, res) => {
  try {
    const { id } = req.body.editfeed;
    feeds = feeds.map((feed) => {
      if (id === feed.id) {
        return (feed = req.body.editfeed);
      } else {
        return feed;
      }
    });
    console.log('after edit', feeds);
    return res.status(200).json({ data: feeds[id - 1] });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// 과제 5
app.delete('/posting_delete', (req, res) => {
  try {
    const { id } = req.body.delete;
    feeds.splice(id - 1, 1);
    return res.status(200).json({ message: 'postingDeleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

// 과제 6
app.get('/user_posting/:searchuserid', (req, res) => {
  try {
    const searchuser = req.params.searchuserid;
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
    console.log(err);
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
