import { promisify } from "util";
import { exec as _exec } from "child_process";
import { ESLint } from "eslint";

const exec = promisify(_exec);

// Runs ESLint on the files that are going to be committed as they are
// staged to be committed. If ESLint reports an error write the report
// to standard output and return a non-zero exitcode.

const LINTABLE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".json"];

const errorHandler = error => {
  process.exitCode = 1;
  console.error(error);
}

const splitFileNames = ({ stdout }) => {
  const files = stdout.split("\u0000");
  files.pop(); // drop last item which is a '' product of the ending NUL byte.
  return files;
};

const exit = result => (result ? process.exit(0) : process.exit(1));

const eslint = new ESLint();

function lintFile(filepath) {
  // git show :<path> writes the content of the file as staged to stdout.
  return exec(`git show :${filepath}`).then(( { stdout }) => {
    const results = eslint
      .lintText(stdout, { filePath: filepath })
      .then(response => response);

    if (!results.length) {
      return true;
    }

    const [report] = results;

    if (report.errorCount > 0 || report.warningCount > 0) {
      eslint.loadFormatter("stylish").then(response => {
        console.log(response.format(results));
      });
    }

    return report.errorCount === 0 && report.warningCount === 0;
  }, errorHandler);
}

exec("git diff --cached --name-only -z --diff-filter=ACMR")
  .then(splitFileNames)
  .then(filepaths => {
    return filepaths.filter(file => {
      return LINTABLE_EXTENSIONS.some(ext => file.endsWith(ext));
    });
  })
  .then(filepaths => Promise.all(filepaths.map(lintFile)))
  .then(results => results.every(x => x))
  .then(exit)
  .catch(errorHandler);
