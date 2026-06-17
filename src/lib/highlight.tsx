import { Fragment } from "react";

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "fn"
  | "prop"
  | "punc"
  | "plain";

interface Token {
  value: string;
  type: TokenType;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "import", "export", "default",
  "from", "interface", "type", "enum", "class", "extends", "implements", "new",
  "async", "await", "if", "else", "for", "while", "switch", "case", "of", "in",
  "true", "false", "null", "undefined", "void", "public", "private", "protected",
  "readonly", "as", "echo", "static", "this", "typeof", "keyof", "namespace",
  "final", "Future", "widget",
]);

const MASTER = new RegExp(
  [
    "(\\/\\/[^\\n]*|#[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)", // 1 comment
    "(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')", // 2 string
    "([A-Za-z_$][A-Za-z0-9_$]*)(?=\\s*\\()", // 3 fn call
    "([A-Za-z_$][A-Za-z0-9_$]*)", // 4 ident
    "(\\d+(?:\\.\\d+)?)", // 5 number
    "([{}\\[\\]()<>;,.:=+\\-*/%!?&|@]+)", // 6 punctuation
  ].join("|"),
  "g",
);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MASTER.lastIndex = 0;
  while ((m = MASTER.exec(code))) {
    if (m.index > last) tokens.push({ value: code.slice(last, m.index), type: "plain" });
    if (m[1]) tokens.push({ value: m[1], type: "comment" });
    else if (m[2]) tokens.push({ value: m[2], type: "string" });
    else if (m[3]) tokens.push({ value: m[3], type: KEYWORDS.has(m[3]) ? "keyword" : "fn" });
    else if (m[4]) tokens.push({ value: m[4], type: KEYWORDS.has(m[4]) ? "keyword" : "plain" });
    else if (m[5]) tokens.push({ value: m[5], type: "number" });
    else if (m[6]) tokens.push({ value: m[6], type: "punc" });
    last = m.index + m[0].length;
  }
  if (last < code.length) tokens.push({ value: code.slice(last), type: "plain" });

  // JSON-ish: a string immediately followed by ":" is a property key
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === "string") {
      let j = i + 1;
      while (j < tokens.length && tokens[j].type === "plain" && !tokens[j].value.trim()) j++;
      if (j < tokens.length && tokens[j].type === "punc" && tokens[j].value.startsWith(":")) {
        tokens[i].type = "prop";
      }
    }
  }
  return tokens;
}

const CLASS: Record<TokenType, string> = {
  comment: "text-syntax-comment italic",
  string: "text-syntax-string",
  keyword: "text-syntax-keyword",
  number: "text-syntax-number",
  fn: "text-syntax-fn",
  prop: "text-syntax-prop",
  punc: "text-syntax-punc",
  plain: "text-foreground/85",
};

function tokensToLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    const parts = t.value.split("\n");
    parts.forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ value: part, type: t.type });
    });
  }
  return lines;
}

export function CodeBlock({ code }: { code: string }) {
  const lines = tokensToLines(tokenize(code.replace(/\n$/, "")));
  return (
    <pre className="font-mono text-[13px] leading-[1.7]">
      <code className="grid">
        {lines.map((line, i) => (
          <span
            key={i}
            className="group grid grid-cols-[3rem_1fr] hover:bg-active-line/60 transition-colors"
          >
            <span className="select-none pr-4 text-right text-line-number tabular-nums">
              {i + 1}
            </span>
            <span className="whitespace-pre-wrap break-words pr-4">
              {line.length === 0 ? (
                "\u00A0"
              ) : (
                line.map((t, j) => (
                  <Fragment key={j}>
                    <span className={CLASS[t.type]}>{t.value}</span>
                  </Fragment>
                ))
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
