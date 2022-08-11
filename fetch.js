fetch('http://localhost:8000/user_posting?searchuser=2021bong')
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
