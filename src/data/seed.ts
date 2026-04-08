import { hash } from "bcryptjs";
import { subDays, subMonths } from "date-fns";
import { prisma } from "../lib/prisma";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const keywordSeed = [
  ["dentist mountain view", "general", 1300, 42, 3],
  ["dentist near me", "general", 5400, 58, 2],
  ["teeth whitening mountain view", "cosmetic", 880, 39, 4],
  ["emergency dentist mountain view", "emergency", 720, 46, 5],
  ["family dentist mountain view", "general", 590, 33, 3],
  ["cosmetic dentist mountain view", "cosmetic", 680, 49, 7],
  ["root canal mountain view", "endodontics", 390, 35, 6],
  ["dental implants mountain view", "implants", 810, 52, 8],
  ["invisalign mountain view", "orthodontics", 960, 44, 4],
  ["pediatric dentist mountain view", "pediatric", 730, 41, 9],
  ["same day crowns mountain view", "restorative", 170, 28, 6],
  ["emergency dental care near me", "emergency", 1600, 51, 7],
  ["best dentist mountain view ca", "brand", 320, 31, 2],
  ["dental cleanings mountain view", "preventive", 260, 24, 5],
  ["tooth extraction mountain view", "oral surgery", 480, 38, 8],
  ["veneers mountain view", "cosmetic", 430, 36, 10],
  ["dental exam mountain view", "preventive", 150, 21, 6],
  ["affordable dentist mountain view", "general", 340, 37, 11],
  ["dentist open saturday mountain view", "general", 210, 28, 4],
  ["sleep apnea dentist mountain view", "specialty", 120, 25, 9],
  ["gum disease treatment mountain view", "periodontics", 190, 34, 12],
  ["dental bridge mountain view", "restorative", 170, 32, 13],
  ["dental bonding mountain view", "cosmetic", 110, 27, 14],
  ["sedation dentistry mountain view", "specialty", 200, 29, 8],
  ["wisdom teeth removal mountain view", "oral surgery", 410, 40, 12],
  ["broken tooth repair mountain view", "emergency", 140, 26, 7],
  ["kids dentist mountain view", "pediatric", 260, 30, 10],
  ["deep cleaning dentist mountain view", "periodontics", 210, 29, 9],
  ["dental x rays mountain view", "preventive", 90, 18, 5],
  ["night guard dentist mountain view", "specialty", 130, 22, 11],
  ["cavity filling mountain view", "restorative", 150, 24, 6],
  ["toothache relief mountain view", "emergency", 230, 31, 8],
  ["mouth guard dentist mountain view", "specialty", 90, 18, 13],
  ["dental office mountain view", "general", 300, 29, 3],
  ["smile makeover mountain view", "cosmetic", 190, 33, 11],
  ["dental implants near me", "implants", 2900, 56, 15],
  ["clear aligners mountain view", "orthodontics", 240, 35, 8],
  ["teeth cleaning near me", "preventive", 1600, 41, 5],
  ["tooth colored fillings mountain view", "restorative", 95, 19, 9],
  ["porcelain crowns mountain view", "restorative", 120, 27, 12],
  ["oral cancer screening mountain view", "preventive", 70, 16, 6],
  ["tmj treatment mountain view", "specialty", 260, 37, 14],
  ["dental emergency near mountain view", "emergency", 170, 30, 7],
  ["teeth whitening near me", "cosmetic", 2200, 48, 10],
  ["mountain view cosmetic dentistry", "cosmetic", 150, 26, 9],
  ["dentist accepting new patients mountain view", "general", 180, 28, 4],
  ["emergency root canal mountain view", "endodontics", 80, 23, 11],
  ["dental consultation mountain view", "general", 100, 20, 6],
  ["family dental office mountain view", "general", 120, 23, 5],
  ["dental implant consultation mountain view", "implants", 90, 24, 13],
] as const;

