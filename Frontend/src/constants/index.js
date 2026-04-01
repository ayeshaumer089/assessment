export const MODELS = [
  // ── OpenAI ────────────────────────────────────────────────────────
  {id:'gpt5',           icon:'🧠',bg:'#F0F9FF',name:'GPT-5.4 Omni',       lab:'OpenAI',org:'OpenAI',desc:'Native computer-use agents, improved reasoning, 1M+ context window. The new frontier of general intelligence.',tags:['Language','Vision','Audio','Computer Use'],badge:'hot',badgeClass:'badge-hot',rating:4.9,reviews:1240,price:'$2.50/1M tk',types:['language','vision','audio','agents'],price_start:2.5},
  {id:'gpt-o1',         icon:'🧪',bg:'#F0F9FF',name:'GPT-o1-preview',    lab:'OpenAI',org:'OpenAI',desc:'Advanced reasoning for complex math and coding. Thinking before answering for higher accuracy.',tags:['Reasoning','Math','Coding'],badge:'',badgeClass:'',rating:4.8,reviews:820,price:'$15/1M tk',types:['language','code'],price_start:15.0},
  {id:'gpt4o',          icon:'⚡',bg:'#F0F9FF',name:'GPT-4o',             lab:'OpenAI',org:'OpenAI',desc:'Fast, multimodal flagship model. Perfect for real-time interaction and high-quality creative work.',tags:['Fast','Multimodal','Vision'],badge:'',badgeClass:'',rating:4.7,reviews:3400,price:'$5/1M tk',types:['language','vision','audio'],price_start:5.0},
  {id:'gpt-image',      icon:'🖼',bg:'#F0F9FF',name:'DALL·E 3',           lab:'OpenAI',org:'OpenAI',desc:'The most advanced image generation model. Unparalleled adherence to complex prompts and text.',tags:['Image Gen','DALL·E','Creative'],badge:'',badgeClass:'',rating:4.6,reviews:1800,price:'$0.04/img',types:['image_gen'],price_start:8.0},
  {id:'sora2',          icon:'🎬',bg:'#F0F9FF',name:'Sora 2.0',           lab:'OpenAI',org:'OpenAI',desc:'Generate high-fidelity videos up to 1 minute from text prompts. Physics-aware cinematic world modeling.',tags:['Video Gen','Cinematic','Physics'],badge:'new',badgeClass:'badge-new',rating:4.9,reviews:420,price:'$30/1M tk',types:['video'],price_start:30.0},

  // ── Anthropic ─────────────────────────────────────────────────────
  {id:'claude-opus',    icon:'👑',bg:'#FDF2F0',name:'Claude 3.7 Opus',    lab:'Anthropic',org:'Anthropic',desc:'Anthropic flagship — most intelligent, nuanced, and best at complex coding and agentic tasks.',tags:['Intelligence','Coding','Agents'],badge:'hot',badgeClass:'badge-hot',rating:4.9,reviews:1100,price:'$15/1M tk',types:['language','code','agents'],price_start:15.0},
  {id:'claude-sonnet',  icon:'⚡',bg:'#FDF2F0',name:'Claude 3.7 Sonnet',  lab:'Anthropic',org:'Anthropic',desc:'Best balance of speed and intelligence. Adaptive Thinking mode and computer-use support.',tags:['Balanced','Fast','Adaptive'],badge:'new',badgeClass:'badge-new',rating:4.8,reviews:2600,price:'$3/1M tk',types:['language','vision','code','agents'],price_start:3.0},
  {id:'claude-haiku',   icon:'🚀',bg:'#FDF2F0',name:'Claude 3.5 Haiku',   lab:'Anthropic',org:'Anthropic',desc:'Near-frontier intelligence at sub-second speeds. The best value for high-volume tasks.',tags:['Fast','Cheap','High Volume'],badge:'',badgeClass:'',rating:4.5,reviews:1800,price:'$0.25/1M tk',types:['language','code'],price_start:0.25},

  // ── Google ────────────────────────────────────────────────────────
  {id:'gemini31-pro',   icon:'🔬',bg:'#F0F4FF',name:'Gemini 3.1 Pro',     lab:'Google',org:'Google DeepMind',desc:'Up to 5M context window. Unparalleled for deep reasoning across massive datasets and long videos.',tags:['5M Context','Reasoning','Multimodal'],badge:'hot',badgeClass:'badge-hot',rating:4.8,reviews:920,price:'$1.25/1M tk',types:['language','vision','audio','video'],price_start:1.25},
  {id:'gemini3-flash',  icon:'⚡',bg:'#F0F4FF',name:'Gemini 3 Flash',     lab:'Google',org:'Google DeepMind',desc:'Ultra-fast, high-volume model with 1M context. Perfect for real-time RAG and agentic workflows.',tags:['1M Context','Real-time','RAG'],badge:'',badgeClass:'',rating:4.6,reviews:1500,price:'$0.10/1M tk',types:['language','vision','code'],price_start:0.1},
  {id:'gemini31-flash-lite', icon:'💡',bg:'#F0F4FF',name:'Gemini 3.1 Flash-Lite', lab:'Google',org:'Google DeepMind',desc:'Ultra-low cost model with Thinking Mode for smarter responses in simple tasks.',tags:['Ultra Cheap','Thinking Mode'],badge:'new',badgeClass:'badge-new',rating:4.4,reviews:680,price:'$0.05/1M tk',types:['language'],price_start:0.05},
  {id:'veo3',           icon:'🎥',bg:'#F0F4FF',name:'Veo 3.1',            lab:'Google',org:'Google DeepMind',desc:'Professional video generation with cinematic camera control and physics-aware rendering.',tags:['Video Gen','Cinematic','Physics'],badge:'',badgeClass:'',rating:4.7,reviews:310,price:'$0.50/sec',types:['video'],price_start:0.5},

  // ── xAI ───────────────────────────────────────────────────────────
  {id:'grok4',          icon:'𝕏',bg:'#F5F5F5',name:'Grok-4-1',           lab:'xAI',org:'xAI',desc:'Real-time X data access with a 4-agent architecture for enhanced reasoning and truth-seeking.',tags:['Real-time X','4-Agent','Truth'],badge:'hot',badgeClass:'badge-hot',rating:4.7,reviews:740,price:'$0.50/1M tk',types:['language','agents'],price_start:0.5},

  // ── DeepSeek ──────────────────────────────────────────────────────
  {id:'deepseek-v3',    icon:'💻',bg:'#F0F9FF',name:'DeepSeek-V3',       lab:'DeepSeek',org:'DeepSeek',desc:'Flagship open-source MoE. Beats GPT-4o on many benchmarks at a fraction of the cost.',tags:['Open Weights','MoE','SOTA'],badge:'hot',badgeClass:'badge-hot',rating:4.8,reviews:1600,price:'$0.14/1M tk',types:['language','code','open'],price_start:0.14},
  {id:'deepseek-v32',   icon:'🧪',bg:'#F0F9FF',name:'DeepSeek-V3.2',     lab:'DeepSeek',org:'DeepSeek',desc:'Optimised variant with Sparse Attention for even faster and cheaper inference.',tags:['Fast','Sparse Attention'],badge:'new',badgeClass:'badge-new',rating:4.7,reviews:420,price:'$0.08/1M tk',types:['language','code','open'],price_start:0.08},
  {id:'deepseek-r1',    icon:'🔬',bg:'#F0F9FF',name:'DeepSeek-R1',       lab:'DeepSeek',org:'DeepSeek',desc:'Specialised reasoning model using RL. Unparalleled for academic math and formal proofs.',tags:['Reasoning','Math','Academic'],badge:'open',badgeClass:'badge-open',rating:4.9,reviews:890,price:'$0.50/1M tk',types:['language','code','open'],price_start:0.5},

  // ── Meta ──────────────────────────────────────────────────────────
  {id:'llama4-maverick', icon:'🦙',bg:'#F0F7FF',name:'Llama 4 Maverick', lab:'Meta',org:'Meta AI',desc:'400B parameter open-weights flagship. Natively multimodal and multilingual (119 languages).',tags:['Open Source','400B','Multimodal'],badge:'hot',badgeClass:'badge-hot',rating:4.8,reviews:2200,price:'Free (self-host)',types:['language','vision','code','open'],price_start:0},
  {id:'llama4-scout',   icon:'🌟',bg:'#F0F7FF',name:'Llama 4 Scout',     lab:'Meta',org:'Meta AI',desc:'Efficient MoE architecture with 128K context window. Perfect for retrieval and summarisation.',tags:['Efficient','MoE','Long Context'],badge:'',badgeClass:'',rating:4.6,reviews:1300,price:'Free (self-host)',types:['language','open'],price_start:0},

  // ── Alibaba ───────────────────────────────────────────────────────
  {id:'qwen3-max',      icon:'🀄',bg:'#F5F0FF',name:'Qwen3-Max',          lab:'Alibaba Cloud',org:'Alibaba Qwen',desc:'1T parameter MoE. The leading model for multilingual APAC scale and enterprise apps.',tags:['1T Params','Multilingual','APAC'],badge:'hot',badgeClass:'badge-hot',rating:4.7,reviews:980,price:'$1.20/1M tk',types:['language','vision','code'],price_start:1.2},
  {id:'qwen3-coder',    icon:'💡',bg:'#F5F0FF',name:'Qwen3-Coder',       lab:'Alibaba Cloud',org:'Alibaba Qwen',desc:'480B MoE coding specialist. Outperforms many frontier models in professional software tasks.',tags:['Coding','Specialist','480B'],badge:'',badgeClass:'',rating:4.8,reviews:760,price:'$0.90/1M tk',types:['code'],price_start:0.9},

  // ── Mistral ───────────────────────────────────────────────────────
  {id:'devstral',       icon:'🌀',bg:'#F0FFF4',name:'Devstral 2',        lab:'Mistral AI',org:'Mistral AI',desc:'The fastest coding agent on the market. 256K context for large-scale codebase refactoring.',tags:['Coding Agent','256K','Fastest'],badge:'new',badgeClass:'badge-new',rating:4.8,reviews:450,price:'$2/1M tk',types:['code','agents'],price_start:2.0},
  {id:'mistral-medium', icon:'⚙️',bg:'#F0FFF4',name:'Mistral Medium 3.1',lab:'Mistral AI',org:'Mistral AI',desc:'Balanced enterprise model. Great for document Q&A, structured outputs, and agent tools.',tags:['Enterprise','Balanced','DPA'],badge:'',badgeClass:'',rating:4.6,reviews:1100,price:'$0.30/1M tk',types:['language','agents'],price_start:0.3},

  // ── NVIDIA ────────────────────────────────────────────────────────
  {id:'nemotron-ultra', icon:'🟢',bg:'#F0FFF0',name:'Nemotron Ultra 253B',lab:'NVIDIA',org:'NVIDIA',desc:'NAS-compressed enterprise RAG model. Optimised for NVIDIA hardware and real-time reasoning.',tags:['RAG','Enterprise','NVIDIA'],badge:'',badgeClass:'',rating:4.7,reviews:540,price:'$1.80/1M tk',types:['language'],price_start:1.8},
  {id:'nemotron-nano',  icon:'📷',bg:'#F0FFF0',name:'Nemotron Nano 2 VL', lab:'NVIDIA',org:'NVIDIA',desc:'Video and document understanding for edge and mobile. Efficient Mamba-Transformer architecture.',tags:['Vision','Edge','Video'],badge:'',badgeClass:'',rating:4.5,reviews:320,price:'$0.20/1M tk',types:['vision'],price_start:0.2},

  // ── Zhipu AI ──────────────────────────────────────────────────────
  {id:'glm5',           icon:'🔷',bg:'#F0F4FF',name:'GLM-5',              lab:'Zhipu AI',org:'Zhipu AI',desc:'The fastest agentic engineering model. Sparse Attention architecture for sub-second coding.',tags:['Fastest','Agents','Coding'],badge:'hot',badgeClass:'badge-hot',rating:4.8,reviews:620,price:'$3.20/1M tk',types:['language','code','agents'],price_start:3.2},

  // ── Moonshot AI ───────────────────────────────────────────────────
  {id:'kimi-k2',        icon:'🌙',bg:'#F5F5FF',name:'Kimi-k2.5',          lab:'Moonshot AI',org:'Moonshot AI',desc:'Agent Swarm Orchestration with 262K context. Leading model for visual coding and RAG.',tags:['Agent Swarm','262K','Visual'],badge:'new',badgeClass:'badge-new',rating:4.7,reviews:410,price:'$3/1M tk',types:['language','vision','agents'],price_start:3.0},

  // ── EleutherAI ────────────────────────────────────────────────────
  {id:'pythia-12b',     icon:'⚡',bg:'#FFF9E8',name:'Pythia 12B',         lab:'EleutherAI',org:'EleutherAI',desc:'Research-first open model with full training transparency and checkpoints.',tags:['Open Source','Research','Transparent'],badge:'open',badgeClass:'badge-open',rating:4.0,reviews:340,price:'Free (open)',types:['language','open'],price_start:0},
  {id:'pythia-69b',     icon:'⚡',bg:'#FFF9E8',name:'Pythia 6.9B',        lab:'EleutherAI',org:'EleutherAI',desc:'Balanced Pythia model for NLP research with full checkpoint access.',tags:['Research','NLP','Checkpoints'],badge:'open',badgeClass:'badge-open',rating:3.9,reviews:420,price:'Free (open)',types:['language','open'],price_start:0},
  {id:'pythia-28b',     icon:'🔹',bg:'#FFF9E8',name:'Pythia 2.8B',        lab:'EleutherAI',org:'EleutherAI',desc:'Compact research model for analysis, fine-tuning experiments, and education.',tags:['Compact','Fine-Tuning','Education'],badge:'open',badgeClass:'badge-open',rating:3.8,reviews:560,price:'Free (open)',types:['language','open'],price_start:0},

  // ── BigScience ────────────────────────────────────────────────────
  {id:'bloom',          icon:'🌍',bg:'#FFF0F8',name:'BLOOM',               lab:'BigScience',org:'BigScience',desc:'176B multilingual open model trained on 46 languages and 13 programming languages.',tags:['Open Source','176B','Multilingual','46 Languages'],badge:'open',badgeClass:'badge-open',rating:4.0,reviews:760,price:'Free (open)',types:['language','code','open'],price_start:0},
  {id:'bloomz',         icon:'🌍',bg:'#FFF0F8',name:'BLOOMZ',              lab:'BigScience',org:'BigScience',desc:'Instruction-tuned BLOOM for multilingual task completion.',tags:['Open Source','Instruction','Multilingual'],badge:'open',badgeClass:'badge-open',rating:4.0,reviews:580,price:'Free (open)',types:['language','open'],price_start:0},

  // ── MiniMax ───────────────────────────────────────────────────────
  {id:'minimax-m25',    icon:'🟡',bg:'#FFFDE8',name:'MiniMax-M2.5',       lab:'MiniMax',org:'MiniMax',desc:'Advanced Chinese multimodal model with agent orchestration capabilities.',tags:['Chinese','Multimodal','Agents'],badge:'new',badgeClass:'badge-new',rating:4.3,reviews:280,price:'$0.40/1M tk',types:['language','vision'],price_start:0.4},
  {id:'minimax-m1',     icon:'🟡',bg:'#FFFDE8',name:'MiniMax-M1',         lab:'MiniMax',org:'MiniMax',desc:'Efficient long-context model for Chinese enterprise and consumer apps.',tags:['Long Context','Chinese','Enterprise'],badge:'',badgeClass:'',rating:4.1,reviews:420,price:'$0.20/1M tk',types:['language'],price_start:0.2},

  // ── Tencent ───────────────────────────────────────────────────────
  {id:'hunyuan-large',  icon:'🐧',bg:'#E8F8FF',name:'Hunyuan Large',      lab:'Tencent',org:'Tencent',desc:'Tencent flagship MoE — Chinese-English, multimodal, and coding.',tags:['Chinese','MoE','Multimodal','Coding'],badge:'new',badgeClass:'badge-new',rating:4.3,reviews:320,price:'¥0.05/1K tk',types:['language','vision','code'],price_start:0.3},
  {id:'hunyuan-turbo',  icon:'🐧',bg:'#E8F8FF',name:'Hunyuan Turbo',      lab:'Tencent',org:'Tencent',desc:'Fast Hunyuan variant for real-time chat and content generation.',tags:['Fast','Chat','Real-time'],badge:'',badgeClass:'',rating:4.1,reviews:480,price:'¥0.03/1K tk',types:['language'],price_start:0.15},

  // ── HuggingFace ───────────────────────────────────────────────────
  {id:'zephyr',         icon:'🤗',bg:'#FFF7E8',name:'H4-Zephyr',          lab:'HuggingFace',org:'HuggingFace',desc:'Fine-tuned Mistral model for helpfulness without RLHF. Top for open chat.',tags:['Open Source','Chat','Fine-Tuned'],badge:'open',badgeClass:'badge-open',rating:4.2,reviews:980,price:'Free (open)',types:['language','open'],price_start:0},
  {id:'openchat',       icon:'🤗',bg:'#FFF7E8',name:'H4-OpenChat',        lab:'HuggingFace',org:'HuggingFace',desc:'Community-curated open chat model with strong helpfulness scores.',tags:['Open Source','Community','Helpfulness'],badge:'open',badgeClass:'badge-open',rating:4.1,reviews:720,price:'Free (open)',types:['language','open'],price_start:0},

  // ── Cerebras ──────────────────────────────────────────────────────
  {id:'cerebras-111m',  icon:'🧠',bg:'#FEE8EC',name:'Cerebras-GPT-111M',  lab:'Cerebras',org:'Cerebras',desc:'Tiny GPT model with full open access — for research and fine-tuning.',tags:['Research','Fine-Tuning','Open Source'],badge:'open',badgeClass:'badge-open',rating:3.8,reviews:280,price:'Free (open)',types:['language','open'],price_start:0},
  {id:'cerebras-13b',   icon:'🧠',bg:'#FEE8EC',name:'Cerebras-GPT-13B',   lab:'Cerebras',org:'Cerebras',desc:'Open GPT model optimized for Cerebras Wafer-Scale Engine hardware.',tags:['Open Source','13B','Cerebras HW'],badge:'open',badgeClass:'badge-open',rating:4.0,reviews:320,price:'Free (open)',types:['language','open'],price_start:0},

  // ── Writer ────────────────────────────────────────────────────────
  {id:'palmyra-large',  icon:'✍️',bg:'#FAFAEF',name:'Palmyra Large',      lab:'Writer',org:'Writer',desc:'Enterprise-focused LLM trained for business content and brand voice.',tags:['Enterprise','Brand Voice','Business'],badge:'',badgeClass:'',rating:4.2,reviews:340,price:'$3/1M tk',types:['language'],price_start:3},
  {id:'palmyra-small',  icon:'✏️',bg:'#FAFAEF',name:'Palmyra Small',      lab:'Writer',org:'Writer',desc:'Compact Palmyra for fast document drafting and summarization.',tags:['Fast','Drafting','Summarization'],badge:'',badgeClass:'',rating:4.0,reviews:260,price:'$0.50/1M tk',types:['language'],price_start:0.5},
];

