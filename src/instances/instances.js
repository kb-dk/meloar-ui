export default {
  instances: [
    {
      key:'fof',
     name: 'Fund og fortidsminder', 
     searchOptions: {
      map:true,
      time:true,
      timeOptions: {
        min:-250000,
        max:2000,
        interval:100
      },
     }
    },
    {
      key:'kirker', 
      name: 'Kirker', 
      searchOptions: {
        map:true,
        time:false,
       }
    },
    {
      key:'partiprogrammer', 
      name: 'Partiprogrammer', 
      searchOptions: {
        map:false,
        time:false,
       }
    },
    {
      key:'folkeskole', 
      name: 'Folkeskole love', 
      searchOptions: {
        map:false,
        time:false,
       }
    },
  ]
}
