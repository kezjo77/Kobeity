import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://kobeity.vercel.app/",
  })
);

app.use(express.json({ limit: "1mb" }));

// ==========================================
// GEMINI
// ==========================================

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "ERROR: GEMINI_API_KEY is missing from server/.env"
  );
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Kobeity backend is running.",
    ai: process.env.GEMINI_API_KEY
      ? "Gemini configured"
      : "Gemini API key missing",
  });
});

// ==========================================
// JOURNAL ANALYSIS
// ==========================================

app.post("/api/analyze", async (req, res) => {
  try {
    const { entries } = req.body;

    console.log(
      `Received ${Array.isArray(entries) ? entries.length : 0} journal entries`
    );

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        error: "Journal entries are required.",
      });
    }

    // ------------------------------------------
    // Build journal text
    // ------------------------------------------

    const journalText = entries
      .map((entry, index) => {
        return `
ENTRY ${index + 1}

Date:
${entry.date || "Unknown"}

Category:
${entry.category || "Other"}

Experience:
${entry.text || ""}
`;
      })
      .join("\n--------------------\n");

    // ------------------------------------------
    // Prompt
    // ------------------------------------------

    const prompt = `
You are Kobeity's experience-pattern analysis assistant.

Kobeity is a private self-reflection and self-advocacy
application designed for women.

Your job is ONLY to identify recurring experiences
explicitly supported by the journal entries.

You are NOT a doctor.

Do NOT diagnose:
- ADHD
- autism
- depression
- anxiety
- any other medical condition

Do NOT tell the user that they have a disorder.

Do NOT infer medical history, personality, identity,
or diagnosis.

Possible themes include:

- Task initiation
- Time management
- Memory & organization
- Sensory experiences
- Social experiences
- Emotional overwhelm
- Routine & transitions
- Attention
- Communication
- Energy & recovery

Only include a theme when there is actual evidence
in the journal entries.

IMPORTANT:

- Count how many DIFFERENT journal entries support each theme.
- Do not count multiple mentions inside one entry more than once.
- Do not invent evidence.
- Evidence must come directly from the user's journal.
- Keep summaries neutral and descriptive.
- Do not use diagnostic language.
- If there are no meaningful recurring themes, return an empty themes array.

Return JSON matching exactly this structure:

{
  "themes": [
    {
      "name": "Theme name",
      "frequency": 2,
      "summary": "Neutral description of the recurring experience.",
      "evidence": [
        "Short evidence from the journal."
      ]
    }
  ],
  "overallSummary": "Short neutral summary of the recurring experiences."
}

Journal entries:

${journalText}
`;

    console.log("Sending journal to Gemini...");

    // ------------------------------------------
    // Gemini request
    // ------------------------------------------

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const response = result.response;

    let output = response.text();

    console.log("Gemini raw response:");
    console.log(output);

    // ------------------------------------------
    // Parse JSON
    // ------------------------------------------

    output = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(output);
    } catch (parseError) {
      console.error(
        "Gemini returned invalid JSON:"
      );

      console.error(output);

      return res.status(500).json({
        error:
          "Gemini returned an invalid analysis format.",
        raw: output,
      });
    }

    // ------------------------------------------
    // Validate response
    // ------------------------------------------

    if (
      !analysis ||
      !Array.isArray(analysis.themes)
    ) {
      console.error(
        "Invalid analysis structure:",
        analysis
      );

      return res.status(500).json({
        error:
          "Gemini returned an unexpected analysis structure.",
      });
    }

    if (
      typeof analysis.overallSummary !==
      "string"
    ) {
      analysis.overallSummary =
        "The analysis identified the recurring experiences present in your journal entries.";
    }

    // Make sure every theme has safe fields.
    analysis.themes = analysis.themes.map(
      (theme) => ({
        name:
          typeof theme.name === "string"
            ? theme.name
            : "Unnamed theme",

        frequency:
          typeof theme.frequency === "number"
            ? theme.frequency
            : 1,

        summary:
          typeof theme.summary === "string"
            ? theme.summary
            : "",

        evidence:
          Array.isArray(theme.evidence)
            ? theme.evidence
            : [],
      })
    );

    console.log(
      `Analysis complete: ${analysis.themes.length} themes found`
    );

    // ------------------------------------------
    // Return result
    // ------------------------------------------

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error("GEMINI ANALYSIS ERROR");

    console.error(
      error?.message || error
    );

    console.error(
      error?.response?.data || ""
    );

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Unable to analyze journal entries.",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Kobeity backend running on http://localhost:${PORT}`
  );
});
// ==========================================
// RESOURCE SEARCH
// ==========================================

