export default {
  instances: [
    {
     key:'fof',
     name: 'Fund og fortidsminder', 
     pdfHighlight:true,
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
      pdfHighlight:true, 
      searchOptions: {
        map:true,
        time:false,
       }
    },
    {
      key:'partiprogrammer', 
      name: 'Partiprogrammer', 
      pdfHighlight:false,
      searchOptions: {
        map:false,
        time:false,
       }
    },
    {
      key:'folkeskole', 
      name: 'Folkeskole love', 
      pdfHighlight:true,
      searchOptions: {
        map:false,
        time:false,
       }
    },
    {
      key:'aviser', 
      name: 'Aviser i MeLOAR', 
      pdfHighlight:true,
      searchOptions: {
        map:false,
        time:false,
       }
    },
  ]
}
