(function () {
  // ============== 基础数据种子 ==============
  // 场景化命名 + subType，驱动过滤逻辑
  const BASE_SEED = [
    // --- Black Friday 系列 ---
    { name: 'Black Friday Flash Sale',        subType: 'none' },
    { name: 'Black Friday Mega Deals',        subType: 'fatigue' },
    { name: 'Black Friday - Electronics',     subType: 'lowspend' },
    { name: 'Black Friday Doorbusters 2026',  subType: 'none' },
    { name: 'Black Friday Fashion Week',      subType: 'none' },
    { name: 'Black Friday Home & Kitchen',    subType: 'learning' },
    { name: 'Black Friday Toys Countdown',    subType: 'none' },

    // --- TopView 系列 ---
    { name: 'TopView Burst - Launch Day',     subType: 'none' },
    { name: 'TopView Brand Takeover APAC',    subType: 'none' },
    { name: 'TopView Holiday Reveal',         subType: 'learning' },
    { name: 'TopView Launch - Gaming',        subType: 'none' },
    { name: 'TopView Beauty Premiere',        subType: 'budget' },
    { name: 'TopView Super Bowl Teaser',      subType: 'none' },

    // --- Rejected 系列 ---
    { name: 'Summer Sale - Lookalike US',     subType: 'rejected' },
    { name: 'Finance App Onboarding',         subType: 'rejected' },
    { name: 'Retargeting 30D Cart',           subType: 'rejected' },
    { name: 'Crypto Wallet Install',          subType: 'rejected' },
    { name: 'Gambling Free Spins',            subType: 'rejected' },

    // --- Opportunities 系列 ---
    { name: 'Holiday Mega Deals Q4',          subType: 'fatigue' },
    { name: 'Back to School - GenZ',          subType: 'lowspend' },
    { name: 'iOS Installs - Tier1',           subType: 'learning' },
    { name: 'Shop Live - Beauty Brand',       subType: 'budget' },
    { name: 'Brand Awareness APAC',           subType: 'fatigue' },
    { name: 'Creator Collab - Fashion',       subType: 'lowspend' },
    { name: 'Gaming App Prelaunch',           subType: 'learning' },
    { name: 'Flash Sale Weekend',             subType: 'budget' },
    { name: 'Travel App Summer',              subType: 'fatigue' },
    { name: 'Fitness Tracker Q2',             subType: 'lowspend' },

    // --- 正常 Active 系列 ---
    { name: 'App promotion 20250820',         subType: 'none' },
    { name: 'Spring Catalog Launch',          subType: 'none' },
    { name: 'Valentine Gift Guide',           subType: 'none' },
    { name: 'New Year Countdown 2026',        subType: 'none' },
    { name: 'Travel Summer Getaway',          subType: 'none' },
    { name: 'Food Delivery Discount',         subType: 'none' },
    { name: 'Sports Fans Q1 Boost',           subType: 'none' },
    { name: 'Lead Gen - Real Estate',         subType: 'none' },
    { name: 'Search Ads - High Intent',       subType: 'none' },
    { name: 'Pet Supplies Promo',             subType: 'none' },
    { name: 'EdTech Enrollment Drive',        subType: 'none' },
    { name: 'Streaming Service Signup',       subType: 'none' },
    { name: 'Music App Growth',               subType: 'none' },
    { name: 'Health App Challenge',           subType: 'none' },
    { name: 'Gaming Reengagement',            subType: 'none' },

    // --- Paused 系列 ---
    { name: 'Android Reach - SEA',            subType: 'paused' },
    { name: 'Story Ads Teen Audience',        subType: 'paused' },
    { name: 'Desktop Reach - EMEA',           subType: 'paused' },
  ];

  // 把种子扩充到 ~150 条，带编号后缀，保留原始 subType
  const SEED = [];
  for (let i = 0; i < 3; i++) {
    BASE_SEED.forEach((s, idx) => {
      SEED.push({
        name: i === 0 ? s.name : `${s.name} #${i + 1}`,
        subType: s.subType,
      });
    });
  }

  // 子状态映射
  const SUB_MAP = {
    none:     null,
    fatigue:  { text: 'Creative fatigue (2)', cls: 'warn',   status: 'active', label: 'Active',
                tooltip: 'Campaign is running normally', popoverKey: 'fatigue' },
    lowspend: { text: 'Low spending (3)',     cls: 'warn',   status: 'active', label: 'Active',
                tooltip: 'Campaign is running normally', popoverKey: 'lowspend' },
    learning: { text: 'Learning phase',       cls: 'warn',   status: 'active', label: 'Active',
                tooltip: 'Campaign is running normally', popoverKey: 'learning' },
    budget:   { text: 'Budget limited',       cls: 'warn',   status: 'active', label: 'Active',
                tooltip: 'Campaign is running normally', popoverKey: 'budget' },
    rejected: { text: 'Ad rejected',          cls: 'danger', status: 'warn',   label: 'Not Delivering',
                tooltip: 'Ad content rejected by policy review', popoverKey: 'rejected' },
    paused:   { text: 'Paused by user',       cls: '',       status: 'paused', label: 'Inactive',
                tooltip: 'Campaign paused manually', popoverKey: 'paused' },
    // Meta 导入失败兜底：默认进入 Draft 状态，等待用户补全适配设置
    draft:    { text: 'Need adaptive settings', cls: 'warn', status: 'draft',  label: 'Draft',
                tooltip: 'Imported from Meta but failed to apply — open this draft to finish adaptive settings.', popoverKey: 'draft' },
  };

  // Popover 内容库：每种 subType 的详情卡片
  const POPOVER_CONTENT = {
    fatigue: {
      title: 'Creative Fatigue Detected',
      cls: 'warn',
      body: `Your ad creatives have been shown too frequently to the same audience. CTR has dropped ~23% in the past 7 days.`,
      list: ['Refresh top-performing creatives', 'Expand audience targeting', 'Rotate 2-3 new video variants'],
      primaryAction: 'Generate new creatives',
      secondaryAction: 'View details',
    },
    lowspend: {
      title: 'Low Spending',
      cls: 'warn',
      body: `Daily budget utilization is below 40%. The delivery system is underpacing.`,
      list: ['Increase bid by 10-15%', 'Broaden audience criteria', 'Lift bid cap on Ad group'],
      primaryAction: 'Adjust bid',
      secondaryAction: 'View diagnostic',
    },
    learning: {
      title: 'Learning Phase',
      cls: 'warn',
      body: `Campaign needs ~50 conversions to exit learning. Avoid edits for 3-5 days to stabilize delivery.`,
      list: ['Keep budget stable', 'Avoid editing creatives', 'Monitor conversion quality'],
      primaryAction: 'Got it',
      secondaryAction: 'Learn more',
    },
    budget: {
      title: 'Budget Limited',
      cls: 'warn',
      body: `Campaign is limited by daily budget. Estimated missed opportunity: 18k impressions/day.`,
      list: ['Raise daily budget', 'Enable accelerated delivery', 'Split into multiple Ad groups'],
      primaryAction: 'Raise budget',
      secondaryAction: 'View forecast',
    },
    rejected: {
      title: 'Ad Rejected',
      cls: 'danger',
      body: `Your ad was rejected due to policy violation on "Misleading claims". The campaign stopped delivering 2h ago.`,
      list: ['Remove unverified claims in ad copy', 'Replace rejected creatives', 'Submit for re-review'],
      primaryAction: 'Appeal & fix',
      secondaryAction: 'View reason',
    },
    paused: {
      title: 'Campaign Paused',
      cls: '',
      body: `Campaign was paused manually by user on Mar 18, 2026 10:24 AM.`,
      list: [],
      primaryAction: 'Resume',
      secondaryAction: 'View history',
    },
  };

  const iconPool = {
    app:     '<path d="M12 3L4 7v6c0 5 3.5 8 8 8s8-3 8-8V7l-8-4z"/>',
    shop:    '<path d="M4 7h16l-1.5 12h-13z"/><path d="M8 7a4 4 0 1 1 8 0"/>',
    video:   '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M17 10l4-2v8l-4-2z"/>',
    search:  '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    topview: '<path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/>',
    lead:    '<path d="M4 6h16v12H4z"/><path d="M4 6l8 7 8-7"/>',
    live:    '<circle cx="12" cy="12" r="4"/><path d="M5 5a10 10 0 0 0 0 14"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    sale:    '<path d="M7 7h10v10H7z"/><path d="M9 9l6 6M15 9l-6 6"/>',
  };
  const pickIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('topview')) return iconPool.topview;
    if (n.includes('black friday') || n.includes('sale') || n.includes('deals')) return iconPool.sale;
    if (n.includes('shop') || n.includes('catalog') || n.includes('gift')) return iconPool.shop;
    if (n.includes('video') || n.includes('story') || n.includes('view')) return iconPool.video;
    if (n.includes('search')) return iconPool.search;
    if (n.includes('lead')) return iconPool.lead;
    if (n.includes('live') || n.includes('creator')) return iconPool.live;
    return iconPool.app;
  };

  // ============== 工具 ==============
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pickOne = (arr) => arr[randInt(0, arr.length - 1)];
  const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
  const fmtUsd = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';

  // ============== 创意池 ==============
  // 创意（Creative）代表一段可复用的素材（视频/图片）
  // scene 字段用于驱动 SVG 场景化封面：sale/topview/app/holiday/summer/ugc/product/lead
  const CREATIVE_POOL = [
    { id: 'cr_01', name: 'BF_Flash_30s_v2',   type: 'video', scene: 'sale',    color: '#ef4444', color2: '#7c1d1d', initials: 'BF', photoId: '1607083206968-13611e3d76db' },
    { id: 'cr_02', name: 'BF_Mega_15s_hero',  type: 'video', scene: 'sale',    color: '#f97316', color2: '#7c2d12', initials: 'BM', photoId: '1481437156560-3205f6a55735' },
    { id: 'cr_03', name: 'TopView_Teaser_A',  type: 'video', scene: 'topview', color: '#8b5cf6', color2: '#3b0764', initials: 'TV', photoId: '1512941937669-90a1b58e7e9c' },
    { id: 'cr_04', name: 'TopView_Brand_B',   type: 'video', scene: 'topview', color: '#6366f1', color2: '#1e1b4b', initials: 'TB', photoId: '1517263904808-5dc91e3e7044' },
    { id: 'cr_05', name: 'AppPromo_Install_1',type: 'image', scene: 'app',     color: '#16b8a4', color2: '#134e4a', initials: 'AP', photoId: '1556656793-08538906a9f8' },
    { id: 'cr_06', name: 'AppPromo_Install_2',type: 'video', scene: 'app',     color: '#0ea5e9', color2: '#0c4a6e', initials: 'A2', photoId: '1511707171634-5f897ff02aa9' },
    { id: 'cr_07', name: 'Holiday_Gift_Reel', type: 'video', scene: 'holiday', color: '#ec4899', color2: '#831843', initials: 'HG', photoId: '1512909006721-3d6018887383' },
    { id: 'cr_08', name: 'Summer_Sale_Hero',  type: 'image', scene: 'summer',  color: '#f59e0b', color2: '#78350f', initials: 'SS', photoId: '1507525428034-b723cf961d3e' },
    { id: 'cr_09', name: 'Creator_UGC_01',    type: 'video', scene: 'ugc',     color: '#14b8a6', color2: '#134e4a', initials: 'UG', photoId: '1502823403499-6ccfcf4fb453' },
    { id: 'cr_10', name: 'Creator_UGC_02',    type: 'video', scene: 'ugc',     color: '#84cc16', color2: '#365314', initials: 'U2', photoId: '1524504388940-b1c1722653e1' },
    { id: 'cr_11', name: 'ProductDemo_v3',    type: 'video', scene: 'product', color: '#06b6d4', color2: '#164e63', initials: 'PD', photoId: '1523275335684-37898b6baf30' },
    { id: 'cr_12', name: 'LeadForm_Banner',   type: 'image', scene: 'lead',    color: '#a855f7', color2: '#581c87', initials: 'LF', photoId: '1454165804606-c3d57bc86b40' },
  ];

  // Unsplash 固定图片链接构造：w=400 + 压缩 + 裁剪保证 5:3 视觉主体
  function photoUrl(cr, w = 400) {
    if (!cr || !cr.photoId) return '';
    return `https://images.unsplash.com/photo-${cr.photoId}?w=${w}&h=${Math.round(w * 0.6)}&fit=crop&auto=format&q=70`;
  }

  // ====== 商品池：用于 AI Summary 的 "Best performing products" 模块 ======
  // 每个商品包含名称、类目、价格、Unsplash 商品特写照片 ID，销量/GMV 为随机模拟
  const PRODUCT_POOL = [
    { id: 'p_01', name: 'Aurora Smart Watch',      category: 'Wearables',  price: 129.00, photoId: '1523275335684-37898b6baf30' },
    { id: 'p_02', name: 'Cloud Runner Sneakers',   category: 'Footwear',   price:  89.50, photoId: '1542291026-7eec264c27ff' },
    { id: 'p_03', name: 'Velvet Lipstick Set',     category: 'Beauty',     price:  34.90, photoId: '1586495777744-4413f21062fa' },
    { id: 'p_04', name: 'Nomad Leather Backpack',  category: 'Bags',       price: 156.00, photoId: '1553062407-98eeb64c6a62' },
    { id: 'p_05', name: 'Pulse Wireless Earbuds',  category: 'Audio',      price:  79.00, photoId: '1590658268037-6bf12165a8df' },
    { id: 'p_06', name: 'Glow Serum 30ml',         category: 'Skincare',   price:  49.00, photoId: '1556228720-195a672e8a03' },
    { id: 'p_07', name: 'Urban Denim Jacket',      category: 'Apparel',    price: 119.00, photoId: '1551028719-00167b16eac5' },
    { id: 'p_08', name: 'Brew Pro Coffee Maker',   category: 'Home',       price: 199.00, photoId: '1495474472287-4d71bcdd2085' },
    { id: 'p_09', name: 'Zen Yoga Mat',            category: 'Fitness',    price:  45.00, photoId: '1592432678016-e910b452f9a2' },
    { id: 'p_10', name: 'Retro Polaroid Camera',   category: 'Electronics',price: 179.00, photoId: '1502920917128-1aa500764cbd' },
    { id: 'p_11', name: 'Canvas Sling Bag',        category: 'Bags',       price:  59.00, photoId: '1548036328-c9fa89d128fa' },
    { id: 'p_12', name: 'Matte Eyeshadow Palette', category: 'Beauty',     price:  42.00, photoId: '1522335789203-aaa2d4c1a0c6' },
  ];

  // 模拟每个商品的销量与 GMV（仅在首次被访问时惰性填充，刷新不抖动）
  function enrichProductMetrics(p) {
    if (p._sales != null) return p;
    p._sales = randInt(120, 4800);
    p._gmv = Math.round(p._sales * p.price);
    return p;
  }

  // ====== 封面图片库：按场景归类，数量远大于 ad 数，保证每个 ad 分配唯一封面 ======
  const PHOTO_BANK = {
    sale: [
      '1607083206968-13611e3d76db', '1481437156560-3205f6a55735', '1556742502-ec7c0e9f34b1',
      '1607082348824-0a96f2a4b9da', '1607082349566-187342175e2f', '1607083681678-52733140f93a',
      '1555529669-e69e7aa0ba9a', '1549921296-3b0f9a35af35', '1607083206325-caf1edba7a8f',
      '1556905055-8f358a7a61f2', '1607082348824-0a96f2a4b9da', '1604176354204-9268737828e4'
    ],
    topview: [
      '1512941937669-90a1b58e7e9c', '1517263904808-5dc91e3e7044', '1510557880182-3d4d3cba35a5',
      '1574944985070-8f3ebc6b79d2', '1511707171634-5f897ff02aa9', '1522125670776-3c7abb882bc2',
      '1519389950473-47ba0277781c', '1512428559087-560fa5ceab42', '1526045478516-99145907023c',
      '1533228100845-08145b01de14', '1536148935331-408321065b18', '1516321318423-f06f85e504b3'
    ],
    app: [
      '1556656793-08538906a9f8', '1511707171634-5f897ff02aa9', '1512941937669-90a1b58e7e9c',
      '1551650975-87deedd944c3', '1510832303407-0761e1c34b74', '1557180295-76eee20ae8bb',
      '1565849904461-04a58ad377e0', '1586717799252-bd134ad00e26', '1611162617213-7d7a39e9b1d7',
      '1563013544-824ae1b704d3', '1563014959-7aaa83350992', '1573164713714-d95e436ab8d6'
    ],
    holiday: [
      '1512909006721-3d6018887383', '1543589077-47d81606c1bf', '1482517967863-00e15c9b44be',
      '1513889961551-628c1e5e2ee9', '1544273677-1feaebf7e4ed', '1512389142860-9c449e58a543',
      '1511920170033-f8396924c348', '1509281373149-e957c6296406', '1575936123452-b67c3203c357',
      '1481450113902-4b1b29d0d49a', '1544273677-1feaebf7e4ed', '1545231027-637d2f6210f8'
    ],
    summer: [
      '1507525428034-b723cf961d3e', '1519046904884-53103b34b206', '1507525428034-b723cf961d3e',
      '1501785888041-af3ef285b470', '1535930891776-0c2dfb7fda1a', '1520454974749-611b7248ffdb',
      '1505228395891-9a51e7e86bf6', '1533722695075-2ff8bfec8549', '1515266591878-f93e32bc5937',
      '1502082553048-f009c37129b9', '1527004013197-933c4bb611b3', '1519046904884-53103b34b206'
    ],
    ugc: [
      '1502823403499-6ccfcf4fb453', '1524504388940-b1c1722653e1', '1507003211169-0a1dd7228f2d',
      '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e', '1531123897727-8f129e1688ce',
      '1494790108377-be9c29b29330', '1517841905240-472988babdf9', '1534528741775-53994a69daeb',
      '1506794778202-cad84cf45f1d', '1519085360753-af0119f7cbe7', '1521119989659-a83eee488004'
    ],
    product: [
      '1523275335684-37898b6baf30', '1542291026-7eec264c27ff', '1505740420928-5e560c06d30e',
      '1526170375885-4d8ecf77b99f', '1546868871-7041f2a55e12', '1527869638311-7e7b38986d17',
      '1592921870789-04563d55041c', '1572569511254-d8f925fe2cbb', '1587202372634-32705e3bf49c',
      '1585386959984-a4155224a1ad', '1491553895911-0055eca6402d', '1560769629-975ec94e6a86'
    ],
    lead: [
      '1454165804606-c3d57bc86b40', '1434030216411-0b793f4b4173', '1456324504439-367cee3b3c32',
      '1493723843671-1d655e66ac1c', '1519389950473-47ba0277781c', '1486312338219-ce68d2c6f44d',
      '1556761175-5973dc0f32e7', '1553877522-43269d4ea984', '1551836022-d5d88e9218df',
      '1542744094-3a31f272c490', '1517048676732-d65bc937f952', '1552581234-26160f608093'
    ],
  };

  // 为每张 ad 发放独有的封面：按 scene 排队取，用 Set 记录全局已用 photoId，确保不重复
  const _usedPhotoIds = new Set();
  function pickUniquePhotoId(scene) {
    const list = PHOTO_BANK[scene] || PHOTO_BANK.product;
    // 先尝试从当前 scene 池中找未使用的
    for (let i = 0; i < list.length; i++) {
      const candidate = list[i];
      if (!_usedPhotoIds.has(candidate)) {
        _usedPhotoIds.add(candidate);
        return candidate;
      }
    }
    // 当前场景池耗尽，跨场景兜底
    const scenes = Object.keys(PHOTO_BANK);
    for (const s of scenes) {
      for (const id of PHOTO_BANK[s]) {
        if (!_usedPhotoIds.has(id)) {
          _usedPhotoIds.add(id);
          return id;
        }
      }
    }
    // 终极兜底：允许复用（图片库已用尽）
    return list[Math.floor(Math.random() * list.length)];
  }

  const CTA_POOL = ['Shop Now', 'Download', 'Learn More', 'Sign Up', 'Get Offer', 'Install', 'Watch Now'];
  const ADDON_POOL = ['Countdown sticker', 'Gift code', 'Display card', 'Super like', 'Voting sticker', 'None'];
  const URL_POOL = ['https://shop.example.com/bf', 'https://app.example.com/install', 'https://promo.example.com/topview', 'https://example.com/lp/holiday', 'https://example.com/lp/creator'];
  const TEXT_POOL = [
    'Biggest sale of the year is here! Up to 70% off sitewide 🔥',
    'Install now and get $10 off your first order. Limited time only.',
    'Don\'t miss the TopView takeover — exclusive deals inside.',
    'Shop the trending looks creators are loving this season.',
    'New drops every Friday. Set a reminder now.',
  ];

  // ============== Campaign → Ad group → Ad 层级递进 ==============
  // 业务含义：
  //  - Campaign   ：营销目标 + 总预算（例如 Black Friday Flash Sale）
  //  - Ad group   ：投放策略单元（受众 / 地区 / 版位），每组单独定向、出价、预算分片
  //  - Ad         ：具体素材组合（Creative + 文案 + CTA + 落地页），挂在 Ad group 下
  const REGION_POOL = ['US-East', 'US-West', 'EMEA', 'APAC', 'SEA', 'LATAM', 'JP-KR', 'UK-IE'];
  const AUDIENCE_POOL = ['Lookalike 1%', 'Interest: Fashion', 'Interest: Tech', 'Retargeting 30D', 'Broad Match', 'Custom CRM', 'GenZ 18-24', 'Parents 25-44'];
  const PLACEMENT_POOL = ['TikTok Feed', 'TopView', 'Pangle', 'Story', 'Search Ads'];
  const OBJECTIVE_POOL = ['Conversion', 'Traffic', 'App Install', 'Reach', 'Lead Gen', 'Video Views'];
  const BID_STRATEGY = ['Lowest cost', 'Cost cap', 'Bid cap', 'Target CPA'];

  function inferObjective(name) {
    const n = name.toLowerCase();
    if (/install|app/.test(n)) return 'App Install';
    if (/lead|enroll|sign/.test(n)) return 'Lead Gen';
    if (/brand|awareness|reach|topview/.test(n)) return 'Reach';
    if (/view|video|teaser/.test(n)) return 'Video Views';
    if (/sale|deals|shop|flash|gift|catalog/.test(n)) return 'Conversion';
    return pickOne(OBJECTIVE_POOL);
  }

  // 根据 campaign 倾向挑选候选创意池
  function creativeCandidatesFor(seedName) {
    if (/black friday/i.test(seedName)) {
      const c = CREATIVE_POOL.filter(x => /^BF|^BM|Holiday|Summer/.test(x.name));
      return c.length >= 2 ? c : CREATIVE_POOL;
    }
    if (/topview/i.test(seedName)) {
      const c = CREATIVE_POOL.filter(x => /TopView|^TV|^TB/.test(x.name));
      return c.length >= 2 ? c : CREATIVE_POOL;
    }
    if (/install|app/i.test(seedName)) {
      const c = CREATIVE_POOL.filter(x => /AppPromo|Install|Product/.test(x.name));
      return c.length >= 2 ? c : CREATIVE_POOL;
    }
    if (/creator|ugc|collab/i.test(seedName)) {
      const c = CREATIVE_POOL.filter(x => /Creator|UGC/.test(x.name));
      return c.length >= 2 ? c : CREATIVE_POOL;
    }
    return CREATIVE_POOL;
  }

  // 构造单条 ad（归属 ad group）
  // AIGC 内容方向池：用于给 AIGC 类 ad 打上方向标签，便于在 Summary 中聚类展示
  const AIGC_DIRECTION_POOL = [
    'AI Avatar UGC', 'AI Voiceover Demo', 'Product Storytelling', 'Lifestyle Vignette',
    'Trend Remix', 'Before/After Showcase', 'AI Lip-sync Hook', 'Stylized 3D Promo',
  ];

  // 素材测试假设池：测试目标维度（hook / 文案 / 视觉风格 / 时长 / CTA / Avatar / 配乐）
  const CT_HYPOTHESIS_POOL = [
    'Hook variant', 'Caption rewrite', 'Visual style', 'Duration cut',
    'CTA button copy', 'AI Avatar swap', 'Soundtrack swap', 'Thumbnail framing',
  ];

  function buildAd(seedName, adGroup, index) {
    const candidates = creativeCandidatesFor(seedName);
    const base = pickOne(candidates);
    // 每个 ad 持有一份独立的 creative 副本，封面图片从全局池中抽一张未使用的
    // 这样同一 campaign / ad group 内不同 ad 的封面绝不重复
    const uniquePhotoId = pickUniquePhotoId(base.scene || 'product');
    // 约 35% 概率为 AIGC 素材；视频类素材 AIGC 概率更高（55%）以支撑视频对比模块
    const isVideo = base.type === 'video';
    const isAigc = isVideo ? Math.random() < 0.55 : Math.random() < 0.18;
    const aigcDirection = isAigc ? pickOne(AIGC_DIRECTION_POOL) : null;
    const cr = {
      ...base,
      id: `${base.id}__${Math.random().toString(36).slice(2, 6)}`,
      name: isAigc ? `AIGC_${base.name}_${index + 1}` : `${base.name}_${index + 1}`,
      photoId: uniquePhotoId,
      isAigc,
      aigcDirection,
    };
    // Ad 命名 = "<campaign短名> / <region>-<audience简写> / Ad-<序号>"
    const regionShort = adGroup.region.replace(/[^A-Z]/g, '').slice(0, 3) || adGroup.region.slice(0, 3);
    const audShort = adGroup.audience.split(' ')[0].replace(/[^A-Za-z0-9]/g, '').slice(0, 6);
    const shortCp = seedName.split(' ').slice(0, 2).join(' ');
    // Ad 层级的指标按 ad group 内比例分摊
    const impressions = Math.round(adGroup.impressions * adGroup._adShare[index]);
    const clicks = Math.round(impressions * (adGroup.ctr + rand(-0.3, 0.3)) / 100);
    const cost = (impressions / 1000) * (adGroup.cpm + rand(-0.5, 0.5));

    // ===== 视频互动指标：仅 video 类型有，AIGC 整体高于非 AIGC 约 10-25% =====
    let videoMetrics = null;
    if (isVideo) {
      const baseVtr = isAigc ? rand(38, 62) : rand(24, 46);          // 视频观看完成率（视频被播放占比）
      const baseHook = isAigc ? rand(28, 48) : rand(16, 32);         // 前 3 秒留存
      const baseAvgWatch = isAigc ? rand(7.5, 14.5) : rand(4.5, 9.0); // 平均观看时长（秒）
      const baseComplete = isAigc ? rand(18, 34) : rand(9, 22);       // 完播率
      const videoViews = Math.round(impressions * baseVtr / 100);
      videoMetrics = {
        views: videoViews,                       // 视频播放数
        vtr: +baseVtr.toFixed(1),                // VTR (%)
        hookRate: +baseHook.toFixed(1),          // 前 3 秒留存 (%)
        avgWatch: +baseAvgWatch.toFixed(1),      // 平均观看时长 (s)
        completeRate: +baseComplete.toFixed(1),  // 完播率 (%)
      };
    }

    return {
      id: `ad_${Math.random().toString(36).slice(2, 8)}`,
      name: `${shortCp} / ${regionShort}-${audShort} / Ad-${index + 1}`,
      creative: cr,
      isAigc,
      aigcDirection,
      text: pickOne(TEXT_POOL),
      cta: pickOne(CTA_POOL),
      addon: pickOne(ADDON_POOL),
      url: pickOne(URL_POOL),
      locked: Math.random() < 0.12,
      // 指标
      impressions,
      clicks,
      cost: Math.max(0, cost),
      cpm: impressions > 0 ? (cost / impressions) * 1000 : 0,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      videoMetrics,
      status: Math.random() < 0.08 ? 'paused' : (Math.random() < 0.05 ? 'warn' : 'active'),
      // 反向引用（渲染时用）
      adGroupId: adGroup.id,
    };
  }

  // 构造 ad groups，指标按比例分摊自 campaign 总量，再把指标分摊给 ads
  function buildAdGroups(campaignRow, seedName) {
    const groupCount = randInt(2, 4); // 每个 campaign 有 2~4 个 ad group
    // 权重分摊 campaign 的 impressions
    const weights = Array.from({ length: groupCount }, () => rand(0.6, 1.4));
    const wSum = weights.reduce((a, b) => a + b, 0);

    const usedRegions = new Set();
    const usedAud = new Set();
    const objective = inferObjective(seedName);

    const groups = [];
    for (let i = 0; i < groupCount; i++) {
      // 避免重复的 region/audience
      let region; do { region = pickOne(REGION_POOL); } while (usedRegions.has(region) && usedRegions.size < REGION_POOL.length);
      usedRegions.add(region);
      let audience; do { audience = pickOne(AUDIENCE_POOL); } while (usedAud.has(audience) && usedAud.size < AUDIENCE_POOL.length);
      usedAud.add(audience);

      const share = weights[i] / wSum;
      const impressions = Math.round(campaignRow.impressions * share);
      // Ad group 的 CTR / CPM 在 campaign 均值附近小幅波动
      const ctr = Math.max(0.1, campaignRow.ctr + rand(-0.6, 0.6));
      const cpm = Math.max(0.5, campaignRow.cpm + rand(-1.2, 1.2));
      const clicks = Math.round(impressions * ctr / 100);
      const cost = (impressions / 1000) * cpm;

      // 决定该 group 下有几个 ad，并给出各 ad 在 group 内的指标占比
      const adCount = randInt(2, 4);
      const adWeights = Array.from({ length: adCount }, () => rand(0.7, 1.3));
      const awSum = adWeights.reduce((a, b) => a + b, 0);
      const adShare = adWeights.map(w => w / awSum);

      // 继承 campaign 的 sub-status（rejected 场景只影响部分 group，其它视为 active）
      let subType = 'none';
      if (campaignRow.subType === 'rejected' && Math.random() < 0.6) subType = 'rejected';
      else if (campaignRow.subType === 'paused' && Math.random() < 0.7) subType = 'paused';
      else if (['fatigue', 'lowspend', 'learning', 'budget'].includes(campaignRow.subType) && Math.random() < 0.5) {
        subType = campaignRow.subType;
      }

      const budget = Math.round((campaignRow.cost / groupCount) * rand(1.0, 1.4));
      const group = {
        id: `ag_${Math.random().toString(36).slice(2, 8)}`,
        name: `${seedName.split(' ').slice(0, 2).join(' ')} / ${region} / ${audience}`,
        campaignId: campaignRow.id,
        campaignName: seedName,
        region, audience,
        placement: pickOne(PLACEMENT_POOL),
        objective,
        bidStrategy: pickOne(BID_STRATEGY),
        budget, // 日预算（USD）
        subType,
        isOn: subType !== 'paused' && Math.random() > 0.1,
        // 指标
        impressions, clicks, cost, cpm, ctr,
        _adShare: adShare,
      };
      group.ads = [];
      for (let j = 0; j < adCount; j++) {
        group.ads.push(buildAd(seedName, group, j));
      }
      groups.push(group);
    }
    return groups;
  }

  function buildRow(seed) {
    const sub = SUB_MAP[seed.subType];
    const impressions = randInt(15000, 450000);
    const cpm = rand(1.2, 18.5);
    const cost = (impressions / 1000) * cpm;
    const ctr = rand(0.35, 4.8);
    const clicks = Math.round(impressions * ctr / 100);
    const conversions = Math.round(clicks * rand(0.02, 0.12));
    const pacing = +(rand(0.6, 1.6)).toFixed(2);
    const row = {
      id: `cp_${Math.random().toString(36).slice(2, 8)}`,
      name: seed.name,
      subType: seed.subType,
      icon: pickIcon(seed.name),
      isOn: seed.subType !== 'paused' && Math.random() > 0.08,
      status: sub ? sub.status : 'active',
      label: sub ? sub.label : 'Active',
      sub: sub ? { text: sub.text, cls: sub.cls, tooltip: sub.tooltip, popoverKey: sub.popoverKey } : null,
      cost, impressions, cpm, clicks, ctr, conversions, pacing,
      adGroups: [],
    };
    row.adGroups = buildAdGroups(row, seed.name);
    // 便捷 getter：所有 ads 扁平列表（兼容之前 creative search / bulk edit 逻辑）
    Object.defineProperty(row, 'ads', {
      get() { return this.adGroups.flatMap(g => g.ads); },
      enumerable: false,
    });
    return row;
  }

  // 构造若干"之前导入的 Meta 广告"种子行（不带 isNew 红点，模拟历史导入）
  function buildMetaImportedSeeds() {
    const seeds = [
      { name: 'Meta - Q3 Holiday Push',         subType: 'none' },
      { name: 'Meta - Retargeting High Intent', subType: 'fatigue' },
      { name: 'Meta - Brand Awareness EU',      subType: 'lowspend' },
      { name: 'Meta - App Install iOS Legacy',  subType: 'paused' },
    ];
    return seeds.map(s => {
      const row = buildRow(s);
      row.fromMeta = true;
      row.isNew = false;
      return row;
    });
  }

  // 构造若干"刚刚导入"的 Meta 广告 mock 行（带 isNew 红点）
  // 模拟"用户刚走完 Meta drawer 4 步并 Apply"后回到 Campaign list 的状态：
  //   ① 列表顶部出现 N 条 fromMeta:true + isNew:true 的行（名称前显示红点）
  //   ② Meta imported preset card 计数 = 历史(4) + 新导入(N)
  //   ③ Meta imported card 显示 has-new 红角（NEW 标签）
  //   ④ 切到 Meta imported preset 后只剩 fromMeta 行
  function buildJustImportedMetaSeeds() {
    const seeds = [
      { name: 'Meta - Black Friday Mega',     subType: 'none' },     // active
      { name: 'Meta - Holiday Catalog Sales', subType: 'learning' }, // 带 sub badge
      { name: 'Meta - Lookalike US Tier1',    subType: 'none' },     // active
      { name: 'Meta - App Install iOS',       subType: 'paused' },   // paused
    ];
    return seeds.map(s => {
      const row = buildRow(s);
      row.fromMeta = true;
      row.isNew = true;
      return row;
    });
  }

  // 调试开关：true 时首屏即模拟"刚提交完 Meta 导入"的状态，方便验证红点 + 过滤逻辑
  // false 时仅显示历史 Meta 行（无红点），需要走完 drawer 流程后才会出现红点
  const SIMULATE_JUST_IMPORTED = true;

  // ============== 状态 ==============
  // 顺序：刚导入(顶部, 红点) → 历史 Meta 导入 → 普通 SEED
  let DATA = [
    ...(SIMULATE_JUST_IMPORTED ? buildJustImportedMetaSeeds() : []),
    ...buildMetaImportedSeeds(),
    ...SEED.map(buildRow),
  ];

  // ============== 给部分 campaign 注入"素材测试 (Creative testing)"上下文 ==============
  // 在 8 个 campaign 上构造正在跑的素材测试，每个测试包含：
  //   testStatus: 'pending' | 'testing' | 'winner' | 'loser'
  //   progress:   0-100，表示样本完成度
  //   variantsCount / leader / runnerUp（带 ad / 关键指标）
  //   liftCtr:    leader vs control 的 CTR 提升 %
  //   eta:        预估剩余时间（h）
  //   hypothesis: 测试假设（哪个维度在变）
  function attachCreativeTestContext() {
    // 选满足"非 paused / 非 draft / 至少 2 条 ad"的候选行
    const candidates = DATA.filter(r =>
      r.status !== 'paused' && r.status !== 'draft' && (r.ads || []).length >= 2
    );
    // 取前 8 条（或全部，如果不足 8）
    const picks = candidates.slice(0, Math.min(8, candidates.length));

    // 8 个测试 → 状态分布：2 pending / 4 testing / 1 winner / 1 loser
    const STATUS_PLAN = ['testing', 'testing', 'winner', 'testing', 'pending', 'testing', 'loser', 'pending'];

    picks.forEach((row, i) => {
      const ads = row.ads;
      // leader / runnerUp 各取一条 ad（不同则选不同，否则同一条）
      const leaderAd = ads[0];
      const runnerAd = ads[1] || ads[0];
      const status = STATUS_PLAN[i] || 'testing';
      const progress = status === 'winner' ? 100
        : status === 'loser' ? 100
          : status === 'pending' ? Math.round(rand(2, 18))
            : Math.round(rand(35, 90));
      const liftCtr = status === 'winner' ? +rand(14, 38).toFixed(1)
        : status === 'loser' ? +rand(-22, -3).toFixed(1)
          : +rand(-6, 22).toFixed(1);
      const sampleNeeded = randInt(8000, 24000);
      const sampleHave = Math.round(sampleNeeded * progress / 100);
      const eta = status === 'pending' ? randInt(36, 96)
        : status === 'testing' ? randInt(6, 48)
          : 0;

      row.isCreativeTest = true;
      row.creativeTest = {
        status,                                // 'pending' | 'testing' | 'winner' | 'loser'
        progress,                              // 0-100
        variantsCount: Math.min(ads.length, randInt(2, 4)),
        leader: {
          adId: leaderAd.id,
          name: leaderAd.creative.name,
          creative: leaderAd.creative,
          ctr: +(leaderAd.ctr || rand(1.2, 4.8)).toFixed(2),
          impressions: leaderAd.impressions,
        },
        runnerUp: runnerAd ? {
          adId: runnerAd.id,
          name: runnerAd.creative.name,
          creative: runnerAd.creative,
          ctr: +Math.max(0.4, (leaderAd.ctr || 2) - rand(0.2, 1.4)).toFixed(2),
          impressions: runnerAd.impressions,
        } : null,
        liftCtr,                               // CTR 相对 control 的提升（可负）
        sampleHave, sampleNeeded,
        eta,                                   // 小时
        hypothesis: pickOne(CT_HYPOTHESIS_POOL),
        confidence: status === 'winner' ? randInt(95, 99)
          : status === 'loser' ? randInt(92, 98)
            : randInt(40, 88),                  // %
        startedDaysAgo: status === 'pending' ? 0 : randInt(1, 12),
      };
    });
  }
  attachCreativeTestContext();
  let aiSummaryCollapsed = false;
  let currentPreset = 'phase1Midflight';
  let currentScenario = 'anomalyMonitor';
  let currentPhaseOneReport = 'phase1MetaImported';
  let currentWorkflowView = 'detail';
  let pageSize = 50;      // 默认每页 50
  let currentPage = 1;
  let currentLevel = 'campaign'; // 'campaign' | 'adgroup' | 'ad'

  // 搜索态
  let searchMode = 'name';       // 'name' | 'creative'
  let searchQuery = '';

  // 批量选择态
  // ad 选择：campaignId -> Set(adId)；campaign 选择：Set(campaignId)
  const selectedAds = new Map();
  const selectedCampaigns = new Set();
  const selectedAdGroups = new Set();

  // 复制/粘贴剪贴板
  let clipboard = null; // { sourceAdId, sourceAdName, fields: { text, cta, addon, url } }

  // ============== 创意缩略图（复用渲染） ==============
  // size: 'sm' (行内 28×28) | 'md' (展开行 40×40) | 'lg' (卡片，16:9)
  // 采用真实图片作为底图（Unsplash 通过 photoId 拉取），SVG 仅负责视频 chrome / AD 标 / 品牌水印 overlay
  function renderCreativeThumb(cr, size = 'md') {
    if (!cr) return '';
    const id = `cv-${cr.id}-${size}`;
    const c1 = cr.color || '#6366f1';
    const c2 = cr.color2 || '#312e81';
    const isVideo = cr.type === 'video';
    const duration = cr.duration || (isVideo ? (cr._dur || (cr._dur = `${randInt(6, 30)}s`)) : null);

    const W = 100, H = 60;
    const imgW = size === 'lg' ? 480 : (size === 'md' ? 200 : 120);
    const url = photoUrl(cr, imgW);

    // 视频型：右下时长 + 居中播放键；图片型：左上 "AD" 标
    const videoChrome = isVideo ? `
      <g class="cv-video-chrome">
        <circle cx="${W/2}" cy="${H/2}" r="9" fill="rgba(0,0,0,.45)"/>
        <polygon points="${W/2-2.5},${H/2-4} ${W/2-2.5},${H/2+4} ${W/2+4},${H/2}" fill="#fff"/>
        <rect x="${W-20}" y="${H-11}" width="17" height="8" rx="2" fill="rgba(0,0,0,.6)"/>
        <text x="${W-11.5}" y="${H-5}" text-anchor="middle" font-size="6" font-family="Inter, Arial, sans-serif" fill="#fff" font-weight="600">${duration || ''}</text>
        <rect x="3" y="${H-2}" width="${(W-6)*0.45}" height="1.2" rx=".6" fill="#fff" opacity=".95"/>
        <rect x="${3+(W-6)*0.45}" y="${H-2}" width="${(W-6)*0.55}" height="1.2" rx=".6" fill="#fff" opacity=".35"/>
      </g>
    ` : `
      <g class="cv-image-chrome">
        <rect x="4" y="4" width="13" height="8" rx="2" fill="rgba(0,0,0,.55)"/>
        <text x="10.5" y="9.8" text-anchor="middle" font-size="5.5" font-family="Inter, Arial, sans-serif" fill="#fff" font-weight="700" letter-spacing=".5">AD</text>
      </g>
    `;

    const initials = size === 'sm' ? '' : `
      <text x="${W-4}" y="11" text-anchor="end" font-size="7" font-family="Inter, Arial, sans-serif" fill="#fff" opacity=".85" font-weight="700" letter-spacing=".8" style="paint-order:stroke; stroke:rgba(0,0,0,.35); stroke-width:.4;">${cr.initials}</text>
    `;

    // 图片加载失败时降级到原色渐变（style onerror）
    const fallbackBg = `background: linear-gradient(135deg, ${c1}, ${c2});`;

    return `
      <span class="cv-thumb cv-thumb-${size} ${isVideo ? 'is-video' : 'is-image'}" title="${cr.name}" style="${fallbackBg}">
        <img class="cv-thumb-img" src="${url}" alt="${cr.name}" loading="lazy" decoding="async"
             referrerpolicy="no-referrer"
             onerror="this.style.display='none'"/>
        <svg class="cv-thumb-overlay" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          ${initials}
          ${size !== 'sm' ? videoChrome : (isVideo
            ? `<circle cx="${W/2}" cy="${H/2}" r="6" fill="rgba(0,0,0,.45)"/><polygon points="${W/2-1.8},${H/2-2.6} ${W/2-1.8},${H/2+2.6} ${W/2+2.6},${H/2}" fill="#fff"/>`
            : '')}
        </svg>
      </span>
    `;
  }

  // 场景化 SVG 前景：根据 scene 类型返回一组分层图形
  function renderSceneSvg(scene, cr) {
    switch (scene) {
      case 'sale':
        // 降价吊牌 + %OFF + 粒子
        return `
          <g>
            <circle cx="18" cy="46" r="2.2" fill="#fbbf24" opacity=".8"/>
            <circle cx="82" cy="14" r="1.6" fill="#fde68a" opacity=".7"/>
            <circle cx="70" cy="48" r="1.2" fill="#fff" opacity=".6"/>
            <g transform="translate(62 10) rotate(-15)">
              <path d="M0 6 L8 0 L30 0 L30 20 L8 20 L0 14 Z" fill="#fff"/>
              <circle cx="6" cy="10" r="1.5" fill="${cr.color}"/>
              <text x="19" y="13.5" text-anchor="middle" font-size="8" font-weight="800" fill="${cr.color2}" font-family="Inter, Arial">70%</text>
            </g>
            <rect x="6" y="40" width="36" height="4" rx="2" fill="#fff" opacity=".85"/>
            <rect x="6" y="46" width="22" height="3" rx="1.5" fill="#fff" opacity=".55"/>
          </g>
        `;
      case 'topview':
        // 霓虹光束 + 手机竖屏 + 品牌 logo
        return `
          <g>
            <path d="M0 0 L100 0 L100 18 L0 40 Z" fill="#fff" opacity=".08"/>
            <g transform="translate(40 10)">
              <rect x="0" y="0" width="20" height="38" rx="3" fill="#111827" stroke="#fff" stroke-width=".8" opacity=".95"/>
              <rect x="2" y="3" width="16" height="30" rx="1.5" fill="${cr.color}"/>
              <circle cx="10" cy="18" r="4" fill="#fff" opacity=".95"/>
              <polygon points="8.5,15.5 8.5,20.5 12.5,18" fill="${cr.color2}"/>
              <rect x="7" y="35" width="6" height="1.5" rx=".7" fill="#fff" opacity=".6"/>
            </g>
            <circle cx="18" cy="46" r="1.4" fill="#fff" opacity=".6"/>
            <circle cx="86" cy="48" r="1.1" fill="#fff" opacity=".5"/>
          </g>
        `;
      case 'app':
        // 手机 + app 图标网格
        return `
          <g>
            <g transform="translate(36 8)">
              <rect x="0" y="0" width="28" height="44" rx="4" fill="#0f172a" opacity=".92"/>
              <rect x="2" y="4" width="24" height="36" rx="2" fill="${cr.color2}"/>
              <rect x="4"  y="7"  width="6" height="6" rx="1.5" fill="#fff" opacity=".9"/>
              <rect x="12" y="7"  width="6" height="6" rx="1.5" fill="#fbbf24"/>
              <rect x="20" y="7"  width="4" height="6" rx="1.5" fill="#22d3ee"/>
              <rect x="4"  y="15" width="6" height="6" rx="1.5" fill="#f472b6"/>
              <rect x="12" y="15" width="6" height="6" rx="1.5" fill="#34d399"/>
              <rect x="20" y="15" width="4" height="6" rx="1.5" fill="#fff" opacity=".8"/>
              <rect x="4" y="24" width="20" height="12" rx="1.5" fill="#fff" opacity=".15"/>
              <rect x="6" y="27" width="10" height="1.6" rx=".8" fill="#fff" opacity=".7"/>
              <rect x="6" y="30" width="14" height="1.2" rx=".6" fill="#fff" opacity=".4"/>
            </g>
            <rect x="6" y="50" width="22" height="4" rx="2" fill="#fff" opacity=".22"/>
            <rect x="72" y="12" width="20" height="4" rx="2" fill="#fff" opacity=".18"/>
          </g>
        `;
      case 'holiday':
        // 礼盒 + 蝴蝶结 + 雪花
        return `
          <g>
            <g opacity=".55" fill="#fff">
              <circle cx="14" cy="14" r="1"/><circle cx="84" cy="10" r=".8"/>
              <circle cx="20" cy="50" r=".8"/><circle cx="90" cy="44" r="1.1"/>
              <circle cx="50" cy="8" r=".7"/>
            </g>
            <g transform="translate(36 18)">
              <rect x="0" y="8" width="28" height="22" rx="2" fill="#fff"/>
              <rect x="0" y="8" width="28" height="22" rx="2" fill="${cr.color}" opacity=".55"/>
              <rect x="12" y="8" width="4" height="22" fill="${cr.color2}"/>
              <rect x="0" y="16" width="28" height="4" fill="${cr.color2}"/>
              <path d="M14 8 C 6 2, 2 6, 8 10 C 14 7, 14 8, 14 8 Z" fill="${cr.color2}"/>
              <path d="M14 8 C 22 2, 26 6, 20 10 C 14 7, 14 8, 14 8 Z" fill="${cr.color2}"/>
              <circle cx="14" cy="8" r="2" fill="#fbbf24"/>
            </g>
          </g>
        `;
      case 'summer':
        // 太阳 + 海面 + 椰子树剪影
        return `
          <g>
            <circle cx="78" cy="16" r="8" fill="#fde68a"/>
            <circle cx="78" cy="16" r="5.5" fill="#fbbf24"/>
            <path d="M0 42 Q 25 36, 50 42 T 100 42 L 100 60 L 0 60 Z" fill="#0ea5e9" opacity=".85"/>
            <path d="M0 48 Q 25 44, 50 48 T 100 48" stroke="#fff" stroke-width=".8" fill="none" opacity=".7"/>
            <g transform="translate(14 20)">
              <path d="M4 22 L4 38" stroke="#78350f" stroke-width="2"/>
              <path d="M4 22 C -4 18, -2 12, 6 16 Z" fill="#15803d"/>
              <path d="M4 22 C 12 18, 12 12, 2 16 Z" fill="#16a34a"/>
              <path d="M4 22 C 0 14, 6 10, 8 18 Z" fill="#22c55e"/>
            </g>
          </g>
        `;
      case 'ugc':
        // 创作者头像 + 直播指示 + 聊天气泡
        return `
          <g>
            <circle cx="36" cy="30" r="14" fill="#fff" opacity=".12"/>
            <circle cx="36" cy="26" r="6" fill="#fde68a"/>
            <path d="M24 42 C 26 34, 46 34, 48 42 L 48 50 L 24 50 Z" fill="#fde68a"/>
            <circle cx="33.5" cy="25" r=".9" fill="#78350f"/>
            <circle cx="38.5" cy="25" r=".9" fill="#78350f"/>
            <path d="M34 28 Q 36 30, 38 28" stroke="#78350f" stroke-width=".8" fill="none"/>
            <g transform="translate(62 14)">
              <rect x="0" y="0" width="30" height="14" rx="3" fill="#fff"/>
              <circle cx="6" cy="7" r="1.5" fill="#ef4444"/>
              <rect x="10" y="5" width="14" height="1.6" rx=".8" fill="#475569"/>
              <rect x="10" y="8.5" width="10" height="1.4" rx=".7" fill="#94a3b8"/>
            </g>
            <rect x="6" y="50" width="14" height="4" rx="2" fill="#ef4444"/>
            <text x="13" y="53.2" text-anchor="middle" font-size="3.4" font-weight="700" fill="#fff" font-family="Inter, Arial">LIVE</text>
          </g>
        `;
      case 'product':
        // 运动鞋/商品 + 价签
        return `
          <g>
            <ellipse cx="50" cy="48" rx="34" ry="4" fill="rgba(0,0,0,.25)"/>
            <g transform="translate(22 28)">
              <path d="M0 14 C 2 6, 14 4, 22 6 C 30 8, 36 10, 44 10 C 50 10, 54 14, 54 18 L 0 18 Z" fill="#fff"/>
              <path d="M0 14 C 2 6, 14 4, 22 6 C 30 8, 36 10, 44 10 C 50 10, 54 14, 54 18 L 0 18 Z" fill="${cr.color}" opacity=".55"/>
              <path d="M8 12 L 14 7" stroke="${cr.color2}" stroke-width="1.2"/>
              <path d="M16 11 L 22 7" stroke="${cr.color2}" stroke-width="1.2"/>
              <path d="M26 11 L 32 8" stroke="${cr.color2}" stroke-width="1.2"/>
              <rect x="0" y="16" width="54" height="2" fill="${cr.color2}"/>
            </g>
            <g transform="translate(66 10) rotate(12)">
              <path d="M0 0 L14 0 L18 6 L14 12 L0 12 Z" fill="#fbbf24"/>
              <circle cx="3.5" cy="6" r="1.2" fill="#fff"/>
              <text x="11" y="8.5" text-anchor="middle" font-size="5.5" font-weight="800" fill="#78350f" font-family="Inter, Arial">$49</text>
            </g>
          </g>
        `;
      case 'lead':
        // 表单 / 订阅卡
        return `
          <g>
            <g transform="translate(16 10)">
              <rect x="0" y="0" width="68" height="40" rx="4" fill="#fff"/>
              <rect x="0" y="0" width="68" height="10" rx="4" fill="${cr.color2}"/>
              <rect x="4" y="3" width="26" height="4" rx="2" fill="#fff" opacity=".85"/>
              <rect x="4" y="15" width="60" height="4" rx="1" fill="#e5e7eb"/>
              <rect x="4" y="22" width="40" height="4" rx="1" fill="#e5e7eb"/>
              <rect x="4" y="30" width="22" height="6" rx="1.5" fill="${cr.color}"/>
              <text x="15" y="34.5" text-anchor="middle" font-size="4" fill="#fff" font-weight="700" font-family="Inter, Arial">Sign up</text>
              <path d="M52 28 L 56 32 L 64 24" stroke="${cr.color}" stroke-width="2" fill="none"/>
            </g>
          </g>
        `;
      default:
        return `
          <g>
            <circle cx="50" cy="30" r="14" fill="#fff" opacity=".2"/>
            <circle cx="50" cy="30" r="8" fill="#fff" opacity=".3"/>
          </g>
        `;
    }
  }

  const tbody = document.querySelector('.ct-body tbody');
  const modalRoot = document.querySelector('[data-role="modal-root"]');

  // ============== 过滤 ==============
  // Split test: 两个对照组 Campaign，第一个为 Winner
  const SPLIT_CAMPAIGN_NAMES = ['Black Friday Flash Sale', 'Black Friday Mega Deals'];
  const SPLIT_WINNER = SPLIT_CAMPAIGN_NAMES[0];

  const filters = {
    // ---- 工作流新分法 ----
    planning: () => DATA,
    setup: () => DATA.filter(r => r.subType === 'draft' || r.fromMeta || r.isCreativeTest || /black friday|launch|catalog/i.test(r.name)),
    midflight: () => DATA.filter(r => r.subType !== 'draft' && r.subType !== 'paused'),
    review: () => DATA.filter(r => r.subType === 'paused' || r.subType === 'none'),
    phase1Preflight: () => DATA.filter(r => r.subType === 'draft' || r.fromMeta || r.bulkImported || /black friday|launch|catalog|summer|creator/i.test(r.name)),
    phase1Midflight: () => DATA.filter(r => r.subType !== 'draft' && r.subType !== 'paused'),
    phase1Rejected: () => DATA.filter(r => r.subType === 'rejected').slice(0, 3),
    phase1Insufficient: () => DATA.filter(r => r.subType === 'lowspend').slice(0, 5),
    phase1MetaImported: () => DATA.filter(r => r.fromMeta),
    phase1BulkImported: () => DATA.filter(r => r.bulkImported),
    phase1CreativeTesting: () => DATA.filter(r => r.isCreativeTest),
    // 兼容上一版 3 块结构
    prelaunch: () => DATA.filter(r => r.subType === 'draft' || r.subType === 'rejected' || r.isOn === false),
    active: () => DATA.filter(r => r.subType !== 'draft' && r.subType !== 'rejected' && r.subType !== 'paused' && r.isOn !== false),
    // ---- 兼容原分法 ----
    all: () => DATA,
    rejected: () => DATA.filter(r => r.subType === 'rejected'),
    opportunities: () => DATA.filter(r =>
      ['fatigue', 'lowspend', 'learning', 'budget'].includes(r.subType)
    ),
    blackfriday: () => DATA.filter(r => /black friday/i.test(r.name)),
    topview: () => DATA.filter(r => /topview/i.test(r.name)),
    split: () => DATA.filter(r => SPLIT_CAMPAIGN_NAMES.includes(r.name)),
    metaimported: () => DATA.filter(r => r.fromMeta),
    // AIGC: 任一 ad 是 AIGC 的 campaign 都纳入
    aigc: () => DATA.filter(r => (r.ads || []).some(ad => ad.isAigc)),
    // Creative testing: 携带素材测试上下文的 campaign
    creativetest: () => DATA.filter(r => r.isCreativeTest),
  };

  const PHASE_ONE_WORKFLOWS = {
    phase1Preflight: {
      label: '投前',
      phase: 'Preflight',
      defaultScenario: 'metaMigration',
      scenarios: {
        metaMigration: {
          label: '跨媒体迁移',
          short: '把 Meta 素材和 campaign 结构迁移到 TikTok，并自动打上 Meta imported label。',
          summary: '适合已经在 Meta 跑过一轮、有可复用资产的广告主：先迁移，再做 TikTok 适配。',
          actions: [
            ['Meta 素材迁移', 'metaAssetImport', '把 Meta creative library 迁移到 TikTok 素材库'],
            ['Meta campaign 迁移', 'metaCampaignImport', '迁移 campaign/ad group 结构并标记 Meta imported'],
          ],
        },
        bulkCreation: {
          label: '批量创编',
          short: '用表格导入和 campaign duplicate 快速复制结构，并自动打上 Bulk imported label。',
          summary: '适合明确要投什么、但需要批量建广的优化师：减少重复设置，保留后续盯盘标签。',
          actions: [
            ['bulk import', 'bulkImport', '从 spreadsheet 批量生成 campaigns'],
            ['campaign duplicate', 'campaignDuplicate', '复制高潜 campaign 结构并标记 Bulk imported'],
          ],
        },
      },
    },
    phase1Midflight: {
      label: '投中',
      phase: 'Midflight',
      defaultScenario: 'anomalyMonitor',
      scenarios: {
        anomalyMonitor: {
          label: '异常监控',
          short: '当前有 3 个 rejected campaign 和 5 个 insufficient spending campaign 需要处理。',
          summary: '先把阻断投放的问题拉出来，再在同一版位直接发起复审或批量调 bid。',
        },
        dailyReport: {
          label: 'Daily report',
          short: '用投前自动沉淀的 label 快速筛选 campaign，并生成可视化日报。',
          summary: '把 Meta imported、Creative Testing 等投前来源变成投中盯盘入口，避免手动找 campaign。',
        },
      },
    },
  };

  const PHASE_ONE_REPORT_PRESETS = new Set(['phase1MetaImported', 'phase1BulkImported', 'phase1CreativeTesting']);
  const PHASE_ONE_ISSUE_PRESETS = new Set(['phase1Rejected', 'phase1Insufficient']);

  const WORKFLOW_EXPERIENCE = {
    planning: {
      label: 'Planning', phase: '策略规划', priority: 'P2', defaultScenario: 'industry', filter: 'planning', tone: 'hot',
      scenarios: {
        industry: {
          label: '行业洞察', short: '美妆 ROAS +15%，开箱素材 CTR 更高', severity: 'hot',
          title: '先判断市场机会：这个品类现在值不值得加码？',
          desc: '帮助 media buyer 在还没进入建广前，把“行业在变好”翻译成可执行的投放判断：应该投哪个类目、用什么创意角度、优先打哪类人群，以及这轮测试的起始预算该多激进。',
          evidence: [['+15%', 'Beauty ROAS benchmark WoW'], ['开箱/测评', 'Winning creative pattern'], ['精致妈妈', 'High-index audience segment']],
          tools: [['生成行业机会简报', '把 benchmark / category / audience / creative 整成 1 页 brief'], ['拉取 winning creative patterns', '找出可复用的 hook、场景、卖点表达'], ['生成 test entry plan', '把行业信号转成初始 campaign 结构']],
          playbookTitle: 'How this helps the media buyer',
          playbook: [
            ['判断机会窗口', '先看品类 ROAS、CPM、CTR 和竞争强度，避免只凭主观感觉决定是否加码。'],
            ['翻译成投放入口', '把“美妆涨了”拆成货品、受众、创意角度和预算起点，形成能直接给 setup 用的 input。'],
            ['输出初版 brief', '生成一份给 media buyer / creative team 共用的 brief：投什么、为什么、先测什么。']
          ],
          outcome: '输出：1 页机会判断 + 3 个可测试创意方向 + 初版 campaign entry plan',
          tags: ['Benchmark', 'Creative trend', 'Audience insight']
        },
        mediaStrategy: {
          label: '投放策略', short: '目标 → portfolio / budget / pacing / testing plan', severity: 'normal',
          title: '把业务目标翻译成一套可执行的 Media Plan',
          desc: '当广告主已经知道要投，但还没把目标拆成投放结构时，这个策略帮助 media buyer 决定：用什么 campaign portfolio、预算怎么分、节奏怎么跑、哪些变量需要进入第一轮测试。',
          evidence: [['ROAS target', '目标需要拆到 campaign level'], ['$12k', 'Budget needs allocation'], ['3 tests', '素材/人群/出价变量待设计']],
          tools: [['Media Plan generator', '生成 campaign portfolio、预算分配和 pacing 草案'], ['Budget & pacing simulator', '模拟 7/14/30 天消耗节奏与风险'], ['Testing matrix', '把变量拆成可执行测试矩阵']],
          playbookTitle: 'Media plan assembly',
          playbook: [
            ['确定投放目标', '把 GMV、ROAS、new buyer 或 lead target 转成 campaign 层级的 KPI。'],
            ['拆 campaign portfolio', '区分 prospecting、retargeting、catalog、creative testing，不把所有目标塞进一个 campaign。'],
            ['设置节奏护栏', '提前定义预算上限、CPA/ROAS 阈值和学习期观察窗口，给投中监控留下规则。']
          ],
          outcome: '输出：Portfolio 结构 + 预算分配 + Pacing guardrail + 第一轮测试矩阵',
          tags: ['Portfolio', 'Budget', 'Pacing']
        }
      }
    },
    setup: {
      label: 'Campaign Setup', phase: '投前准备', priority: 'P0', defaultScenario: 'metaImport', filter: 'setup', tone: 'hot',
      scenarios: {
        metaImport: {
          label: '跨媒体迁移', short: 'Meta/Google 资产可复用，但需要 TikTok-native 改造', severity: 'hot',
          title: '把 Meta / Google 的可用资产迁移成 TikTok 可投放结构',
          desc: '这个策略不是简单上传素材，而是帮助 media buyer 完成“资产审计 → 结构映射 → TikTok 适配 → 上线检查”：复用已有高表现资产，同时避免因为比例、身份、Pixel、命名和审核规则不同导致上线后返工。',
          evidence: [['5', 'High-performing campaigns to migrate'], ['12', 'Creatives ready for adaptation'], ['9:16', 'Need TikTok-native reframing']],
          tools: [['Import from Meta/Google', '迁移 campaign、ad group、creative 和基础设置'], ['Creative adaptation queue', '自动裁切 9:16、补字幕、改首帧'], ['Preflight mapping check', '检查 Pixel、Identity、UTM、命名和审核风险']],
          playbookTitle: 'Migration checklist',
          playbook: [
            ['筛选可迁移资产', '只迁移 Meta/Google 里稳定胜出的 campaign 和 creative，避免把低效历史包袱也带进来。'],
            ['映射 TikTok 结构', '把原平台 objective、audience、budget、placements 映射成 TikTok Ads Manager 可编辑草稿。'],
            ['做 TikTok-native 适配', '补齐 9:16、前 3 秒 hook、字幕、落地页事件和身份资产，降低上线失败率。']
          ],
          outcome: '输出：可编辑 campaign drafts + creative adaptation queue + launch readiness checklist',
          tags: ['Meta import', 'Creative adaptation', 'Preflight']
        },
        creativeTestPlan: {
          label: '投前测试', short: '3 hypotheses ready to test', severity: 'normal',
          title: '把“想测一下”变成可判断胜负的投前测试计划',
          desc: '帮助 media buyer 在上线前把测试设计清楚：测什么假设、控制哪些变量、预算怎么分、多久看结果、什么条件算赢。这样投中看到数据时，不会变成临时拍脑袋调预算。',
          evidence: [['3 hypotheses', 'Hook / audience / offer variables'], ['48h', 'First read window'], ['Winner rule', 'Scale rule needs setup']],
          tools: [['Create testing matrix', '生成 hypothesis、变量、对照组和预算分配'], ['Bulk duplicate test cells', '一键复制 ad groups 并锁定单一变量'], ['Set winner rule', '预设放量、淘汰、延长观察规则']],
          playbookTitle: 'Experiment design',
          playbook: [
            ['定义假设', '例如“开箱 hook 比价格 hook CTR 更高”，而不是只写“测素材”。'],
            ['隔离变量', '同一轮测试只改变 hook、audience 或 offer 之一，确保结果可解释。'],
            ['预设动作', '上线前就写好 winner / loser rule，投中直接执行，不再反复讨论。']
          ],
          outcome: '输出：测试矩阵 + ad group 草稿 + winner/loser 自动判断规则',
          tags: ['Hypothesis', 'Controlled test', 'Winner rule']
        }
      }
    },
    midflight: {
      label: 'Midflight Monitor', phase: '投中盯盘', priority: 'P0', defaultScenario: 'hardBlocker', filter: 'midflight', tone: 'critical',
      scenarios: {
        hardBlocker: {
          label: '异常监控', short: '3 ad groups rejected，需要申诉/修复', severity: 'critical',
          title: '先把影响投放的 hard blocker 从报表噪音里拎出来',
          desc: '投中盯盘最重要的是别让 media buyer 淹没在指标里。这个策略把 rejected、no delivery、spend drop、learning stuck 等硬阻塞集中成一个影响队列，并直接给出修复、申诉或暂停动作。',
          evidence: [['3', 'Ad groups rejected'], ['0 delivery', 'Blocked spend on affected groups'], ['2.4h', 'Estimated lost learning time']],
          tools: [['Triage blocker queue', '按影响金额、状态和可修复性排序'], ['Smart fix & resubmit', '自动改文案/替换片段并重新提交审核'], ['Submit appeal / pause', '批量申诉或暂停无法修复对象']],
          playbookTitle: 'Triage flow',
          playbook: [
            ['识别影响范围', '先告诉 media buyer 哪些异常真的影响消耗和学习，而不是泛泛提示状态异常。'],
            ['给出原因和责任位', '定位是素材、文案、落地页、身份资产还是审核政策导致。'],
            ['直接进入处理动作', '把每条异常接到 Smart fix、appeal、pause 或 replace creative，减少跳转查找。']
          ],
          outcome: '输出：按影响排序的 blocker queue + 每个 blocker 的推荐处理动作',
          tags: ['Status2Action', 'Policy', 'No delivery']
        },
        automationGuardrail: {
          label: '自动规则与托管', short: '5 guardrails ready，可减少重复盯盘', severity: 'normal',
          title: '把重复盯盘动作变成可托管的 guardrails',
          desc: '当 media buyer 已经知道自己每天会重复看哪些阈值，这个策略把消耗、CPA、ROAS、no delivery、rejected 等判断变成自动规则。它不是完全代投，而是把“我本来就会做的巡检动作”托管出去。',
          evidence: [['5 rules', 'Ready to apply'], ['CPA/ROAS', 'Thresholds inferred from target'], ['Always-on', 'Coverage outside office hours']],
          tools: [['Generate automation rules', '根据账户目标生成规则草案'], ['Simulate rule impact', '预估过去 7 天会触发哪些动作'], ['Turn on managed mode', '开启预算、暂停、提醒或素材替换托管']],
          playbookTitle: 'Guardrail setup',
          playbook: [
            ['选择托管范围', '区分提醒型规则、建议型规则和自动执行型规则，避免一上来就全自动。'],
            ['校准阈值', '用历史 7/14 天表现回测 CPA、ROAS、消耗速度阈值是否合理。'],
            ['设置复核机制', '每次自动动作保留原因、影响和回滚入口，media buyer 仍然掌控最终策略。']
          ],
          outcome: '输出：可回测的 automation rule set + 触发说明 + managed action log',
          tags: ['Automation rule', 'Guardrail', 'Managed mode']
        }
      }
    },
    review: {
      label: 'Post Campaign Review', phase: '投后复盘', priority: 'P1', defaultScenario: 'sotReport', filter: 'review', tone: 'hot',
      scenarios: {
        sotReport: {
          label: '复盘解读', short: '解释 performance 为什么变化，而不是只导出报表', severity: 'hot',
          title: '把投后数据读成 media buyer 能复用的结论',
          desc: '复盘的第一步不是导 CSV，而是解释 performance movement：是流量质量变了、创意疲劳了、人群学到了、预算节奏错了，还是归因链路影响了判断。这个策略帮助 media buyer 快速读懂“发生了什么”和“为什么”。',
          evidence: [['3 paths', 'Impression → Click → Conversion / VV / NSR'], ['-18%', 'CTR drop after creative fatigue'], ['+12%', 'Retargeting CVR lift']],
          tools: [['Generate performance readout', '自动拆解指标链路和主要变化原因'], ['Creative & audience diagnosis', '识别创意、人群、预算哪一环驱动变化'], ['Export narrative report', '生成可对外讲述的复盘摘要']],
          playbookTitle: 'Readout structure',
          playbook: [
            ['先看目标是否达成', '用目标 KPI 组织复盘，而不是从所有指标逐个解释。'],
            ['拆 movement driver', '把变化归因到 media、creative、audience、budget pacing 或 measurement。'],
            ['沉淀可复用 learning', '把“为什么赢/为什么输”写成下一轮能继承的规则。']
          ],
          outcome: '输出：原因归因 + 关键 learning + 可分享的复盘叙事',
          tags: ['Readout', 'Driver analysis', 'Learning']
        },
        nextPlan: {
          label: 'Action 建议', short: '把复盘结论转成下一轮可执行动作', severity: 'normal',
          title: '从复盘直接生成下一轮投放动作，而不是停在总结',
          desc: '复盘真正的价值是进入下一轮 action。这个策略把赢家、输家、人群资产、创意 learning 和预算迁移建议转成下一轮 campaign draft、creative brief、retargeting plan 或 automation guardrail。',
          evidence: [['3 actions', 'Ready to roll into next plan'], ['15k', 'ATC non-buyers for retargeting'], ['Top hooks', 'Creative brief can be generated']],
          tools: [['Generate next media plan', '把复盘结论转成下一轮 portfolio 和预算建议'], ['Create retargeting campaign', '用沉淀人群直接生成 campaign draft'], ['Generate creative brief', '把 winning hook / visual / CTA 转成创意需求']],
          playbookTitle: 'Action handoff',
          playbook: [
            ['保留赢家', '把高 ROAS SKU、winning audience、winning creative 直接迁移到下一轮计划。'],
            ['处理输家', '给低效组合标记降预算、暂停、排除或重新测试。'],
            ['生成下一轮草稿', '把复盘 learning 自动落到 campaign draft、brief 和 retargeting audience。']
          ],
          outcome: '输出：下一轮 Media Plan 草案 + campaign drafts + creative/action backlog',
          tags: ['Next plan', 'Retargeting', 'Creative brief']
        }
      }
    }
  };

  const WORKFLOW_STRATEGY_LIBRARY = {
    planning: [
      { key: 'industry', label: '行业洞察', job: '判断该不该投、投什么类目/货品', signal: '美妆 ROAS +15%，开箱素材 CTR 更高' },
      { key: 'mediaStrategy', label: '投放策略', job: '把业务目标拆成 portfolio、预算、节奏和测试矩阵', signal: '目标 → Media plan' },
      { key: 'eventPlan', label: '大促节点规划', job: '提前规划节点、节奏、素材和预算窗口', signal: 'Ramadan / Black Friday media calendar ready' },
      { key: 'budgetPlanner', label: '预算节奏规划', job: '在投前确认 portfolio、pacing 和 spend guardrail', signal: '预算分配与节奏仍未锁定' },
      { key: 'creativeDirection', label: '创意方向规划', job: '把行业趋势转成 hook / visual / format brief', signal: '开箱、测评、达人素材表现更强' },
    ],
    setup: [
      { key: 'metaImport', label: '跨媒体迁移', job: '复用 Meta/Google 资产并做 TikTok 适配', signal: 'Meta/Google assets ready' },
      { key: 'creativeTestPlan', label: '投前测试', job: '把素材/人群/offer 假设变成可判断胜负的实验计划', signal: '3 hypotheses ready' },
      { key: 'bulkBuild', label: '批量建广', job: '快速复制、导入、批量设置 campaign/ad group', signal: '预算/排期待补齐' },
      { key: 'creativeSupply', label: '素材补给', job: '发现素材数量不足并生成补充素材', signal: '部分 ad groups creatives < 3' },
      { key: 'preflightCheck', label: '投前检查', job: '上线前检查 Pixel、Identity、预算、审核风险', signal: 'Pixel / Identity / policy checklist pending' },
    ],
    midflight: [
      { key: 'hardBlocker', label: '异常监控', job: '发现 rejected / no delivery 等硬阻塞并处理', signal: '3 ad groups rejected' },
      { key: 'automationGuardrail', label: '自动规则托管', job: '把重复盯盘阈值转成可回测、可托管的规则', signal: '5 guardrails ready' },
      { key: 'spendingSurge', label: '消耗异常', job: '监控消耗过快、CPA 偏离和预算浪费', signal: 'Budget used 82% before noon' },
      { key: 'opportunityMining', label: '机会挖掘', job: '找到可加预算、可扩量、可复制的赢家', signal: '2 winners can scale' },
      { key: 'creativeFatigue', label: '创意疲劳', job: '识别疲劳素材并触发替换或混剪', signal: 'CTR down 23% after day 5' },
    ],
    review: [
      { key: 'sotReport', label: '复盘解读', job: '解释 performance 为什么变化，并沉淀可复用 learning', signal: 'Why performance moved' },
      { key: 'nextPlan', label: 'Action 建议', job: '把复盘结论转成下一轮 media plan、draft 和 creative brief', signal: '3 actions to next plan' },
      { key: 'retargeting', label: '人群沉淀', job: '把复盘结论转成 retargeting / LAL 人群资产', signal: '15k ATC non-buyers' },
      { key: 'creativeAttribution', label: '创意归因', job: '拆解 winning creative 的 hook、visual、CTA', signal: 'Top 10% creatives share same hook' },
    ],
  };

  const WORKFLOW_EXTRA_SCENARIOS = {
    eventPlan: {
      label: '大促节点规划', short: 'Ramadan / Black Friday media calendar ready', severity: 'normal',
      title: '建议提前把大促节点拆成预算、节奏、素材和上线窗口',
      desc: '适合节点型投放：把行业节奏、货品库存、素材产能和审核时间放到同一个 media calendar，避免临近节点才补素材或调预算。',
      evidence: [['4 weeks', '建议提前准备窗口'], ['3 waves', '预热/爆发/返场节奏'], ['Calendar', '节点排期可同步到 campaign setup']],
      tools: [['Build event calendar', '生成大促投放排期'], ['Budget Planner', '按阶段分配预算'], ['Creative checklist', '生成素材准备清单']],
    },
    budgetPlanner: {
      label: '预算节奏规划', short: '预算分配与节奏仍未锁定', severity: 'normal',
      title: '建议先锁定 portfolio budget 和 pacing guardrail',
      desc: '适合投前预算不确定的客户：先基于目标、历史 ROAS 和库存优先级生成预算分配，再把节奏约束带入 setup 和 midflight 监控。',
      evidence: [['$12k', 'budget to allocate'], ['3 portfolios', '按货品/目标拆分'], ['Guardrail', '节奏阈值可带入自动规则']],
      tools: [['Portfolio Planner', '生成预算组合'], ['Pacing simulator', '预估每日消耗节奏'], ['Set guardrails', '同步预算阈值']],
    },
    creativeDirection: {
      label: '创意方向规划', short: '开箱、测评、达人素材表现更强', severity: 'hot',
      title: '建议把行业创意趋势转成下一轮 creative brief',
      desc: '适合还没进入制作的阶段：从行业 winning pattern 提炼 hook、visual、format 和达人方向，给创意生产一个明确 brief。',
      evidence: [['开箱', 'CTR 高于行业均值'], ['达人测评', '转化链路更短'], ['Brief', '可直接进入素材生产']],
      tools: [['Creative brief generator', '生成创意方向'], ['Creator matching', '推荐达人类型'], ['AIGC variants', '派生初版素材']],
    },
    creativeSupply: {
      label: '素材补给', short: '部分 ad groups creatives < 3', severity: 'normal',
      title: '检测到素材供给不足，建议上线前补齐素材池',
      desc: '适合投前 setup：如果 ad group 素材数量不足，容易影响探索效率和后续疲劳管理，需要提前补充变体。',
      evidence: [['<3', '部分 ad groups 素材不足'], ['AIGC', '可快速派生变体'], ['Testing', '可接入素材测试计划']],
      tools: [['Bulk supplement creatives', '批量补素材'], ['AIGC variations', '生成素材变体'], ['Creative testing', '配置测试计划']],
    },
    preflightCheck: {
      label: '投前检查', short: 'Pixel / Identity / policy checklist pending', severity: 'normal',
      title: '上线前建议完成 Pixel、Identity、预算和审核风险检查',
      desc: '适合 campaign launch 前最后一步：集中检查会导致无法投放或影响归因的问题，减少上线后返工。',
      evidence: [['Pixel', '事件匹配待确认'], ['Identity', '授权资产待绑定'], ['Policy', '审核风险可预扫']],
      tools: [['Preflight checklist', '一键检查上线风险'], ['Fix identity', '补齐身份资产'], ['Policy scan', '预扫素材风险']],
    },
    creativeTestPlan: {
      label: '素材测试计划', short: '3 hypotheses ready to test', severity: 'normal',
      title: '建议把素材测试假设一次性配置成实验计划',
      desc: '适合知道要测什么的优化师：把 hook、CTA、visual、audience 的测试假设配置成计划，并定义胜出规则。',
      evidence: [['3', 'creative hypotheses'], ['48h', '预计首轮判断窗口'], ['Winner rule', '胜出素材可自动放量']],
      tools: [['Create creative test', '生成测试计划'], ['Set winner rule', '设置胜出规则'], ['Duplicate variants', '批量复制测试组']],
    },
    opportunityMining: {
      label: '机会挖掘', short: '2 winners can scale', severity: 'hot',
      title: '检测到可加预算的赢家，建议扩量而不是只盯异常',
      desc: '投中不只止损，也要找到赢家：识别 ROAS、CPA、转化速度表现好的 campaign/ad group，并给出加预算或复制动作。',
      evidence: [['2 winners', 'ROAS above target'], ['+18%', '可增加预算空间'], ['Scale', '可复制到相似人群']],
      tools: [['Promote winners', '给赢家加预算'], ['Duplicate to LAL', '复制到相似人群'], ['Budget shift', '从低效组转预算']],
    },
    creativeFatigue: {
      label: '创意疲劳', short: 'CTR down 23% after day 5', severity: 'normal',
      title: '检测到创意疲劳，建议替换或混剪素材',
      desc: '适合投中素材管理：当 CTR、CVR 或频次指标出现疲劳信号，直接推荐替换素材、混剪变体或开启新测试。',
      evidence: [['-23%', 'CTR decline'], ['Day 5', '疲劳开始出现'], ['4 variants', '可派生替换素材']],
      tools: [['Replace fatigued creatives', '替换疲劳素材'], ['AI remix', '混剪新素材'], ['Launch creative test', '开启新测试']],
    },
    automationGuardrail: {
      label: '自动规则托管', short: '5 rules can be applied', severity: 'normal',
      title: '建议把重复盯盘动作托管成自动规则',
      desc: '适合高频盯盘账户：把消耗、CPA、ROAS、no delivery 等条件转成规则，减少人工巡检。',
      evidence: [['5 rules', '可直接应用'], ['CPA/ROAS', '阈值已识别'], ['Always-on', '持续盯盘']],
      tools: [['Create automation rules', '生成自动规则'], ['Set thresholds', '设置阈值'], ['Review rule impact', '预估影响范围']],
    },
    creativeAttribution: {
      label: '创意归因', short: 'Top 10% creatives share same hook', severity: 'hot',
      title: '建议拆解 winning creatives，沉淀下一轮创意方法',
      desc: '适合复盘后的创意学习：拆解 hook、visual、CTA、达人类型和商品卖点，形成下一轮 brief。',
      evidence: [['Top 10%', '高 ROAS 素材'], ['Same hook', '胜出素材共性明显'], ['Brief', '可回流到创意生产']],
      tools: [['Creative insights', '拆解素材表现'], ['Generate brief', '生成下一轮 brief'], ['Promote winning SKUs', '沉淀赢家货品']],
    },
    nextPlan: {
      label: '复盘到下一轮计划', short: '3 actions can roll into next plan', severity: 'normal',
      title: '建议把复盘结论直接转成下一轮 media plan',
      desc: '复盘不是结束，而是下一轮投放输入：把预算迁移、素材方向、人群包和货品优先级沉淀成计划草案。',
      evidence: [['3 actions', '可转入下一轮'], ['Budget shift', '预算迁移建议'], ['Draft', '可生成 campaign 草稿']],
      tools: [['Generate next media plan', '生成下一轮计划'], ['Create draft campaigns', '创建计划草稿'], ['Carry over learnings', '沉淀复盘结论']],
    },
    audienceLearning: {
      label: '人群学习回流', short: '18-24F purchase share increased', severity: 'normal',
      title: '建议把购买和互动人群学习回流到下一轮 targeting',
      desc: '适合复盘后的人群资产管理：把购买、加购、浏览、互动人群拆成资产，并用于复购、拉新和排除策略。',
      evidence: [['18-24F', '购买占比提升'], ['ATC', '加购人群可重定向'], ['Exclude', '低质人群可排除']],
      tools: [['Audience package', '生成人群包'], ['Create retargeting', '创建重定向计划'], ['Create LAL', '扩展相似人群']],
    },
  };

  function getWorkflowScenario() {
    const wf = WORKFLOW_EXPERIENCE[currentPreset];
    if (!wf) return null;
    const key = currentScenario && (wf.scenarios[currentScenario] || WORKFLOW_EXTRA_SCENARIOS[currentScenario]) ? currentScenario : wf.defaultScenario;
    return { workflow: wf, key, scenario: wf.scenarios[key] || WORKFLOW_EXTRA_SCENARIOS[key] };
  }

  const WORKFLOW_SCENARIO_TOOL_IDS = {
    industry: ['t_creative_insights', 't_promote_winners', 't_event_match'],
    mediaStrategy: ['t_pacing_smooth', 't_bulk_settings', 't_copysettings'],
    audience: ['t_lal_expand', 't_exclude_buyers', 't_retarget_warm'],
    eventPlan: ['t_pacing_smooth', 't_bulk_settings', 't_creative_bulk_add'],
    budgetPlanner: ['t_pacing_smooth', 't_cap_losers', 't_bulk_settings'],
    creativeDirection: ['t_creative_insights', 't_creative_bulk_add', 't_promote_winners'],
    metaImport: ['t_airesize', 't_bulk_settings', 't_creative_bulk_add'],
    bulkBuild: ['t_bulk_settings', 't_copysettings', 't_findreplace'],
    creativeSupply: ['t_creative_bulk_add', 't_airesize', 't_copysettings'],
    preflightCheck: ['t_event_match', 't_view_rejection', 't_bulk_settings'],
    creativeTestPlan: ['t_creative_bulk_add', 't_copysettings', 't_findreplace'],
    hardBlocker: ['t_smart_fix', 't_view_rejection'],
    spendingSurge: ['t_cap_losers', 't_pacing_smooth', 't_pause_zerospend'],
    opportunityMining: ['t_promote_winners', 't_lal_expand', 't_pacing_smooth'],
    creativeFatigue: ['t_creative_insights', 't_creative_bulk_add', 't_pause_zerospend'],
    automationGuardrail: ['t_cap_losers', 't_pacing_smooth', 't_pause_zerospend'],
    sotReport: ['t_attr_window', 't_creative_insights', 't_promote_winners'],
    retargeting: ['t_retarget_warm', 't_lal_expand', 't_exclude_buyers'],
    creativeAttribution: ['t_creative_insights', 't_promote_winners', 't_creative_bulk_add'],
    nextPlan: ['t_promote_winners', 't_bulk_settings', 't_lal_expand'],
    audienceLearning: ['t_retarget_warm', 't_lal_expand', 't_exclude_buyers'],
  };

  function findWorkflowToolkitTool(id) {
    for (const group of ADAPT_TOOLKIT) {
      if (group.subgroups) {
        for (const subgroup of group.subgroups) {
          const match = subgroup.tools.find(tool => tool.id === id);
          if (match) return match;
        }
      } else if (group.tools) {
        const match = group.tools.find(tool => tool.id === id);
        if (match) return match;
      }
    }
    return null;
  }

  function getWorkflowToolkitTools(scenarioKey) {
    return (WORKFLOW_SCENARIO_TOOL_IDS[scenarioKey] || [])
      .map(findWorkflowToolkitTool)
      .filter(Boolean);
  }

  function renderWorkflowToolButton(tool) {
    const impact = tool.impact ? `<span class="workflow-tool-impact">${escapeHtmlWorkflow(tool.impact)}</span>` : '';
    return `<button type="button" class="workflow-tool" data-tool-id="${escapeHtmlWorkflow(tool.id)}" title="${escapeHtmlWorkflow(tool.desc || tool.name)}">
      <span class="workflow-tool-name">${escapeHtmlWorkflow(tool.name)}</span>${impact}
    </button>`;
  }

  // 搜索模式下，获取每个 campaign 匹配的 ad 列表（用于展开面板）
  function matchedAdsFor(campaign) {
    if (!searchQuery || searchMode !== 'creative') return [];
    const q = searchQuery.toLowerCase();
    return campaign.ads.filter(ad => ad.creative.name.toLowerCase().includes(q));
  }

  // 应用搜索 + 预设，得到最终要展示的 campaigns
  function getFilteredCampaigns() {
    let list = (filters[currentPreset] || filters.all)();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (searchMode === 'name') {
        list = list.filter(c => c.name.toLowerCase().includes(q));
      } else if (searchMode === 'creative') {
        // 保留至少有一条 ad 的 creative 名称命中的 campaign
        list = list.filter(c => c.ads.some(ad => ad.creative.name.toLowerCase().includes(q)));
      }
    }
    return list;
  }

  // 根据当前层级聚合要展示的行
  // 返回 { level, items }，每个 item 都带 __level 字段以便渲染
  function getItemsForLevel() {
    const campaigns = getFilteredCampaigns();
    if (currentLevel === 'campaign') {
      return campaigns;
    }
    if (currentLevel === 'adgroup') {
      const out = [];
      campaigns.forEach(c => c.adGroups.forEach(g => out.push({ ...g, __campaign: c })));
      if (searchQuery && searchMode === 'name') {
        // name 搜索传递到 ad group 层
        const q = searchQuery.toLowerCase();
        return out.filter(g => g.name.toLowerCase().includes(q) || g.__campaign.name.toLowerCase().includes(q));
      }
      return out;
    }
    // ad level
    const out = [];
    campaigns.forEach(c => c.adGroups.forEach(g => g.ads.forEach(ad => {
      out.push({ ...ad, __campaign: c, __adGroup: g });
    })));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (searchMode === 'creative') {
        return out.filter(ad => ad.creative.name.toLowerCase().includes(q));
      }
      return out.filter(ad => ad.name.toLowerCase().includes(q) || ad.__campaign.name.toLowerCase().includes(q));
    }
    return out;
  }

  // 高亮关键字
  function highlight(text, q) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return text.slice(0, idx) + `<mark class="hl">${text.slice(idx, idx + q.length)}</mark>` + text.slice(idx + q.length);
  }

  // ============== 表格渲染 ==============
  function renderRows(rows) {
    tbody.querySelectorAll('tr:not(.draft-row)').forEach(tr => tr.remove());
    if (rows.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="10" class="empty-row">No ${currentLevel === 'campaign' ? 'campaigns' : currentLevel === 'adgroup' ? 'ad groups' : 'ads'} match this filter.</td>`;
      tbody.appendChild(tr);
      return;
    }
    if (currentLevel === 'campaign') return renderCampaignRows(rows);
    if (currentLevel === 'adgroup') return renderAdGroupRows(rows);
    return renderAdRows(rows);
  }

  function renderCampaignRows(rows) {
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.dataset.campaignId = r.id;
      const dotClass = r.status === 'warn' ? 'warn'
        : (r.status === 'paused' ? 'paused'
          : (r.status === 'draft' ? 'draft' : 'active'));
      const mainTooltip = r.status === 'warn'
        ? 'Ad is not delivering. Click sub-status to see details.'
        : r.status === 'paused'
          ? 'Campaign is paused. Toggle switch to resume.'
          : r.status === 'draft'
            ? 'Draft from a failed Meta import — open to finish adaptive settings.'
            : 'Campaign is running normally.';
      const hintSvg = `<span class="status-hint" data-tooltip="${mainTooltip}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="0.8" fill="currentColor"/></svg>
        </span>`;
      const subHtml = r.sub
        ? `<span class="status-sub ${r.sub.cls || ''}" data-popover-key="${r.sub.popoverKey}">${r.sub.text}</span>`
        : '';
      const statusText = currentPreset === 'phase1Rejected' && r.subType === 'rejected'
        ? 'Rejected'
        : currentPreset === 'phase1Insufficient' && r.subType === 'lowspend'
          ? 'Insufficient spending'
          : r.label;

      const creativeTestName = currentPreset === 'phase1CreativeTesting' && r.isCreativeTest
        ? `Creative Test - ${r.creativeTest?.hypothesis || 'Variant'} - ${r.name.replace(/^Meta -\s*/i, '')}`
        : r.name;
      const displayName = (searchQuery && searchMode === 'name')
        ? highlight(creativeTestName, searchQuery)
        : creativeTestName;

      const metaBadge = r.fromMeta && currentPreset !== 'phase1CreativeTesting'
        ? `<span class="meta-badge" title="Imported from Meta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
            Meta
          </span>`
        : '';

      const draftBadge = r.isDraft
        ? `<span class="meta-badge" style="background:#fef3c7;color:#92400e;border-color:#fde68a;" title="Draft duplicate — review before publish">Draft</span>`
        : (r.isDuplicate ? `<span class="meta-badge" style="background:#eff6ff;color:#1e40af;border-color:#bfdbfe;" title="Duplicated copy">Copy</span>` : '');

      const newDot = r.isNew ? '<span class="new-dot" title="Newly imported"></span>' : '';
      const labelCell = currentPreset === 'phase1CreativeTesting' && r.isCreativeTest
        ? `<span class="row-label creative-label" title="Campaign is part of creative testing">Creative test</span>`
        : r.bulkImported
          ? `<span class="row-label bulk-label" title="Campaign was created by bulk import or campaign duplicate">Bulk imported</span>`
          : r.fromMeta
            ? `<span class="row-label meta-label" title="Campaign was imported from Meta Ads">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
                Meta imported
              </span>`
            : r.isCreativeTest
              ? `<span class="row-label creative-label" title="Campaign is part of creative testing">Creative testing</span>`
              : '';

      const rowChecked = selectedCampaigns.has(r.id) ? 'checked' : '';
      const groupCount = r.adGroups.length;
      const adCount = r.ads.length;

      tr.innerHTML = `
        <td class="col-check"><input type="checkbox" class="row-check" data-campaign-id="${r.id}" ${rowChecked} /></td>
        <td><span class="switch ${r.isOn ? '' : 'off'}"></span></td>
        <td>
          <div class="name-cell" title="${creativeTestName}">
            <svg class="name-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${r.icon}</svg>
            <div class="name-stack">
              <span class="name-text">${displayName}${newDot}${metaBadge}${draftBadge}</span>
              <span class="name-sub">${groupCount} ad group${groupCount > 1 ? 's' : ''} · ${adCount} ad${adCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </td>
        <td class="col-status">
          <div class="status-wrap">
            <div class="status ${dotClass}">
              <span class="dot-s"></span>
              <span>${statusText}</span>
              ${hintSvg}
            </div>
            ${subHtml}
          </div>
        </td>
        <td class="col-label">${labelCell}</td>
        <td class="num">${fmtUsd(r.cost)}</td>
        <td class="num">${fmtInt(r.impressions)}</td>
        <td class="num">${fmtUsd(r.cpm)}</td>
        <td class="num">${fmtInt(r.clicks)}</td>
        <td class="num">${r.ctr.toFixed(2)}%</td>
      `;
      tbody.appendChild(tr);

      // 搜索创意模式下，追加展开子行，列出匹配的 ads
      if (searchMode === 'creative' && searchQuery) {
        const matched = matchedAdsFor(r);
        if (matched.length) {
          const expandTr = document.createElement('tr');
          expandTr.className = 'ads-expanded';
          const adsHtml = matched.map(ad => {
            const adSelected = (selectedAds.get(r.id) || new Set()).has(ad.id);
            return `
              <div class="ad-item">
                <input type="checkbox" class="ad-check" data-campaign-id="${r.id}" data-ad-id="${ad.id}" ${adSelected ? 'checked' : ''} />
                ${renderCreativeThumb(ad.creative, 'sm')}
                <span class="ad-name">${ad.name}</span>
                <div class="ad-meta">
                  <span class="tag">${ad.creative.type}</span>
                  <span>Creative: ${highlight(ad.creative.name, searchQuery)}</span>
                  <span>CTA: ${ad.cta}</span>
                  <span>URL: ${ad.url}</span>
                </div>
              </div>`;
          }).join('');
          expandTr.innerHTML = `
            <td colspan="10">
              <div class="ads-panel">
                <div class="ads-panel-title">${matched.length} ad${matched.length > 1 ? 's' : ''} using creative matching "${searchQuery}"</div>
                <div class="ads-list">${adsHtml}</div>
              </div>
            </td>
          `;
          tbody.appendChild(expandTr);
        }
      }
    });
    tbody.querySelectorAll('.switch').forEach(sw => {
      sw.onclick = () => sw.classList.toggle('off');
    });
  }

  // ============ Ad group 层渲染 ============
  function renderAdGroupRows(rows) {
    rows.forEach(g => {
      const tr = document.createElement('tr');
      tr.dataset.adGroupId = g.id;
      const sub = SUB_MAP[g.subType];
      const dotClass = sub ? sub.status : 'active';
      const subHtml = sub
        ? `<span class="status-sub ${sub.cls || ''}" data-popover-key="${sub.popoverKey}">${sub.text}</span>`
        : '';
      const checked = selectedAdGroups.has(g.id) ? 'checked' : '';
      const displayName = (searchQuery && searchMode === 'name')
        ? highlight(g.name, searchQuery) : g.name;

      tr.innerHTML = `
        <td class="col-check"><input type="checkbox" class="ag-check" data-ag-id="${g.id}" ${checked} /></td>
        <td><span class="switch ${g.isOn ? '' : 'off'}"></span></td>
        <td>
          <div class="name-cell" title="${g.name}">
            <svg class="name-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h8"/></svg>
            <div class="name-stack">
              <span class="name-text">${displayName}</span>
              <span class="name-sub">
                <span class="chip">${g.objective}</span>
                <span class="chip chip-outline">${g.placement}</span>
                <span class="chip chip-outline">${g.audience}</span>
                <span class="name-sub-sep">Budget: $${fmtInt(g.budget)}/day · ${g.bidStrategy}</span>
              </span>
            </div>
          </div>
        </td>
        <td class="col-status">
          <div class="status-wrap">
            <div class="status ${dotClass}">
              <span class="dot-s"></span>
              <span>${sub ? sub.label : 'Active'}</span>
            </div>
            ${subHtml}
          </div>
        </td>
        <td class="col-label"></td>
        <td class="num">${fmtUsd(g.cost)}</td>
        <td class="num">${fmtInt(g.impressions)}</td>
        <td class="num">${fmtUsd(g.cpm)}</td>
        <td class="num">${fmtInt(g.clicks)}</td>
        <td class="num">${g.ctr.toFixed(2)}%</td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.switch').forEach(sw => {
      sw.onclick = () => sw.classList.toggle('off');
    });
  }

  // ============ Ad 层渲染 ============
  function renderAdRows(rows) {
    rows.forEach(ad => {
      const tr = document.createElement('tr');
      tr.dataset.adId = ad.id;
      const cid = ad.__campaign.id;
      const adSelected = (selectedAds.get(cid) || new Set()).has(ad.id) ? 'checked' : '';
      const dotClass = ad.status === 'paused' ? 'paused' : (ad.status === 'warn' ? 'warn' : 'active');
      const statusLabel = ad.status === 'paused' ? 'Inactive' : (ad.status === 'warn' ? 'Not Delivering' : 'Active');
      const isOn = ad.status !== 'paused';

      let displayName = ad.name;
      if (searchQuery) displayName = highlight(ad.name, searchQuery);
      const creativeName = (searchQuery && searchMode === 'creative')
        ? highlight(ad.creative.name, searchQuery)
        : ad.creative.name;

      tr.innerHTML = `
        <td class="col-check"><input type="checkbox" class="ad-row-check" data-campaign-id="${cid}" data-ad-id="${ad.id}" ${adSelected} /></td>
        <td><span class="switch ${isOn ? '' : 'off'}"></span></td>
        <td>
          <div class="name-cell ad-name-cell" title="${ad.name}">
            ${renderCreativeThumb(ad.creative, 'sm')}
            <div class="name-stack">
              <span class="name-text">${displayName}</span>
              <span class="name-sub">
                <span class="chip chip-outline">${ad.creative.type}</span>
                <span>Creative: ${creativeName}</span>
                <span class="name-sub-sep">CTA: ${ad.cta} · ${ad.__adGroup.region}</span>
              </span>
            </div>
          </div>
        </td>
        <td class="col-status">
          <div class="status-wrap">
            <div class="status ${dotClass}">
              <span class="dot-s"></span>
              <span>${statusLabel}</span>
            </div>
          </div>
        </td>
        <td class="col-label"></td>
        <td class="num">${fmtUsd(ad.cost)}</td>
        <td class="num">${fmtInt(ad.impressions)}</td>
        <td class="num">${fmtUsd(ad.cpm)}</td>
        <td class="num">${fmtInt(ad.clicks)}</td>
        <td class="num">${ad.ctr.toFixed(2)}%</td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.switch').forEach(sw => {
      sw.onclick = () => sw.classList.toggle('off');
    });
  }

  function renderFooter(rows) {
    const totalCost = rows.reduce((s, r) => s + r.cost, 0);
    const totalImp = rows.reduce((s, r) => s + r.impressions, 0);
    const avgCpm = totalImp > 0 ? (totalCost / totalImp) * 1000 : 0;
    const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
    const avgCtr = totalImp > 0 ? (totalClicks / totalImp) * 100 : 0;

    const footerCells = document.querySelector('.footer-cells');
    if (footerCells) {
      footerCells.innerHTML = `
        <div>${rows.length ? fmtUsd(totalCost) : '-'}</div>
        <div>${rows.length ? fmtInt(totalImp) : '-'}</div>
        <div>${rows.length ? fmtUsd(avgCpm) : '-'}</div>
        <div>${rows.length ? fmtInt(totalClicks) : '-'}</div>
        <div>${rows.length ? avgCtr.toFixed(2) + '%' : '-'}</div>
        <div>-</div>
      `;
    }
    const totalEl = document.querySelector('.footer-left');
    if (totalEl) {
      const label = currentLevel === 'campaign' ? 'campaigns' : currentLevel === 'adgroup' ? 'ad groups' : 'ads';
      totalEl.innerHTML = `Total of ${rows.length} ${label} <span class="q">?</span>`;
    }
  }

  // ============== 分页 ==============
  // 生成页码数组：1, 2, 3, 4, 5, ..., totalPages（Ant Design / TikTok 风格）
  function buildPageList(total, current) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
  }

  function renderPagination(totalItems) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const info = document.querySelector('[data-role="pg-info"]');
    if (info) {
      if (totalItems === 0) {
        info.textContent = '0 items';
      } else {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalItems);
        info.textContent = `${start}-${end} of ${totalItems} items`;
      }
    }

    const box = document.querySelector('[data-role="pg-buttons"]');
    if (!box) return;
    box.innerHTML = '';

    // Prev
    const prev = document.createElement('button');
    prev.className = 'pg-btn';
    prev.title = 'Prev';
    prev.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { if (currentPage > 1) { currentPage--; rerender(); } };
    box.appendChild(prev);

    // 页码
    buildPageList(totalPages, currentPage).forEach(p => {
      if (p === '...') {
        const dots = document.createElement('span');
        dots.className = 'pg-dots';
        dots.textContent = '···';
        box.appendChild(dots);
      } else {
        const btn = document.createElement('button');
        btn.className = 'pg-btn' + (p === currentPage ? ' active' : '');
        btn.textContent = p;
        btn.onclick = () => { currentPage = p; rerender(); };
        box.appendChild(btn);
      }
    });

    // Next
    const next = document.createElement('button');
    next.className = 'pg-btn';
    next.title = 'Next';
    next.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { if (currentPage < totalPages) { currentPage++; rerender(); } };
    box.appendChild(next);
  }

  // ============== 主渲染入口 ==============
  function rerender() {
    const items = getItemsForLevel();
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const pageRows = items.slice(start, start + pageSize);

    renderRows(pageRows);
    renderFooter(items);
    renderPagination(items.length);
    updateBulkBar();
  }

  function applyFilter(preset) {
    currentPreset = preset;
    currentPage = 1;
    updatePresetCards();
    rerender();
    updateAISummary();
    // 同步刷新 Toolkit Strip：不同 preset 显示不同的推荐工具
    if (typeof window.__renderToolkitStrip === 'function') {
      window.__renderToolkitStrip();
    }
  }

  // ============== 趋势图：汇总场景下所有同指标共享相同渲染 ==============
  // 给定一组数值与目标 SVG 元素，渲染统一样式的三层趋势图（面积 + 引线 + 主曲线）
  function renderSparkline(svgEl, points) {
    if (!svgEl || !points || !points.length) return;
    const w = 80, h = 20, pad = 2, leadGap = 4;
    const max = Math.max(...points, 1);
    const min = Math.min(...points);
    const innerW = w - pad - leadGap - 2;
    const step = points.length > 1 ? innerW / (points.length - 1) : 0;
    const pts = points.map((p, i) => {
      const x = leadGap + i * step;
      const range = (max - min) || 1;
      const y = h - pad - ((p - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const smooth = (arr) => {
      if (arr.length < 2) return '';
      let d = `M ${arr[0][0].toFixed(1)} ${arr[0][1].toFixed(1)}`;
      for (let i = 0; i < arr.length - 1; i++) {
        const p0 = arr[i - 1] || arr[i];
        const p1 = arr[i];
        const p2 = arr[i + 1];
        const p3 = arr[i + 2] || p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return d;
    };
    const startY = pts[0][1].toFixed(1);
    const lineD = smooth(pts);
    const firstX = pts[0][0].toFixed(1);
    const lastX = pts[pts.length - 1][0].toFixed(1);
    const areaD = `${lineD} L ${lastX} ${(h - pad).toFixed(1)} L ${firstX} ${(h - pad).toFixed(1)} Z`;
    svgEl.innerHTML = `
      <path d="${areaD}" fill="#c7d2fe" fill-opacity="0.55" stroke="none"/>
      <path d="M0 ${startY} L${leadGap} ${startY}" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="${lineD}" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `;
  }

  // ============== 预设卡片：计数 + 指标 ==============
  function updatePresetCards() {
    const counts = {
      // ---- 工作流新分法 ----
      planning: filters.planning().length,
      setup: filters.setup().length,
      midflight: filters.midflight().length,
      review: filters.review().length,
      prelaunch: filters.prelaunch().length,
      active: filters.active().length,
      // ---- 兼容原分法 ----
      all: DATA.length,
      rejected: filters.rejected().length,
      opportunities: filters.opportunities().length,
      blackfriday: filters.blackfriday().length,
      topview: filters.topview().length,
      metaimported: filters.metaimported().length,
      aigc: filters.aigc().length,
      creativetest: filters.creativetest().length,
    };

    // 更新 workflow 卡片 (data-preset)
    document.querySelectorAll('.preset-workflow[data-preset]').forEach(card => {
      const key = card.dataset.preset;
      const countEl = card.querySelector('[data-role="wfl-count"]');
      if (countEl) countEl.textContent = `(${counts[key] || 0})`;
    });

    document.querySelectorAll('.preset[data-preset]').forEach(card => {
      const key = card.dataset.preset;
      const countEl = card.querySelector('[data-role="count"]');
      const countInline = card.querySelector('[data-role="count-inline"]');
      if (countEl) countEl.textContent = `(${counts[key]})`;
      if (countInline) countInline.textContent = `(${counts[key]})`;

      if (key === 'blackfriday') {
        const bfRows = filters.blackfriday();
        const totalConv = bfRows.reduce((s, r) => s + r.conversions, 0);
        const convEl = card.querySelector('[data-role="conv"]');
        if (convEl) convEl.textContent = `Conversions: ${fmtInt(totalConv)}`;
        const trendSvg = card.querySelector('[data-role="trend"]');
        if (trendSvg && bfRows.length) {
          renderSparkline(trendSvg, bfRows.map(r => r.conversions));
        }
      }

      if (key === 'topview') {
        const tvRows = filters.topview();
        const avgPacing = tvRows.length
          ? (tvRows.reduce((s, r) => s + r.pacing, 0) / tvRows.length)
          : 0;
        const pacingEl = card.querySelector('[data-role="pacing"]');
        if (pacingEl) pacingEl.textContent = avgPacing.toFixed(2);
      }

      if (key === 'split') {
        const winnerEl = card.querySelector('[data-role="split-winner"]');
        if (winnerEl) winnerEl.textContent = SPLIT_WINNER;
      }

      if (key === 'metaimported') {
        if (counts.metaimported > 0) {
          card.hidden = false;
          card.classList.toggle('has-new', filters.metaimported().some(r => r.isNew));
        } else {
          card.hidden = true;
        }
        const recentEl = card.querySelector('[data-role="meta-recent"]');
        if (recentEl) {
          const newCount = filters.metaimported().filter(r => r.isNew).length;
          recentEl.textContent = newCount > 0
                ? `${newCount} new · just imported from Meta`
            : 'Imported from Meta Ads';
        }
      }

      if (key === 'aigc') {
        // 计算 AIGC 视频 vs 非 AIGC 视频在 VTR 上的相对提升
        const allAds = [];
        DATA.forEach(c => (c.ads || []).forEach(ad => {
          if (ad.videoMetrics) allAds.push(ad);
        }));
        const aigcAds = allAds.filter(a => a.isAigc);
        const nonAigc = allAds.filter(a => !a.isAigc);
        const avg = (list, key) => list.length ? list.reduce((s, a) => s + a.videoMetrics[key], 0) / list.length : 0;
        const aigcVtr = avg(aigcAds, 'vtr');
        const nonAigcVtr = avg(nonAigc, 'vtr');
        const uplift = nonAigcVtr > 0 ? ((aigcVtr - nonAigcVtr) / nonAigcVtr) * 100 : 0;
        const upEl = card.querySelector('[data-role="aigc-vtr-up"]');
        if (upEl) upEl.textContent = `${uplift >= 0 ? '+' : ''}${uplift.toFixed(0)}%`;
        // 趋势图：用 AIGC ad 的 views 作为序列
        const trendSvg = card.querySelector('[data-role="aigc-trend"]');
        if (trendSvg && aigcAds.length) {
          renderSparkline(trendSvg, aigcAds.slice(0, 12).map(a => a.videoMetrics.views));
        }
      }

      if (key === 'creativetest') {
        // 顶部 mini-bar：winner / testing / pending 三段比例
        const tests = filters.creativetest().map(r => r.creativeTest);
        const total = tests.length || 1;
        const winners = tests.filter(t => t.status === 'winner').length;
        const testing = tests.filter(t => t.status === 'testing').length;
        const pending = tests.filter(t => t.status === 'pending').length;
        const losers = tests.filter(t => t.status === 'loser').length;
        const winnerPct = (winners / total) * 100;
        const testingPct = (testing / total) * 100;
        const pendingPct = (pending / total) * 100;
        // bar 段
        const winSeg = card.querySelector('.ct-seg-winner');
        const tstSeg = card.querySelector('.ct-seg-testing');
        const pndSeg = card.querySelector('.ct-seg-pending');
        if (winSeg) winSeg.style.width = `${winnerPct}%`;
        if (tstSeg) tstSeg.style.width = `${testingPct}%`;
        if (pndSeg) pndSeg.style.width = `${pendingPct}%`;
        // 文案
        const txt = card.querySelector('[data-role="ct-progress-text"]');
        if (txt) {
          txt.textContent = `${testing} in test · ${winners} winner${winners !== 1 ? 's' : ''}${losers ? ` · ${losers} loser${losers > 1 ? 's' : ''}` : ''}`;
        }
      }
    });
  }

  // ============== 交互绑定 ==============
  // 表头全选：根据当前层级勾选当前页所有条目
  document.getElementById('checkAll').addEventListener('change', (e) => {
    const checked = e.target.checked;
    if (currentLevel === 'campaign') {
      document.querySelectorAll('.row-check[data-campaign-id]').forEach(cb => {
        const id = cb.dataset.campaignId;
        cb.checked = checked;
        if (checked) selectedCampaigns.add(id); else selectedCampaigns.delete(id);
      });
    } else if (currentLevel === 'adgroup') {
      document.querySelectorAll('.ag-check').forEach(cb => {
        const id = cb.dataset.agId;
        cb.checked = checked;
        if (checked) selectedAdGroups.add(id); else selectedAdGroups.delete(id);
      });
    } else {
      document.querySelectorAll('.ad-row-check').forEach(cb => {
        const cid = cb.dataset.campaignId;
        const aid = cb.dataset.adId;
        cb.checked = checked;
        if (!selectedAds.has(cid)) selectedAds.set(cid, new Set());
        const set = selectedAds.get(cid);
        if (checked) set.add(aid); else set.delete(aid);
        if (set.size === 0) selectedAds.delete(cid);
      });
    }
    updateBulkBar();
  });

  // 事件委托：勾选单行 campaign / ad group / ad
  tbody.addEventListener('change', (e) => {
    const rc = e.target.closest('.row-check[data-campaign-id]');
    if (rc) {
      const id = rc.dataset.campaignId;
      if (rc.checked) selectedCampaigns.add(id);
      else selectedCampaigns.delete(id);
      updateBulkBar();
      return;
    }
    const agc = e.target.closest('.ag-check');
    if (agc) {
      const id = agc.dataset.agId;
      if (agc.checked) selectedAdGroups.add(id);
      else selectedAdGroups.delete(id);
      updateBulkBar();
      return;
    }
    const arc = e.target.closest('.ad-row-check');
    if (arc) {
      const cid = arc.dataset.campaignId;
      const aid = arc.dataset.adId;
      if (!selectedAds.has(cid)) selectedAds.set(cid, new Set());
      const set = selectedAds.get(cid);
      if (arc.checked) set.add(aid); else set.delete(aid);
      if (set.size === 0) selectedAds.delete(cid);
      updateBulkBar();
      return;
    }
    const ac = e.target.closest('.ad-check');
    if (ac) {
      const cid = ac.dataset.campaignId;
      const aid = ac.dataset.adId;
      if (!selectedAds.has(cid)) selectedAds.set(cid, new Set());
      const set = selectedAds.get(cid);
      if (ac.checked) set.add(aid);
      else set.delete(aid);
      if (set.size === 0) selectedAds.delete(cid);
      updateBulkBar();
    }
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const level = tab.dataset.level;
      if (level !== currentLevel) {
        currentLevel = level;
        currentPage = 1;
        selectedAds.clear();
        selectedCampaigns.clear();
        selectedAdGroups.clear();
        const checkAll = document.getElementById('checkAll');
        if (checkAll) checkAll.checked = false;
        rerender();
      }
    });
  });

  document.querySelectorAll('.preset').forEach(p => {
    if (p.classList.contains('more') || p.classList.contains('add')) return;
    p.addEventListener('click', (e) => {
      const scenarioEl = e.target.closest('[data-scenario]');
      const strategyMapEl = e.target.closest('[data-role="workflow-strategy-map"]');
      const nextPreset = p.dataset.preset || 'all';
      const workflow = PHASE_ONE_WORKFLOWS[nextPreset] || WORKFLOW_EXPERIENCE[nextPreset];
      if (workflow) {
        currentWorkflowView = strategyMapEl ? 'strategyMap' : 'detail';
        if (!strategyMapEl) currentScenario = scenarioEl?.dataset.scenario || workflow.defaultScenario;
        if (nextPreset === 'phase1Midflight' && currentScenario === 'dailyReport') currentPhaseOneReport = 'phase1MetaImported';
        setWorkflowPanelCollapsed(false);
      }
      document.querySelectorAll('.preset').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      document.querySelectorAll('.wfl-scenario').forEach(x => x.classList.remove('is-selected'));
      const selected = p.querySelector(`[data-scenario="${currentScenario}"]`);
      if (selected) selected.classList.add('is-selected');
      applyFilter(nextPreset);
    });
  });

  document.addEventListener('click', (e) => {
    const strategyCard = e.target.closest('[data-strategy-key]');
    if (!strategyCard) return;
    currentWorkflowView = 'detail';
    currentScenario = strategyCard.dataset.strategyKey;
    setWorkflowPanelCollapsed(false);
    document.querySelectorAll('.wfl-scenario').forEach(x => x.classList.remove('is-selected'));
    const activePreset = document.querySelector(`.preset-workflow.active [data-scenario="${currentScenario}"]`);
    if (activePreset) activePreset.classList.add('is-selected');
    updateAISummary();
    window.__renderToolkitStrip?.();
  });

  document.addEventListener('click', (e) => {
    const nestedAction = e.target.closest('[data-phase-action]');
    if (!nestedAction) return;
    e.stopPropagation();
    const action = nestedAction.dataset.phaseAction;
    if (['metaAssetImport', 'metaCampaignImport'].includes(action)) {
      DATA.filter(r => r.fromMeta).slice(0, 8).forEach(r => { r.fromMeta = true; r.phaseOneTouched = true; });
      currentPhaseOneReport = 'phase1MetaImported';
      nestedAction.classList.add('is-clicked');
      rerender();
      updateAISummary();
      setTimeout(() => nestedAction.classList.remove('is-clicked'), 220);
      return;
    }
    if (['bulkImport', 'campaignDuplicate'].includes(action)) {
      DATA.filter(r => !r.fromMeta && r.subType !== 'paused' && r.subType !== 'draft').slice(0, 8).forEach(r => {
        r.bulkImported = true;
        r.phaseOneTouched = true;
      });
      currentPhaseOneReport = 'phase1BulkImported';
      nestedAction.classList.add('is-clicked');
      rerender();
      updateAISummary();
      setTimeout(() => nestedAction.classList.remove('is-clicked'), 220);
      return;
    }
    nestedAction.classList.add('is-clicked');
    setTimeout(() => nestedAction.classList.remove('is-clicked'), 220);
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-phase-action]')) return;
    const issue = e.target.closest('[data-phase-issue]');
    if (!issue) return;
    currentScenario = 'anomalyMonitor';
    currentPhaseOneReport = 'phase1MetaImported';
    document.querySelectorAll('.preset').forEach(x => x.classList.remove('active'));
    const midflightCard = document.querySelector('.preset-workflow[data-preset="phase1Midflight"]');
    if (midflightCard) midflightCard.classList.add('active');
    document.querySelectorAll('.wfl-scenario').forEach(x => x.classList.remove('is-selected'));
    const selected = midflightCard?.querySelector('[data-scenario="anomalyMonitor"]');
    if (selected) selected.classList.add('is-selected');
    applyFilter(issue.dataset.phaseIssue);
  });

  document.addEventListener('click', (e) => {
    const report = e.target.closest('[data-phase-report]');
    if (!report) return;
    currentScenario = 'dailyReport';
    currentPhaseOneReport = report.dataset.phaseReport;
    document.querySelectorAll('.preset').forEach(x => x.classList.remove('active'));
    const midflightCard = document.querySelector('.preset-workflow[data-preset="phase1Midflight"]');
    if (midflightCard) midflightCard.classList.add('active');
    document.querySelectorAll('.wfl-scenario').forEach(x => x.classList.remove('is-selected'));
    const selected = midflightCard?.querySelector('[data-scenario="dailyReport"]');
    if (selected) selected.classList.add('is-selected');
    applyFilter(currentPhaseOneReport);
  });

  const draftRow = document.querySelector('.draft-row');
  if (draftRow) {
    draftRow.addEventListener('click', () => draftRow.classList.toggle('open'));
  }

  const refresh = document.querySelector('.refresh');
  if (refresh) {
    refresh.addEventListener('click', () => {
      refresh.style.transition = 'transform .6s';
      refresh.style.transform = 'rotate(360deg)';
      setTimeout(() => { refresh.style.transition = 'none'; refresh.style.transform = 'rotate(0)'; }, 620);

      DATA = [
        ...(SIMULATE_JUST_IMPORTED ? buildJustImportedMetaSeeds() : []),
        ...buildMetaImportedSeeds(),
        ...SEED.map(buildRow),
      ];
      updatePresetCards();
      rerender();
    });
  }

  document.querySelector('.btn-create').addEventListener('click', () => {
    alert('Create new campaign');
  });

  // ============== Create dropdown menu (Import CSV / Import from Meta) ==============
  const createGroup = document.querySelector('[data-role="create-group"]');
  const createCaret = document.querySelector('[data-role="create-caret"]');
  const createMenu = document.querySelector('[data-role="create-menu"]');
  if (createCaret && createMenu) {
    createCaret.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !createMenu.hasAttribute('hidden');
      if (isOpen) {
        createMenu.setAttribute('hidden', '');
        createGroup.classList.remove('open');
        createCaret.setAttribute('aria-expanded', 'false');
      } else {
        createMenu.removeAttribute('hidden');
        createGroup.classList.add('open');
        createCaret.setAttribute('aria-expanded', 'true');
      }
    });
    document.addEventListener('click', (e) => {
      if (!createGroup.contains(e.target)) {
        createMenu.setAttribute('hidden', '');
        createGroup.classList.remove('open');
        createCaret.setAttribute('aria-expanded', 'false');
      }
    });
    createMenu.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-action]');
      if (!li) return;
      createMenu.setAttribute('hidden', '');
      createGroup.classList.remove('open');
      createCaret.setAttribute('aria-expanded', 'false');
      const action = li.dataset.action;
      if (action === 'import-csv') {
        alert('Import CSV: please choose a CSV file (demo).');
      } else if (action === 'import-meta') {
        openMetaImportDrawer();
      }
    });
  }

  // ============== Status & Action 列的 Popover 交互 ==============
  function closeAllPopovers() {
    document.querySelectorAll('.status-popover').forEach(p => p.remove());
  }

  function openPopover(trigger, key) {
    closeAllPopovers();
    const content = POPOVER_CONTENT[key];
    if (!content) return;
    const pop = document.createElement('div');
    pop.className = 'status-popover';
    const listHtml = content.list && content.list.length
      ? `<ul>${content.list.map(i => `<li>${i}</li>`).join('')}</ul>`
      : '';
    pop.innerHTML = `
      <button class="popover-close" aria-label="Close">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="popover-title ${content.cls || ''}">
        ${content.cls === 'danger' ? '⛔' : content.cls === 'warn' ? '⚠️' : 'ℹ️'}
        ${content.title}
      </div>
      <div class="popover-body">${content.body}${listHtml}</div>
      <div class="popover-actions">
        <button class="popover-btn primary">${content.primaryAction}</button>
        <button class="popover-btn">${content.secondaryAction}</button>
      </div>
    `;
    trigger.parentElement.appendChild(pop);

    pop.querySelector('.popover-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPopovers();
    });
    pop.addEventListener('click', (e) => e.stopPropagation());
  }

  // 事件委托：点击子状态文本（如 "Creative fatigue (2)"）打开对应 popover
  tbody.addEventListener('click', (e) => {
    const trigger = e.target.closest('.status-sub[data-popover-key]');
    if (trigger) {
      e.stopPropagation();
      const key = trigger.dataset.popoverKey;
      // 如果当前行已经打开同一个 popover，再次点击则关闭
      const existing = trigger.parentElement.querySelector('.status-popover');
      if (existing) {
        closeAllPopovers();
      } else {
        openPopover(trigger, key);
      }
    }
  });

  // 点击页面其他地方关闭 popover
  document.addEventListener('click', closeAllPopovers);

  // 滚动区域也要关闭（避免 popover 脱离行）
  const scrollArea = document.querySelector('[data-role="table-body-wrap"]');
  if (scrollArea) {
    scrollArea.addEventListener('scroll', closeAllPopovers);
  }

  // 页大小下拉
  const pageSizeBox = document.querySelector('[data-role="page-size"]');
  const pageSizeLabel = document.querySelector('[data-role="page-size-label"]');
  const pageSizeMenu = document.querySelector('[data-role="page-size-menu"]');
  if (pageSizeBox && pageSizeMenu) {
    pageSizeBox.addEventListener('click', (e) => {
      // 阻止冒泡到 document 的关闭监听
      e.stopPropagation();
      pageSizeBox.classList.toggle('open');
    });
    pageSizeMenu.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        const v = parseInt(li.dataset.value, 10);
        if (!v || v === pageSize) {
          pageSizeBox.classList.remove('open');
          return;
        }
        pageSize = v;
        currentPage = 1;
        pageSizeMenu.querySelectorAll('li').forEach(x => x.classList.remove('selected'));
        li.classList.add('selected');
        if (pageSizeLabel) pageSizeLabel.textContent = `${v}/page`;
        pageSizeBox.classList.remove('open');
        rerender();
      });
    });
    document.addEventListener('click', () => {
      pageSizeBox.classList.remove('open');
    });
  }

  // ============== 搜索框交互 ==============
  const searchModeBox = document.querySelector('[data-role="search-mode"]');
  const searchModeLabel = document.querySelector('[data-role="search-mode-label"]');
  const searchModeMenu = document.querySelector('[data-role="search-mode-menu"]');
  const searchInput = document.querySelector('[data-role="search-input"]');
  const searchClear = document.querySelector('[data-role="search-clear"]');

  function updateSearchPlaceholder() {
    if (!searchInput) return;
    searchInput.placeholder = searchMode === 'creative'
      ? 'Search by creative name (e.g. BF_Flash, TopView_Teaser)'
      : 'Search & filter (/) | Tips: Metric filters are available in table header';
  }

  if (searchModeBox) {
    searchModeBox.addEventListener('click', (e) => {
      e.stopPropagation();
      searchModeBox.classList.toggle('open');
    });
    searchModeMenu.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        const v = li.dataset.value;
        searchMode = v;
        searchModeMenu.querySelectorAll('li').forEach(x => x.classList.remove('selected'));
        li.classList.add('selected');
        searchModeLabel.textContent = v === 'creative' ? 'Creative' : 'Name';
        searchModeBox.classList.remove('open');
        // 清空之前的选中，避免跨模式混乱
        selectedAds.clear();
        updateSearchPlaceholder();
        currentPage = 1;
        rerender();
      });
    });
    document.addEventListener('click', () => searchModeBox.classList.remove('open'));
  }

  if (searchInput) {
    let t;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(t);
      const v = e.target.value.trim();
      searchClear.style.display = v ? 'inline-flex' : 'none';
      t = setTimeout(() => {
        searchQuery = v;
        currentPage = 1;
        rerender();
      }, 150);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      rerender();
    });
  }

  // ============== BulkBar ==============
  const bulkBar = document.querySelector('[data-role="bulk-bar"]');
  const bulkCountEl = document.querySelector('[data-role="bulk-count"]');
  const bulkPasteBtn = document.querySelector('[data-role="bulk-paste"]');
  const bulkPasteCount = document.querySelector('[data-role="bulk-paste-count"]');

  function totalSelectedAdsCount() {
    let n = 0;
    selectedAds.forEach(s => { n += s.size; });
    return n;
  }

  function getSelectionDescription() {
    const adCount = totalSelectedAdsCount();
    const cpCount = selectedCampaigns.size;
    const agCount = selectedAdGroups.size;
    const parts = [];
    if (cpCount) parts.push(`${cpCount} campaign${cpCount > 1 ? 's' : ''}`);
    if (agCount) parts.push(`${agCount} ad group${agCount > 1 ? 's' : ''}`);
    if (adCount) parts.push(`${adCount} ad${adCount > 1 ? 's' : ''}`);
    return parts.join(' & ') || '0';
  }

  function updateBulkBar() {
    const total = selectedCampaigns.size + selectedAdGroups.size + totalSelectedAdsCount();
    // Turn on / Turn off 始终常驻在 Action bar 中；未勾选任何行时置灰禁用，避免按钮出现/消失造成闪动
    const onBtn = document.querySelector('[data-role="bulk-on"]');
    const offBtn = document.querySelector('[data-role="bulk-off"]');
    const hasSelection = total >= 1;
    if (onBtn) {
      onBtn.hidden = false;
      onBtn.disabled = !hasSelection;
      onBtn.classList.toggle('is-disabled', !hasSelection);
      onBtn.setAttribute('aria-disabled', String(!hasSelection));
      onBtn.title = hasSelection ? 'Turn selected items on' : 'Select at least one row to enable';
    }
    if (offBtn) {
      offBtn.hidden = false;
      offBtn.disabled = !hasSelection;
      offBtn.classList.toggle('is-disabled', !hasSelection);
      offBtn.setAttribute('aria-disabled', String(!hasSelection));
      offBtn.title = hasSelection ? 'Turn selected items off' : 'Select at least one row to enable';
    }
    if (!bulkBar) return;
    // 兼容：原 .bulk-bar 节点已被占位元素替换为 <span data-role="bulk-bar">，无需再切换 hidden
    if (bulkCountEl) bulkCountEl.textContent = getSelectionDescription();
    // Paste settings 已移出 Action bar；保留兼容引用
    if (bulkPasteBtn) bulkPasteBtn.style.display = 'none';
  }

  document.querySelector('[data-role="bulk-clear"]').addEventListener('click', () => {
    selectedCampaigns.clear();
    selectedAds.clear();
    selectedAdGroups.clear();
    document.querySelectorAll('.row-check, .ad-check, .ag-check, .ad-row-check').forEach(cb => cb.checked = false);
    const ca = document.getElementById('checkAll');
    if (ca) ca.checked = false;
    updateBulkBar();
  });

  // ============== Bulk Quick edits：Turn on / Turn off / Bulk edit 下拉 ==============
  function bulkToggleStatus(targetOn) {
    const desc = getSelectionDescription();
    if (desc === '0') return;
    let touched = 0;
    const touchedCmpIds = new Set();
    const touchedAdGroupIds = new Set();
    const touchedAdIds = new Set();
    // 真实写入模型（campaign / adGroup / ad 的 isOn）+ 同步状态文案
    DATA.forEach(c => {
      if (selectedCampaigns.has(c.id)) {
        c.isOn = targetOn;
        c.status = targetOn ? 'active' : 'paused';
        c.label = targetOn ? 'Active' : 'Inactive';
        touched++;
        touchedCmpIds.add(c.id);
      }
      c.adGroups.forEach(g => {
        if (selectedAdGroups.has(g.id)) {
          g.isOn = targetOn;
          touched++;
          touchedAdGroupIds.add(g.id);
        }
      });
      const set = selectedAds.get(c.id);
      if (set && set.size) {
        c.ads.forEach(ad => {
          if (set.has(ad.id)) {
            ad.status = targetOn ? 'active' : 'paused';
            touched++;
            touchedAdIds.add(ad.id);
          }
        });
      }
    });
    rerender();
    flashRows({ campaignIds: touchedCmpIds, adGroupIds: touchedAdGroupIds, adIds: touchedAdIds });
    const verb = targetOn ? 'Turned on' : 'Turned off';
    showToast(`${verb} ${desc}${touched ? '' : ' (no rows updated)'}.`);
  }

  // 给"刚改动 / 刚创建"的行添加短暂高亮闪烁，提示用户哪些行被影响
  function flashRows({ campaignIds = new Set(), adGroupIds = new Set(), adIds = new Set() } = {}) {
    requestAnimationFrame(() => {
      campaignIds.forEach(id => {
        const tr = tbody.querySelector(`tr[data-campaign-id="${id}"]`);
        if (tr) {
          tr.classList.add('row-just-updated');
          setTimeout(() => tr.classList.remove('row-just-updated'), 1500);
        }
      });
      adGroupIds.forEach(id => {
        const tr = tbody.querySelector(`tr[data-ad-group-id="${id}"]`);
        if (tr) {
          tr.classList.add('row-just-updated');
          setTimeout(() => tr.classList.remove('row-just-updated'), 1500);
        }
      });
      adIds.forEach(id => {
        const tr = tbody.querySelector(`tr[data-ad-id="${id}"]`);
        if (tr) {
          tr.classList.add('row-just-updated');
          setTimeout(() => tr.classList.remove('row-just-updated'), 1500);
        }
      });
    });
  }

  function showToast(msg) {
    let toast = document.querySelector('.bulk-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'bulk-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  document.querySelector('[data-role="bulk-on"]')?.addEventListener('click', () => bulkToggleStatus(true));
  document.querySelector('[data-role="bulk-off"]')?.addEventListener('click', () => bulkToggleStatus(false));

  // 批量编辑下拉
  const bulkEditWrap = document.querySelector('[data-role="bulk-edit-dropdown"]');
  const bulkEditTrigger = document.querySelector('[data-role="bulk-edit-trigger"]');
  const bulkEditMenu = document.querySelector('[data-role="bulk-edit-menu"]');
  // 重要：.bulk-bar 设了 will-change，会创建新的包含块，导致内部 position:fixed 元素
  // 以 .bulk-bar 为基准（且被 overflow 裁切）。把菜单脱离容器挂到 body 下规避。
  if (bulkEditMenu && bulkEditMenu.parentElement !== document.body) {
    document.body.appendChild(bulkEditMenu);
  }

  function closeBulkEditMenu() {
    if (!bulkEditMenu) return;
    bulkEditMenu.hidden = true;
    bulkEditWrap.classList.remove('open');
    bulkEditTrigger.setAttribute('aria-expanded', 'false');
  }
  function positionBulkEditMenu() {
    if (!bulkEditTrigger || !bulkEditMenu) return;
    const rect = bulkEditTrigger.getBoundingClientRect();
    bulkEditMenu.style.top = `${rect.bottom + 6}px`;
    bulkEditMenu.style.left = `${rect.left}px`;
  }
  function openBulkEditMenu() {
    if (!bulkEditMenu) return;
    bulkEditMenu.hidden = false;
    bulkEditWrap.classList.add('open');
    bulkEditTrigger.setAttribute('aria-expanded', 'true');
    positionBulkEditMenu();
  }
  bulkEditTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bulkEditMenu.hidden) openBulkEditMenu(); else closeBulkEditMenu();
  });
  document.addEventListener('click', (e) => {
    if (!bulkEditWrap || bulkEditMenu.hidden) return;
    if (bulkEditMenu.contains(e.target)) return;
    if (!bulkEditWrap.contains(e.target)) closeBulkEditMenu();
  });
  // 滚动 / 缩放时重新定位（菜单是 fixed，需要跟随 trigger 移动或关闭）
  window.addEventListener('scroll', () => {
    if (!bulkEditMenu || bulkEditMenu.hidden) return;
    closeBulkEditMenu();
  }, true);
  window.addEventListener('resize', () => {
    if (!bulkEditMenu || bulkEditMenu.hidden) return;
    positionBulkEditMenu();
  });

  bulkEditMenu?.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-action]');
    if (!li) return;
    const action = li.dataset.action;
    closeBulkEditMenu();
    const desc = getSelectionDescription();
    if (desc === '0') {
      alert('Please select at least one campaign / ad group / ad first.');
      return;
    }
    openBulkEditModal(action, desc);
  });

  function openBulkEditModal(action, desc) {
    const cfg = {
      'edit-budget': {
        title: 'Edit budget',
        sub: `Apply a new budget to ${desc}`,
        body: `
          <label class="be-row"><span class="be-label">Mode</span>
            <select class="be-input" data-role="be-mode">
              <option value="set">Set to fixed amount</option>
              <option value="inc">Increase by %</option>
              <option value="dec">Decrease by %</option>
            </select>
          </label>
          <label class="be-row"><span class="be-label">Value</span>
            <input class="be-input" data-role="be-value" type="text" placeholder="e.g. 50 or 10 (for %)" />
          </label>`,
      },
      'edit-bid': {
        title: 'Edit bid',
        sub: `Apply a new bid to ${desc}`,
        body: `
          <label class="be-row"><span class="be-label">Bid strategy</span>
            <select class="be-input" data-role="be-strategy">
              <option value="Cost cap">Cost cap</option>
              <option value="Bid cap">Bid cap</option>
              <option value="Lowest cost">Lowest cost</option>
            </select>
          </label>
          <label class="be-row"><span class="be-label">Bid amount</span>
            <input class="be-input" data-role="be-value" type="text" placeholder="e.g. 1.20" />
          </label>`,
      },
      'edit-name': {
        title: 'Edit name',
        sub: `Rename ${desc}`,
        body: `
          <label class="be-row"><span class="be-label">Find</span>
            <input class="be-input" data-role="be-find" type="text" placeholder="Text to replace (optional)" />
          </label>
          <label class="be-row"><span class="be-label">Replace with</span>
            <input class="be-input" data-role="be-replace" type="text" placeholder="New text" />
          </label>
          <label class="be-row"><span class="be-label">Or set name to</span>
            <input class="be-input" data-role="be-setname" type="text" placeholder="Full new name (overrides find/replace)" />
          </label>`,
      },
      'edit-po': {
        title: 'Edit PO number',
        sub: `Update PO number for ${desc}`,
        body: `
          <label class="be-row"><span class="be-label">PO number</span>
            <input class="be-input" data-role="be-po" type="text" placeholder="e.g. PO-2025-00184" />
          </label>
          <label class="be-row"><span class="be-label">Note</span>
            <input class="be-input" data-role="be-note" type="text" placeholder="Optional note for finance team" />
          </label>`,
      },
    }[action];
    if (!cfg) return;

    const wrap = document.createElement('div');
    wrap.className = 'bulk-edit-form';
    wrap.innerHTML = cfg.body;

    const { close } = openModal({
      title: cfg.title,
      sub: cfg.sub,
      body: wrap,
      footer: `
        <button class="popover-btn" data-role="be-cancel">Cancel</button>
        <button class="popover-btn primary" data-role="be-apply">Apply</button>
      `,
    });
    const root = wrap.closest('.modal');
    root.querySelector('[data-role="be-cancel"]').addEventListener('click', close);
    root.querySelector('[data-role="be-apply"]').addEventListener('click', () => {
      const result = applyBulkEdit(action, wrap);
      close();
      rerender();
      flashRows({ campaignIds: result.cmpIds, adGroupIds: result.agIds, adIds: result.adIds });
      showToast(`${cfg.title} applied to ${desc} — ${result.touched} object${result.touched === 1 ? '' : 's'} updated.`);
    });
  }

  // 真实落库：把 bulk-edit modal 里的输入应用到所选对象上
  function applyBulkEdit(action, wrap) {
    let touched = 0;
    const cmpIds = new Set();
    const agIds = new Set();
    const adIds = new Set();
    const eachSelected = (cb) => {
      DATA.forEach(c => {
        if (selectedCampaigns.has(c.id)) { cb('campaign', c); touched++; cmpIds.add(c.id); }
        c.adGroups.forEach(g => {
          if (selectedAdGroups.has(g.id)) { cb('adgroup', g); touched++; agIds.add(g.id); }
        });
        const set = selectedAds.get(c.id);
        if (set && set.size) {
          c.ads.forEach(ad => { if (set.has(ad.id)) { cb('ad', ad); touched++; adIds.add(ad.id); } });
        }
      });
    };

    if (action === 'edit-budget') {
      const mode = wrap.querySelector('[data-role="be-mode"]').value;
      const raw = wrap.querySelector('[data-role="be-value"]').value.replace(/[^\d.]/g, '');
      const v = parseFloat(raw);
      if (isFinite(v) && v >= 0) {
        eachSelected((lvl, obj) => {
          // 只有 ad group 有 budget；campaign 用 cost 近似展示，写入到 budget 字段
          const cur = obj.budget || obj.cost || 0;
          let next = cur;
          if (mode === 'set') next = v;
          else if (mode === 'inc') next = cur * (1 + v / 100);
          else if (mode === 'dec') next = cur * (1 - v / 100);
          obj.budget = Math.max(0, Math.round(next));
        });
      }
    } else if (action === 'edit-bid') {
      const strategy = wrap.querySelector('[data-role="be-strategy"]').value;
      const v = parseFloat(wrap.querySelector('[data-role="be-value"]').value.replace(/[^\d.]/g, ''));
      eachSelected((lvl, obj) => {
        obj.bidStrategy = strategy;
        if (isFinite(v)) obj.bidAmount = v;
      });
    } else if (action === 'edit-name') {
      const find = wrap.querySelector('[data-role="be-find"]').value;
      const replace = wrap.querySelector('[data-role="be-replace"]').value;
      const setname = wrap.querySelector('[data-role="be-setname"]').value.trim();
      eachSelected((lvl, obj) => {
        if (setname) obj.name = setname;
        else if (find) obj.name = obj.name.split(find).join(replace);
      });
    } else if (action === 'edit-po') {
      const po = wrap.querySelector('[data-role="be-po"]').value.trim();
      const note = wrap.querySelector('[data-role="be-note"]').value.trim();
      eachSelected((lvl, obj) => {
        if (po) obj.poNumber = po;
        if (note) obj.poNote = note;
      });
    }
    return { touched, cmpIds, agIds, adIds };
  }

  // ============== Modal 工具 ==============
  function openModal({ title, sub, body, footer, wide }) {
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `
      <div class="modal ${wide ? 'wide' : ''}" role="dialog">
        <div class="modal-head">
          <div>
            <div class="modal-title">${title}</div>
            ${sub ? `<div class="modal-sub">${sub}</div>` : ''}
          </div>
          <button class="modal-close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-foot"></div>
      </div>
    `;
    const bodyEl = mask.querySelector('.modal-body');
    const footEl = mask.querySelector('.modal-foot');
    if (typeof body === 'string') bodyEl.innerHTML = body;
    else if (body instanceof Node) bodyEl.appendChild(body);
    if (footer) footEl.innerHTML = footer;

    mask.querySelector('.modal-close').addEventListener('click', () => mask.remove());
    mask.addEventListener('click', (e) => { if (e.target === mask) mask.remove(); });

    modalRoot.appendChild(mask);
    return { mask, bodyEl, footEl, close: () => mask.remove() };
  }

  // ============== AI Resize（创意单选交互式重塑）==============
  // 单工具入口：用户在 Toolkit 中点击 AI resize → 弹出此 modal，选择 1 个 creative，配置目标尺寸/主体，单独执行
  function openAIResizeModal() {
    // 候选池：取 CREATIVE_POOL 前 18 个，演示用
    const pool = CREATIVE_POOL.slice(0, 18);
    let pickedId = null;
    let ratio = '9:16';
    let subject = 'auto';

    const body = document.createElement('div');
    body.innerHTML = `
      <div class="alert info">
        AI resize works on <strong>one creative at a time</strong>. Pick a source creative, choose the target ratio and subject, then export.
      </div>
      <div class="ai-resize-grid">
        <div class="ai-resize-pool">
          <div class="ai-resize-section-title">1 · Pick a creative</div>
          <div class="ai-resize-pool-grid" data-role="ai-pool"></div>
        </div>
        <div class="ai-resize-config">
          <div class="ai-resize-section-title">2 · Target ratio</div>
          <div class="ai-resize-chips" data-role="ratio-chips">
            ${['9:16','1:1','16:9','4:5'].map(r => `<button class="ai-chip ${r==='9:16'?'is-active':''}" data-ratio="${r}">${r}</button>`).join('')}
          </div>
          <div class="ai-resize-section-title">3 · Subject focus</div>
          <div class="ai-resize-chips" data-role="subject-chips">
            ${[
              {id:'auto', label:'Auto detect'},
              {id:'face', label:'Face'},
              {id:'product', label:'Product'},
              {id:'text', label:'Text overlay'},
            ].map(s => `<button class="ai-chip ${s.id==='auto'?'is-active':''}" data-subject="${s.id}">${s.label}</button>`).join('')}
          </div>
          <div class="ai-resize-section-title">Preview</div>
          <div class="ai-resize-preview" data-role="ai-preview">
            <div class="ai-resize-preview-empty">Pick a creative to see the AI-resized preview.</div>
          </div>
        </div>
      </div>
    `;

    const poolEl = body.querySelector('[data-role="ai-pool"]');
    const previewEl = body.querySelector('[data-role="ai-preview"]');
    const renderPool = () => {
      poolEl.innerHTML = pool.map(c => `
        <button class="ai-pool-item ${pickedId===c.id?'is-picked':''}" data-id="${c.id}" title="${c.name}">
          <span class="ai-pool-thumb" style="background:linear-gradient(135deg, ${c.color}, ${c.color2})">${c.initials}</span>
          <span class="ai-pool-name">${c.name}</span>
        </button>
      `).join('');
      poolEl.querySelectorAll('.ai-pool-item').forEach(btn => {
        btn.addEventListener('click', () => {
          pickedId = btn.dataset.id;
          renderPool();
          renderPreview();
          applyBtn.disabled = !pickedId;
        });
      });
    };
    const renderPreview = () => {
      const c = pool.find(x => x.id === pickedId);
      if (!c) {
        previewEl.innerHTML = `<div class="ai-resize-preview-empty">Pick a creative to see the AI-resized preview.</div>`;
        return;
      }
      const ratioStyle = ratio === '9:16' ? 'aspect-ratio: 9/16; width: 120px;'
                       : ratio === '1:1'  ? 'aspect-ratio: 1/1; width: 180px;'
                       : ratio === '16:9' ? 'aspect-ratio: 16/9; width: 220px;'
                                          : 'aspect-ratio: 4/5; width: 150px;';
      previewEl.innerHTML = `
        <div class="ai-resize-preview-canvas" style="background:linear-gradient(135deg, ${c.color}, ${c.color2}); ${ratioStyle}">
          <span class="ai-resize-preview-tag">${c.initials} · ${ratio}</span>
          <span class="ai-resize-preview-subject">subject: ${subject}</span>
        </div>
        <div class="ai-resize-preview-meta">${c.name}</div>
      `;
    };

    body.querySelectorAll('[data-role="ratio-chips"] .ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        ratio = chip.dataset.ratio;
        body.querySelectorAll('[data-role="ratio-chips"] .ai-chip').forEach(c => c.classList.toggle('is-active', c === chip));
        renderPreview();
      });
    });
    body.querySelectorAll('[data-role="subject-chips"] .ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        subject = chip.dataset.subject;
        body.querySelectorAll('[data-role="subject-chips"] .ai-chip').forEach(c => c.classList.toggle('is-active', c === chip));
        renderPreview();
      });
    });

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="apply" disabled>Export resized creative</button>
    `;
    const m = openModal({
      title: 'AI resize',
      sub: 'Reframe one creative at a time with subject-aware AI cropping.',
      body,
      footer,
      wide: true,
    });
    const applyBtn = m.footEl.querySelector('[data-role="apply"]');
    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    applyBtn.addEventListener('click', () => {
      m.close();
      // 演示用：弹个轻提示，实际可对接导出流程
      alert(`Exported "${pool.find(x=>x.id===pickedId)?.name}" at ${ratio} (subject: ${subject})`);
    });

    renderPool();
  }

  // ============== Add Creative 流程（场景1）==============
  // 收集所选的 ads（已选 + 已选 campaign 下的所有 ad + 已选 ad group 下的所有 ad）
  function collectSelectedAds() {
    const out = []; // { campaign, ad }
    const seenAd = new Set();
    const push = (campaign, ad) => {
      if (seenAd.has(ad.id)) return;
      seenAd.add(ad.id);
      out.push({ campaign, ad });
    };
    DATA.forEach(c => {
      const set = selectedAds.get(c.id);
      if (set && set.size) {
        c.ads.forEach(ad => { if (set.has(ad.id)) push(c, ad); });
      }
      if (selectedCampaigns.has(c.id)) {
        c.ads.forEach(ad => push(c, ad));
      }
      c.adGroups.forEach(g => {
        if (selectedAdGroups.has(g.id)) g.ads.forEach(ad => push(c, ad));
      });
    });
    return out;
  }

  function openAddCreativeModal() {
    const targets = collectSelectedAds();
    if (targets.length === 0) {
      alert('Please select at least one campaign, ad group or ad first.');
      return;
    }
    // 多选：默认全选创意库，用户可在此基础上取消或缩小范围
    const pickedIds = new Set(CREATIVE_POOL.map(c => c.id));

    const body = document.createElement('div');
    body.innerHTML = `
      <div class="alert info">
        All creatives are selected by default. Uncheck the ones you don't need — remaining creatives will be assigned to the selected ads round-robin.
      </div>
      <div class="picker-head">
        <div style="font-weight:500;">Choose creatives <span class="picker-count" data-role="picked-count">0 selected</span></div>
        <div class="picker-tools">
          <input class="picker-search" data-role="picker-search" placeholder="Filter by name (BF / TopView / App...)" />
          <button class="link-btn" data-role="pick-all">Select all</button>
          <button class="link-btn" data-role="pick-none">Clear</button>
        </div>
      </div>
      <div class="creative-grid" data-role="creative-grid"></div>
    `;
    const grid = body.querySelector('[data-role="creative-grid"]');
    const picker = body.querySelector('[data-role="picker-search"]');
    const pickedCountEl = body.querySelector('[data-role="picked-count"]');

    function updateCount() {
      pickedCountEl.textContent = `${pickedIds.size} selected`;
      applyBtn.disabled = pickedIds.size === 0;
    }

    function renderGrid() {
      const q = picker.value.trim().toLowerCase();
      grid.innerHTML = '';
      CREATIVE_POOL
        .filter(cr => !q || cr.name.toLowerCase().includes(q) || cr.scene.includes(q))
        .forEach(cr => {
          const card = document.createElement('div');
          card.className = 'creative-card' + (pickedIds.has(cr.id) ? ' selected' : '');
          card.dataset.cid = cr.id;
          card.innerHTML = `
            <span class="creative-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg>
            </span>
            ${renderCreativeThumb(cr, 'lg')}
            <div class="creative-name" title="${cr.name}">${cr.name}</div>
            <div class="creative-meta">${cr.type.toUpperCase()} · ${cr.scene}</div>
          `;
          card.addEventListener('click', () => {
            if (pickedIds.has(cr.id)) { pickedIds.delete(cr.id); card.classList.remove('selected'); }
            else { pickedIds.add(cr.id); card.classList.add('selected'); }
            updateCount();
          });
          grid.appendChild(card);
        });
    }
    renderGrid();
    picker.addEventListener('input', renderGrid);

    body.querySelector('[data-role="pick-all"]').addEventListener('click', () => {
      CREATIVE_POOL.forEach(cr => pickedIds.add(cr.id));
      renderGrid(); updateCount();
    });
    body.querySelector('[data-role="pick-none"]').addEventListener('click', () => {
      pickedIds.clear(); renderGrid(); updateCount();
    });

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="apply" disabled>Apply to ${targets.length} ad${targets.length > 1 ? 's' : ''}</button>
    `;
    const m = openModal({
      title: 'Add creatives',
      sub: `Target: ${getSelectionDescription()} (${targets.length} ad${targets.length > 1 ? 's' : ''})`,
      body, footer, wide: true,
    });
    const applyBtn = m.footEl.querySelector('[data-role="apply"]');
    updateCount();

    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    applyBtn.addEventListener('click', () => {
      if (pickedIds.size === 0) return;
      const picks = CREATIVE_POOL.filter(c => pickedIds.has(c.id));
      // 轮询分配：ad i 拿 picks[i % picks.length]
      const changes = [];
      targets.forEach(({ campaign, ad }, i) => {
        const next = picks[i % picks.length];
        changes.push({ campaignName: campaign.name, adName: ad.name, from: ad.creative, to: next });
        ad.creative = next;
      });
      m.close();
      rerender();
      openModal({
        title: `✓ ${changes.length} ad${changes.length !== 1 ? 's' : ''} updated`,
        sub: `${picks.length} creative${picks.length > 1 ? 's' : ''} applied (round-robin): ${picks.map(p => p.name).join(', ')}`,
        body: renderChangesListHtml(changes),
        footer: `<button class="btn-primary" data-role="ok">Done</button>`,
        wide: true,
      }).footEl.querySelector('[data-role="ok"]').addEventListener('click', () => {
        modalRoot.querySelector('.modal-mask')?.remove();
      });
    });
  }

  // 可复用的 before→after 列表（用于 Add creative / Find & replace 结果汇总）
  function renderChangesListHtml(changes) {
    if (!changes.length) return '';
    const rows = changes.slice(0, 10).map(ch => `
      <div class="replace-diff-row">
        <div class="replace-diff-side">
          ${renderCreativeThumb(ch.from, 'sm')}
          <span class="replace-diff-name" title="${ch.from.name}">${ch.from.name}</span>
        </div>
        <svg class="replace-diff-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        <div class="replace-diff-side">
          ${renderCreativeThumb(ch.to, 'sm')}
          <span class="replace-diff-name" title="${ch.to.name}">${ch.to.name}</span>
        </div>
        <span class="replace-diff-ad" title="${ch.adName}">${ch.adName}</span>
      </div>
    `).join('');
    const more = changes.length > 10 ? `<div class="replace-diff-more">…and ${changes.length - 10} more</div>` : '';
    return `<div class="replace-diff-list">${rows}${more}</div>`;
  }

  // ============== Creative supply 下拉菜单：Content suite / Upload / AIGC ==============
  const creativeSupplyWrap = document.querySelector('[data-role="creative-supply-dropdown"]');
  const creativeSupplyTrigger = document.querySelector('[data-role="creative-supply-trigger"]');
  const creativeSupplyMenu = document.querySelector('[data-role="creative-supply-menu"]');
  // 与 bulk-edit 菜单同样：脱离 toolkit-strip 容器以避免裁切，挂到 body 下
  if (creativeSupplyMenu && creativeSupplyMenu.parentElement !== document.body) {
    document.body.appendChild(creativeSupplyMenu);
  }
  function closeCreativeSupplyMenu() {
    if (!creativeSupplyMenu) return;
    creativeSupplyMenu.hidden = true;
    creativeSupplyWrap?.classList.remove('open');
    creativeSupplyTrigger?.setAttribute('aria-expanded', 'false');
  }
  function positionCreativeSupplyMenu() {
    if (!creativeSupplyTrigger || !creativeSupplyMenu) return;
    const rect = creativeSupplyTrigger.getBoundingClientRect();
    creativeSupplyMenu.style.top = `${rect.bottom + 6}px`;
    creativeSupplyMenu.style.left = `${rect.left}px`;
  }
  function openCreativeSupplyMenu() {
    if (!creativeSupplyMenu) return;
    creativeSupplyMenu.hidden = false;
    creativeSupplyWrap?.classList.add('open');
    creativeSupplyTrigger?.setAttribute('aria-expanded', 'true');
    positionCreativeSupplyMenu();
  }
  creativeSupplyTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (creativeSupplyMenu.hidden) openCreativeSupplyMenu(); else closeCreativeSupplyMenu();
  });
  document.addEventListener('click', (e) => {
    if (!creativeSupplyWrap || !creativeSupplyMenu || creativeSupplyMenu.hidden) return;
    if (creativeSupplyMenu.contains(e.target)) return;
    if (!creativeSupplyWrap.contains(e.target)) closeCreativeSupplyMenu();
  });
  window.addEventListener('scroll', () => {
    if (!creativeSupplyMenu || creativeSupplyMenu.hidden) return;
    closeCreativeSupplyMenu();
  }, true);
  window.addEventListener('resize', () => {
    if (!creativeSupplyMenu || creativeSupplyMenu.hidden) return;
    positionCreativeSupplyMenu();
  });

  creativeSupplyMenu?.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-action]');
    if (!li) return;
    const action = li.dataset.action;
    closeCreativeSupplyMenu();
    if (action === 'content-suite') {
      // 复用既有 Add creative 弹窗：从创意库（Content suite）选素材
      openAddCreativeModal();
    } else if (action === 'upload') {
      // 上传新素材：临时使用浏览器原生文件选择器作为占位，与项目其他模块统一以 toast 反馈
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';
      input.multiple = true;
      input.addEventListener('change', () => {
        const n = input.files?.length || 0;
        showToast(n ? `Uploaded ${n} file${n > 1 ? 's' : ''} to creative library.` : 'No files selected.');
      });
      input.click();
    } else if (action === 'aigc') {
      // AIGC 生成：占位流程，提示用户进入生成器
      showToast('Launching AIGC creative generator…');
    }
  });

  // ============== Find & Replace creative（独立流程） ==============
  // 用户在弹窗中：
  //  1) 从"选中 ads 当前使用的创意"中挑选一个或多个原创意（find）
  //  2) 从创意池中挑选一个新创意（replace）
  //  3) 应用后对选中的 ads 做替换，展示 before→after 摘要
  function openFindReplaceModal() {
    const targets = collectSelectedAds();
    if (targets.length === 0) {
      alert('Please select at least one campaign, ad group or ad first.');
      return;
    }
    // 汇总目标 ads 中现有的创意及使用计数
    const usageMap = new Map(); // creativeId -> { creative, count }
    targets.forEach(({ ad }) => {
      const cur = usageMap.get(ad.creative.id);
      if (cur) cur.count++;
      else usageMap.set(ad.creative.id, { creative: ad.creative, count: 1 });
    });
    const usageList = [...usageMap.values()].sort((a, b) => b.count - a.count);

    // 默认全选 Step 1 —— 让用户聚焦于选择"替换为哪个新创意"
    const findIds = new Set(usageList.map(u => u.creative.id));
    let replaceWith = null;      // 新创意

    const body = document.createElement('div');
    body.innerHTML = `
      <div class="fr-grid">
        <div class="fr-col">
          <div class="fr-col-head">
            <div class="fr-step">1</div>
            <div>
              <div class="fr-col-title">Find creatives to replace</div>
              <div class="fr-col-desc">Pick one or more existing creatives used by the selected ads.</div>
            </div>
          </div>
          <input class="picker-search" data-role="find-search" placeholder="Search in use (${usageList.length} unique creative${usageList.length > 1 ? 's' : ''})" />
          <div class="fr-list" data-role="find-list"></div>
          <div class="fr-col-foot">
            <button class="link-btn" data-role="find-all">Select all in use</button>
            <button class="link-btn" data-role="find-none">Clear</button>
          </div>
        </div>
        <div class="fr-arrow">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
        <div class="fr-col">
          <div class="fr-col-head">
            <div class="fr-step">2</div>
            <div>
              <div class="fr-col-title">Replace with</div>
              <div class="fr-col-desc">Pick a new creative from the library.</div>
            </div>
          </div>
          <input class="picker-search" data-role="pool-search" placeholder="Search the creative library" />
          <div class="creative-grid fr-pool" data-role="pool-grid"></div>
        </div>
      </div>
      <div class="fr-summary" data-role="fr-summary">Select creatives on both sides to preview the impact.</div>
    `;

    const findListEl = body.querySelector('[data-role="find-list"]');
    const findSearch = body.querySelector('[data-role="find-search"]');
    const poolGrid = body.querySelector('[data-role="pool-grid"]');
    const poolSearch = body.querySelector('[data-role="pool-search"]');
    const summaryEl = body.querySelector('[data-role="fr-summary"]');

    function renderFindList() {
      const q = findSearch.value.trim().toLowerCase();
      findListEl.innerHTML = '';
      const filtered = usageList.filter(u => !q || u.creative.name.toLowerCase().includes(q));
      if (filtered.length === 0) {
        findListEl.innerHTML = `<div class="fr-empty">No matching creatives in selection.</div>`;
        return;
      }
      filtered.forEach(({ creative, count }) => {
        const row = document.createElement('label');
        row.className = 'fr-find-item' + (findIds.has(creative.id) ? ' selected' : '');
        row.innerHTML = `
          <input type="checkbox" ${findIds.has(creative.id) ? 'checked' : ''} />
          ${renderCreativeThumb(creative, 'md')}
          <div class="fr-find-meta">
            <div class="fr-find-name">${creative.name}</div>
            <div class="fr-find-sub">${creative.type.toUpperCase()} · used by <strong>${count}</strong> ad${count > 1 ? 's' : ''}</div>
          </div>
        `;
        row.querySelector('input').addEventListener('change', (e) => {
          if (e.target.checked) findIds.add(creative.id);
          else findIds.delete(creative.id);
          row.classList.toggle('selected', e.target.checked);
          updateSummary();
        });
        findListEl.appendChild(row);
      });
    }

    function renderPoolGrid() {
      const q = poolSearch.value.trim().toLowerCase();
      poolGrid.innerHTML = '';
      CREATIVE_POOL
        .filter(cr => !q || cr.name.toLowerCase().includes(q) || cr.scene.includes(q))
        .forEach(cr => {
          const card = document.createElement('div');
          const isCurrent = replaceWith && replaceWith.id === cr.id;
          card.className = 'creative-card fr-pool-card' + (isCurrent ? ' selected' : '');
          card.innerHTML = `
            <span class="creative-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg>
            </span>
            ${renderCreativeThumb(cr, 'lg')}
            <div class="creative-name" title="${cr.name}">${cr.name}</div>
            <div class="creative-meta">${cr.type.toUpperCase()} · ${cr.scene}</div>
          `;
          card.addEventListener('click', () => {
            replaceWith = cr;
            poolGrid.querySelectorAll('.creative-card').forEach(x => x.classList.remove('selected'));
            card.classList.add('selected');
            updateSummary();
          });
          poolGrid.appendChild(card);
        });
    }

    function countImpacted() {
      let n = 0;
      targets.forEach(({ ad }) => { if (findIds.has(ad.creative.id)) n++; });
      return n;
    }

    function updateSummary() {
      const impacted = countImpacted();
      if (findIds.size === 0 || !replaceWith) {
        summaryEl.className = 'fr-summary';
        summaryEl.innerHTML = `Select creatives on both sides to preview the impact.`;
        applyBtn.disabled = true;
        return;
      }
      summaryEl.className = 'fr-summary ready';
      summaryEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>
        Will replace <strong>${findIds.size}</strong> creative${findIds.size > 1 ? 's' : ''} with
        <strong>"${replaceWith.name}"</strong> across <strong>${impacted}</strong> of ${targets.length} selected ad${targets.length > 1 ? 's' : ''}.
      `;
      applyBtn.disabled = impacted === 0;
    }

    findSearch.addEventListener('input', renderFindList);
    poolSearch.addEventListener('input', renderPoolGrid);
    body.querySelector('[data-role="find-all"]').addEventListener('click', () => {
      usageList.forEach(u => findIds.add(u.creative.id));
      renderFindList(); updateSummary();
    });
    body.querySelector('[data-role="find-none"]').addEventListener('click', () => {
      findIds.clear(); renderFindList(); updateSummary();
    });

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="apply" disabled>Replace</button>
    `;
    const m = openModal({
      title: 'Find & replace creative',
      sub: `Searching within ${getSelectionDescription()} (${targets.length} ad${targets.length > 1 ? 's' : ''})`,
      body, footer, wide: true,
    });
    const applyBtn = m.footEl.querySelector('[data-role="apply"]');
    renderFindList();
    renderPoolGrid();
    updateSummary();

    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    applyBtn.addEventListener('click', () => {
      if (findIds.size === 0 || !replaceWith) return;
      const changes = [];
      targets.forEach(({ campaign, ad }) => {
        if (findIds.has(ad.creative.id) && ad.creative.id !== replaceWith.id) {
          changes.push({ campaignName: campaign.name, adName: ad.name, from: ad.creative, to: replaceWith });
          ad.creative = replaceWith;
        }
      });
      m.close();
      rerender();

      const wasCreativeSearch = searchMode === 'creative' && searchQuery;
      const footer = wasCreativeSearch
        ? `<button class="btn-ghost" data-role="keep">Keep current search</button>
           <button class="btn-primary" data-role="follow">Follow new creative</button>`
        : `<button class="btn-primary" data-role="ok">Done</button>`;

      const summary = openModal({
        title: `✓ ${changes.length} ad${changes.length !== 1 ? 's' : ''} updated`,
        sub: `Replaced with "${replaceWith.name}"`,
        body: `
          ${wasCreativeSearch ? `<div class="alert info">Your current search is <strong>"${searchQuery}"</strong>. Updated ads may no longer match and can be hidden from the list — use "Follow new creative" to switch the search to <strong>"${replaceWith.name}"</strong>.</div>` : ''}
          ${renderChangesListHtml(changes)}
        `,
        footer, wide: changes.length > 0,
      });
      if (wasCreativeSearch) {
        summary.footEl.querySelector('[data-role="keep"]').addEventListener('click', () => summary.close());
        summary.footEl.querySelector('[data-role="follow"]').addEventListener('click', () => {
          searchQuery = replaceWith.name;
          const input = document.querySelector('[data-role="search-input"]');
          const clear = document.querySelector('[data-role="search-clear"]');
          if (input) input.value = replaceWith.name;
          if (clear) clear.style.display = 'inline-flex';
          currentPage = 1;
          rerender();
          summary.close();
        });
      } else {
        summary.footEl.querySelector('[data-role="ok"]').addEventListener('click', () => summary.close());
      }
    });
  }

  document.querySelector('[data-role="bulk-find-replace"]').addEventListener('click', openFindReplaceModal);

  // ============== Copy / Paste Settings 流程（场景2）==============
  // Step 1 & 2：从选中的广告中选 1 个作为源，勾选要复制的字段
  function openCopyModal() {
    const targets = collectSelectedAds();
    if (targets.length === 0) {
      alert('Please select at least one ad (via row selection or creative search).');
      return;
    }
    let sourceAdId = targets[0].ad.id;
    const body = document.createElement('div');
    body.innerHTML = `
      <div class="alert info">Copy settings from <strong>one source ad</strong>, then select target ads in the list and click "Paste settings".</div>
      <div style="font-weight:500;margin-bottom:6px;">1. Select source ad</div>
      <div class="radio-group" data-role="source-list"></div>
      <div style="font-weight:500;margin:16px 0 6px;">2. Select fields to copy</div>
      <div class="check-list" data-role="field-list"></div>
    `;
    const list = body.querySelector('[data-role="source-list"]');
    targets.forEach(({ campaign, ad }, i) => {
      const item = document.createElement('label');
      item.className = 'radio-item' + (i === 0 ? ' selected' : '');
      item.innerHTML = `
        <input type="radio" name="source" value="${ad.id}" ${i === 0 ? 'checked' : ''} />
        <div>
          <div class="radio-title">${renderCreativeThumb(ad.creative, 'sm')}<span style="margin-left:8px;vertical-align:middle;">${ad.name}</span></div>
          <div class="radio-desc">Campaign: ${campaign.name} · CTA: ${ad.cta} · ${ad.text.slice(0, 60)}${ad.text.length > 60 ? '…' : ''}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        list.querySelectorAll('.radio-item').forEach(x => x.classList.remove('selected'));
        item.classList.add('selected');
        item.querySelector('input').checked = true;
        sourceAdId = ad.id;
        refreshFieldList();
      });
      list.appendChild(item);
    });

    const fieldList = body.querySelector('[data-role="field-list"]');
    const FIELDS = [
      { key: 'text',  label: 'Text' },
      { key: 'cta',   label: 'CTA' },
      { key: 'addon', label: 'Add-on' },
      { key: 'url',   label: 'URL' },
    ];
    function currentSourceAd() {
      return targets.find(t => t.ad.id === sourceAdId)?.ad;
    }
    function refreshFieldList() {
      fieldList.innerHTML = '';
      const ad = currentSourceAd();
      FIELDS.forEach(f => {
        const label = document.createElement('label');
        label.className = 'selected';
        label.innerHTML = `
          <input type="checkbox" data-key="${f.key}" checked />
          <span class="setting-key">${f.label}</span>
          <span class="setting-val" title="${ad[f.key]}">${ad[f.key]}</span>
        `;
        const input = label.querySelector('input');
        input.addEventListener('change', () => {
          label.classList.toggle('selected', input.checked);
        });
        fieldList.appendChild(label);
      });
    }
    refreshFieldList();

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="copy">Copy settings</button>
    `;
    const m = openModal({
      title: 'Copy ad settings',
      sub: 'Choose one source ad, pick fields, then paste to target ads.',
      body, footer, wide: true,
    });
    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    m.footEl.querySelector('[data-role="copy"]').addEventListener('click', () => {
      const ad = currentSourceAd();
      const picked = [...fieldList.querySelectorAll('input[type="checkbox"]:checked')].map(c => c.dataset.key);
      if (picked.length === 0) { alert('Please select at least one field.'); return; }
      const fields = {};
      picked.forEach(k => fields[k] = ad[k]);
      clipboard = { sourceAdId: ad.id, sourceAdName: ad.name, fields };
      m.close();
      updateBulkBar();
      // 引导提示
      openModal({
        title: 'Copied!',
        body: `<div class="alert info">Copied <strong>${picked.length} field${picked.length > 1 ? 's' : ''}</strong> (${picked.join(', ')}) from "${ad.name}".<br/>Now select target ads/campaigns in the list and click <strong>"Paste settings"</strong> in the bottom toolbar.</div>`,
        footer: `<button class="btn-primary" data-role="ok">Got it</button>`,
      }).footEl.querySelector('[data-role="ok"]').addEventListener('click', () => {
        modalRoot.querySelector('.modal-mask')?.remove();
      });
    });
  }

  document.querySelector('[data-role="bulk-copy"]')?.addEventListener('click', openCopyModal);

  // ============== 广告复制 / Duplicate（按 10 条原则设计） ==============
  // 1 确定性：先在向导里完整列出"会得到什么"——副本数量、新名称、层级范围、状态、字段差异
  // 2 最小惊喜：所有差异（改写 / 默认 / 丢弃）显式展示，不静默修改
  // 3 可编辑优先：副本默认 Draft + Paused，不直接上线
  // 4 差异可见：用 changed / default / dropped 三色标签标注每个字段的处理
  // 5 层级完整性：Include children 必须显式勾选（默认勾选）
  // 6 关联资产显式处理：Creatives / Audience / Pixel / Catalog 逐类提供 copy / reference / drop
  // 7 批量一致性：批量与单条走同一表单，规则不会被偷偷放宽
  // 8 命名可识别：Suffix / Prefix / Custom token，预览前 3 条新名称
  // 9 状态安全继承：默认 Paused + Draft，单选切到 Inherit 时给警告
  // 10 跨边界重置：跨账户 / 跨平台时强制重置 Pixel / Catalog / Tracking URL，并显式标注 dropped
  function openDuplicateModal() {
    const targets = collectSelectedAds();
    const cpCount = selectedCampaigns.size;
    const agCount = selectedAdGroups.size;
    const adCount = totalSelectedAdsCount();
    const total = cpCount + agCount + adCount;
    if (total === 0) {
      alert('Please select at least one campaign / ad group / ad first.');
      return;
    }

    // 默认 state（10 条原则的落地默认值）
    const state = {
      copies: 1,
      // 原则 5：层级完整性 — 是否带下层（默认 true）
      includeChildren: true,
      // 原则 8：命名 — suffix 模式 + token "Copy"
      nameMode: 'suffix',
      nameToken: 'Copy',
      // 原则 9：状态安全继承 — 默认 Paused + Draft
      stateMode: 'paused',
      asDraft: true,
      // 原则 6：关联资产显式处理
      assets: {
        creative: 'reference', // copy | reference | drop
        audience: 'reference',
        pixel: 'reference',
        catalog: 'reference',
      },
      // 原则 10：跨边界
      destination: 'same',     // same | another | tiktok-other
      // 原则 2 最小惊喜 + 4 差异可见：哪些字段保留、改写、丢弃
      fieldOverrides: {
        budget: 'inherit',     // inherit | reset | adjust
        bid: 'inherit',
        schedule: 'inherit',
        utm: 'rewrite',
      },
    };

    const body = document.createElement('div');
    body.className = 'dup-wizard';
    body.innerHTML = `
      <div class="dup-summary alert info">
        <strong>Source:</strong> ${cpCount ? `${cpCount} campaign${cpCount > 1 ? 's' : ''}` : ''}${cpCount && agCount ? ' · ' : ''}${agCount ? `${agCount} ad group${agCount > 1 ? 's' : ''}` : ''}${(cpCount || agCount) && adCount ? ' · ' : ''}${adCount ? `${adCount} ad${adCount > 1 ? 's' : ''}` : ''}
        — will produce <strong data-role="dup-output-count">${total}</strong> draft${total > 1 ? 's' : ''}.
      </div>

      <section class="dup-section">
        <header><span class="dup-num">1</span> Scope &amp; copies</header>
        <div class="dup-row">
          <label class="dup-field">
            <span class="dup-label">Number of copies</span>
            <input type="number" min="1" max="20" value="1" data-role="copies" />
          </label>
          <label class="dup-field dup-field-inline">
            <input type="checkbox" data-role="include-children" checked />
            <span>Include all child objects (ad groups &amp; ads)</span>
          </label>
        </div>
        <div class="dup-hint">Hierarchy will be preserved exactly. Unchecking this only duplicates the selected level.</div>
      </section>

      <section class="dup-section">
        <header><span class="dup-num">2</span> Naming</header>
        <div class="dup-row">
          <label class="dup-field-inline">
            <input type="radio" name="dup-name" value="suffix" checked /> <span>Append suffix</span>
          </label>
          <label class="dup-field-inline">
            <input type="radio" name="dup-name" value="prefix" /> <span>Add prefix</span>
          </label>
          <label class="dup-field-inline">
            <input type="radio" name="dup-name" value="custom" /> <span>Custom token</span>
          </label>
          <label class="dup-field dup-field-token">
            <span class="dup-label">Token</span>
            <input type="text" maxlength="32" value="Copy" data-role="name-token" />
          </label>
        </div>
        <div class="dup-name-preview" data-role="name-preview"></div>
      </section>

      <section class="dup-section">
        <header><span class="dup-num">3</span> Destination</header>
        <div class="dup-row">
          <label class="dup-field-inline">
            <input type="radio" name="dup-dest" value="same" checked /> <span>Same account</span>
          </label>
          <label class="dup-field-inline">
            <input type="radio" name="dup-dest" value="another" /> <span>Another TikTok account</span>
          </label>
          <label class="dup-field-inline">
            <input type="radio" name="dup-dest" value="tiktok-other" /> <span>Cross-platform draft</span>
          </label>
        </div>
        <div class="dup-cross-warn" data-role="cross-warn" hidden>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
          Cross-account / cross-platform duplication: <strong>Pixel, Catalog, Tracking URL</strong> will be reset and flagged for re-selection.
        </div>
      </section>

      <section class="dup-section">
        <header><span class="dup-num">4</span> Linked assets</header>
        <div class="dup-asset-grid" data-role="asset-grid"></div>
      </section>

      <section class="dup-section">
        <header><span class="dup-num">5</span> Field handling — what changes</header>
        <div class="dup-diff-table" data-role="diff-table"></div>
      </section>

      <section class="dup-section">
        <header><span class="dup-num">6</span> Status &amp; safety</header>
        <div class="dup-row">
          <label class="dup-field-inline">
            <input type="radio" name="dup-state" value="paused" checked /> <span>Paused (recommended)</span>
          </label>
          <label class="dup-field-inline">
            <input type="radio" name="dup-state" value="inherit" /> <span>Inherit source status</span>
          </label>
        </div>
        <label class="dup-field-inline">
          <input type="checkbox" data-role="as-draft" checked />
          <span>Save as <strong>Draft</strong> (review before going live)</span>
        </label>
        <div class="dup-state-warn" data-role="state-warn" hidden>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
          Inheriting <em>Active</em> status will start spending immediately upon Apply. Review carefully.
        </div>
      </section>
    `;

    // ===== 关联资产网格（原则 6）=====
    const assetGrid = body.querySelector('[data-role="asset-grid"]');
    const ASSET_ROWS = [
      { key: 'creative', label: 'Creatives',  hint: 'Videos / images / scripts attached to ads' },
      { key: 'audience', label: 'Audience',   hint: 'Custom audiences, lookalikes, exclusions' },
      { key: 'pixel',    label: 'Pixel / event', hint: 'Conversion event source' },
      { key: 'catalog',  label: 'Catalog',    hint: 'Product feed / catalog binding' },
    ];
    function renderAssetRow(row) {
      const isCross = state.destination !== 'same';
      // 原则 10：跨边界时 Pixel / Catalog / 部分 Audience 强制 reset
      const forced = isCross && (row.key === 'pixel' || row.key === 'catalog');
      const cur = forced ? 'drop' : state.assets[row.key];
      return `
        <div class="dup-asset-row ${forced ? 'is-forced' : ''}" data-asset="${row.key}">
          <div class="dup-asset-meta">
            <div class="dup-asset-label">${row.label}</div>
            <div class="dup-asset-hint">${row.hint}</div>
          </div>
          <div class="dup-asset-choice">
            <label class="dup-chip ${cur === 'copy' ? 'is-on' : ''} ${forced ? 'is-disabled' : ''}">
              <input type="radio" name="asset-${row.key}" value="copy" ${cur === 'copy' ? 'checked' : ''} ${forced ? 'disabled' : ''} /> Copy
            </label>
            <label class="dup-chip ${cur === 'reference' ? 'is-on' : ''} ${forced ? 'is-disabled' : ''}">
              <input type="radio" name="asset-${row.key}" value="reference" ${cur === 'reference' ? 'checked' : ''} ${forced ? 'disabled' : ''} /> Reference
            </label>
            <label class="dup-chip ${cur === 'drop' ? 'is-on' : ''} ${forced ? 'is-locked' : ''}">
              <input type="radio" name="asset-${row.key}" value="drop" ${cur === 'drop' ? 'checked' : ''} /> Drop
            </label>
            ${forced ? '<span class="dup-asset-locked">Forced reset by cross-boundary policy</span>' : ''}
          </div>
        </div>
      `;
    }
    function renderAssets() {
      assetGrid.innerHTML = ASSET_ROWS.map(renderAssetRow).join('');
      assetGrid.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
          const row = input.closest('[data-asset]');
          const key = row.dataset.asset;
          state.assets[key] = input.value;
          renderAssets();
          renderDiff();
        });
      });
    }

    // ===== 字段差异表（原则 2 + 4）=====
    const diffTable = body.querySelector('[data-role="diff-table"]');
    function renderDiff() {
      const isCross = state.destination !== 'same';
      const ROWS = [
        { key: 'name',     label: 'Name',         action: 'rewrite', detail: previewNames(1)[0] || 'Source name + token' },
        { key: 'budget',   label: 'Budget',       action: state.fieldOverrides.budget === 'inherit' ? 'inherit' : 'rewrite', detail: state.fieldOverrides.budget === 'inherit' ? 'Inherit from source' : 'Reset to ad group default' },
        { key: 'bid',      label: 'Bid strategy', action: 'inherit', detail: 'Inherit from source' },
        { key: 'schedule', label: 'Schedule',     action: 'reset',   detail: 'Reset to "All day" — verify after duplicate' },
        { key: 'status',   label: 'Status',       action: state.stateMode === 'paused' ? 'rewrite' : 'inherit', detail: state.stateMode === 'paused' ? 'Force Paused' : 'Inherit source (may go live)' },
        { key: 'creative', label: 'Creatives',    action: assetActionTag(state.assets.creative), detail: assetActionDetail('creative') },
        { key: 'audience', label: 'Audience',     action: assetActionTag(state.assets.audience), detail: assetActionDetail('audience') },
        { key: 'pixel',    label: 'Pixel / event',action: isCross ? 'dropped' : assetActionTag(state.assets.pixel),   detail: isCross ? 'Dropped — must reselect after duplicate' : assetActionDetail('pixel') },
        { key: 'catalog',  label: 'Catalog',      action: isCross ? 'dropped' : assetActionTag(state.assets.catalog), detail: isCross ? 'Dropped — must reselect after duplicate' : assetActionDetail('catalog') },
        { key: 'utm',      label: 'UTM tracking', action: 'rewrite', detail: 'Append &dup_id=<n> for attribution split' },
        { key: 'po',       label: 'PO number',    action: 'inherit', detail: 'Inherit from source' },
      ];
      diffTable.innerHTML = `
        <div class="dup-diff-head">
          <span>Field</span><span>Action</span><span>Detail</span>
        </div>
        ${ROWS.map(r => `
          <div class="dup-diff-row">
            <span class="dup-diff-key">${r.label}</span>
            <span class="dup-diff-action action-${r.action}">${r.action}</span>
            <span class="dup-diff-detail">${r.detail}</span>
          </div>
        `).join('')}
      `;
    }
    function assetActionTag(mode) {
      return mode === 'copy' ? 'rewrite' : (mode === 'drop' ? 'dropped' : 'inherit');
    }
    function assetActionDetail(key) {
      const mode = state.assets[key];
      if (mode === 'copy') return 'Cloned as new asset';
      if (mode === 'drop') return 'Dropped — must reselect after duplicate';
      return 'Reference original (no copy)';
    }

    // ===== 命名预览（原则 8）=====
    function previewNames(n) {
      const names = [];
      const sources = [];
      DATA.forEach(c => {
        if (selectedCampaigns.has(c.id)) sources.push(c.name);
        c.adGroups?.forEach(g => { if (selectedAdGroups.has(g.id)) sources.push(g.name); });
      });
      targets.forEach(t => sources.push(t.ad.name));
      const top = sources.slice(0, n || 3);
      const token = (state.nameToken || 'Copy').trim() || 'Copy';
      return top.map(src => {
        if (state.nameMode === 'prefix')      return `${token} - ${src}`;
        if (state.nameMode === 'custom')      return `${src} {${token}}`;
        return `${src} - ${token}`;
      });
    }
    function renderNamePreview() {
      const list = previewNames(3);
      const previewEl = body.querySelector('[data-role="name-preview"]');
      previewEl.innerHTML = `
        <div class="dup-preview-label">Preview (first ${list.length})</div>
        <ul class="dup-preview-list">
          ${list.map(n => `<li><span class="dup-preview-mark"></span>${n}</li>`).join('')}
        </ul>
      `;
    }

    // ===== 输出数量（原则 1 确定性）=====
    function refreshOutputCount() {
      const factor = Math.max(1, parseInt(body.querySelector('[data-role="copies"]').value, 10) || 1);
      const childAds = state.includeChildren ? targets.length : 0;
      const out = (cpCount + agCount + (state.includeChildren ? childAds : adCount)) * factor;
      body.querySelector('[data-role="dup-output-count"]').textContent = out;
    }

    // ===== 事件绑定 =====
    body.querySelector('[data-role="copies"]').addEventListener('input', refreshOutputCount);
    body.querySelector('[data-role="include-children"]').addEventListener('change', (e) => {
      state.includeChildren = e.target.checked;
      refreshOutputCount();
    });
    body.querySelectorAll('input[name="dup-name"]').forEach(r => {
      r.addEventListener('change', () => {
        state.nameMode = r.value;
        renderNamePreview();
        renderDiff();
      });
    });
    body.querySelector('[data-role="name-token"]').addEventListener('input', (e) => {
      state.nameToken = e.target.value;
      renderNamePreview();
      renderDiff();
    });
    body.querySelectorAll('input[name="dup-dest"]').forEach(r => {
      r.addEventListener('change', () => {
        state.destination = r.value;
        body.querySelector('[data-role="cross-warn"]').hidden = state.destination === 'same';
        renderAssets();
        renderDiff();
      });
    });
    body.querySelectorAll('input[name="dup-state"]').forEach(r => {
      r.addEventListener('change', () => {
        state.stateMode = r.value;
        body.querySelector('[data-role="state-warn"]').hidden = state.stateMode !== 'inherit';
        renderDiff();
      });
    });
    body.querySelector('[data-role="as-draft"]').addEventListener('change', (e) => {
      state.asDraft = e.target.checked;
    });

    renderAssets();
    renderNamePreview();
    renderDiff();
    refreshOutputCount();

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="apply">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        Create drafts
      </button>
    `;

    const m = openModal({
      title: 'Duplicate ads',
      sub: 'Create editable drafts from the current selection. Differences are shown explicitly below.',
      body, footer, wide: true,
    });
    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    m.footEl.querySelector('[data-role="apply"]').addEventListener('click', () => {
      const factor = Math.max(1, parseInt(body.querySelector('[data-role="copies"]').value, 10) || 1);
      const result = applyDuplication(state, factor);
      const tag = state.asDraft ? 'Draft' : (state.stateMode === 'paused' ? 'Paused' : 'Inherit');
      m.close();
      // 切到 campaign 层级 + all preset，让用户立刻看到新建的草稿
      currentLevel = 'campaign';
      currentPreset = 'all';
      currentPage = 1;
      // 同步 tab 视觉态（active pill 切到 Campaigns）
      document.querySelectorAll('.tab').forEach(t => {
        const isCampaignTab = t.textContent.trim().toLowerCase().startsWith('campaign');
        t.classList.toggle('active', isCampaignTab);
      });
      // 自动选中新建的副本，方便后续操作
      selectedCampaigns.clear();
      selectedAdGroups.clear();
      selectedAds.clear();
      result.newCampaignIds.forEach(id => selectedCampaigns.add(id));
      const ca = document.getElementById('checkAll');
      if (ca) ca.checked = false;
      updatePresetCards();
      rerender();
      // 高亮闪烁：新建行播放 1.6s 入场动画
      requestAnimationFrame(() => {
        result.newCampaignIds.forEach(id => {
          const tr = tbody.querySelector(`tr[data-campaign-id="${id}"]`);
          if (tr) {
            tr.classList.add('row-just-created');
            setTimeout(() => tr.classList.remove('row-just-created'), 1800);
          }
        });
        // 滚到列表顶部，确保新建的 campaign 可见
        const tableHost = document.querySelector('.table-host') || document.querySelector('table')?.parentElement;
        if (tableHost) tableHost.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      const cnt = result.newCampaignIds.length + result.newAdGroupIds.length + result.newAdIds.length;
      const cmpN = result.newCampaignIds.length;
      const detail = cmpN ? `${cmpN} new campaign${cmpN > 1 ? 's' : ''} added to top of list` : `${cnt} draft${cnt > 1 ? 's' : ''} added inline`;
      showToast(`Created ${cnt} ${tag} duplicate${cnt > 1 ? 's' : ''} — ${detail}.`);
    });
  }

  // ===== 真实复制：把所选的 campaign / ad group / ad 克隆到 DATA 中 =====
  function applyDuplication(state, factor) {
    const isCross = state.destination !== 'same';
    const newCampaignIds = [];
    const newAdGroupIds = [];
    const newAdIds = [];

    function makeName(src, copyIdx) {
      const token = (state.nameToken || 'Copy').trim() || 'Copy';
      const numSuffix = factor > 1 ? ` (${copyIdx + 1})` : '';
      if (state.nameMode === 'prefix') return `${token} - ${src}${numSuffix}`;
      if (state.nameMode === 'custom') return `${src} {${token}}${numSuffix}`;
      return `${src} - ${token}${numSuffix}`;
    }
    function statusFlags() {
      // 原则 9：默认 Paused/Draft；选 inherit 则保留源状态
      const paused = state.asDraft || state.stateMode === 'paused';
      return { isOn: !paused, isDraft: !!state.asDraft, isPaused: paused };
    }

    function cloneAd(srcAd, copyIdx) {
      const flags = statusFlags();
      // 原则 6：creative copy/reference/drop
      let creative = srcAd.creative;
      if (state.assets.creative === 'copy') {
        creative = { ...srcAd.creative, id: `${srcAd.creative.id}__dup_${Math.random().toString(36).slice(2, 6)}`, name: `${srcAd.creative.name} (copy)` };
      } else if (state.assets.creative === 'drop') {
        creative = { ...srcAd.creative, name: '(reselect creative)', _dropped: true };
      }
      const newAd = {
        ...srcAd,
        id: `ad_${Math.random().toString(36).slice(2, 8)}`,
        name: makeName(srcAd.name, copyIdx),
        creative,
        // 原则 2：UTM 重写
        url: srcAd.url + (srcAd.url.includes('?') ? '&' : '?') + `dup_id=${copyIdx + 1}`,
        status: flags.isPaused ? 'paused' : srcAd.status,
        isDraft: flags.isDraft,
        isDuplicate: true,
      };
      newAdIds.push(newAd.id);
      return newAd;
    }

    function cloneAdGroup(srcGroup, copyIdx, parentCampaignId) {
      const flags = statusFlags();
      const newGroup = {
        ...srcGroup,
        id: `ag_${Math.random().toString(36).slice(2, 8)}`,
        name: makeName(srcGroup.name, copyIdx),
        campaignId: parentCampaignId || srcGroup.campaignId,
        // 原则 10：跨边界 pixel/catalog 强制重置
        pixel: isCross ? null : srcGroup.pixel,
        catalog: isCross ? null : srcGroup.catalog,
        // 原则 2：schedule 重置
        schedule: 'All day',
        isOn: flags.isOn,
        isDraft: flags.isDraft,
        isDuplicate: true,
        ads: state.includeChildren ? srcGroup.ads.map(ad => cloneAd(ad, copyIdx)) : [],
      };
      newAdGroupIds.push(newGroup.id);
      return newGroup;
    }

    function cloneCampaign(srcCmp, copyIdx) {
      const flags = statusFlags();
      const newId = `cp_${Math.random().toString(36).slice(2, 8)}`;
      const newCmp = {
        ...srcCmp,
        id: newId,
        name: makeName(srcCmp.name, copyIdx),
        isOn: flags.isOn,
        isDraft: flags.isDraft,
        isDuplicate: true,
        isNew: true, // 列表里给红点提示
        status: flags.isPaused ? 'paused' : srcCmp.status,
        label: flags.isPaused ? 'Inactive' : srcCmp.label,
        sub: srcCmp.sub,
        adGroups: state.includeChildren
          ? srcCmp.adGroups.map(g => cloneAdGroup(g, copyIdx, newId))
          : [],
      };
      // 重新挂 ads getter（buildRow 里是用 defineProperty 挂的，扩展运算符不会带过来）
      Object.defineProperty(newCmp, 'ads', {
        get() { return this.adGroups.flatMap(g => g.ads); },
        enumerable: false,
      });
      newCampaignIds.push(newId);
      return newCmp;
    }

    // 收集所选 campaign（campaign 层）
    const cmpToDup = DATA.filter(c => selectedCampaigns.has(c.id));
    // 收集所选 ad group（脱离 campaign 不挂载，挂回原 campaign 下）
    const groupParents = new Map(); // campaignId -> [groupClones]
    DATA.forEach(c => {
      c.adGroups.forEach(g => {
        if (!selectedAdGroups.has(g.id)) return;
        if (selectedCampaigns.has(c.id)) return; // 已通过 campaign 整体复制过
        if (!groupParents.has(c.id)) groupParents.set(c.id, []);
        groupParents.get(c.id).push(g);
      });
    });
    // 收集单选 ad
    const adParents = new Map(); // groupId -> { campaign, group, ads:[] }
    DATA.forEach(c => {
      const set = selectedAds.get(c.id);
      if (!set || !set.size) return;
      c.adGroups.forEach(g => {
        const picks = g.ads.filter(ad => set.has(ad.id));
        if (!picks.length) return;
        if (selectedCampaigns.has(c.id)) return;
        if (selectedAdGroups.has(g.id)) return;
        adParents.set(g.id, { campaign: c, group: g, ads: picks });
      });
    });

    for (let i = 0; i < factor; i++) {
      // 1) campaign 整复制
      cmpToDup.forEach(srcCmp => {
        const cloned = cloneCampaign(srcCmp, i);
        DATA.unshift(cloned);
      });
      // 2) ad group 局部复制（挂回原 campaign）
      groupParents.forEach((groups, cmpId) => {
        const cmp = DATA.find(c => c.id === cmpId);
        if (!cmp) return;
        groups.forEach(g => {
          const cloned = cloneAdGroup(g, i, cmpId);
          cmp.adGroups.push(cloned);
        });
      });
      // 3) ad 局部复制（挂回原 ad group）
      adParents.forEach(({ group, ads }) => {
        ads.forEach(ad => {
          const cloned = cloneAd(ad, i);
          cloned.adGroupId = group.id;
          group.ads.push(cloned);
        });
      });
    }

    return { newCampaignIds, newAdGroupIds, newAdIds };
  }

  document.querySelector('[data-role="bulk-duplicate"]')?.addEventListener('click', openDuplicateModal);

  // 复用 Meta Import drawer 中的 Adaptation toolkit：
  // 仅弹出 Toolkit 抽屉（不带 Import 容器、不带 stepper、不带 Adapt & Confirm 大表）
  document.querySelector('[data-role="bulk-toolkit"]')?.addEventListener('click', () => {
    const targets = collectSelectedAds();
    const campaignIds = Array.from(new Set(targets.map(t => t.campaign.id)));
    if (campaignIds.length === 0 && selectedCampaigns.size === 0) {
      alert('Please select at least one campaign / ad group / ad first.');
      return;
    }
    const sourceIds = campaignIds.length ? campaignIds : Array.from(selectedCampaigns);
    openBulkAdaptationToolkit(sourceIds);
  });

  // Step 3 & 4：粘贴到选中的目标 ads，带失败弹窗（跳过 / 停止）
  function openPasteFlow() {
    if (!clipboard) return;
    const targets = collectSelectedAds().filter(t => t.ad.id !== clipboard.sourceAdId);
    if (targets.length === 0) {
      alert('Please select target ads (different from the source).');
      return;
    }

    const body = document.createElement('div');
    const fieldKeys = Object.keys(clipboard.fields);
    body.innerHTML = `
      <div class="alert info">Paste <strong>${fieldKeys.length} field${fieldKeys.length > 1 ? 's' : ''}</strong> (${fieldKeys.join(', ')}) from <strong>"${clipboard.sourceAdName}"</strong> to <strong>${targets.length}</strong> target ad${targets.length > 1 ? 's' : ''}.</div>
      <div class="progress-list" data-role="progress"></div>
    `;
    const progress = body.querySelector('[data-role="progress"]');
    targets.forEach(({ campaign, ad }) => {
      const item = document.createElement('div');
      item.className = 'progress-item pending';
      item.dataset.adId = ad.id;
      item.innerHTML = `<span class="dot"></span><span>${ad.name} <span style="color:#9ca3af">(${campaign.name})</span></span>`;
      progress.appendChild(item);
    });

    const footer = `
      <button class="btn-ghost" data-role="cancel">Cancel</button>
      <button class="btn-primary" data-role="start">Start paste</button>
    `;
    const m = openModal({
      title: `Paste settings to ${targets.length} ads`,
      body, footer,
    });

    let stopped = false;
    m.footEl.querySelector('[data-role="cancel"]').addEventListener('click', m.close);
    m.footEl.querySelector('[data-role="start"]').addEventListener('click', async () => {
      m.footEl.innerHTML = `<button class="btn-ghost" data-role="abort">Abort</button>`;
      m.footEl.querySelector('[data-role="abort"]').addEventListener('click', () => {
        stopped = true;
      });

      let success = 0, fail = 0, skipped = 0;
      for (const { ad, campaign } of targets) {
        if (stopped) { skipped++; continue; }
        const item = progress.querySelector(`[data-ad-id="${ad.id}"]`);
        await new Promise(r => setTimeout(r, 250));
        if (ad.locked) {
          // 失败场景：弹窗询问跳过 / 停止
          const decision = await askSkipOrStop(ad, campaign);
          if (decision === 'stop') {
            stopped = true;
            item.className = 'progress-item fail';
            item.innerHTML = `<span class="dot"></span><span>${ad.name} — ❌ Failed (locked). Stopped.</span>`;
            fail++;
            continue;
          } else if (decision === 'skip') {
            item.className = 'progress-item fail';
            item.innerHTML = `<span class="dot"></span><span>${ad.name} — ⚠️ Skipped (locked by another editor).</span>`;
            fail++;
            continue;
          }
        }
        // 应用
        Object.entries(clipboard.fields).forEach(([k, v]) => { ad[k] = v; });
        item.className = 'progress-item success';
        item.innerHTML = `<span class="dot"></span><span>${ad.name} — ✓ Updated</span>`;
        success++;
      }

      m.footEl.innerHTML = `
        <span style="margin-right:auto;color:#6b7280;font-size:12px;">
          ✓ ${success} updated · ${fail > 0 ? '⚠️ ' + fail + ' failed' : ''} ${skipped > 0 ? '· ' + skipped + ' not run' : ''}
        </span>
        <button class="btn-primary" data-role="done">Done</button>
      `;
      m.footEl.querySelector('[data-role="done"]').addEventListener('click', () => {
        m.close();
        rerender();
      });
    });
  }

  function askSkipOrStop(ad, campaign) {
    return new Promise(resolve => {
      const m = openModal({
        title: 'Cannot paste to this ad',
        body: `
          <div class="alert danger">
            <strong>"${ad.name}"</strong> in campaign <strong>"${campaign.name}"</strong> cannot be updated.
            <br/>Reason: This ad is currently being edited by another user, or is locked by review policy.
          </div>
          <div style="color:#6b7280;font-size:12px;">Choose how to proceed for the remaining ads:</div>
        `,
        footer: `
          <button class="btn-ghost" data-role="stop">Stop copying</button>
          <button class="btn-primary" data-role="skip">Skip & continue</button>
        `,
      });
      m.footEl.querySelector('[data-role="stop"]').addEventListener('click', () => { m.close(); resolve('stop'); });
      m.footEl.querySelector('[data-role="skip"]').addEventListener('click', () => { m.close(); resolve('skip'); });
    });
  }

  document.querySelector('[data-role="bulk-paste"]').addEventListener('click', openPasteFlow);

  // ============== AI Summary：支持 Black Friday promotions / Meta imported / AIGC 三种 preset ==============
  let aiLoadTimer = 0;

  // 计算 AIGC vs 非 AIGC 的视频互动指标对比
  function computeAigcStats() {
    const allVideoAds = [];
    DATA.forEach(c => (c.ads || []).forEach(ad => {
      if (ad.videoMetrics) allVideoAds.push(ad);
    }));
    const aigcAds = allVideoAds.filter(a => a.isAigc);
    const nonAigc = allVideoAds.filter(a => !a.isAigc);
    const avg = (list, k) => list.length ? list.reduce((s, a) => s + a.videoMetrics[k], 0) / list.length : 0;
    const aigcVtr = avg(aigcAds, 'vtr');
    const nonAigcVtr = avg(nonAigc, 'vtr');
    const aigcHook = avg(aigcAds, 'hookRate');
    const nonAigcHook = avg(nonAigc, 'hookRate');
    const aigcAvg = avg(aigcAds, 'avgWatch');
    const nonAigcAvg = avg(nonAigc, 'avgWatch');
    const aigcComplete = avg(aigcAds, 'completeRate');
    const nonAigcComplete = avg(nonAigc, 'completeRate');
    const totalAigcViews = aigcAds.reduce((s, a) => s + a.videoMetrics.views, 0);
    const uplift = nonAigcVtr > 0 ? ((aigcVtr - nonAigcVtr) / nonAigcVtr) * 100 : 0;
    return {
      aigcAds, nonAigc,
      aigcVtr, nonAigcVtr,
      aigcHook, nonAigcHook,
      aigcAvg, nonAigcAvg,
      aigcComplete, nonAigcComplete,
      totalAigcViews,
      uplift,
    };
  }

  // 渲染 AIGC 专属 Summary 内容
  function renderAigcSummary(el) {
    const stats = computeAigcStats();

    // ===== 视频互动对比柱：4 行（VTR / Hook / Avg watch / Complete）=====
    const compareEl = el.querySelector('[data-role="aigc-compare-list"]');
    if (compareEl) {
      const rows = [
        { label: 'VTR (Video Through Rate)',  aigc: stats.aigcVtr,      nonAigc: stats.nonAigcVtr,      unit: '%' },
        { label: '3-second hook rate',        aigc: stats.aigcHook,     nonAigc: stats.nonAigcHook,     unit: '%' },
        { label: 'Avg. watch time',           aigc: stats.aigcAvg,      nonAigc: stats.nonAigcAvg,      unit: 's' },
        { label: 'Completion rate',           aigc: stats.aigcComplete, nonAigc: stats.nonAigcComplete, unit: '%' },
      ];
      compareEl.innerHTML = rows.map(r => {
        const max = Math.max(r.aigc, r.nonAigc, 1);
        const aigcPct = (r.aigc / max) * 100;
        const nonAigcPct = (r.nonAigc / max) * 100;
        const delta = r.nonAigc > 0 ? ((r.aigc - r.nonAigc) / r.nonAigc) * 100 : 0;
        return `
          <div class="aigc-cmp-row">
            <div class="aigc-cmp-label">${r.label}</div>
            <div class="aigc-cmp-bars">
              <div class="aigc-cmp-bar is-aigc">
                <span class="aigc-cmp-tag">AIGC</span>
                <span class="aigc-cmp-track"><span class="aigc-cmp-fill" style="width:${aigcPct}%"></span></span>
                <span class="aigc-cmp-num">${r.aigc.toFixed(1)}${r.unit}</span>
              </div>
              <div class="aigc-cmp-bar is-non">
                <span class="aigc-cmp-tag">Non-AIGC</span>
                <span class="aigc-cmp-track"><span class="aigc-cmp-fill" style="width:${nonAigcPct}%"></span></span>
                <span class="aigc-cmp-num">${r.nonAigc.toFixed(1)}${r.unit}</span>
              </div>
            </div>
            <div class="aigc-cmp-delta ${delta >= 0 ? 'up' : 'down'}">${delta >= 0 ? '+' : ''}${delta.toFixed(0)}%</div>
          </div>
        `;
      }).join('');
    }

    // ===== Views 汇总 =====
    const viewsEl = el.querySelector('[data-role="aigc-views-value"]');
    if (viewsEl) viewsEl.textContent = fmtInt(stats.totalAigcViews);
    const viewsDeltaEl = el.querySelector('[data-role="aigc-views-delta"]');
    if (viewsDeltaEl) viewsDeltaEl.textContent = `${stats.uplift >= 0 ? '+' : ''}${stats.uplift.toFixed(0)}% VTR vs Non-AIGC`;
    const viewsSpark = el.querySelector('[data-role="aigc-views-spark"]');
    if (viewsSpark && stats.aigcAds.length) {
      renderSparkline(viewsSpark, stats.aigcAds.slice(0, 12).map(a => a.videoMetrics.views));
    }
    const viewsDescEl = el.querySelector('[data-role="aigc-views-desc"]');
    if (viewsDescEl) {
      const topAd = stats.aigcAds.slice().sort((a, b) => b.videoMetrics.vtr - a.videoMetrics.vtr)[0];
      viewsDescEl.innerHTML = topAd
        ? `Top performer <a class="ai-metric-link" href="#">${topAd.creative.name}</a> reached <strong>${topAd.videoMetrics.vtr.toFixed(1)}%</strong> VTR and <strong>${topAd.videoMetrics.avgWatch.toFixed(1)}s</strong> avg watch — clone its hook to scale.`
        : 'AIGC creatives are driving stronger watch-through. Worth scaling winning hooks into more variants.';
    }

    // ===== Top performing AIGC creatives：按 VTR 排序前 3 =====
    const topEl = el.querySelector('[data-role="ai-top-aigc"]');
    if (topEl) {
      const top3 = stats.aigcAds
        .slice()
        .sort((a, b) => b.videoMetrics.vtr - a.videoMetrics.vtr)
        .slice(0, 3);
      // 不够 3 张时用 CREATIVE_POOL 补齐
      const cells = top3.map(ad => {
        const cr = { ...ad.creative, isAigc: true };
        return `
          <div class="ai-thumb-cell" title="${cr.name} · VTR ${ad.videoMetrics.vtr.toFixed(1)}%">
            ${renderCreativeThumb(cr, 'lg')}
            <div class="ai-thumb-meta">
              <div class="ai-thumb-meta-line"><span class="aigc-chip">AIGC</span><span>VTR ${ad.videoMetrics.vtr.toFixed(1)}%</span></div>
              <div class="ai-thumb-meta-sub">${ad.aigcDirection || '—'}</div>
            </div>
          </div>
        `;
      });
      topEl.innerHTML = cells.join('') || '<div class="ai-empty">No AIGC ad yet.</div>';
    }

    // ===== Top content directions：聚合 AIGC ad 的方向 =====
    const dirEl = el.querySelector('[data-role="aigc-direction-list"]');
    if (dirEl) {
      const dirMap = new Map();
      stats.aigcAds.forEach(ad => {
        const k = ad.aigcDirection || 'Other';
        const cur = dirMap.get(k) || { count: 0, vtrSum: 0, viewsSum: 0 };
        cur.count += 1;
        cur.vtrSum += ad.videoMetrics.vtr;
        cur.viewsSum += ad.videoMetrics.views;
        dirMap.set(k, cur);
      });
      const ranked = Array.from(dirMap.entries())
        .map(([name, v]) => ({ name, count: v.count, avgVtr: v.vtrSum / v.count, views: v.viewsSum }))
        .sort((a, b) => b.avgVtr - a.avgVtr)
        .slice(0, 4);
      const maxViews = Math.max(...ranked.map(r => r.views), 1);
      dirEl.innerHTML = ranked.map(r => `
        <div class="aigc-dir-row">
          <div class="aigc-dir-name">${r.name}</div>
          <div class="aigc-dir-bar"><span class="aigc-dir-fill" style="width:${(r.views / maxViews) * 100}%"></span></div>
          <div class="aigc-dir-stats">${r.count} ads · VTR ${r.avgVtr.toFixed(1)}%</div>
        </div>
      `).join('');
    }
  }

  // ============== Creative Testing Summary ==============
  function computeCreativeTestStats() {
    const tests = filters.creativetest().map(r => ({ row: r, ...r.creativeTest }));
    const winners = tests.filter(t => t.status === 'winner');
    const losers = tests.filter(t => t.status === 'loser');
    const testing = tests.filter(t => t.status === 'testing');
    const pending = tests.filter(t => t.status === 'pending');
    const avgLift = winners.length
      ? winners.reduce((s, t) => s + t.liftCtr, 0) / winners.length
      : (testing.length ? testing.reduce((s, t) => s + t.liftCtr, 0) / testing.length : 0);
    return {
      tests,
      winners: winners.length,
      losers: losers.length,
      testing: testing.length,
      pending: pending.length,
      avgLift,
      // 周速度（demo: 大致估算）
      velocity: Math.max(1, Math.round(winners.length * 7 / 14)),
    };
  }

  function renderCreativeTestSummary(el) {
    const stats = computeCreativeTestStats();

    // ===== 漏斗：4 段（Pending / Testing / Winner / Loser），按数量按比例铺开 =====
    const funnelEl = el.querySelector('[data-role="ct-funnel"]');
    if (funnelEl) {
      const segs = [
        { key: 'pending', label: 'Pending',    count: stats.pending, cls: 'ct-fnl-pending'  },
        { key: 'testing', label: 'In testing', count: stats.testing, cls: 'ct-fnl-testing' },
        { key: 'winner',  label: 'Winner',     count: stats.winners, cls: 'ct-fnl-winner'  },
        { key: 'loser',   label: 'Loser',      count: stats.losers,  cls: 'ct-fnl-loser'   },
      ];
      const total = stats.tests.length || 1;
      funnelEl.innerHTML = segs.map(s => {
        const pct = (s.count / total) * 100;
        return `
          <div class="ct-fnl-row">
            <div class="ct-fnl-head">
              <span class="ct-fnl-dot ${s.cls}"></span>
              <span class="ct-fnl-label">${s.label}</span>
              <span class="ct-fnl-count">${s.count}</span>
            </div>
            <div class="ct-fnl-track"><span class="ct-fnl-fill ${s.cls}" style="width:${pct}%"></span></div>
          </div>
        `;
      }).join('');
    }

    // ===== KPI: avg lift / velocity =====
    const liftEl = el.querySelector('[data-role="ct-lift-value"]');
    if (liftEl) liftEl.textContent = `${stats.avgLift >= 0 ? '+' : ''}${stats.avgLift.toFixed(1)}%`;
    const velEl = el.querySelector('[data-role="ct-velocity"]');
    if (velEl) velEl.textContent = `${stats.velocity} winner${stats.velocity > 1 ? 's' : ''} / week`;
    const liftDescEl = el.querySelector('[data-role="ct-lift-desc"]');
    if (liftDescEl) {
      const topWinner = stats.tests.filter(t => t.status === 'winner').sort((a, b) => b.liftCtr - a.liftCtr)[0];
      liftDescEl.innerHTML = topWinner
        ? `Top winner <a class="ai-metric-link" href="#">${topWinner.row.name}</a> lifted CTR by <strong>+${topWinner.liftCtr.toFixed(1)}%</strong> over control with <strong>${topWinner.confidence}%</strong> confidence — lock it in and clone the winning hook.`
        : `${stats.testing} test${stats.testing > 1 ? 's' : ''} are still gathering signal. Hold off on scaling until confidence reaches 95%.`;
    }
    const velSpark = el.querySelector('[data-role="ct-velocity-spark"]');
    if (velSpark) {
      // 用最近 12 个 test 的 progress 序列模拟趋势
      renderSparkline(velSpark, stats.tests.slice(0, 12).map(t => Math.max(2, t.progress)));
    }

    // ===== 测试组明细列表：每行 = leader 缩略图 + 名称 / 假设 / 进度条 / 关键指标 / 状态 chip =====
    const listEl = el.querySelector('[data-role="ct-test-list"]');
    if (listEl) {
      // 排序：testing → pending → winner → loser；同状态内 progress desc
      const order = { testing: 0, pending: 1, winner: 2, loser: 3 };
      const sorted = stats.tests.slice().sort((a, b) =>
        (order[a.status] - order[b.status]) || (b.progress - a.progress)
      ).slice(0, 6); // 最多展示 6 个
      listEl.innerHTML = sorted.map(t => {
        const leader = t.leader;
        const liftCls = t.liftCtr >= 0 ? 'up' : 'down';
        const liftSign = t.liftCtr >= 0 ? '+' : '';
        const eta = t.eta > 0 ? (t.eta < 24 ? `${t.eta}h left` : `${Math.round(t.eta / 24)}d left`) : '—';
        const sub = t.status === 'pending'
          ? `Queued · starts in ${eta}`
          : t.status === 'winner'
            ? `Winner · ${t.confidence}% confidence`
            : t.status === 'loser'
              ? `Loser · ${t.confidence}% confidence`
              : `${eta} · ${fmtInt(t.sampleHave)}/${fmtInt(t.sampleNeeded)} samples`;
        return `
          <div class="ct-test-row" title="${t.row.name}" data-campaign-id="${t.row.id}">
            <div class="ct-test-thumb">
              ${renderCreativeThumb(leader.creative, 'sm')}
              <span class="ct-test-variants">${t.variantsCount} var</span>
            </div>
            <div class="ct-test-meta">
              <div class="ct-test-name">${t.row.name}</div>
              <div class="ct-test-hypo">
                <span class="ct-hypo-chip">${t.hypothesis}</span>
                <span class="ct-test-sub">${sub}</span>
              </div>
              <div class="ct-test-bar"><span class="ct-test-bar-fill ct-fnl-${t.status}" style="width:${t.progress}%"></span></div>
            </div>
            <div class="ct-test-stats">
              <div class="ct-test-lift ${liftCls}">${liftSign}${t.liftCtr.toFixed(1)}%</div>
              <div class="ct-test-status ct-status-${t.status}">${t.status}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function escapeHtmlWorkflow(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function setWorkflowPanelCollapsed(collapsed) {
    aiSummaryCollapsed = collapsed;
    if (collapsed) {
      document.querySelectorAll('.preset-workflow').forEach(card => card.classList.remove('active'));
      document.querySelectorAll('.wfl-scenario').forEach(item => item.classList.remove('is-selected'));
      const row = document.querySelector('[data-role="workflow-row"]');
      if (row) delete row.dataset.activeWorkflow;
      const summary = document.querySelector('[data-role="ai-summary"]');
      if (summary) summary.style.display = 'none';
    }
  }

  function syncWorkflowLinkState(workflowKey) {
    const row = document.querySelector('[data-role="workflow-row"]');
    if (!row) return;
    if (workflowKey) row.dataset.activeWorkflow = workflowKey;
    else delete row.dataset.activeWorkflow;
  }

  function getPhaseOneContext() {
    if (PHASE_ONE_WORKFLOWS[currentPreset]) {
      const workflow = PHASE_ONE_WORKFLOWS[currentPreset];
      const key = currentScenario || workflow.defaultScenario;
      return { workflowKey: currentPreset, workflow, scenarioKey: key, scenario: workflow.scenarios[key] || workflow.scenarios[workflow.defaultScenario] };
    }
    if (PHASE_ONE_REPORT_PRESETS.has(currentPreset)) {
      const workflow = PHASE_ONE_WORKFLOWS.phase1Midflight;
      return { workflowKey: 'phase1Midflight', workflow, scenarioKey: 'dailyReport', scenario: workflow.scenarios.dailyReport };
    }
    if (PHASE_ONE_ISSUE_PRESETS.has(currentPreset)) {
      const workflow = PHASE_ONE_WORKFLOWS.phase1Midflight;
      return { workflowKey: 'phase1Midflight', workflow, scenarioKey: 'anomalyMonitor', scenario: workflow.scenarios.anomalyMonitor };
    }
    return null;
  }

  function renderPhaseOneHeader(ctx) {
    return `
      <div class="ai-summary-head" data-role="ai-summary-toggle">
        <div class="ai-summary-left-wrap">
          <span class="ai-summary-toggle-icon" data-role="ai-summary-toggle-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
          <div class="ai-summary-title-wrap">
            <span class="ai-summary-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/></svg>
            </span>
            <div class="ai-summary-text-wrap">
              <div class="ai-summary-title" data-role="ai-title">${escapeHtmlWorkflow(ctx.workflow.label)} · ${escapeHtmlWorkflow(ctx.scenario.label)}</div>
              <div class="ai-summary-desc" data-role="ai-desc">${escapeHtmlWorkflow(ctx.workflow.phase)} · ${escapeHtmlWorkflow(ctx.scenario.short)}</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderPhaseOneActionButtons(actions) {
    return actions.map(([name, action, desc]) => `
      <button type="button" class="phase-action-card" data-phase-action="${escapeHtmlWorkflow(action)}">
        <strong>${escapeHtmlWorkflow(name)}</strong>
        <span>${escapeHtmlWorkflow(desc)}</span>
      </button>
    `).join('');
  }

  function renderPhaseOnePreflight(ctx) {
    const scenario = ctx.scenario;
    return `
      <div class="phase-one-detail phase-one-preflight">
        <div class="phase-brief-card">
          <span class="workflow-kicker is-hot">Preflight / ${escapeHtmlWorkflow(scenario.label)}</span>
          <h3>${escapeHtmlWorkflow(scenario.label)}</h3>
          <p>${escapeHtmlWorkflow(scenario.summary)}</p>
          <div class="phase-label-flow">
            <span>采取 action</span>
            <strong>${ctx.scenarioKey === 'metaMigration' ? 'Meta imported' : 'Bulk imported'}</strong>
            <span>投中可快速筛选盯盘</span>
          </div>
        </div>
        <div class="phase-action-panel">
          <div class="workflow-section-label">Actions</div>
          <div class="phase-action-grid">
            ${renderPhaseOneActionButtons(scenario.actions || [])}
          </div>
          <button type="button" class="phase-more-tools-btn" data-role="phase-more-tools">More tools</button>
        </div>
      </div>`;
  }

  function renderPhaseOneAnomaly() {
    const rejectedCount = filters.phase1Rejected().length;
    const insufficientCount = filters.phase1Insufficient().length;
    return `
      <div class="phase-one-detail phase-one-anomaly">
        <div class="phase-brief-card">
          <span class="workflow-kicker is-critical">Midflight / 异常监控</span>
          <h3>异常监控</h3>
          <p>Summary: ${rejectedCount} 个 campaign 审核阻断，${insufficientCount} 个 campaign 花费不足，建议先筛选定位再批量处理。</p>
        </div>
        <div class="phase-issue-panel">
          <div class="workflow-section-label">异常 campaign</div>
          <button type="button" class="phase-issue-card is-danger ${currentPreset === 'phase1Rejected' ? 'is-selected' : ''}" data-phase-issue="phase1Rejected">
            <div><strong>3 ad group rejected</strong><span>筛选 3 个 status = rejected 的 campaign</span></div>
            <span class="phase-issue-count">3</span>
            <span class="phase-nested-action" data-phase-action="submitReviewTicket">一键提交复审工单</span>
          </button>
          <button type="button" class="phase-issue-card is-warning ${currentPreset === 'phase1Insufficient' ? 'is-selected' : ''}" data-phase-issue="phase1Insufficient">
            <div><strong>Insufficient spending</strong><span>筛选 5 个花费不足的 campaign</span></div>
            <span class="phase-issue-count">5</span>
            <span class="phase-nested-action" data-phase-action="bulkEditBid">bulk edit bid</span>
          </button>
          <button type="button" class="phase-more-tools-btn" data-role="phase-more-tools">More tools</button>
        </div>
      </div>`;
  }

  function renderMetaImportedReport() {
    const rows = filters.phase1MetaImported();
    const creatives = rows.flatMap(r => r.ads || []).slice(0, 3);
    const audiences = [
      ['精致妈妈', 22], ['潮流 GenZ', 18], ['价格敏感', 14], ['都市白领', 13],
      ['科技尝鲜', 11], ['品质生活', 9], ['内容种草', 8], ['高净值', 5],
    ];
    return `
      <div class="phase-report-grid">
        <div class="phase-report-card">
          <div class="phase-report-head"><span>Media Metrics</span><strong>+12.8%</strong></div>
          <div class="phase-metric-row"><span>Spend</span><strong>$18.4K</strong><em class="up">+9%</em></div>
          <div class="phase-metric-row"><span>CTR</span><strong>2.87%</strong><em class="up">+0.4pt</em></div>
          <div class="phase-metric-row"><span>CPA</span><strong>$7.42</strong><em class="down">-11%</em></div>
          <div class="phase-bars"><span style="width:72%"></span><span style="width:58%"></span><span style="width:84%"></span></div>
        </div>
        <div class="phase-report-card">
          <div class="phase-report-head"><span>素材</span><strong>Top 3</strong></div>
          <div class="phase-creative-strip">
            ${creatives.map(ad => `
              <div class="phase-creative-card">
                ${renderCreativeThumb(ad.creative, 'lg')}
                <span>CTR ${(ad.ctr || rand(1.8, 4.6)).toFixed(2)}%</span>
                <span>Eng. ${(ad.videoMetrics?.hookRate || rand(24, 52)).toFixed(1)}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="phase-report-card">
          <div class="phase-report-head"><span>人群</span><strong>F 58% / M 42%</strong></div>
          <div class="phase-gender-split"><span style="width:58%">Female 58%</span><em>Male 42%</em></div>
          <div class="phase-audience-list">
            ${audiences.map(([name, pct]) => `<div><span>${name}</span><strong style="width:${pct * 3}%"></strong><em>${pct}%</em></div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderCreativeTestingReportShell() {
    return `
      <div class="ai-summary-grid ai-summary-grid--ct phase-ct-report">
        <div class="ai-card ct-funnel-card">
          <div class="ai-card-title">Creative test funnel</div>
          <div data-role="ct-funnel"></div>
        </div>
        <div class="ai-card ct-kpi-card">
          <div class="ai-card-title">Winner velocity</div>
          <div class="ai-big-number" data-role="ct-velocity">—</div>
          <svg class="ai-spark" data-role="ct-velocity-spark" viewBox="0 0 120 32" preserveAspectRatio="none"></svg>
          <p class="ai-card-desc" data-role="ct-lift-desc">—</p>
        </div>
        <div class="ai-card ct-list-card">
          <div class="ai-card-title">Creative testing campaigns</div>
          <div class="ct-test-list" data-role="ct-test-list"></div>
        </div>
      </div>`;
  }

  function renderPhaseOneDailyReport() {
    const report = PHASE_ONE_REPORT_PRESETS.has(currentPreset) ? currentPreset : currentPhaseOneReport;
    const reportBody = report === 'phase1CreativeTesting'
      ? renderCreativeTestingReportShell()
      : renderMetaImportedReport();
    return `
      <div class="phase-one-report">
        <div class="phase-report-filter-row">
          <button type="button" class="phase-report-filter ${report === 'phase1MetaImported' ? 'is-selected' : ''}" data-phase-report="phase1MetaImported">
            <strong>Meta Imported Campaign</strong><span>${filters.phase1MetaImported().length} campaigns</span>
          </button>
          <button type="button" class="phase-report-filter ${report === 'phase1CreativeTesting' ? 'is-selected' : ''}" data-phase-report="phase1CreativeTesting">
            <strong>Creative Testing Campaign</strong><span>${filters.phase1CreativeTesting().length} campaigns</span>
          </button>
          <button type="button" class="phase-custom-btn">自定义选择 campaign</button>
        </div>
        ${reportBody}
        <div class="phase-report-tools-row">
          <button type="button" class="phase-more-tools-btn" data-role="phase-more-tools">More tools</button>
        </div>
      </div>`;
  }

  function renderPhaseOneSummary(el) {
    const ctx = getPhaseOneContext();
    if (!ctx || !ctx.scenario) return false;
    el.style.display = '';
    el.classList.remove('is-loading');
    el.classList.add('workflow-linked-panel', 'phase-one-panel');
    el.dataset.workflow = ctx.workflowKey;
    if (!aiSummaryCollapsed) syncWorkflowLinkState(ctx.workflowKey);
    const body = ctx.scenarioKey === 'dailyReport'
      ? renderPhaseOneDailyReport()
      : ctx.scenarioKey === 'anomalyMonitor'
        ? renderPhaseOneAnomaly()
        : renderPhaseOnePreflight(ctx);
    el.innerHTML = `
      <button type="button" class="phase-collapse-btn" data-role="phase-collapse" aria-label="收起">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>
      </button>
      ${body}`;
    if (ctx.scenarioKey === 'dailyReport' && currentPhaseOneReport === 'phase1CreativeTesting') {
      renderCreativeTestSummary(el);
    }
    if (aiSummaryCollapsed) {
      el.style.display = 'none';
      el.classList.add('is-collapsed');
      syncWorkflowLinkState(null);
    } else {
      el.classList.remove('is-collapsed');
    }
    return true;
  }

  function renderWorkflowStrategyMap(el) {
    const wf = WORKFLOW_EXPERIENCE[currentPreset];
    const strategies = WORKFLOW_STRATEGY_LIBRARY[currentPreset] || [];
    if (!wf || !strategies.length) return false;
    el.style.display = '';
    el.classList.remove('is-loading');
    el.classList.add('workflow-linked-panel');
    el.dataset.workflow = currentPreset;
    if (!aiSummaryCollapsed) syncWorkflowLinkState(currentPreset);
    el.innerHTML = `
      <div class="ai-summary-head" data-role="ai-summary-toggle">
        <div class="ai-summary-left-wrap">
          <span class="ai-summary-toggle-icon" data-role="ai-summary-toggle-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
          <div class="ai-summary-title-wrap">
            <span class="ai-summary-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/></svg>
            </span>
            <div class="ai-summary-text-wrap">
              <div class="ai-summary-title" data-role="ai-title">${escapeHtmlWorkflow(wf.label)} · All strategies</div>
              <div class="ai-summary-desc" data-role="ai-desc">${escapeHtmlWorkflow(wf.phase)} · ${strategies.length} 个可用策略，Suggested focus 只是当前优先项</div>
            </div>
          </div>
        </div>
      </div>
      <div class="workflow-map">
        <div class="workflow-map-head">
          <div>
            <h3 class="workflow-map-title">${escapeHtmlWorkflow(wf.label)} strategy map</h3>
            <p class="workflow-map-desc">这里展示该板块覆盖的全量策略。点击任一策略进入问题说明、行动建议和 Toolkit。</p>
          </div>
          <span class="workflow-kicker">${escapeHtmlWorkflow(wf.phase)}</span>
        </div>
        <div class="workflow-map-grid">
          ${strategies.map(item => `
            <button type="button" class="workflow-strategy-card ${item.key === currentScenario ? 'is-current' : ''}" data-strategy-key="${escapeHtmlWorkflow(item.key)}">
              <strong>${escapeHtmlWorkflow(item.label)}</strong>
              <p>${escapeHtmlWorkflow(item.job)}</p>
              <span class="workflow-strategy-meta">${escapeHtmlWorkflow(item.signal)}</span>
            </button>
          `).join('')}
        </div>
      </div>`;
    if (aiSummaryCollapsed) {
      el.style.display = 'none';
      el.classList.add('is-collapsed');
      syncWorkflowLinkState(null);
    } else {
      el.classList.remove('is-collapsed');
    }
    return true;
  }

  function renderWorkflowSummary(el) {
    const ctx = getWorkflowScenario();
    if (!ctx) return false;
    if (currentWorkflowView === 'strategyMap' && renderWorkflowStrategyMap(el)) return true;
    const { workflow, key, scenario } = ctx;
    const severityClass = scenario.severity === 'critical' ? 'is-critical' : scenario.severity === 'hot' ? 'is-hot' : '';
    const toolkitTools = getWorkflowToolkitTools(key);
    const keySignals = (scenario.evidence || []).slice(0, 2);
    const recommendedActions = (scenario.tools || []).slice(0, 2);
    el.style.display = '';
    el.classList.remove('is-loading');
    el.classList.add('workflow-linked-panel');
    el.dataset.workflow = currentPreset;
    if (!aiSummaryCollapsed) syncWorkflowLinkState(currentPreset);
    el.innerHTML = `
      <div class="ai-summary-head" data-role="ai-summary-toggle">
        <div class="ai-summary-left-wrap">
          <span class="ai-summary-toggle-icon" data-role="ai-summary-toggle-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
          <div class="ai-summary-title-wrap">
            <span class="ai-summary-badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/></svg>
            </span>
            <div class="ai-summary-text-wrap">
              <div class="ai-summary-title" data-role="ai-title">${escapeHtmlWorkflow(workflow.label)} · ${escapeHtmlWorkflow(scenario.label)}</div>
              <div class="ai-summary-desc" data-role="ai-desc">${escapeHtmlWorkflow(workflow.phase)} · ${escapeHtmlWorkflow(scenario.label)}: ${escapeHtmlWorkflow(scenario.short)}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="workflow-detail workflow-detail--compact">
        <div class="workflow-compact-col workflow-compact-lead">
          <span class="workflow-kicker ${severityClass}">${escapeHtmlWorkflow(workflow.phase)} / ${escapeHtmlWorkflow(scenario.label)}</span>
          <h3>${escapeHtmlWorkflow(scenario.label)}</h3>
          <p class="workflow-detail-desc">${escapeHtmlWorkflow(scenario.short)}</p>
        </div>
        <div class="workflow-compact-col">
          <div class="workflow-section-label">Key signals</div>
          <div class="workflow-evidence-grid">
            ${keySignals.map(([value, label]) => `<div class="workflow-evidence"><strong>${escapeHtmlWorkflow(value)}</strong><span>${escapeHtmlWorkflow(label)}</span></div>`).join('')}
          </div>
        </div>
        <div class="workflow-compact-col">
          <div class="workflow-section-label">Actions</div>
          <div class="workflow-action-list">
            ${recommendedActions.map(([name, impact]) => `<div class="workflow-action" title="${escapeHtmlWorkflow(impact)}"><span>${escapeHtmlWorkflow(name)}</span></div>`).join('')}
          </div>
          ${toolkitTools.length ? `
            <details class="workflow-toolkit workflow-toolkit-more" data-role="workflow-embedded-toolkit">
              <summary>More tools</summary>
              <div class="workflow-tool-list workflow-tool-list--more">
                ${toolkitTools.map(renderWorkflowToolButton).join('')}
              </div>
              <button type="button" class="workflow-toolkit-open" data-role="workflow-more-tools">Open full toolkit</button>
            </details>
          ` : ''}
        </div>
      </div>`;
    if (aiSummaryCollapsed) {
      el.style.display = 'none';
      el.classList.add('is-collapsed');
      syncWorkflowLinkState(null);
    } else {
      el.classList.remove('is-collapsed');
    }
    return true;
  }

  function updateAISummary() {
    const el = document.querySelector('[data-role="ai-summary"]');
    if (!el) return;
    if (getPhaseOneContext() && renderPhaseOneSummary(el)) return;
    if (WORKFLOW_EXPERIENCE[currentPreset] && renderWorkflowSummary(el)) return;

    const SUMMARY_PRESETS = ['blackfriday', 'metaimported', 'aigc', 'creativetest', 'prelaunch', 'active', 'review'];
    if (!SUMMARY_PRESETS.includes(currentPreset)) {
      el.style.display = 'none';
      el.classList.remove('is-loading', 'is-collapsed');
      if (aiLoadTimer) { clearTimeout(aiLoadTimer); aiLoadTimer = 0; }
      return;
    }

    // 从隐藏 → 显示：重新播放入场动画 + 进入加载态
    const wasHidden = el.style.display === 'none' || !el.style.display;
    el.style.display = '';
    // 切换折叠/展开类（箭头旋转完全由 CSS 控制）
    if (aiSummaryCollapsed) el.classList.add('is-collapsed');
    else el.classList.remove('is-collapsed');
    if (wasHidden) {
      // 重置入场动画
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
      // 进入 shimmer 加载态
      el.classList.add('is-loading');
      if (aiLoadTimer) clearTimeout(aiLoadTimer);
      aiLoadTimer = setTimeout(() => {
        el.classList.remove('is-loading');
        aiLoadTimer = 0;
      }, 520);
    }

    // 通用聚合：根据当前 preset 取对应 rows
    const rows = filters[currentPreset]();
    const totalImp = rows.reduce((s, r) => s + (r.impressions || 0), 0);
    const totalConv = rows.reduce((s, r) => s + (r.conversions || 0), 0);
    const totalClicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
    const avgCtr = rows.length
      ? rows.reduce((s, r) => s + (r.ctr || 0), 0) / rows.length
      : 0;

    // 标题 + 描述：根据 preset 切换文案
    const titleEl = el.querySelector('[data-role="ai-title"]');
    const descEl = el.querySelector('[data-role="ai-desc"]');
    if (currentPreset === 'metaimported') {
      const newCount = rows.filter(r => r.isNew).length;
      if (titleEl) titleEl.textContent = 'Meta imported campaigns';
      if (descEl) {
        descEl.textContent =
          `${rows.length} campaigns just imported from Meta${newCount ? `（${newCount} 新）` : ''}. Average Click-Through Rate ${avgCtr.toFixed(2)}%. Review imported assets and finalize creative adaptation before publishing.`;
      }
    } else if (currentPreset === 'aigc') {
      if (titleEl) titleEl.textContent = 'AIGC creative performance';
      if (descEl) {
        // 顶部描述使用 video uplift 数据
        const stats = computeAigcStats();
        descEl.textContent =
          `${rows.length} campaigns running AIGC creatives. AIGC video VTR ${stats.aigcVtr.toFixed(1)}% vs ${stats.nonAigcVtr.toFixed(1)}% on non-AIGC (${stats.uplift >= 0 ? '+' : ''}${stats.uplift.toFixed(0)}%). Hook rate ${stats.aigcHook.toFixed(1)}% vs ${stats.nonAigcHook.toFixed(1)}%.`;
      }
    } else if (currentPreset === 'creativetest') {
      const ctStats = computeCreativeTestStats();
      if (titleEl) titleEl.textContent = 'Creative testing dashboard';
      if (descEl) {
        descEl.textContent =
          `${ctStats.testing} test${ctStats.testing > 1 ? 's' : ''} running, ${ctStats.winners} winner${ctStats.winners !== 1 ? 's' : ''} declared, ${ctStats.pending} queued. Average winner CTR uplift ${ctStats.avgLift >= 0 ? '+' : ''}${ctStats.avgLift.toFixed(1)}% vs control. Lock in winners and retire under-performers.`;
      }
    } else {
      if (titleEl) titleEl.textContent = 'Black Friday Promotions';
      if (descEl) {
        descEl.textContent =
          `${rows.length} campaigns promoting Black Friday deals. Main goal is conversions (average Click-Through Rate ${avgCtr.toFixed(2)}%).`;
      }
    }

    // 切换主 grid / AIGC grid / Creative testing grid 显示
    const mainGrid = el.querySelector('.ai-summary-grid:not(.ai-summary-grid--aigc):not(.ai-summary-grid--ct)');
    const aigcGrid = el.querySelector('[data-role="ai-aigc-grid"]');
    const ctGrid = el.querySelector('[data-role="ai-ct-grid"]');
    if (currentPreset === 'aigc') {
      if (mainGrid) mainGrid.style.display = 'none';
      if (aigcGrid) aigcGrid.style.display = '';
      if (ctGrid) ctGrid.style.display = 'none';
      renderAigcSummary(el);
      return;
    } else if (currentPreset === 'creativetest') {
      if (mainGrid) mainGrid.style.display = 'none';
      if (aigcGrid) aigcGrid.style.display = 'none';
      if (ctGrid) ctGrid.style.display = '';
      renderCreativeTestSummary(el);
      return;
    } else {
      if (mainGrid) mainGrid.style.display = '';
      if (aigcGrid) aigcGrid.style.display = 'none';
      if (ctGrid) ctGrid.style.display = 'none';
    }

    // Impressions 汇总
    const impValEl = el.querySelector('[data-role="ai-imp-value"]');
    if (impValEl) impValEl.textContent = fmtInt(totalImp);

    // Conversions 汇总（与预设卡上的 Conv 数值对齐）
    const convValEl = el.querySelector('[data-role="ai-conv-value"]');
    if (convValEl) convValEl.textContent = fmtInt(totalConv);

    // 趋势图：与预设卡保持同指标同数据同曲线
    const impSpark = el.querySelector('[data-role="ai-imp-delta"] .ai-spark');
    const convSpark = el.querySelector('[data-role="ai-conv-delta"] .ai-spark');
    if (impSpark && rows.length) {
      renderSparkline(impSpark, rows.map(r => r.impressions));
    }
    if (convSpark && rows.length) {
      renderSparkline(convSpark, rows.map(r => r.conversions));
    }

    // Metric desc 文案：根据 preset 切换
    const impDescEl = el.querySelector('[data-role="ai-imp-desc"]');
    const convDescEl = el.querySelector('[data-role="ai-conv-desc"]');
    const convAdEl = el.querySelector('[data-role="ai-conv-ad"]');
    if (currentPreset === 'metaimported') {
      if (impDescEl) {
        impDescEl.textContent = 'Imported campaigns are still in draft state — impressions reflect Meta-side历史数据。Publish on TikTok to start fresh tracking.';
      }
      // 选 CTR 最高的 imported campaign 作为高亮
      const topImported = rows.slice().sort((a, b) => b.ctr - a.ctr)[0];
      if (convAdEl && topImported) {
        convAdEl.textContent = `${topImported.name}.`;
      }
      if (convDescEl) {
        convDescEl.innerHTML =
          `Conversions in this batch are led by <a class="ai-metric-link" href="#" data-role="ai-conv-ad">${topImported ? topImported.name : '—'}.</a> Adapt creatives to 9:16 and Smart+ for the highest carry-over.`;
      }
    } else {
      if (impDescEl) {
        impDescEl.textContent = 'Impressions on Black Friday campaigns are pacing within expectation. Continue monitoring daily volume through the promo window.';
      }
      const topCampaign = rows.slice().sort((a, b) => b.ctr - a.ctr)[0];
      if (convAdEl && topCampaign) {
        convAdEl.textContent = `${topCampaign.name}.`;
      }
      if (convDescEl) {
        convDescEl.innerHTML =
          `Conversions are trending up on promo-heavy ads such as <a class="ai-metric-link" href="#" data-role="ai-conv-ad">${(rows.slice().sort((a, b) => b.ctr - a.ctr)[0] || {}).name || 'BF_Flash_30s_v2'}.</a> Consider shifting more budget toward top converters this week.`;
      }
    }

    // Top 创意：从当前 preset 下所有 ad 按 CTR 排序
    const topEl = el.querySelector('[data-role="ai-top-creatives"]');
    const bestProductsEl = el.querySelector('[data-role="ai-best-products"]');
    if (topEl) {
      const allAds = [];
      rows.forEach(c => {
        (c.ads || []).forEach(ad => { if (ad.creative) allAds.push(ad); });
      });
      allAds.sort((a, b) => b.ctr - a.ctr);

      // 按创意去重后取 Top 3；若不够则用创意池补齐
      const uniqByCreative = (list) => {
        const seen = new Set();
        const out = [];
        list.forEach(ad => {
          if (ad.creative && !seen.has(ad.creative.id)) {
            seen.add(ad.creative.id);
            out.push(ad);
          }
        });
        return out;
      };
      const topAds = uniqByCreative(allAds).slice(0, 3);

      const pickCreatives = (ads) => {
        let pool = ads.map(a => a.creative);
        if (pool.length < 3) {
          // 不够时从 CREATIVE_POOL 克隆补齐，并分配独立 photoId 保证封面不撞图
          const extra = CREATIVE_POOL
            .filter(c => !pool.some(p => p.id === c.id || p.name === c.name))
            .map(base => ({
              ...base,
              id: `${base.id}__ai_${Math.random().toString(36).slice(2, 5)}`,
              photoId: pickUniquePhotoId(base.scene || 'product'),
            }));
          pool = pool.concat(extra).slice(0, 3);
        }
        return pool.slice(0, 3);
      };

      const top3 = pickCreatives(topAds);
      topEl.innerHTML = top3.map(cr => `
        <div class="ai-thumb-cell" title="${cr.name}">
          ${renderCreativeThumb(cr, 'lg')}
        </div>
      `).join('');
    }

    // Best performing products：按模拟 GMV 取前 3（与创意无关，展示商品封面）
    if (bestProductsEl) {
      const ranked = PRODUCT_POOL
        .map(enrichProductMetrics)
        .slice()
        .sort((a, b) => b._gmv - a._gmv)
        .slice(0, 3);
      bestProductsEl.innerHTML = ranked.map(p => `
        <div class="ai-thumb-cell ai-product-cell" title="${p.name} · ${p.category}">
          ${renderProductThumb(p)}
        </div>
      `).join('');
    }
  }

  // 商品封面渲染：纯图片 + 角标价格
  function renderProductThumb(p) {
    if (!p) return '';
    const url = photoUrl(p, 480);
    return `
      <span class="cv-thumb cv-thumb-lg is-product" title="${p.name}" style="background: #f3f4f6;">
        <img class="cv-thumb-img" src="${url}" alt="${p.name}" loading="lazy" decoding="async"
             referrerpolicy="no-referrer"
             onerror="this.style.display='none'"/>
        <span class="cv-product-badge">$${p.price.toFixed(2)}</span>
      </span>
    `;
  }

  // ============== 列宽同步 & 拖动调整 ==============
  // 10 列：check / switch / name / status / label / cost / impr / cpm / clicks / ctr
  // 初始像素宽度；通过共享 colgroup 对齐 head / body / footer
  const columnWidths = [44, 80, 260, 200, 140, 120, 140, 110, 160, 130];
  const COL_MIN = 56;
  const COL_MIN_CHECK = 36;

  function applyColumnWidths() {
    const groups = document.querySelectorAll(
      '[data-role="colgroup-head"], [data-role="colgroup-body"], [data-role="colgroup-footer"]'
    );
    groups.forEach(group => {
      const cols = group.querySelectorAll('col');
      cols.forEach((col, i) => {
        if (columnWidths[i] != null) col.style.width = columnWidths[i] + 'px';
      });
    });
  }

  function initColumnResize() {
    const handles = document.querySelectorAll('.col-resize');
    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(handle.getAttribute('data-col-idx'), 10);
        if (isNaN(idx)) return;
        const startX = e.clientX;
        const startW = columnWidths[idx];
        const minW = idx === 0 ? COL_MIN_CHECK : COL_MIN;
        handle.classList.add('dragging');
        document.body.classList.add('col-resizing');

        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          const next = Math.max(minW, startW + dx);
          columnWidths[idx] = next;
          applyColumnWidths();
        };
        const onUp = () => {
          handle.classList.remove('dragging');
          document.body.classList.remove('col-resizing');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }

  // ============== 表格横向滚动同步 ==============
  // split-table 架构下 head / body / footer 是 3 个独立滚动容器，横向滚动时需同步 scrollLeft
  // 以 body 为主滚动源，head / footer 跟随；同时 head / footer 的滚动（触控板横滑）也能反向驱动 body
  function initHorizontalScrollSync() {
    const headWrap = document.querySelector('[data-role="table-head-wrap"]');
    const bodyWrap = document.querySelector('[data-role="table-body-wrap"]');
    const footerWrap = document.querySelector('[data-role="table-footer-wrap"]');
    const wraps = [headWrap, bodyWrap, footerWrap].filter(Boolean);
    if (wraps.length < 2) return;
    let syncing = false;
    wraps.forEach(src => {
      src.addEventListener('scroll', () => {
        if (syncing) return;
        syncing = true;
        const left = src.scrollLeft;
        wraps.forEach(dst => {
          if (dst !== src && dst.scrollLeft !== left) dst.scrollLeft = left;
        });
        // 下一帧解锁，避免 scroll 事件风暴
        requestAnimationFrame(() => { syncing = false; });
      }, { passive: true });
    });
  }

  // AI Summary 折叠/展开点击事件（事件委托到 document）
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-role="ai-summary-toggle"]');
    if (!toggle) return;
    setWorkflowPanelCollapsed(!aiSummaryCollapsed);
    updateAISummary();
  });

  document.addEventListener('click', (e) => {
    const collapse = e.target.closest('[data-role="phase-collapse"]');
    if (!collapse) return;
    setWorkflowPanelCollapsed(true);
    updateAISummary();
  });

  // ============== 预设行溢出：动态 X more + 第二行展开 ==============
  // 思路：使用一个离屏测量容器来算出每个 preset 的自然宽度；
  // 从左到右累加，一旦某个 preset 的右边界 + moreBtn 宽度 + add 按钮宽度 超过行宽，
  // 则从该 preset 起全部隐藏，并显示 "+N more"。
  // 用户点击 more 按钮后切换 .is-expanded 类，preset-row 变为 flex-wrap: wrap，
  // 隐藏的 preset 重新显示并自动折回第二行。
  function initPresetOverflow() {
    const row = document.querySelector('.preset-row');
    if (!row) return;
    const moreWrap = row.querySelector('[data-role="preset-more-wrap"]');
    const moreBtn = row.querySelector('[data-role="preset-more-btn"]');
    const moreCount = row.querySelector('[data-role="preset-more-count"]');
    const moreLabel = row.querySelector('[data-role="preset-more-label"]');
    const popover = row.querySelector('[data-role="preset-more-popover"]');
    const addBtn = row.querySelector('.preset.add');
    if (!moreWrap || !moreBtn || !moreCount) return;
    // popover 不再使用，强制隐藏
    if (popover) { popover.hidden = true; popover.innerHTML = ''; }

    // 需要参与溢出计算的"主"预设卡（排除 more 包裹器、add 按钮、隐藏的卡）
    const getPresets = () => Array.from(row.querySelectorAll('.preset[data-preset]'))
      .filter(p => !p.hidden);

    function recalc() {
      const presets = getPresets();
      // 先全部还原显示
      presets.forEach(p => p.classList.remove('preset--overflowed'));
      moreWrap.hidden = true;

      // 展开模式下不裁剪，所有卡片都显示
      if (row.classList.contains('is-expanded')) {
        // 但我们仍需要知道有多少 "溢出" 的卡片，才能在 more 按钮上显示数量
        // 通过临时折叠测量
        row.classList.remove('is-expanded');
        const overflowCount = measureOverflowCount(presets);
        row.classList.add('is-expanded');
        if (overflowCount > 0) {
          moreCount.textContent = `+${overflowCount}`;
          if (moreLabel) moreLabel.textContent = 'less';
          moreWrap.hidden = false;
        }
        return;
      }

      const overflow = computeOverflow(presets);
      if (overflow.length === 0) return;

      // 标记溢出卡片
      overflow.forEach(p => p.classList.add('preset--overflowed'));
      moreCount.textContent = `+${overflow.length}`;
      if (moreLabel) moreLabel.textContent = 'more';
      moreWrap.hidden = false;
    }

    function measureOverflowCount(presets) {
      return computeOverflow(presets).length;
    }

    function computeOverflow(presets) {
      // 行的可用内宽
      const rowStyle = getComputedStyle(row);
      const padL = parseFloat(rowStyle.paddingLeft) || 0;
      const padR = parseFloat(rowStyle.paddingRight) || 0;
      const rowInner = row.clientWidth - padL - padR;
      if (rowInner <= 0) return [];

      const gap = parseFloat(rowStyle.gap) || parseFloat(rowStyle.columnGap) || 6;
      const addW = addBtn ? (addBtn.offsetWidth + gap) : 0;

      // 预估 more 按钮宽度
      const wasHidden = moreWrap.hidden;
      moreWrap.hidden = false;
      const moreW = moreWrap.offsetWidth + gap;
      moreWrap.hidden = wasHidden;

      let used = 0;
      let overflow = [];
      for (let i = 0; i < presets.length; i++) {
        const p = presets[i];
        const w = p.offsetWidth + (i === 0 ? 0 : gap);
        const remainingPresets = presets.length - i - 1;
        if (remainingPresets === 0 && used + w + addW <= rowInner) {
          used += w;
          continue;
        }
        if (used + w + moreW + addW <= rowInner) {
          used += w;
        } else {
          overflow = presets.slice(i);
          break;
        }
      }
      return overflow;
    }

    function toggleExpanded() {
      row.classList.toggle('is-expanded');
      moreBtn.classList.toggle('is-open', row.classList.contains('is-expanded'));
      recalc();
    }

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExpanded();
    });

    // Esc 收起
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && row.classList.contains('is-expanded')) {
        row.classList.remove('is-expanded');
        moreBtn.classList.remove('is-open');
        recalc();
      }
    });

    // 监听行宽变化，节流 rAF
    let rafId = 0;
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        recalc();
      });
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(schedule);
      ro.observe(row);
    } else {
      window.addEventListener('resize', schedule);
    }

    // 首次计算（等待下一帧，确保布局已完成）
    requestAnimationFrame(recalc);
  }

  // ============== 初始化 ==============
  applyColumnWidths();
  initColumnResize();
  initHorizontalScrollSync();
  updatePresetCards();
  // ============== Import from Meta — Drawer Flow ==============
  const drawerRoot = document.querySelector('[data-role="drawer-root"]');

  // Mock Meta data
  const META_ACCOUNTS = [
    { id: 'act_1001', name: 'Brand Global - Apparel', biz: 'Brand Global Inc.', currency: 'USD', spend: '$148,290.21', campaigns: 38 },
    { id: 'act_1002', name: 'APAC Mobile Apps',       biz: 'AppX Studio',       currency: 'USD', spend: '$72,510.50',  campaigns: 22 },
    { id: 'act_1003', name: 'EU Retail - Holiday',    biz: 'Retail Holdings',   currency: 'EUR', spend: '€96,330.00',  campaigns: 17 },
    { id: 'act_1004', name: 'D2C Beauty Lab',         biz: 'Beauty Lab Co.',    currency: 'USD', spend: '$33,480.00',  campaigns: 12 },
  ];
  const META_CAMPAIGNS = [
    {
      id: 'cmp_m_001', name: 'Meta - Black Friday Mega', objective: 'Conversions', status: 'active',
      adsets: 4, ads: 12, budget: '$1,200/day', spend: '$48,210', cpa: '$12.40', roas: '4.8x', ctr: '2.1%',
      creativeIds: ['cv_m_01', 'cv_m_03', 'cv_m_05'],
      catalogIds:  ['cat_m_01'],
    },
    {
      id: 'cmp_m_002', name: 'Meta - Holiday Catalog Sales', objective: 'Catalog Sales', status: 'active',
      adsets: 3, ads: 9,  budget: '$800/day',   spend: '$22,860', cpa: '$9.80',  roas: '5.6x', ctr: '1.8%',
      creativeIds: ['cv_m_02', 'cv_m_03'],
      catalogIds:  ['cat_m_01', 'cat_m_03'],
    },
    {
      id: 'cmp_m_003', name: 'Meta - Lookalike US Tier1', objective: 'Traffic', status: 'active',
      adsets: 2, ads: 6,  budget: '$500/day',   spend: '$11,420', cpa: '$6.20',  roas: '3.2x', ctr: '2.4%',
      creativeIds: ['cv_m_05'],
      catalogIds:  [],
    },
    {
      id: 'cmp_m_004', name: 'Meta - App Install iOS',   objective: 'App Promotion', status: 'paused',
      adsets: 2, ads: 4,  budget: '$300/day',   spend: '$7,330',  cpa: '$3.60',  roas: '—',    ctr: '1.5%',
      creativeIds: ['cv_m_01'],
      catalogIds:  ['cat_m_02'],
    },
    {
      id: 'cmp_m_005', name: 'Meta - Retargeting 30D',   objective: 'Conversions', status: 'active',
      adsets: 3, ads: 8,  budget: '$650/day',   spend: '$16,910', cpa: '$8.10',  roas: '6.1x', ctr: '2.7%',
      creativeIds: ['cv_m_02', 'cv_m_04'],
      catalogIds:  ['cat_m_03'],
    },
    {
      id: 'cmp_m_006', name: 'Meta - Brand Awareness EU', objective: 'Awareness', status: 'active',
      adsets: 2, ads: 5,  budget: '$420/day',   spend: '$9,540',  cpa: '$14.20', roas: '2.4x', ctr: '1.2%',
      creativeIds: ['cv_m_04'],
      catalogIds:  [],
    },
  ];
  const META_CREATIVES = [
    { id: 'cv_m_01', name: 'Holiday Hero Video 9:16', type: 'Video',    size: '1080×1920', dur: '00:18',  photoId: '1483985988355-763728e1935b' },
    { id: 'cv_m_02', name: 'Carousel - Best Sellers', type: 'Carousel', size: '1080×1080', dur: '5 cards', photoId: '1542291026-7eec264c27ff' },
    { id: 'cv_m_03', name: 'Static - Doorbusters',    type: 'Image',    size: '1080×1080', dur: '—',      photoId: '1556909114-f6e7ad7d3136' },
    { id: 'cv_m_04', name: 'Story Ad - Beauty Reveal',type: 'Story',    size: '1080×1920', dur: '00:12',  photoId: '1586495777744-4413f21062fa' },
    { id: 'cv_m_05', name: 'Reels Ad - Fashion Drop', type: 'Reels',    size: '1080×1920', dur: '00:15',  photoId: '1490481651871-ab68de25d43d' },
  ];
  const META_CATALOGS = [
    { id: 'cat_m_01', name: 'Apparel Master Catalog', items: 4218, source: 'Shopify Feed', status: 'active', photoId: '1441986300917-64674bd600d8' },
    { id: 'cat_m_02', name: 'Electronics SKU Set',    items: 1156, source: 'CSV Upload',   status: 'active', photoId: '1498049794561-7780e7231661' },
    { id: 'cat_m_03', name: 'Beauty Holiday Catalog', items: 832,  source: 'Shopify Feed', status: 'paused', photoId: '1571781926291-c477ebfd024b' },
  ];

  // 当前广告主已有的 TikTok Pixels（用于 Required checks 中 dropdown）
  const TT_PIXELS = [
    { id: 'pix_main_brand',     name: 'Main Brand Pixel',         status: 'Active · 30d',  events: 'Purchase, AddToCart, ViewContent' },
    { id: 'pix_holiday_2024',   name: 'Holiday 2024 Pixel',       status: 'Active · 7d',   events: 'Purchase, InitiateCheckout' },
    { id: 'pix_app_install',    name: 'App Install Pixel',        status: 'Active · 14d',  events: 'CompleteRegistration, AppInstall' },
    { id: 'pix_legacy_2023',    name: 'Legacy 2023 Pixel',        status: 'Idle · 60d',    events: 'Purchase' },
  ];

  // 当前广告主已有的 TikTok Identities（含头像 + 名称 + 类型）
  const TT_IDENTITIES = [
    { id: 'idt_brand_official', name: '@brand_official',  type: 'TikTok account',    avatar: '1494790108377-be9c29b29330' },
    { id: 'idt_brand_studio',   name: 'Brand Studio',     type: 'Custom identity',   avatar: '1535713875002-d1d0cf377fde' },
    { id: 'idt_creator_jane',   name: 'Jane · Creator',   type: 'Spark Ads (auth.)', avatar: '1438761681033-6461ffad8d80' },
    { id: 'idt_creator_alex',   name: 'Alex · Creator',   type: 'Spark Ads (auth.)', avatar: '1500648767791-00dcc994a43e' },
    { id: 'idt_brand_jp',       name: 'Brand Japan',      type: 'Custom identity',   avatar: '1531123897727-8f129e1688ce' },
  ];

  // Adaptation toolkit catalog —— 横铺分类：Settings / Creative / Audience / Product / Pixel
  const ADAPT_TOOLKIT = [
    {
      group: 'Proposed',
      icon: 'recommended',
      isRecommended: true,
      // 跨分类挑 4 个最高 impact 的工具作为"今天先做这几件最划算的事"。
      // 使用 id 直接引用底层 ADAPT_TOOLKIT 工具，避免重复维护文案 / impact / issue 模板。
      recommendIds: ['t_boost_winners', 't_refresh_fatigue', 't_exclude_buyers', 't_event_match'],
      tools: [],
    },
    {
      group: 'Quick edits',
      icon: 'settings',
      // 老的三个"操作捷径"保留在 Quick edits 分组，仍是 singleAction（不参与 issue 确认）。
      tools: [
        { id: 't_addcreative',  name: 'Add creative',    desc: 'Append additional video / image creatives to selected campaigns in bulk.', singleAction: 'add-creative' },
        { id: 't_copysettings', name: 'Copy settings',   desc: 'Copy targeting, budget and bid settings from one campaign to all selected.', singleAction: 'copy-settings' },
        { id: 't_findreplace',  name: 'Find & replace',  desc: 'Search creative text or URLs across selected campaigns and replace in bulk.', singleAction: 'find-replace' },
        { id: 't_smartplus_upgrade', name: 'Upgrade to Smart+ mode',  desc: '一键将选中的广告组升级到 Smart+ 自动优化模式，由系统接管出价、定向与创意分发。', impact: '+15% ROAS' },
        { id: 't_bulk_settings',     name: 'Bulk adjust settings',    desc: '批量修改预算 / 出价 / 投放目标 / 跟踪链接等通用设置（Meta 导入后常用）。' },
      ],
    },
    {
      group: 'Budget & bidding',
      icon: 'settings',
      subgroups: [
        {
          name: 'Spend reallocation',
          tools: [
            { id: 't_boost_winners',   name: 'Boost top ROAS ad groups',   desc: 'Shift +20% budget to ad groups with ROAS > 2.5 over the last 7 days.', impact: '+8–14% ROAS' },
            { id: 't_cap_losers',      name: 'Cap underperformers',        desc: 'Reduce budget by 30% on ad groups with CPA above target for 5+ days.', impact: '−18% wasted spend' },
            { id: 't_pause_zerospend', name: 'Pause zero-delivery ads',    desc: 'Pause ads that have spent < $1 in the last 48h to declutter delivery.' },
          ],
        },
        {
          name: 'Bid hygiene',
          tools: [
            { id: 't_bid_floor',     name: 'Apply smart bid floor',         desc: 'Set a min bid 15% above auction p25 to avoid losing impression share.', impact: '+6% reach' },
            { id: 't_bid_ceiling',   name: 'Cap runaway CPMs',              desc: 'Add a max CPM ceiling for bids exceeding 2× account median.' },
            { id: 't_pacing_smooth', name: 'Smooth pacing',                 desc: 'Switch ad groups front-loading > 60% spend before noon to even pacing.' },
          ],
        },
      ],
    },
    {
      group: 'Creative health',
      icon: 'creative',
      tools: [
        { id: 't_airesize',     name: 'Automatic image resize',       desc: 'Auto-detect off-ratio creatives across selected campaigns and reframe them to TikTok-native aspect ratios with smart subject tracking.' },
        { id: 't_refresh_fatigue', name: 'Refresh fatigued creatives', desc: 'Auto-replace creatives whose CTR has dropped > 25% from peak in the last 7 days.', impact: '+12% CTR' },
        { id: 't_hook_boost',   name: 'Strengthen first 1.5s hook',   desc: 'Re-cut openings to put product / face in frame within 1.5s for higher hook rate.', impact: '+18% hook rate' },
        { id: 't_caption_on',   name: 'Add burnt-in captions',        desc: 'Generate and bake captions into videos that currently have none — improves sound-off VTR.' },
        { id: 't_thumb_pick',   name: 'Pick best thumbnail',          desc: 'Select the highest-CTR auto-generated thumbnail across last 7 days of impressions.' },
        { id: 't_variant_gen',  name: 'Spawn 3 A/B variants',         desc: 'Generate 3 hook + caption variants per winning creative to refresh testing pool.' },
        { id: 't_creative_bulk_add', name: 'Bulk supplement creatives', desc: '基于素材库一次性为多个广告组补充新素材，确保候选池充足、规避疲劳。', impact: '+9% reach' },
        { id: 't_creative_insights', name: 'Creative insights',         desc: '打开创意洞察看板：识别表现最好/最差的 hook、视觉、文案模式，输出下一轮迭代建议。' },
        { id: 't_aigc_clone_top',    name: 'Generate AIGC variants from top performers', desc: '基于近 7 天 VTR 最高的 AIGC 视频自动派生 3-5 条同风格变体（同 hook、同 avatar、新文案 / 新场景），快速扩量。', impact: '+18% VTR' },
        { id: 't_aigc_explore_dir',  name: 'Try new AIGC content directions',            desc: '调用 AIGC 引擎按未覆盖的内容方向（如 Trend Remix / Lip-sync Hook / Stylized 3D）批量生成测试素材，覆盖创意空白区。', impact: '探索新方向' },
        { id: 't_ct_lock_winner',    name: 'Lock in winners & scale spend',              desc: '把已显著胜出（≥95% confidence）的 winner 自动锁定为正式投放素材，按预设节奏扩量；输者自动暂停，预算回收到 winner。', impact: '锁胜上量' },
        { id: 't_ct_extend_runtime', name: 'Extend test runtime to reach significance',  desc: '识别样本量不足的测试组（confidence < 90%），自动延长投放窗口或追加预算到达显著性阈值，避免提前下结论。', impact: '提升置信度' },
        { id: 't_ct_new_hypothesis', name: 'Spawn next-round hypotheses',                desc: '基于已结束测试的胜出维度，AI 自动生成下一轮假设（hook / 文案 / Avatar / CTA 等），并构造新的对照组排队进入测试。', impact: '持续迭代' },
      ],
    },
    {
      group: 'Audience tuning',
      icon: 'audience',
      tools: [
        { id: 't_exclude_buyers',   name: 'Exclude recent purchasers',  desc: 'Suppress users who purchased in the last 14d on prospecting ad groups.', impact: '−9% CPA' },
        { id: 't_lal_expand',       name: 'Expand winning lookalikes',  desc: 'Auto-expand 1% LAL → 1–3% on seeds where ROAS > 2 to scale reach.', impact: '+22% reach' },
        { id: 't_retarget_warm',    name: 'Re-target warm viewers',     desc: 'Build retargeting from users who watched ≥ 75% of any video in last 30d.' },
        { id: 't_block_lowq',       name: 'Block low-quality placements', desc: 'Exclude placements with VTR < 20% over last 14d to stop bot-like traffic.' },
        { id: 't_geo_concentrate',  name: 'Concentrate on top regions', desc: 'Limit delivery to top 5 regions producing 80% of conversions.' },
      ],
    },
    {
      group: 'Catalog & product',
      icon: 'product',
      tools: [
        { id: 't_promote_winners', name: 'Promote winning SKUs',         desc: 'Boost top-10% ROAS SKUs into Featured set, demote bottom-10% out of rotation.', impact: '+11% catalog ROAS' },
        { id: 't_pause_oos',       name: 'Pause out-of-stock products',  desc: 'Auto-pause ads featuring SKUs with stock = 0 to stop wasted impressions.', impact: '−6% wasted spend' },
        { id: 't_price_refresh',   name: 'Refresh price & sale tags',    desc: 'Re-pull product feed to update prices, sale flags and availability.' },
        { id: 't_dedup_skus',      name: 'Deduplicate SKU variants',     desc: 'Merge duplicate SKU variants competing in the same ad set to reduce overlap.' },
      ],
    },
    {
      group: 'Tracking & quality',
      icon: 'pixel',
      tools: [
        { id: 't_event_match',  name: 'Improve event match quality',   desc: 'Send hashed email + phone via CAPI to push EMQ score from yellow → green.', impact: '+15% attributed conv.' },
        { id: 't_dedup_events', name: 'Deduplicate Pixel + CAPI',      desc: 'Add event_id to dedupe browser & server events — fixes inflated conversion counts.' },
        { id: 't_attr_window',  name: 'Align attribution windows',     desc: 'Standardize ad groups to 7d-click / 1d-view to make ROAS comparable across campaigns.' },
        { id: 't_funnel_check', name: 'Audit funnel coverage',         desc: 'Detect missing events (e.g. AddToCart fires but no InitiateCheckout) and flag gaps.' },
      ],
    },
    {
      group: 'Review & compliance',
      icon: 'settings',
      tools: [
        { id: 't_smart_fix',     name: 'Smart fix',           desc: '基于拒审原因自动重写文案、替换违规素材片段、调整版位定向，并一键重新提交审核。', impact: '+30% 通过率' },
        { id: 't_view_rejection', name: 'View rejection reason', desc: '查看本次拒审的具体条款引用、命中片段和申诉入口，便于人工修复或申诉。' },
      ],
    },
    {
      group: 'Reservation contracts',
      icon: 'audience',
      tools: [
        { id: 't_find_lagging', name: 'Find lagging schedules',  desc: '扫描所有合约广告，列出已过半排期但完成度 < 60% 的计划，并提示加投或排期调整。', impact: '保障合约履约' },
      ],
    },
    {
      group: 'Split test results',
      icon: 'product',
      tools: [
        { id: 't_migrate_to_winner', name: 'Migrate budget to winner', desc: '把分组测试中败方广告组的预算迁移到胜方，按统计显著性自动判断。', impact: '+22% 测试 ROAS' },
        { id: 't_clone_winner',      name: 'Clone winning ad group',   desc: '将胜出广告组复制为新草稿，可叠加扩量参数（LAL 扩展 / 预算上调），快速进入扩量期。' },
      ],
    },
  ];

  // 工具图标 SVG（按分类）
  const TOOLKIT_ICONS = {
    recommended: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.39 4.84L20 7.62l-4 3.9.94 5.48L12 14.77 7.06 17l.94-5.48-4-3.9 5.61-.78L12 2z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    creative: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.926.746-1.688 1.688-1.688H16.5c2.484 0 4.5-2.016 4.5-4.5C21 6.04 16.97 2 12 2z"/></svg>',
    audience: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    product:  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
    pixel:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></svg>',
  };

  // 解析 Recommended tools 的 `recommendIds`：把 id 引用还原成对底层工具对象的浅拷贝。
  // 这样 Recommended 列表里的工具仍然走多选 Apply + issue 确认流程（共用 issue TEMPLATES）。
  // 解析 Recommended tools 的 `recommendIds`：把 id 引用还原成对底层工具对象的浅拷贝。
  // 同时构建一个共享的 flatToolIndex，供 mountToolkitPanel 按 preset 动态填充 Recommended 组使用。
  const __flatToolIndex = new Map();
  (function resolveRecommendedTools() {
    ADAPT_TOOLKIT.forEach(g => {
      if (g.isRecommended) return;
      if (g.subgroups) {
        g.subgroups.forEach(sg => sg.tools.forEach(t => __flatToolIndex.set(t.id, t)));
      } else if (g.tools) {
        g.tools.forEach(t => __flatToolIndex.set(t.id, t));
      }
    });
    ADAPT_TOOLKIT
      .filter(g => g.isRecommended && Array.isArray(g.recommendIds))
      .forEach(g => {
        g.tools = g.recommendIds.map(id => {
          const src = __flatToolIndex.get(id);
          if (!src) return null;
          // 浅拷贝；不带 singleAction 的工具会保持 multi-select Apply 行为。
          return { ...src };
        }).filter(Boolean);
      });
  })();

  // 根据当前 preset 返回 Recommended 组应展示的工具列表（与 toolkit-strip 保持完全一致）
  function resolveRecommendedToolsForPreset(presetKey) {
    const map = window.__PRESET_RECOMMENDED;
    if (!map) return null;
    const ids = map[presetKey] || map.all || [];
    return ids.map(id => __flatToolIndex.get(id)).filter(Boolean).map(t => ({ ...t }));
  }

  // ============== Toolkit Strip ==============
  // 横铺工具条只展示「该 preset 卡片专属的推荐工具」，其余工具统一收到右侧 More 按钮（完整抽屉）。
  // 原则：
  //  1) 每个 preset 配 3-4 个最相关的推荐工具，避免 strip 拥挤；
  //  2) singleAction 工具直接复用对应 modal（Add creative / Find & replace / Copy settings / AI resize）；
  //  3) 普通工具点击 → 走 openBulkAdaptationToolkit 复用抽屉流程；
  //  4) 「全部」preset 下额外提供「功能更新确认」入口，让用户感知到平台新能力。
  (function setupToolkitStrip() {
    const scroll = document.querySelector('[data-role="ts-scroll"]');
    const moreBtn = document.querySelector('[data-role="ts-more"]');
    if (!scroll) return;

    // 不同 preset 配套的推荐工具（按场景挑选 high-impact 项）
    // 暴露到外部，让 mountToolkitPanel 抽屉中的 Recommended 组与 toolkit-strip 共享同一份映射
    const PRESET_RECOMMENDED = window.__PRESET_RECOMMENDED = {
      // 全部：Carousel 新样式由「功能更新」承载，工具栏放 Smart+ 一键升级
      all:          ['t_smartplus_upgrade'],
      // 广告拒审：Smart fix + 查看拒审信息
      rejected:     ['t_smart_fix', 't_view_rejection'],
      // 创意疲劳（机会卡片）：批量补充创意 + 强化前 1.5 秒钩子 + 创意洞察
      opportunities:['t_creative_bulk_add', 't_hook_boost', 't_creative_insights'],
      // 黑五大促：加投高 ROAS + 创意批量补充 + 更新疲劳素材 hook + 排除近期购买者
      blackfriday:  ['t_boost_winners', 't_creative_bulk_add', 't_refresh_fatigue', 't_exclude_buyers'],
      // 合约广告（TopView）：查找进度落后计划
      topview:      ['t_find_lagging'],
      // 分组测试结果：预算迁移到胜方 + 复制获胜组
      split:        ['t_migrate_to_winner', 't_clone_winner'],
      // AIGC 创意效果：基于 Top performing 派生变体 + 探索新内容方向
      aigc:         ['t_aigc_clone_top', 't_aigc_explore_dir', 't_creative_insights', 't_variant_gen'],
      // Creative testing 素材测试盯盘：锁胜 / 扩展运行时长 / 派生新假设
      creativetest: ['t_ct_lock_winner', 't_ct_extend_runtime', 't_ct_new_hypothesis', 't_creative_insights'],
      // Meta 已导入：AI resize 图片 + 批量调整设置
      metaimported: ['t_airesize', 't_bulk_settings'],
    };

    // 扁平化 ADAPT_TOOLKIT，建 id → tool 索引（排除 Recommended 组以免引用打包数据）
    const toolIndex = new Map();
    ADAPT_TOOLKIT.forEach(g => {
      if (g.isRecommended) return;
      if (g.subgroups) g.subgroups.forEach(sg => sg.tools.forEach(t => toolIndex.set(t.id, t)));
      else if (g.tools) g.tools.forEach(t => toolIndex.set(t.id, t));
    });

    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    // 「全部」preset 下展示的功能更新确认条目（产品级 What's new / Action items）
    // 通过 sessionStorage 记录已确认状态，避免页面刷新后重复提醒
    const UPDATE_ANNOUNCEMENTS = [
      {
        id: 'upd_carousel_v2',
        label: 'Carousel 支持新样式',
        desc: 'Carousel 广告新增「卡片自动滑动 + 商品标签」样式，可显著提升点击率。请确认是否升级至新版样式。',
        cta: '查看并确认',
        tone: 'info',
      },
    ];
    const ACK_STORAGE_KEY = 'campaign_update_acks';
    const readAcks = () => {
      try { return new Set(JSON.parse(sessionStorage.getItem(ACK_STORAGE_KEY) || '[]')); }
      catch (_) { return new Set(); }
    };
    const writeAcks = (set) => {
      try { sessionStorage.setItem(ACK_STORAGE_KEY, JSON.stringify(Array.from(set))); }
      catch (_) {}
    };

    function renderToolHtml(t, opts = {}) {
      const cls = ['ts-tool'];
      if (opts.recommended !== false) cls.push('is-recommended');
      if (t.singleAction) cls.push('is-single-action');
      const impact = t.impact ? `<span class="ts-tool-impact">${escapeHtml(t.impact)}</span>` : '';
      return `<button type="button" class="${cls.join(' ')}" data-tool-id="${t.id}"${t.singleAction ? ` data-single-action="${t.singleAction}"` : ''} title="${escapeHtml(t.desc || t.name)}">
        <span class="ts-tool-name">${escapeHtml(t.name)}</span>${impact}
      </button>`;
    }

    function renderUpdatesHtml() {
      const acks = readAcks();
      const pending = UPDATE_ANNOUNCEMENTS.filter(a => !acks.has(a.id));
      // 所有公告都被确认时不再渲染「All updates reviewed」占位
      if (pending.length === 0) return '';
      const items = pending.map(a => `
        <button type="button" class="ts-update ts-update--${a.tone}" data-update-id="${a.id}"${a.runToolId ? ` data-run-tool="${a.runToolId}"` : ''} title="${escapeHtml(a.desc)}">
          <span class="ts-update-dot" aria-hidden="true"></span>
          <span class="ts-update-label">${escapeHtml(a.label)}</span>
          <span class="ts-update-cta">${escapeHtml(a.cta)}</span>
        </button>
      `).join('');
      return `<div class="ts-updates" data-role="ts-updates">
        <span class="ts-updates-tag" data-i18n="What's new">What's new</span>
        ${items}
      </div>`;
    }

    function render() {
      const presetKey = (typeof currentPreset === 'string' && currentPreset) || 'all';
      const wfCtx = getWorkflowScenario();
      const phaseCtx = getPhaseOneContext();
      if (wfCtx || phaseCtx) {
        scroll.parentElement?.setAttribute('data-preset', presetKey);
        scroll.parentElement?.classList.add('is-workflow-embedded');
        scroll.innerHTML = '';
        return;
      }
      scroll.parentElement?.classList.remove('is-workflow-embedded');
      const ids = PRESET_RECOMMENDED[presetKey] || PRESET_RECOMMENDED.all;
      const tools = ids.map(id => toolIndex.get(id)).filter(Boolean);

      const recoLabel = 'Proposed for this view';
      const toolHtml = tools.map(t => renderToolHtml(t)).join('');
      // 在工具组前置「Recommended」小标题；More tools 按钮紧贴最后一个工具右侧
      const groupHtml = `<div class="ts-group ts-group--reco" data-group="${recoLabel}">
        <span class="ts-group-tag" data-i18n="Proposed">Proposed</span>
        ${toolHtml}
        <button type="button" class="ts-more ts-more--inline" data-role="ts-more-inline" title="Open full Toolkit">
          <span data-i18n="More tools">More tools</span>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>`;

      const updatesHtml = presetKey === 'all' ? renderUpdatesHtml() : '';
      scroll.innerHTML = groupHtml + updatesHtml;
      // 让 strip 知道当前 preset，便于样式微调
      scroll.parentElement?.setAttribute('data-preset', presetKey);
    }

    function resolveScopeCampaignIds() {
      const targets = collectSelectedAds();
      const campaignIds = Array.from(new Set(targets.map(t => t.campaign.id)));
      if (campaignIds.length) return campaignIds;
      if (selectedCampaigns.size) return Array.from(selectedCampaigns);
      // 兜底：用当前 preset 过滤后的前 5 条
      const list = (filters[currentPreset] || filters.all)();
      return list.slice(0, 5).map(c => c.id);
    }

    function triggerToolById(toolId) {
      const tool = toolIndex.get(toolId);
      if (!tool) return;
      if (tool.singleAction === 'add-creative') return openAddCreativeModal();
      if (tool.singleAction === 'find-replace') return openFindReplaceModal();
      if (tool.singleAction === 'copy-settings') return openCopyModal();
      // 普通工具：点击即运行，直接进入审查流程，不再先展示抽屉再要求点 Apply。
      const sourceIds = resolveScopeCampaignIds();
      openBulkAdaptationToolkit(sourceIds);
      if (drawerState && drawerState.toolkit) {
        drawerState.toolkit.selected = new Set([toolId]);
        switchToBulkAdaptReview(sourceIds);
      }
    }

    // 事件委托：工具点击
    scroll.addEventListener('click', (e) => {
      const toolBtn = e.target.closest('.ts-tool');
      if (toolBtn) {
        triggerToolById(toolBtn.dataset.toolId);
        return;
      }
      // 内联 More tools 按钮：紧贴最后一个 Recommended tool 右侧
      const moreInline = e.target.closest('[data-role="ts-more-inline"]');
      if (moreInline) {
        const sourceIds = resolveScopeCampaignIds();
        openBulkAdaptationToolkit(sourceIds);
        return;
      }
      const updBtn = e.target.closest('.ts-update');
      if (updBtn) {
        const id = updBtn.dataset.updateId;
        const runTool = updBtn.dataset.runTool;
        // 标记已确认
        const acks = readAcks();
        acks.add(id);
        writeAcks(acks);
        // 若该更新关联了一个工具，则顺手触发；否则只是确认
        if (runTool) triggerToolById(runTool);
        // 局部重渲染（仅在「全部」preset 下需要）
        if ((currentPreset || 'all') === 'all') render();
      }
    });

    // More 按钮：打开完整 Toolkit 抽屉（其余工具都收纳在这里）
    moreBtn?.addEventListener('click', () => {
      const sourceIds = resolveScopeCampaignIds();
      openBulkAdaptationToolkit(sourceIds);
    });

    document.addEventListener('click', (e) => {
      const workflowToolBtn = e.target.closest('.workflow-tool');
      if (workflowToolBtn) {
        triggerToolById(workflowToolBtn.dataset.toolId);
        return;
      }
      const workflowMoreTools = e.target.closest('[data-role="workflow-more-tools"]');
      const phaseMoreTools = e.target.closest('[data-role="phase-more-tools"]');
      if (workflowMoreTools || phaseMoreTools) {
        const sourceIds = resolveScopeCampaignIds();
        openBulkAdaptationToolkit(sourceIds);
      }
    });

    // 暴露给 applyFilter 在 preset 切换后触发重渲染
    window.__renderToolkitStrip = render;

    render();
  })();

  // Drawer state
  let drawerState = null;

  const META_SESSION_KEY = 'metaImportSession';
  function readMetaSession() {
    try {
      const raw = sessionStorage.getItem(META_SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && data.email) return data;
    } catch (_) {}
    return null;
  }
  function saveMetaSession(email) {
    try {
      sessionStorage.setItem(META_SESSION_KEY, JSON.stringify({
        email,
        loggedAt: Date.now(),
      }));
    } catch (_) {}
  }
  function clearMetaSession() {
    try { sessionStorage.removeItem(META_SESSION_KEY); } catch (_) {}
  }

  function defaultDrawerState() {
    const session = readMetaSession();
    return {
      step: 1,                // 1..4
      mode: 'import',         // 'import' | 'bulk-adapt' —— bulk-adapt 用于主表批量审查抽屉
      loggedIn: !!session,
      loginEmail: session ? session.email : null,
      account: null,          // selected account id
      assetTab: 'campaign',   // 'campaign' | 'creative' | 'catalog'
      selected: { campaign: new Set(), creative: new Set(), catalog: new Set() },
      excludedSubItems: new Set(), // ad set / ad ids deselected within an expanded campaign
      phase: 1,               // 1..3 inside step 3
      structSelected: new Set(), // node ids
      adaptChoice: { audience: 'lookalike', pixel: 'capi', creative: 'reframe' },
      issueChoice: {},        // issueId -> selected solutionId
      issueConfirmed: {},     // issueId -> true 表示该 issue 的解决方案已被用户点击 Confirm 确认
      activeIssue: null,      // 当前左栏选中、右栏展示详情的 issue id
      expandedIssue: null,    // currently expanded issue id (showing scope detail)
      expandedSettingsNode: null, // currently expanded structure node id (showing inline settings)
      detailsCollapsed: true, // 默认折叠 Phase 1 的 Targeted campaigns / struct-tree 详细列表
      toolkit: { open: false, selected: new Set(), scope: null, tab: 'all' },
      apply: { tiktok: true, creatives: true, catalogs: true },
      assetFilters: { search: '', sortCol: null, sortDir: 'desc' },
      // Automatic image resize 详情面板的本地交互态
      imageResize: { itemIndex: 0, ratio: 'vertical', gaussianBlur: true, zoom: 100 },
      // Required checks step 中 Pixel / Identity dropdown 的选中值
      requiredChoices: { pixel: null, identity: null },
      // dropdown 展开态：'pixel' | 'identity' | null
      requiredDropdownOpen: null,
    };
  }

  function openMetaImportDrawer() {
    if (!drawerRoot) return;
    drawerState = defaultDrawerState();
    drawerRoot.innerHTML = '';
    const mask = document.createElement('div');
    mask.className = 'drawer-mask';
    mask.innerHTML = `
      <div class="drawer" role="dialog" aria-label="Import from Meta">
        <div class="drawer-head">
          <div class="drawer-title-wrap">
            <span class="drawer-title-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1877f2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
            </span>
            <div>
              <div class="drawer-title">Import from Meta</div>
            </div>
          </div>
          <button class="drawer-close" aria-label="Close" data-role="drawer-close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="drawer-stepper" data-role="stepper"></div>
        <div class="drawer-body" data-role="drawer-body"></div>
        <div class="drawer-foot" data-role="drawer-foot"></div>
      </div>
    `;
    drawerRoot.appendChild(mask);
    mask.addEventListener('click', (e) => { if (e.target === mask) closeMetaDrawer(); });
    mask.querySelector('[data-role="drawer-close"]').addEventListener('click', closeMetaDrawer);
    renderDrawer();
  }

  function closeMetaDrawer() {
    drawerRoot.innerHTML = '';
    drawerState = null;
  }

  // 由 Step 2 进入 Toolkit / 审查抽屉后，关闭这些子抽屉时调用：恢复 Meta import Step 2，不退出主流程
  // ctx: { source: 'meta-import', step, account, selected, expanded, excludedSubItems, assetTab, assetFilters, apply, imageResize }
  function restoreMetaImportFromContext(ctx) {
    if (!drawerRoot) return;
    drawerState = defaultDrawerState();
    if (ctx.account) drawerState.account = ctx.account;
    if (ctx.assetTab) drawerState.assetTab = ctx.assetTab;
    if (ctx.assetFilters) drawerState.assetFilters = { ...drawerState.assetFilters, ...ctx.assetFilters };
    if (ctx.apply) drawerState.apply = { ...drawerState.apply, ...ctx.apply };
    if (ctx.imageResize) drawerState.imageResize = { ...drawerState.imageResize, ...ctx.imageResize };
    if (ctx.expanded instanceof Set) drawerState.expanded = new Set(ctx.expanded);
    if (ctx.excludedSubItems instanceof Set) drawerState.excludedSubItems = new Set(ctx.excludedSubItems);
    if (ctx.selected) {
      ['campaign', 'creative', 'catalog'].forEach(k => {
        if (ctx.selected[k] instanceof Set) drawerState.selected[k] = new Set(ctx.selected[k]);
      });
    }
    drawerState.step = ctx.step || 2;

    drawerRoot.innerHTML = '';
    const mask = document.createElement('div');
    mask.className = 'drawer-mask';
    mask.innerHTML = `
      <div class="drawer" role="dialog" aria-label="Import from Meta">
        <div class="drawer-head">
          <div class="drawer-title-wrap">
            <span class="drawer-title-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1877f2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
            </span>
            <div>
              <div class="drawer-title">Import from Meta</div>
            </div>
          </div>
          <button class="drawer-close" aria-label="Close" data-role="drawer-close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="drawer-stepper" data-role="stepper"></div>
        <div class="drawer-body" data-role="drawer-body"></div>
        <div class="drawer-foot" data-role="drawer-foot"></div>
      </div>
    `;
    drawerRoot.appendChild(mask);
    mask.addEventListener('click', (e) => { if (e.target === mask) closeMetaDrawer(); });
    mask.querySelector('[data-role="drawer-close"]').addEventListener('click', closeMetaDrawer);
    renderDrawer();
  }

  // 给当前 drawerState 打一份快照，用于在打开 Toolkit / 审查抽屉前保存 Meta import 上下文
  function snapshotMetaImportContext() {
    if (!drawerState) return null;
    return {
      source: 'meta-import',
      step: drawerState.step,
      account: drawerState.account,
      assetTab: drawerState.assetTab,
      assetFilters: { ...(drawerState.assetFilters || {}) },
      apply: { ...(drawerState.apply || {}) },
      imageResize: { ...(drawerState.imageResize || {}) },
      expanded: new Set(drawerState.expanded || []),
      excludedSubItems: new Set(drawerState.excludedSubItems || []),
      selected: {
        campaign: new Set(drawerState.selected?.campaign || []),
        creative: new Set(drawerState.selected?.creative || []),
        catalog:  new Set(drawerState.selected?.catalog  || []),
      },
    };
  }

  function renderDrawer() {
    if (!drawerState) return;
    const body = drawerRoot.querySelector('[data-role="drawer-body"]');
    body.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'drawer-body-inner';
    body.appendChild(inner);

    // 批量审查模式：跳过 stepper / step1-4 流程，直接渲染双栏 Issues 视图
    if (drawerState.mode === 'bulk-adapt') {
      renderBulkAdaptBody(body, inner);
      renderBulkAdaptFoot();
      return;
    }

    renderStepper();
    if (drawerState.step === 1) renderStep1(inner);
    else if (drawerState.step === 2) renderStep2(inner);
    else if (drawerState.step === 3) renderStep4(inner);
    // Step 2/3 通用顶部 banner：提示导入后仍可批量编辑
    // 注意：必须在 renderStepX 之后 prepend，否则会被 inner.innerHTML = '...' 覆盖
    if (drawerState.step >= 2 && drawerState.step <= 3) {
      const banner = document.createElement('div');
      banner.className = 'import-flow-banner';
      banner.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>
        <span>Bulk edit budgets, bids and other settings after the import is complete</span>
      `;
      inner.prepend(banner);
    }
    renderFoot();
  }

  // 批量审查抽屉的底部：左侧显示进度统计，右侧 Cancel / Apply
  function renderBulkAdaptFoot() {
    const foot = drawerRoot.querySelector('[data-role="drawer-foot"]');
    if (!foot) return;
    const allIssues = getActiveIssues();
    const total = allIssues.filter(i => i.severity !== 'ok').length;
    const confirmed = allIssues.filter(i => i.severity !== 'ok' && isIssueResolved(i)).length;
    foot.innerHTML = `
      <div class="drawer-foot-left">
        <strong style="color:#16b8a4">${confirmed}</strong> of <strong>${total}</strong> issue${total > 1 ? 's' : ''} confirmed
      </div>
      <div class="drawer-foot-right">
        <button class="btn-ghost" data-role="bulk-cancel">Cancel</button>
        <button class="btn-primary" data-role="bulk-apply" ${total > 0 && confirmed < total ? 'disabled' : ''}>
          Apply
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </button>
      </div>
    `;
    foot.querySelector('[data-role="bulk-cancel"]').addEventListener('click', closeMetaDrawer);
    foot.querySelector('[data-role="bulk-apply"]')?.addEventListener('click', () => {
      // 模拟应用：关闭抽屉
      closeMetaDrawer();
    });
  }

  function renderStepper() {
    const stepper = drawerRoot.querySelector('[data-role="stepper"]');
    // 流程：Connect Meta → Pick Assets → Apply（已移除 Required checks 环节）
    const steps = [
      { n: 1, label: 'Connect Meta' },
      { n: 2, label: 'Pick Assets' },
      { n: 3, label: 'Apply' },
    ];
    stepper.innerHTML = steps.map((s, i) => {
      const cls = drawerState.step === s.n ? 'is-active' : (drawerState.step > s.n ? 'is-done' : '');
      const arrow = i < steps.length - 1
        ? `<span class="step-arrow"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></span>`
        : '';
      const displayNum = i + 1;
      return `
        <div class="step-item ${cls}">
          <span class="step-num">${drawerState.step > s.n ? '✓' : displayNum}</span>
          <span>${s.label}</span>
        </div>
        ${arrow}
      `;
    }).join('');
  }

  function renderFoot() {
    const foot = drawerRoot.querySelector('[data-role="drawer-foot"]');
    const s = drawerState.step;
    let leftHtml = '';
    let rightHtml = '';
    if (s === 1) {
      leftHtml = drawerState.loggedIn
        ? `Logged in as <strong style="color:#16b8a4">${drawerState.loginEmail || 'user@brand.com'}</strong>`
        : `Step 1 of 3 · Authorize TikTok Ads to read Meta assets`;
      rightHtml = `
        <button class="btn-ghost" data-role="drawer-cancel">Cancel</button>
        <button class="btn-primary" data-role="drawer-next" ${drawerState.account ? '' : 'disabled'}>
          Next: Pick campaigns
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      `;
    } else if (s === 2) {
      const totalSel = drawerState.selected.campaign.size + drawerState.selected.creative.size + drawerState.selected.catalog.size;
      leftHtml = `<strong style="color:#16b8a4">${totalSel}</strong> assets selected`;
      rightHtml = `
        <button class="btn-ghost" data-role="drawer-prev">Back</button>
        <button class="btn-primary" data-role="drawer-next" ${totalSel ? '' : 'disabled'}>
          Next: Apply
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      `;
    } else if (s === 3) {
      const ok = drawerState.apply.tiktok || drawerState.apply.creatives || drawerState.apply.catalogs;
      leftHtml = ok
        ? `Ready to apply your selected actions`
        : `Choose at least one apply target to continue`;
      rightHtml = `
        <button class="btn-ghost" data-role="drawer-prev">Back</button>
        <button class="btn-primary" data-role="drawer-apply" ${ok ? '' : 'disabled'}>
          Import as unpublished
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12l5 5L20 7"/></svg>
        </button>
      `;
    }
    foot.innerHTML = `
      <div class="drawer-foot-left">${leftHtml}</div>
      <div class="drawer-foot-right">${rightHtml}</div>
    `;
    foot.querySelector('[data-role="drawer-cancel"]')?.addEventListener('click', closeMetaDrawer);
    foot.querySelector('[data-role="drawer-prev"]')?.addEventListener('click', onDrawerPrev);
    foot.querySelector('[data-role="drawer-next"]')?.addEventListener('click', onDrawerNext);
    foot.querySelector('[data-role="drawer-apply"]')?.addEventListener('click', onDrawerApply);
  }

  function onDrawerPrev() {
    // step 3 → step 2 → step 1
    if (drawerState.step > 1) {
      drawerState.step--;
      renderDrawer();
    }
  }
  function onDrawerNext() {
    if (drawerState.step === 1 && !drawerState.account) return;
    if (drawerState.step === 2) {
      const total = drawerState.selected.campaign.size + drawerState.selected.creative.size + drawerState.selected.catalog.size;
      if (!total) return;
      drawerState.step = 3;
      renderDrawer();
      return;
    }
    if (drawerState.step < 3) {
      drawerState.step++;
      renderDrawer();
    }
  }
  function onDrawerApply() {
    if (!(drawerState.apply.tiktok || drawerState.apply.creatives || drawerState.apply.catalogs)) return;
    // Snapshot apply flags 以便在 closeMetaDrawer() 重置 drawerState 后仍可读取
    const applyTiktok = drawerState.apply.tiktok;
    const applyCreatives = drawerState.apply.creatives;
    const applyCatalogs = drawerState.apply.catalogs;
    const applyLibrary = applyCreatives || applyCatalogs;
    const importedIds = Array.from(drawerState.selected.campaign);
    // 进入 Apply 进度弹窗：保留抽屉容器但用模态遮罩覆盖，结束后再统一关闭
    runImportProgress({
      importedIds,
      applyTiktok,
      applyCreatives,
      applyCatalogs,
      applyLibrary,
    });
  }

  // 模拟分阶段导入进度，过程中可能产生 import 失败 issue。
  // 失败时弹出 issue/solution 对话框让用户选择 Skip & continue 或 Cancel entire import。
  function runImportProgress({ importedIds, applyTiktok, applyCreatives, applyCatalogs, applyLibrary }) {
    // 阶段定义：根据用户勾选的 apply 目标动态拼接
    const stages = [];
    stages.push({ id: 'validate',  label: 'Validating selection',                total: importedIds.length });
    if (applyTiktok)    stages.push({ id: 'tiktok_camp', label: 'Creating TikTok campaigns',         total: importedIds.length });
    if (applyTiktok)    stages.push({ id: 'tiktok_ad',   label: 'Materializing ad groups & ads',     total: importedIds.length });
    if (applyCreatives) stages.push({ id: 'lib_creative',label: 'Archiving creatives to library',    total: Math.max(1, drawerState.selected.creative.size) });
    if (applyCatalogs)  stages.push({ id: 'lib_catalog', label: 'Archiving catalogs to library',     total: Math.max(1, drawerState.selected.catalog.size) });

    // 故意安排在第二个阶段（ad groups & ads）出现一个失败案例，演示 issue/solution 流程
    const failureMap = applyTiktok && importedIds.length > 0
      ? { stageId: 'tiktok_ad', atIndex: Math.min(1, importedIds.length - 1) }
      : null;

    const progressState = {
      stages,
      cursor: 0,           // 当前阶段索引
      itemCursor: 0,       // 当前阶段已处理子项数
      done: false,
      failed: false,
      cancelled: false,
      skipped: [],         // [{ stageId, itemIndex, reason }]
      created: [],         // 实际成功的 campaign id 列表
    };

    // 注入进度弹窗到 drawerRoot 之上
    let modalRoot = document.getElementById('import-progress-modal');
    if (modalRoot) modalRoot.remove();
    modalRoot = document.createElement('div');
    modalRoot.id = 'import-progress-modal';
    modalRoot.className = 'progress-modal-mask';
    document.body.appendChild(modalRoot);

    function renderProgressModal(extra = {}) {
      const totalStages = progressState.stages.length;
      const doneStages = progressState.done ? totalStages : progressState.cursor;
      const overall = Math.min(100, Math.round((doneStages / totalStages) * 100));
      const stageHtml = progressState.stages.map((s, i) => {
        let icon = '';
        let cls = '';
        if (i < progressState.cursor) {
          icon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>';
          cls = 'is-done';
        } else if (i === progressState.cursor && !progressState.done && !progressState.cancelled) {
          icon = '<span class="progress-spinner"></span>';
          cls = 'is-active';
        } else if (progressState.done && i >= progressState.cursor) {
          icon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>';
          cls = 'is-done';
        } else {
          icon = '<span class="progress-dot"></span>';
          cls = 'is-pending';
        }
        const pct = i < progressState.cursor || progressState.done ? '100%'
                  : i === progressState.cursor ? `${Math.min(100, Math.round((progressState.itemCursor / Math.max(1, s.total)) * 100))}%`
                  : '0%';
        return `
          <div class="progress-stage ${cls}">
            <span class="progress-stage-icon">${icon}</span>
            <div class="progress-stage-body">
              <div class="progress-stage-label">${s.label}</div>
              <div class="progress-stage-bar"><span style="width:${pct}"></span></div>
            </div>
          </div>
        `;
      }).join('');

      const headTitle = progressState.cancelled
        ? 'Import cancelled'
        : progressState.done
          ? 'Import complete'
          : 'Importing from Meta…';
      const headDesc = progressState.cancelled
        ? 'No new campaigns were created. Library archives were rolled back.'
        : progressState.done
          ? `${progressState.created.length} of ${importedIds.length} campaign${importedIds.length > 1 ? 's' : ''} imported${progressState.skipped.length ? ` · ${progressState.skipped.length} skipped` : ''}`
          : 'Stay on this screen — you can cancel anytime.';

      const footHtml = progressState.cancelled || progressState.done ? `
        <div class="progress-foot-right">
          <button class="btn-primary" data-role="progress-close">Done</button>
        </div>
      ` : `
        <div class="progress-foot-left">
          <strong style="color:#16b8a4">${overall}%</strong> overall · ${doneStages} of ${totalStages} stages
        </div>
        <div class="progress-foot-right">
          <button class="btn-ghost" data-role="progress-cancel">Cancel</button>
        </div>
      `;

      modalRoot.innerHTML = `
        <div class="progress-modal" role="dialog" aria-label="Import progress">
          <div class="progress-modal-head">
            <div class="progress-modal-title">${headTitle}</div>
            <div class="progress-modal-desc">${headDesc}</div>
          </div>
          <div class="progress-modal-body">
            <div class="progress-overall">
              <div class="progress-overall-bar"><span style="width:${overall}%"></span></div>
            </div>
            <div class="progress-stage-list">${stageHtml}</div>
          </div>
          <div class="progress-modal-foot">${footHtml}</div>
        </div>
        ${extra.failureModalHtml || ''}
      `;

      modalRoot.querySelector('[data-role="progress-cancel"]')?.addEventListener('click', () => {
        progressState.cancelled = true;
        finalize();
      });
      modalRoot.querySelector('[data-role="progress-close"]')?.addEventListener('click', () => {
        modalRoot.remove();
        finalize(true);
      });
      // 失败 issue 弹窗按钮
      modalRoot.querySelector('[data-role="failure-skip"]')?.addEventListener('click', () => {
        // 记录失败项 → 用于 finalize 写入 Draft 行
        const failedCampaignId = importedIds[progressState.itemCursor];
        progressState.skipped.push({
          stageId: progressState.stages[progressState.cursor].id,
          itemIndex: progressState.itemCursor,
          campaignId: failedCampaignId,
          reason: 'TikTok rejected ad copy: contains restricted phrase — Need adaptive settings',
        });
        progressState.itemCursor++;
        // 重置 failed 锁，允许后续阶段再次触发失败检测（如果有）
        progressState.failed = false;
        renderProgressModal();
        // 继续推进
        setTimeout(tick, 240);
      });
      modalRoot.querySelector('[data-role="failure-cancel-all"]')?.addEventListener('click', () => {
        progressState.cancelled = true;
        finalize();
      });
    }

    function showFailureIssue() {
      const stage = progressState.stages[progressState.cursor];
      const failedCampaignId = importedIds[progressState.itemCursor];
      const failedCampaign = META_CAMPAIGNS.find(c => c.id === failedCampaignId);
      const failureModalHtml = `
        <div class="progress-failure-mask">
          <div class="progress-failure-modal" role="dialog" aria-label="Import failure">
            <div class="failure-head">
              <span class="failure-sev-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#dc2626" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
              </span>
              <div class="failure-head-body">
                <div class="failure-title">Import failed for 1 campaign</div>
                <div class="failure-desc">TikTok rejected the ad copy on <strong>${failedCampaign ? failedCampaign.name : 'a Meta campaign'}</strong> during stage <em>${stage.label}</em>. Pick how to proceed — your other campaigns are unaffected.</div>
              </div>
            </div>
            <div class="failure-scope">
              <span class="issue-scope-pill kind-campaign">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
                Impact · Campaign
              </span>
              <span class="failure-scope-text">${failedCampaign ? failedCampaign.name : '—'} · contains restricted phrase</span>
            </div>
            <div class="failure-solutions">
              <div class="issue-solutions-label">Choose how to handle this failure</div>
              <button class="issue-solution is-selected" data-role="failure-skip">
                <span class="issue-solution-radio"></span>
                <span class="issue-solution-text">
                  <span class="issue-solution-title">
                    Skip & continue
                    <span class="issue-tag rec">Proposed</span>
                  </span>
                  <span class="failure-solution-desc">Mark this campaign as skipped and keep importing the rest. You can fix and retry later.</span>
                </span>
              </button>
              <button class="issue-solution" data-role="failure-cancel-all">
                <span class="issue-solution-radio"></span>
                <span class="issue-solution-text">
                  <span class="issue-solution-title">Cancel the entire import</span>
                  <span class="failure-solution-desc">Roll back this run. Nothing will be created on TikTok or saved to your library.</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      `;
      renderProgressModal({ failureModalHtml });
    }

    function tick() {
      if (progressState.cancelled) return;
      const stage = progressState.stages[progressState.cursor];
      if (!stage) {
        progressState.done = true;
        renderProgressModal();
        finalize();
        return;
      }
      // 失败拦截
      if (failureMap && failureMap.stageId === stage.id && failureMap.atIndex === progressState.itemCursor && !progressState.failed) {
        progressState.failed = true;
        showFailureIssue();
        return;
      }
      // 推进 itemCursor
      if (progressState.itemCursor < stage.total) {
        // 把当前 item 写入 created（仅 tiktok_camp 阶段建表）
        if (stage.id === 'tiktok_camp') {
          const mid = importedIds[progressState.itemCursor];
          progressState.created.push(mid);
        }
        progressState.itemCursor++;
        renderProgressModal();
        setTimeout(tick, 320);
        return;
      }
      // 当前阶段完成
      progressState.cursor++;
      progressState.itemCursor = 0;
      renderProgressModal();
      setTimeout(tick, 220);
    }

    function finalize(removeModal = false) {
      if (progressState.cancelled) {
        // 撤销：不写入 DATA，关闭抽屉与弹窗
        if (removeModal) modalRoot.remove();
        else renderProgressModal();
        if (removeModal) {
          closeMetaDrawer();
          setTimeout(() => alert('Import cancelled — no campaigns were created.'), 60);
        }
        return;
      }
      // 成功路径：根据 progressState.created 真正落库
      if (!progressState.done) return;
      if (removeModal) {
        // 用户点 Done：执行真正的落库 + 关闭抽屉
        const createdNames = [];
        const draftNames = [];
        if (applyTiktok) {
          // ① 成功的导入项：正常 fromMeta 行
          progressState.created.forEach((mid) => {
            const m = META_CAMPAIGNS.find(c => c.id === mid);
            if (!m) return;
            const seed = { name: m.name, subType: m.status === 'paused' ? 'paused' : 'none' };
            const row = buildRow(seed);
            row.fromMeta = true;
            row.isNew = true;
            DATA.unshift(row);
            createdNames.push(row.name);
          });
          // ② 失败/跳过的导入项：以 Draft 形式融入 Campaign list，等待用户补全 adaptive settings
          //    用 subType: 'draft' 让 SUB_MAP 自动匹配 status='draft' / label='Draft' / sub.text='Need adaptive settings'
          progressState.skipped.forEach((sk) => {
            const mid = sk.campaignId || importedIds[sk.itemIndex];
            const m = META_CAMPAIGNS.find(c => c.id === mid);
            if (!m) return;
            const seed = { name: m.name, subType: 'draft' };
            const row = buildRow(seed);
            row.fromMeta = true;
            row.isNew = true;
            row.isDraft = true;            // 名称右侧显示 Draft 角标
            row.isOn = false;              // Draft 默认关闭，用户调好设置后再开启
            row.draftReason = sk.reason || 'Adaptive settings missing — finish required adaptations to publish.';
            DATA.unshift(row);
            draftNames.push(row.name);
          });
        }
        closeMetaDrawer();
        currentPage = 1;
        if (createdNames.length || draftNames.length) {
          document.querySelectorAll('.preset').forEach(x => x.classList.remove('active'));
          const metaCard = document.querySelector('.preset[data-preset="metaimported"]');
          if (metaCard) metaCard.classList.add('active');
          applyFilter('metaimported');
          setTimeout(() => {
            const totalImported = createdNames.length;
            const totalDrafts = draftNames.length;
            const draftSuffix = totalDrafts
              ? `\n${totalDrafts} campaign(s) couldn't be applied — saved as Draft (Status: Draft · Need adaptive settings). Open them in the list to finish adaptive settings.`
              : '';
            alert(`Imported ${totalImported} Meta campaign(s) successfully.${draftSuffix}\nFiltered to "Meta imported" — drafts are listed inline with the rest.`);
          }, 60);
        } else if (applyLibrary) {
          applyFilter('all');
          setTimeout(() => alert('Assets saved to library (demo).'), 60);
        }
      }
    }

    renderProgressModal();
    setTimeout(tick, 380);
  }

  // -------- Step 1 --------
  function renderStep1(inner) {
    if (!drawerState.loggedIn) {
      inner.innerHTML = `
        <div class="meta-login-card">
          <div class="meta-login-logo">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
          </div>
          <div class="meta-login-title">Sign in with Meta</div>
          <div class="meta-login-desc">
            Use your Meta Business credentials. We'll request read-only access to your campaigns, creatives, and catalogs — you can revoke at any time.
          </div>
          <form class="meta-login-form" data-role="meta-login-form" autocomplete="off" novalidate>
            <label class="meta-login-field">
              <span class="meta-login-label">Email or phone</span>
              <input type="text" data-role="meta-email" placeholder="user@brand.com" />
            </label>
            <label class="meta-login-field">
              <span class="meta-login-label">Password</span>
              <input type="password" data-role="meta-password" placeholder="••••••••" />
            </label>
            <div class="meta-login-row">
              <label class="meta-remember">
                <input type="checkbox" checked /> Keep me signed in
              </label>
              <a class="meta-forgot" href="#" onclick="return false;">Forgot password?</a>
            </div>
            <div class="meta-login-error" data-role="meta-login-error" hidden>Please enter your email and password.</div>
            <button type="submit" class="meta-login-btn" data-role="meta-login">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-8 5-12 8-12s4 4 6 12"/><path d="M3 18c2 0 3-2 5-6"/><path d="M21 18c-2 0-3-2-5-6"/></svg>
              Continue with Meta
            </button>
            <div class="meta-login-foot">
              By continuing, you agree to Meta's <a href="#" onclick="return false;">Terms</a> &amp; <a href="#" onclick="return false;">Privacy Policy</a>.
            </div>
          </form>
        </div>
      `;
      const form = inner.querySelector('[data-role="meta-login-form"]');
      const errEl = inner.querySelector('[data-role="meta-login-error"]');
      const emailEl = inner.querySelector('[data-role="meta-email"]');
      const pwdEl = inner.querySelector('[data-role="meta-password"]');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailEl.value.trim();
        const pwd = pwdEl.value;
        if (!email || !pwd) {
          errEl.hidden = false;
          (email ? pwdEl : emailEl).focus();
          return;
        }
        errEl.hidden = true;
        // 模拟 OAuth/登录请求
        const card = inner.querySelector('.meta-login-card');
        card.innerHTML = `<div class="drawer-loading"><div class="loader"></div>Signing in to Meta as <strong>${email}</strong>…</div>`;
        setTimeout(() => {
          drawerState.loggedIn = true;
          drawerState.loginEmail = email;
          saveMetaSession(email);
          renderDrawer();
        }, 700);
      });
      return;
    }
    // Account picker
    const initials = (drawerState.loginEmail || 'U')
      .split(/[@.]/)[0]
      .slice(0, 2)
      .toUpperCase();
    inner.innerHTML = `
      <div class="meta-session-bar">
        <div class="meta-session-user">
          <div class="meta-session-avatar">${initials}</div>
          <div class="meta-session-text">
            <div class="meta-session-label">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Signed in to Meta
            </div>
            <div class="meta-session-email">${drawerState.loginEmail || 'user@brand.com'}</div>
          </div>
        </div>
        <button class="meta-switch-user" data-role="meta-switch-user">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11l-3-3m0 0l-3 3m3-3v8"/></svg>
          Switch user
        </button>
      </div>
      <div class="section-title">
        Select a Meta Ad account
        <span class="section-hint">${META_ACCOUNTS.length} accounts found · pick one to continue</span>
      </div>
      <div class="meta-account-list" data-role="account-list">
        ${META_ACCOUNTS.map(acc => `
          <div class="meta-account-card ${drawerState.account === acc.id ? 'is-selected' : ''}" data-id="${acc.id}">
            <div class="meta-account-avatar">${acc.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
            <div class="meta-account-info">
              <div class="meta-account-name">${acc.name}</div>
              <div class="meta-account-meta">${acc.biz} · ${acc.id} · ${acc.currency} · ${acc.campaigns} campaigns · Spend ${acc.spend}</div>
            </div>
            <div class="meta-account-check">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    inner.querySelectorAll('.meta-account-card').forEach(card => {
      card.addEventListener('click', () => {
        drawerState.account = card.dataset.id;
        renderDrawer();
      });
    });
    inner.querySelector('[data-role="meta-switch-user"]')?.addEventListener('click', () => {
      const ok = window.confirm(`Sign out of ${drawerState.loginEmail || 'this account'} and switch to another Meta user?`);
      if (!ok) return;
      clearMetaSession();
      drawerState.loggedIn = false;
      drawerState.loginEmail = null;
      drawerState.account = null;
      renderDrawer();
    });
  }

  // -------- Step 2 --------
  // 联动：根据 campaign 的 creativeIds / catalogIds 反推/正推勾选
  function getAutoLinkedAssets() {
    const linked = { creative: new Set(), catalog: new Set() };
    drawerState.selected.campaign.forEach(cid => {
      const c = META_CAMPAIGNS.find(x => x.id === cid);
      if (!c) return;
      (c.creativeIds || []).forEach(id => linked.creative.add(id));
      (c.catalogIds  || []).forEach(id => linked.catalog.add(id));
    });
    return linked;
  }
  function syncLinkedSelectionsOnCampaignChange(prevCampaignSet) {
    const linked = getAutoLinkedAssets();
    // 仅自动勾选「关联」资产，不会因取消 campaign 而强制反勾（避免破坏用户意图）
    linked.creative.forEach(id => drawerState.selected.creative.add(id));
    linked.catalog.forEach(id => drawerState.selected.catalog.add(id));
    drawerState.linkedAssets = linked; // 缓存当前联动集合，供后续校验
  }
  // 校验：若用户反选了关联资产，标记 missing 用于 UI 提示
  function getMissingLinkedAssets() {
    const linked = getAutoLinkedAssets();
    const missing = { creative: [], catalog: [] };
    linked.creative.forEach(id => { if (!drawerState.selected.creative.has(id)) missing.creative.push(id); });
    linked.catalog.forEach(id  => { if (!drawerState.selected.catalog.has(id))  missing.catalog.push(id); });
    return missing;
  }

  function renderStep2(inner) {
    const tab = drawerState.assetTab;
    const list = tab === 'campaign' ? META_CAMPAIGNS : tab === 'creative' ? META_CREATIVES : META_CATALOGS;
    const sel = drawerState.selected[tab];
    const acc = META_ACCOUNTS.find(a => a.id === drawerState.account);
    const linked = getAutoLinkedAssets();
    const missing = getMissingLinkedAssets();
    const tabs = [
      { id: 'campaign', label: 'Import Campaign', count: META_CAMPAIGNS.length },
      { id: 'creative', label: 'Import Creative', count: META_CREATIVES.length },
      { id: 'catalog',  label: 'Import Catalog',  count: META_CATALOGS.length },
    ];
    const totalMissing = missing.creative.length + missing.catalog.length;

    // Campaign tab：支持搜索 + 排序，使用副本避免污染原始数据
    const filters = drawerState.assetFilters || (drawerState.assetFilters = { search: '', sortCol: null, sortDir: 'desc' });
    let displayList = list.slice();
    if (tab === 'campaign') {
      const kw = (filters.search || '').trim().toLowerCase();
      if (kw) displayList = displayList.filter(c => (c.name || '').toLowerCase().includes(kw));
      if (filters.sortCol) {
        // 把字符串型金额 / 百分比 / 倍率统一转成数字用于排序
        const toNum = (v) => {
          if (v == null || v === '—') return -Infinity;
          const m = String(v).replace(/[$,/dayx%\s]/gi, '').match(/-?\d+(\.\d+)?/);
          return m ? parseFloat(m[0]) : -Infinity;
        };
        const col = filters.sortCol;
        displayList.sort((a, b) => {
          let av = a[col], bv = b[col];
          if (col === 'name' || col === 'objective' || col === 'status') {
            av = String(av || '').toLowerCase();
            bv = String(bv || '').toLowerCase();
            return av < bv ? -1 : av > bv ? 1 : 0;
          }
          return toNum(av) - toNum(bv);
        });
        if (filters.sortDir === 'desc') displayList.reverse();
      }
    }

    const COLS = [
      { id: 'name',      label: 'Name',      sortable: true,  className: '' },
      { id: 'objective', label: 'Objective', sortable: true,  className: '' },
      { id: 'status',    label: 'Status',    sortable: true,  className: '' },
      { id: 'spend',     label: 'Spend',     sortable: true,  className: '' },
      { id: 'cpa',       label: 'CPA',       sortable: true,  className: '' },
      { id: 'roas',      label: 'ROAS',      sortable: true,  className: '' },
      { id: 'ctr',       label: 'CTR',       sortable: true,  className: '' },
      { id: 'budget',    label: 'Budget',    sortable: true,  className: '' },
    ];
    const sortIcon = (colId) => {
      if (filters.sortCol !== colId) {
        return '<svg class="sort-ico" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l4-4 4 4"/><path d="M8 15l4 4 4-4"/></svg>';
      }
      return filters.sortDir === 'asc'
        ? '<svg class="sort-ico is-active" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14l4-4 4 4"/></svg>'
        : '<svg class="sort-ico is-active" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10l4 4 4-4"/></svg>';
    };

    inner.innerHTML = `
      <div class="section-title">
        Browse assets in <strong>${acc ? acc.name : '—'}</strong>
        <span class="section-hint">Multi-select supported · selecting a campaign auto-links its creatives &amp; catalogs</span>
      </div>
      ${tab === 'campaign' ? `` : ''}
      <div class="asset-tabs" data-role="asset-tabs">
        ${tabs.map(t => {
          const total = t.count;
          const selected = drawerState.selected[t.id].size;
          return `
            <div class="asset-tab ${t.id === tab ? 'is-active' : ''}" data-id="${t.id}">
              ${t.label}
              <span class="asset-tab-count">
                <span class="atc-sel">${selected}</span><span class="atc-sep">/</span><span class="atc-total">${total}</span>
              </span>
              ${t.id !== 'campaign' && (t.id === 'creative' ? missing.creative.length : missing.catalog.length) > 0 ? `<span class="asset-tab-warn" title="Some linked assets are unselected">!</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
      ${totalMissing > 0 && tab !== 'campaign' ? `
        <div class="linked-warn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          <div class="linked-warn-text">
            <strong>${totalMissing} linked asset${totalMissing > 1 ? 's' : ''} unselected.</strong>
            Skipping linked ${tab === 'creative' ? 'creatives' : 'catalogs'} may break your campaign import — ad sets referencing them will fall back to placeholders.
          </div>
          <button class="link-btn" data-role="restore-linked">Restore linked</button>
        </div>
      ` : ''}
      <div class="asset-toolbar asset-toolbar--row">
        <div class="asset-search">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input data-role="asset-search-input" placeholder="Search ${tab === 'campaign' ? 'campaigns' : tab === 'creative' ? 'creatives' : 'catalogs'} by name" value="${tab === 'campaign' ? (filters.search || '').replace(/"/g, '&quot;') : ''}" />
        </div>
        <div class="asset-bulk asset-bulk--inline">
          <span class="asset-bulk-summary">
            Selected <strong>${sel.size}</strong> of ${list.length} ${tab === 'campaign' ? 'campaigns' : tab === 'creative' ? 'creatives' : 'catalogs'}
          </span>
          <button class="link-btn asset-bulk-toggle" data-role="asset-toggle-all">${sel.size === list.length ? 'Deselect all' : 'Select all'}</button>
        </div>
      </div>
      ${tab === 'campaign' ? `<div class="asset-range-hint">数据范围为过去 7 天</div>` : ''}
      <div class="asset-list ${tab}-list" data-role="asset-list">
        <div class="asset-list-head">
          <div></div>
          ${tab === 'campaign' ? COLS.map(c => `
            <div class="asset-col-head ${c.sortable ? 'is-sortable' : ''} ${filters.sortCol === c.id ? 'is-sort-active' : ''}" data-sort-col="${c.id}">
              <span>${c.label}</span>
              ${c.sortable ? sortIcon(c.id) : ''}
            </div>
          `).join('') + '<div></div>' : ''}
          ${tab === 'creative' ? '<div>Name</div><div>Type</div><div>Size</div><div>Duration</div>' : ''}
          ${tab === 'catalog'  ? '<div>Name</div><div>Items</div><div>Source</div><div>Status</div>' : ''}
        </div>
        ${displayList.map(item => renderAssetRow(item, tab, sel.has(item.id), { linked, missing })).join('')}
      </div>
    `;
    inner.querySelectorAll('.asset-tab').forEach(t => {
      t.addEventListener('click', () => {
        drawerState.assetTab = t.dataset.id;
        renderDrawer();
      });
    });
    inner.querySelector('[data-role="asset-toggle-all"]').addEventListener('click', () => {
      if (sel.size === list.length) {
        sel.clear();
      } else {
        list.forEach(it => sel.add(it.id));
      }
      if (tab === 'campaign') syncLinkedSelectionsOnCampaignChange();
      renderDrawer();
    });
    // 搜索：实时更新 filters.search 并保留输入焦点
    const _searchInput = inner.querySelector('[data-role="asset-search-input"]');
    if (_searchInput && tab === 'campaign') {
      _searchInput.addEventListener('input', (e) => {
        drawerState.assetFilters.search = e.target.value;
        renderDrawer();
        requestAnimationFrame(() => {
          const next = document.querySelector('[data-role="asset-search-input"]');
          if (next) {
            next.focus();
            const len = next.value.length;
            try { next.setSelectionRange(len, len); } catch (_) { /* noop */ }
          }
        });
      });
    }
    // 列头排序：相同列再次点击切换升降，不同列重置为 desc
    inner.querySelectorAll('.asset-col-head[data-sort-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sortCol;
        const f = drawerState.assetFilters;
        if (f.sortCol === col) {
          f.sortDir = f.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          f.sortCol = col;
          f.sortDir = 'desc';
        }
        renderDrawer();
      });
    });
    inner.querySelector('[data-role="restore-linked"]')?.addEventListener('click', () => {
      const lnk = getAutoLinkedAssets();
      lnk.creative.forEach(id => drawerState.selected.creative.add(id));
      lnk.catalog.forEach(id  => drawerState.selected.catalog.add(id));
      renderDrawer();
    });
    inner.querySelectorAll('.asset-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('input, button, .asset-expand')) return;
        const id = row.dataset.id;
        if (sel.has(id)) sel.delete(id); else sel.add(id);
        if (tab === 'campaign') syncLinkedSelectionsOnCampaignChange();
        renderDrawer();
      });
      const cb = row.querySelector('input[type="checkbox"]');
      if (cb) cb.addEventListener('change', () => {
        const id = row.dataset.id;
        if (cb.checked) sel.add(id); else sel.delete(id);
        if (tab === 'campaign') syncLinkedSelectionsOnCampaignChange();
        renderDrawer();
      });
    });
    // 展开/折叠 Campaign 层级
    inner.querySelectorAll('[data-role="asset-expand"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        drawerState.expanded = drawerState.expanded || new Set();
        if (drawerState.expanded.has(id)) drawerState.expanded.delete(id);
        else drawerState.expanded.add(id);
        renderDrawer();
      });
    });
    // 子层级（ad set / ad）反选
    inner.querySelectorAll('.asset-sub-check').forEach(cb => {
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', () => {
        const subId = cb.dataset.subId;
        const kind = cb.dataset.subKind;
        const ex = drawerState.excludedSubItems;
        if (cb.checked) {
          ex.delete(subId);
        } else {
          ex.add(subId);
          if (kind === 'adset') {
            // 反选 ad set 时，其子 ad 视为整体排除（无需逐个加入），渲染层会处理
          }
        }
        renderDrawer();
      });
    });
    // Restore all skipped sub-items for a campaign
    inner.querySelectorAll('[data-role="restore-subitems"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.dataset.campaignId;
        const ex = drawerState.excludedSubItems;
        Array.from(ex).forEach(id => { if (id.startsWith(`${cid}::`)) ex.delete(id); });
        renderDrawer();
      });
    });
  }
  function renderAssetRow(item, tab, selected, ctx) {
    if (tab === 'creative') {
      const url = `https://images.unsplash.com/photo-${item.photoId}?w=120&h=120&fit=crop&auto=format&q=70`;
      const isLinked = ctx?.linked?.creative.has(item.id);
      const isMissing = ctx?.missing?.creative.includes(item.id);
      const initials = (item.name || 'CV').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
      return `
        <div class="asset-row ${selected ? 'is-selected' : ''} ${isMissing ? 'is-missing' : ''}" data-id="${item.id}">
          <input type="checkbox" ${selected ? 'checked' : ''} />
          <div class="asset-name">
            <div class="asset-thumb creative-thumb" data-fallback="${initials}"><img src="${url}" alt="" loading="lazy" onerror="this.parentNode.classList.add('is-broken'); this.remove();" /></div>
            <div class="asset-name-text">
              <div class="asset-name-main">${item.name}</div>
              ${isLinked ? `<div class="asset-name-sub"><span class="linked-pill">Linked to campaign</span></div>` : ''}
            </div>
          </div>
          <div>${item.type}</div>
          <div>${item.size}</div>
          <div>${item.dur}</div>
        </div>
      `;
    }
    if (tab === 'catalog') {
      const url = `https://images.unsplash.com/photo-${item.photoId}?w=120&h=120&fit=crop&auto=format&q=70`;
      const dot = item.status === 'paused' ? 'paused' : '';
      const isLinked = ctx?.linked?.catalog.has(item.id);
      const isMissing = ctx?.missing?.catalog.includes(item.id);
      const initials = (item.name || 'CT').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
      return `
        <div class="asset-row ${selected ? 'is-selected' : ''} ${isMissing ? 'is-missing' : ''}" data-id="${item.id}">
          <input type="checkbox" ${selected ? 'checked' : ''} />
          <div class="asset-name">
            <div class="asset-thumb creative-thumb" data-fallback="${initials}"><img src="${url}" alt="" loading="lazy" onerror="this.parentNode.classList.add('is-broken'); this.remove();" /></div>
            <div class="asset-name-text">
              <div class="asset-name-main">${item.name}</div>
              ${isLinked ? `<div class="asset-name-sub"><span class="linked-pill">Linked to campaign</span></div>` : ''}
            </div>
          </div>
          <div>${item.items.toLocaleString()}</div>
          <div>${item.source}</div>
          <div><span class="asset-status-tag ${dot}"><span class="dot"></span>${item.status === 'paused' ? 'Paused' : 'Active'}</span></div>
        </div>
      `;
    }
    // campaign with expand
    const dot = item.status === 'paused' ? 'paused' : '';
    const expanded = drawerState.expanded?.has(item.id);
    const sub = `${item.adsets} ad sets · ${item.ads} ads`;
    function distributeAds(total, groupCount) {
      if (groupCount <= 0) return [];
      const base = Math.floor(total / groupCount);
      const extra = total % groupCount;
      return Array.from({ length: groupCount }, (_, i) => base + (i < extra ? 1 : 0));
    }
    let nested = '';
    if (expanded) {
      const dist = distributeAds(item.ads, item.adsets);
      const excluded = drawerState.excludedSubItems;
      let adIdx = 0;
      const groups = Array.from({ length: item.adsets }, (_, i) => i + 1).map(i => {
        const adsetId = `${item.id}::adset::${i}`;
        const adsetExcluded = excluded.has(adsetId);
        const groupAds = Array.from({ length: dist[i - 1] }, (_, j) => {
          adIdx += 1;
          const adId = `${item.id}::ad::${adIdx}`;
          const adExcluded = adsetExcluded || excluded.has(adId);
          const adSpend = (Math.random() * 4000 + 800).toFixed(0);
          const adCPA = (Math.random() * 8 + 4).toFixed(2);
          const adCTR = (Math.random() * 1.6 + 1).toFixed(2);
          return `
            <div class="asset-sub-row lvl-3 ${adExcluded ? 'is-excluded' : ''}">
              <div class="asset-sub-name">
                <input type="checkbox" class="asset-sub-check" data-sub-id="${adId}" data-sub-kind="ad" data-parent-adset="${adsetId}" ${adExcluded ? '' : 'checked'} ${adsetExcluded ? 'disabled' : ''} />
                <span class="asset-sub-icon ad"></span>Ad #${adIdx} — Variant ${String.fromCharCode(64 + ((adIdx - 1) % 26 + 1))}
              </div>
              <div class="asset-sub-metric">$${adSpend}</div>
              <div class="asset-sub-metric">$${adCPA}</div>
              <div class="asset-sub-metric">${adCTR}%</div>
            </div>
          `;
        }).join('');
        const grpSpend = (Math.random() * 12000 + 2000).toFixed(0);
        const grpCPA = (Math.random() * 8 + 4).toFixed(2);
        const grpCTR = (Math.random() * 1.6 + 1).toFixed(2);
        return `
          <div class="asset-sub-row lvl-2 ${adsetExcluded ? 'is-excluded' : ''}">
            <div class="asset-sub-name">
              <input type="checkbox" class="asset-sub-check" data-sub-id="${adsetId}" data-sub-kind="adset" data-campaign-id="${item.id}" ${adsetExcluded ? '' : 'checked'} />
              <span class="asset-sub-icon adset"></span>Ad set ${i} — Audience segment ${i} <span class="sub-tag">${dist[i - 1]} ad${dist[i - 1] > 1 ? 's' : ''}</span>
            </div>
            <div class="asset-sub-metric">$${grpSpend}</div>
            <div class="asset-sub-metric">$${grpCPA}</div>
            <div class="asset-sub-metric">${grpCTR}%</div>
          </div>
          ${groupAds}
        `;
      }).join('');
      const excludedCount = Array.from(excluded).filter(id => id.startsWith(`${item.id}::`)).length;
      const banner = excludedCount > 0
        ? `<div class="asset-sub-banner">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
            <span><strong>${excludedCount}</strong> sub-item${excludedCount > 1 ? 's' : ''} will be skipped during import.</span>
            <button class="link-btn" data-role="restore-subitems" data-campaign-id="${item.id}">Restore all</button>
          </div>`
        : '';
      nested = `
        <div class="asset-nested">
          ${banner}
          <div class="asset-sub-head">
            <div></div>
            <div>Spend</div>
            <div>CPA</div>
            <div>CTR</div>
          </div>
          ${groups}
        </div>
      `;
    }
    return `
      <div class="asset-row campaign-row ${selected ? 'is-selected' : ''} ${expanded ? 'is-expanded' : ''}" data-id="${item.id}">
        <input type="checkbox" ${selected ? 'checked' : ''} />
        <div class="asset-name">
          <div class="asset-thumb"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg></div>
          <div class="asset-name-text">
            <div class="asset-name-main">${item.name}</div>
            <div class="asset-name-sub">${sub}</div>
          </div>
        </div>
        <div>${item.objective}</div>
        <div><span class="asset-status-tag ${dot}"><span class="dot"></span>${item.status === 'paused' ? 'Paused' : 'Active'}</span></div>
        <div class="metric-cell">${item.spend}</div>
        <div class="metric-cell">${item.cpa}</div>
        <div class="metric-cell">${item.roas}</div>
        <div class="metric-cell">${item.ctr}</div>
        <div>${item.budget}</div>
        <div class="asset-expand-cell">
          <button class="asset-expand" data-role="asset-expand" data-id="${item.id}" title="${expanded ? 'Collapse' : 'Expand'}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${expanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      ${nested}
    `;
  }

  // -------- Step 3 · Required checks --------
  // Pick Assets 与 Apply 之间的必要检查页：3 个 issue（Pixel / Identity / Crop）
  // 必须全部 confirm 后才允许进入 Step 4。视觉与交互完全复用 issue/solution 双栏结构。
  function renderRequiredChecksStep(inner) {
    const allIssues = getRequiredCheckIssues();
    const warnCount      = allIssues.filter(i => i.severity !== 'ok').length;
    const confirmedCount = allIssues.filter(i => isIssueResolved(i)).length;

    if (!drawerState.activeIssue || !allIssues.some(i => i.id === drawerState.activeIssue)) {
      const first = allIssues.find(i => !isIssueResolved(i)) || allIssues[0];
      drawerState.activeIssue = first ? first.id : null;
    }
    const activeIssue = allIssues.find(i => i.id === drawerState.activeIssue);
    const leftItems = allIssues.map(i => renderIssueLeftItem(i)).join('');
    const rightHtml = activeIssue
      ? renderIssueDetail(activeIssue)
      : '<div class="issue-detail-empty">Select a check on the left to view its detail.</div>';

    inner.innerHTML = `
      <div class="adapt-summary">
        <div class="adapt-summary-title">
          Required checks
          ${warnCount ? `<span class="summary-badge warn">${warnCount} item${warnCount > 1 ? 's' : ''} need your decision</span>` : ''}
          ${confirmedCount ? `<span class="summary-badge ok">${confirmedCount} confirmed</span>` : ''}
        </div>
        <div class="section-hint" style="padding: 0 0 8px 0;">Resolve each item before continuing — these settings are mandatory for the imported campaigns to run on TikTok.</div>
        <div class="issue-split" data-role="issue-list">
          <div class="issue-split-left">
            <div class="issue-split-left-head">Checks (${allIssues.length})</div>
            <div class="issue-split-left-list">${leftItems}</div>
          </div>
          <div class="issue-split-right">
            <div class="issue-split-right-head">View detail</div>
            <div class="issue-split-right-body" data-role="issue-detail">${rightHtml}</div>
          </div>
        </div>
        ${activeIssue && activeIssue.id === 'iss_ai_creative_resize'
          ? `<div class="issue-feature-section" data-role="issue-feature-section">
               <div class="issue-feature-section-head">
                 <div class="issue-feature-section-title">
                   <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                   <span>Crop preview</span>
                   <span class="issue-feature-section-tag">Linked to · ${activeIssue.title}</span>
                 </div>
                 <div class="issue-feature-section-hint">Adjust framing &amp; ratio · changes apply only to the confirmed solution</div>
               </div>
               ${renderImageResizePanel(activeIssue)}
             </div>`
          : ''}
      </div>
    `;

    bindIssueCards(inner);
  }

  // -------- Toolkit panel (mountable in two modes) --------
  // 渲染 Adaptation toolkit 侧栏 / 主体。可复用：
  // - Import drawer 内：standalone=false，host 为 drawer-body，关闭按钮设置 toolkit.open=false 后重渲整个 drawer
  // - 主表批量场景：standalone=true，host 为独立抽屉的内容区，关闭按钮调用 onClose（关闭整个抽屉）
  function mountToolkitPanel(host, { standalone = false, onClose, onApplyDone } = {}) {
    host.querySelector('.toolkit-side')?.remove();
    const side = document.createElement('aside');
    side.className = 'toolkit-side is-open' + (standalone ? ' is-standalone' : '');

    // 所有工具统一渲染成"点击即运行"的按钮，不再展示 checkbox / 多选 Apply。
    // singleAction 工具沿用原 modal；普通工具被点击时，会以"该工具单点运行"的形式进入审查流程。
    const renderTool = (t, groupIcon) => {
      const iconHtml = groupIcon ? `<span class="toolkit-tool-icon">${TOOLKIT_ICONS[groupIcon] || ''}</span>` : '';
      const safeDesc = (t.desc || '').replace(/"/g, '&quot;');
      const impactPill = t.impact
        ? `<span class="toolkit-tool-impact ${/^[+]/.test(t.impact) ? 'is-up' : 'is-down'}">${t.impact}</span>`
        : '';
      const singleAttr = t.singleAction ? ` data-single-action="${t.singleAction}"` : '';
      return `
        <button type="button" class="toolkit-tool is-single-action" data-id="${t.id}"${singleAttr} title="${safeDesc}">
          ${iconHtml}
          <span class="toolkit-tool-text">
            <span class="toolkit-tool-name">
              ${t.name}
              <span class="toolkit-tool-info" data-tip="${safeDesc}" aria-label="Details">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></svg>
              </span>
              ${impactPill}
            </span>
          </span>
          <span class="toolkit-tool-action">
            Use
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </button>
      `;
    };

    const renderGroupBody = (g) => g.subgroups
      ? `<div class="toolkit-subgroups">${g.subgroups.map(sg => `
          <div class="toolkit-subgroup">
            <div class="toolkit-subgroup-title">${sg.name}</div>
            <div class="toolkit-tool-list">${sg.tools.map(t => renderTool(t, g.icon)).join('')}</div>
          </div>
        `).join('')}</div>`
      : `<div class="toolkit-tool-list">${g.tools.map(t => renderTool(t, g.icon)).join('')}</div>`;

    const bodyHtml = ADAPT_TOOLKIT.map(g => {
      // Recommended 组按当前 preset 动态填充，与外面 toolkit-strip 保持完全一致
      let groupForRender = g;
      if (g.isRecommended) {
        const presetTools = resolveRecommendedToolsForPreset(currentPreset || 'all');
        if (Array.isArray(presetTools) && presetTools.length) {
          groupForRender = { ...g, tools: presetTools, subgroups: undefined };
        }
      }
      return `
      <div class="toolkit-group ${groupForRender.subgroups ? 'has-subgroups' : ''} ${groupForRender.isRecommended ? 'is-recommended' : ''}" data-group="${groupForRender.group}">
        <div class="toolkit-group-title">
          <span class="toolkit-group-icon">${TOOLKIT_ICONS[groupForRender.icon] || ''}</span>
          <span>${groupForRender.group}</span>
        </div>
        ${renderGroupBody(groupForRender)}
      </div>
    `;
    }).join('');

    side.innerHTML = `
      <div class="toolkit-head">
        <div class="toolkit-title">Optimization toolkit</div>
        <button class="drawer-close" data-role="toolkit-close" aria-label="Close toolkit">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="toolkit-body">${bodyHtml}</div>
    `;
    host.appendChild(side);

    const handleClose = () => {
      if (standalone) { onClose && onClose(); }
      else {
        drawerState.toolkit.open = false;
        drawerState.toolkit.scope = null;
        renderDrawer();
      }
    };

    side.querySelector('[data-role="toolkit-close"]').addEventListener('click', handleClose);

    // 工具点击：所有工具都"点击即运行"，没有 checkbox / 没有 Apply 栏。
    side.querySelectorAll('.toolkit-tool').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.singleAction;
        if (action) {
          // singleAction 工具：直接复用对应 modal
          if (action === 'add-creative') openAddCreativeModal();
          else if (action === 'find-replace') openFindReplaceModal();
          else if (action === 'copy-settings') openCopyModal();
          return;
        }
        // 普通工具：以"单工具运行"的形式进入审查流程（toolkit.selected 仅含该工具）
        const id = btn.dataset.id;
        if (!id) return;
        drawerState.toolkit.selected = new Set([id]);
        if (standalone) {
          if (onApplyDone) onApplyDone();
          else if (onClose) onClose();
        } else {
          drawerState.toolkit.open = false;
          drawerState.toolkit.scope = null;
          renderDrawer();
        }
      });
    });
  }

  // 主表批量场景：流程为 先弹出 Toolkit 抽屉 → 用户勾选并 Apply → 切换为「待确认点」双栏审查抽屉
  function openBulkAdaptationToolkit(campaignIds, options) {
    if (!drawerRoot) return;
    // 保留来自 Meta import Step 2 的上下文（账号 / 选中项 / 当前 step），便于流程结束后回退到原抽屉
    const returnContext = (options && options.returnContext) || null;
    drawerState = defaultDrawerState();
    drawerState.mode = 'bulk-toolkit';
    drawerState.returnContext = returnContext;
    // 把主表选中的 campaign 注入，使后续 getSettingsIssues / getLinkedAssetsIssues 能取数
    campaignIds.forEach(id => drawerState.selected.campaign.add(id));
    drawerState.structSelected = new Set(campaignIds);
    drawerState.toolkit.scope = { type: 'bulk' };
    drawerState.toolkit.open = true;

    drawerRoot.innerHTML = '';
    const mask = document.createElement('div');
    mask.className = 'drawer-mask';
    mask.innerHTML = `
      <div class="drawer standalone-toolkit-drawer" role="dialog" aria-label="Optimization toolkit">
        <div class="drawer-body" data-role="drawer-body"></div>
      </div>
    `;
    drawerRoot.appendChild(mask);
    // 关闭工具抽屉时：若来自 Meta import 流程，返回 Step 2 而不是销毁整个流程
    const close = () => {
      const ctx = drawerState && drawerState.returnContext;
      if (ctx && ctx.source === 'meta-import') {
        restoreMetaImportFromContext(ctx);
      } else {
        drawerRoot.innerHTML = '';
        drawerState = null;
      }
    };
    mask.addEventListener('click', (e) => { if (e.target === mask) close(); });
    const host = mask.querySelector('[data-role="drawer-body"]');
    // 用户在 Toolkit 内点击 Apply → 切换为「待确认点」双栏审查抽屉
    mountToolkitPanel(host, {
      standalone: true,
      onClose: close,
      onApplyDone: () => switchToBulkAdaptReview(campaignIds),
    });
  }

  // 由 Toolkit Apply 触发：切换为双栏 Issues 审查抽屉（与 Structure & Settings 同结构）
  function switchToBulkAdaptReview(campaignIds) {
    if (!drawerRoot) return;
    // 注意：不要重置 drawerState（保留 toolkit.selected 等），仅切换 mode 与 UI 容器
    drawerState.mode = 'bulk-adapt';
    drawerState.toolkit.open = false;
    drawerState.toolkit.scope = null;
    // 兜底：确保 selected.campaign / structSelected 仍然是主表选中的 campaign
    if (drawerState.selected.campaign.size === 0) {
      campaignIds.forEach(id => drawerState.selected.campaign.add(id));
    }
    if (drawerState.structSelected.size === 0) {
      drawerState.structSelected = new Set(campaignIds);
    }

    drawerRoot.innerHTML = '';
    const mask = document.createElement('div');
    mask.className = 'drawer-mask';
    mask.innerHTML = `
      <div class="drawer bulk-adapt-drawer" role="dialog" aria-label="Bulk adaptation review">
        <div class="drawer-head">
          <div class="drawer-title-wrap">
            <span class="drawer-title-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#16b8a4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>
            </span>
            <div>
              <div class="drawer-title">Review pending decisions</div>
            </div>
          </div>
          <button class="drawer-close" aria-label="Close" data-role="drawer-close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="drawer-body" data-role="drawer-body"></div>
        <div class="drawer-foot" data-role="drawer-foot"></div>
      </div>
    `;
    drawerRoot.appendChild(mask);
    // 关闭审查抽屉：若来自 Meta import 流程，返回 Step 2；否则按通用关闭逻辑销毁
    const closeReview = () => {
      const ctx = drawerState && drawerState.returnContext;
      if (ctx && ctx.source === 'meta-import') {
        restoreMetaImportFromContext(ctx);
      } else {
        closeMetaDrawer();
      }
    };
    mask.addEventListener('click', (e) => { if (e.target === mask) closeReview(); });
    mask.querySelector('[data-role="drawer-close"]').addEventListener('click', closeReview);
    renderDrawer();
  }

  // 渲染批量审查抽屉的 body：左右双栏 Issues + 下方简要 campaign 列表 + 右上 Toolkit 入口
  function renderBulkAdaptBody(bodyHost, inner) {
    const allIssues = getActiveIssues();

    const warnCount      = allIssues.filter(i => i.severity !== 'ok').length;
    const okCount        = allIssues.filter(i => i.severity === 'ok').length;
    const confirmedCount = allIssues.filter(i => drawerState.issueConfirmed[i.id]).length;

    // 默认激活：上次激活的 → 第一个未确认 → 第一个
    if (!drawerState.activeIssue || !allIssues.some(i => i.id === drawerState.activeIssue)) {
      const first = allIssues.find(i => !drawerState.issueConfirmed[i.id]) || allIssues[0];
      drawerState.activeIssue = first ? first.id : null;
    }
    const activeIssue = allIssues.find(i => i.id === drawerState.activeIssue);
    const leftItems = allIssues.map(i => renderIssueLeftItem(i)).join('');
    const rightHtml = activeIssue
      ? renderIssueDetail(activeIssue)
      : '<div class="issue-detail-empty">Select an issue on the left to view its detail.</div>';

    const selectedCount = drawerState.structSelected.size;
    const cmps = Array.from(drawerState.selected.campaign)
      .map(id => META_CAMPAIGNS.find(c => c.id === id))
      .filter(Boolean);

    const toolkitCount = drawerState.toolkit.selected.size;
    inner.innerHTML = `
      <div class="adapt-summary">
        <div class="adapt-summary-title">
          Pending decisions
          ${warnCount ? `<span class="summary-badge warn">${warnCount} item${warnCount > 1 ? 's' : ''} need your decision</span>` : ''}
          ${confirmedCount ? `<span class="summary-badge ok">${confirmedCount} confirmed</span>` : ''}
          ${okCount ? `<span class="summary-badge ok">${okCount} auto-handled</span>` : ''}
        </div>
        <div class="issue-split" data-role="issue-list">
          <div class="issue-split-left">
            <div class="issue-split-left-head">Issues (${allIssues.length})</div>
            <div class="issue-split-left-list">${leftItems}</div>
          </div>
          <div class="issue-split-right">
            <div class="issue-split-right-head">View detail</div>
            <div class="issue-split-right-body" data-role="issue-detail">${rightHtml}</div>
          </div>
        </div>
        ${activeIssue && activeIssue.id === 'iss_ai_creative_resize'
          ? `<div class="issue-feature-section" data-role="issue-feature-section">
               <div class="issue-feature-section-head">
                 <div class="issue-feature-section-title">
                   <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                   <span>Crop preview</span>
                   <span class="issue-feature-section-tag">Linked to · ${activeIssue.title}</span>
                 </div>
                 <div class="issue-feature-section-hint">Adjust framing &amp; ratio · changes apply only to the confirmed solution</div>
               </div>
               ${renderImageResizePanel(activeIssue)}
             </div>`
          : ''}
      </div>
      <div class="struct-card ${drawerState.detailsCollapsed ? 'is-collapsed' : ''}">
        <div class="struct-card-head" data-role="details-toggle" role="button" tabindex="0">
          <div class="struct-card-head-text">
            <svg class="struct-card-caret" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            Details · <strong>${selectedCount}</strong> campaign${selectedCount > 1 ? 's' : ''}
          </div>
          <button class="toolkit-toggle" data-role="reopen-toolkit" title="Adjust the toolkit selection">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            Toolkit
            <span class="toolkit-toggle-count">${toolkitCount}</span>
          </button>
        </div>
        <div class="bulk-cmp-list">
          ${cmps.map(c => `
            <div class="bulk-cmp-row">
              <div class="bulk-cmp-name">${c.name}</div>
              <div class="bulk-cmp-meta">
                <span class="chip chip-outline">${c.objective}</span>
                <span>${c.adsets} ad groups</span>
                <span>${c.ads} ads</span>
                <span>${c.budget}/day</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // bulk-adapt 模式下不再叠加 Toolkit 侧栏（流程已结束 Toolkit 阶段）
    bodyHost.querySelector('.toolkit-side')?.remove();

    // 绑定：Details head 折叠/展开
    const detailsHead = inner.querySelector('[data-role="details-toggle"]');
    detailsHead?.addEventListener('click', (e) => {
      if (e.target.closest('[data-role="reopen-toolkit"]')) return;
      drawerState.detailsCollapsed = !drawerState.detailsCollapsed;
      renderDrawer();
    });
    // 绑定：Edit toolkit 入口 → 回到 Toolkit 抽屉，保留已选工具，可再次 Apply 进入待确认
    inner.querySelector('[data-role="reopen-toolkit"]')?.addEventListener('click', () => {
      const ids = Array.from(drawerState.structSelected);
      // 回到 Toolkit 时保留 toolkit.selected，便于继续编辑
      const keep = new Set(drawerState.toolkit.selected);
      const keepConfirmed = { ...drawerState.issueConfirmed };
      const keepChoice    = { ...drawerState.issueChoice };
      openBulkAdaptationToolkit(ids);
      drawerState.toolkit.selected = keep;
      drawerState.issueConfirmed   = keepConfirmed;
      drawerState.issueChoice      = keepChoice;
      // 重渲 Toolkit 面板以反映保留的勾选数
      const host = drawerRoot.querySelector('[data-role="drawer-body"]');
      if (host) mountToolkitPanel(host, {
        standalone: true,
        onClose: () => { drawerRoot.innerHTML = ''; drawerState = null; },
        onApplyDone: () => switchToBulkAdaptReview(ids),
      });
    });
    // 绑定：左右双栏 issue 交互（点击左项 / Confirm / Edit / 切换素材明细 / 选择 solution / 打开 Toolkit）
    bindIssueCards(inner);
  }

  function renderStep3(bodyHost, inner) {
    const phase = drawerState.phase;
    const phases = [
      { n: 1, title: 'Structure & Settings', sub: 'Hierarchy + per-level configurations', status: 'warn' },
      { n: 2, title: 'Linked assets',        sub: 'Creatives, products, audience',        status: 'warn' },
    ];
    const tabsHtml = `
      <div class="phase-tabs">
        ${phases.map(p => `
          <div class="phase-tab ${p.n === phase ? 'is-active' : (p.n < phase ? 'is-done' : '')}" data-phase="${p.n}">
            <div class="phase-tab-head">
              <span class="phase-tab-num">${p.n < phase ? '✓' : p.n}</span>
              <span class="phase-status ${p.n < phase || p.status === 'ok' ? 'ok' : ''}">${p.n < phase ? 'Done' : (p.status === 'ok' ? 'OK' : 'Needs review')}</span>
            </div>
            <div class="phase-tab-title">${p.title}</div>
            <div class="phase-tab-sub">${p.sub}</div>
          </div>
        `).join('')}
      </div>
    `;
    let phaseHtml = '';
    if (phase === 1) phaseHtml = renderPhase1Html();
    else phaseHtml = renderPhase3Html();
    inner.innerHTML = tabsHtml + phaseHtml;

    // Mount toolkit side panel inside drawer body host (only when toggled open)
    bodyHost.querySelector('.toolkit-side')?.remove();
    if (drawerState.toolkit.open) {
      mountToolkitPanel(bodyHost, { standalone: false });
    }

    // Phase tab bindings
    inner.querySelectorAll('.phase-tab').forEach(p => {
      p.addEventListener('click', () => {
        drawerState.phase = +p.dataset.phase;
        renderDrawer();
      });
    });
    inner.querySelector('[data-role="toolkit-toggle"]')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      drawerState.toolkit.scope = { type: 'bulk' };
      drawerState.toolkit.open = !drawerState.toolkit.open;
      renderDrawer();
    });
    // Phase-specific bindings
    if (phase === 1) bindPhase1(inner);
    if (phase === 2) bindPhase3(inner);
  }

  // ---- Phase 1: Structure & Settings (merged) ----
  function getCampaignSettings(c) {
    const isLAL = /Lookalike/i.test(c.name);
    return [
      { key: 'objective', label: 'Objective',     value: c.objective, mapped: c.objective, status: 'mapped' },
      { key: 'budget',    label: 'Daily budget',  value: c.budget,    mapped: c.budget,    status: 'mapped' },
      { key: 'bid',       label: 'Bid strategy',  value: 'Lowest cost', mapped: 'Lowest cost', status: 'mapped' },
      { key: 'audience',  label: 'Audience type', value: isLAL ? 'Lookalike 1%' : 'Interest + Custom', mapped: isLAL ? 'TikTok LAL 1%' : 'Interest + Custom', status: isLAL ? 'review' : 'mapped' },
    ];
  }
  function getAdSetSettings(c, idx) {
    const baseBid = (parseInt(String(c.budget).replace(/[^\d]/g, ''), 10) || 200) / Math.max(1, c.adsets) / 50;
    return [
      { key: 'bid',          label: 'Bid',                value: `$${baseBid.toFixed(2)}`,   mapped: `$${baseBid.toFixed(2)}`,           status: 'mapped' },
      { key: 'optGoal',      label: 'Optimization goal',  value: c.objective === 'Awareness' ? 'Reach' : 'Conversions', mapped: c.objective === 'Awareness' ? 'Reach' : 'Conversions', status: 'mapped' },
      { key: 'placement',    label: 'Placement',          value: 'Auto',                                                  mapped: 'TikTok + Pangle',                                       status: 'changed' },
      { key: 'schedule',     label: 'Schedule',           value: 'All day',                                               mapped: 'All day',                                               status: 'mapped' },
    ];
  }
  function getAdSettings(c, gIdx, aIdx, globalIdx) {
    const incompatible = globalIdx % 4 === 0;
    const slug = (c.name || 'campaign').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return [
      { key: 'identity', label: 'Identity',     value: '@brand_official',                                              mapped: '@brand_official_tiktok',                                                       status: 'changed' },
      { key: 'webUrl',   label: 'Web URL',      value: `https://shop.brand.com/${slug}`,                              mapped: `https://shop.brand.com/${slug}`,                                               status: 'mapped' },
      { key: 'utm',      label: 'UTM tracking', value: `utm_source=meta&utm_medium=cpc&utm_campaign=${slug}`,         mapped: `utm_source=tiktok&utm_medium=paid_social&utm_campaign=${slug}&utm_content=ad${aIdx}`, status: 'changed' },
      { key: 'aspect',   label: 'Aspect ratio', value: incompatible ? '4:5' : '9:16',                                  mapped: '9:16',                                                                          status: incompatible ? 'review' : 'mapped' },
    ];
  }

  function renderSettingStrip(settings) {
    return `
      <div class="settings-strip">
        ${settings.map(s => `
          <div class="setting-pair status-${s.status}" title="${s.label}: ${s.value}${s.mapped !== s.value ? ` → ${s.mapped}` : ''}">
            <span class="setting-key">${s.label}</span>
            <span class="setting-val">
              ${s.value}
              ${s.mapped !== s.value ? `<svg class="setting-arrow" viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg><span class="setting-mapped">${s.mapped}</span>` : ''}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPhase1Html() {
    const ids = Array.from(drawerState.selected.campaign);
    const items = ids.map(id => META_CAMPAIGNS.find(c => c.id === id)).filter(Boolean);

    function distributeAds(total, groupCount) {
      if (groupCount <= 0) return [];
      const base = Math.floor(total / groupCount);
      const extra = total % groupCount;
      return Array.from({ length: groupCount }, (_, i) => base + (i < extra ? 1 : 0));
    }

    if (drawerState.structSelected.size === 0) {
      items.forEach(c => {
        drawerState.structSelected.add(c.id);
        const dist = distributeAds(c.ads, c.adsets);
        for (let i = 1; i <= c.adsets; i++) {
          const gid = `${c.id}_g${i}`;
          drawerState.structSelected.add(gid);
          for (let j = 1; j <= dist[i - 1]; j++) {
            drawerState.structSelected.add(`${gid}_a${j}`);
          }
        }
      });
    }

    const expanded = drawerState.expandedSettingsNode || null;

    const treeHtml = items.map(c => {
      const dist = distributeAds(c.ads, c.adsets);
      let adGlobalIdx = 0;
      const cmpSettings = getCampaignSettings(c);
      const cmpReview = cmpSettings.filter(s => s.status === 'review').length;
      const cmpChanged = cmpSettings.filter(s => s.status === 'changed').length;

      const groupsAndAds = Array.from({ length: c.adsets }, (_, i) => i + 1).map(i => {
        const gid = `${c.id}_g${i}`;
        const gSettings = getAdSetSettings(c, i);
        const gReview = gSettings.filter(s => s.status === 'review').length;
        const gChanged = gSettings.filter(s => s.status === 'changed').length;
        const gExpanded = expanded === gid;

        const groupHtml = `
          <div class="struct-node lvl-2 ${gExpanded ? 'is-expanded' : ''}" data-id="${gid}">
            <input type="checkbox" data-id="${gid}" ${drawerState.structSelected.has(gid) ? 'checked' : ''} />
            <span class="struct-node-icon"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="14" rx="2"/></svg></span>
            <span class="struct-node-name">Ad set ${i} — Audience segment ${i}</span>
            <span class="struct-meta-pills">
              ${gChanged ? `<span class="meta-pill changed">${gChanged} adapted</span>` : ''}
              ${gReview ? `<span class="meta-pill review">${gReview} review</span>` : ''}
              <span class="meta-pill plain">${dist[i - 1]} ad${dist[i - 1] > 1 ? 's' : ''}</span>
            </span>
            <button class="struct-row-toggle" data-role="toggle-settings" data-id="${gid}" title="Toggle settings">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${gExpanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
              ${gExpanded ? 'Hide settings' : 'Settings'}
            </button>
            <button class="struct-row-tool" data-role="row-tool" data-id="${gid}" title="Adapt this ad set">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>
              Adapt
            </button>
          </div>
          ${gExpanded ? `<div class="struct-settings lvl-2-settings">${renderSettingStrip(gSettings)}</div>` : ''}
        `;
        const adsHtml = Array.from({ length: dist[i - 1] }, (_, j) => j + 1).map(j => {
          const aid = `${gid}_a${j}`;
          adGlobalIdx += 1;
          const aSettings = getAdSettings(c, i, j, adGlobalIdx);
          const aReview = aSettings.filter(s => s.status === 'review').length;
          const aChanged = aSettings.filter(s => s.status === 'changed').length;
          const incompatible = adGlobalIdx % 4 === 0;
          const aExpanded = expanded === aid;
          return `
            <div class="struct-node lvl-3 ${aExpanded ? 'is-expanded' : ''}" data-id="${aid}">
              <input type="checkbox" data-id="${aid}" ${drawerState.structSelected.has(aid) ? 'checked' : ''} />
              <span class="struct-node-icon"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M9 10l5 2-5 2z" fill="currentColor"/></svg></span>
              <span class="struct-node-name">Ad #${adGlobalIdx} — Creative variant ${String.fromCharCode(64 + ((adGlobalIdx - 1) % 26 + 1))}</span>
              <span class="struct-meta-pills">
                ${aChanged ? `<span class="meta-pill changed">${aChanged} adapted</span>` : ''}
                ${aReview ? `<span class="meta-pill review">${aReview} review</span>` : ''}
                ${!aReview && !aChanged ? `<span class="meta-pill ok">Compatible</span>` : ''}
              </span>
              <button class="struct-row-toggle" data-role="toggle-settings" data-id="${aid}" title="Toggle settings">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${aExpanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
                ${aExpanded ? 'Hide settings' : 'Settings'}
              </button>
              ${incompatible ? `<button class="struct-row-tool struct-row-fix" data-role="row-tool" data-id="${aid}" title="Fix with Optimization toolkit">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>
                Fix in toolkit
              </button>` : `<button class="struct-row-tool" data-role="row-tool" data-id="${aid}" title="Adapt this ad">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>
                Adapt
              </button>`}
            </div>
            ${aExpanded ? `<div class="struct-settings lvl-3-settings">${renderSettingStrip(aSettings)}</div>` : ''}
          `;
        }).join('');
        return groupHtml + adsHtml;
      }).join('');

      const cExpanded = expanded === c.id;
      return `
        <div class="struct-node lvl-1 ${cExpanded ? 'is-expanded' : ''}" data-id="${c.id}">
          <input type="checkbox" data-id="${c.id}" ${drawerState.structSelected.has(c.id) ? 'checked' : ''} />
          <span class="struct-node-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h12l4 4v12H4z"/></svg></span>
          <span class="struct-node-name"><strong>${c.name}</strong></span>
          <span class="struct-meta-pills">
            ${cmpChanged ? `<span class="meta-pill changed">${cmpChanged} adapted</span>` : ''}
            ${cmpReview ? `<span class="meta-pill review">${cmpReview} review</span>` : ''}
            <span class="meta-pill plain">${c.adsets} ad sets · ${c.ads} ads</span>
          </span>
          <button class="struct-row-toggle" data-role="toggle-settings" data-id="${c.id}" title="Toggle settings">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${cExpanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
            ${cExpanded ? 'Hide settings' : 'Settings'}
          </button>
          <button class="struct-row-tool" data-role="row-tool" data-id="${c.id}" title="Adapt this campaign">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>
            Adapt
          </button>
        </div>
        ${cExpanded ? `<div class="struct-settings lvl-1-settings">${renderSettingStrip(cmpSettings)}</div>` : ''}
        ${groupsAndAds}
      `;
    }).join('');

    const selectedCount = drawerState.structSelected.size;
    const settingsIssues = getSettingsIssues();
    const issueWarnCount = settingsIssues.filter(i => i.severity !== 'ok').length;
    const issueOkCount   = settingsIssues.filter(i => i.severity === 'ok').length;
    const issueConfirmedCount = settingsIssues.filter(i => drawerState.issueConfirmed[i.id]).length;
    // 默认激活：上次激活的 → 第一个未确认 → 第一个
    if (!drawerState.activeIssue || !settingsIssues.some(i => i.id === drawerState.activeIssue)) {
      const first = settingsIssues.find(i => !drawerState.issueConfirmed[i.id]) || settingsIssues[0];
      drawerState.activeIssue = first ? first.id : null;
    }
    const activeIssue = settingsIssues.find(i => i.id === drawerState.activeIssue);
    const leftItems = settingsIssues.map(i => renderIssueLeftItem(i)).join('');
    const rightHtml = activeIssue
      ? renderIssueDetail(activeIssue)
      : '<div class="issue-detail-empty">Select an issue on the left to view its detail.</div>';

    return `
      <div class="adapt-summary">
        <div class="adapt-summary-title">
          Structure &amp; Settings review
          ${issueWarnCount ? `<span class="summary-badge warn">${issueWarnCount} item${issueWarnCount > 1 ? 's' : ''} need your decision</span>` : ''}
          ${issueConfirmedCount ? `<span class="summary-badge ok">${issueConfirmedCount} confirmed</span>` : ''}
          ${issueOkCount ? `<span class="summary-badge ok">${issueOkCount} auto-handled</span>` : ''}
        </div>
        <div class="issue-split" data-role="issue-list">
          <div class="issue-split-left">
            <div class="issue-split-left-head">Issues (${settingsIssues.length})</div>
            <div class="issue-split-left-list">${leftItems}</div>
          </div>
          <div class="issue-split-right">
            <div class="issue-split-right-head">View detail</div>
            <div class="issue-split-right-body" data-role="issue-detail">${rightHtml}</div>
          </div>
        </div>
      </div>
      <div class="struct-card ${drawerState.detailsCollapsed ? 'is-collapsed' : ''}">
        <div class="struct-card-head" data-role="details-toggle" role="button" tabindex="0">
          <div class="struct-card-head-text">
            <svg class="struct-card-caret" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            Details · <strong>${selectedCount}</strong> selected
          </div>
          <button class="toolkit-toggle ${selectedCount > 0 ? '' : 'is-disabled'}" data-role="toolkit-toggle" ${selectedCount > 0 ? '' : 'disabled aria-disabled="true"'}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
            Toolkit
            ${selectedCount > 0 ? `<span class="toolkit-toggle-count">${selectedCount}</span>` : ''}
          </button>
        </div>
        <div class="struct-tree" data-role="struct-tree">${treeHtml}</div>
      </div>
    `;
  }
  function bindPhase1(inner) {
    // Details head 折叠/展开（避免与子按钮冒泡冲突）
    const detailsHead = inner.querySelector('[data-role="details-toggle"]');
    detailsHead?.addEventListener('click', (e) => {
      if (e.target.closest('[data-role="toolkit-toggle"]')) return;
      drawerState.detailsCollapsed = !drawerState.detailsCollapsed;
      renderDrawer();
    });
    inner.querySelectorAll('.struct-node input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.id;
        if (cb.checked) drawerState.structSelected.add(id);
        else drawerState.structSelected.delete(id);
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="toggle-settings"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        drawerState.expandedSettingsNode = drawerState.expandedSettingsNode === id ? null : id;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="row-tool"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drawerState.toolkit.scope = { type: 'single', ids: [btn.dataset.id] };
        drawerState.toolkit.open = true;
        renderDrawer();
      });
    });
    bindIssueCards(inner);
  }

  // ---- Phase 2: Settings ----
  function renderPhase2Html() {
    const issues = getSettingsIssues();
    return renderIssueListHtml({
      title: 'Settings adaptation',
      intro: `Meta and TikTok have different settings for audience, pixel, creative and budget. Each issue below shows <strong>what's wrong</strong>, <strong>which items it impacts</strong> and the proposed <strong>solutions</strong>. Pick a solution per issue, or open the <strong>Optimization toolkit</strong> for fine-grained control.`,
      issues,
    });
  }
  function bindPhase2(inner) {
    bindIssueCards(inner);
  }

  // ---- Phase 3: Linked Assets ----
  function renderPhase3Html() {
    const issues = getLinkedAssetsIssues();
    return renderIssueListHtml({
      title: 'Linked assets review',
      intro: `We detected linked creatives and catalogs for your selected campaigns. Review each issue, see the impacted assets, and pick a solution.`,
      issues,
    });
  }
  function bindPhase3(inner) {
    bindIssueCards(inner);
  }

  // ============ Issue model & rendering ============
  // Issue schema: { id, severity, title, summary, scope: {kind, label, items[]}, solutions: [{id, label, recommended, apply, toolkitTools}] }
  function getSettingsIssues() {
    const cmpIds = Array.from(drawerState.selected.campaign);
    const cmps = cmpIds.map(id => META_CAMPAIGNS.find(c => c.id === id)).filter(Boolean);

    // Build scope helpers
    const adGroupsOf = (cmp) => Array.from({ length: cmp.adsets }, (_, i) => ({
      id: `${cmp.id}::adset::${i + 1}`,
      label: `Ad set ${i + 1} — Audience segment ${i + 1}`,
      campaign: cmp.name,
    }));
    const allAdGroups = cmps.flatMap(adGroupsOf);
    // Pretend the first ~60% of ad groups are LAL-based
    const lalGroups   = allAdGroups.slice(0, Math.ceil(allAdGroups.length * 0.6));
    const trackedCmps = cmps;     // pretend all need pixel migration
    // Creative ratio mismatch: pretend ~40% of ads
    const totalAds = cmps.reduce((s, c) => s + c.ads, 0);
    const mismatchedAds = Math.max(1, Math.round(totalAds * 0.4));
    const adSamples = [];
    let adIdx = 0;
    for (const cmp of cmps) {
      for (let j = 1; j <= cmp.ads && adSamples.length < mismatchedAds; j++) {
        adIdx += 1;
        if (adIdx % 2 === 1) {
          adSamples.push({
            id: `${cmp.id}::ad::${j}`,
            label: `Ad #${j} — Variant ${String.fromCharCode(64 + ((j - 1) % 26 + 1))}`,
            campaign: cmp.name,
            meta: '4:5 · not 9:16',
          });
        }
      }
    }

    return [
      {
        id: 'iss_audience',
        severity: 'warn',
        title: 'Lookalike audiences are not directly portable',
        summary: 'Meta Lookalike (1%) cannot be reused on TikTok 1:1. We can rebuild equivalents using the same seed, fall back to interest mapping, or keep Custom Audiences via CAPI.',
        scope: {
          kind: 'adset',
          label: `${lalGroups.length} ad group${lalGroups.length > 1 ? 's' : ''} use Lookalike audiences`,
          items: lalGroups,
        },
        solutions: [
          { id: 'lookalike', label: 'Rebuild as TikTok LAL', recommended: true, apply: 'auto', toolkitTools: ['t_lal'] },
          { id: 'interest',  label: 'Map interests only',                      apply: 'auto', toolkitTools: ['t_interest'] },
          { id: 'custom',    label: 'Use Custom audience CAPI',                apply: 'auto', toolkitTools: ['t_custom'] },
        ],
      },
      {
        id: 'iss_pixel',
        severity: 'warn',
        title: 'Tracking events need bridging',
        summary: 'Meta Pixel events (Purchase, AddToCart, etc.) need to be mapped to TikTok Pixel / Events API equivalents.',
        scope: {
          kind: 'campaign',
          label: `${trackedCmps.length} campaign${trackedCmps.length > 1 ? 's' : ''} relying on Meta Pixel events`,
          items: trackedCmps.map(c => ({ id: c.id, label: c.name, campaign: c.name, meta: c.objective })),
        },
        solutions: [
          { id: 'capi',  label: 'CAPI server-side bridge', recommended: true, apply: 'auto', toolkitTools: ['t_capi'] },
          { id: 'pixel', label: 'Install TikTok Pixel manually',              apply: 'toolkit', toolkitTools: ['t_pixel'] },
        ],
      },
      {
        id: 'iss_creative',
        severity: 'warn',
        title: 'Creative aspect ratio mismatch',
        summary: 'Some creatives are 1:1 / 4:5. TikTok native is 9:16. Auto-reframe with smart subject tracking, or keep originals and accept reduced delivery.',
        scope: {
          kind: 'ad',
          label: `${adSamples.length} ad${adSamples.length > 1 ? 's' : ''} with non-9:16 creatives`,
          items: adSamples,
        },
        solutions: [
          { id: 'reframe', label: 'Auto reframe to 9:16', recommended: true, apply: 'auto',    toolkitTools: ['t_aspect'] },
          { id: 'keep',    label: 'Keep original ratios',                    apply: 'auto',    toolkitTools: [] },
          { id: 'manual',  label: 'Adjust per ad in toolkit',                apply: 'toolkit', toolkitTools: ['t_aspect', 't_caption'] },
        ],
      },
      {
        id: 'iss_budget',
        severity: 'ok',
        title: 'Budget & bid strategy mapped',
        summary: 'Daily budgets and bid strategies were mapped 1:1 to the closest TikTok equivalents. No action required.',
        scope: {
          kind: 'campaign',
          label: `${cmps.length} campaign${cmps.length > 1 ? 's' : ''} mapped automatically`,
          items: cmps.map(c => ({ id: c.id, label: c.name, campaign: c.name, meta: c.budget })),
        },
        solutions: [],
      },
    ];
  }

  function getLinkedAssetsIssues() {
    const cvIds  = Array.from(drawerState.selected.creative);
    const catIds = Array.from(drawerState.selected.catalog);
    const cvs    = cvIds.map(id => META_CREATIVES.find(x => x.id === id)).filter(Boolean);
    const cats   = catIds.map(id => META_CATALOGS.find(x => x.id === id)).filter(Boolean);
    const musicCvs = cvs.slice(0, Math.ceil(cvs.length * 0.6)); // pretend 60% have copyrighted music

    return [
      {
        id: 'iss_music',
        severity: 'warn',
        title: 'Creatives use copyrighted music',
        summary: 'Replace audio with TikTok Commercial Music Library tracks to stay policy-compliant. Stripping audio is also supported.',
        scope: {
          kind: 'creative',
          label: `${musicCvs.length} of ${cvs.length} creative${cvs.length > 1 ? 's' : ''} flagged`,
          items: musicCvs.map(cv => ({ id: cv.id, label: cv.name, meta: `${cv.type} · ${cv.dur}` })),
        },
        solutions: [
          { id: 'replace', label: 'Auto-replace audio', recommended: true, apply: 'auto', toolkitTools: ['t_music'] },
          { id: 'strip',   label: 'Strip audio',                            apply: 'auto', toolkitTools: [] },
          { id: 'skip',    label: 'Skip these creatives',                   apply: 'auto', toolkitTools: [] },
        ],
      },
      {
        id: 'iss_field',
        severity: 'warn',
        title: 'Catalog field mapping required',
        summary: 'Meta uses retailer_id, TikTok uses sku_id. Auto-map matching fields, or open the toolkit for full manual mapping.',
        scope: {
          kind: 'catalog',
          label: `${cats.length} catalog${cats.length > 1 ? 's' : ''} need field mapping`,
          items: cats.map(c => ({ id: c.id, label: c.name, meta: `${c.items.toLocaleString()} items · ${c.source}` })),
        },
        solutions: [
          { id: 'auto',    label: 'Auto field mapping', recommended: true, apply: 'auto',    toolkitTools: ['t_field'] },
          { id: 'manual',  label: 'Manual mapping…',                        apply: 'toolkit', toolkitTools: ['t_field', 't_sku'] },
        ],
      },
      {
        id: 'iss_custom',
        severity: 'ok',
        title: 'Custom Audiences ready to sync',
        summary: 'Hashed lists will be uploaded via TikTok CAPI. No action required.',
        scope: { kind: 'audience', label: '2 custom audiences detected', items: [
          { id: 'aud_hot_buyers', label: 'Hot buyers — last 30D', meta: '1.2M users · CAPI' },
          { id: 'aud_cart_open',  label: 'Cart open — last 7D',   meta: '184K users · CAPI' },
        ]},
        solutions: [],
      },
    ];
  }

  // Required checks · Meta Import flow Step 3：必要检查 issues
  // 包含三个 issue：
  //   1. iss_required_pixel    —— TikTok Pixel 选择
  //   2. iss_required_identity —— TikTok Identity 选择
  //   3. iss_ai_creative_resize —— Automatic image resize（含 Crop preview 联动）
  // 全部 issue 必须 confirm 后才能进入 Apply。
  function getRequiredCheckIssues() {
    const cmpIds = Array.from(drawerState.selected.campaign);
    const cmps   = cmpIds.map(id => META_CAMPAIGNS.find(c => c.id === id)).filter(Boolean);

    // ----- Pixel candidates -----
    const pixelItems = cmps.map(c => ({
      id: c.id,
      label: c.name,
      campaign: c.name,
      meta: `Tracking · ${c.objective || 'Conversions'} · awaiting TikTok Pixel`,
    }));
    const pixelIssue = {
      id: 'iss_required_pixel',
      severity: 'warn',
      title: 'Bind a TikTok Pixel for tracking events',
      summary: 'Imported Meta campaigns rely on Meta Pixel events. Bind a TikTok Pixel to bridge them — without a chosen pixel, TikTok cannot optimize for conversions.',
      scope: {
        kind: 'campaign',
        label: `${pixelItems.length} campaign${pixelItems.length === 1 ? '' : 's'} need a TikTok Pixel`,
        items: pixelItems,
      },
      solutions: [
        { id: 'pixel_existing', label: 'Select an existing Pixel', recommended: true, apply: 'auto',    toolkitTools: [] },
        { id: 'pixel_later',    label: 'Finish import first, then create & bind a new Pixel', apply: 'toolkit', toolkitTools: [] },
      ],
    };

    // ----- Identity candidates -----
    const identityIssue = {
      id: 'iss_required_identity',
      severity: 'warn',
      title: 'Bind a TikTok Identity for ad delivery',
      summary: 'TikTok ads require an identity (TikTok account or Custom identity) to attach as the publisher. Choose which identity these imported campaigns should run under.',
      scope: {
        kind: 'campaign',
        label: `${cmps.length} campaign${cmps.length === 1 ? '' : 's'} need a TikTok Identity`,
        items: cmps.map(c => ({
          id: `${c.id}::identity`,
          label: c.name,
          campaign: c.name,
          meta: 'No identity attached',
        })),
      },
      solutions: [
        { id: 'identity_existing', label: 'Select an existing Identity', recommended: true, apply: 'auto',    toolkitTools: [] },
        { id: 'identity_later',    label: 'Finish import first, then create & bind a new Identity', apply: 'toolkit', toolkitTools: [] },
      ],
    };

    // ----- Automatic image resize（迁移自原 bulk-adapt review 内的 t_airesize 输出）-----
    // 使用与原 t_airesize 相同的素材模拟逻辑，但作用域为当前已选 Meta campaigns。
    const offRatio = [];
    cmps.forEach(c => {
      const ads = (c.ads != null) ? c.ads : 0;
      // META_CAMPAIGNS 没有 ads 数组结构，借用 META_CREATIVES 抽样填充
      for (let j = 0; j < Math.min(ads, 3); j++) {
        const cv = META_CREATIVES[(c.id.length + j) % META_CREATIVES.length];
        if (!cv) continue;
        const seed = (cv.photoId ? cv.photoId.length : 0) + (cv.id ? cv.id.length : 0) + j;
        let ratio = '9:16';
        if (seed % 2 === 0) ratio = '1:1';
        else if (seed % 3 === 0) ratio = '4:5';
        if (ratio !== '9:16') {
          offRatio.push({ id: cv.id, label: cv.name, meta: `${ratio} · ${cv.type || 'Image'} · ${c.name}` });
        }
      }
    });
    if (offRatio.length < 3) {
      const extras = [
        { id: 'cr_meta_1x1_lookalike', label: 'BF_Hero_Square_v1',     meta: '1:1 · Imported from Meta · awaiting reframe' },
        { id: 'cr_meta_45_holiday',    label: 'Holiday_Catalog_45',    meta: '4:5 · Imported from Meta · awaiting reframe' },
        { id: 'cr_meta_1x1_brand',     label: 'Brand_Hero_Cinemagraph',meta: '1:1 · awaiting reframe' },
      ];
      extras.forEach(e => { if (!offRatio.find(x => x.id === e.id)) offRatio.push(e); });
    }
    const resizeItems = offRatio.slice(0, 6);
    const ratioCounts = resizeItems.reduce((m, x) => {
      const r = (x.meta.match(/^(\d:\d|\d{1,2}:\d{1,2})/) || [])[1] || 'off-ratio';
      m[r] = (m[r] || 0) + 1; return m;
    }, {});
    const ratioSummary = Object.entries(ratioCounts).map(([k, v]) => `${v}× ${k}`).join(' · ');
    const resizeIssue = {
      id: 'iss_ai_creative_resize',
      severity: 'warn',
      title: 'Automatic image resize',
      summary: `${resizeItems.length} creatives are off-ratio (${ratioSummary}). TikTok in-feed prefers 9:16 — off-ratio assets get letter-boxed, reducing watch-time and reach. Automatic image resize uses subject tracking to reframe without losing the focal product.`,
      scope: { kind: 'creative', label: `${resizeItems.length} off-ratio creatives · ${ratioSummary}`, items: resizeItems },
      solutions: [
        { id: 'auto_916',    label: 'Auto-reframe to 9:16 with subject tracking', recommended: true, apply: 'auto',    toolkitTools: ['t_airesize'] },
        { id: 'auto_dual',   label: 'Generate dual outputs (9:16 + 1:1)',                              apply: 'auto',    toolkitTools: ['t_airesize'] },
        { id: 'review_each', label: 'Review each creative manually in editor',                           apply: 'toolkit', toolkitTools: ['t_airesize'] },
        { id: 'skip',        label: 'Keep originals (accept reduced delivery)',                          apply: 'auto',    toolkitTools: [] },
      ],
    };

    return [pixelIssue, identityIssue, resizeIssue];
  }

  // Toolkit-driven issues：bulk-adapt 模式下，根据用户在 Toolkit 中勾选的 tool 动态生成 issues。
  function getToolkitIssues() {
    const cmpIds = Array.from(drawerState.selected.campaign);
    // 优先从主表 DATA 取真实 row（含真实 spend / CTR / adGroups），找不到再回退到 META_CAMPAIGNS（保留 Meta Import 流程兼容）
    const realCmps = cmpIds.map(id => DATA.find(c => c.id === id)).filter(Boolean);
    const fallbackCmps = realCmps.length === 0
      ? cmpIds.map(id => META_CAMPAIGNS.find(c => c.id === id)).filter(Boolean)
      : [];
    const useReal = realCmps.length > 0;

    // 统一展平 ad group / ad，使两路数据源都有同样的 item shape
    const fmtMoney = (n) => `$${Math.round(n).toLocaleString()}`;
    const fmtPct   = (n) => `${n.toFixed(1)}%`;

    const allAdGroupRows = useReal
      ? realCmps.flatMap(c => c.adGroups.map(g => ({
          id: g.id,
          name: g.name,
          campaign: c.name,
          region: g.region,
          audience: g.audience,
          budget: g.budget,
          impressions: g.impressions,
          clicks: g.clicks,
          cost: g.cost,
          ctr: g.ctr,
          cpm: g.cpm,
          objective: g.objective,
          conversions: Math.max(2, Math.round((g.clicks || 0) * 0.05)),
        })))
      : fallbackCmps.flatMap(c => Array.from({ length: c.adsets }, (_, i) => ({
          id: `${c.id}::adset::${i + 1}`,
          name: `Ad set ${i + 1} — ${c.name.replace(/^Meta - /, '')}`,
          campaign: c.name,
          region: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'][i % 5],
          audience: ['Lookalike 1%', 'Retargeting 30d', 'Interest-based', 'Broad'][i % 4],
          budget: 320 + i * 40,
          impressions: 84000 + i * 12000,
          clicks: 1480 + i * 220,
          cost: 1860 + i * 320,
          ctr: 1.6 + (i % 3) * 0.4,
          cpm: 9.4 + (i % 4) * 1.1,
          objective: c.objective,
          conversions: 78 + i * 12,
        })));

    const allAdRows = useReal
      ? realCmps.flatMap(c => c.adGroups.flatMap(g => g.ads.map(ad => ({
          id: ad.id,
          name: ad.name,
          campaign: c.name,
          impressions: ad.impressions,
          clicks: ad.clicks,
          cost: ad.cost,
          ctr: ad.ctr,
          cpm: ad.cpm,
          creative: ad.creative,
        }))))
      : [];

    const totalAdGroups = allAdGroupRows.length || 1;

    // 真实场景模拟：用 cost / clicks / ctr 推算"切实"的诊断口径
    // ROAS 假设 = revenue / cost，revenue ≈ conversions * AOV（AOV 用 cost 量级反推一个稳定值）
    const ROAS_OF = (g) => {
      const conv = g.conversions || Math.max(2, Math.round(g.clicks * 0.05));
      const aov = 38 + ((g.id || '').charCodeAt(0) % 12) * 4; // 38–82
      const rev = conv * aov;
      return g.cost > 0 ? rev / g.cost : 0;
    };
    const CPA_OF = (g) => {
      const conv = g.conversions || Math.max(2, Math.round(g.clicks * 0.05));
      return conv > 0 ? g.cost / conv : g.cost;
    };

    // ---------- Scope 构造 ----------
    const winnerAdGroups = () => {
      // ROAS > 2.5 且 spend 不为 0 的 ad groups（top by ROAS）
      const list = allAdGroupRows
        .map(g => ({ ...g, roas: ROAS_OF(g) }))
        .filter(g => g.roas > 2.5 && g.cost > 50)
        .sort((a, b) => b.roas - a.roas);
      // 兜底：若没有，强制取 top 3 按 ROAS 排
      const pool = list.length ? list : allAdGroupRows.map(g => ({ ...g, roas: ROAS_OF(g) })).sort((a, b) => b.roas - a.roas).slice(0, 3);
      return pool.slice(0, Math.min(5, pool.length)).map(g => ({
        id: g.id,
        label: g.name,
        campaign: g.campaign,
        meta: `7d ROAS ${g.roas.toFixed(1)}× · spend ${fmtMoney(g.cost)} · pacing ${(0.62 + (g.budget % 7) * 0.04).toFixed(2)}`,
      }));
    };

    const loserAdGroups = () => {
      const target = 14; // 假设目标 CPA = $14
      const list = allAdGroupRows
        .map(g => ({ ...g, cpa: CPA_OF(g) }))
        .filter(g => g.cpa > target * 1.4 && g.cost > 80)
        .sort((a, b) => b.cpa - a.cpa);
      const pool = list.length ? list : allAdGroupRows.map(g => ({ ...g, cpa: CPA_OF(g) })).sort((a, b) => b.cpa - a.cpa).slice(0, 3);
      return pool.slice(0, Math.min(5, pool.length)).map(g => ({
        id: g.id,
        label: g.name,
        campaign: g.campaign,
        meta: `CPA ${fmtMoney(g.cpa)} (target $14) · 5d streak · spend ${fmtMoney(g.cost)}`,
      }));
    };

    const fatiguedCreatives = () => {
      // 选 ad（含 creative）按 CTR 升序前几条作为"疲劳创意"
      const ads = allAdRows.length
        ? [...allAdRows].sort((a, b) => a.ctr - b.ctr).slice(0, 4)
        : [];
      if (ads.length === 0) {
        // fallback：从 cmps 的 creativeIds 取
        return fallbackCmps.flatMap(c => (c.creativeIds || [])).slice(0, 3).map(id => {
          const cv = META_CREATIVES.find(x => x.id === id);
          return cv ? { id: cv.id, label: cv.name, meta: `${cv.type} · ${cv.size} · CTR 0.9% (peak 1.6%)` } : null;
        }).filter(Boolean);
      }
      return ads.map(a => ({
        id: a.id,
        label: a.creative?.name || a.name,
        campaign: a.campaign,
        meta: `${a.creative?.type || 'Video'} · CTR ${fmtPct(a.ctr)} (peak ${fmtPct(a.ctr * 1.45)}) · spend ${fmtMoney(a.cost)}`,
      }));
    };

    const prospectingNoExclusion = () => {
      // 假设 audience 名包含 "Lookalike" 或 "Interest" 或 "Broad" 的算 prospecting
      const list = allAdGroupRows.filter(g => /lookalike|interest|broad/i.test(g.audience || ''));
      const pool = list.length ? list : allAdGroupRows.slice(0, 3);
      return pool.slice(0, 4).map(g => ({
        id: g.id,
        label: g.name,
        campaign: g.campaign,
        meta: `${g.audience} · ${g.region} · spend ${fmtMoney(g.cost)} · CPA ${fmtMoney(CPA_OF(g))}`,
      }));
    };

    const winningLAL = () => {
      const list = allAdGroupRows
        .filter(g => /lookalike\s*1%/i.test(g.audience || '') && ROAS_OF(g) > 2)
        .sort((a, b) => ROAS_OF(b) - ROAS_OF(a));
      const pool = list.length ? list : allAdGroupRows.slice(0, 2).map(g => ({ ...g, audience: 'Lookalike 1%' }));
      return pool.slice(0, 3).map(g => ({
        id: g.id,
        label: g.name,
        campaign: g.campaign,
        meta: `LAL 1% · ${g.region} · ROAS ${ROAS_OF(g).toFixed(1)}× · spend ${fmtMoney(g.cost)}`,
      }));
    };

    const trackingCampaigns = () => {
      // EMQ 黄色：对每个 campaign 算一个稳定的 EMQ 分（5.8–7.6）
      const cmps = useReal ? realCmps : fallbackCmps;
      return cmps.map(c => {
        const emq = (5.8 + ((c.id || '').charCodeAt((c.id || '').length - 1) % 9) * 0.2).toFixed(1);
        const monthly = useReal ? c.cost : 12000 + (c.id || '').length * 850;
        return {
          id: c.id,
          label: c.name,
          campaign: c.name,
          meta: `EMQ ${emq}/10 · yellow · 30d spend ${fmtMoney(monthly)}`,
        };
      });
    };

    // ---------- TEMPLATES：tool id → issue 工厂 ----------
    const TEMPLATES = {
      // ===== Budget & bidding =====
      t_boost_winners: () => {
        const items = winnerAdGroups();
        const totalSpend = items.reduce((s, x) => s + (parseFloat(x.meta.match(/spend \$([\d,]+)/)?.[1].replace(/,/g, '')) || 0), 0);
        return {
          id: 'iss_boost_winners', severity: 'warn',
          title: `${items.length} ad group${items.length > 1 ? 's' : ''} qualify for a budget boost`,
          summary: `These ad groups posted 7-day ROAS above 2.5× with pacing under cap. Combined spend ${fmtMoney(totalSpend)} — there's headroom to scale before auction prices climb.`,
          scope: { kind: 'adset', label: `${items.length} qualifying ad group${items.length > 1 ? 's' : ''} · combined spend ${fmtMoney(totalSpend)}`, items },
          solutions: [
            { id: 'plus20', label: 'Boost +20% budget',          recommended: true, apply: 'auto',    toolkitTools: ['t_boost_winners'] },
            { id: 'plus35', label: 'Boost +35% (aggressive)',                       apply: 'auto',    toolkitTools: ['t_boost_winners'] },
            { id: 'hold',   label: 'Hold and review next week',                     apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_cap_losers: () => {
        const items = loserAdGroups();
        return {
          id: 'iss_cap_losers', severity: 'warn',
          title: `${items.length} ad group${items.length > 1 ? 's' : ''} have CPA above target for 5+ days`,
          summary: `Persistent under-performers — CPA running ~1.4× target. Reducing budget releases dollars for the boost-winners action above.`,
          scope: { kind: 'adset', label: `${items.length} ad group${items.length > 1 ? 's' : ''} flagged · target CPA $14`, items },
          solutions: [
            { id: 'cut30',  label: 'Reduce budget by 30%', recommended: true, apply: 'auto',    toolkitTools: ['t_cap_losers'] },
            { id: 'cut50',  label: 'Reduce budget by 50%',                    apply: 'auto',    toolkitTools: ['t_cap_losers'] },
            { id: 'pause',  label: 'Pause these ad groups',                   apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_pause_zerospend: () => {
        // 选 spend 最低的几个 ad
        const items = (allAdRows.length ? [...allAdRows].sort((a, b) => a.cost - b.cost).slice(0, 4) : [])
          .map(a => ({
            id: a.id, label: a.name, campaign: a.campaign,
            meta: `Spend ${fmtMoney(a.cost)} in last 48h · ${a.impressions.toLocaleString()} impressions`,
          }));
        return {
          id: 'iss_pause_zerospend', severity: 'warn',
          title: `${items.length} low-delivery ad${items.length > 1 ? 's' : ''} starving the auction`,
          summary: `These ads barely cleared the auction in the last 48h — losing competitive impressions. Decluttering them lets winners breathe.`,
          scope: { kind: 'ad', label: `${items.length} ad${items.length > 1 ? 's' : ''} with low delivery`, items },
          solutions: [
            { id: 'pause', label: 'Pause low-delivery ads', recommended: true, apply: 'auto',    toolkitTools: ['t_pause_zerospend'] },
            { id: 'bidup', label: 'Raise bid by 15%',                          apply: 'auto',    toolkitTools: [] },
            { id: 'keep',  label: 'Keep monitoring',                           apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_bid_floor: () => {
        const items = allAdGroupRows.slice(0, 4).map(g => ({
          id: g.id, label: g.name, campaign: g.campaign,
          meta: `Current bid $${(g.cpm * 0.78).toFixed(2)} · auction p25 $${(g.cpm * 0.92).toFixed(2)}`,
        }));
        return {
          id: 'iss_bid_floor', severity: 'warn',
          title: `${items.length} ad group${items.length > 1 ? 's' : ''} bidding below auction floor`,
          summary: 'Min bid is below the 25th-percentile auction price — these ad groups are losing impression share. Apply a smart floor to keep them competitive.',
          scope: { kind: 'adset', label: `${items.length} ad group${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'floor15', label: 'Floor at p25 + 15%', recommended: true, apply: 'auto',    toolkitTools: ['t_bid_floor'] },
            { id: 'floor25', label: 'Floor at p25 + 25%',                    apply: 'auto',    toolkitTools: ['t_bid_floor'] },
            { id: 'manual',  label: 'Manual bid review',                     apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_bid_ceiling: () => {
        const median = allAdGroupRows.length
          ? [...allAdGroupRows].map(g => g.cpm).sort((a, b) => a - b)[Math.floor(allAdGroupRows.length / 2)]
          : 9.5;
        const items = allAdGroupRows.filter(g => g.cpm > median * 1.6).slice(0, 4)
          .map(g => ({
            id: g.id, label: g.name, campaign: g.campaign,
            meta: `CPM $${g.cpm.toFixed(2)} · ${(g.cpm / median).toFixed(1)}× account median`,
          }));
        const fallbackItems = items.length ? items : allAdGroupRows.slice(0, 3).map(g => ({
          id: g.id, label: g.name, campaign: g.campaign,
          meta: `CPM $${g.cpm.toFixed(2)} · ${((g.cpm / median) * 1.8).toFixed(1)}× account median`,
        }));
        return {
          id: 'iss_bid_ceiling', severity: 'warn',
          title: `${fallbackItems.length} ad group${fallbackItems.length > 1 ? 's' : ''} with runaway CPMs`,
          summary: `CPMs exceeding ~2× the account median ($${median.toFixed(2)}). Internal demand is bidding itself up — cap to protect efficiency.`,
          scope: { kind: 'adset', label: `${fallbackItems.length} ad group${fallbackItems.length > 1 ? 's' : ''}`, items: fallbackItems },
          solutions: [
            { id: 'cap18', label: 'Cap CPM at 1.8× median', recommended: true, apply: 'auto',    toolkitTools: ['t_bid_ceiling'] },
            { id: 'cap22', label: 'Cap CPM at 2.2× median',                    apply: 'auto',    toolkitTools: ['t_bid_ceiling'] },
            { id: 'review', label: 'Review per ad group',                       apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_pacing_smooth: () => {
        const items = allAdGroupRows.slice(0, 3).map((g, i) => ({
          id: g.id, label: g.name, campaign: g.campaign,
          meta: `${[68, 73, 81][i % 3]}% spent before noon · daily cap ${fmtMoney(g.budget)}`,
        }));
        return {
          id: 'iss_pacing_smooth', severity: 'warn',
          title: `${items.length} ad group${items.length > 1 ? 's' : ''} are front-loading spend`,
          summary: 'These ad groups burn the bulk of daily budget before noon, missing evening high-intent traffic. Even pacing improves conversion-window coverage.',
          scope: { kind: 'adset', label: `${items.length} ad group${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'even', label: 'Switch to even pacing', recommended: true, apply: 'auto',    toolkitTools: ['t_pacing_smooth'] },
            { id: 'std',  label: 'Switch to standard pacing',                apply: 'auto',    toolkitTools: ['t_pacing_smooth'] },
            { id: 'keep', label: 'Keep accelerated pacing',                  apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },

      // ===== Creative health =====
      t_refresh_fatigue: () => {
        const items = fatiguedCreatives();
        return {
          id: 'iss_refresh_fatigue', severity: 'warn',
          title: `${items.length} creative${items.length > 1 ? 's' : ''} fatigued — CTR down ≥ 25% from peak`,
          summary: `These creatives have lost more than a quarter of their CTR from peak in the last 7 days. Replace them with fresh variants before they drag CPA further.`,
          scope: { kind: 'creative', label: `${items.length} fatigued creative${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'auto',   label: 'Auto-replace with backup variants', recommended: true, apply: 'auto',    toolkitTools: ['t_refresh_fatigue'] },
            { id: 'pause',  label: 'Pause and request new creative',                       apply: 'auto',    toolkitTools: [] },
            { id: 'hooks',  label: 'Refresh hooks only (keep body)',                       apply: 'toolkit', toolkitTools: ['t_hook_boost'] },
          ],
        };
      },
      t_hook_boost: () => {
        const items = (allAdRows.length ? [...allAdRows].sort((a, b) => a.ctr - b.ctr).slice(0, 3) : [])
          .map(a => ({
            id: a.id, label: a.creative?.name || a.name, campaign: a.campaign,
            meta: `Hook rate ${(a.ctr * 0.6).toFixed(1)}% · 3s VTR ${(a.ctr * 8).toFixed(0)}% · median ${(a.ctr * 1.4).toFixed(1)}%`,
          }));
        return {
          id: 'iss_hook_boost', severity: 'warn',
          title: `${items.length} creative${items.length > 1 ? 's' : ''} with weak first 1.5s hook`,
          summary: 'Hook rate (3s view-through) is below account median. Re-cut openings so the product / face / promise lands inside the first 1.5 seconds.',
          scope: { kind: 'creative', label: `${items.length} creative${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'aicut',  label: 'AI re-cut openings', recommended: true, apply: 'auto',    toolkitTools: ['t_hook_boost'] },
            { id: 'manual', label: 'Manual storyboard rework',               apply: 'toolkit', toolkitTools: [] },
            { id: 'keep',   label: 'Keep current openings',                  apply: 'auto',    toolkitTools: [] },
          ],
        };
      },
      t_caption_on: () => {
        const items = (allAdRows.filter(a => /video|story|reels/i.test(a.creative?.type || '')).slice(0, 3))
          .map(a => ({
            id: a.id, label: a.creative?.name || a.name, campaign: a.campaign,
            meta: `${a.creative?.type || 'Video'} · sound-off VTR ${(a.ctr * 6).toFixed(0)}% · no captions`,
          }));
        const pool = items.length ? items : [{
          id: 'cv_default', label: 'Holiday Hero Video', meta: 'Video · sound-off VTR 41% · no captions',
        }];
        return {
          id: 'iss_caption_on', severity: 'warn',
          title: `${pool.length} video${pool.length > 1 ? 's' : ''} missing burnt-in captions`,
          summary: 'Sound-off VTR is bleeding without captions. Bake captions into these videos to recover view-through on muted feeds.',
          scope: { kind: 'creative', label: `${pool.length} video${pool.length > 1 ? 's' : ''} without captions`, items: pool },
          solutions: [
            { id: 'autogen', label: 'Auto-generate + auto-translate', recommended: true, apply: 'auto',    toolkitTools: ['t_caption_on'] },
            { id: 'srt',     label: 'Upload SRT manually',                                apply: 'toolkit', toolkitTools: [] },
            { id: 'skip',    label: 'Skip captions',                                      apply: 'auto',    toolkitTools: [] },
          ],
        };
      },
      t_thumb_pick: () => {
        const items = fatiguedCreatives().slice(0, 3).map(it => ({
          ...it,
          meta: `Current thumb CTR 0.9% · best alt 1.4× higher`,
        }));
        return {
          id: 'iss_thumb_pick', severity: 'warn',
          title: `${items.length} creative${items.length > 1 ? 's' : ''} have a higher-CTR thumbnail available`,
          summary: 'Auto-generated thumbnails with > 1.4× higher CTR are sitting unused. Switching them in is a near-zero-cost lift.',
          scope: { kind: 'creative', label: `${items.length} creative${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'pick', label: 'Pick highest-CTR thumbnail', recommended: true, apply: 'auto',    toolkitTools: ['t_thumb_pick'] },
            { id: 'ab',   label: 'A/B test top 2 thumbnails',                     apply: 'auto',    toolkitTools: [] },
            { id: 'keep', label: 'Keep current thumbnail',                        apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_variant_gen: () => {
        const items = (allAdRows.length ? [...allAdRows].sort((a, b) => b.ctr - a.ctr).slice(0, 3) : [])
          .map(a => ({
            id: a.id, label: a.creative?.name || a.name, campaign: a.campaign,
            meta: `Top performer · CTR ${fmtPct(a.ctr)} · spend ${fmtMoney(a.cost)} · running solo`,
          }));
        return {
          id: 'iss_variant_gen', severity: 'warn',
          title: `${items.length} winning creative${items.length > 1 ? 's' : ''} lack A/B variants`,
          summary: 'Top performers are running solo with no testing partners. Spawn variants now so the next refresh cycle has fresh fuel.',
          scope: { kind: 'creative', label: `${items.length} creative${items.length > 1 ? 's' : ''} eligible for variants`, items },
          solutions: [
            { id: 'spawn3', label: 'Spawn 3 hook + caption variants', recommended: true, apply: 'auto',    toolkitTools: ['t_variant_gen'] },
            { id: 'spawn5', label: 'Spawn 5 variants (more spend)',                       apply: 'auto',    toolkitTools: ['t_variant_gen'] },
            { id: 'hooks',  label: 'Spawn hook variants only',                            apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },

      // ===== Audience tuning =====
      t_exclude_buyers: () => {
        const items = prospectingNoExclusion();
        return {
          id: 'iss_exclude_buyers', severity: 'warn',
          title: `${items.length} prospecting ad group${items.length > 1 ? 's' : ''} still showing to recent buyers`,
          summary: `These prospecting groups don't exclude users who purchased in the last 14 days, inflating CPA and re-spending on the same audience.`,
          scope: { kind: 'adset', label: `${items.length} prospecting ad group${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'd14', label: 'Exclude 14d purchasers', recommended: true, apply: 'auto',    toolkitTools: ['t_exclude_buyers'] },
            { id: 'd30', label: 'Exclude 30d purchasers',                    apply: 'auto',    toolkitTools: ['t_exclude_buyers'] },
            { id: 'no',  label: 'No exclusion (high LTV product)',           apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_lal_expand: () => {
        const items = winningLAL();
        return {
          id: 'iss_lal_expand', severity: 'warn',
          title: `${items.length} winning lookalike${items.length > 1 ? 's' : ''} ready to expand`,
          summary: `These seeds posted ROAS > 2× on a 1% LAL — there's reach being left on the table. Expand the lookalike size to scale incrementally.`,
          scope: { kind: 'adset', label: `${items.length} lookalike ad group${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'lal13', label: 'Expand to 1–3% LAL', recommended: true, apply: 'auto',    toolkitTools: ['t_lal_expand'] },
            { id: 'lal15', label: 'Expand to 1–5% (aggressive)',           apply: 'auto',    toolkitTools: ['t_lal_expand'] },
            { id: 'hold',  label: 'Hold at 1%',                            apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_retarget_warm: () => {
        const items = [
          { id: 'aud_view_75_30d', label: 'Video viewers ≥ 75% — last 30D', meta: '~ 248K users · 12 videos sourced' },
          { id: 'aud_view_50_30d', label: 'Video viewers ≥ 50% — last 30D', meta: '~ 412K users · 12 videos sourced' },
          { id: 'aud_view_95_30d', label: 'Video viewers ≥ 95% — last 30D', meta: '~ 88K users · 12 videos sourced'  },
        ];
        return {
          id: 'iss_retarget_warm', severity: 'warn',
          title: 'Warm video viewers not being retargeted',
          summary: 'Users who watched a meaningful chunk of any video in the last 30 days are not feeding any retargeting audience. Build one to harvest this warm pool.',
          scope: { kind: 'audience', label: 'Eligible warm-viewer cohorts', items },
          solutions: [
            { id: 'v75', label: 'Build from ≥ 75% viewers', recommended: true, apply: 'auto',    toolkitTools: ['t_retarget_warm'] },
            { id: 'v50', label: 'Build from ≥ 50% viewers (broader)',           apply: 'auto',    toolkitTools: ['t_retarget_warm'] },
            { id: 'v95', label: 'Build from ≥ 95% viewers (premium)',           apply: 'auto',    toolkitTools: ['t_retarget_warm'] },
          ],
        };
      },
      t_block_lowq: () => {
        const items = [
          { id: 'plc_audience_network', label: 'Audience Network (long-tail)', meta: 'VTR 14% · 14d spend $2,840' },
          { id: 'plc_in_stream_misc',   label: 'In-stream — uncategorized',    meta: 'VTR 17% · 14d spend $1,920' },
          { id: 'plc_search_partners',  label: 'Search partners',              meta: 'VTR 19% · 14d spend $1,460' },
        ];
        return {
          id: 'iss_block_lowq', severity: 'warn',
          title: '3 placements detected with VTR below threshold',
          summary: 'These placements have VTR < 20% over the last 14 days — usually bot-like or misattributed inventory. Excluding them sharpens spend on real users.',
          scope: { kind: 'adset', label: `3 placements flagged · combined 14d spend $6,220`, items },
          solutions: [
            { id: 'block', label: 'Block these placements', recommended: true, apply: 'auto',    toolkitTools: ['t_block_lowq'] },
            { id: 'half',  label: 'Reduce delivery 50% only',                  apply: 'auto',    toolkitTools: ['t_block_lowq'] },
            { id: 'keep',  label: 'Keep all placements',                       apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_geo_concentrate: () => {
        const items = [
          { id: 'geo_us', label: 'United States — 42% of conversions', meta: 'CPA $11.20 · 7d spend $9,840' },
          { id: 'geo_ca', label: 'Canada — 18%',                       meta: 'CPA $12.80 · 7d spend $4,210' },
          { id: 'geo_uk', label: 'United Kingdom — 11%',               meta: 'CPA $13.40 · 7d spend $2,580' },
          { id: 'geo_au', label: 'Australia — 6%',                     meta: 'CPA $14.10 · 7d spend $1,420' },
          { id: 'geo_de', label: 'Germany — 5%',                       meta: 'CPA $14.80 · 7d spend $1,180' },
          { id: 'geo_tail', label: '32 other regions — 18% combined',  meta: 'CPA $26.40 · 7d spend $4,720 (long tail)' },
        ];
        return {
          id: 'iss_geo_concentrate', severity: 'warn',
          title: 'Long-tail regions diluting spend',
          summary: 'Top 5 regions produce 82% of conversions; the remaining 32 regions consume 18% of spend at 2× the CPA.',
          scope: { kind: 'adset', label: '5 winners vs. 32 long-tail regions', items },
          solutions: [
            { id: 'top5',  label: 'Limit to top 5 regions', recommended: true, apply: 'auto',    toolkitTools: ['t_geo_concentrate'] },
            { id: 'top10', label: 'Top 10 regions',                             apply: 'auto',    toolkitTools: ['t_geo_concentrate'] },
            { id: 'all',   label: 'Keep all regions',                           apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },

      // ===== Catalog & product =====
      t_promote_winners: () => {
        const items = [
          { id: 'cat_apparel', label: 'Apparel Master Catalog', meta: '4,218 SKUs · top-10% ROAS 4.6× · bottom-10% ROAS 0.7×' },
          { id: 'cat_beauty',  label: 'Beauty Holiday Catalog', meta: '832 SKUs · top-10% ROAS 5.2× · bottom-10% ROAS 0.9×' },
        ];
        return {
          id: 'iss_promote_winners', severity: 'warn',
          title: `${items.length} catalogs mixing top and bottom SKUs`,
          summary: 'Top-10% ROAS SKUs are competing against bottom-10% inside the same ad set, raising internal CPM. Promote winners into a Featured set, demote losers out of rotation.',
          scope: { kind: 'catalog', label: `${items.length} catalogs · 5,050 total SKUs`, items },
          solutions: [
            { id: 'both',   label: 'Promote top, demote bottom', recommended: true, apply: 'auto',    toolkitTools: ['t_promote_winners'] },
            { id: 'promo',  label: 'Promote winners only',                          apply: 'auto',    toolkitTools: ['t_promote_winners'] },
            { id: 'manual', label: 'Manual SKU sort',                               apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_pause_oos: () => {
        const items = [
          { id: 'cat_apparel', label: 'Apparel Master Catalog', meta: '186 OOS SKUs of 4,218 (4.4%)' },
          { id: 'cat_elec',    label: 'Electronics SKU Set',    meta: '94 OOS SKUs of 1,156 (8.1%)' },
        ];
        return {
          id: 'iss_pause_oos', severity: 'warn',
          title: `Out-of-stock SKUs still serving in ${items.length} catalogs`,
          summary: '280 SKUs with stock = 0 served 18,400 impressions in the last 24h — wasted spend and broken landing pages.',
          scope: { kind: 'catalog', label: `${items.length} catalogs · 280 OOS SKUs`, items },
          solutions: [
            { id: 'pause', label: 'Auto-pause OOS SKUs', recommended: true, apply: 'auto',    toolkitTools: ['t_pause_oos'] },
            { id: 'lower', label: 'Lower their bid 80%',                    apply: 'auto',    toolkitTools: [] },
            { id: 'keep',  label: 'Keep serving (back-in-stock soon)',      apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_price_refresh: () => {
        const items = [
          { id: 'cat_apparel', label: 'Apparel Master Catalog', meta: 'Last sync 38h ago · Shopify Feed' },
          { id: 'cat_beauty',  label: 'Beauty Holiday Catalog', meta: 'Last sync 26h ago · Shopify Feed' },
        ];
        return {
          id: 'iss_price_refresh', severity: 'warn',
          title: 'Stale price & sale tags',
          summary: 'Product feeds were last refreshed more than 24 hours ago — prices, sale flags and availability may have drifted. Refresh now to keep ads honest.',
          scope: { kind: 'catalog', label: `${items.length} catalogs out of sync`, items },
          solutions: [
            { id: 'now',    label: 'Refresh feed now', recommended: true, apply: 'auto',    toolkitTools: ['t_price_refresh'] },
            { id: 'hourly', label: 'Schedule hourly refresh',              apply: 'auto',    toolkitTools: ['t_price_refresh'] },
            { id: 'later',  label: 'Manual refresh later',                 apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_dedup_skus: () => {
        const items = [
          { id: 'cat_apparel', label: 'Apparel Master Catalog', meta: '142 duplicate variants across 8 ad sets' },
        ];
        return {
          id: 'iss_dedup_skus', severity: 'warn',
          title: 'Duplicate SKU variants competing in the same ad set',
          summary: '142 same-SKU variants (color / size) appear in multiple ad sets, driving up internal CPM by ~9% via self-bidding.',
          scope: { kind: 'catalog', label: `1 catalog · 142 duplicate variants`, items },
          solutions: [
            { id: 'merge', label: 'Auto-merge duplicates', recommended: true, apply: 'auto',    toolkitTools: ['t_dedup_skus'] },
            { id: 'flag',  label: 'Flag for manual merge',                    apply: 'toolkit', toolkitTools: [] },
            { id: 'keep',  label: 'Keep duplicates',                          apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Tracking & quality =====
      t_event_match: () => {
        const items = trackingCampaigns();
        return {
          id: 'iss_event_match', severity: 'warn',
          title: `Event Match Quality (EMQ) is yellow on ${items.length} campaign${items.length > 1 ? 's' : ''}`,
          summary: `EMQ is below the 8.0 green threshold — TikTok's match-back is missing ~14% of attributed conversions. Sending hashed email + phone via CAPI lifts EMQ into green.`,
          scope: { kind: 'campaign', label: `${items.length} campaign${items.length > 1 ? 's' : ''} below 8.0`, items },
          solutions: [
            { id: 'full',  label: 'Enable hashed email + phone (CAPI)', recommended: true, apply: 'auto',    toolkitTools: ['t_event_match'] },
            { id: 'email', label: 'Hashed email only',                                       apply: 'auto',    toolkitTools: ['t_event_match'] },
            { id: 'skip',  label: 'Skip — privacy review pending',                           apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_dedup_events: () => {
        const cmps = useReal ? realCmps : fallbackCmps;
        const items = cmps.map(c => ({
          id: c.id, label: c.name, campaign: c.name,
          meta: `Pixel + CAPI both firing · no event_id · ~12% inflation`,
        }));
        return {
          id: 'iss_dedup_events', severity: 'warn',
          title: `Pixel + CAPI duplication on ${items.length} campaign${items.length > 1 ? 's' : ''}`,
          summary: 'Browser Pixel and server CAPI events both fire without a shared event_id, inflating reported conversions by ~12%. Add event_id to dedupe.',
          scope: { kind: 'campaign', label: `${items.length} campaign${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'eid',    label: 'Add event_id dedup', recommended: true, apply: 'auto',    toolkitTools: ['t_dedup_events'] },
            { id: 'server', label: 'Use server-only events',                 apply: 'auto',    toolkitTools: ['t_dedup_events'] },
            { id: 'keep',   label: 'Keep duplicates (not recommended)',      apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_attr_window: () => {
        const items = allAdGroupRows.slice(0, 4).map((g, i) => ({
          id: g.id, label: g.name, campaign: g.campaign,
          meta: `${['7d-click / 1d-view', '1d-click / 1d-view', '7d-click / 7d-view', '14d-click / 1d-view'][i % 4]} · custom`,
        }));
        return {
          id: 'iss_attr_window', severity: 'warn',
          title: `${items.length} ad group${items.length > 1 ? 's' : ''} use inconsistent attribution windows`,
          summary: 'Different ad groups use different click / view windows — ROAS becomes incomparable across the account. Standardize to make decisions defensible.',
          scope: { kind: 'adset', label: `${items.length} ad group${items.length > 1 ? 's' : ''}`, items },
          solutions: [
            { id: 'std71',  label: 'Standardize 7d-click / 1d-view', recommended: true, apply: 'auto',    toolkitTools: ['t_attr_window'] },
            { id: 'std11',  label: 'Standardize 1d-click / 1d-view',                    apply: 'auto',    toolkitTools: ['t_attr_window'] },
            { id: 'custom', label: 'Keep custom per ad group',                          apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },
      t_funnel_check: () => {
        const items = [
          { id: 'evt_atc',       label: 'AddToCart',        meta: 'Firing · 12,420 / day' },
          { id: 'evt_initckout', label: 'InitiateCheckout', meta: 'Missing · expected ~6,200 / day' },
          { id: 'evt_addinfo',   label: 'AddPaymentInfo',   meta: 'Missing · expected ~3,100 / day' },
          { id: 'evt_purchase',  label: 'Purchase',         meta: 'Firing · 884 / day' },
        ];
        return {
          id: 'iss_funnel_check', severity: 'warn',
          title: 'Funnel coverage gaps detected',
          summary: 'AddToCart fires but InitiateCheckout and AddPaymentInfo are silent — likely missing implementation. Without mid-funnel events, optimization can\'t learn.',
          scope: { kind: 'campaign', label: '2 of 4 mid-funnel events missing', items },
          solutions: [
            { id: 'capi',   label: 'Add missing events via CAPI', recommended: true, apply: 'auto',    toolkitTools: ['t_funnel_check'] },
            { id: 'manual', label: 'Manual event mapping',                            apply: 'toolkit', toolkitTools: [] },
            { id: 'skip',   label: 'Skip funnel audit',                               apply: 'auto',    toolkitTools: [] },
          ],
        };
      },
      // ===== Creative health · Automatic image resize =====
      // 扫描选中 campaign 下所有创意，列出与 TikTok 9:16 不匹配的素材，并提供批量重构方案。
      t_airesize: () => {
        // 从当前 selectedCampaigns（兜底用前 5 条）所属 campaigns 中收集"非 9:16"创意作为模拟项
        const sourceIds = (typeof selectedCampaigns !== 'undefined' && selectedCampaigns.size)
          ? Array.from(selectedCampaigns)
          : (filters[currentPreset] || filters.all)().slice(0, 5).map(c => c.id);
        const sourceCampaigns = DATA.filter(c => sourceIds.includes(c.id));
        const offRatio = [];
        sourceCampaigns.forEach(c => {
          (c.ads || []).forEach(ad => {
            const cr = ad.creative;
            if (!cr) return;
            // 模拟：把 photoId 偶数视作 1:1，奇数 mod 3 == 0 视作 4:5
            const seed = (cr.photoId || 0) + (cr.id ? cr.id.length : 0);
            let ratio = '9:16';
            if (seed % 2 === 0) ratio = '1:1';
            else if (seed % 3 === 0) ratio = '4:5';
            if (ratio !== '9:16') {
              offRatio.push({
                id: cr.id,
                label: cr.name || ad.name,
                meta: `${ratio} · ${ad.name} · ${c.name}`,
              });
            }
          });
        });
        // 不少于 3 条以保证 demo 视觉
        if (offRatio.length < 3) {
          const extras = [
            { id: 'cr_meta_1x1_lookalike', label: 'BF_Hero_Square_v1', meta: '1:1 · Imported from Meta · awaiting reframe' },
            { id: 'cr_meta_45_holiday',    label: 'Holiday_Catalog_45', meta: '4:5 · Imported from Meta · awaiting reframe' },
            { id: 'cr_meta_1x1_brand',     label: 'Brand_Hero_Cinemagraph', meta: '1:1 · awaiting reframe' },
          ];
          extras.forEach(e => { if (!offRatio.find(x => x.id === e.id)) offRatio.push(e); });
        }
        const items = offRatio.slice(0, 6);
        const ratioCounts = items.reduce((m, x) => {
          const r = (x.meta.match(/^(\d:\d|\d{1,2}:\d{1,2})/) || [])[1] || 'off-ratio';
          m[r] = (m[r] || 0) + 1; return m;
        }, {});
        const ratioSummary = Object.entries(ratioCounts).map(([k, v]) => `${v}× ${k}`).join(' · ');

        return {
          id: 'iss_ai_creative_resize', severity: 'warn',
          title: `${items.length} creatives are off-ratio for TikTok native`,
          summary: `These creatives are ${ratioSummary}. TikTok in-feed prefers 9:16 — off-ratio assets get letter-boxed, reducing watch-time and reach. Automatic image resize uses subject tracking to reframe without losing the focal product.`,
          scope: { kind: 'creative', label: `${items.length} off-ratio creatives · ${ratioSummary}`, items },
          solutions: [
            { id: 'auto_916',   label: 'Auto-reframe to 9:16 with subject tracking', recommended: true, apply: 'auto',    toolkitTools: ['t_airesize'] },
            { id: 'auto_dual',  label: 'Generate dual outputs (9:16 + 1:1)',                              apply: 'auto',    toolkitTools: ['t_airesize'] },
            { id: 'review_each',label: 'Review each creative manually in editor',                          apply: 'toolkit', toolkitTools: ['t_airesize'] },
            { id: 'skip',       label: 'Keep originals (accept reduced delivery)',                         apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Quick edits · Smart+ 一键升级 =====
      t_smartplus_upgrade: () => {
        // 从当前数据中挑选未启用 Smart+ 的广告组（用 fromMeta + 抽样模拟）
        const candidates = DATA.filter(c => !c.smartPlus).slice(0, 5);
        const items = candidates.map(c => ({
          id: c.id,
          label: c.name,
          meta: `Manual mode · ${c.adGroups || 1} ad group${(c.adGroups || 1) > 1 ? 's' : ''} · 7d ROAS ${(c.roas || 1.6).toFixed(1)}x`,
        }));
        return {
          id: 'iss_smartplus_upgrade', severity: 'warn',
          title: `${items.length} campaigns can upgrade to Smart+ mode`,
          summary: 'Smart+ lets the system auto-tune bid, audience and creative selection. On similar accounts we see +15% ROAS and 30% less manual maintenance. Recommended for steady-state campaigns past learning phase.',
          scope: { kind: 'campaign', label: `${items.length} eligible campaigns`, items },
          solutions: [
            { id: 'all',     label: 'Upgrade all eligible campaigns', recommended: true, apply: 'auto',    toolkitTools: ['t_smartplus_upgrade'] },
            { id: 'top',     label: 'Upgrade top-3 ROAS campaigns first',                  apply: 'auto',    toolkitTools: ['t_smartplus_upgrade'] },
            { id: 'review',  label: 'Review per campaign in toolkit',                      apply: 'toolkit', toolkitTools: ['t_smartplus_upgrade'] },
            { id: 'skip',    label: 'Keep manual mode',                                    apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Quick edits · 批量调整设置 =====
      t_bulk_settings: () => {
        const targets = (filters[currentPreset] || filters.all)().slice(0, 8);
        const items = targets.map(c => ({
          id: c.id,
          label: c.name,
          meta: `Budget $${(c.dailyBudget || 50).toFixed(0)} · Bid ${c.bidStrategy || 'Lowest cost'} · ${c.adGroups || 1} ad group${(c.adGroups || 1) > 1 ? 's' : ''}`,
        }));
        return {
          id: 'iss_bulk_settings', severity: 'info',
          title: `Bulk-edit settings on ${items.length} campaigns`,
          summary: 'Apply uniform changes across multiple campaigns: budget, bid strategy, optimization goal, tracking URLs and naming. Useful right after Meta import or seasonal kickoff to standardize.',
          scope: { kind: 'campaign', label: `${items.length} campaigns selected`, items },
          solutions: [
            { id: 'budget',   label: 'Set daily budget to $80',                       recommended: true, apply: 'auto',    toolkitTools: ['t_bulk_settings'] },
            { id: 'bid',      label: 'Switch bid strategy to Cost cap',                                   apply: 'auto',    toolkitTools: ['t_bulk_settings'] },
            { id: 'tracking', label: 'Apply standard UTM template',                                       apply: 'auto',    toolkitTools: ['t_bulk_settings'] },
            { id: 'manual',   label: 'Open bulk edit form (custom fields)',                               apply: 'toolkit', toolkitTools: ['t_bulk_settings'] },
          ],
        };
      },

      // ===== Creative health · 创意批量补充 =====
      t_creative_bulk_add: () => {
        const targets = (filters[currentPreset] || filters.all)().slice(0, 5);
        const items = targets.map(c => ({
          id: c.id,
          label: c.name,
          meta: `${c.ads?.length || 2} active creatives · pool < 4 (fatigue risk)`,
        }));
        return {
          id: 'iss_creative_bulk_add', severity: 'warn',
          title: `${items.length} ad groups have under-stocked creative pools`,
          summary: 'When fewer than 4 creatives are active per ad group, frequency climbs and CTR decays within 7 days. Pull from your library to keep variation alive and let the auction find new winners.',
          scope: { kind: 'adset', label: `${items.length} pools below the recommended 4-creative floor`, items },
          solutions: [
            { id: 'top4',    label: 'Add top-4 creatives from library', recommended: true, apply: 'auto',    toolkitTools: ['t_creative_bulk_add'] },
            { id: 'mixed',   label: 'Mix 2 winners + 2 fresh variants',                    apply: 'auto',    toolkitTools: ['t_creative_bulk_add', 't_variant_gen'] },
            { id: 'pick',    label: 'Manually pick from library',                          apply: 'toolkit', toolkitTools: ['t_creative_bulk_add'] },
            { id: 'skip',    label: 'Keep current pool',                                   apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Creative health · 创意洞察看板 =====
      t_creative_insights: () => {
        const items = [
          { id: 'pat_hook_face', label: 'Hooks with on-camera person', meta: '+22% CTR vs library average · 18 winning creatives' },
          { id: 'pat_caption',   label: 'Bold captions in first 1.5s', meta: '+14% VTR · 9 of top-10 use this pattern' },
          { id: 'pat_3prod',     label: '3-product montage opener',     meta: '−9% CTR · low-performing pattern, recommend pause' },
          { id: 'pat_voiceover', label: 'Static voiceover, no music',   meta: '−12% completion · drop from rotation' },
        ];
        return {
          id: 'iss_creative_insights', severity: 'info',
          title: 'Creative insights ready · 4 patterns identified',
          summary: 'AI analyzed 7-day performance across your active creatives and clustered them by hook / visual / caption pattern. Two patterns are clear winners; two are dragging averages down.',
          scope: { kind: 'creative', label: '4 patterns from 47 creatives analyzed', items },
          solutions: [
            { id: 'expand_winners', label: 'Spawn variants based on top patterns', recommended: true, apply: 'auto',    toolkitTools: ['t_creative_insights', 't_variant_gen'] },
            { id: 'pause_losers',   label: 'Pause creatives matching losing patterns',               apply: 'auto',    toolkitTools: ['t_creative_insights'] },
            { id: 'open_dashboard', label: 'Open insights dashboard for full report',                apply: 'toolkit', toolkitTools: ['t_creative_insights'] },
            { id: 'skip',           label: 'Skip — review later',                                    apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Review & compliance · Smart fix（自动修复拒审）=====
      t_smart_fix: () => {
        const rejected = DATA.filter(r => r.subType === 'rejected').slice(0, 5);
        const items = rejected.length ? rejected.map(c => ({
          id: c.id,
          label: c.name,
          meta: `${c.rejectReason || 'Restricted claim'} · rejected ${c.rejectedAt || '2 days ago'}`,
        })) : [
          { id: 'mock_r1', label: 'Summer Sale - Lookalike US', meta: 'Restricted claim · "guaranteed results"' },
          { id: 'mock_r2', label: 'Wellness 30% off',           meta: 'Health & wellness policy · before/after imagery' },
          { id: 'mock_r3', label: 'Fall Drop · v3',             meta: 'Trademark conflict · brand mention' },
        ];
        return {
          id: 'iss_smart_fix', severity: 'warn',
          title: `${items.length} campaigns rejected — Smart fix can rewrite & resubmit`,
          summary: 'Smart fix maps each rejection reason to the offending segment (text claim, image frame, audience segment) and proposes a compliant rewrite. Auto-resubmit triggers a re-review within 60 minutes.',
          scope: { kind: 'campaign', label: `${items.length} rejected campaigns`, items },
          solutions: [
            { id: 'auto_all',    label: 'Auto-rewrite & resubmit all', recommended: true, apply: 'auto',    toolkitTools: ['t_smart_fix'] },
            { id: 'auto_text',   label: 'Auto-rewrite text claims only',                  apply: 'auto',    toolkitTools: ['t_smart_fix'] },
            { id: 'review_each', label: 'Review each fix before resubmit',                apply: 'toolkit', toolkitTools: ['t_smart_fix', 't_view_rejection'] },
            { id: 'appeal',      label: 'File appeal instead of fixing',                  apply: 'toolkit', toolkitTools: ['t_view_rejection'] },
          ],
        };
      },

      // ===== Review & compliance · 查看拒审信息 =====
      t_view_rejection: () => {
        const rejected = DATA.filter(r => r.subType === 'rejected').slice(0, 6);
        const items = rejected.length ? rejected.map(c => ({
          id: c.id,
          label: c.name,
          meta: `${c.rejectReason || 'Restricted claim'} · policy ${c.policyId || 'AD-301'}`,
        })) : [
          { id: 'mock_r1', label: 'Summer Sale - Lookalike US',  meta: 'Policy AD-301 · restricted claim' },
          { id: 'mock_r2', label: 'Wellness 30% off',            meta: 'Policy WL-204 · before/after imagery' },
        ];
        return {
          id: 'iss_view_rejection', severity: 'info',
          title: `${items.length} rejected campaigns · view full reasons`,
          summary: 'Open the rejection viewer to inspect the exact policy clause cited, the matched segment within your ad, and the appeal entry point. No changes are applied — this is a read-only audit.',
          scope: { kind: 'campaign', label: `${items.length} rejection records`, items },
          solutions: [
            { id: 'open_each',  label: 'Open detailed view for each rejection', recommended: true, apply: 'toolkit', toolkitTools: ['t_view_rejection'] },
            { id: 'export_csv', label: 'Export rejections as CSV for legal review',                apply: 'auto',    toolkitTools: ['t_view_rejection'] },
            { id: 'auto_fix',   label: 'Hand off to Smart fix',                                   apply: 'toolkit', toolkitTools: ['t_smart_fix'] },
          ],
        };
      },

      // ===== Reservation contracts · 查找进度落后计划 =====
      t_find_lagging: () => {
        const tvCampaigns = DATA.filter(r => /topview/i.test(r.name)).slice(0, 4);
        const items = tvCampaigns.length ? tvCampaigns.map(c => ({
          id: c.id,
          label: c.name,
          meta: `Pacing ${(c.pacing || 0.62).toFixed(2)} · ${(c.elapsedRatio || 0.55) * 100}% elapsed · ${(c.completion || 0.42) * 100}% delivered`,
        })) : [
          { id: 'tv_a', label: 'TopView · Holiday Hero',  meta: 'Pacing 0.62 · 60% elapsed · 41% delivered' },
          { id: 'tv_b', label: 'TopView · Brand Anthem',  meta: 'Pacing 0.71 · 55% elapsed · 39% delivered' },
          { id: 'tv_c', label: 'TopView · Black Friday',  meta: 'Pacing 0.58 · 70% elapsed · 45% delivered' },
        ];
        return {
          id: 'iss_find_lagging', severity: 'warn',
          title: `${items.length} reservation campaigns at risk of under-delivery`,
          summary: 'These TopView / reservation campaigns have passed half their flight window but are below 60% completion. Without intervention, they risk not fulfilling guaranteed impressions and contract penalties.',
          scope: { kind: 'campaign', label: `${items.length} contracts behind schedule`, items },
          solutions: [
            { id: 'boost_freq', label: 'Increase frequency cap +1/day', recommended: true, apply: 'auto',    toolkitTools: ['t_find_lagging'] },
            { id: 'add_geo',    label: 'Expand to backup geos',                              apply: 'auto',    toolkitTools: ['t_find_lagging', 't_geo_concentrate'] },
            { id: 'reschedule', label: 'Extend flight window by 3 days',                     apply: 'toolkit', toolkitTools: ['t_find_lagging'] },
            { id: 'escalate',   label: 'Escalate to AM (no auto change)',                    apply: 'toolkit', toolkitTools: [] },
          ],
        };
      },

      // ===== Split test results · 预算迁移到胜方 =====
      t_migrate_to_winner: () => {
        const items = [
          { id: 'st_1', label: 'Test A · Hook v1 vs Hook v2',  meta: 'Winner: Hook v2 · ROAS 2.8x vs 1.7x · 95% confidence' },
          { id: 'st_2', label: 'Test B · 30s vs 15s creative', meta: 'Winner: 15s · CTR +34% · 92% confidence' },
          { id: 'st_3', label: 'Test C · LAL 1% vs 3%',         meta: 'Winner: LAL 1% · CPA $11 vs $18 · 90% confidence' },
        ];
        return {
          id: 'iss_migrate_to_winner', severity: 'warn',
          title: `${items.length} split tests reached statistical significance`,
          summary: 'Each test has a clear winner with ≥90% confidence. Continuing to fund the loser is wasted spend. Migrate budget to the winning ad group and free up the loser slot for the next test.',
          scope: { kind: 'adset', label: `${items.length} winning ad groups identified`, items },
          solutions: [
            { id: 'full',    label: 'Migrate 100% of loser budget', recommended: true, apply: 'auto',    toolkitTools: ['t_migrate_to_winner'] },
            { id: 'partial', label: 'Migrate 70% (keep losers running for backup)',     apply: 'auto',    toolkitTools: ['t_migrate_to_winner'] },
            { id: 'review',  label: 'Review each test before migrating',                apply: 'toolkit', toolkitTools: ['t_migrate_to_winner'] },
            { id: 'skip',    label: 'Keep all running (extend test)',                   apply: 'auto',    toolkitTools: [] },
          ],
        };
      },

      // ===== Split test results · 复制获胜组 =====
      t_clone_winner: () => {
        const items = [
          { id: 'sw_1', label: 'Hook v2 (winner of Test A)', meta: 'ROAS 2.8x · ready to scale' },
          { id: 'sw_2', label: '15s creative (winner of Test B)', meta: 'CTR +34% · ready to scale' },
        ];
        return {
          id: 'iss_clone_winner', severity: 'info',
          title: `${items.length} winning ad groups ready to clone & scale`,
          summary: 'Cloning lets you preserve the original winner while spawning expanded variants — broader audiences, larger budgets or LAL expansion. Each clone runs independently for cleaner attribution.',
          scope: { kind: 'adset', label: `${items.length} winners ready to scale`, items },
          solutions: [
            { id: 'clone_lal',    label: 'Clone + expand to 1–3% LAL', recommended: true, apply: 'auto',    toolkitTools: ['t_clone_winner', 't_lal_expand'] },
            { id: 'clone_budget', label: 'Clone + raise budget +50%',                       apply: 'auto',    toolkitTools: ['t_clone_winner'] },
            { id: 'clone_keep',   label: 'Clone with original settings (manual scale)',     apply: 'toolkit', toolkitTools: ['t_clone_winner'] },
            { id: 'skip',         label: 'Skip — keep originals only',                      apply: 'auto',    toolkitTools: [] },
          ],
        };
      },
    };

    // 上限 3 条 issue：用户即便勾选了 4–5 个 tool，也只展示前 3 个，避免左栏过长
    const selected = Array.from(drawerState.toolkit.selected);
    return selected
      .slice(0, 3)
      .map(id => TEMPLATES[id]?.())
      .filter(Boolean);
  }

  // 当前抽屉应使用的 issues 源：
  //   bulk-adapt 模式 → toolkit-driven
  //   其他流程（包括原 Adapt & Confirm 双 phase 视图） → Settings + Linked Assets
  function getActiveIssues() {
    if (drawerState.mode === 'bulk-adapt') return getToolkitIssues();
    return [...getSettingsIssues(), ...getLinkedAssetsIssues()];
  }

  // 取消 Confirm choice 按钮后，"已解决"= 已选中一个 solution；
  // Pixel/Identity 的 existing 方案还需 dropdown 已选具体值才算解决。
  function isIssueResolved(issue) {
    if (!issue || issue.severity === 'ok') return true;
    if (drawerState.issueConfirmed && drawerState.issueConfirmed[issue.id]) return true;
    const chosen = drawerState.issueChoice && drawerState.issueChoice[issue.id];
    if (!chosen) return false;
    if (issue.id === 'iss_required_pixel'    && chosen === 'pixel_existing'    && !drawerState.requiredChoices?.pixel)    return false;
    if (issue.id === 'iss_required_identity' && chosen === 'identity_existing' && !drawerState.requiredChoices?.identity) return false;
    return true;
  }

  function renderIssueListHtml({ title, intro, issues }) {
    const warnCount = issues.filter(i => i.severity !== 'ok').length;
    const okCount   = issues.filter(i => i.severity === 'ok').length;
    const confirmedCount = issues.filter(i => drawerState.issueConfirmed[i.id]).length;
    // 默认选中：上次激活的 issue → 第一个未确认的 → 第一个
    if (!drawerState.activeIssue || !issues.some(i => i.id === drawerState.activeIssue)) {
      const first = issues.find(i => !drawerState.issueConfirmed[i.id]) || issues[0];
      drawerState.activeIssue = first ? first.id : null;
    }
    const activeIssue = issues.find(i => i.id === drawerState.activeIssue);

    const leftItems = issues.map(i => renderIssueLeftItem(i)).join('');
    const rightHtml = activeIssue
      ? renderIssueDetail(activeIssue)
      : '<div class="issue-detail-empty">Select an issue on the left to view its detail.</div>';

    return `
      <div class="adapt-summary">
        <div class="adapt-summary-title">
          ${title}
          ${warnCount > 0 ? `<span class="summary-badge warn">${warnCount} item${warnCount > 1 ? 's' : ''} need your decision</span>` : ''}
          ${confirmedCount > 0 ? `<span class="summary-badge ok">${confirmedCount} confirmed</span>` : ''}
          ${okCount  > 0 ? `<span class="summary-badge ok">${okCount} auto-handled</span>` : ''}
        </div>
        <div class="adapt-summary-text">${intro}</div>
        <div class="issue-split" data-role="issue-list">
          <div class="issue-split-left">
            <div class="issue-split-left-head">Issues (${issues.length})</div>
            <div class="issue-split-left-list">${leftItems}</div>
          </div>
          <div class="issue-split-right">
            <div class="issue-split-right-head">View detail</div>
            <div class="issue-split-right-body" data-role="issue-detail">${rightHtml}</div>
          </div>
        </div>
        ${activeIssue && activeIssue.id === 'iss_ai_creative_resize'
          ? `<div class="issue-feature-section" data-role="issue-feature-section">
               <div class="issue-feature-section-head">
                 <div class="issue-feature-section-title">
                   <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                   <span>Crop preview</span>
                   <span class="issue-feature-section-tag">Linked to · ${activeIssue.title}</span>
                 </div>
                 <div class="issue-feature-section-hint">Adjust framing &amp; ratio · changes apply only to the confirmed solution</div>
               </div>
               ${renderImageResizePanel(activeIssue)}
             </div>`
          : ''}
      </div>
    `;
  }

  // 左侧列表项：标题 + 简要描述 + 状态（已确认/待确认）
  function renderIssueLeftItem(issue) {
    const isActive = drawerState.activeIssue === issue.id;
    const confirmed = isIssueResolved(issue);
    const chosenId = drawerState.issueChoice[issue.id]
      || (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
    const chosen = issue.solutions.find(s => s.id === chosenId);

    const statusIcon = confirmed
      ? `<span class="issue-left-status confirmed" title="Confirmed">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>
        </span>`
      : `<span class="issue-left-status pending" title="Pending"></span>`;

    // 结构化要点：Impact · {kind} / View N items / 已确认时显示已选方案
    const scopeKindLabel = {
      campaign: 'Campaigns', adset: 'Ad groups', ad: 'Ads',
      creative: 'Creatives', catalog: 'Catalogs', audience: 'Audiences', pixel: 'Pixels',
    }[issue.scope.kind] || 'Items';
    const itemCount = issue.scope.items?.length || 0;

    const bullets = [];
    bullets.push(`Impact · ${scopeKindLabel}`);
    if (itemCount > 0) {
      bullets.push(`View ${itemCount} item${itemCount > 1 ? 's' : ''}`);
    }
    if (issue.severity === 'ok' && issue.solutions.length === 0) {
      bullets.push('Auto-handled');
    }

    const subHtml = bullets.length
      ? `<ul class="issue-left-sub">${bullets.map(t => `<li>${t}</li>`).join('')}</ul>`
      : '';

    return `
      <button class="issue-left-item ${isActive ? 'is-active' : ''} ${confirmed ? 'is-confirmed' : ''}"
              data-role="issue-left-item" data-issue="${issue.id}">
        <div class="issue-left-main">
          <div class="issue-left-title">${issue.title}</div>
          ${subHtml}
          ${confirmed && chosen ? `<div class="issue-left-chosen">Chose · ${chosen.label}</div>` : ''}
        </div>
        ${statusIcon}
      </button>
    `;
  }

  // Automatic image resize · 详情面板（issue 内嵌的所见即所得预览）
  // 与 Crop creatives 截图保持功能对齐：左侧素材列、中间裁剪预览、右侧 Preview + spec + 投放位置
  // 但视觉与交互沿用现有抽屉 token（青绿色主色、灰阶边框、图标线条克），不照搬截图布色
  function renderImageResizePanel(issue) {
    const ir = drawerState.imageResize || (drawerState.imageResize = { itemIndex: 0, ratio: 'vertical', gaussianBlur: true, zoom: 100 });
    const items = issue.scope.items || [];
    if (!items.length) return '';
    if (ir.itemIndex >= items.length) ir.itemIndex = 0;
    const active = items[ir.itemIndex];
    // 把 item.id 映射成 META_CREATIVES 中的素材，以拿到稳定的 photoId
    const cv = (typeof META_CREATIVES !== 'undefined' ? META_CREATIVES : []).find(c => c.id === active.id)
      || { photoId: '1607083206968-13611e3d76db', name: active.label };
    const url = (id) => `https://images.unsplash.com/photo-${id}?w=480&h=480&fit=crop&auto=format&q=70`;

    const RATIOS = [
      { id: 'vertical',   label: 'Vertical · 9:16',  spec: '720×1280', cls: 'is-vert'   },
      { id: 'square',     label: 'Square · 1:1',     spec: '1080×1080', cls: 'is-sq'    },
      { id: 'horizontal', label: 'Horizontal · 16:9', spec: '1280×720', cls: 'is-horiz' },
    ];
    // 上方 solution → 下方 ratio 的强约束映射：
    //   auto_916 / auto_dual 都强制定到 9:16（dual 为 9:16 + 1:1，主输出仍是 9:16）；
    //   review_each / skip / 未选 → 跟随用户在面板里的手动 ir.ratio。
    const SOL_TO_RATIO = { auto_916: 'vertical', auto_dual: 'vertical' };
    const chosenSolId = drawerState.issueChoice[issue.id]
      || (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
    const enforcedRatio = SOL_TO_RATIO[chosenSolId] || null;
    const effectiveRatioId = enforcedRatio || ir.ratio;
    const ratio = RATIOS.find(r => r.id === effectiveRatioId) || RATIOS[0];

    // 用 META_CREATIVES 前 6 条做侧边列；不足时拼上 active 自身
    const sidePool = (typeof META_CREATIVES !== 'undefined' ? META_CREATIVES : []).slice(0, 6);
    const sideList = items.length >= 4
      ? items.slice(0, 6)
      : items.map(it => ({ id: it.id })).concat(sidePool.slice(items.length, 6));

    // 侧边缩略：优先用真实 META_CREATIVES.photoId
    const thumbUrl = (entryId) => {
      const m = (typeof META_CREATIVES !== 'undefined' ? META_CREATIVES : []).find(c => c.id === entryId);
      return url(m ? m.photoId : '1607083206968-13611e3d76db');
    };

    const placements = [
      { id: 'tiktok',   label: 'TikTok',      icon: 'M9 3v9.5a3.5 3.5 0 1 1-3.5-3.5H7' },
      { id: 'topview',  label: 'TopView',     icon: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M12 3v9l6 3' },
      { id: 'pangle',   label: 'Pangle',      icon: 'M4 6h16v12H4z M4 10h16' },
    ];

    return `
      <div class="image-resize-panel" data-role="image-resize-panel">
        <div class="irp-toolbar">
          <div class="irp-ratio-select" data-role="ir-ratio" data-issue="${issue.id}">
            ${RATIOS.map(r => `
              <button type="button" class="irp-ratio-chip ${effectiveRatioId === r.id ? 'is-active' : ''}" data-ratio="${r.id}" data-issue="${issue.id}">
                <span class="irp-ratio-icon ${r.cls}"></span>
                ${r.label}
              </button>
            `).join('')}
          </div>
          <label class="irp-blur-toggle">
            <input type="checkbox" data-role="ir-blur" ${ir.gaussianBlur ? 'checked' : ''} />
            <span class="irp-blur-box"></span>
            <span>Fill blank with Gaussian blur</span>
          </label>
        </div>
        <div class="irp-body">
          <div class="irp-side" data-role="ir-side">
            ${sideList.map((it, idx) => `
              <button class="irp-thumb ${idx === ir.itemIndex ? 'is-active' : ''}" data-role="ir-thumb" data-index="${idx}" type="button">
                <img src="${thumbUrl(it.id)}" alt="" loading="lazy" />
              </button>
            `).join('')}
          </div>
          <div class="irp-stage">
            <div class="irp-canvas">
              <div class="irp-checker"></div>
              <div class="irp-frame ${ratio.cls}">
                <img src="${url(cv.photoId)}" alt="${cv.name || ''}" />
                <div class="irp-grid"></div>
              </div>
              <div class="irp-canvas-bar">
                <button type="button" class="irp-btn" data-role="ir-reset" title="Reset framing">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>
                  Reset
                </button>
                <button type="button" class="irp-btn" data-role="ir-zoom-out" title="Zoom out">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/></svg>
                </button>
                <span class="irp-zoom-text">${ir.zoom}%</span>
                <button type="button" class="irp-btn" data-role="ir-zoom-in" title="Zoom in">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6M11 8v6"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="irp-aside">
            <div class="irp-aside-label">Preview</div>
            <div class="irp-preview ${ratio.cls}">
              <img src="${url(cv.photoId)}" alt="" />
            </div>
            <div class="irp-spec">
              <div class="irp-spec-key">Creative spec</div>
              <div class="irp-spec-val">${ratio.spec}</div>
            </div>
            <div class="irp-spec">
              <div class="irp-spec-key">Available placements</div>
              <div class="irp-placements">
                ${placements.map(p => `
                  <span class="irp-placement" title="${p.label}">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${p.icon}"/></svg>
                  </span>
                `).join('')}
              </div>
            </div>
            <div class="irp-counter">${ir.itemIndex + 1} / ${items.length}</div>
          </div>
        </div>
      </div>
    `;
  }

  // ============== Required checks: Pixel / Identity dropdown ==============
  function renderRequiredDropdown(kind, locked) {
    const isPixel = kind === 'pixel';
    const list = isPixel ? TT_PIXELS : TT_IDENTITIES;
    const selectedId = isPixel ? drawerState.requiredChoices?.pixel : drawerState.requiredChoices?.identity;
    const selected = list.find(x => x.id === selectedId) || null;
    const open = !locked && drawerState.requiredDropdownOpen === kind;
    const placeholder = isPixel ? 'Select a TikTok Pixel…' : 'Select a TikTok Identity…';
    const labelTitle = isPixel ? 'Choose a Pixel' : 'Choose an Identity';

    const triggerInner = selected
      ? (isPixel
          ? `<span class="rqd-name">${selected.name}</span>
             <span class="rqd-meta">${selected.status} · ${selected.events}</span>`
          : `<span class="rqd-avatar"><img src="https://images.unsplash.com/photo-${selected.avatar}?w=64&h=64&fit=crop&crop=faces&auto=format&q=80" alt="" /></span>
             <span class="rqd-id-text"><span class="rqd-name">${selected.name}</span><span class="rqd-meta">${selected.type}</span></span>`)
      : `<span class="rqd-placeholder">${placeholder}</span>`;

    const menuHtml = !open ? '' : `
      <div class="rqd-menu" data-rqd-menu="${kind}">
        ${list.map(x => isPixel
          ? `<button class="rqd-option ${selectedId === x.id ? 'is-selected' : ''}" data-role="rqd-pick" data-kind="pixel" data-value="${x.id}">
               <span class="rqd-option-body">
                 <span class="rqd-name">${x.name}</span>
                 <span class="rqd-meta">${x.status} · ${x.events}</span>
               </span>
               ${selectedId === x.id ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#1877f2" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>' : ''}
             </button>`
          : `<button class="rqd-option ${selectedId === x.id ? 'is-selected' : ''}" data-role="rqd-pick" data-kind="identity" data-value="${x.id}">
               <span class="rqd-avatar"><img src="https://images.unsplash.com/photo-${x.avatar}?w=64&h=64&fit=crop&crop=faces&auto=format&q=80" alt="" /></span>
               <span class="rqd-option-body">
                 <span class="rqd-name">${x.name}</span>
                 <span class="rqd-meta">${x.type}</span>
               </span>
               ${selectedId === x.id ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#1877f2" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>' : ''}
             </button>`
        ).join('')}
      </div>
    `;

    return `
      <div class="rqd-wrap ${locked ? 'is-locked' : ''} ${open ? 'is-open' : ''}" data-rqd-kind="${kind}">
        <div class="rqd-label">${labelTitle}</div>
        <button class="rqd-trigger ${selected ? 'has-value' : ''}" data-role="rqd-toggle" data-kind="${kind}" ${locked ? 'disabled' : ''}>
          <span class="rqd-trigger-inner">${triggerInner}</span>
          <svg class="rqd-caret" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        ${menuHtml}
      </div>
    `;
  }

  // 右侧详情面板：完整 issue 信息 + 选项 + Confirm/Edit 按钮
  function renderIssueDetail(issue) {
    // 受影响 items 列表默认收起，点击 toggle 才展开（与紧凑卡片逻辑一致）
    const expanded = drawerState.expandedIssue === issue.id;
    const chosen = drawerState.issueChoice[issue.id]
      || (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
    const confirmed = !!drawerState.issueConfirmed[issue.id];
    const chosenSolution = issue.solutions.find(s => s.id === chosen);

    const sevIcon = issue.severity === 'ok'
      ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
      : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>';

    const scopeKindLabel = {
      campaign: 'Campaigns', adset: 'Ad groups', ad: 'Ads',
      creative: 'Creatives', catalog: 'Catalogs', audience: 'Audiences', pixel: 'Pixels',
    }[issue.scope.kind] || 'Items';

    const itemsHtml = (issue.scope.items || []).map(item => `
      <div class="issue-scope-item">
        <span class="issue-scope-bullet kind-${issue.scope.kind}"></span>
        <div class="issue-scope-item-text">
          <div class="issue-scope-item-name">${item.label}</div>
          <div class="issue-scope-item-meta">
            ${item.campaign ? `<span class="chip chip-outline">${item.campaign}</span>` : ''}
            ${item.meta ? `<span>${item.meta}</span>` : ''}
            <span class="issue-scope-item-id">${item.id}</span>
          </div>
        </div>
      </div>
    `).join('');

    // 判定该 solution 是否需要在下方挂一个 Pixel/Identity dropdown
    const dropdownKindFor = (sId) => {
      if (issue.id === 'iss_required_pixel'    && sId === 'pixel_existing')    return 'pixel';
      if (issue.id === 'iss_required_identity' && sId === 'identity_existing') return 'identity';
      return null;
    };

    const solutionsHtml = issue.solutions.length === 0 ? '' : `
      <div class="issue-solutions">
        <div class="issue-solutions-label">Solutions</div>
        <div class="issue-solutions-list">
          ${issue.solutions.map(s => `
            <button class="issue-solution ${chosen === s.id ? 'is-selected' : ''}"
                    data-issue="${issue.id}" data-solution="${s.id}">
              <span class="issue-solution-radio"></span>
              <span class="issue-solution-text">
                <span class="issue-solution-title">
                  ${s.label}
                  ${s.recommended ? '<span class="issue-tag rec">Proposed</span>' : ''}
                </span>
              </span>
            </button>
            ${dropdownKindFor(s.id) && chosen === s.id
              ? renderRequiredDropdown(dropdownKindFor(s.id), false)
              : ''}
          `).join('')}
        </div>
      </div>
    `;

    return `
      <div class="issue-card severity-${issue.severity} ${expanded ? 'is-expanded' : ''} ${confirmed ? 'is-confirmed' : ''}" data-issue-id="${issue.id}">
        <div class="issue-head">
          <div class="issue-sev-icon">${sevIcon}</div>
          <div class="issue-head-body">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-scope-bar">
              <span class="issue-scope-pill kind-${issue.scope.kind}">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
                Impact · ${scopeKindLabel}
              </span>
              <span class="issue-scope-text">${issue.scope.label}</span>
              ${(issue.scope.items?.length || 0) > 0 ? `
                <button class="issue-scope-toggle" data-role="toggle-issue-detail" data-issue="${issue.id}">
                  ${expanded ? 'Hide details' : `View ${issue.scope.items.length} item${issue.scope.items.length > 1 ? 's' : ''}`}
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${expanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
                </button>` : ''}
            </div>
          </div>
        </div>
        ${expanded && (issue.scope.items?.length || 0) > 0 ? `
          <div class="issue-scope-detail">
            <div class="issue-scope-detail-head">
              <span>${scopeKindLabel} affected by this issue</span>
              <span class="issue-scope-detail-count">${issue.scope.items.length}</span>
            </div>
            <div class="issue-scope-list">${itemsHtml}</div>
          </div>` : ''}
        ${solutionsHtml}
      </div>
    `;
  }

  function renderIssueCard(issue) {
    // 紧凑模式（Phase 1 Structure & Settings 摘要内）继续使用单卡片布局，保持无破坏性
    const expanded = drawerState.expandedIssue === issue.id;
    const chosen = drawerState.issueChoice[issue.id]
      || (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
    const confirmed = !!drawerState.issueConfirmed[issue.id];
    const chosenSolution = issue.solutions.find(s => s.id === chosen);

    const sevIcon = issue.severity === 'ok'
      ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
      : '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>';

    const scopeKindLabel = {
      campaign: 'Campaigns', adset: 'Ad groups', ad: 'Ads',
      creative: 'Creatives', catalog: 'Catalogs', audience: 'Audiences', pixel: 'Pixels',
    }[issue.scope.kind] || 'Items';

    const itemsHtml = (issue.scope.items || []).map(item => `
      <div class="issue-scope-item">
        <span class="issue-scope-bullet kind-${issue.scope.kind}"></span>
        <div class="issue-scope-item-text">
          <div class="issue-scope-item-name">${item.label}</div>
          <div class="issue-scope-item-meta">
            ${item.campaign ? `<span class="chip chip-outline">${item.campaign}</span>` : ''}
            ${item.meta ? `<span>${item.meta}</span>` : ''}
            <span class="issue-scope-item-id">${item.id}</span>
          </div>
        </div>
      </div>
    `).join('');

    const solutionsHtml = issue.solutions.length === 0 ? '' : `
      <div class="issue-solutions">
        <div class="issue-solutions-label">Solutions</div>
        <div class="issue-solutions-list">
          ${issue.solutions.map(s => `
            <button class="issue-solution ${chosen === s.id ? 'is-selected' : ''}" data-issue="${issue.id}" data-solution="${s.id}">
              <span class="issue-solution-radio"></span>
              <span class="issue-solution-text">
                <span class="issue-solution-title">
                  ${s.label}
                  ${s.recommended ? '<span class="issue-tag rec">Proposed</span>' : ''}
                </span>
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    return `
      <div class="issue-card severity-${issue.severity} ${expanded ? 'is-expanded' : ''}" data-issue-id="${issue.id}">
        <div class="issue-head">
          <div class="issue-sev-icon">${sevIcon}</div>
          <div class="issue-head-body">
            <div class="issue-title">${issue.title}</div>
            <div class="issue-scope-bar">
              <span class="issue-scope-pill kind-${issue.scope.kind}">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
                Impact · ${scopeKindLabel}
              </span>
              <span class="issue-scope-text">${issue.scope.label}</span>
              ${(issue.scope.items?.length || 0) > 0 ? `
                <button class="issue-scope-toggle" data-role="toggle-issue-detail" data-issue="${issue.id}">
                  ${expanded ? 'Hide details' : `View ${issue.scope.items.length} item${issue.scope.items.length > 1 ? 's' : ''}`}
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${expanded ? '180' : '0'}deg); transition: transform .2s;"><path d="M6 9l6 6 6-6"/></svg>
                </button>` : ''}
            </div>
          </div>
        </div>
        ${expanded && (issue.scope.items?.length || 0) > 0 ? `
          <div class="issue-scope-detail">
            <div class="issue-scope-detail-head">
              <span>${scopeKindLabel} affected by this issue</span>
              <span class="issue-scope-detail-count">${issue.scope.items.length}</span>
            </div>
            <div class="issue-scope-list">${itemsHtml}</div>
          </div>` : ''}
        ${solutionsHtml}
      </div>
    `;
  }

  function bindIssueCards(inner) {
    inner.querySelectorAll('[data-role="issue-left-item"]').forEach(btn => {
      btn.addEventListener('click', () => {
        drawerState.activeIssue = btn.dataset.issue;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="confirm-issue"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const issueId = btn.dataset.issue;
        // 确认前确保已选中一个 solution（fallback 到推荐）
        const allIssues = getActiveIssues();
        const issue = allIssues.find(i => i.id === issueId);
        if (!issue) return;
        if (!drawerState.issueChoice[issueId]) {
          drawerState.issueChoice[issueId] =
            (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
        }
        drawerState.issueConfirmed[issueId] = true;
        // 自动跳到下一个未确认 issue，加快批量确认体验
        const peerList = getActiveIssues();
        const next = peerList.find(i => !drawerState.issueConfirmed[i.id]);
        if (next) drawerState.activeIssue = next.id;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="edit-issue-confirm"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const issueId = btn.dataset.issue;
        drawerState.issueConfirmed[issueId] = false;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="toggle-issue-detail"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.issue;
        // 兼容两类 issue：linked-assets 默认展开，使用 `collapsed:{id}` 表示用户主动收起；
        // 其他 issue 默认收起，使用 `{id}` 表示用户主动展开
        const allIssues = getActiveIssues();
        const issue = allIssues.find(i => i.id === id);
        const isLinkedAsset = issue && ['creative', 'catalog', 'audience'].includes(issue.scope.kind);
        if (isLinkedAsset) {
          drawerState.expandedIssue = (drawerState.expandedIssue === `collapsed:${id}`) ? null : `collapsed:${id}`;
        } else {
          drawerState.expandedIssue = (drawerState.expandedIssue === id) ? null : id;
        }
        renderDrawer();
      });
    });
    inner.querySelectorAll('.issue-solution').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const issueId = btn.dataset.issue;
        const solId   = btn.dataset.solution;
        drawerState.issueChoice[issueId] = solId;
        // Keep legacy adaptChoice in sync for backward compatibility (used by Step 4 stats)
        if (issueId === 'iss_audience') drawerState.adaptChoice.audience = solId;
        if (issueId === 'iss_pixel')    drawerState.adaptChoice.pixel    = solId;
        if (issueId === 'iss_creative') drawerState.adaptChoice.creative = solId;
        // 选中 solution 即视为已确认（取消 Confirm choice 按钮后自动等价）
        // 例外：Pixel/Identity 的 existing 方案要求再从 dropdown 选具体值，否则保持未确认
        const requiresPick =
          (issueId === 'iss_required_pixel'    && solId === 'pixel_existing'    && !drawerState.requiredChoices?.pixel) ||
          (issueId === 'iss_required_identity' && solId === 'identity_existing' && !drawerState.requiredChoices?.identity);
        drawerState.issueConfirmed[issueId] = !requiresPick;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="open-toolkit-from-issue"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const issueId = btn.dataset.issue;
        // collect tools from chosen solution (or recommended)
        const allIssues = getActiveIssues();
        const issue = allIssues.find(i => i.id === issueId);
        if (!issue) return;
        const chosenId = drawerState.issueChoice[issueId]
          || (issue.solutions.find(s => s.recommended) || issue.solutions[0])?.id;
        const sol = issue.solutions.find(s => s.id === chosenId);
        const tools = (sol && sol.toolkitTools) || [];
        tools.forEach(t => drawerState.toolkit.selected.add(t));
        drawerState.toolkit.scope = {
          type: 'issue',
          issueId,
          label: issue.title,
          itemCount: issue.scope.items?.length || 0,
        };
        drawerState.toolkit.open = true;
        renderDrawer();
      });
    });
    // Automatic image resize 详情面板的内嵌交互
    const irState = () => (drawerState.imageResize || (drawerState.imageResize = { itemIndex: 0, ratio: 'vertical', gaussianBlur: true, zoom: 100 }));
    inner.querySelectorAll('[data-role="ir-thumb"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        irState().itemIndex = Number(btn.dataset.index) || 0;
        renderDrawer();
      });
    });
    inner.querySelectorAll('.irp-ratio-chip[data-ratio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newRatio = btn.dataset.ratio;
        const issueId = btn.dataset.issue;
        irState().ratio = newRatio;
        // 手动改裁切比例 → 上方 solution 自动切到 "Review each creative manually in editor"
        // 仅当该 issue 存在 review_each 选项、且尚未 confirmed 时才回写，避免破坏锁定状态。
        if (issueId && !drawerState.issueConfirmed[issueId]) {
          const allIssues = getActiveIssues();
          const issue = allIssues.find(i => i.id === issueId);
          const hasReviewEach = issue && issue.solutions.some(s => s.id === 'review_each');
          if (hasReviewEach) {
            drawerState.issueChoice[issueId] = 'review_each';
          }
        }
        renderDrawer();
      });
    });
    inner.querySelector('[data-role="ir-blur"]')?.addEventListener('change', (e) => {
      irState().gaussianBlur = !!e.target.checked;
      renderDrawer();
    });
    inner.querySelector('[data-role="ir-zoom-in"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = irState();
      s.zoom = Math.min(200, (s.zoom || 100) + 10);
      renderDrawer();
    });
    inner.querySelector('[data-role="ir-zoom-out"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = irState();
      s.zoom = Math.max(50, (s.zoom || 100) - 10);
      renderDrawer();
    });
    inner.querySelector('[data-role="ir-reset"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = irState();
      s.zoom = 100;
      s.ratio = 'vertical';
      renderDrawer();
    });

    // Required checks Pixel / Identity dropdown 交互
    inner.querySelectorAll('[data-role="rqd-toggle"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.disabled) return;
        const kind = btn.dataset.kind;
        drawerState.requiredDropdownOpen = (drawerState.requiredDropdownOpen === kind) ? null : kind;
        renderDrawer();
      });
    });
    inner.querySelectorAll('[data-role="rqd-pick"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const kind = btn.dataset.kind;
        const value = btn.dataset.value;
        if (!drawerState.requiredChoices) drawerState.requiredChoices = { pixel: null, identity: null };
        drawerState.requiredChoices[kind] = value;
        drawerState.requiredDropdownOpen = null;
        // 同步把对应 issue 标记为已确认（取消 Confirm choice 按钮后自动等价）
        const issueId = kind === 'pixel' ? 'iss_required_pixel' : 'iss_required_identity';
        const solId   = kind === 'pixel' ? 'pixel_existing'     : 'identity_existing';
        drawerState.issueChoice[issueId] = solId;
        drawerState.issueConfirmed[issueId] = true;
        renderDrawer();
      });
    });
  }

  // -------- Step 4 --------
  function renderStep4(inner) {
    const cmpCount = drawerState.selected.campaign.size;
    const cvCount = drawerState.selected.creative.size;
    const catCount = drawerState.selected.catalog.size;
    inner.innerHTML = `
      <div class="section-title">
        Apply your imported assets
        <span class="section-hint">Choose where to send them — picking TikTok ads also auto-archives to Library</span>
      </div>
      <div class="apply-card ${drawerState.apply.tiktok ? 'is-selected' : ''} is-focused" data-role="apply-tiktok" tabindex="0">
        <div class="apply-check">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>
        </div>
        <div class="apply-card-text">
          <div class="apply-card-title">Create TikTok ads <span class="apply-tag">Proposed</span></div>
          <div class="apply-card-desc">Materialize the imported campaigns as TikTok campaigns, ad groups, and ads using your chosen adaptation plan. Live in draft state — review before launching.</div>
          <div class="apply-card-meta">
            <span><strong>${cmpCount}</strong> campaigns</span>
            <span><strong>${cvCount}</strong> creatives</span>
            <span><strong>${catCount}</strong> catalogs</span>
            <span><strong>${drawerState.toolkit.selected.size}</strong> toolkit tweaks</span>
          </div>
        </div>
      </div>
      <div class="apply-card ${drawerState.apply.creatives ? 'is-selected' : ''}" data-role="apply-creatives" tabindex="0">
        <div class="apply-check">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>
        </div>
        <div class="apply-card-text">
          <div class="apply-card-title">Save creatives to Creative library</div>
          <div class="apply-card-desc">Archive imported videos, images and ad copy to your Creative library — reusable for future campaigns and split tests.</div>
          <div class="apply-card-meta">
            <span><strong>${cvCount}</strong> creatives</span>
          </div>
        </div>
      </div>
      <div class="apply-card ${drawerState.apply.catalogs ? 'is-selected' : ''}" data-role="apply-catalogs" tabindex="0">
        <div class="apply-check">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 7"/></svg>
        </div>
        <div class="apply-card-text">
          <div class="apply-card-title">Save catalog to Catalog manager</div>
          <div class="apply-card-desc">Archive imported product feeds and SKU sets to your Catalog manager — keeps inventory and prices in sync for shopping campaigns.</div>
          <div class="apply-card-meta">
            <span><strong>${catCount}</strong> catalogs</span>
          </div>
        </div>
      </div>
    `;
    inner.querySelector('[data-role="apply-tiktok"]').addEventListener('click', () => {
      drawerState.apply.tiktok = !drawerState.apply.tiktok;
      renderDrawer();
    });
    inner.querySelector('[data-role="apply-creatives"]').addEventListener('click', () => {
      drawerState.apply.creatives = !drawerState.apply.creatives;
      renderDrawer();
    });
    inner.querySelector('[data-role="apply-catalogs"]').addEventListener('click', () => {
      drawerState.apply.catalogs = !drawerState.apply.catalogs;
      renderDrawer();
    });
    // 默认把焦点落在 Create TikTok ads 卡片上，便于键盘用户直接回车确认
    requestAnimationFrame(() => {
      const focusTarget = inner.querySelector('[data-role="apply-tiktok"]');
      if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus({ preventScroll: true });
    });
  }

  applyFilter('phase1Midflight');
  initPresetOverflow();

  // AI Summary：View full report 按钮
  const aiReportBtn = document.querySelector('[data-role="ai-view-report"]');
  if (aiReportBtn) {
    aiReportBtn.addEventListener('click', () => {
      // 原型占位：后续可跳转至完整报表页
      aiReportBtn.classList.add('is-clicked');
      setTimeout(() => aiReportBtn.classList.remove('is-clicked'), 180);
    });
  }

  // ============================================================
  // i18n：英 / 中 双语切换
  // 策略：
  //   1. 维护 EN→ZH 字典（精确短语 + 简易模式替换），覆盖 UI 骨架 / Toolkit / Issue / Solution
  //   2. 翻译时遍历可见文本节点 + 关键属性（title / placeholder / aria-label）
  //   3. MutationObserver 监听动态注入的内容（modal / drawer / toolkit / issue 卡片）
  //   4. 只翻译"非数据"内容：跳过广告 / Campaign 名称（含 cp_、Meta -、BF_ 等业务标识）
  //   5. 切换状态写 localStorage，刷新保留
  // ============================================================
  const I18N = (() => {
    const DICT = {
      // === Top nav / sidebar ===
      'Apps': '应用',
      'Search': '搜索',
      'Notifications': '通知',
      'Help': '帮助',
      'Wallet': '钱包',
      'Home': '首页',
      'Campaign': '广告系列',
      'Library': '资源库',
      'Reporting': '数据报表',
      'Assets': '素材',
      'Audience': '受众',
      'Shop': '商店',
      'More': '更多',

      // === Main header / actions ===
      'Campaign List': '广告系列列表',
      'Create': '新建',
      'Import options': '导入选项',
      'Import CSV': '导入 CSV',
      'Bulk import campaigns from spreadsheet': '从表格批量导入广告系列',
      'Import from Meta': '从 Meta 导入',
      'Migrate campaigns & assets from Meta Ads': '从 Meta Ads 迁移广告系列与素材',
      'Details': '详情',
      'Review pending decisions': '审核待定项',

      // === Preset pills ===
      'All': '全部',
      'Rejected campaigns': '被拒广告系列',
      'Opportunities': '优化机会',
      'Black Friday promotions': '黑五大促',
      'TopView Ads': 'TopView 广告',
      'Split list result': '分组测试结果',
      'Meta imported': 'Meta 已导入',
      'Newly imported from Meta Ads': '刚从 Meta Ads 导入',
      'Conversions': '转化',
      'Pacing': '消耗节奏',
      'Winner': '胜出方',
      'Add preset': '添加预设',
      'more': '更多',

      // === Search / filter row ===
      'Name': '名称',
      'Creative': '创意',
      'Search by Name': '按名称搜索',
      'Search by Creative': '按创意搜索',
      'Search & filter (/) | Tips: Metric filters are available in table header': '搜索与筛选（/）| 提示：表头可用指标筛选',
      'Clear': '清空',
      'Columns': '列',
      'Community interaction': '社区互动',
      'Breakdown': '拆分',
      'None': '无',
      'Refresh': '刷新',

      // === AI Summary ===
      'Black Friday Promotions': '黑五大促',
      'Top performing creatives': '表现最佳创意',
      'Best performing products': '表现最佳商品',
      'Impressions': '曝光',
      'views': '次',
      'View full report': '查看完整报表',

      // === Tabs / table ===
      'Campaigns': '广告系列',
      'Ad groups': '广告组',
      'Ads': '广告',
      'On/off': '开 / 关',
      'Status & Action': '状态与操作',
      'Label': '标签',
      'Cost': '消耗',
      'CPM': '千次曝光成本',
      'Clicks': '点击',
      'CTR': '点击率',
      '(destination)': '（落地页）',
      'Total of 106 campaigns': '共 106 个广告系列',
      'You have 101 draft campaigns': '你有 101 个草稿广告系列',

      // === Bulk bar ===
      'selected': '项已选',
      'Deselect all': '取消全选',
      'Toolkit': '工具箱',
      'Use': '使用',
      'Recommended for this view': '该视图推荐',
      'Recommended': '推荐',
      'Proposed for this view': '建议（该视图）',
      'Proposed': '建议',
      'You can edit them still after this process': '该流程结束后仍可继续编辑',
      'Bulk edit budgets, bids and other settings after the import is complete': '导入流程结束后可以批量编辑预算、出价等设置',
      'Importing from Meta…': '正在从 Meta 导入…',
      'Import complete': '导入完成',
      'Import cancelled': '导入已取消',
      'Stay on this screen — you can cancel anytime.': '请保持此页面打开，您可随时取消。',
      'No new campaigns were created. Library archives were rolled back.': '未创建任何新广告系列，资源库归档已回滚。',
      'Validating selection': '校验所选项',
      'Creating TikTok campaigns': '创建 TikTok 广告系列',
      'Materializing ad groups & ads': '生成广告组与广告',
      'Archiving creatives to library': '将创意归档到资源库',
      'Archiving catalogs to library': '将商品目录归档到资源库',
      'overall': '总体进度',
      'Import failed for 1 campaign': '1 个广告系列导入失败',
      'Choose how to handle this failure': '选择如何处理此失败',
      'Skip & continue': '跳过并继续',
      'Mark this campaign as skipped and keep importing the rest. You can fix and retry later.': '将此广告系列标记为跳过并继续导入其它项，稍后可修复后重试。',
      'Cancel the entire import': '取消整个导入流程',
      'Roll back this run. Nothing will be created on TikTok or saved to your library.': '回滚本次操作，不会在 TikTok 上创建任何内容或归档到资源库。',
      'Please select at least one campaign first.': '请先至少选择一个广告系列。',
      'Apply your imported assets': '应用导入的素材',
      'Choose where to send them — picking TikTok ads also auto-archives to Library': '选择投放目标 —— 选中 TikTok 广告会同步归档到资源库',
      'Create TikTok ads': '创建 TikTok 广告',
      'Materialize the imported campaigns as TikTok campaigns, ad groups, and ads using your chosen adaptation plan. Live in draft state — review before launching.': '使用所选适配方案将导入的广告系列实例化为 TikTok 广告系列、广告组与广告，进入草稿状态以便启动前再审。',
      'Save creatives to Creative library': '将创意保存到创意库',
      'Archive imported videos, images and ad copy to your Creative library — reusable for future campaigns and split tests.': '将导入的视频、图片与广告文案归档到创意库 —— 可在后续广告系列与分组测试中复用。',
      'Save catalog to Catalog manager': '将商品目录保存到目录管理器',
      'Archive imported product feeds and SKU sets to your Catalog manager — keeps inventory and prices in sync for shopping campaigns.': '将导入的商品 Feed 与 SKU 集合归档到目录管理器 —— 在购物广告中保持库存与价格同步。',
      'What\'s new': '功能更新',
      'All updates reviewed': '所有更新已确认',
      'I have reviewed': '已确认',
      'Run tool': '运行工具',
      'Acknowledge': '我知道了',
      'Attribution v3 is live': 'Attribution v3 已上线',
      '7-day click + 1-day view is now the default attribution window — please confirm if your ROAS reporting needs to be re-aligned.': '7 天点击 + 1 天浏览已成为默认归因窗口，请确认 ROAS 报表口径是否需重新对齐。',
      'CAPI EMQ threshold raised': 'CAPI EMQ 阈值上调',
      'Event match quality threshold has been raised from 6.0 to 7.0. Run “Improve event match quality” to keep attribution healthy.': '事件匹配质量阈值已从 6.0 提升至 7.0，建议运行「提升事件匹配质量」以维持归因健康度。',
      'AIGC quota refreshed': 'AIGC 额度已刷新',
      'Monthly AI creative generation quota has been reset to 200 — you can batch-produce A/B variants this month.': '本月 AI 创意生成额度已重置为 200 次，可批量生产 A/B 变体。',
      'Quick edits': '快捷编辑',
      'Turn on': '打开',
      'Turn off': '关闭',
      'Bulk edit': '批量编辑',
      'Edit budget': '编辑预算',
      'Edit bid': '编辑出价',
      'Edit name': '编辑名称',
      'Edit PO number': '编辑 PO 号',
      'Add creative': '添加创意',
      'Creative supply': '创意补给',
      'Content suite': '创意中心',
      'Pull from your shared creative library': '从共享创意库选择素材',
      'Upload': '上传',
      'Add new video / image from this device': '从本设备上传新视频或图片',
      'AIGC': 'AIGC',
      'Generate fresh creatives with AI': '由 AI 生成全新创意',
      'Launching AIGC creative generator…': '正在启动 AIGC 创意生成器…',
      'Find & replace': '查找替换',
      'Paste settings': '粘贴设置',
      'Copy settings': '复制设置',
      'Duplicate': '复制',
      'Duplicate selected items into editable drafts': '将所选对象复制为可编辑草稿',
      'More tools': '更多工具',
      'Open the same Adaptation toolkit used in Meta Import': '打开 Meta 导入流程同款优化工具箱',
      'Adaptation toolkit': '优化工具箱',
      'Optimization toolkit': '优化工具箱',

      // === Duplicate wizard ===
      'Duplicate ads': '复制广告',
      'Create editable drafts from the current selection. Differences are shown explicitly below.': '从当前选择创建可编辑的草稿。所有差异都会在下方显式列出。',
      'Create drafts': '创建草稿',
      'Source:': '来源：',
      'Scope & copies': '范围与副本数',
      'Number of copies': '副本数量',
      'Include all child objects (ad groups & ads)': '包含所有下层对象（广告组与广告）',
      'Hierarchy will be preserved exactly. Unchecking this only duplicates the selected level.': '层级关系将完整保留。取消勾选则只复制当前选中层级。',
      'Naming': '命名',
      'Append suffix': '追加后缀',
      'Add prefix': '添加前缀',
      'Custom token': '自定义占位',
      'Token': '占位符',
      'Preview (first 3)': '预览（前 3 条）',
      'Destination': '复制目标',
      'Same account': '同一账户',
      'Another TikTok account': '其它 TikTok 账户',
      'Cross-platform draft': '跨平台草稿',
      'Cross-account / cross-platform duplication: Pixel, Catalog, Tracking URL will be reset and flagged for re-selection.': '跨账户 / 跨平台复制：Pixel、目录、跟踪链接会被重置并提示重新选择。',
      'Linked assets': '关联资产',
      'Creatives': '创意',
      'Videos / images / scripts attached to ads': '广告关联的视频 / 图片 / 文案',
      'Audience': '受众',
      'Custom audiences, lookalikes, exclusions': '自定义受众、相似受众、排除人群',
      'Pixel / event': 'Pixel / 事件',
      'Conversion event source': '转化事件来源',
      'Catalog': '目录',
      'Product feed / catalog binding': '商品 Feed / 目录绑定',
      'Copy': '克隆',
      'Reference': '引用原资源',
      'Drop': '丢弃',
      'Forced reset by cross-boundary policy': '受跨边界策略强制重置',
      'Field handling — what changes': '字段处理 — 改了什么',
      'Field': '字段',
      'Action': '动作',
      'Detail': '详情',
      'Name': '名称',
      'Budget': '预算',
      'Bid strategy': '出价策略',
      'Schedule': '投放时段',
      'Status': '状态',
      'UTM tracking': 'UTM 跟踪',
      'PO number': 'PO 号',
      'Inherit from source': '继承自源对象',
      'Reset to ad group default': '重置为广告组默认值',
      'Reset to "All day" — verify after duplicate': '重置为"全天"— 复制后请核查',
      'Force Paused': '强制暂停',
      'Inherit source (may go live)': '继承源对象（可能直接投放）',
      'Cloned as new asset': '克隆为新资产',
      'Reference original (no copy)': '引用原资产（不克隆）',
      'Dropped — must reselect after duplicate': '已丢弃 — 复制后必须重选',
      'Append &dup_id=<n> for attribution split': '追加 &dup_id=<n>，用于归因切分',
      'Status & safety': '状态与安全',
      'Paused (recommended)': '暂停（推荐）',
      'Inherit source status': '继承源对象状态',
      'Save as Draft (review before going live)': '保存为草稿（投放前请审核）',
      'Inheriting Active status will start spending immediately upon Apply. Review carefully.': '继承"投放中"状态将在确认后立即开始消耗，请谨慎审核。',
      'rewrite': '改写',
      'inherit': '继承',
      'reset': '重置',
      'dropped': '丢弃',

      // === Tab actions ===
      'View report': '查看报表',
      'Export': '导出',

      // === Pagination ===
      '20/page': '20 / 页',
      '50/page': '50 / 页',
      '100/page': '100 / 页',
      '200/page': '200 / 页',

      // === Status / labels ===
      'Active': '投放中',
      'Inactive': '已暂停',
      'Not Delivering': '未投放',
      'Paused by user': '用户暂停',
      'Learning phase': '学习期',
      'Budget limited': '预算受限',
      'Ad rejected': '广告被拒',
      'Creative Fatigue Detected': '检测到创意疲劳',
      'Low Spending': '消耗偏低',
      'Learning Phase': '学习期',
      'Budget Limited': '预算受限',
      'Ad Rejected': '广告被拒',
      'Campaign Paused': '广告系列已暂停',

      // === Toolkit groups & tools ===
      'Recommended tools': '推荐工具',
      'Proposed tools': '建议工具',
      'Quick edits': '快速编辑',
      'Budget & bidding': '预算与出价',
      'Creative health': '创意健康度',
      'Audience tuning': '受众调优',
      'Catalog & product': '目录与商品',
      'Tracking & quality': '跟踪与数据质量',
      'Spend reallocation': '消耗再分配',
      'Bid hygiene': '出价治理',

      // tool names
      'AI resize': 'AI 智能裁剪',
      'AI creative resize': '智能图像裁剪',
      'Automatic image resize': '智能图像裁剪',
      'Boost top ROAS ad groups': '加投高 ROAS 广告组',
      'Cap underperformers': '压制低表现广告组',
      'Pause zero-delivery ads': '暂停零投放广告',
      'Apply smart bid floor': '设置智能出价下限',
      'Cap runaway CPMs': '封顶失控 CPM',
      'Smooth pacing': '平滑消耗节奏',
      'Refresh fatigued creatives': '刷新疲劳创意',
      'Strengthen first 1.5s hook': '强化前 1.5 秒钩子',
      'Add burnt-in captions': '烧录字幕',
      'Pick best thumbnail': '挑选最佳封面',
      'Spawn 3 A/B variants': '生成 3 个 A/B 变体',
      'Exclude recent purchasers': '排除近期购买者',
      'Expand winning lookalikes': '扩展胜出 Lookalike',
      'Re-target warm viewers': '触达高观看用户',
      'Block low-quality placements': '屏蔽低质版位',
      'Concentrate on top regions': '聚焦核心地区',
      'Promote winning SKUs': '加投高表现 SKU',
      'Pause out-of-stock products': '暂停缺货商品',
      'Refresh price & sale tags': '刷新价格与促销标签',
      'Deduplicate SKU variants': '去重 SKU 变体',
      'Improve event match quality': '提升事件匹配质量',
      'Deduplicate Pixel + CAPI': '去重 Pixel 与 CAPI',
      'Align attribution windows': '统一归因窗口',
      'Audit funnel coverage': '审计漏斗覆盖',
      // === Newly added tools (preset-specific recommendations) ===
      'Upgrade to Smart+ mode': '一键升级 Smart+ 模式',
      'Bulk adjust settings': '批量调整设置',
      'Bulk supplement creatives': '创意批量补充',
      'Creative insights': '创意洞察',
      'Smart fix': 'Smart 修复',
      'View rejection reason': '查看拒审信息',
      'Find lagging schedules': '查找进度落后计划',
      'Migrate budget to winner': '预算迁移到获胜组',
      'Clone winning ad group': '复制获胜组',
      'Review & compliance': '审核与合规',
      'Reservation contracts': '合约广告',
      'Split test results': '分组测试结果',

      // === Modals ===
      'Add creatives': '添加创意',
      'Find & replace creative': '查找替换创意',
      'Copy ad settings': '复制广告设置',
      'Copied!': '已复制！',
      'Cannot paste to this ad': '无法粘贴到此广告',
      'Apply': '应用',
      'Cancel': '取消',
      'Save': '保存',
      'Done': '完成',
      'Close': '关闭',
      'Auto detect': '自动识别',
      'Face': '人脸',
      'Product': '商品',
      'Text overlay': '文字浮层',

      // === Issue drawer ===
      'Settings adaptation': '设置适配',
      'Linked assets review': '关联素材检查',
      'Structure & Settings': '结构与设置',
      'Linked assets': '关联素材',
      'Hierarchy + per-level configurations': '层级与各层级配置',
      'Creatives, products, audience': '创意 · 商品 · 受众',
      'Lookalike audiences are not directly portable': 'Lookalike 受众无法直接迁移',
      'Tracking events need bridging': '跟踪事件需打通',
      'Creative aspect ratio mismatch': '创意比例不匹配',
      'Budget & bid strategy mapped': '预算与出价策略已映射',
      'Creatives use copyrighted music': '创意使用了版权音乐',
      'Catalog field mapping required': '需要做目录字段映射',
      'Custom Audiences ready to sync': '自定义受众可直接同步',
      'Warm video viewers not being retargeted': '高观看用户未被再营销',
      'Long-tail regions diluting spend': '长尾地区稀释消耗',
      'Stale price & sale tags': '价格与促销标签陈旧',
      'Duplicate SKU variants competing in the same ad set': '同一广告组内 SKU 变体重复竞价',
      'Funnel coverage gaps detected': '检测到漏斗覆盖缺口',

      // === Solution-level common phrases ===
      'spend': '消耗',
      'combined spend': '合计消耗',
      'budget': '预算',
      'auction': '竞价',
      'ad group': '广告组',
      'ad groups': '广告组',
      'campaign': '广告系列',
      'campaigns': '广告系列',
      'creatives': '创意',
      'creative': '创意',
      'View': '查看',
      'items': '项',
      'item': '项',
      'Impact': '影响',
    };

    // 模式替换（处理动态拼接的句子，如 "3 ad groups qualify..."）
    const PATTERNS = [
      { re: /^(\d+)\s+selected$/, fn: (m) => `已选 ${m[1]} 项` },
      { re: /^View\s+(\d+)\s+items?$/, fn: (m) => `查看 ${m[1]} 项` },
      { re: /^View\s+(\d+)\s+more$/, fn: (m) => `再查看 ${m[1]} 项` },
      { re: /^(\d+)\s+ad groups?\s+qualify(.*)$/, fn: (m) => `${m[1]} 个广告组符合条件${m[2] || ''}` },
      { re: /^(\d+)\s+fatigued\s+ads?$/, fn: (m) => `${m[1]} 个疲劳广告` },
      { re: /^(\d+)\s+ad groups?\s+exceed CPA target$/, fn: (m) => `${m[1]} 个广告组超过 CPA 目标` },
      { re: /^(\d+)\s+ad groups?\s+bidding above account median$/, fn: (m) => `${m[1]} 个广告组出价高于账号中位数` },
      { re: /^Refresh\s+(\d+)\s+fatigued ads?$/, fn: (m) => `刷新 ${m[1]} 个疲劳广告` },
      { re: /^Combined spend\s+\$([\d,]+)$/, fn: (m) => `合计消耗 $${m[1]}` },
      { re: /^combined spend\s+\$([\d,]+)$/, fn: (m) => `合计消耗 $${m[1]}` },
      { re: /^combined waste\s+\$([\d,]+)$/, fn: (m) => `合计浪费 $${m[1]}` },
      { re: /^Total of\s+(\d+)\s+campaigns$/, fn: (m) => `共 ${m[1]} 个广告系列` },
      { re: /^You have\s+(\d+)\s+draft campaigns$/, fn: (m) => `你有 ${m[1]} 个草稿广告系列` },
      { re: /^\((\d+)\)$/, fn: (m) => `（${m[1]}）` },
      { re: /^Conversions:\s*(.+)$/, fn: (m) => `转化：${m[1]}` },
      { re: /^Pacing:\s*(.+)$/, fn: (m) => `消耗节奏：${m[1]}` },
      { re: /^Winner:\s*(.+)$/, fn: (m) => `胜出：${m[1]}` },
      { re: /^\+(\d+)\s+more$/, fn: (m) => `+${m[1]} 项` },
    ];

    // 跳过翻译的 selectors（数据 / 业务标识）
    const SKIP_SELECTORS = [
      '.lang-toggle', 'script', 'style', 'svg', 'input', 'textarea',
      '[data-no-i18n]',
      '.account-select span',     // upstream.land
      '[data-role="bulk-count"]',
      '[data-role="ai-imp-value"]',
      '[data-role="ai-conv-value"]',
    ];

    function shouldSkip(node) {
      let p = node.parentElement;
      while (p) {
        if (p.matches && SKIP_SELECTORS.some(s => { try { return p.matches(s); } catch (e) { return false; } })) return true;
        // 跳过编辑器
        if (p.isContentEditable) return true;
        p = p.parentElement;
      }
      return false;
    }

    // 业务标识：包含这些片段的字符串视作"数据"，整体不翻译
    const PRESERVE_RE = /(BF_|Meta - |TopView_|cr_\d|cp_[a-z0-9]+|cmp_[a-z0-9_]+|act_\d+|p_\d+|cv_m_|cat_m_|@\w|\.com|http|\d{4}×\d{4})/i;

    function translateText(text, lang) {
      if (lang !== 'zh') return text;
      const trimmed = text.trim();
      if (!trimmed) return text;
      if (PRESERVE_RE.test(trimmed)) return text;

      // 完整匹配
      if (DICT[trimmed]) {
        return text.replace(trimmed, DICT[trimmed]);
      }

      // 模式匹配
      for (const p of PATTERNS) {
        const m = trimmed.match(p.re);
        if (m) return text.replace(trimmed, p.fn(m));
      }

      // 短句（≤60 字符且包含字母）：尝试逐词替换字典里的高频词
      if (trimmed.length <= 80 && /[A-Za-z]/.test(trimmed)) {
        let out = trimmed;
        // 按 key 长度倒序，避免 "ad" 提前替换 "ad group"
        const keys = Object.keys(DICT).sort((a, b) => b.length - a.length);
        for (const k of keys) {
          if (k.length < 3) continue;
          // 仅替换全词
          const safe = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(`(?<![\\w-])${safe}(?![\\w-])`, 'g');
          out = out.replace(re, DICT[k]);
        }
        if (out !== trimmed) {
          return text.replace(trimmed, out);
        }
      }

      return text;
    }

    function translateAttr(el, attr, lang) {
      if (!el.hasAttribute(attr)) return;
      if (!el.dataset.i18nOrig_ ) el.dataset.i18nOrig_ = '1';
      const origKey = `i18nOrig${attr.charAt(0).toUpperCase() + attr.slice(1)}`;
      if (lang === 'en') {
        if (el.dataset[origKey] != null) {
          el.setAttribute(attr, el.dataset[origKey]);
        }
        return;
      }
      const cur = el.getAttribute(attr);
      if (el.dataset[origKey] == null) el.dataset[origKey] = cur;
      const orig = el.dataset[origKey];
      const translated = translateText(orig, lang);
      if (translated !== cur) el.setAttribute(attr, translated);
    }

    function walkAndTranslate(root, lang) {
      // 文本节点
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(node => {
        if (!node.__i18nOrig) node.__i18nOrig = node.nodeValue;
        const src = node.__i18nOrig;
        const next = lang === 'en' ? src : translateText(src, lang);
        // 只在真正变化时写回，避免触发不必要的 characterData mutation
        if (node.nodeValue !== next) node.nodeValue = next;
      });

      // 属性
      const attrEls = root.querySelectorAll('[title], [placeholder], [aria-label]');
      attrEls.forEach(el => {
        if (el.closest('.lang-toggle')) return;
        ['title', 'placeholder', 'aria-label'].forEach(a => translateAttr(el, a, lang));
      });
    }

    let currentLang = localStorage.getItem('app_lang') || 'en';
    let observer = null;

    // 用一个独立工具函数包装"翻译期间暂停 observer"，
    // 避免 walkAndTranslate 修改 nodeValue 又被 MutationObserver 回调触发 → 死循环卡死主线程
    function translateSafely(root, lang) {
      const wasObserving = !!observer;
      if (wasObserving) observer.disconnect();
      try {
        walkAndTranslate(root, lang);
      } catch (e) {
        // 忽略异常，但保证 observer 一定能恢复
        // eslint-disable-next-line no-console
        console && console.warn && console.warn('[i18n] translate failed:', e);
      } finally {
        if (wasObserving) {
          // 丢弃翻译期间累积的 mutation 记录，再重新 observe
          observer.takeRecords();
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
      }
    }

    function applyLang(lang) {
      currentLang = lang;
      localStorage.setItem('app_lang', lang);
      document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      translateSafely(document.body, lang);
      // 高亮按钮
      document.querySelectorAll('.lang-toggle .lang-opt').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
    }

    function startObserver() {
      if (observer) return;
      // 简易 throttle：把短时间内的 mutation 合并成一次翻译
      let pending = false;
      let pendingRoots = new Set();
      const flush = () => {
        pending = false;
        if (currentLang === 'en') { pendingRoots.clear(); return; }
        const roots = pendingRoots;
        pendingRoots = new Set();
        if (roots.size === 0) return;
        observer.disconnect();
        try {
          roots.forEach(r => {
            if (!r.isConnected) return; // 节点已被移除，跳过
            try { walkAndTranslate(r, currentLang); } catch (e) {}
          });
        } finally {
          observer.takeRecords();
          observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
      };
      observer = new MutationObserver((mutations) => {
        if (currentLang === 'en') return;
        mutations.forEach(m => {
          if (m.type === 'childList') {
            m.addedNodes.forEach(node => {
              if (node.nodeType === 1) pendingRoots.add(node);
              else if (node.nodeType === 3 && node.parentElement) pendingRoots.add(node.parentElement);
            });
          } else if (m.type === 'characterData' && m.target.parentElement) {
            pendingRoots.add(m.target.parentElement);
          }
        });
        if (!pending && pendingRoots.size > 0) {
          pending = true;
          // requestAnimationFrame 保证在下一帧统一处理，避免连续触发
          requestAnimationFrame(flush);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // 绑定切换按钮
    document.querySelectorAll('.lang-toggle .lang-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang);
      });
    });

    // 初始化
    startObserver();
    applyLang(currentLang);

    return { applyLang, translateText };
  })();
})();
