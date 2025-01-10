#!/usr/bin/env node
import clc from "cli-color";
import { writeFile } from "fs/promises";
import { stripIndent } from "common-tags";

const whitelist = [/babel\.config/i];

const isJs = file => (
  !whitelist.some(whitelistedFile => file.match(whitelistedFile)) &&
  file.match(/\.(js|jsx)$/i)
);

const isAppFile = file => file.match(/^(src)/i);

/**
 * @typedef {{
 *   file: string;
 *   line: number;
 *   title: string;
 *   message: string;
 *   annotation_level: 'failure' | 'notice' | 'warning'
 * }} Annotation
 * */
export default async function main(args) {
  /**
   * @type Annotation[]
   * */
  const annotations = [];

  try {
    const createdFiles = args;
    
    if (createdFiles.length > 0) {
      const filesViolatingExtensionRequirements = createdFiles.filter(
        file => isJs(file) && isAppFile(file),
      );

      filesViolatingExtensionRequirements.forEach(file => {
        annotations.push({
          file,
          annotation_level: "failure",
          line: 1,
          title: "Invalid file extension",
          message: stripIndent`
            Newly created JavaScript files must use either .ts or .tsx extension.

            Please rename this file to have .ts or .tsx (for JSX) extension.
            `,
        });
      });
    } else {
      clc.blue("No new JS files");
    }
  } catch (error) {
    clc.red(error.message);
    process.exit(1);
  } finally {
    await writeFile(
      "check-script-extensions.json",
      JSON.stringify(annotations, undefined, 2),
    );

    if (
      annotations.filter(
        ({ annotation_level }) => annotation_level === "failure",
      ).length > 0
    ) {
      process.exit(1);
    }
  }
}
