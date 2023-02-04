import formidable from "formidable";
import fs from "fs";

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        await saveFile(files.file);
        return res.status(200).send("");
    });
};

const saveFile = async (file) => {
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`./public/${file.name}`, data);
    await fs.unlinkSync(file.path);
    return;
};

export default (req, res) => {
    void post(req, res);
};