const fieldSeed = [
  ["business_name", "Business name", "optimized", "Mountain View Dental Care", undefined, "high", "basic"],
  ["primary_category", "Primary category", "optimized", "Dentist", undefined, "high", "basic"],
  ["secondary_categories", "Secondary categories", "needs_attention", "Cosmetic Dentist, Pediatric Dentist", "Add Emergency Dental Service for broader intent coverage.", "high", "optimization"],
  ["description", "Business description", "optimized", "Comprehensive family and cosmetic dentistry in Mountain View.", undefined, "high", "content"],
  ["short_description", "Short description", "complete", "Modern dental care with same-week appointments.", undefined, "medium", "content"],
  ["hours", "Business hours", "complete", "Mon-Fri 8am-6pm, Sat 9am-1pm", undefined, "high", "basic"],
  ["special_hours", "Holiday hours", "missing", null, "Add upcoming holiday schedule to avoid customer confusion.", "medium", "trust"],
  ["phone", "Phone number", "optimized", "(650) 555-0148", undefined, "high", "basic"],
  ["website", "Website", "optimized", "https://mountainviewdentalcare.com", undefined, "high", "basic"],
  ["appointment_link", "Appointment link", "complete", "https://mountainviewdentalcare.com/book", undefined, "high", "conversion"],
  ["services", "Services", "needs_attention", "Cleanings, Whitening, Invisalign, Implants", "Expand service list with emergency care and pediatric dentistry.", "high", "optimization"],
  ["products", "Products", "missing", null, "Add Invisalign and whitening product highlights.", "medium", "conversion"],
  ["photos", "Photo gallery", "needs_attention", "28 published photos", "Upload updated team, operatory, and before/after images.", "high", "engagement"],
  ["logo", "Logo", "complete", "Uploaded", undefined, "medium", "branding"],
  ["cover_photo", "Cover photo", "complete", "Uploaded", undefined, "medium", "branding"],
  ["attributes", "Attributes", "needs_attention", "Wheelchair accessible, Women-led", "Add LGBTQ+ friendly and accepts new patients attributes.", "medium", "trust"],
] as const;

const directories = [
  "Google Business Profile",
  "Yelp",
  "Yellow Pages",
  "Bing Places",
  "Apple Maps",
  "BBB",
  "Healthgrades",
  "Vitals",
  "Zocdoc",
  "MapQuest",
  "Foursquare",
  "Facebook",
  "Nextdoor",
  "CareDash",
  "Dental Insider",
  "WebMD Care",
  "Manta",
  "Chamber of Commerce",
  "MerchantCircle",
  "Hotfrog",
  "Brownbook",
  "Superpages",
  "Tripadvisor",
  "Alignable",
  "Citysearch",
  "Local.com",
  "USCity",
  "EZlocal",
  "eLocal",
  "Patch",
  "Cylex",
  "ShowMeLocal",
  "N49",
  "Tupalo",
  "Trustpilot",
  "Mapcarta",
  "DentalPlans",
  "Doctor.com",
  "Sharecare",
  "Wellness.com",
  "RateMDs",
  "DexKnows",
  "Dental Departures",
  "Opencare",
  "Birdeye",
  "NearMe",
  "LocalStack",
  "Guide.in.ua",
  "Whitepages",
  "Thumbtack",
];

const competitorSeed = [
  { name: "Castro Street Family Dentistry", address: "650 Castro St, Mountain View, CA 94041", placeId: "ChIJzz111mountainviewdent1", rating: 4.7, reviewCount: 214, website: "https://castrostreetdentistry.com", phone: "(650) 555-0112" },
  { name: "Shoreline Dental Group", address: "150 Shoreline Blvd, Mountain View, CA 94043", placeId: "ChIJzz222mountainviewdent2", rating: 4.5, reviewCount: 168, website: "https://shorelinedentalgroup.com", phone: "(650) 555-0182" },
  { name: "Palo Alto Smile Studio", address: "221 University Ave, Palo Alto, CA 94301", placeId: "ChIJzz333mountainviewdent3", rating: 4.8, reviewCount: 291, website: "https://palosmilesstudio.com", phone: "(650) 555-0129" },
  { name: "Los Altos Modern Dentistry", address: "342 Main St, Los Altos, CA 94022", placeId: "ChIJzz444mountainviewdent4", rating: 4.6, reviewCount: 186, website: "https://losaltosmoderndentistry.com", phone: "(650) 555-0175" },
  { name: "Sunnyvale Dental Loft", address: "109 Murphy Ave, Sunnyvale, CA 94086", placeId: "ChIJzz555mountainviewdent5", rating: 4.4, reviewCount: 143, website: "https://sunnyvaledentalloft.com", phone: "(408) 555-0147" },
] as const;

