import express from 'express';
import axios from 'axios';
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();
const router = express.Router();
var result="";
router.post("/text", async (req, res) => {
  // try {
  //   const { text, ChatId } = req.body;
  //   console.log('/text', text);
  //   const url = 'https://dad-jokes.p.rapidapi.com/random/joke';
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'X-RapidAPI-Key': '3a2c9f5e70msh4fd22237ba94150p1b8d77jsn9bed91208b46',
  //       'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
  //     }
  //   };

  //   fetch(url, options).then(response => response.text())
  //   .then((data)=>{
  //       console.log(data);
  //       res.status(200).send(data);
  //   })
  //   .catch(error => {console.error(error);
  //     res.status(500).send({error: error.message});
  //   });

  // }
  // catch(err){
  //   res.status(500).send({error: err.message});
  // }
  try {
    const { text, ChatId } = req.body;
    console.log('/text', text);
    const encodedParams = new URLSearchParams();
    encodedParams.set('message', text);
    encodedParams.set('chatId', ChatId);
    const url = 'http://127.0.0.1:5000/api/predict';
    const options = {
      method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: encodedParams
    };

    fetch(url, options).then(response => response.text())
    .then((data)=>{
        console.log(data);
        res.status(200).send(data);
    })
    .catch(error => {console.error(error);
      res.status(500).send({error: error.message});
    });

  }
  catch(err){
    res.status(500).send({error: err.message});
  }
});

export default router;


