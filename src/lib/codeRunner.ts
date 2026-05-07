// src/lib/codeRunner.ts
// Uses Wandbox API — completely FREE, no API key, no signup needed
// Docs: https://wandbox.org/api/

export type RunResult = {
  stdout: string
  stderr: string
  output: string
  status: 'success' | 'error' | 'timeout'
  time?: string
}

// Wandbox compiler names
const WANDBOX_COMPILER: Record<string, string> = {
  c:          'gcc-head-c',
  cpp:        'gcc-head',
  python:     'cpython-3.12.0',
  javascript: 'nodejs-head',
}

export async function runCode(
  code: string,
  langSlug: string,
  stdin = ''
): Promise<RunResult> {
  const compiler = WANDBOX_COMPILER[langSlug]

  if (!compiler) {
    return {
      stdout: '', stderr: 'Language not supported',
      output: '❌ Language not supported', status: 'error',
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        compiler,
        code,
        stdin: stdin || '',
        'compiler-option-raw': langSlug === 'c' ? '-Wall' : langSlug === 'cpp' ? '-Wall -std=c++17' : '',
        save: false,
      }),
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return {
        stdout: '', stderr: `API Error ${res.status}`,
        output: `❌ Error: ${res.status}\n${text}`, status: 'error',
      }
    }

    const data = await res.json()

    // Compile error
    if (data.status === '1' && data.compiler_error) {
      return {
        stdout: '', stderr: data.compiler_error,
        output: `🔴 Compilation Error:\n\n${data.compiler_error}`,
        status: 'error',
      }
    }

    const stdout    = (data.program_output  ?? '').trim()
    const stderr    = (data.program_error   ?? '').trim()
    const compileMsg = (data.compiler_message ?? '').trim()

    // Runtime error
    if (data.status !== '0' && (stderr || compileMsg)) {
      const errText = stderr || compileMsg
      return {
        stdout, stderr: errText,
        output: `🔴 Runtime Error:\n\n${errText}${stdout ? '\n\n' + stdout : ''}`,
        status: 'error',
      }
    }

    return {
      stdout, stderr,
      output: stdout || stderr || '(no output)',
      status: 'success',
      time: data.signal ? undefined : undefined,
    }

  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        stdout: '', stderr: 'Timeout',
        output: '⏱ Request timed out — please try again',
        status: 'timeout',
      }
    }
    return {
      stdout: '', stderr: err?.message ?? 'Unknown error',
      output: `❌ Error: ${err?.message ?? 'Failed to connect to code runner'}`,
      status: 'error',
    }
  }
}