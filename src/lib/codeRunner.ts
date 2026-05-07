// src/lib/codeRunner.ts

export type RunResult = {
  stdout: string
  stderr: string
  output: string
  status: 'success' | 'error' | 'timeout'
  time?: string
}

export async function runCode(
  code: string,
  langSlug: string,
  stdin = ''
): Promise<RunResult> {
  try {
    const res = await fetch('/api/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, langSlug, stdin }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return {
        stdout: '', stderr: text,
        output: `❌ Error: ${res.status}`,
        status: 'error',
      }
    }

    return await res.json()
  } catch (err: any) {
    return {
      stdout: '', stderr: err?.message,
      output: `❌ Network Error: ${err?.message}`,
      status: 'error',
    }
  }
}