export const AI_LABS = [
  {id:'openai', name:'OpenAI', icon:'✦', bg:'#F0F9FF', count:18, desc:'Pioneer of LLMs and generative AI.'},
  {id:'anthropic', name:'Anthropic', icon:'🐚', bg:'#FDF2F0', count:12, desc:'Safety-first AI research and deployment.'},
  {id:'google', name:'Google DeepMind', icon:'🔬', bg:'#F0F4FF', count:24, desc:'Frontier research in multimodal AI.'},
  {id:'meta', name:'Meta AI', icon:'🦙', bg:'#F0F7FF', count:15, desc:'Leading the open-source AI revolution.'},
  {id:'mistral', name:'Mistral AI', icon:'🌀', bg:'#F0FFF4', count:9, desc:'High-efficiency models from Europe.'},
  {id:'deepseek', name:'DeepSeek', icon:'💻', bg:'#F0F9FF', count:11, desc:'Cutting-edge open models from China.'},
  {id:'xai', name:'xAI', icon:'🕳️', bg:'#F5F5F5', count:4, desc:'Truth-seeking AI with real-time data.'},
  {id:'nvidia', name:'NVIDIA', icon:'🟢', bg:'#F0FFF0', count:8, desc:'Accelerating AI at the silicon level.'},
  {id:'alibaba', name:'Alibaba Qwen', icon:'🀄', bg:'#F5F0FF', count:14, desc:'SOTA multilingual models for scale.'},
  {id:'tencent', name:'Tencent', icon:'🐧', bg:'#E8F8FF', count:6, desc:'Leading Chinese enterprise AI.'},
  {id:'zhipu', name:'Zhipu AI', icon:'🔷', bg:'#F0F4FF', count:7, desc:'Frontier research from Tsinghua Univ.'},
  {id:'huggingface', name:'HuggingFace', icon:'🤗', bg:'#FFF7E8', count:42, desc:'The home of open-source machine learning.'},
];