const aiInsights = [
  { priority: "high", category: "gmb", title: "Add emergency dental secondary category", description: "Search visibility is strongest for urgent care queries, but the profile is missing Emergency Dental Service as a supporting category.", impact: "Could improve local pack coverage for high-intent same-day searches.", actionUrl: "/gmb", status: "open" },
  { priority: "high", category: "reviews", title: "Unanswered low-rating reviews need response", description: "Four negative reviews from the last 45 days remain unreplied, increasing churn risk and lowering trust signals.", impact: "Responding quickly can improve conversion rate from profile views.", actionUrl: "/notifications", status: "open" },
  { priority: "medium", category: "posts", title: "Publish more treatment-focused updates", description: "Post cadence dropped in the last month. Cosmetic and Invisalign-related posts outperform general announcements.", impact: "Higher engagement and improved branded search CTR.", actionUrl: "/gmb", status: "open" },
  { priority: "medium", category: "keywords", title: "Teeth whitening terms trending upward", description: "Rank gains across whitening keywords suggest opportunity to expand service page content and post frequency.", impact: "Potential new-patient growth for cosmetic services.", actionUrl: "/keywords", status: "open" },
  { priority: "medium", category: "citations", title: "Citations show inconsistent website URLs", description: "Seven directories still reference an outdated booking landing page instead of the main domain.", impact: "Cleaning up NAP+W consistency should improve trust and crawlability.", actionUrl: "/citations", status: "open" },
  { priority: "low", category: "profile", title: "Photo gallery freshness declining", description: "Most recent profile photo was uploaded 42 days ago. Competitors are adding weekly office and team imagery.", impact: "Fresh photos typically lift profile engagement.", actionUrl: "/gmb", status: "open" },
  { priority: "low", category: "reports", title: "Monthly executive report generated", description: "March local visibility report is ready to share with stakeholders.", impact: "Keeps account reporting cadence on track.", actionUrl: "/reports", status: "resolved" },
  { priority: "high", category: "qa", title: "Popular insurance question unanswered", description: "The Q&A thread about Delta Dental coverage has accumulated views but still lacks an official answer.", impact: "Answering can remove purchase friction for insurance-driven leads.", actionUrl: "/gmb", status: "open" },
] as const;

