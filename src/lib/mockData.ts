import { Category, Project, Settings } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-design",
    name: "디자인",
    slug: "design",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-editing",
    name: "영상 편집",
    slug: "editing",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-sns-content",
    name: "SNS 콘텐츠",
    slug: "sns-content",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat-branding",
    name: "브랜딩",
    slug: "branding",
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: Settings = {
  site_title: "NEXUS Creative Team",
  site_description: "디자인과 영상 편집을 통해 브랜드의 가치를 높이는 크리에이티브 파트너",
  hero_title: "We Shape Ideas Into Impactful Visual Stories.",
  hero_subtitle: "넥서스는 경계를 넘나드는 크리에이티브로 브랜드의 핵심 가치를 시각화합니다.",
  contact_email: "contact@nexuscreative.com",
  instagram_url: "https://instagram.com/nexus_creative",
  behance_url: "https://behance.net/nexus_creative",
  updated_at: new Date().toISOString(),
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "현대 모빌리티 브랜드 리브랜딩",
    slug: "hyundai-mobility-rebranding",
    category_id: "cat-branding",
    client_name: "Hyundai Mobility",
    year: 2025,
    role: "Brand Identity Design & Guidelines",
    description: "현대 모빌리티의 미래 지향적인 가치를 담기 위해 미니멀하면서도 하이테크적인 타이포그래피와 유기적인 그리드 시스템을 기반으로 리브랜딩을 진행하였습니다. 새로운 로고마크와 아이코닉한 네이비-네온 블루 컬러 에셋을 개발하여 오프라인 스테이셔너리부터 디지털 인터페이스까지 일관된 유저 경험을 설계했습니다.",
    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    media_urls: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200",
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=1200",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200"
    ],
    video_url: "",
    is_published: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "글로벌 패션 테크 기업 2026 브랜드 필름",
    slug: "fashion-tech-brand-film-2026",
    category_id: "cat-editing",
    client_name: "AURA Fashion Tech",
    year: 2026,
    role: "Video Editing & Color Grading",
    description: "가상 의류 피팅 플랫폼 AURA의 2026 런칭 브랜드 필름입니다. 3D 의상 시뮬레이션 소스와 실제 모델 촬영본을 정교하게 매치 컷하여 가상과 현실이 연결되는 연출을 극대화했습니다. 강렬한 비트의 사운드트랙에 맞춘 속도감 있는 트랜지션과 모던한 색보정(Cyberpunk Teal & Amber)으로 역동적인 무드를 완성했습니다.",
    thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200",
    media_urls: [
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200"
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube Embed Example
    is_published: true,
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "친환경 에코 라이프스타일 패키지 디자인",
    slug: "eco-lifestyle-package-design",
    category_id: "cat-design",
    client_name: "Greenery Lab",
    year: 2025,
    role: "Package & Editorial Design",
    description: "지속 가능한 환경을 지향하는 뷰티 & 홈 데코 브랜드 Greenery Lab의 친환경 패키지 디자인 프로젝트입니다. 재활용 펄프지와 콩기름 인쇄를 기준으로 하여 자연 그대로의 거칠고 포근한 질감을 살렸으며, 타이포그래피 위주의 심플한 라벨 디자인으로 불필요한 가공을 줄였습니다.",
    thumbnail_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200",
    media_urls: [
      "https://images.unsplash.com/photo-1605263133935-96f33c89b495?q=80&w=1200",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"
    ],
    video_url: "",
    is_published: true,
    is_featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "신선식품 커머스 'FRESCO' 인스타그램 캠페인",
    slug: "fresco-instagram-campaign",
    category_id: "cat-sns-content",
    client_name: "Fresco Corporation",
    year: 2026,
    role: "Art Direction & Social Content Creation",
    description: "MZ세대를 타겟으로 한 식재료 큐레이션 서비스 FRESCO의 SNS 비주얼 가이드를 수립했습니다. 볼드한 네온 컬러 매치와 유머러스한 일러스트 팝업을 활용하여 스크롤을 멈추게 하는 크리에이티브를 개발했습니다. 한 달간의 캠페인 결과, 브랜드 오피셜 인스타그램 계정의 도달율이 전월 대비 140% 향상되었습니다.",
    thumbnail_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200",
    media_urls: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1200"
    ],
    video_url: "",
    is_published: true,
    is_featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
