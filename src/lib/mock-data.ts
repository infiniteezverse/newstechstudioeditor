export interface Article {
  id: string;
  title: string;
  source: string;
  category: "DeFi" | "Layer2" | "AI" | "Regulation" | "Markets" | "Infrastructure";
  summary: string;
  content: string;
  timestamp: string;
  readTime: number;
  tags: string[];
  trending: boolean;
  sentiment: "bullish" | "bearish" | "neutral";
  url: string;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Base Network Hits 10M Daily Transactions as Coinbase Doubles L2 Infrastructure Bet",
    source: "cryptonewsorg.com",
    category: "Layer2",
    summary: "Coinbase's Base network has crossed 10 million daily transactions, cementing its position as the highest-throughput Ethereum L2. The milestone arrives as Coinbase announces $500M in additional infrastructure investment.",
    content: "Coinbase's Base L2 network surpassed 10 million daily transactions this week, a milestone that underscores the accelerating migration of on-chain activity from Ethereum mainnet to cheaper, faster settlement layers. The figure represents a 340% year-over-year increase and puts Base ahead of both Arbitrum and Optimism in raw throughput. Coinbase simultaneously announced $500M in infrastructure expansion, with the majority earmarked for sequencer decentralization—a move that addresses the network's most persistent critic talking point. The investment will be deployed across Q3 and Q4 2026.",
    timestamp: "2026-06-01T08:30:00Z",
    readTime: 4,
    tags: ["Base", "Coinbase", "Layer2", "Ethereum"],
    trending: true,
    sentiment: "bullish",
    url: "#",
  },
  {
    id: "2",
    title: "SEC Drops Long-Running Uniswap Investigation After Congressional Crypto Framework Passes",
    source: "cryptonewsorg.com",
    category: "Regulation",
    summary: "The SEC formally closed its investigation into Uniswap Labs following the passage of the Digital Asset Market Structure Act. The agency cited the new legislative framework as rendering the enforcement action moot.",
    content: "The Securities and Exchange Commission on Friday formally closed its multi-year investigation into Uniswap Labs, the company behind the world's largest decentralized exchange. The closure notice, filed in federal court, cited the Digital Asset Market Structure Act—passed by Congress last month—as establishing a clear regulatory pathway that renders the original enforcement theory legally ambiguous. Uniswap Labs CEO Hayden Adams called the decision 'vindication for the principle that open-source software is speech, not securities fraud.'",
    timestamp: "2026-06-01T07:15:00Z",
    readTime: 5,
    tags: ["SEC", "Uniswap", "Regulation", "DeFi"],
    trending: true,
    sentiment: "bullish",
    url: "#",
  },
  {
    id: "3",
    title: "Ethereum's EIP-7935 Slashes State Growth by 60%—Devs Target September Fork",
    source: "cryptonewsorg.com",
    category: "Infrastructure",
    summary: "A new EIP targeting Ethereum's state bloat problem has passed ACD review with rough consensus. If shipped in the Osaka hard fork, it would dramatically reduce the cost of running full nodes.",
    content: "Ethereum's All Core Developers call this week approved EIP-7935, a proposal that introduces a novel state expiry scheme designed to cut historical state growth by approximately 60%. The EIP has been under development for 18 months and resolves earlier objections around witness data complexity by separating the expiry epoch logic into a dedicated precompile. Client teams tentatively targeted the Osaka hard fork in September 2026, though final activation timing depends on testing cycles across Geth, Nethermind, Besu, and Erigon.",
    timestamp: "2026-06-01T06:45:00Z",
    readTime: 6,
    tags: ["Ethereum", "EIP", "Infrastructure", "Nodes"],
    trending: false,
    sentiment: "neutral",
    url: "#",
  },
  {
    id: "4",
    title: "BlackRock's On-Chain Treasury Fund Crosses $8B AUM—Wall Street's DeFi Pivot Accelerates",
    source: "cryptonewsorg.com",
    category: "DeFi",
    summary: "BUIDL, BlackRock's tokenized treasury fund on Ethereum, has surpassed $8 billion in assets under management, making it the largest tokenized real-world asset vehicle ever. Traditional finance's on-chain migration is accelerating.",
    content: "BlackRock's BUIDL fund crossed $8 billion in AUM this week, a figure that would rank it among the top 50 money market funds in the United States if measured by traditional metrics. The fund, which issues ERC-20 tokens representing fractional ownership in a basket of US Treasuries, has attracted capital from sovereign wealth funds in the Gulf, a cluster of European pension managers, and an expanding roster of DeFi protocols using it as yield-bearing collateral. The milestone validates years of advocacy from tokenization proponents who argued institutional capital would eventually follow the yield differential.",
    timestamp: "2026-05-31T20:00:00Z",
    readTime: 5,
    tags: ["BlackRock", "RWA", "DeFi", "Tokenization"],
    trending: true,
    sentiment: "bullish",
    url: "#",
  },
  {
    id: "5",
    title: "Anthropic Releases Claude 4.8 with 2M Context Window and Native Code Execution",
    source: "cryptonewsorg.com",
    category: "AI",
    summary: "Anthropic's latest model ships with a 2-million token context window and sandboxed code execution built directly into the base model—no tool use required. Benchmarks show 40% improvement on agentic tasks.",
    content: "Anthropic released Claude 4.8 today, introducing a 2-million token native context window and what the company calls Embedded Execution—a sandboxed runtime baked into the model weights rather than surfaced as an external tool call. The architectural shift means code generation and execution occur in a single forward pass for qualifying tasks, eliminating the round-trip latency that limited earlier agentic workflows. Independent benchmarks on SWE-bench Verified show a 40% improvement over Claude 4.7.",
    timestamp: "2026-05-31T16:30:00Z",
    readTime: 4,
    tags: ["Anthropic", "Claude", "AI", "LLM"],
    trending: true,
    sentiment: "bullish",
    url: "#",
  },
  {
    id: "6",
    title: "MakerDAO's $500M ETH Collateral Liquidation Triggers Flash Crash Below $3,200",
    source: "cryptonewsorg.com",
    category: "Markets",
    summary: "A large forced liquidation of ETH collateral in MakerDAO's Spark protocol caused a 7-minute flash crash on centralized exchanges. The incident has reignited debate about cascading liquidation risks in DeFi.",
    content: "A $500 million ETH liquidation event in MakerDAO's Spark protocol Tuesday morning triggered a 12% price spike downward that briefly pulled spot ETH below $3,200 across major centralized exchanges before recovering. The liquidation, triggered by a combination of oracle lag and thin order book depth in early Asian trading hours, has renewed scrutiny on the feedback loops between DeFi liquidation mechanisms and CEX spot markets. Three protocols using ETH as collateral reported secondary liquidations totaling an additional $180M.",
    timestamp: "2026-05-31T11:20:00Z",
    readTime: 5,
    tags: ["MakerDAO", "ETH", "DeFi", "Liquidation"],
    trending: false,
    sentiment: "bearish",
    url: "#",
  },
];

export const CATEGORY_COLORS: Record<Article["category"], string> = {
  DeFi: "text-cyan-400",
  Layer2: "text-violet-400",
  AI: "text-amber-400",
  Regulation: "text-rose-400",
  Markets: "text-emerald-400",
  Infrastructure: "text-blue-400",
};

export const SENTIMENT_CONFIG = {
  bullish: { label: "Bullish", color: "text-emerald-400", dot: "bg-emerald-400" },
  bearish: { label: "Bearish", color: "text-rose-400", dot: "bg-rose-400" },
  neutral: { label: "Neutral", color: "text-[var(--text-muted)]", dot: "bg-[var(--text-muted)]" },
};