export const RESEARCH = [
  {date:'Mar 26',org:'Google DeepMind',title:'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks',summary:'Scores 83.2% on AIME 2025 math competition, outperforming all prior models on reasoning-intensive tasks.'},
  {date:'Mar 22',org:'MIT CSAIL',title:'Scaling laws for multimodal models: new empirical findings',summary:'Research reveals unexpected scaling dynamics when combining vision and language — efficiency gains plateau earlier than expected.'},
  {date:'Mar 18',org:'Anthropic',title:'Constitutional AI v2: improved alignment through iterative refinement',summary:'New methodology achieves 40% reduction in harmful outputs while preserving capability on standard benchmarks.'},
  {date:'Mar 15',org:'Meta AI',title:'Llama 4 Scout & Maverick: natively multimodal from the ground up',summary:'17B MoE architecture trained on 40 trillion tokens with native understanding across text, image, and video.'},
  {date:'Mar 10',org:'Stanford NLP',title:'Long-context recall: how models handle 1M+ token windows',summary:'Comprehensive evaluation shows sharp recall degradation beyond 200K tokens for most models tested.'},
  {date:'Mar 5',org:'DeepSeek',title:'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost',summary:'Full weight release enables fine-tuning for domain-specific reasoning at a fraction of frontier model costs.'},
];

