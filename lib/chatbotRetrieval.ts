import { KnowledgeDoc, WEBSITE_KNOWLEDGE_INDEX } from "@/lib/chatbotKnowledge";

type ScoredDoc = {
  doc: KnowledgeDoc;
  score: number;
};

export type RetrievedContext = {
  docs: KnowledgeDoc[];
  snippet: string;
  docIds: string[];
  topScore: number;
  confidenceBand: "low" | "medium" | "high";
};

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "we",
  "what",
  "when",
  "where",
  "which",
  "with",
  "you",
  "your",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function overlapScore(questionTokens: Set<string>, doc: KnowledgeDoc): number {
  const docTokens = new Set(tokenize(`${doc.title} ${doc.content} ${doc.tags.join(" ")}`));
  if (questionTokens.size === 0 || docTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  questionTokens.forEach((token) => {
    if (docTokens.has(token)) {
      overlap += 1;
    }
  });

  const ratio = overlap / questionTokens.size;
  return ratio;
}

function withPathBoost(score: number, path: string | undefined, doc: KnowledgeDoc): number {
  if (!path) {
    return score;
  }

  if (path === doc.urlPath) {
    return score + 0.35;
  }

  if (path.startsWith("/locations") && doc.urlPath.startsWith("/locations")) {
    return score + 0.12;
  }

  if (path.startsWith("/interior-design") && doc.urlPath.startsWith("/interior-design")) {
    return score + 0.12;
  }

  if (path.startsWith("/faq") && doc.urlPath.startsWith("/faq")) {
    return score + 0.12;
  }

  return score;
}

function confidenceFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 0.65) {
    return "high";
  }
  if (score >= 0.3) {
    return "medium";
  }
  return "low";
}

export function retrieveContext(question: string, path?: string, topK = 6): RetrievedContext {
  const questionTokens = new Set(tokenize(question));
  const scored: ScoredDoc[] = WEBSITE_KNOWLEDGE_INDEX.map((doc) => {
    const base = overlapScore(questionTokens, doc);
    return {
      doc,
      score: withPathBoost(base, path, doc),
    };
  }).sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, topK).filter((item) => item.score > 0 || item.doc.section === "brand");
  const docs = selected.map((item) => item.doc);
  const topScore = selected[0]?.score ?? 0;

  const snippet = docs
    .map(
      (doc) =>
        `[${doc.id}] ${doc.title} (${doc.urlPath})\n${doc.content}`,
    )
    .join("\n\n");

  return {
    docs,
    snippet,
    docIds: docs.map((doc) => doc.id),
    topScore,
    confidenceBand: confidenceFromScore(topScore),
  };
}
