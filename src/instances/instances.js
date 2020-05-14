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
