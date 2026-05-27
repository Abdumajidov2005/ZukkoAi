import { useState, useCallback } from "react";

// ============================================================
// useAIChecker — simulates calling the AI essay-checking engine.
// In production this would POST to /api/ai/check-essay and stream
// the result. Here we produce a realistic, deterministic-ish
// analysis from the essay text so the UI feels alive.
// ============================================================

const STAGES = [
  "Parsing essay structure…",
  "Analyzing grammar & syntax…",
  "Evaluating lexical resource…",
  "Scoring coherence & cohesion…",
  "Checking task achievement…",
  "Generating model answer…",
];

function bandFromText(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3).length || 1;
  const avgLen = words / sentences;
  const uniqueWords = new Set(text.toLowerCase().match(/[a-z']+/g) || []).size;
  const lexicalVariety = uniqueWords / Math.max(words, 1);

  let band = 5.0;
  if (words > 150) band += 0.5;
  if (words > 230) band += 0.5;
  if (words > 280) band += 0.5;
  if (avgLen > 12 && avgLen < 24) band += 0.5;
  if (lexicalVariety > 0.5) band += 0.5;
  band = Math.min(9, Math.max(4, band));
  return { band, words, sentences, avgLen: Math.round(avgLen), lexicalVariety };
}

export function useAIChecker() {
  const [stage, setStage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const check = useCallback(async (text) => {
    setLoading(true);
    setResult(null);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 520));
    }

    const stats = bandFromText(text);
    const criteria = [
      { name: "Task Achievement", score: Math.min(9, stats.band + 0.5), desc: "Addresses the prompt with a clear position." },
      { name: "Coherence & Cohesion", score: stats.band, desc: "Logical paragraphing; vary cohesive devices." },
      { name: "Lexical Resource", score: Math.max(4, stats.band - 0.5), desc: "Good range; some repetition of common words." },
      { name: "Grammatical Range", score: stats.band, desc: "Mostly accurate; watch article & tense slips." },
    ];

    const grammarIssues = [
      { type: "Article", original: "in modern society", fix: "in modern society", note: "Consider 'in today's society' for variety." },
      { type: "Tense", original: "people uses technology", fix: "people use technology", note: "Subject–verb agreement: plural subject." },
      { type: "Preposition", original: "depend of", fix: "depend on", note: "Collocation error." },
    ];

    const vocabSuggestions = [
      { weak: "good", strong: "beneficial / advantageous", reason: "More academic register." },
      { weak: "a lot of", strong: "a considerable amount of", reason: "Formal alternative." },
      { weak: "big problem", strong: "significant challenge", reason: "Precise & sophisticated." },
    ];

    const overall = Math.round(stats.band * 2) / 2;

    setResult({
      band: overall,
      stats,
      criteria,
      grammarIssues,
      vocabSuggestions,
      improved:
        "In contemporary society, technological advancement has fundamentally reshaped the way individuals communicate and access information. While some contend that this complexity is detrimental, a considerable amount of evidence suggests that, when harnessed responsibly, technology yields substantial benefits across education, healthcare and the economy…",
      feedback:
        "A solid response with a clear position. To reach the next band, diversify your cohesive devices, replace high-frequency vocabulary with topic-specific terms, and ensure every body paragraph develops a single controlling idea with a concrete example.",
    });
    setLoading(false);
    setStage(-1);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStage(-1);
    setLoading(false);
  }, []);

  return { check, reset, loading, stage, stages: STAGES, result };
}
