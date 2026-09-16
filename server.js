import express from "express";
import fs from "fs";

const app = express();

app.set("views", "./templates");
app.set("view engine", "ejs");

app.use(express.static("public"));

// Carrega dades de conversió (ara TOT està aquí)
const unitsData = JSON.parse(fs.readFileSync("./data/units_data.json", "utf8"));


// Funció per obtenir la conversió a partir del path
function getConversionByPath(path) {
  return unitsData.find(u => u.path === path) || null;
}


// Funció per generar famílies automàticament (opcional)
function getFamilies() {
  const result = {};

  unitsData.forEach(entry => {
    const { category, from, to, path } = entry;

    if (!result[category]) {
      result[category] = [];
    }

    result[category].push({ path, from, to });
  });

  return result;
}


// NOVA RUTA: /cat/unit/acres-centiares
app.get("/:lang/unit/:path", (req, res) => {
  const { lang, path } = req.params;

  const translations = JSON.parse(
    fs.readFileSync(`./data/lang_${lang}.json`, "utf8")
  );

  const conversion = getConversionByPath(path);

  if (!conversion) {
    return res.status(404).send("Conversió no trobada");
  }

  const families = getFamilies(); // segueix funcionant igual

  res.render("unit", {
    lang,
    conversion,
    translations,
    families
  });
});


app.listen(3000);
