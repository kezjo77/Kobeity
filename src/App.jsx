import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Activity,
  FileText,
  Users,
  Heart,
  Settings,
  Plus,
  Download,
  Sparkles,
  ShieldCheck,
  Lock,
  Menu,
  X,
  Search,
  ArrowRight,
  Trash2,
  PenLine,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";

import "./App.css";

/* =========================================================
   DEFAULT DATA
========================================================= */

const initialPatterns = [
  {
    name: "Task initiation",
    level: 4,
    description: "Frequently mentioned in your recent entries",
  },
  {
    name: "Social exhaustion",
    level: 3,
    description: "Appeared several times this week",
  },
  {
    name: "Sensory overwhelm",
    level: 2,
    description: "Occasionally mentioned in recent entries",
  },
];

const defaultJournalEntries = [
  {
    id: 1,
    text: "I couldn't start my assignment even though I knew it was important.",
    date: "Yesterday",
    category: "Task & Focus",
  },
  {
    id: 2,
    text: "I felt overwhelmed when there were too many people talking around me.",
    date: "2 days ago",
    category: "Sensory",
  },
  {
    id: 3,
    text: "After the college event, I needed a few hours alone to recover.",
    date: "4 days ago",
    category: "Social",
  },
];

const categories = [
  "Task & Focus",
  "Sensory",
  "Social",
  "Memory",
  "Emotions",
  "Routine",
  "Other",
];

/* =========================================================
   PATTERN KEYWORDS
========================================================= */

const patternKeywords = {
  "Task initiation": [
    "start",
    "starting",
    "begin",
    "began",
    "procrastinate",
    "procrastinated",
    "putting off",
    "couldn't do",
    "couldn't start",
    "avoid",
    "avoided",
  ],

  "Time management": [
    "deadline",
    "late",
    "time",
    "hours",
    "tomorrow",
    "forgot",
    "schedule",
    "last minute",
  ],

  "Memory & organization": [
    "forgot",
    "forget",
    "remember",
    "appointment",
    "lost",
    "misplaced",
    "organize",
    "organized",
  ],

  "Sensory overwhelm": [
    "noise",
    "noisy",
    "loud",
    "sound",
    "bright",
    "light",
    "crowded",
    "overwhelmed",
    "sensory",
  ],

  "Social exhaustion": [
    "social",
    "people",
    "conversation",
    "talking",
    "event",
    "friends",
    "exhausted",
    "alone",
    "recover",
  ],

  "Emotional overwhelm": [
    "overwhelmed",
    "anxious",
    "stress",
    "stressed",
    "frustrated",
    "upset",
    "cry",
    "crying",
    "emotion",
  ],

  "Routine & transitions": [
    "routine",
    "change",
    "changing",
    "switch",
    "switching",
    "plan",
    "plans",
    "unexpected",
  ],
};

function analyzeJournalEntries(entries) {
  const results = {};

  Object.keys(patternKeywords).forEach((pattern) => {
    results[pattern] = {
      name: pattern,
      count: 0,
      entries: [],
    };
  });

  entries.forEach((entry) => {
    const text = entry.text.toLowerCase();

    Object.entries(patternKeywords).forEach(
      ([pattern, keywords]) => {
        const matched = keywords.some((keyword) =>
          text.includes(keyword.toLowerCase())
        );

        if (matched) {
          results[pattern].count += 1;
          results[pattern].entries.push(entry);
        }
      }
    );
  });

  return Object.values(results)
    .filter((pattern) => pattern.count > 0)
    .sort((a, b) => b.count - a.count);
}

/* =========================================================
   DEMO COMMUNITY DATA
========================================================= */

const defaultCommunityPosts = [
  {
    id: 1,
    category: "Getting diagnosed",
    text: "I sometimes feel like I have been masking for years without realizing it. Has anyone else experienced this?",
    time: "2 hours ago",
    comments: [
      {
        id: 101,
        name: "Anonymous",
        text: "I completely understand this feeling. I only started noticing how much I was masking when I began reflecting on my experiences.",
        time: "1 hour ago",
      },
      {
        id: 102,
        name: "Anonymous",
        text: "You're definitely not alone. It can take a long time to recognize patterns in yourself.",
        time: "48 minutes ago",
      },
      {
        id: 103,
        name: "Anonymous",
        text: "I felt the same way. Writing things down helped me notice things I had been dismissing for years.",
        time: "25 minutes ago",
      },
    ],
  },

  {
    id: 2,
    category: "College & work",
    text: "Does anyone else find it incredibly difficult to start assignments even when they really care about them?",
    time: "5 hours ago",
    comments: [
      {
        id: 201,
        name: "Anonymous",
        text: "Yes. Knowing that something is important doesn't always make starting it easier.",
        time: "3 hours ago",
      },
      {
        id: 202,
        name: "Anonymous",
        text: "Breaking the task into tiny steps has helped me sometimes.",
        time: "2 hours ago",
      },
    ],
  },

  {
    id: 3,
    category: "Sensory experiences",
    text: "Crowded places leave me completely exhausted even when I actually enjoyed being there. Does anyone else experience this?",
    time: "Yesterday",
    comments: [
      {
        id: 301,
        name: "Anonymous",
        text: "Absolutely. Sometimes I need a quiet room afterwards just to recover.",
        time: "Yesterday",
      },
    ],
  },

  {
    id: 4,
    category: "Relationships",
    text: "I sometimes need a lot of alone time after socializing, and I've worried that people might think I'm being distant.",
    time: "Yesterday",
    comments: [
      {
        id: 401,
        name: "Anonymous",
        text: "Needing recovery time doesn't mean you care about people any less.",
        time: "Yesterday",
      },
      {
        id: 402,
        name: "Anonymous",
        text: "I have had to explain this to people close to me too.",
        time: "Yesterday",
      },
    ],
  },
];

