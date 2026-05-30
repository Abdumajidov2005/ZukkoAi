import { useState, useCallback } from "react";
import { writingApi } from "../services/api";
import { USE_MOCK } from "../services/api";

const STAGES = [
  "Parsing essay structure…",
  "Analyzing grammar & syntax…",
  "Evaluating lexical resource…",
  "Scoring coherence & cohesion…",
  "Checking task achievement…",
  "Generating model answer…",
];

// Mock uchun
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
  const [stage, setStage]     = useState(-1);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const check = useCallback(async (text, { promptId = null, freeTopic = null } = {}) => {
    setLoading(true);
    setResult(null);
    setError(null);

    if (!USE_MOCK) {
      // Stage animatsiyasini boshlash (API javob berguncha)
      let stageIdx = 0;
      const interval = setInterval(() => {
        setStage((prev) => {
          const next = prev + 1;
          if (next >= STAGES.length - 1) clearInterval(interval);
          return next;
        });
        stageIdx++;
      }, 2000);

      try {
        const payload = { essay_text: text };
        if (promptId) payload.prompt_id = promptId;
        if (freeTopic) payload.free_topic = freeTopic;

        // POST /api/writing/submit/
        const data = await writingApi.submit(payload);
        clearInterval(interval);
        setStage(STAGES.length - 1);

        // Backend javobini frontend formatiga moslashtirish
        const fb = data.feedback || {};
        setResult({
          submissionId: data.id,
          band: data.overall_band ?? fb.overall_band,
          stats: { words: data.word_count },
          criteria: [
            { name: "Task Achievement",    score: fb.task_achievement,   desc: fb.task_feedback     || "" },
            { name: "Coherence & Cohesion",score: fb.coherence_cohesion, desc: fb.coherence_feedback|| "" },
            { name: "Lexical Resource",    score: fb.lexical_resource,   desc: fb.lexical_feedback  || "" },
            { name: "Grammatical Range",   score: fb.grammatical_range,  desc: fb.grammar_feedback  || "" },
          ],
          grammarIssues: (fb.grammar_errors || []).map((g) => ({
            type: "Grammar",
            original: g.original,
            fix: g.corrected,
            note: g.explanation,
          })),
          vocabSuggestions: (fb.vocab_suggestions || []).map((v) => ({
            weak: v.word,
            strong: v.better,
            reason: v.reason,
          })),
          improved: fb.rewritten_essay || "",
          feedback: fb.overall_feedback || "",
        });
      } catch (err) {
        clearInterval(interval);
        setError(err.message || "AI tekshiruv amalga oshmadi.");
      } finally {
        setLoading(false);
        setStage(-1);
      }
      return;
    }

    // --- MOCK MODE ---
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 520));
    }
    const stats = bandFromText(text);
    setResult({
      band: Math.round(stats.band * 2) / 2,
      stats,
      criteria: [
        { name: "Task Achievement",    score: Math.min(9, stats.band + 0.5), desc: "Addresses the prompt with a clear position." },
        { name: "Coherence & Cohesion",score: stats.band,                    desc: "Logical paragraphing; vary cohesive devices." },
        { name: "Lexical Resource",    score: Math.max(4, stats.band - 0.5), desc: "Good range; some repetition of common words." },
        { name: "Grammatical Range",   score: stats.band,                    desc: "Mostly accurate; watch article & tense slips." },
      ],
      grammarIssues: [
        { type: "Article",     original: "in modern society",  fix: "in modern society",  note: "Consider 'in today's society' for variety." },
        { type: "Tense",       original: "people uses",        fix: "people use",         note: "Subject–verb agreement: plural subject." },
        { type: "Preposition", original: "depend of",          fix: "depend on",          note: "Collocation error." },
      ],
      vocabSuggestions: [
        { weak: "good",       strong: "beneficial / advantageous",        reason: "More academic register." },
        { weak: "a lot of",   strong: "a considerable amount of",         reason: "Formal alternative." },
        { weak: "big problem",strong: "significant challenge",            reason: "Precise & sophisticated." },
      ],
      improved: "In contemporary society, technological advancement has fundamentally reshaped the way individuals communicate and access information…",
      feedback: "A solid response with a clear position. To reach the next band, diversify your cohesive devices and replace high-frequency vocabulary with topic-specific terms.",
    });
    setLoading(false);
    setStage(-1);
  }, []);

  const reset = useCallback(() => { setResult(null); setStage(-1); setLoading(false); setError(null); }, []);

  return { check, reset, loading, stage, stages: STAGES, result, error };
}
