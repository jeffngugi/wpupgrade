import fs from "fs";
import path from "path";
import plist from "plist";
import g2js from "gradle-to-js/lib/parser.js";
import glob from "glob";
import dateFns from "date-fns";
import noop from "lodash/noop.js";

export default function updateChangelog([targetFolder]) {
  const { format } = dateFns;

  const CHANGELOG = path.join(process.cwd(), targetFolder, "CHANGELOG.md");
  const INFO_PLIST = glob.sync(
    path.join(process.cwd(), targetFolder, "ios/*/Info.plist"),
  )[0];
  const BUILD_GRADLE = glob.sync(
    path.join(process.cwd(), targetFolder, "android/*/build.gradle"),
  )[0];

  const getDate = () => format(new Date(), "do 'of' MMMM yyyy 'at' HH:mm:ss");

  const getFulliOSVersion = () => {
    const { CFBundleShortVersionString, CFBundleVersion } = plist.parse(
      fs.readFileSync(INFO_PLIST, "utf8"),
    );

    return `iOS: v${CFBundleShortVersionString}(${CFBundleVersion})`;
  };

  const getFullAndroidVersion = () =>
    g2js
      .parseFile(BUILD_GRADLE)
      .then(
        ({ android: { defaultConfig } }) =>
          `Android: v${defaultConfig.versionName}(${defaultConfig.versionCode})`,
      )
      .catch(e => noop(e));

  const write = async () => {
    const androidVersion = await getFullAndroidVersion();

    if (androidVersion) {
      const getVersionHeading = () =>
        `## ${androidVersion} ${getFulliOSVersion()} - ${getDate()}`;
      const contents = fs.readFileSync(CHANGELOG, "utf8");
      const nextContents = contents.replace(
        /^## Unreleased/m,
        "## Unreleased\n\n" + getVersionHeading(),
      );

      fs.writeFileSync(CHANGELOG, nextContents);
    }
  };

  write();
}