const communityCategories = [
  "All",
  "Getting diagnosed",
  "College & work",
  "Masking",
  "Sensory experiences",
  "Relationships",
  "ADHD",
  "Autism",
  "General support",
];
/* =========================================================
   APP
========================================================= */

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("kobeity-user");
      return saved ? JSON.parse(saved) : { name: "Jane", email: "jane@example.com" };
    } catch {
      return { name: "Jane", email: "jane@example.com" };
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        const saved = localStorage.getItem("kobeity-user");
        if (saved) setUser(JSON.parse(saved));
      } catch (error) {
        console.error("Unable to update Kobeity user:", error);
      }
    };
    window.addEventListener("kobeity-user-updated", updateUser);
    return () => window.removeEventListener("kobeity-user-updated", updateUser);
  }, []);


  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem("kobeity-journal");

    return saved
      ? JSON.parse(saved)
      : defaultJournalEntries;
  });

  const navigation = [
    { name: "Home", icon: Home },
    { name: "Journal", icon: BookOpen },
    { name: "Patterns", icon: Activity },
    { name: "My Report", icon: FileText },
    { name: "Community", icon: Users },
    { name: "Resources", icon: Heart },
  ];

  useEffect(() => {
    localStorage.setItem(
      "kobeity-journal",
      JSON.stringify(journalEntries)
    );
  }, [journalEntries]);

  const changePage = (page) => {
    setActivePage(page);
    setMobileMenu(false);
  };

  const addJournalEntry = (entry) => {
    setJournalEntries((current) => [
      {
        ...entry,
        id: Date.now(),
        date: "Just now",
      },
      ...current,
    ]);
  };

  const deleteJournalEntry = (id) => {
    setJournalEntries((current) =>
      current.filter((entry) => entry.id !== id)
    );
  };

  return (
    <div className="app">
      <aside
  className={`sidebar ${
    mobileMenu ? "mobile-open" : ""
  }`}
>
  <div className="brand">
    <div className="brand-mark">K</div>

    <div>
      <div className="brand-name">KOBEITY</div>
      <div className="brand-tagline">
        For the Women.
      </div>
    </div>

    <button
      className="mobile-close"
      onClick={() => setMobileMenu(false)}
    >
      <X size={20} />
    </button>
  </div>

  <nav className="navigation">
    <div className="nav-label">YOUR SPACE</div>

    {navigation.map((item) => {
      const Icon = item.icon;

      return (
        <button
          key={item.name}
          className={`nav-item ${
            activePage === item.name
              ? "active"
              : ""
          }`}
          onClick={() => changePage(item.name)}
        >
          <Icon
            size={19}
            strokeWidth={1.8}
          />

          <span>{item.name}</span>
        </button>
      );
    })}
  </nav>

  <div className="sidebar-bottom">

    <button
      className={`nav-item ${
        activePage === "Settings"
          ? "active"
          : ""
      }`}
      onClick={() => changePage("Settings")}
    >
      <Settings
        size={19}
        strokeWidth={1.8}
      />

      <span>Settings</span>
    </button>

    <div className="privacy-card">
      <ShieldCheck size={18} />

      <div>
        <strong>Your space is private</strong>
        <p>Your experiences belong to you.</p>
      </div>
    </div>

  </div>
</aside>


{mobileMenu && (
  <div
    className="mobile-overlay"
    onClick={() => setMobileMenu(false)}
  />
)}


<main className="main">

  <header className="topbar">

    <button
      className="mobile-menu"
      onClick={() => setMobileMenu(true)}
    >
      <Menu size={22} />
    </button>

    <div className="breadcrumb">
      {activePage}
    </div>

    <div className="profile">
            <div className="profile-avatar">{(user.name || "J").charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <span>Welcome back</span>
              <strong>{user.name}</strong>
            </div>
          </div>

  </header>


  {/* HOME */}

  {activePage === "Home" && (
    <Dashboard
      changePage={changePage}
      journalEntries={journalEntries}
    />
  )}


  {/* JOURNAL */}

  {activePage === "Journal" && (
    <JournalPage
      entries={journalEntries}
      addEntry={addJournalEntry}
      deleteEntry={deleteJournalEntry}
    />
  )}


  {/* PATTERNS */}

  {activePage === "Patterns" && (
    <PatternsPage
      entries={journalEntries}
      onNavigate={changePage}
      onAnalysisComplete={(analysis) => {
        console.log(
          "Kobeity AI analysis:",
          analysis
        );
      }}
    />
  )}


  {/* REPORT */}

  {activePage === "My Report" && (
    <ReportPage />
  )}


  {/* COMMUNITY */}

  {activePage === "Community" && (
    <CommunityPage />
  )}


  {/* RESOURCES */}

  {activePage === "Resources" && (
    <ResourcesPage />
  )}


  {/* SETTINGS */}

  {activePage === "Settings" && (
    <SettingsPage />
  )}

</main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  changePage,
  journalEntries,
}) {
  const visibleEntries =
    journalEntries.slice(0, 3);

  return (
    <div className="content">
      <section className="hero">
        <div>
          <p className="eyebrow">
            YOUR PRIVATE SPACE
          </p>

          <h1>
            You deserve to
            <br />
            <span>understand yourself.</span>
          </h1>

          <p className="hero-text">
            A place to reflect on your experiences,
            recognize patterns, and prepare to advocate
            for yourself.
          </p>
        </div>

        <div className="hero-decoration">
          <Sparkles size={22} />
          <span>Take it one day at a time.</span>
        </div>
      </section>

      <section className="journal-prompt">
        <div className="prompt-icon">
          <BookOpen size={22} />
        </div>

        <div className="prompt-content">
          <p className="prompt-label">
            DAILY REFLECTION
          </p>

          <h2>How are you feeling today?</h2>

          <p>
            You don't need the right words. Just start
            where you are.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => changePage("Journal")}
        >
          Write in my journal
          <ArrowRight size={17} />
        </button>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              RECENT INSIGHTS
            </p>
            <h2>Your patterns</h2>
          </div>

          <button
            className="text-button"
            onClick={() => changePage("Patterns")}
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="pattern-grid">
          {initialPatterns.map((pattern) => (
            <div
              className="pattern-card"
              key={pattern.name}
            >
              <div className="pattern-top">
                <h3>{pattern.name}</h3>

                <span className="pattern-count">
                  {pattern.level}/5
                </span>
              </div>

              <div className="pattern-bars">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={
                      bar <= pattern.level
                        ? "filled"
                        : ""
                    }
                  />
                ))}
              </div>

              <p>{pattern.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              YOUR EXPERIENCES
            </p>
            <h2>Recent journal entries</h2>
          </div>

          <button
            className="text-button"
            onClick={() => changePage("Journal")}
          >
            Open journal
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="journal-list">
          {visibleEntries.map((entry, index) => (
            <div
              className="journal-card"
              key={entry.id}
            >
              <div className="journal-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="journal-entry-content">
                <p>"{entry.text}"</p>

                <span>
                  {entry.date} · {entry.category}
                </span>
              </div>

              <ArrowRight
                size={17}
                className="journal-arrow"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="report-card">
        <div className="report-icon">
          <FileText size={23} />
        </div>

        <div className="report-content">
          <p className="section-eyebrow">
            SELF-ADVOCACY
          </p>

          <h2>
            Turn your experiences into something you can
            communicate.
          </h2>

          <p>
            Kobeity can organize your journal entries and
            recurring patterns into a personal report you
            can take to a qualified professional.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => changePage("My Report")}
        >
          <Plus size={17} />
          My report
        </button>
      </section>

      <div className="disclaimer">
        <ShieldCheck size={17} />

        <p>
          Kobeity is not a diagnostic tool. It helps you
          document experiences and recognize patterns that
          you may wish to discuss with a qualified
          professional.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   JOURNAL PAGE
========================================================= */

function JournalPage({
  entries,
  addEntry,
  deleteEntry,
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [saved, setSaved] = useState(false);

  const saveEntry = () => {
    if (!text.trim()) return;

    addEntry({
      text: text.trim(),
      category: category || "Other",
    });

    setText("");
    setCategory("");
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="content">
      <section className="page-intro">
        <p className="section-eyebrow">
          YOUR EXPERIENCES
        </p>

        <h1>Journal</h1>

        <p>
          There is no right way to write here. Record what
          happened, how it felt, or anything you've been
          thinking about.
        </p>
      </section>

      <section className="journal-editor">
        <div className="editor-header">
          <div className="editor-icon">
            <PenLine size={19} />
          </div>

          <div>
            <h2>What happened today?</h2>
            <p>This space is for you.</p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder="Write freely. You can describe something that happened, something you found difficult, something that made you happy, or simply how today felt..."
        />

        <div className="editor-bottom">
          <div className="category-selector">
            <span>What was this about?</span>

            <div className="category-list">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category active"
                      : "category"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-button save-button"
            onClick={saveEntry}
            disabled={!text.trim()}
          >
            {saved ? (
              <>
                <Check size={17} />
                Saved
              </>
            ) : (
              <>
                Save entry
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              YOUR JOURNEY
            </p>
            <h2>Past entries</h2>
          </div>

          <span className="entry-count">
            {entries.length} entries
          </span>
        </div>

        <div className="journal-list">
          {entries.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={25} />

              <h3>Your journal is empty</h3>

              <p>
                Your first entry can be as simple as
                "Today was difficult."
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                className="journal-card"
                key={entry.id}
              >
                <div className="journal-number">
                  <BookOpen size={16} />
                </div>

                <div className="journal-entry-content">
                  <p>"{entry.text}"</p>

                  <span>
                    {entry.date} · {entry.category}
                  </span>
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteEntry(entry.id)
                  }
                  aria-label="Delete journal entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="journal-note">
        <ShieldCheck size={17} />

        <p>
          Your journal entries are currently stored only
          in this browser.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PATTERNS PAGE
========================================================= */

function PatternsPage({
  entries,
  onNavigate,
  onAnalysisComplete,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeExperiences = async () => {
    if (entries.length === 0) {
      setError(
        "Add some journal entries before running an analysis."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entries,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to analyze your experiences."
        );
      }

      setAnalysis(data.analysis);

      /* Save report so My Report can access it */
      const report = {
        analysis: data.analysis,
        generatedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "kobeity-report",
        JSON.stringify(report)
      );

      window.dispatchEvent(
        new Event("kobeity-report-updated")
      );

      if (onAnalysisComplete) {
        onAnalysisComplete(data.analysis);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while analyzing your experiences."
      );
    } finally {
      setLoading(false);
    }
  };

  const themes = analysis?.themes || [];

  const maxFrequency =
    themes.length > 0
      ? Math.max(
          ...themes.map(
            (theme) => theme.frequency
          )
        )
      : 1;

  return (
    <div className="content">
      <section className="page-intro">
        <p className="section-eyebrow">
          UNDERSTANDING YOUR EXPERIENCES
        </p>

        <h1>Your patterns</h1>

        <p>
          Kobeity looks across your journal entries and
          highlights recurring experiences. These
          observations are not a diagnosis.
        </p>
      </section>

      <section className="ai-analysis-card">
        <div className="ai-analysis-icon">
          <Sparkles size={21} />
        </div>

        <div className="ai-analysis-content">
          <p className="section-eyebrow">
            KOBEITY AI
          </p>

          <h2>
            Look for patterns in your experiences
          </h2>

          <p>
            Kobeity can review what you've written and
            identify recurring themes across your journal.
          </p>
        </div>

        <button
          className="primary-button analyze-button"
          onClick={analyzeExperiences}
          disabled={
            loading || entries.length === 0
          }
        >
          {loading ? (
            <>
              <span className="loading-dot" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze my experiences
            </>
          )}
        </button>
      </section>

      {error && (
        <div className="analysis-error">
          <span>Something went wrong</span>
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <>
          <section className="pattern-overview">
            <div className="overview-icon">
              <Activity size={23} />
            </div>

            <div>
              <p className="section-eyebrow">
                AI-GENERATED OVERVIEW
              </p>

              <h2>
                {themes.length} recurring{" "}
                {themes.length === 1
                  ? "theme"
                  : "themes"}{" "}
                found.
              </h2>

              <p>
                {analysis.overallSummary}
              </p>
            </div>
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">
                  RECURRING THEMES
                </p>

                <h2>
                  What you've been experiencing
                </h2>
              </div>
            </div>

            <div className="full-pattern-list">
              {themes.map((theme) => {
                const percentage = Math.max(
                  15,
                  (theme.frequency /
                    maxFrequency) *
                    100
                );

                return (
                  <div
                    className="full-pattern-card"
                    key={theme.name}
                  >
                    <div className="full-pattern-header">
                      <div>
                        <h3>{theme.name}</h3>

                        <p>
                          Mentioned{" "}
                          {theme.frequency}{" "}
                          {theme.frequency === 1
                            ? "time"
                            : "times"}{" "}
                          across your journal.
                        </p>
                      </div>

                      <span>
                        {theme.frequency}
                      </span>
                    </div>

                    <div className="large-pattern-bar">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="pattern-summary">
                      <p>{theme.summary}</p>
                    </div>

                    {theme.evidence &&
                      theme.evidence.length >
                        0 && (
                        <div className="pattern-example">
                          <span>
                            JOURNAL EVIDENCE
                          </span>

                          <p>
                            "
                            {theme.evidence[0]}
                            "
                          </p>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pattern-note">
            <ShieldCheck size={19} />

            <div>
              <strong>
                What this analysis means
              </strong>

              <p>
                Kobeity identifies recurring
                experiences from what you've written.
                It does not determine whether you have
                ADHD, autism, or any other condition.
                These observations can help you
                understand your experiences and decide
                what you may want to discuss with a
                qualified professional.
              </p>
            </div>
          </section>

          <section className="report-action-card">
            <div>
              <p className="section-eyebrow">
                SELF-ADVOCACY
              </p>

              <h2>
                Ready to understand the bigger picture?
              </h2>

              <p>
                Turn these observations into a personal
                experience report you can keep for
                yourself or discuss with a qualified
                professional.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                onNavigate("My Report")
              }
            >
              View my report
              <ArrowRight size={15} />
            </button>
          </section>
        </>
      )}

      {!analysis &&
        !loading &&
        !error && (
          <div className="analysis-empty">
            <Activity size={27} />

            <h3>
              Your patterns will appear here
            </h3>

            <p>
              Add a few journal entries, then let
              Kobeity look across your experiences for
              recurring themes.
            </p>
          </div>
        )}
    </div>
  );
}

/* =========================================================
   REPORT PAGE
========================================================= */

function ReportPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const loadReport = () => {
      const saved =
        localStorage.getItem(
          "kobeity-report"
        );

      if (saved) {
        try {
          setReport(JSON.parse(saved));
        } catch (error) {
          console.error(
            "Unable to load Kobeity report:",
            error
          );
        }
      }
    };

    loadReport();

    window.addEventListener(
      "kobeity-report-updated",
      loadReport
    );

    return () => {
      window.removeEventListener(
        "kobeity-report-updated",
        loadReport
      );
    };
  }, []);

  const downloadReport = () => {
    if (!report) return;

    const { analysis } = report;

    let content = "";

    content += "KOBEITY\n";
    content += "MY EXPERIENCE REPORT\n\n";

    content +=
      "A reflection based on your journal entries.\n\n";

    content +=
      "----------------------------------------\n\n";

    content += "OVERALL REFLECTION\n\n";

    content += `${
      analysis.overallSummary || ""
    }\n\n`;

    content += "RECURRING EXPERIENCES\n\n";

    analysis.themes.forEach(
      (theme, index) => {
        content += `${index + 1}. ${
          theme.name
        }\n`;

        content += `Frequency: ${
          theme.frequency
        } ${
          theme.frequency === 1
            ? "entry"
            : "entries"
        }\n\n`;

        content += `${theme.summary}\n\n`;

        if (
          theme.evidence &&
          theme.evidence.length > 0
        ) {
          content +=
            "Journal evidence:\n";

          theme.evidence.forEach(
            (evidence) => {
              content += `- "${evidence}"\n`;
            }
          );

          content += "\n";
        }

        content +=
          "----------------------------------------\n\n";
      }
    );

    content +=
      "QUESTIONS TO EXPLORE\n\n";

    content +=
      "• When do these experiences happen most often?\n";

    content +=
      "• What environments make them easier or harder?\n";

    content +=
      "• What forms of support have helped?\n";

    content +=
      "• Are there recurring situations that seem connected to these experiences?\n\n";

    content += "IMPORTANT NOTE\n\n";

    content +=
      "This report is a self-reflection and self-advocacy tool. ";

    content +=
      "It is not a medical diagnosis and should not be used to diagnose ADHD, autism, or any other condition.\n\n";

    content += `Generated by Kobeity on ${new Date(
      report.generatedAt
    ).toLocaleDateString()}.`;

    const blob = new Blob(
      [content],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "kobeity-experience-report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (!report) {
    return (
      <div className="content">
        <section className="page-intro">
          <p className="section-eyebrow">
            SELF-ADVOCACY
          </p>

          <h1>My Report</h1>

          <p>
            Your personal experience report will
            appear here after Kobeity analyzes your
            journal.
          </p>
        </section>

        <div className="report-empty">
          <FileText size={28} />

          <h3>No report yet</h3>

          <p>
            Add some journal entries and run an
            analysis from the Patterns page first.
          </p>
        </div>
      </div>
    );
  }

  const { analysis } = report;

  return (
    <div className="content report-page">
      <section className="report-header">
        <div>
          <p className="section-eyebrow">
            KOBEITY · SELF-ADVOCACY
          </p>

          <h1>My Experience Report</h1>

          <p>
            A reflection based on your journal entries
            and recurring experiences.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={downloadReport}
        >
          <Download size={15} />
          Download report
        </button>
      </section>

      <section className="report-summary">
        <div className="report-symbol">
          <Sparkles size={21} />
        </div>

        <div>
          <p className="section-eyebrow">
            OVERALL REFLECTION
          </p>

          <p className="report-summary-text">
            {analysis.overallSummary}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              RECURRING EXPERIENCES
            </p>

            <h2>
              What keeps showing up
            </h2>
          </div>
        </div>

        <div className="report-theme-list">
          {analysis.themes.map(
            (theme, index) => (
              <article
                className="report-theme"
                key={theme.name}
              >
                <div className="report-theme-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="report-theme-content">
                  <div className="report-theme-heading">
                    <div>
                      <h3>{theme.name}</h3>

                      <span>
                        {theme.frequency}{" "}
                        {theme.frequency === 1
                          ? "journal entry"
                          : "journal entries"}
                      </span>
                    </div>
                  </div>

                  <p className="report-theme-summary">
                    {theme.summary}
                  </p>

                  {theme.evidence &&
                    theme.evidence.length >
                      0 && (
                      <div className="report-evidence">
                        <span>
                          JOURNAL EVIDENCE
                        </span>

                        {theme.evidence.map(
                          (
                            evidence,
                            evidenceIndex
                          ) => (
                            <p
                              key={
                                evidenceIndex
                              }
                            >
                              "{evidence}"
                            </p>
                          )
                        )}
                      </div>
                    )}
                </div>
              </article>
            )
          )}
        </div>
      </section>

      <section className="explore-section">
        <div className="explore-heading">
          <p className="section-eyebrow">
            QUESTIONS TO EXPLORE
          </p>

          <h2>
            What might be worth noticing next?
          </h2>
        </div>

        <div className="question-grid">
          <div>
            <span>01</span>

            <p>
              When do these experiences happen most
              often?
            </p>
          </div>

          <div>
            <span>02</span>

            <p>
              What environments make them easier or
              harder?
            </p>
          </div>

          <div>
            <span>03</span>

            <p>
              What forms of support have helped you?
            </p>
          </div>

          <div>
            <span>04</span>

            <p>
              Are there recurring situations that seem
              connected?
            </p>
          </div>
        </div>
      </section>

      <section className="report-disclaimer">
        <ShieldCheck size={20} />

        <div>
          <strong>
            A reflection, not a diagnosis
          </strong>

          <p>
            This report reflects themes found in what
            you've written. It does not determine
            whether you have ADHD, autism, or another
            condition. You can use it as a starting
            point for self-reflection or a conversation
            with a qualified professional.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   COMMUNITY PAGE
========================================================= */

function CommunityPage() {
  const initialPosts = [
    {
      id: 1,
      category: "Getting diagnosed",
      text: "I sometimes feel like I have been masking for years without realizing it. Has anyone else experienced this?",
      author: "Anonymous",
      time: "2 hours ago",
      comments: [
        {
          id: 101,
          author: "Anonymous",
          time: "1 hour ago",
          text: "Yes. I only started noticing how much I was masking after learning more about myself.",
        },
        {
          id: 102,
          author: "Anonymous",
          time: "48 min ago",
          text: "I relate to this so much. It can take a while to recognize patterns that have been there for years.",
        },
        {
          id: 103,
          author: "Anonymous",
          time: "22 min ago",
          text: "Same here. You are definitely not alone in feeling this way.",
        },
      ],
    },

    {
      id: 2,
      category: "College & work",
      text: "Does anyone else find it exhausting trying to keep up with work while also pretending everything is completely fine?",
      author: "Anonymous",
      time: "5 hours ago",
      comments: [
        {
          id: 201,
          author: "Anonymous",
          time: "4 hours ago",
          text: "Absolutely. I usually need a lot more recovery time than people realize.",
        },
        {
          id: 202,
          author: "Anonymous",
          time: "3 hours ago",
          text: "I feel this especially after busy days with lots of people around.",
        },
      ],
    },

    {
      id: 3,
      category: "Masking",
      text: "I have gotten so used to adapting myself around other people that I sometimes don't know what I actually want anymore.",
      author: "Anonymous",
      time: "Yesterday",
      comments: [
        {
          id: 301,
          author: "Anonymous",
          time: "Yesterday",
          text: "It can be really difficult to separate what you genuinely enjoy from what you learned to do to fit in.",
        },
      ],
    },

    {
      id: 4,
      category: "Sensory experiences",
      text: "Certain sounds and crowded places can become overwhelming very quickly. What helps you when this happens?",
      author: "Anonymous",
      time: "Yesterday",
      comments: [
        {
          id: 401,
          author: "Anonymous",
          time: "Yesterday",
          text: "Having headphones with me makes a huge difference.",
        },
        {
          id: 402,
          author: "Anonymous",
          time: "Yesterday",
          text: "I try to find somewhere quiet for a few minutes when I can.",
        },
      ],
    },
  ];

  const categories = [
    "All",
    "Getting diagnosed",
    "College & work",
    "Masking",
    "Sensory experiences",
    "Relationships",
    "ADHD",
    "Autism",
    "General support",
  ];

  /* ---------------------------------------------------------
     LOAD POSTS
  --------------------------------------------------------- */

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "kobeity-community-posts"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "Could not load community posts:",
        error
      );
    }

    return initialPosts;
  });

  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* ---------------------------------------------------------
     SAVE POSTS
  --------------------------------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        "kobeity-community-posts",
        JSON.stringify(posts)
      );
    } catch (error) {
      console.error(
        "Could not save community posts:",
        error
      );
    }
  }, [posts]);

  /* ---------------------------------------------------------
     FILTER POSTS
  --------------------------------------------------------- */

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter(
          (post) =>
            post.category === selectedCategory
        );

  /* ---------------------------------------------------------
     COMMENTS
  --------------------------------------------------------- */

  const toggleComments = (postId) => {
    setActivePostId((current) =>
      current === postId ? null : postId
    );

    setCommentText("");
  };

  const addComment = (postId) => {
    const trimmedComment =
      commentText.trim();

    if (!trimmedComment) return;

    const newComment = {
      id: Date.now(),
      author: "Anonymous",
      time: "Just now",
      text: trimmedComment,
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...(Array.isArray(post.comments)
                  ? post.comments
                  : []),
                newComment,
              ],
            }
          : post
      )
    );

    setCommentText("");
    setActivePostId(postId);
  };

  const handleCommentKeyDown = (
    event,
    postId
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addComment(postId);
    }
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <div className="content community-page">

      {/* HEADER */}

      <section className="community-header">
        <div>
          <p className="section-eyebrow">
            COMMUNITY VOICES
          </p>

          <h1>
            Conversations from women
          </h1>

          <p className="community-intro">
            A quiet space to share experiences, ask
            questions, and connect with women who
            understand what you are going through.
          </p>
        </div>

        <div className="community-header-note">
          <span>
            Anonymous by default
          </span>
        </div>
      </section>

      {/* GUIDELINES */}

      <section className="community-guidelines">
        <ShieldCheck size={19} />

        <div>
          <strong>
            A supportive and private space
          </strong>

          <p>
            Posts and comments are anonymous.
            Please be kind, respectful, and
            supportive when responding to others.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTERS */}

      <div className="category-list community-category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category ${
              selectedCategory === category
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* FEED */}

      <section className="community-feed">

        <div className="community-feed-heading">
          <div>
            <p className="section-eyebrow">
              COMMUNITY VOICES
            </p>

            <h2>
              Conversations from women
            </h2>
          </div>

          <span>
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1
              ? "post"
              : "posts"}
          </span>
        </div>

        <div className="community-post-list">

          {filteredPosts.map((post) => {
            const comments = Array.isArray(
              post.comments
            )
              ? post.comments
              : [];

            const isOpen =
              activePostId === post.id;

            return (
              <article
                className="community-post"
                key={post.id}
              >

                {/* POST HEADER */}

                <div className="community-post-top">

                  <span className="community-post-category">
                    {post.category}
                  </span>

                  <span className="community-post-time">
                    {post.time}
                  </span>

                </div>

                {/* POST CONTENT */}

                <p className="community-post-text">
                  {post.text}
                </p>

                {/* POST FOOTER */}

                <div className="community-post-divider" />

                <div className="community-post-footer">

                  <div className="community-author">

                    <div className="community-avatar">
                      A
                    </div>

                    <div>
                      <strong>
                        {post.author ||
                          "Anonymous"}
                      </strong>

                      <span>
                        Community member
                      </span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className={`comments-button ${
                      isOpen ? "active" : ""
                    }`}
                    onClick={() =>
                      toggleComments(post.id)
                    }
                  >
                    <MessageCircle
                      size={15}
                      strokeWidth={1.8}
                    />

                    <span>
                      {comments.length}{" "}
                      {comments.length === 1
                        ? "comment"
                        : "comments"}
                    </span>

                    <ArrowRight
                      size={12}
                      className="comments-arrow"
                    />
                  </button>

                </div>

                {/* COMMENTS */}

                {isOpen && (
                  <div className="comments-section">

                    <div className="comments-heading">
                      <span>
                        COMMENTS
                      </span>

                      <span>
                        {comments.length}
                      </span>
                    </div>

                    {comments.length > 0 ? (
                      <div className="comments-list">

                        {comments.map(
                          (comment) => (
                            <div
                              className="community-comment"
                              key={comment.id}
                            >

                              <div className="comment-avatar">
                                A
                              </div>

                              <div className="comment-content">

                                <div className="comment-meta">

                                  <strong>
                                    {comment.author ||
                                      "Anonymous"}
                                  </strong>

                                  <span>
                                    {comment.time ||
                                      "Just now"}
                                  </span>

                                </div>

                                <p>
                                  {comment.text}
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    ) : (
                      <div className="no-comments">

                        <p>
                          No comments yet.
                        </p>

                        <span>
                          Be the first woman to
                          respond.
                        </span>

                      </div>
                    )}

                    {/* COMMENT INPUT */}

                    <div className="comment-form">

                      <input
                        type="text"
                        value={commentText}
                        onChange={(event) =>
                          setCommentText(
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          handleCommentKeyDown(
                            event,
                            post.id
                          )
                        }
                        placeholder="Write a supportive response..."
                        maxLength={500}
                      />

                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          addComment(post.id)
                        }
                        disabled={
                          !commentText.trim()
                        }
                      >
                        Comment

                        <ArrowRight
                          size={14}
                        />
                      </button>

                    </div>

                  </div>
                )}

              </article>
            );
          })}

        </div>

      </section>

      {/* EMPTY FILTER STATE */}

      {filteredPosts.length === 0 && (
        <div className="empty-state">

          <MessageCircle size={26} />

          <h3>
            No conversations yet
          </h3>

          <p>
            There are no posts in this
            category right now.
          </p>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

/* =========================================================
   RESOURCES PAGE
========================================================= */

function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");
  const [webResults, setWebResults] = useState([]);
  const [webSummary, setWebSummary] = useState("");
  const [webLoading, setWebLoading] = useState(false);
  const [webError, setWebError] = useState("");   
  const [expandedId, setExpandedId] = useState(null);

  const [hasSearchedWeb, setHasSearchedWeb] =
    useState(false);


  // ==========================================
  // KOBEITY CURATED RESOURCES
  // ==========================================

  const resources = [
    {
      id: 1,
      category: "Understanding yourself",
      title: "Understanding masking",
      description:
        "Masking can involve changing or hiding parts of yourself to fit social expectations. Learning to notice when you do this can be a useful part of self-reflection.",
      points: [
        "Notice situations where you feel pressure to behave differently.",
        "Pay attention to how you feel before and after social situations.",
        "Write down behaviours that feel natural versus behaviours that feel performed.",
      ],
    },

    {
      id: 2,
      category: "Understanding yourself",
      title: "Understanding sensory experiences",
      description:
        "Some people experience sounds, lights, textures, crowds, or other sensory information more intensely than others.",
      points: [
        "Notice which environments feel comfortable or overwhelming.",
        "Record what sensory factors were present.",
        "Write down what helped you feel more comfortable.",
      ],
    },

    {
      id: 3,
      category: "Understanding yourself",
      title: "Difficulty getting started",
      description:
        "Knowing what you need to do does not always make it easy to begin. Recording these experiences can help you understand when task initiation becomes difficult.",
      points: [
        "Break large tasks into very small first steps.",
        "Record what makes starting easier or harder.",
        "Notice whether deadlines, environments, or distractions affect you.",
      ],
    },

    {
      id: 4,
      category: "Self-advocacy",
      title: "Preparing for a professional appointment",
      description:
        "A collection of specific examples can make it easier to explain your experiences to a qualified professional.",
      points: [
        "Bring examples from different situations.",
        "Describe how often something happens and how it affects you.",
        "Bring questions you want to ask.",
        "Your journal and personal report can be useful starting points.",
      ],
    },

    {
      id: 5,
      category: "Self-advocacy",
      title: "Explaining what you need",
      description:
        "Self-advocacy means communicating your experiences, needs, and boundaries clearly.",
      points: [
        "Describe the situation rather than judging yourself.",
        "Explain what makes the situation difficult.",
        "Say what kind of support would make things easier.",
      ],
    },

    {
      id: 6,
      category: "College & work",
      title: "Making difficult tasks more manageable",
      description:
        "When a task feels overwhelming, changing how you approach it can sometimes make the first step easier.",
      points: [
        "Choose one small action to begin with.",
        "Separate planning from actually completing the task.",
        "Use reminders or written steps when helpful.",
        "Give yourself enough time rather than relying entirely on last-minute pressure.",
      ],
    },

    {
      id: 7,
      category: "College & work",
      title: "Recognizing burnout and overload",
      description:
        "Keeping track of energy, workload, social demands, and recovery time can help you notice patterns in difficult periods.",
      points: [
        "Record what your days looked like before you felt overwhelmed.",
        "Notice whether recovery time changes how you feel.",
        "Look for repeated situations rather than judging yourself for individual difficult days.",
      ],
    },

    {
      id: 8,
      category: "Support & wellbeing",
      title: "Creating a recovery routine",
      description:
        "After demanding situations, having a few reliable ways to decompress can make recovery feel more intentional.",
      points: [
        "Identify environments where you feel calm.",
        "Keep a short list of activities that help you reset.",
        "Give yourself permission to take breaks when you need them.",
      ],
    },

    {
      id: 9,
      category: "Support & wellbeing",
      title: "When to seek professional support",
      description:
        "If your experiences are significantly affecting your education, work, relationships, daily life, or wellbeing, consider speaking with an appropriately qualified professional.",
      points: [
        "You do not need to have everything figured out before asking for help.",
        "Bring specific examples of what you have been experiencing.",
        "Ask questions about the assessment or support process.",
      ],
    },
  ];


  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "All",
    "Understanding yourself",
    "Self-advocacy",
    "College & work",
    "Support & wellbeing",
  ];


  // ==========================================
  // FILTER CURATED RESOURCES
  // ==========================================

  const filteredResources = resources.filter(
    (resource) => {
      const matchesCategory =
        selectedCategory === "All" ||
        resource.category === selectedCategory;

      const searchText =
        `${resource.title} ${resource.description} ${resource.category}`
          .toLowerCase();

      const matchesSearch =
        !search.trim() ||
        searchText.includes(
          search.toLowerCase().trim()
        );

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );


  // ==========================================
  // WEB SEARCH
  // ==========================================

  const searchWeb = async () => {
    const query = search.trim();

    if (!query) {
      return;
    }

    setWebLoading(true);
    setWebError("");
    setWebResults([]);
    setWebSummary("");
    setHasSearchedWeb(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/resources/search",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to search resources."
        );
      }

      setWebResults(
        Array.isArray(data.resources)
          ? data.resources
          : []
      );

      setWebSummary(
        data.summary || ""
      );

    } catch (error) {
      console.error(
        "Resource search error:",
        error
      );

      setWebError(
        error.message ||
          "Unable to search for resources."
      );

    } finally {
      setWebLoading(false);
    }
  };


  // ==========================================
  // SEARCH ENTER KEY
  // ==========================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      searchWeb();
    }
  };

  const searchWebResources = async () => {
  const query = search.trim();

  if (!query) {
    setWebResults([]);
    setWebSummary("");
    setWebError("");
    return;
  }

  setWebLoading(true);
  setWebError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/resources/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to search resources."
      );
    }

    setWebResults(
      Array.isArray(data.resources)
        ? data.resources
        : []
    );

    setWebSummary(data.summary || "");
  } catch (error) {
    console.error(
      "Resource search error:",
      error
    );

    setWebResults([]);
    setWebSummary("");
    setWebError(
      error.message ||
        "Unable to search for resources right now."
    );
  } finally {
    setWebLoading(false);
  }
};
  // ==========================================
  // TOGGLE CURATED RESOURCE
  // ==========================================

  const toggleResource = (id) => {
    setExpandedId((current) =>
      current === id ? null : id
    );
  };


  return (
    <div className="content resources-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="page-intro resources-intro">

        <p className="section-eyebrow">
          KOBEITY RESOURCE LIBRARY
        </p>

        <h1>
          Learn more about
          <br />
          <span>your experiences.</span>
        </h1>

        <p>
          Explore practical information about
          self-understanding, self-advocacy, college,
          work, and finding support.
        </p>

      </section>


      {/* ======================================
          SEARCH
      ====================================== */}

      <section className="resources-search">

        <div className="resources-search-box">

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path d="m20 20-4-4" />
          </svg>

          <input
  type="text"
  value={search}
  onChange={(event) =>
    setSearch(event.target.value)
  }
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      searchWebResources();
    }
  }}
  placeholder="Search resources..."
