export default {
  instances: [
    {
      key:'fof',
     name: 'Fund og fortidsminder', 
     searchApi:'/api/discovery/meloar/fof', 
     pdfApi:'/api/resource/meloar/fof',
     searchOptions: {
      map:true,
      time:true,
      timeOptions: {
        min:-3000,
        max:2100,
        startVal:-1000,
        endVal:0,
        interval:100
      },
     }
    },
    {
      key:'kirk', 
      name: 'Kirker', 
      searchApi:'/api/discovery/meloar/kirker', 
      pdfApi:'/api/resource/meloar/kirker',
      searchOptions: {
        map:true,
        time:false,
       }
    },
  ]
}
