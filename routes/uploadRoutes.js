const low = require('lowdb');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})
let upload = multer({ storage }).single('file');

let usersToPrint = async (file) => {
  let dataBuffer = fs.readFileSync(file.path);
  
  const data = await pdf(dataBuffer);
  const pages = data.text.split('CONTROLE DE FREQÜÊNCIA');
  const namesPDF = pages.map(page => {
    let startIndex = page.lastIndexOf("Empregado:");
    if (startIndex === -1) {
      startIndex = page.lastIndexOf("Estagiário:") + 1;
    }
    return page.substring(startIndex + 17, page.lastIndexOf("CTPS: ") - 18);
  });
  namesPDF.shift();
  const toPrint = [];
  const users = db.get('users').value();
  users.map(user => {
    // user -> [BRUNO, BEZERRA]
    // name -> BRUNO BEZERRA CHAVES
    namesPDF.find((name, index) => {
      const nameList = name.split(' ');
      if (nameList.includes(user.name) && nameList.includes(user.lastName)) {
        toPrint.push({
          nameComplete: name,
          page: index + 1,
          checked: true,
          ...user
        });
      }
    });
  });
  toPrint.sort((a, b) => a.page > b.page ? 1 : -1);
  return toPrint;
}

module.exports = (app) => {
  
  app.post(`/api/upload`, (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      
      const users = await usersToPrint(req.file);
      return res.status(200).send({ users });
    });
  })
  
}