/> 
<button
  type="button"
  onClick={searchWebResources}
  aria-label="Search web resources"
>
  <Search size={16} />
</button>

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setWebResults([]);
                setWebSummary("");
                setWebError("");
                setHasSearchedWeb(false);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>

        <button
          type="button"
          className="secondary-button"
          style={{
            marginTop: "10px",
          }}
          onClick={searchWeb}
          disabled={
            !search.trim() ||
            webLoading
          }
        >
          {webLoading
            ? "Searching..."
            : "Search the web"}
        </button>

      </section>


      {/* ======================================
          CATEGORY FILTERS
      ====================================== */}

      <div className="category-list resources-category-list">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category ${
              selectedCategory === category
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}

      </div>


      {/* ======================================
          FEATURED
      ====================================== */}

      {selectedCategory === "All" &&
        !search && (
          <section className="resources-featured">

            <div className="resources-featured-icon">
              <Heart size={21} />
            </div>

            <div>

              <p className="section-eyebrow">
                A PLACE TO START
              </p>

              <h2>
                Start with your own experiences.
              </h2>

              <p>
                You don't need to identify yourself with
                a label to learn more about what you
                experience. Kobeity is here to help you
                notice patterns, ask questions, and
                communicate what you need.
              </p>

            </div>

          </section>
        )}


      {/* ======================================
          CURATED RESOURCES
      ====================================== */}

      <section className="section resources-section">

        <div className="section-heading">

          <div>

            <p className="section-eyebrow">
              KOBEITY CURATED RESOURCES
            </p>

            <h2>
              {search
                ? "Matching resources"
                : selectedCategory === "All"
                ? "Explore resources"
                : selectedCategory}
            </h2>

          </div>

          <span className="entry-count">
            {filteredResources.length}{" "}
            {filteredResources.length === 1
              ? "resource"
              : "resources"}
          </span>

        </div>


        {filteredResources.length > 0 ? (

          <div className="resources-list">

            {filteredResources.map(
              (resource) => {

                const isExpanded =
                  expandedId === resource.id;

                return (
                  <article
                    className={`resource-card ${
                      isExpanded
                        ? "expanded"
                        : ""
                    }`}
                    key={resource.id}
                  >

                    <button
                      type="button"
                      className="resource-card-button"
                      onClick={() =>
                        toggleResource(
                          resource.id
                        )
                      }
                    >

                      <div className="resource-card-number">
                        {String(
                          resource.id
                        ).padStart(2, "0")}
                      </div>

                      <div className="resource-card-main">

                        <span className="resource-category">
                          {resource.category}
                        </span>

                        <h3>
                          {resource.title}
                        </h3>

                        <p>
                          {resource.description}
                        </p>

                      </div>

                      <div className="resource-card-arrow">
                        {isExpanded ? (
                          <X size={17} />
                        ) : (
                          <ArrowRight size={17} />
                        )}
                      </div>

                    </button>


                    {isExpanded && (
                      <div className="resource-expanded">

                        <div className="resource-expanded-inner">

                          <p className="resource-learn-label">
                            THINGS YOU CAN TRY
                          </p>

                          <ul>
                            {resource.points.map(
                              (
                                point,
                                index
                              ) => (
                                <li
                                  key={index}
                                >
                                  <Check
                                    size={15}
                                  />

                                  <span>
                                    {point}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>

                        </div>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>

        ) : (

          <div className="empty-state">

            <BookOpen size={27} />

            <h3>
              No curated resources found
            </h3>

            <p>
              Try searching the web for more
              information.
            </p>

          </div>

        )}

      </section>


      {/* ======================================
          WEB RESULTS
      ====================================== */}

      {hasSearchedWeb && (
        <section className="resource-web-results">

          <div className="resource-web-results-header">

            <div>

              <p className="section-eyebrow">
                WEB RESULTS
              </p>

              <h2>
                Resources from the web
              </h2>

            </div>

            {webResults.length > 0 && (
              <span className="resource-web-results-count">
                {webResults.length}{" "}
                {webResults.length === 1
                  ? "result"
                  : "results"}
              </span>
            )}

          </div>


          {webLoading && (
            <div className="resource-search-loading">

              <div className="resource-search-spinner" />

              <span>
                Searching trusted resources...
              </span>

            </div>
          )}


          {!webLoading && webError && (
            <div className="empty-state">

              <BookOpen size={27} />

              <h3>
                Search unavailable
              </h3>

              <p>
                {webError}
              </p>

            </div>
          )}


          {!webLoading &&
            !webError &&
            webSummary && (
              <p
                style={{
                  marginBottom: "18px",
                  color: "#776c72",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  maxWidth: "700px",
                }}
              >
                {webSummary}
              </p>
            )}


          {!webLoading &&
            !webError &&
            webResults.length > 0 && (

              <div className="resource-web-list">

                {webResults.map(
                  (resource, index) => (

                    <a
                      key={`${resource.url}-${index}`}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-web-card"
                    >

                      <div className="resource-web-source">
                        WEB RESULT
                        <span>·</span>
                        {resource.source}
                      </div>

                      <h3>
                        {resource.title}
                      </h3>

                      <p>
                        {resource.description}
                      </p>

                      <div className="resource-web-card-footer">
                        Open resource
                        <ArrowRight size={13} />
                      </div>

                    </a>

                  )
                )}

              </div>
            )
          }


          {!webLoading &&
            !webError &&
            hasSearchedWeb &&
            webResults.length === 0 && (

              <div className="empty-state">

                <BookOpen size={27} />

                <h3>
                  No web resources found
                </h3>

                <p>
                  Try using a broader search term.
                </p>

              </div>
            )}

        </section>
      )}
      {/* WEB SEARCH RESULTS */}

{search.trim() && (
  <section className="resource-web-results">

    <div className="resource-web-results-header">

      <div>
        <p className="section-eyebrow">
          WEB SEARCH
        </p>

        <h2>
          More resources for "{search}"
        </h2>
      </div>

      {!webLoading &&
        webResults.length > 0 && (
          <span className="resource-web-results-count">
            {webResults.length} web{" "}
            {webResults.length === 1
              ? "result"
              : "results"}
          </span>
        )}

    </div>


    {/* LOADING */}

    {webLoading && (
      <div className="resource-search-loading">

        <span className="resource-search-spinner" />

        <span>
          Searching trusted web resources...
        </span>

      </div>
    )}


    {/* ERROR */}

    {!webLoading && webError && (
      <div className="empty-state">

        <BookOpen size={27} />

        <h3>
          Search unavailable
        </h3>

        <p>
          {webError}
        </p>

      </div>
    )}


    {/* SUMMARY */}

    {!webLoading &&
      !webError &&
      webSummary && (
        <p
          style={{
            marginBottom: "18px",
            color: "#776c72",
            fontSize: "13px",
            lineHeight: "1.7",
            maxWidth: "700px",
          }}
        >
          {webSummary}
        </p>
      )}


    {/* RESULTS */}

    {!webLoading &&
      !webError &&
      webResults.length > 0 && (

        <div className="resource-web-list">

          {webResults.map(
            (resource, index) => (

              <a
                key={`${resource.url}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-web-card"
              >

                <div className="resource-web-source">

                  <span>
                    WEB RESULT
                  </span>

                  <span>·</span>

                  <span>
                    {resource.source}
                  </span>

                </div>


                <h3>
                  {resource.title}
                </h3>


                <p>
                  {resource.description}
                </p>


                <div className="resource-web-card-footer">

                  <span>
                    Open resource
                  </span>

                  <ArrowRight size={13} />

                </div>

              </a>

            )
          )}

        </div>

      )}


    {/* NO RESULTS */}

    {!webLoading &&
      !webError &&
      webResults.length === 0 &&
      !webSummary && (
        <div className="empty-state">

          <BookOpen size={27} />

          <h3>
            No web resources found
          </h3>

          <p>
            Try using different search terms.
          </p>

        </div>
      )}

  </section>
)}

      {/* ======================================
          PROFESSIONAL SUPPORT NOTE
      ====================================== */}

      <section className="resources-support-note">

        <ShieldCheck size={20} />

        <div>

          <strong>
            Information, not diagnosis
          </strong>

          <p>
            These resources are intended for
            education and self-reflection. They cannot
            determine whether someone has ADHD, autism,
            or another condition. If you have concerns
            about your experiences, consider discussing
            them with a qualified professional.
          </p>

        </div>

      </section>

    </div>
  );
}
function SettingsPage() {
  const loadUser = () => {
    try {
      const saved = localStorage.getItem("kobeity-user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { name: parsed.name || "Jane", email: parsed.email || "jane@example.com" };
      }
    } catch (error) {
      console.error("Unable to load Kobeity user:", error);
    }
    return { name: "Jane", email: "jane@example.com" };
  };

  const [user, setUser] = useState(loadUser);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(user);
  const [patternAnalysis, setPatternAnalysis] = useState(() => {
    return localStorage.getItem("kobeity-pattern-analysis") !== "false";
  });

  const saveUser = () => {
    const next = {
      name: draft.name.trim() || "Jane",
      email: draft.email.trim() || "jane@example.com",
    };
    setUser(next);
    localStorage.setItem("kobeity-user", JSON.stringify(next));
    window.dispatchEvent(new Event("kobeity-user-updated"));
    setEditing(null);
  };

  const startEditing = (field) => {
    setDraft(user);
    setEditing(field);
  };

  const togglePatternAnalysis = () => {
    setPatternAnalysis((current) => {
      const next = !current;
      localStorage.setItem("kobeity-pattern-analysis", String(next));
      return next;
    });
  };

  const clearJournal = () => {
    if (!window.confirm("Clear all journal entries? This cannot be undone.")) return;
    localStorage.removeItem("kobeity-journal");
    window.dispatchEvent(new Event("kobeity-journal-cleared"));
    alert("Your journal entries have been cleared.");
  };

  return (
    <div className="content settings-page">
      <section className="page-intro settings-intro">
        <p className="section-eyebrow">KOBEITY SETTINGS</p>
        <h1>Your space,<br /><span>your preferences.</span></h1>
        <p>Manage your profile, privacy, and Kobeity experience.</p>
      </section>

      <section className="settings-section">
        <p className="section-eyebrow">ACCOUNT</p>
        <div className="settings-card">
          <div className="settings-profile">
            <div className="settings-avatar">{(user.name || "J").charAt(0).toUpperCase()}</div>
            <div><strong>{user.name}</strong><span>{user.email}</span></div>
          </div>
          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content"><strong>Name</strong><span>{user.name}</span></div>
            {editing === "name" ? (
              <div className="settings-edit-group">
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoFocus />
                <button type="button" className="secondary-button" onClick={saveUser}>Save</button>
              </div>
            ) : (
              <button type="button" className="secondary-button" onClick={() => startEditing("name")}>Edit</button>
            )}
          </div>

          <div className="settings-divider" />

          <div className="settings-row">
            <div className="settings-row-content"><strong>Email</strong><span>{user.email}</span></div>
            {editing === "email" ? (
              <div className="settings-edit-group">
                <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} autoFocus />
                <button type="button" className="secondary-button" onClick={saveUser}>Save</button>
              </div>
            ) : (
              <button type="button" className="secondary-button" onClick={() => startEditing("email")}>Edit</button>
            )}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <p className="section-eyebrow">JOURNAL & PRIVACY</p>
        <div className="settings-card">
          <div className="settings-row settings-row-static">
            <div className="settings-row-icon"><ShieldCheck size={19} /></div>
            <div className="settings-row-content"><strong>Your experiences are private</strong><span>Your journal entries and personal reflections are stored locally in this browser.</span></div>
          </div>
          <div className="settings-divider" />
          <div className="settings-row settings-row-static">
            <div className="settings-row-icon"><Lock size={19} /></div>
            <div className="settings-row-content"><strong>Personal reflection data</strong><span>Kobeity uses your saved journal data when generating your pattern analysis.</span></div>
          </div>
          <div className="settings-divider" />
          <button type="button" className="settings-row settings-danger-row" onClick={clearJournal}>
            <div className="settings-icon"><Trash2 size={19} /></div>
            <div className="settings-row-content"><strong>Clear journal entries</strong><span>Permanently remove the journal entries saved on this device.</span></div>
            <ArrowRight size={18} className="settings-arrow" />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <p className="section-eyebrow">AI & PATTERNS</p>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-icon"><Sparkles size={19} /></div>
            <div className="settings-row-content"><strong>Pattern analysis</strong><span>Allow Kobeity to analyze your journal for recurring experiences.</span></div>
            <button type="button" className={`settings-toggle ${patternAnalysis ? "active" : ""}`} onClick={togglePatternAnalysis} aria-label={patternAnalysis ? "Disable pattern analysis" : "Enable pattern analysis"}><span /></button>
          </div>
        </div>
        <div className="settings-info"><ShieldCheck size={19} /><p>Pattern analysis identifies recurring experiences from what you write. It does not diagnose medical conditions.</p></div>
      </section>

      <section className="settings-section">
        <p className="section-eyebrow">ABOUT KOBEITY</p>
        <div className="settings-card">
          <div className="settings-row settings-row-static">
            <div className="settings-icon"><Heart size={19} /></div>
            <div className="settings-row-content"><strong>About Kobeity</strong><span>A private space for reflection, self-understanding, and self-advocacy.</span></div>
          </div>
          <div className="settings-divider" />
          <div className="settings-row settings-row-static">
            <div className="settings-icon"><FileText size={19} /></div>
            <div className="settings-row-content"><strong>Privacy & information</strong><span>Your journal and profile preferences are stored in your browser for this MVP.</span></div>
          </div>
        </div>
      </section>

      <div className="settings-footer"><span>KOBEITY</span><span>Your space is private.</span></div>
    </div>
  );
}
export default App;