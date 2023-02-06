import * as React from 'react';

function sentimentAnalyze(txt) {
  return new Promise((resolve, reject) => {
    txt = txt.replace(' ', '%20');
    let url = 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=' + txt;
    let tag = 'none';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'bbfbb45401msh8e0769c39043966p148085jsn58f39432ddb8',
        'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
      }
    };
    fetch(url, options)
      .then(response => response.json())
      .then(response => {
        resolve(response.type);
      }).catch(e => {
        reject(e)
      });
  })
}

export default sentimentAnalyze;