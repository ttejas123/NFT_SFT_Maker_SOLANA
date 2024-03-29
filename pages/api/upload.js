import { metaplex, LAMPORTS_PER_SOL, toMetaplexFile, authenticateToken } from './metaplex_D'
import formidable from "formidable";
import fs from "fs";
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const auth = await authenticateToken(req, res)
  // console.log(auth)
  if(!auth) return res.status(404).json({uri: "Failed in authentication"})
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const {status, uri} = await saveFile(files.file);
    return res.status(status).json({uri: uri});
  });
};

const saveFile = async (file) => {
  try{
    const data1 = fs.readFileSync(file.filepath);
    const uploaddata = await toMetaplexFile(data1, `${file.filepath}`) 
    let uri = await metaplex.storage().upload(uploaddata)
    console.log("Uploaded File URI:- "+uri);
    return {status: 200, uri: uri};
  } catch (e) {
    return {status: 404, uri: "Unable to Upload file to Metaplex"};
  }
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
