const HOSTED_DEPLOYMENT = "1";

export function isResearchWorkbenchAvailable(
  environment: Readonly<Record<string, string | undefined>> = process.env,
) {
  return environment.VERCEL !== HOSTED_DEPLOYMENT;
}

export function assertResearchWorkbenchAvailable() {
  if (!isResearchWorkbenchAvailable()) {
    throw new Error("The synthetic research workbench is unavailable on hosted deployments.");
  }
}
