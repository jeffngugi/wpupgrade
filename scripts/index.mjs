import cli from "./cli.mjs";

const [, , ...args] = process.argv;

cli(args);