app.post("/api/resources/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        error: "Search query is required.",
      });
    }

    const searchQuery = query.trim();

    const prompt = `
You are Kobeity's trusted resource search assistant.

The user is searching for educational and self-advocacy
resources related to:

"${searchQuery}"

Search the web and find reliable resources.

PRIORITIZE:

- NHS
- NIMH
- CDC
- Government health services
- Universities
- Established medical organizations
- Established educational organizations
- Reputable neurodiversity organizations

AVOID:

- Forums
- Reddit
- Social media
- Personal blogs
- Unsourced claims
- Promotional pages
- Pages that attempt to diagnose the user

Kobeity is NOT a diagnostic application.

Do not diagnose the user.
Do not assume the user has any medical condition.

Return 3 to 6 useful resources.

For every resource provide:

- title
- source
- description
- url

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "Short neutral description of what these resources cover.",
  "resources": [
    {
      "title": "Resource title",
      "source": "Organization name",
      "description": "Short neutral description.",
      "url": "https://example.com"
    }
  ]
}

Do not invent URLs.
Only use URLs from the web search results.
`;

    const result = await model.generateContent(prompt);

    let output = result.response.text();

    output = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let data;

    try {
      data = JSON.parse(output);
    } catch (error) {
      console.error("Invalid resource JSON:", output);

      return res.status(500).json({
        error: "The AI returned an invalid resource response.",
      });
    }

    if (!Array.isArray(data.resources)) {
      return res.status(500).json({
        error: "Invalid resource response.",
      });
    }

    res.json({
      success: true,
      summary: data.summary || "",
      resources: data.resources,
    });

  } catch (error) {
    console.error("Resource search error:", error);

    res.status(500).json({
      error: "Unable to search resources.",
    });
  }
});
// ==========================================
// RESOURCE WEB SEARCH
// ==========================================

app.post("/api/resources/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        error: "A search query is required.",
      });
    }

    const cleanQuery = query.trim();

    const prompt = `
You are the resource-search assistant for Kobeity.

Kobeity is a private self-reflection and self-advocacy
application.

The user is searching for reliable educational resources about:

"${cleanQuery}"

Use web search to find current, trustworthy resources.

PRIORITIZE SOURCES IN THIS ORDER:

1. Government health organizations
2. NHS and other government health services
3. NIMH, CDC, and similar public health organizations
4. Universities and established educational institutions
5. Established medical/professional organizations
6. Reputable neurodiversity organizations
7. Established nonprofit organizations

AVOID:

- Social media posts
- Forums
- Reddit
- Unsourced blogs
- Personal opinion pages
- Promotional pages
- Pages making unsupported medical claims
- Pages claiming to diagnose the user

IMPORTANT:

Do not diagnose the user.

Do not assume the user has ADHD, autism,
anxiety, depression, or any other condition.

The results are for education and self-reflection only.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "A short neutral summary of what the search results cover.",
  "resources": [
    {
      "title": "Title of the resource",
      "source": "Organization or website name",
      "description": "Short neutral description of what the resource provides.",
      "url": "https://example.com"
    }
  ]
}

Return between 3 and 6 resources.

Only include URLs that are actually present
in the search results.

Never invent a URL.

Prefer resources that directly answer or explain
the user's search rather than generic homepages.
`;

    console.log(
      `Searching web resources for: "${cleanQuery}"`
    );

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      tools: [
        {
          googleSearch: {},
        },
      ],

      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    let output = result.response.text();

    console.log("Resource search response:");
    console.log(output);

    output = output
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let searchResults;

    try {
      searchResults = JSON.parse(output);
    } catch (parseError) {
      console.error(
        "Invalid resource-search JSON:"
      );

      console.error(output);

      return res.status(500).json({
        error:
          "The resource search returned an invalid response.",
      });
    }

    if (
      !searchResults ||
      !Array.isArray(searchResults.resources)
    ) {
      return res.status(500).json({
        error:
          "The resource search returned an unexpected response.",
      });
    }

    // Keep the response clean and predictable.
    const resources =
      searchResults.resources
        .filter(
          (resource) =>
            resource &&
            typeof resource.title === "string" &&
            typeof resource.source === "string" &&
            typeof resource.description === "string" &&
            typeof resource.url === "string"
        )
        .slice(0, 6);

    return res.json({
      success: true,
      query: cleanQuery,
      summary:
        typeof searchResults.summary === "string"
          ? searchResults.summary
          : "",
      resources,
    });

  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error("RESOURCE SEARCH ERROR");

    console.error(
      error?.message || error
    );

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Unable to search for resources right now.",
    });
  }
});