export const MODEL_VARS = {
  gpt5:[
    {id:'gpt5-full',icon:'🧠',name:'GPT-5.4',tag:'Flagship · computer use agents',desc:'Native computer-use agents, improved reasoning efficiency, 1M+ context support. Best for high-precision professional tasks.',ctx:'1.05M',speed:'~1.2s',price:'$2.50/$15/1M',updated:'Mar 2026',badge:'🔥 Most Popular',benefits:['Native computer-use agents','1M+ context window','Improved reasoning efficiency','High-precision tasks']},
    {id:'gpt5-mini',icon:'⚡',name:'GPT-5.4 Mini',tag:'Fast & affordable',desc:'High-volume variant. Best value for standard tasks at scale.',ctx:'512K',speed:'~0.6s',price:'$0.40/$2/1M',updated:'Mar 2026',badge:'💰 Best Value',benefits:['Lower cost than flagship','Great for high-volume','Fast response times','Commercial licence']},
  ],
  'gpt-image':[
    {id:'gpt-image-15',icon:'🖼',name:'gpt-image-1.5',tag:'Enhanced generation & editing',desc:'Studio-quality image generation and editing. Best for professional creatives and commercial asset production.',ctx:'N/A',speed:'Fast',price:'$8/$32/1M',updated:'Mar 2026',badge:'✨ Latest',benefits:['Enhanced image editing','Studio-quality outputs','Photorealistic results','Commercial use ready']},
  ],
  sora2:[
    {id:'sora2-pro',icon:'🎬',name:'Sora 2 Pro',tag:'Highest-quality video + audio',desc:'Synced audio-video generation with 400K context. Cinematic-grade output for professional video content.',ctx:'400K',speed:'Moderate',price:'$30/1M',updated:'Mar 2026',badge:'🏆 Premium',benefits:['Synced audio + video','Cinematic quality','Up to 400K context','Professional content creation']},
  ],
  'claude-opus':[
    {id:'claude-opus-46',icon:'👑',name:'Claude Opus 4.6',tag:'Most intelligent · agents & coding',desc:'Adaptive Thinking, 1M Token Context (beta), 128K max output, Extended Thinking. Best for professional software engineering and computer use.',ctx:'200K / 1M beta',speed:'~2s',price:'$5/$25/1M',updated:'Mar 2026',badge:'🏆 Most Intelligent',benefits:['Adaptive Thinking','1M token context (beta)','128K max output','Extended Thinking mode']},
  ],
  'claude-sonnet':[
    {id:'claude-sonnet-46',icon:'⚡',name:'Claude Sonnet 4.6',tag:'Speed/intelligence balance',desc:'Best balance of speed and intelligence. Adaptive Thinking, 1M context (beta), 64K max output, Extended Thinking.',ctx:'200K / 1M beta',speed:'~1.2s',price:'$3/$15/1M',updated:'Mar 2026',badge:'✨ Best Balance',benefits:['Adaptive Thinking','64K max output','Extended Thinking','1M context beta']},
  ],
  'claude-haiku':[
    {id:'claude-haiku-45',icon:'🚀',name:'Claude Haiku 4.5',tag:'Fastest near-frontier',desc:'Lowest cost ($1/$5 MTok), 200K context, Extended Thinking. Real-time applications and high-volume intelligent processing.',ctx:'200K',speed:'⚡ Fastest',price:'$1/$5/1M',updated:'Mar 2026',badge:'💰 Lowest Cost',benefits:['Fastest in Claude family','$1/$5 per MTok','200K context','Extended Thinking']},
  ],
  'gemini31-pro':[
    {id:'gemini31-pro-full',icon:'🔬',name:'Gemini 3.1 Pro',tag:'Deep reasoning · 5M context',desc:'Thought Signatures for enhanced reasoning transparency. Up to 5M context. Ideal for deep analysis and long-document tasks.',ctx:'2M – 5M',speed:'Moderate',price:'$2/$12/1M',updated:'Mar 2026',badge:'🧩 Deep Reasoning',benefits:['Thought Signatures','Up to 5M context','Deep reasoning','Long-document analysis']},
  ],
  'gemini3-flash':[
    {id:'gemini3-flash-full',icon:'⚡',name:'Gemini 3 Flash',tag:'High-volume chat & coding',desc:'Sub-second latency for high-volume chat and coding. 1M context window, multimodal support.',ctx:'1M',speed:'Fast',price:'$2/$12/1M',updated:'Mar 2026',badge:'🔥 Popular',benefits:['Sub-second latency','1M context','Multimodal','High-volume ready']},
  ],
  'gemini31-flash-lite':[
    {id:'gemini31-flash-lite-full',icon:'💡',name:'Gemini 3.1 Flash-Lite',tag:'Ultra-low cost · Thinking Mode',desc:'Thinking Mode for smarter responses at ultra-low cost. Best for agents and translation.',ctx:'1M',speed:'⚡ Fastest',price:'$0.10/$0.40/1M',updated:'Mar 2026',badge:'💰 Ultra Cheap',benefits:['Thinking Mode','Lowest cost Google model','1M context','Translation & agents']},
  ],
  veo3:[
    {id:'veo3-full',icon:'🎥',name:'Veo 3.1',tag:'Cinematic video production',desc:'Cinematic camera control for high-end video production. 8s to 3-minute clips.',ctx:'8s – 3min',speed:'Moderate',price:'$0.50/sec',updated:'Mar 2026',badge:'🎬 Cinematic',benefits:['Cinematic camera control','8s to 3-min clips','High-end production quality','Professional grade']},
  ],
  grok4:[
    {id:'grok4-fast',icon:'𝕏',name:'Grok-4-1 Fast',tag:'4-agent · real-time X data',desc:'4-agent architecture with real-time X data access. Top for analysis and real-time information tasks.',ctx:'2000K',speed:'Moderate',price:'$0.20/$0.50/1M',updated:'Mar 2026',badge:'🔥 Real-Time',benefits:['4-agent architecture','Real-time X data','2000K context','Best for analysis']},
    {id:'grok4-reasoning',icon:'🧪',name:'Grok-4-1 Reasoning',tag:'Deep reasoning variant',desc:'Extended reasoning chains with real-time X data. Best for complex research and truth-seeking tasks.',ctx:'2000K',speed:'Moderate',price:'$0.30/$0.80/1M',updated:'Mar 2026',badge:'🧩 Reasoning',benefits:['Deep reasoning chains','Real-time web','Truth-seeking AI','Research focus']},
  ],
  'deepseek-v3':[
    {id:'deepseek-v3-base',icon:'💻',name:'DeepSeek-V3',tag:'Cheap general model',desc:'1T params, MODEL1 arch, 40% less memory, 1.8× faster. Best budget general-purpose model.',ctx:'128K',speed:'Moderate',price:'~$0.07/$0.28/1M',updated:'Mar 2026',badge:'💰 Best Budget',benefits:['1T parameter model','40% less memory','1.8× faster inference','Best cost/quality ratio']},
    {id:'deepseek-v31',icon:'🔧',name:'DeepSeek-V3.1 Terminus',tag:'Agent tool-use · reasoning',desc:'Agent tool-use, improved reasoning, FP8 inference. Coding, AI agents, research.',ctx:'163K',speed:'Moderate',price:'$0.21/$0.79/1M',updated:'Mar 2026',badge:'🤖 Agents',benefits:['Agent tool-use support','Improved reasoning','FP8 inference','163K context']},
  ],
  'deepseek-v32':[
    {id:'deepseek-v32-full',icon:'🧪',name:'DeepSeek-V3.2',tag:'Sparse Attention · cheaper inference',desc:'Sparse Attention for cheaper inference. Up to 164K context. Agents and long-context chat.',ctx:'128K – 164K',speed:'Moderate',price:'$0.25/$0.42/1M',updated:'Mar 2026',badge:'✨ Latest',benefits:['Sparse Attention','Cheaper inference','164K context','Agents & long chat']},
  ],
  'deepseek-r1':[
    {id:'deepseek-r1-full',icon:'🔬',name:'DeepSeek-R1',tag:'Theorem proving · academic',desc:'Formal theorem proving in Lean 4. Best for academic math proofs with open weights.',ctx:'64K',speed:'Slow',price:'$0.14/$2.19/1M',updated:'Mar 2026',badge:'🎓 Academic',benefits:['Lean 4 theorem proving','Open weights','Math & formal proofs','Academic research']},
  ],
  'llama4-maverick':[
    {id:'llama4-maverick-full',icon:'🦙',name:'Llama 4 Maverick',tag:'400B MoE · multimodal',desc:'400B parameter Mixture-of-Experts with multimodal understanding. Best open-source for multilingual and agentic tasks.',ctx:'128K',speed:'Moderate',price:'Free (self-host)',updated:'Mar 2026',badge:'🔥 Popular',benefits:['400B MoE architecture','Multimodal understanding','Multilingual (119 langs)','Fully self-hostable']},
  ],
  'llama4-scout':[
    {id:'llama4-scout-full',icon:'🌟',name:'Llama 4 Scout',tag:'Efficient MoE · long context',desc:'Efficient MoE model for long-context tasks. 128K context, great for retrieval and summarization.',ctx:'128K',speed:'Fast',price:'Free (self-host)',updated:'Mar 2026',badge:'✨ Efficient',benefits:['Efficient MoE architecture','Long-context retrieval','Summarization specialist','Self-hostable']},
  ],
  'qwen3-max':[
    {id:'qwen3-max-full',icon:'🀄',name:'Qwen3-Max',tag:'1T MoE · 119 languages',desc:'1T params MoE, beats GPT-4o on benchmarks. Best for multilingual APAC scale.',ctx:'128K',speed:'Moderate',price:'$0.40/$1.20/1M',updated:'Mar 2026',badge:'🌏 Multilingual',benefits:['1T MoE parameters','119 languages supported','Beats GPT-4o on benchmarks','APAC/scale focused']},
    {id:'qwq-32b',icon:'🔢',name:'QwQ-32B',tag:'Reasoning · math research',desc:'Reasoning model rivaling o1 on math. Best for research and complex mathematical tasks.',ctx:'32K',speed:'Slow',price:'$0.30/$0.90/1M',updated:'Mar 2026',badge:'🧩 Math',benefits:['Rivals o1 on math','Deep reasoning','Research-focused','32K context']},
  ],
  'qwen3-coder':[
    {id:'qwen3-coder-full',icon:'💡',name:'Qwen3-Coder-480B',tag:'480B coding specialist',desc:'480B MoE coding specialist. Best for professional software development tasks.',ctx:'128K',speed:'Moderate',price:'$0.60/$1.80/1M',updated:'Mar 2026',badge:'💻 Code',benefits:['480B parameters','MoE architecture','Code specialist','Software dev focused']},
  ],
  devstral:[
    {id:'devstral2-full',icon:'🌀',name:'Devstral 2',tag:'Fastest coding agent · 256K',desc:'Chat Completions, Function Calling, Structured Outputs, Batching. Best for multi-file edits and codebase navigation.',ctx:'256K',speed:'⚡ Fastest',price:'$0.40/$2/1M',updated:'Mar 2026',badge:'🚀 Fastest',benefits:['256K context','Multi-file code edits','Function calling','Codebase navigation']},
  ],
  'mistral-medium':[
    {id:'mistral-medium-31',icon:'⚙️',name:'Mistral Medium 3.1',tag:'Balanced · multimodal · low cost',desc:'Chat Completions, Agents, Structured Outputs, Document QnA. Fast and multimodal at low cost.',ctx:'128K',speed:'Fast',price:'$0.10/$0.30/1M',updated:'Mar 2026',badge:'💰 Value',benefits:['Multimodal support','Built-in tools','Document QnA','Predicted outputs']},
  ],
  'nemotron-ultra':[
    {id:'nemotron-ultra-full',icon:'🟢',name:'Nemotron Ultra 253B',tag:'Enterprise RAG · NAS compression',desc:'Neural Architecture Search compression for enterprise reasoning and RAG. 131K context.',ctx:'131K',speed:'Moderate',price:'$0.60/$1.80/1M',updated:'Mar 2026',badge:'🏢 Enterprise',benefits:['NAS compression','Enterprise RAG','131K context','NVIDIA-optimised']},
    {id:'nemotron-super-49b',icon:'💬',name:'Nemotron Super 49B',tag:'Human-like chat · tool use',desc:'Skip-Attention blocks for human-like chat and tool use. 131K context.',ctx:'131K',speed:'Moderate',price:'$0.10/$0.40/1M',updated:'Mar 2026',badge:'💬 Chat',benefits:['Skip-Attention blocks','Natural conversation','Tool use support','131K context']},
  ],
  'nemotron-nano':[
    {id:'nemotron-nano2-vl',icon:'📷',name:'Nemotron Nano 2 VL',tag:'Video & doc understanding',desc:'Hybrid Mamba-Transformer for video and document understanding. Fast and cost-effective.',ctx:'131K',speed:'Fast',price:'$0.07/$0.20/1M',updated:'Mar 2026',badge:'🎥 Vision',benefits:['Hybrid Mamba-Transformer','Video understanding','Document analysis','Ultra low cost']},
    {id:'nemotron-nano-vl-12b',icon:'📱',name:'Nemotron Nano VL 12B',tag:'Mobile OCR · vision reasoning',desc:'Efficient Video Sampling for mobile OCR and vision reasoning. 128K context.',ctx:'128K',speed:'Fast',price:'$0.20/$0.60/1M',updated:'Mar 2026',badge:'📱 Mobile',benefits:['Efficient Video Sampling','Mobile OCR','Vision reasoning','Edge deployment']},
  ],
  glm5:[
    {id:'glm5-full',icon:'🔷',name:'GLM-5',tag:'Agentic engineering · fastest',desc:'DeepSeek Sparse Attention for fastest agentic engineering and coding. 200K context.',ctx:'200K',speed:'⚡ Fastest',price:'$1.00/$3.20/1M',updated:'Mar 2026',badge:'🚀 Fastest',benefits:['DeepSeek Sparse Attention','200K context','Fastest agentic coding','Engineering focused']},
    {id:'glm-47',icon:'⚙️',name:'GLM-4.7',tag:'Cost-effective RAG',desc:'Preserved Thinking Mode for cost-effective development and RAG. 200K context.',ctx:'200K',speed:'Fast',price:'$0.15/$0.60/1M',updated:'Mar 2026',badge:'💰 Cost-Effective',benefits:['Preserved Thinking Mode','RAG optimised','200K context','Budget friendly']},
  ],
  'kimi-k2':[
    {id:'kimi-k25',icon:'🌙',name:'kimi-k2.5',tag:'Agent Swarm · visual coding',desc:'Agent Swarm Orchestration with 262K context. Fastest for visual coding and multi-agent RAG.',ctx:'262K',speed:'⚡ Fastest',price:'$0.60/$3.00/1M',updated:'Mar 2026',badge:'🤖 Agent Swarm',benefits:['Agent Swarm Orchestration','262K context','Visual coding','Multi-agent RAG']},
    {id:'kimi-k2-thinking',icon:'💭',name:'kimi-k2-thinking-turbo',tag:'Fast reasoning · web browsing',desc:'Low-Latency Thought (Turbo RL) for fast reasoning and web browsing. 262K context.',ctx:'262K',speed:'Fast',price:'$0.55/$2.50/1M',updated:'Mar 2026',badge:'⚡ Turbo',benefits:['Turbo RL reasoning','Web browsing','262K context','Low latency']},
  ],
};

