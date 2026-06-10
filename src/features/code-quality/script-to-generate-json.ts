import childProcess from "node:child_process";
import fs from "node:fs";

const generatedPath = "./src/features/code-quality/code-quality.gen.json";

const countTestCases = () => {
  try {
    const result = childProcess
      // eslint-disable-next-line sonarjs/no-os-command-from-path
      .execSync(
        'grep -rE "^\\s*(it|test)\\(" src --include="*.spec.tsx" --include="*.spec.ts" --include="*.test.tsx" --include="*.test.ts" | grep -v __screenshots__ | wc -l',
      )
      .toString()
      .trim();
    return parseInt(result, 10) || 0;
  } catch {
    return 0;
  }
};

const countLintErrors = () => {
  try {
    const output = childProcess
      // eslint-disable-next-line sonarjs/no-os-command-from-path
      .execSync("oxlint .", { encoding: "utf8", stdio: "pipe" });
    const match = output.match(/Found \d+ warnings and (\d+) errors/);
    return match ? parseInt(match[1], 10) : 0;
  } catch (err) {
    const error = err as { stdout?: string };
    const output = error.stdout ?? "";
    const match = output.match(/Found \d+ warnings and (\d+) errors/);
    return match ? parseInt(match[1], 10) : 0;
  }
};

const getCommitShort = () => {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    return childProcess
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  } catch {
    return null;
  }
};

const generateCodeQualityStats = () => {
  try {
    const existing = (
      fs.existsSync(generatedPath)
        ? JSON.parse(fs.readFileSync(generatedPath, "utf-8"))
        : {}
    ) as { bundleKb?: number };

    const content = {
      tests: countTestCases(),
      bundleKb: existing.bundleKb ?? 0,
      lintErrors: countLintErrors(),
      typescript: "strict",
      generatedAt: new Date().toISOString(),
      commit: getCommitShort(),
    };

    fs.writeFileSync(generatedPath, JSON.stringify(content, null, 2) + "\n");
    console.log(
      `✅ Code quality stats generated (${generatedPath}) — ${content.tests} tests`,
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `❌ Failed to generate code quality stats (${generatedPath})`,
    );
  }
};

generateCodeQualityStats();
