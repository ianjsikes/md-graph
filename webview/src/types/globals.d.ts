export {}

interface VsCode {
  postMessage: (message: any) => void
}

declare global {
  const vscode: VsCode
}
