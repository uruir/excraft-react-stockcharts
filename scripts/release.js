var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
const ninarisPath = path.join(__dirname, "../../ninaris-backend/webAssets/node_modules");

console.log('build 目录', ninarisPath)

var origPackage = fs.readFileSync(path.join(root, "package.json")).toString();

try {
	var pkg = JSON.parse(origPackage);
	delete pkg.devDependencies;
	delete pkg.scripts;
	delete pkg.browserify;
	pkg.main = "index.js";
	pkg.module = "es/index.js";
	pkg.esnext = "es/index.js";

	const buildPackage = JSON.stringify(pkg, null, 2);

	let src = path.resolve('./', 'README.md')
	let dist = path.resolve('./../ninaris-backend/webAssets/node_modules/ct-react-stockcharts/', 'README.md')

	if (fs.existsSync(path.resolve(ninarisPath, 'ct-react-stockcharts'))) {
		console.info('已存在 ct-react-stockcharts')
		fs.copyFileSync(src, dist)
		console.info('创建 README.md', src, dist)
	} else {
		fs.mkdirSync(path.resolve(ninarisPath, 'ct-react-stockcharts'))
		console.info('创建 ct-react-stockcharts')
		fs.copyFileSync(src, dist)
		console.info('创建 README.md', src, dist)
	}
	fs.writeFile(path.join(ninarisPath, "ct-react-stockcharts", "package.json"), buildPackage, function() {
		console.log("ct-react-stockcharts: CJS package.json file rendered");
	});
} catch (er) {
	console.error("package.json parse error: ", er);
}