export const COMPARISON_DATA = [
  { feature: 'Context Window', gpt: '1M', claude: '200K (1M beta)', gemini: '5M' },
  { feature: 'Reasoning', gpt: 'Frontier', claude: 'Adaptive Thinking', gemini: 'Thought Signatures' },
  { feature: 'Computer Use', gpt: 'Native Agents', claude: 'Beta Support', gemini: 'Upcoming' },
  { feature: 'Pricing (Input)', gpt: '$2.50 / 1M', claude: '$5 / 1M', gemini: '$1.25 / 1M' },
];

export const BUDGET_TIERS = [
  { title: 'Free & Open Source', desc: 'No credit card needed. Great for local hosting and research.', icon: '🆓', tags: ['Llama', 'DeepSeek', 'Pythia'] },
  { title: 'Pay As You Go', desc: 'Only pay for what you use. Perfect for builders and small apps.', icon: '💸', tags: ['GPT-4o', 'Claude Haiku', 'Gemini Flash'] },
  { title: 'Fixed Pro Plans', desc: 'Predictable monthly costs for professional daily use.', icon: '📦', tags: ['ChatGPT Plus', 'Claude Pro', 'Gemini Advanced'] },
  { title: 'Enterprise scale', desc: 'Dedicated capacity, SLAs, and custom security controls.', icon: '🏗️', tags: ['Azure OpenAI', 'Bedrock', 'Vertex AI'] },
];

export const QUICK_USE_CASES = [
  { title: 'Customer Support', desc: 'Automate replies with brand-aware agents.', icon: '💬', color: 'var(--blue)' },
  { title: 'Code Generation', desc: 'Build faster with AI coding partners.', icon: '💻', color: 'var(--teal)' },
  { title: 'Data Analysis', desc: 'Extract insights from massive datasets.', icon: '📊', color: 'var(--amber)' },
  { title: 'Creative Writing', desc: 'Craft emails, blogs, and stories instantly.', icon: '✍️', color: 'var(--accent)' },
];
