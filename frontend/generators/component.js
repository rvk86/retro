var fs = require("fs-extra");

function copyComponent() {
  let camelName = process.argv[3].charAt(0).toLowerCase() + process.argv[3].slice(1);
  let capitalName = process.argv[3].charAt(0).toUpperCase() + process.argv[3].slice(1);

  let source = `${__dirname}/component`;
  let target = `${__dirname}/../src/${process.argv[2]}/${camelName}`;

  // Create new directory
  if(fs.existsSync(target)) return console.log('component with this name already exists.');
  fs.mkdirSync(target);

  // Find and replace **NAME** with component name
  fs.readdir(source, function(err, files) {
    if( err ) return console.error(err);
    files.forEach(function(file) {
      fs.readFile(`${source}/${file}`, 'utf8', function (err,data) {
        if (err) return console.log(err);

        let result = data.replace(/\*\*NAME\*\*/g, capitalName);
        let fileName = file.replace(/Component/, capitalName);
        fs.writeFile(`${target}/${fileName}`, result, 'utf8');
      });
    });

  });
}

if (require.main === module) {
  if(process.argv.length < 4) {
    return console.log(`
To generate a new component run this script as follows:
node component.js [DESTINATION DIRECTORY] [COMPONENT NAME]
where DESTINATION DIRECTORY is a folder inside the src directory (mostly components or containers)
and COMPONENT NAME is the name of the component camelcased.
    `);
  }

  copyComponent();
}