export async function seedDatabase() {
  await prisma.$transaction([
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.organizationMember.deleteMany(),
    prisma.gMBField.deleteMany(),
    prisma.gMBProfile.deleteMany(),
    prisma.rankHistory.deleteMany(),
    prisma.visibilityScore.deleteMany(),
    prisma.review.deleteMany(),
    prisma.post.deleteMany(),
    prisma.qA.deleteMany(),
    prisma.citation.deleteMany(),
    prisma.competitorRanking.deleteMany(),
    prisma.competitor.deleteMany(),
    prisma.aIInsight.deleteMany(),
    prisma.report.deleteMany(),
    prisma.auditResult.deleteMany(),
    prisma.keyword.deleteMany(),
    prisma.location.deleteMany(),
    prisma.organization.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const password = await hash("demo123", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@localseo.com",
      name: "Demo Admin",
      password,
      role: "admin",
    },
  });

  const organization = await prisma.organization.create({ data: { name: "Mountain View Dental Care", plan: "professional" } });
  await prisma.organizationMember.create({ data: { userId: user.id, organizationId: organization.id, role: "owner" } });

  const location = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Mountain View Dental Care",
      address: "850 Castro Street, Suite 210",
      city: "Mountain View",
      state: "CA",
      zip: "94041",
      country: "US",
      phone: "(650) 555-0148",
      website: "https://mountainviewdentalcare.com",
      category: "Dentist",
      subcategories: "Cosmetic Dentist, Emergency Dental Service, Pediatric Dentist, Dental Implants Provider",
      latitude: 37.3861,
      longitude: -122.0839,
      placeId: "ChIJm9k7m4W3j4AR8Kp9Vx-demo",
    },
  });

  const profile = await prisma.gMBProfile.create({
    data: {
      locationId: location.id,
      completionScore: 72,
      businessName: "Mountain View Dental Care",
      description: "Mountain View Dental Care helps Silicon Valley families stay healthy with preventive cleanings, cosmetic dentistry, Invisalign, implants, and same-day emergency visits.",
      shortDescription: "Modern family dentistry with same-week appointments.",
      categories: "Dentist, Cosmetic Dentist, Pediatric Dentist",
      hours: JSON.stringify({ monday: "08:00-18:00", tuesday: "08:00-18:00", wednesday: "08:00-18:00", thursday: "08:00-18:00", friday: "08:00-17:00", saturday: "09:00-13:00", sunday: "closed" }),
      specialHours: JSON.stringify({ memorialDay: "closed", july4: "closed" }),
      phoneNumber: "(650) 555-0148",
      website: "https://mountainviewdentalcare.com",
      address: "850 Castro Street, Suite 210, Mountain View, CA 94041",
      serviceArea: "Mountain View, Los Altos, Palo Alto, Sunnyvale",
      attributes: "Wheelchair accessible, Women-led, Accepts new patients",
      menuUrl: "https://mountainviewdentalcare.com/services",
      bookingUrl: "https://mountainviewdentalcare.com/book",
      products: "Invisalign, custom whitening trays, night guards",
      services: "Preventive care, cosmetic dentistry, emergency dental care, implants, Invisalign, pediatric dentistry",
      photoCount: 32,
      coverPhotoUrl: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80",
      logoUrl: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=400&q=80",
      verificationStatus: "verified",
      lastSynced: subDays(new Date(), 1),
    },
  });

  await prisma.gMBField.createMany({
    data: fieldSeed.map(([fieldName, fieldLabel, status, currentValue, suggestion, impact, category]) => ({
      profileId: profile.id,
      fieldName,
      fieldLabel,
      status,
      currentValue,
      suggestion,
      impact,
      category,
    })),
  });

  const historyRows: { keywordId: string; locationId: string; position: number; localPack: boolean; featured: boolean; url: string; date: Date }[] = [];

  for (const [index, [keyword, category, searchVolume, difficulty, baseRank]] of keywordSeed.entries()) {
    const monthlyPositions = Array.from({ length: 12 }, (_, offset) => clamp(baseRank + (12 - offset) + ((index % 5) - 2), 1, 28));
    const dailyPositions = Array.from({ length: 30 }, (_, offset) => {
      const day = 29 - offset;
      const movement = Math.round(Math.sin((day + index) / 4) * 2);
      return clamp(baseRank + movement - Math.floor((29 - day) / 9), 1, 24);
    });
    const allPositions = [...monthlyPositions, ...dailyPositions];
    const currentRank = dailyPositions[dailyPositions.length - 1];
    const bestRank = Math.min(...allPositions);
    const inLocalPack = currentRank <= 3 || (currentRank <= 5 && index % 3 === 0);

    const createdKeyword = await prisma.keyword.create({
      data: {
        locationId: location.id,
        keyword,
        category,
        searchVolume,
        difficulty,
        currentRank,
        bestRank,
        inLocalPack,
        tags: [category, currentRank <= 5 ? "winner" : "tracked", searchVolume > 1000 ? "high-volume" : "local"].join(", "),
      },
    });

    monthlyPositions.forEach((position, offset) => {
      historyRows.push({
        keywordId: createdKeyword.id,
        locationId: location.id,
        position,
        localPack: position <= 3,
        featured: index % 11 === 0 && offset % 4 === 0,
        url: `https://mountainviewdentalcare.com/services/${keyword.replace(/\s+/g, "-")}`,
        date: subMonths(new Date(), 12 - offset),
      });
    });

    dailyPositions.forEach((position, offset) => {
      historyRows.push({
        keywordId: createdKeyword.id,
        locationId: location.id,
        position,
        localPack: position <= 3 || (position <= 5 && index % 4 === 0),
        featured: index % 9 === 0 && offset % 10 === 0,
        url: `https://mountainviewdentalcare.com/services/${keyword.replace(/\s+/g, "-")}`,
        date: subDays(new Date(), 29 - offset),
      });
    });
  }

  await prisma.rankHistory.createMany({ data: historyRows });

  await prisma.visibilityScore.createMany({
    data: Array.from({ length: 12 }, (_, index) => {
      const monthOffset = 11 - index;
      const organic = 46 + index * 1.9;
      const localPack = 52 + index * 1.4;
      return {
        locationId: location.id,
        organic: Number(organic.toFixed(1)),
        localPack: Number(localPack.toFixed(1)),
        overall: Number(((organic + localPack) / 2).toFixed(1)),
        date: subMonths(new Date(), monthOffset),
      };
    }),
  });

  const reviewerNames = [
    "Priya Nair", "Marcus Reed", "Hannah Kim", "Jordan Alvarez", "Sophia Patel", "Emily Chen", "Derek Lewis", "Olivia Brooks", "Noah Foster", "Ava Thompson",
    "Liam Park", "Isabella Gomez", "Mason Turner", "Mia Rivera", "Ethan Ross", "Charlotte Nguyen", "Benjamin Flores", "Amelia Grant", "Lucas Perry", "Ella Murphy",
    "Daniel Ward", "Harper Simmons", "Jackson Ortiz", "Luna Hughes", "Logan Bennett", "Grace Coleman", "Henry Sanders", "Victoria Price", "Samuel Bailey", "Zoe Hughes",
    "Nathan Brooks", "Scarlett Long", "Julian Price", "Layla Cooper", "David Kim", "Nora Wallace", "Sebastian West", "Aria Morales", "Levi Russell", "Madison Bell",
    "Owen Jenkins", "Camila Diaz", "Wyatt Cooper", "Stella James", "Leo Armstrong",
  ];

  const positiveReviewTexts = [
    "The team made my cleaning painless and explained everything clearly. Booking was fast and the office feels modern.",
    "I came in for Invisalign and left feeling confident about the treatment plan. Great technology and even better bedside manner.",
    "Dr. Patel took time to show me x-rays and answered every question. Best dental visit I've had in years.",
    "Super friendly front desk, on-time appointment, and my whitening results were fantastic.",
    "I needed a same-day crown before a work trip and they handled it seamlessly.",
    "Our whole family switched here. They are wonderful with kids and never make appointments feel rushed.",
    "The hygienist was gentle, thorough, and gave me practical tips I can actually follow.",
    "Emergency visit for a cracked molar and they got me in within an hour. Professional from start to finish.",
    "The office is spotless and the staff is genuinely warm. Highly recommend for anyone nervous about the dentist.",
    "Implant consultation was detailed and reassuring. I felt informed instead of pressured.",
  ];
  const neutralReviewTexts = [
    "Good experience overall. The visit ran a little behind but the care was solid and the staff was nice.",
    "The cleaning was fine and the team was professional. Parking was the only hassle.",
    "I appreciated the thorough exam, though I wish I had received the treatment estimate sooner.",
    "Office was clean and the dentist was knowledgeable. Appointment confirmation texts were helpful.",
    "Not the cheapest option, but the quality of care seems good so far.",
  ];
  const negativeReviewTexts = [
    "I waited longer than expected and the front desk communication could have been better.",
    "The visit felt rushed and I had to follow up twice for my treatment plan details.",
    "I was disappointed that my emergency appointment had to be rescheduled later in the day.",
    "Friendly team, but billing explanation was confusing and took time to sort out.",
    "The procedure went okay, though I expected more post-visit instructions.",
  ];

  await prisma.review.createMany({
    data: reviewerNames.map((authorName, index) => {
      const rating = index < 22 ? 5 : index < 33 ? 4 : index < 38 ? 3 : index < 42 ? 2 : 1;
      const sentiment = rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative";
      const textPool = rating >= 4 ? positiveReviewTexts : rating === 3 ? neutralReviewTexts : negativeReviewTexts;
      const replied = rating >= 4 ? index % 3 === 0 : index % 2 === 0;
      return {
        locationId: location.id,
        externalId: `google-review-${index + 1}`,
        authorName,
        authorImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
        rating,
        text: textPool[index % textPool.length],
        publishedAt: subDays(new Date(), index * 7),
        replied,
        replyText: replied
          ? rating >= 4
            ? `Thank you, ${authorName.split(" ")[0]}! We are grateful you chose Mountain View Dental Care and appreciate the thoughtful review.`
            : `Thank you for the honest feedback, ${authorName.split(" ")[0]}. Our office manager will follow up to address the concerns you raised.`
          : null,
        repliedAt: replied ? subDays(new Date(), Math.max(index * 7 - 2, 0)) : null,
        sentiment,
        sentimentScore: rating >= 4 ? 0.84 : rating === 3 ? 0.18 : -0.61,
        aiDraft: rating <= 3 ? `Hi ${authorName.split(" ")[0]}, thank you for the feedback. We are reviewing your experience with our care team and would appreciate the chance to make it right.` : index % 4 === 0 ? `Thank you ${authorName.split(" ")[0]} for trusting our team with your smile. We look forward to seeing you again soon.` : null,
        flagged: rating <= 2,
        source: "google",
      };
    }),
  });

  await prisma.post.createMany({
    data: [
      { locationId: location.id, type: "update", title: "Now booking same-week cleanings", content: "We opened additional hygiene appointments this month for new and returning patients in Mountain View.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/book", status: "published", publishedAt: subDays(new Date(), 7), views: 312, clicks: 41, reactions: 18 },
      { locationId: location.id, type: "offer", title: "Complimentary Invisalign consultation", content: "Thinking about straightening your smile? Schedule a complimentary Invisalign consultation this month.", ctaType: "learn_more", ctaUrl: "https://mountainviewdentalcare.com/invisalign", offerCode: "SMILESTART", status: "published", publishedAt: subDays(new Date(), 21), views: 428, clicks: 66, reactions: 24 },
      { locationId: location.id, type: "event", title: "Free dental health day", content: "Join us for a community oral health day with free screenings, hygiene kits, and kid-friendly education stations.", ctaType: "sign_up", ctaUrl: "https://mountainviewdentalcare.com/events/oral-health-day", eventStart: subDays(new Date(), 45), eventEnd: subDays(new Date(), 45), status: "published", publishedAt: subDays(new Date(), 58), views: 267, clicks: 39, reactions: 16 },
      { locationId: location.id, type: "update", title: "Saturday pediatric appointments added", content: "Busy school week? We now offer select Saturday morning appointments for pediatric cleanings and exams.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/book", status: "published", publishedAt: subDays(new Date(), 73), views: 245, clicks: 33, reactions: 14 },
      { locationId: location.id, type: "offer", title: "Professional whitening package", content: "Refresh your smile ahead of wedding season with in-office whitening and custom touch-up trays.", ctaType: "call", ctaUrl: "tel:+16505550148", offerCode: "BRIGHT25", status: "published", publishedAt: subDays(new Date(), 94), views: 361, clicks: 47, reactions: 20 },
      { locationId: location.id, type: "update", title: "Meet Dr. Aisha Patel", content: "Our lead dentist combines digital dentistry with a calm, patient-first approach for families across Mountain View.", ctaType: "learn_more", ctaUrl: "https://mountainviewdentalcare.com/team", status: "published", publishedAt: subDays(new Date(), 128), views: 214, clicks: 28, reactions: 17 },
      { locationId: location.id, type: "event", title: "Smile makeover consultations week", content: "Reserve a limited consultation slot to review veneers, whitening, and bite alignment options.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/book", eventStart: subDays(new Date(), 10), eventEnd: addDays(new Date(), 6), status: "scheduled", scheduledAt: addDays(new Date(), 3) },
      { locationId: location.id, type: "offer", title: "Back-to-school cleaning special", content: "Family hygiene appointments available before school starts. Ask about fluoride and sealant bundles.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/book", offerCode: "SCHOOLREADY", status: "scheduled", scheduledAt: addDays(new Date(), 9) },
      { locationId: location.id, type: "update", title: "Digital scanners now in every operatory", content: "We replaced messy traditional impressions with fast digital scans for crowns, retainers, and aligners.", ctaType: "learn_more", ctaUrl: "https://mountainviewdentalcare.com/technology", status: "draft" },
      { locationId: location.id, type: "offer", title: "New patient exam and x-rays", content: "Planning your first visit? Ask about our bundled exam, digital x-rays, and treatment roadmap package.", ctaType: "call", ctaUrl: "tel:+16505550148", status: "draft" },
      { locationId: location.id, type: "update", title: "Same-day emergency workflow", content: "Our team reserved dedicated chair time for toothaches, chipped teeth, and urgent restorative needs.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/emergency-dentist", status: "published", publishedAt: subDays(new Date(), 152), views: 297, clicks: 43, reactions: 15 },
      { locationId: location.id, type: "event", title: "Oral cancer screening awareness month", content: "Book a preventive checkup during awareness month and ask about oral cancer screenings.", ctaType: "book", ctaUrl: "https://mountainviewdentalcare.com/preventive-dentistry", status: "published", publishedAt: subDays(new Date(), 187), views: 175, clicks: 22, reactions: 9 },
    ],
  });

  await prisma.qA.createMany({
    data: [
      { locationId: location.id, question: "Do you accept Delta Dental PPO?", askedBy: "Maria S.", answer: "Yes. We are in-network with Delta Dental PPO and can also help estimate out-of-network benefits for many other plans.", answeredBy: "Mountain View Dental Care", upvotes: 14, status: "answered", askedAt: subDays(new Date(), 120), answeredAt: subDays(new Date(), 118) },
      { locationId: location.id, question: "Can I book a same-day emergency appointment for tooth pain?", askedBy: "Chris M.", answer: "Yes. Call the office as early as possible and we will do our best to reserve same-day time for urgent cases.", answeredBy: "Mountain View Dental Care", upvotes: 11, status: "answered", askedAt: subDays(new Date(), 98), answeredAt: subDays(new Date(), 97) },
      { locationId: location.id, question: "Do you treat children?", askedBy: "Rina P.", answer: "Absolutely. We provide kid-friendly cleanings, exams, fluoride, and sealants for families.", answeredBy: "Mountain View Dental Care", upvotes: 9, status: "answered", askedAt: subDays(new Date(), 85), answeredAt: subDays(new Date(), 83) },
      { locationId: location.id, question: "Do you offer Invisalign consultations?", askedBy: "Aiden L.", answer: "Yes. We offer complimentary Invisalign consultations with a digital scan and treatment roadmap.", answeredBy: "Mountain View Dental Care", upvotes: 13, status: "answered", askedAt: subDays(new Date(), 76), answeredAt: subDays(new Date(), 74) },
      { locationId: location.id, question: "Is parking available near the office?", askedBy: "Holly T.", answer: "There is a public garage one block away on Bryant Street plus short-term street parking nearby.", answeredBy: "Mountain View Dental Care", upvotes: 5, status: "answered", askedAt: subDays(new Date(), 64), answeredAt: subDays(new Date(), 63) },
      { locationId: location.id, question: "Can I finance implant treatment?", askedBy: "Jason K.", answer: "Yes. We offer phased treatment plans and third-party financing options for implants and larger restorative cases.", answeredBy: "Mountain View Dental Care", upvotes: 8, status: "answered", askedAt: subDays(new Date(), 57), answeredAt: subDays(new Date(), 54) },
      { locationId: location.id, question: "Do you have Saturday appointments?", askedBy: "Meghan R.", answer: "Yes. Select Saturday morning appointments are available for hygiene and pediatric visits.", answeredBy: "Mountain View Dental Care", upvotes: 7, status: "answered", askedAt: subDays(new Date(), 49), answeredAt: subDays(new Date(), 47) },
      { locationId: location.id, question: "How often should I whiten my teeth?", askedBy: "Omar D.", aiDraft: "Whitening frequency depends on your enamel health and lifestyle. Most patients benefit from professional whitening touch-ups once or twice per year.", upvotes: 4, status: "ai_drafted", askedAt: subDays(new Date(), 41) },
      { locationId: location.id, question: "Do you see patients who are nervous about dental work?", askedBy: "Jessica A.", answer: "Yes. We schedule extra time, explain each step, and can discuss sedation options for anxious patients.", answeredBy: "Mountain View Dental Care", upvotes: 10, status: "answered", askedAt: subDays(new Date(), 36), answeredAt: subDays(new Date(), 34) },
      { locationId: location.id, question: "Do you offer payment plans for cosmetic dentistry?", askedBy: "Trevor G.", aiDraft: "We offer staged treatment planning and can walk you through financing options during your cosmetic consultation.", upvotes: 3, status: "ai_drafted", askedAt: subDays(new Date(), 29) },
      { locationId: location.id, question: "Can you replace old silver fillings?", askedBy: "Danielle P.", answer: "Yes. We replace older restorations with tooth-colored fillings and evaluate whether crowns are needed for larger teeth.", answeredBy: "Mountain View Dental Care", upvotes: 6, status: "answered", askedAt: subDays(new Date(), 25), answeredAt: subDays(new Date(), 23) },
      { locationId: location.id, question: "What should I do if my crown falls out over the weekend?", askedBy: "Greg S.", aiDraft: "Keep the crown safe, avoid chewing on that side, and call us first thing. If you are in pain, contact our emergency line for guidance.", upvotes: 12, status: "ai_drafted", askedAt: subDays(new Date(), 18) },
      { locationId: location.id, question: "Do you treat gum disease?", askedBy: "Lena F.", answer: "Yes. We provide periodontal maintenance, deep cleanings, and referral coordination for advanced cases.", answeredBy: "Mountain View Dental Care", upvotes: 5, status: "answered", askedAt: subDays(new Date(), 16), answeredAt: subDays(new Date(), 14) },
      { locationId: location.id, question: "Are evening appointments available for working professionals?", askedBy: "Karan B.", upvotes: 2, status: "unanswered", askedAt: subDays(new Date(), 9) },
      { locationId: location.id, question: "Do you offer custom sports mouthguards?", askedBy: "Natalie C.", upvotes: 1, status: "unanswered", askedAt: subDays(new Date(), 4) },
    ],
  });

  await prisma.citation.createMany({
    data: directories.map((directory, index) => {
      const listed = index !== 24 && index !== 37;
      const nameMatch = listed && index % 9 !== 0;
      const addressMatch = listed && index % 7 !== 0;
      const phoneMatch = listed && index % 11 !== 0;
      const websiteMatch = listed && index % 6 !== 0;
      const accuracy = Math.round(([nameMatch, addressMatch, phoneMatch, websiteMatch].filter(Boolean).length / 4) * 100);
      const slug = directory.toLowerCase().replace(/[^a-z0-9]+/g, "");
      return {
        locationId: location.id,
        directory,
        directoryUrl: `https://${slug}.com`,
        listingUrl: listed ? `https://${slug}.com/mountain-view-dental-care` : null,
        nameMatch,
        addressMatch,
        phoneMatch,
        websiteMatch,
        listed,
        accuracy,
        lastChecked: subDays(new Date(), index + 1),
      };
    }),
  });

  for (const [index, competitor] of competitorSeed.entries()) {
    const createdCompetitor = await prisma.competitor.create({
      data: {
        locationId: location.id,
        name: competitor.name,
        address: competitor.address,
        placeId: competitor.placeId,
        rating: competitor.rating,
        reviewCount: competitor.reviewCount,
        gmbUrl: `https://maps.google.com/?cid=${competitor.placeId}`,
        website: competitor.website,
        phone: competitor.phone,
      },
    });

    await prisma.competitorRanking.createMany({
      data: keywordSeed.slice(index * 8, index * 8 + 8).map(([keyword], rankingIndex) => ({
        competitorId: createdCompetitor.id,
        keyword,
        position: clamp(2 + rankingIndex + index, 1, 20),
        localPack: rankingIndex < 3,
        date: subDays(new Date(), rankingIndex * 4 + index),
      })),
    });
  }

  await prisma.aIInsight.createMany({
    data: aiInsights.map((insight, index) => ({
      locationId: location.id,
      priority: insight.priority,
      category: insight.category,
      title: insight.title,
      description: insight.description,
      impact: insight.impact,
      actionUrl: insight.actionUrl,
      status: insight.status,
      createdAt: subDays(new Date(), index * 6 + 2),
      resolvedAt: insight.status === "resolved" ? subDays(new Date(), index + 1) : null,
    })),
  });

  const notificationSeed: [string, string, string, boolean, string][] = [
    ["review", "New 5-star review received", "Priya Nair left a glowing review about her Invisalign consultation.", false, "/notifications"],
    ["review", "Low-rating review requires response", "A 2-star review mentions front desk delays and needs attention.", false, "/notifications"],
    ["ranking", "Keyword moved into top 3", "dentist mountain view climbed to position 3 in the local pack.", false, "/keywords"],
    ["ranking", "Visibility score improved", "Overall visibility improved 4.1 points month over month.", true, "/dashboard"],
    ["gmb", "Profile sync completed", "Google Business Profile data synced successfully last night.", true, "/gmb"],
    ["post", "Scheduled post ready", "Smile makeover consultations week post is scheduled for Friday.", false, "/gmb"],
    ["citation", "Citation mismatch detected", "Healthgrades is still pointing to an outdated landing page.", false, "/citations"],
    ["report", "Monthly report available", "March Local SEO Performance report is ready to view.", true, "/reports"],
    ["qa", "New Q&A question", "A prospective patient asked about evening appointments.", false, "/gmb"],
    ["audit", "Fresh audit complete", "Local visibility audit finished with an overall score of 82.", true, "/dashboard"],
    ["review", "AI reply draft generated", "A response draft is ready for the review from Leo Armstrong.", false, "/notifications"],
    ["post", "Post performance strong", "The whitening package offer generated 47 clicks this month.", true, "/reports"],
    ["ranking", "Keyword slipped", "dental implants near me dropped three positions this week.", false, "/keywords"],
    ["gmb", "Photos need refresh", "No new gallery photos have been uploaded in 42 days.", false, "/gmb"],
    ["team", "New organization member joined", "Marketing coordinator access was granted for reporting review.", true, "/settings"],
    ["report", "Quarterly report export finished", "Q1 board-ready PDF is available for download.", true, "/reports"],
    ["citation", "Directory listing missing", "Thumbtack listing is not currently published.", false, "/citations"],
    ["qa", "Insurance question trending", "The Delta Dental coverage question is getting above-average views.", false, "/gmb"],
    ["system", "Seed reset completed", "Demo workspace data was refreshed successfully.", true, "/dashboard"],
    ["review", "Patient reply posted", "A response was published to the review from Derek Lewis.", true, "/notifications"],
  ];

  await prisma.notification.createMany({
    data: notificationSeed.map(([type, title, message, read, actionUrl], index) => ({
      userId: user.id,
      locationId: location.id,
      type,
      title,
      message,
      read,
      actionUrl,
      data: JSON.stringify({ severity: read ? "info" : "attention", sequence: index + 1 }),
      createdAt: subDays(new Date(), index),
    })),
  });

  await prisma.report.createMany({
    data: [
      { locationId: location.id, title: "February Local SEO Performance", type: "monthly", dateFrom: subMonths(new Date(), 2), dateTo: subMonths(new Date(), 1), data: JSON.stringify({ visibility: 61.2, leads: 84, reviews: 4, topKeywords: ["dentist mountain view", "teeth whitening mountain view"] }), fileUrl: "https://mountainviewdentalcare.com/reports/february-local-seo.pdf", status: "generated", createdAt: subDays(new Date(), 39) },
      { locationId: location.id, title: "March Local SEO Performance", type: "monthly", dateFrom: subMonths(new Date(), 1), dateTo: new Date(), data: JSON.stringify({ visibility: 65.8, leads: 96, reviews: 6, topKeywords: ["dentist near me", "family dentist mountain view"] }), fileUrl: "https://mountainviewdentalcare.com/reports/march-local-seo.pdf", status: "generated", createdAt: subDays(new Date(), 8) },
    ],
  });

  await prisma.auditResult.createMany({
    data: [
      { locationId: location.id, overallScore: 78, gmbScore: 74, citationScore: 72, reviewScore: 81, keywordScore: 79, onPageScore: 84, details: JSON.stringify({ summary: "Strong foundation with room to improve category coverage, citation consistency, and review response rate." }), createdAt: subDays(new Date(), 32) },
      { locationId: location.id, overallScore: 82, gmbScore: 80, citationScore: 75, reviewScore: 84, keywordScore: 83, onPageScore: 86, details: JSON.stringify({ summary: "Profile optimization and ranking improvements drove measurable gains across local-pack visibility." }), createdAt: subDays(new Date(), 3) },
    ],
  });

  return {
    user: user.email,
    organization: organization.name,
    location: location.name,
    keywords: keywordSeed.length,
    reviews: reviewerNames.length,
    citations: directories.length,
    competitors: competitorSeed.length,
  };
}
