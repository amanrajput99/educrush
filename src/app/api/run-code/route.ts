// src/app/api/run-code/route.ts

import { NextRequest, NextResponse } from 'next/server'

type RunResult = {
  output: string
  stdout: string
  stderr: string
  status: 'success' | 'error' | 'timeout'
}

// ── Provider 1: Paiza.io (free, no key, very reliable) ───────────────────────
async function runWithPaiza(code: string, langSlug: string, stdin: string): Promise<RunResult | null> {
  const langMap: Record<string, string> = {
    c:          'c',
    cpp:        'cpp',
    python:     'python3',
    javascript: 'javascript',
  }
  const lang = langMap[langSlug]
  if (!lang) return null

  try {
    // Step 1: Create submission
    const createRes = await fetch('https://api.paiza.io/runners/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        source_code:      code,
        language:         lang,
        input:            stdin || '',
        longpoll:         'true',
        longpoll_timeout: '10',
        api_key:          'guest',
      }).toString(),
      signal: AbortSignal.timeout(20000),
    })

    if (!createRes.ok) return null
    const created = await createRes.json()
    const id = created.id
    if (!id) return null

    // Step 2: Poll for result
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000))

      const getRes = await fetch(
        `https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`,
        { signal: AbortSignal.timeout(10000) }
      )
      if (!getRes.ok) continue

      const data = await getRes.json()
      if (data.status !== 'running' && data.status !== 'waiting') {
        const stdout   = (data.stdout       ?? '').trim()
        const stderr   = (data.stderr       ?? '').trim()
        const buildErr = (data.build_stderr ?? '').trim()

        if (buildErr) {
          return { stdout: '', stderr: buildErr, output: `🔴 Compilation Error:\n\n${buildErr}`, status: 'error' }
        }
        if (data.result === 'timeout') {
          return { stdout: '', stderr: 'TLE', output: '⏱ Time Limit Exceeded', status: 'timeout' }
        }
        if (stderr && !stdout) {
          return { stdout, stderr, output: `🔴 Runtime Error:\n\n${stderr}`, status: 'error' }
        }
        return {
          stdout, stderr,
          output: stdout || stderr || '(no output)',
          status: 'success',
        }
      }
    }
    return null
  } catch { return null }
}

// ── Provider 2: CodeX API ─────────────────────────────────────────────────────
async function runWithCodeX(code: string, langSlug: string, stdin: string): Promise<RunResult | null> {
  const langMap: Record<string, string> = {
    python: 'py', javascript: 'js', c: 'c', cpp: 'cpp',
  }
  const lang = langMap[langSlug]
  if (!lang) return null

  try {
    const res = await fetch('https://api.codex.jaagrav.in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, language: lang, input: stdin || '' }).toString(),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const stdout = (data.output ?? '').trim()
    const stderr = (data.error  ?? '').trim()
    if (stderr && !stdout) return { stdout, stderr, output: `🔴 Error:\n\n${stderr}`, status: 'error' }
    return { stdout, stderr: '', output: stdout || '(no output)', status: 'success' }
  } catch { return null }
}

// ── Provider 3: Godbolt Compiler Explorer ────────────────────────────────────
async function runWithGodbolt(code: string, langSlug: string, stdin: string): Promise<RunResult | null> {
  const compilerMap: Record<string, { compiler: string; lang: string; args: string }> = {
    c:          { compiler: 'cg122',     lang: 'c',   args: '-O2' },
    cpp:        { compiler: 'g122',      lang: 'c++', args: '-std=c++17 -O2' },
    python:     { compiler: 'python311', lang: 'python', args: '' },
    javascript: { compiler: 'node1844',  lang: 'javascript', args: '' },
  }
  const cfg = compilerMap[langSlug]
  if (!cfg) return null

  try {
    const res = await fetch(`https://godbolt.org/api/compiler/${cfg.compiler}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        source: code,
        lang:   cfg.lang,
        options: {
          userArguments: cfg.args,
          executeParameters: { stdin: stdin || '', args: [] },
          compilerOptions:   {},
          filters: { execute: true, binary: false, demangle: true, intel: true, labels: true, directives: true, commentOnly: true, trim: false, libraryCode: false },
          tools:     [],
          libraries: [],
        },
        allowStoreCodeDebug: false,
      }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return null
    const data = await res.json()

    const buildErr = (data.stderr ?? []).map((l: any) => l.text).join('\n').trim()
    const stdout   = (data.execResult?.stdout ?? []).map((l: any) => l.text).join('\n').trim()
    const stderr   = (data.execResult?.stderr ?? []).map((l: any) => l.text).join('\n').trim()

    if (buildErr) return { stdout: '', stderr: buildErr, output: `🔴 Compilation Error:\n\n${buildErr}`, status: 'error' }
    if (stderr)   return { stdout, stderr, output: `🔴 Runtime Error:\n\n${stderr}`, status: 'error' }
    return { stdout, stderr: '', output: stdout || '(no output)', status: 'success' }
  } catch { return null }
}

// ── Provider 4: Rextester (C/C++/Python only — JS broken) ────────────────────
async function runWithRextester(code: string, langSlug: string, stdin: string): Promise<RunResult | null> {
  if (langSlug === 'javascript') return null
  const langMap: Record<string, number> = { c: 6, cpp: 7, python: 5 }
  const langId = langMap[langSlug]
  if (!langId) return null

  const compilerArgs =
    langSlug === 'cpp' ? 'source_file.cpp -o a.out -std=c++17' :
    langSlug === 'c'   ? 'source_file.c -o a.out'              : ''

  try {
    const res = await fetch('https://rextester.com/rundotnet/Run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':   'Mozilla/5.0',
        'Referer':      'https://rextester.com/',
      },
      body: new URLSearchParams({
        LanguageChoiceWrapper: String(langId),
        EditorChoiceWrapper:   '1',
        LayoutChoiceWrapper:   '1',
        Program:               code,
        Input:                 stdin || '',
        CompilerArgs:          compilerArgs,
        Privacy:               '0',
        IsInEditMode:          'False',
        IsLive:                'False',
      }).toString(),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const stdout = (data.Result ?? '').trim()
    const stderr = (data.Errors ?? '').trim()
    if (stderr) return { stdout, stderr, output: `🔴 Error:\n\n${stderr}`, status: 'error' }
    return { stdout, stderr: '', output: stdout || '(no output)', status: 'success' }
  } catch { return null }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { code, langSlug, stdin = '' } = await req.json()

    if (!code?.trim() || !langSlug) {
      return NextResponse.json({
        output: '❌ Missing code or language', status: 'error', stdout: '', stderr: ''
      }, { status: 400 })
    }

    const providers = [
      { name: 'Paiza',     fn: () => runWithPaiza(code, langSlug, stdin) },
      { name: 'CodeX',     fn: () => runWithCodeX(code, langSlug, stdin) },
      { name: 'Godbolt',   fn: () => runWithGodbolt(code, langSlug, stdin) },
      { name: 'Rextester', fn: () => runWithRextester(code, langSlug, stdin) },
    ]

    for (const provider of providers) {
      try {
        const result = await provider.fn()
        if (result) return NextResponse.json(result)
      } catch { continue }
    }

    return NextResponse.json({
      output: '❌ All code runners unavailable.\nPlease try again in a moment.',
      status: 'error', stdout: '', stderr: '',
    })

  } catch (err: any) {
    return NextResponse.json({
      output: `❌ Server Error: ${err?.message ?? 'Unknown'}`,
      status: 'error', stdout: '', stderr: '',
    })
  }
}